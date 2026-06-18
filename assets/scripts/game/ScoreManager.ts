import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 分数管理器。
 * 只负责分数数据和分数显示，不处理游戏流程。
 */
@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property(Label)
    public scoreLabel: Label | null = null;

    private score = 0;

    public reset(): void {
        this.score = 0;
        this.refreshView();
    }

    public addScore(value: number): number {
        this.score = Math.max(0, this.score + value);
        this.refreshView();
        return this.score;
    }

    public getScore(): number {
        return this.score;
    }

    private refreshView(): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${this.score}`;
        }
    }
}
