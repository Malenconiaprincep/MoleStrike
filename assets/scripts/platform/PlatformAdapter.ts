import { sys } from 'cc';

type MiniGameCallback = () => void;

interface MiniGameError {
    errMsg?: string;
}

interface LoginResult extends MiniGameError {
    code?: string;
    anonymousCode?: string;
}

interface OpenDataContext {
    postMessage?: (message: Record<string, unknown>) => void;
}

interface MiniGameApi {
    vibrateShort?: (options?: { type?: 'light' | 'medium' | 'heavy'; success?: MiniGameCallback; fail?: MiniGameCallback }) => void;
    shareAppMessage?: (options?: { title?: string; query?: string; imageUrl?: string }) => void;
    showShareMenu?: (options?: { withShareTicket?: boolean; menus?: string[] }) => void;
    getSystemInfoSync?: () => { platform?: string; model?: string; system?: string; safeArea?: unknown };
    login?: (options: {
        force?: boolean;
        success?: (result: LoginResult) => void;
        fail?: (error: MiniGameError) => void;
    }) => void;
    setUserCloudStorage?: (options: {
        KVDataList: Array<{ key: string; value: string }>;
        success?: MiniGameCallback;
        fail?: (error: MiniGameError) => void;
    }) => void;
    getOpenDataContext?: () => OpenDataContext;
    reportEvent?: (eventName: string, data: Record<string, string | number>) => void;
    reportAnalytics?: (eventName: string, data: Record<string, string | number>) => void;
    onError?: (callback: (message: string | MiniGameError) => void) => void;
    onUnhandledRejection?: (callback: (result: { reason?: unknown }) => void) => void;
}

declare const wx: MiniGameApi | undefined;
declare const tt: MiniGameApi | undefined;

export enum PlatformType {
    Wechat = 'wechat',
    Douyin = 'douyin',
    Editor = 'editor',
    Unknown = 'unknown',
}

export interface PlatformLoginResult {
    platform: PlatformType;
    success: boolean;
    code: string;
    errorMessage: string;
}

/**
 * 小游戏平台适配层。
 * 玩法代码只调用这里，微信/抖音 API 差异集中封装，编辑器预览时安全降级。
 */
export class PlatformAdapter {
    private static loginPromise: Promise<PlatformLoginResult> | null = null;

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

    /**
     * 获取平台临时登录凭证。正式服必须由业务服务端交换 openId/session，
     * 客户端不保存 code，也不把 AppSecret 放进包内。
     */
    public static login(): Promise<PlatformLoginResult> {
        if (this.loginPromise) {
            return this.loginPromise;
        }

        const platform = this.getPlatformType();
        const api = this.getActiveApi();
        if (!api?.login) {
            return Promise.resolve({
                platform,
                success: platform === PlatformType.Editor,
                code: '',
                errorMessage: platform === PlatformType.Editor ? '' : '当前环境不支持平台登录',
            });
        }

        this.loginPromise = new Promise((resolve) => {
            api.login?.({
                force: false,
                success: (result) => {
                    const code = result.code ?? result.anonymousCode ?? '';
                    resolve({
                        platform,
                        success: code.length > 0,
                        code,
                        errorMessage: code ? '' : '平台未返回登录凭证',
                    });
                },
                fail: (error) => {
                    this.loginPromise = null;
                    resolve({
                        platform,
                        success: false,
                        code: '',
                        errorMessage: error.errMsg ?? '平台登录失败',
                    });
                },
            });
        });
        return this.loginPromise;
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
        const openDataContext = this.getActiveApi()?.getOpenDataContext?.();
        if (!openDataContext?.postMessage) {
            return false;
        }

        openDataContext.postMessage({
            type: 'showLeaderboard',
        });
        return true;
    }

    public static hideLeaderboard(): void {
        this.getActiveApi()?.getOpenDataContext?.()?.postMessage?.({
            type: 'hideLeaderboard',
        });
    }

    public static submitScore(score: number): boolean {
        const api = this.getActiveApi();
        const normalizedScore = Math.max(0, Math.floor(score));
        const openDataContext = api?.getOpenDataContext?.();
        openDataContext?.postMessage?.({
            type: 'submitScore',
            score: normalizedScore,
        });

        if (!api?.setUserCloudStorage) {
            return false;
        }

        api.setUserCloudStorage({
            KVDataList: [{ key: 'best_score', value: `${normalizedScore}` }],
        });
        return true;
    }

    public static reportAnalytics(eventName: string, data: Record<string, string | number>): boolean {
        const api = this.getActiveApi();
        try {
            if (this.getPlatformType() === PlatformType.Wechat && api?.reportEvent) {
                api.reportEvent(eventName, data);
                return true;
            }
            if (this.getPlatformType() === PlatformType.Douyin && api?.reportAnalytics) {
                api.reportAnalytics(eventName, data);
                return true;
            }
        } catch {
            return false;
        }
        return false;
    }

    public static registerErrorHandlers(handler: (kind: string, message: string) => void): void {
        const api = this.getActiveApi();
        api?.onError?.((error) => {
            const message = typeof error === 'string' ? error : error.errMsg ?? 'unknown runtime error';
            handler('runtime', message);
        });
        api?.onUnhandledRejection?.((result) => {
            const reason = result.reason;
            const message = reason instanceof Error ? reason.message : String(reason ?? 'unknown rejection');
            handler('promise', message);
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
