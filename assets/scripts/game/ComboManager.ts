import { _decorator, Color, Component, Label, Node, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 连击管理器。
 * 连续命中会刷新连击时间，超过窗口未命中则自动断连。
 */
@ccclass('ComboManager')
export class ComboManager extends Component {
    @property(Label)
    public comboLabel: Label | null = null;

    @property
    public comboWindowSeconds = 1.2;

    private combo = 0;
    private remainSeconds = 0;

    public reset(): void {
        this.combo = 0;
        this.remainSeconds = 0;
        this.refreshView();
    }

    public addCombo(): number {
        this.combo += 1;
        this.remainSeconds = this.comboWindowSeconds;
        this.refreshView(true);
        return this.combo;
    }

    public breakCombo(): void {
        this.combo = 0;
        this.remainSeconds = 0;
        this.refreshView();
    }

    protected update(deltaTime: number): void {
        if (this.combo <= 0) {
            return;
        }

        this.remainSeconds -= deltaTime;
        if (this.remainSeconds <= 0) {
            this.breakCombo();
        }
    }

    private refreshView(playPulse = false): void {
        if (!this.comboLabel) {
            return;
        }

        const labelNode = this.comboLabel.node;
        labelNode.active = this.combo >= 2;
        this.comboLabel.string = this.combo >= 2 ? `Combo x${this.combo}` : '';
        this.comboLabel.color = this.combo >= 5 ? new Color(255, 117, 76, 255) : new Color(255, 244, 174, 255);

        if (playPulse) {
            this.playPulse(labelNode);
        }
    }

    private playPulse(node: Node): void {
        tween(node)
            .stop()
            .set({ scale: new Vec3(0.86, 0.86, 1) })
            .to(0.1, { scale: new Vec3(1.15, 1.15, 1) })
            .to(0.08, { scale: Vec3.ONE })
            .start();
    }
}
