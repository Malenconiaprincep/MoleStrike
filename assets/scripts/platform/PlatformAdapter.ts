import { sys } from 'cc';

type MiniGameCallback = () => void;

interface MiniGameApi {
    vibrateShort?: (options?: { type?: 'light' | 'medium' | 'heavy'; success?: MiniGameCallback; fail?: MiniGameCallback }) => void;
    shareAppMessage?: (options?: { title?: string; query?: string; imageUrl?: string }) => void;
    showShareMenu?: (options?: { withShareTicket?: boolean; menus?: string[] }) => void;
    getSystemInfoSync?: () => { platform?: string; model?: string; system?: string; safeArea?: unknown };
    getOpenDataContext?: () => { postMessage?: (message: Record<string, unknown>) => void };
}

declare const wx: MiniGameApi | undefined;
declare const tt: MiniGameApi | undefined;

export enum PlatformType {
    Wechat = 'wechat',
    Douyin = 'douyin',
    Editor = 'editor',
    Unknown = 'unknown',
}

/**
 * 小游戏平台适配层。
 * 玩法代码只调用这里，微信/抖音 API 差异集中封装，编辑器预览时安全降级。
 */
export class PlatformAdapter {
    public static getPlatformType(): PlatformType {
        const api = this.getWechatApi();
        if (api) {
            return PlatformType.Wechat;
        }

        const douyinApi = this.getDouyinApi();
        if (douyinApi) {
            return PlatformType.Douyin;
        }

        if (sys.isBrowser || sys.isNative) {
            return PlatformType.Editor;
        }

        return PlatformType.Unknown;
    }

    public static setupShareMenu(): void {
        const api = this.getActiveApi();
        api?.showShareMenu?.({
            withShareTicket: true,
            menus: ['shareAppMessage'],
        });
    }

    public static vibrateShort(type: 'light' | 'medium' | 'heavy' = 'light'): void {
        const api = this.getActiveApi();
        api?.vibrateShort?.({ type });
    }

    public static shareScore(score: number): boolean {
        const api = this.getActiveApi();
        if (!api?.shareAppMessage) {
            return false;
        }

        api.shareAppMessage({
            title: `我在地鼠突击队拿到了 ${score} 分，来挑战我！`,
            query: `score=${score}`,
        });
        return true;
    }

    public static showLeaderboard(): boolean {
        const wechatApi = this.getWechatApi();
        const openDataContext = wechatApi?.getOpenDataContext?.();
        if (!openDataContext?.postMessage) {
            return false;
        }

        openDataContext.postMessage({
            type: 'showLeaderboard',
        });
        return true;
    }

    public static submitScore(score: number): void {
        const wechatApi = this.getWechatApi();
        const openDataContext = wechatApi?.getOpenDataContext?.();
        openDataContext?.postMessage?.({
            type: 'submitScore',
            score,
        });
    }

    private static getActiveApi(): MiniGameApi | null {
        return this.getWechatApi() ?? this.getDouyinApi();
    }

    private static getWechatApi(): MiniGameApi | null {
        return typeof wx !== 'undefined' ? wx : null;
    }

    private static getDouyinApi(): MiniGameApi | null {
        return typeof tt !== 'undefined' ? tt : null;
    }
}
