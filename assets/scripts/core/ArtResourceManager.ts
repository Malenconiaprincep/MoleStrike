import { Graphics, Node, resources, Sprite, SpriteFrame, Texture2D, UITransform } from 'cc';

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
    PrimaryButton = 'PrimaryButton',
    SecondaryButton = 'SecondaryButton',
    PauseButton = 'PauseButton',
    TitleSign = 'TitleSign',
    ResultCard = 'ResultCard',
    ScoreIcon = 'ScoreIcon',
    TimeIcon = 'TimeIcon',
}

type SpriteFrameCallback = (spriteFrame: SpriteFrame | null) => void;

const ART_PATHS: Record<ArtAssetKey, string> = {
    [ArtAssetKey.GameplayBackground]: 'textures/gameplay/gameplay_background/texture',
    [ArtAssetKey.NormalMole]: 'textures/gameplay/mole_normal/texture',
    [ArtAssetKey.GoldenMole]: 'textures/gameplay/mole_golden/texture',
    [ArtAssetKey.BombMole]: 'textures/gameplay/mole_bomb/texture',
    [ArtAssetKey.WoodHole]: 'textures/gameplay/hole_wood/texture',
    [ArtAssetKey.PrimaryButton]: 'textures/ui/btn_primary/texture',
    [ArtAssetKey.SecondaryButton]: 'textures/ui/btn_secondary/texture',
    [ArtAssetKey.PauseButton]: 'textures/ui/btn_pause/texture',
    [ArtAssetKey.TitleSign]: 'textures/ui/title_sign/texture',
    [ArtAssetKey.ResultCard]: 'textures/ui/result_card/texture',
    [ArtAssetKey.ScoreIcon]: 'textures/ui/icon_score/texture',
    [ArtAssetKey.TimeIcon]: 'textures/ui/icon_time/texture',
};

const GAMEPLAY_ART_KEYS: ArtAssetKey[] = [
    ArtAssetKey.GameplayBackground,
    ArtAssetKey.NormalMole,
    ArtAssetKey.GoldenMole,
    ArtAssetKey.BombMole,
    ArtAssetKey.WoodHole,
    ArtAssetKey.PrimaryButton,
    ArtAssetKey.SecondaryButton,
    ArtAssetKey.PauseButton,
    ArtAssetKey.TitleSign,
    ArtAssetKey.ResultCard,
    ArtAssetKey.ScoreIcon,
    ArtAssetKey.TimeIcon,
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
        const artworkName = `Artwork_${key}`;
        const artwork = node.getChildByName(artworkName) ?? new Node(artworkName);
        if (!artwork.parent) {
            node.addChild(artwork);
        }
        artwork.setSiblingIndex(0);
        artwork.layer = node.layer;
        artwork.setPosition(0, 0, 0);
        const artworkTransform = artwork.getComponent(UITransform) ?? artwork.addComponent(UITransform);
        artworkTransform.setContentSize(width, height);
        const sprite = artwork.getComponent(Sprite) ?? artwork.addComponent(Sprite);
        sprite.enabled = false;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        this.loadSpriteFrame(key, (spriteFrame) => {
            if (!spriteFrame || !node.isValid || !artwork.isValid) {
                return;
            }

            node.getComponent(UITransform)?.setContentSize(width, height);
            artwork.layer = node.layer;
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
        resources.load(ART_PATHS[key], Texture2D, (error, texture) => {
            const spriteFrame = !error && texture ? new SpriteFrame() : null;
            if (spriteFrame && texture) {
                spriteFrame.texture = texture;
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
