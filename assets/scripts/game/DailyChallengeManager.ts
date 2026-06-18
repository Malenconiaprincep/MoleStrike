import {
    DailyChallengeKind,
    DailyChallengeSnapshot,
    DailyChallengeState,
    RoundStats,
} from '../core/GameTypes';
import { StorageManager } from '../core/StorageManager';

interface DailyChallengeDefinition {
    kind: DailyChallengeKind;
    title: string;
    target: number;
}

export interface DailyChallengeUpdate {
    snapshot: DailyChallengeSnapshot;
    justCompleted: boolean;
}

/** 每日挑战规则与结算，按本地自然日轮换且离线可用。 */
export class DailyChallengeManager {
    public static getSnapshot(now = new Date()): DailyChallengeSnapshot {
        const dateKey = this.getDateKey(now);
        const definition = this.getDefinition(now);
        const savedState = StorageManager.getDailyChallengeState();
        const state = savedState?.dateKey === dateKey
            ? savedState
            : this.createState(dateKey);

        if (savedState?.dateKey !== dateKey) {
            StorageManager.saveDailyChallengeState(state);
        }

        return this.toSnapshot(state, definition);
    }

    public static recordRound(stats: RoundStats, now = new Date()): DailyChallengeUpdate {
        const snapshot = this.getSnapshot(now);
        const previousCompleted = snapshot.completed;
        const roundProgress = this.getRoundProgress(snapshot.kind, stats);
        const progress = snapshot.kind === 'score'
            ? Math.max(snapshot.progress, roundProgress)
            : snapshot.progress + roundProgress;
        const completed = progress >= snapshot.target;
        const state: DailyChallengeState = {
            dateKey: snapshot.dateKey,
            progress: Math.min(progress, snapshot.target),
            completed,
            rewardGranted: snapshot.rewardGranted,
        };

        if (completed && !state.rewardGranted) {
            StorageManager.addMedals(1);
            state.rewardGranted = true;
        }

        StorageManager.saveDailyChallengeState(state);
        return {
            snapshot: this.toSnapshot(state, snapshot),
            justCompleted: completed && !previousCompleted,
        };
    }

    public static getDisplayText(snapshot: DailyChallengeSnapshot): string {
        const progress = Math.min(snapshot.progress, snapshot.target);
        const status = snapshot.completed ? '已完成' : `${progress}/${snapshot.target}`;
        return `今日挑战：${snapshot.title}  ${status}`;
    }

    private static getRoundProgress(kind: DailyChallengeKind, stats: RoundStats): number {
        if (kind === 'score') {
            return Math.max(0, Math.floor(stats.score));
        }

        if (kind === 'golden') {
            return Math.max(0, Math.floor(stats.goldenHits));
        }

        return Math.max(0, Math.floor(stats.positiveHits));
    }

    private static createState(dateKey: string): DailyChallengeState {
        return {
            dateKey,
            progress: 0,
            completed: false,
            rewardGranted: false,
        };
    }

    private static toSnapshot(
        state: DailyChallengeState,
        definition: DailyChallengeDefinition,
    ): DailyChallengeSnapshot {
        return {
            ...state,
            ...definition,
            medalCount: StorageManager.getMedalCount(),
        };
    }

    private static getDefinition(now: Date): DailyChallengeDefinition {
        const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
        const definitions: DailyChallengeDefinition[] = [
            { kind: 'score', title: '单局达到25分', target: 25 },
            { kind: 'hits', title: '累计命中30只地鼠', target: 30 },
            { kind: 'golden', title: '累计命中3只金色地鼠', target: 3 },
        ];
        return definitions[Math.abs(dayNumber) % definitions.length];
    }

    private static getDateKey(now: Date): string {
        const year = now.getFullYear();
        const monthValue = now.getMonth() + 1;
        const dayValue = now.getDate();
        const month = monthValue < 10 ? `0${monthValue}` : `${monthValue}`;
        const day = dayValue < 10 ? `0${dayValue}` : `${dayValue}`;
        return `${year}-${month}-${day}`;
    }
}
