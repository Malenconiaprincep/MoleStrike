import { Graphics, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';

/**
 * 可由运行时加载的正式美术资源。
 * 路径统一维护在这里，避免业务组件依赖具体目录结构。
 */
export enum ArtAssetKey {
    GameplayBackground = 'GameplayBackground',
    NormalMole = 'NormalMole',
    GoldenMole = 'GoldenMole',
    BombMole = 'BombMole',
    WoodHole = 'WoodHole',
}

type SpriteFrameCallback = (spriteFrame: SpriteFrame | null) => void;

const ART_PATHS: Record<ArtAssetKey, string> = {
    [ArtAssetKey.GameplayBackground]: 'textures/gameplay/gameplay_background/spriteFrame',
    [ArtAssetKey.NormalMole]: 'textures/gameplay/mole_normal/spriteFrame',
    [ArtAssetKey.GoldenMole]: 'textures/gameplay/mole_golden/spriteFrame',
    [ArtAssetKey.BombMole]: 'textures/gameplay/mole_bomb/spriteFrame',
    [ArtAssetKey.WoodHole]: 'textures/gameplay/hole_wood/spriteFrame',
};

const GAMEPLAY_ART_KEYS: ArtAssetKey[] = [
    ArtAssetKey.GameplayBackground,
    ArtAssetKey.NormalMole,
    ArtAssetKey.GoldenMole,
    ArtAssetKey.BombMole,
    ArtAssetKey.WoodHole,
];

/**
 * 美术资源加载与缓存入口。
 * Cocos 的 resources.load 本身会缓存资源，这里额外合并并发请求并统一处理降级逻辑。
 */
export class ArtResourceManager {
    private static readonly spriteFrames = new Map<ArtAssetKey, SpriteFrame>();
    private static readonly pendingCallbacks = new Map<ArtAssetKey, SpriteFrameCallback[]>();

    public static preloadGameplayArt(): void {
        for (const key of GAMEPLAY_ART_KEYS) {
            this.loadSpriteFrame(key, () => undefined);
        }
    }

    public static applySprite(
        node: Node,
        key: ArtAssetKey,
        width: number,
        height: number,
    ): void {
        const sprite = node.getComponent(Sprite) ?? node.addComponent(Sprite);
        sprite.enabled = false;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        this.loadSpriteFrame(key, (spriteFrame) => {
            if (!spriteFrame || !node.isValid) {
                return;
            }

            node.getComponent(UITransform)?.setContentSize(width, height);
            sprite.spriteFrame = spriteFrame;
            sprite.enabled = true;

            // 正式贴图加载成功后关闭程序绘制，加载失败时它仍是可靠的兜底画面。
            const fallbackGraphics = node.getComponent(Graphics);
            if (fallbackGraphics) {
                fallbackGraphics.enabled = false;
            }
        });
    }

    private static loadSpriteFrame(key: ArtAssetKey, callback: SpriteFrameCallback): void {
        const cached = this.spriteFrames.get(key);
        if (cached?.isValid) {
            callback(cached);
            return;
        }

        const pending = this.pendingCallbacks.get(key);
        if (pending) {
            pending.push(callback);
            return;
        }

        this.pendingCallbacks.set(key, [callback]);
        resources.load(ART_PATHS[key], SpriteFrame, (error, spriteFrame) => {
            if (!error && spriteFrame) {
                this.spriteFrames.set(key, spriteFrame);
            }

            const callbacks = this.pendingCallbacks.get(key) ?? [];
            this.pendingCallbacks.delete(key);
            for (const pendingCallback of callbacks) {
                pendingCallback(error ? null : spriteFrame);
            }
        });
    }
}
