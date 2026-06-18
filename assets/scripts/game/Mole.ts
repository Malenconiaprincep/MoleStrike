import { _decorator, Component, EventTouch, Node, Sprite, tween, Vec3 } from 'cc';
import { MoleConfig, MoleType, NORMAL_MOLE_CONFIG } from '../core/GameTypes';

const { ccclass, property } = _decorator;

type MoleHitCallback = (score: number, type: MoleType) => void;
type MoleHiddenCallback = (hit: boolean) => void;

/**
 * 单只地鼠的行为组件。
 * 负责出现、点击命中、自动缩回动画，不关心分数和整体游戏状态。
 */
@ccclass('Mole')
export class Mole extends Component {
    @property(Sprite)
    public bodySprite: Sprite | null = null;

    private config: MoleConfig = NORMAL_MOLE_CONFIG;
    private secondsLeft = NORMAL_MOLE_CONFIG.staySeconds;
    private visible = false;
    private paused = false;
    private onHit: MoleHitCallback | null = null;
    private onHidden: MoleHiddenCallback | null = null;

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    }

    public show(config: MoleConfig, onHit: MoleHitCallback, onHidden: MoleHiddenCallback): void {
        this.config = config;
        this.secondsLeft = config.staySeconds;
        this.visible = true;
        this.paused = false;
        this.onHit = onHit;
        this.onHidden = onHidden;

        this.node.active = true;
        this.node.setScale(new Vec3(0.1, 0.1, 1));
        tween(this.node)
            .to(0.12, { scale: new Vec3(1.12, 1.12, 1) })
            .to(0.06, { scale: Vec3.ONE })
            .start();
    }

    public pauseMole(): void {
        this.paused = true;
    }

    public resumeMole(): void {
        this.paused = false;
    }

    protected update(deltaTime: number): void {
        if (!this.visible || this.paused) {
            return;
        }

        this.secondsLeft -= deltaTime;
        if (this.secondsLeft <= 0) {
            this.hide(false);
        }
    }

    private handleTouchEnd(event: EventTouch): void {
        event.propagationStopped = true;

        if (!this.visible || this.paused) {
            return;
        }

        this.onHit?.(this.config.score, this.config.type);
        this.hide(true);
    }

    private hide(hit: boolean): void {
        if (!this.visible) {
            return;
        }

        this.visible = false;
        tween(this.node)
            .to(0.08, { scale: new Vec3(1.08, 1.08, 1) })
            .to(0.12, { scale: new Vec3(0.1, 0.1, 1) })
            .call(() => {
                this.onHidden?.(hit);
            })
            .start();
    }
}
