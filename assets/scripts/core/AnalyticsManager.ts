import { sys } from 'cc';
import { PlatformAdapter } from '../platform/PlatformAdapter';

export type AnalyticsValue = string | number | boolean;
export type AnalyticsPayload = Record<string, AnalyticsValue>;

interface DiagnosticEvent {
    timestamp: number;
    name: string;
    data: Record<string, string | number>;
}

const DIAGNOSTICS_KEY = 'mole_strike_diagnostics_v1';
const MAX_DIAGNOSTIC_EVENTS = 20;

/** 统一事件与错误采集。失败时仅降级，不允许影响游戏主流程。 */
export class AnalyticsManager {
    private static initialized = false;
    private static sessionId = '';

    public static initialize(): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;
        this.sessionId = this.createSessionId();
        PlatformAdapter.registerErrorHandlers((kind, message) => {
            this.track('runtime_error', { kind, message });
        });
        this.track('game_launch', {
            platform: PlatformAdapter.getPlatformType(),
            version: '0.1.0',
        });
    }

    public static track(name: string, payload: AnalyticsPayload = {}): void {
        try {
            const eventName = this.normalizeName(name);
            const data = this.normalizePayload({
                ...payload,
                session_id: this.sessionId || 'not_initialized',
            });
            this.storeDiagnostic({
                timestamp: Date.now(),
                name: eventName,
                data,
            });
            PlatformAdapter.reportAnalytics(eventName, data);
        } catch {
            // 埋点与诊断绝不能中断玩法。
        }
    }

    public static getRecentDiagnostics(): DiagnosticEvent[] {
        try {
            const rawValue = sys.localStorage.getItem(DIAGNOSTICS_KEY);
            if (!rawValue) {
                return [];
            }
            const events = JSON.parse(rawValue) as DiagnosticEvent[];
            return Array.isArray(events) ? events.slice(-MAX_DIAGNOSTIC_EVENTS) : [];
        } catch {
            return [];
        }
    }

    private static storeDiagnostic(event: DiagnosticEvent): void {
        const events = [...this.getRecentDiagnostics(), event].slice(-MAX_DIAGNOSTIC_EVENTS);
        sys.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(events));
    }

    private static normalizePayload(payload: AnalyticsPayload): Record<string, string | number> {
        const normalized: Record<string, string | number> = {};
        const entries = Object.keys(payload).slice(0, 20);
        for (const key of entries) {
            const safeKey = this.normalizeName(key);
            const value = payload[key];
            if (typeof value === 'number') {
                normalized[safeKey] = Number.isFinite(value) ? value : 0;
            } else if (typeof value === 'boolean') {
                normalized[safeKey] = value ? 1 : 0;
            } else {
                normalized[safeKey] = value.slice(0, 160);
            }
        }
        return normalized;
    }

    private static normalizeName(name: string): string {
        const safeName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 40);
        return safeName || 'unknown_event';
    }

    private static createSessionId(): string {
        const timePart = Date.now().toString(36);
        const randomPart = Math.floor(Math.random() * 0x1000000).toString(36);
        return `${timePart}_${randomPart}`;
    }
}
