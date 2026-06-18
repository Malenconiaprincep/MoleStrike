import { _decorator, Component, Label, Node, tween, Tween, UIOpacity, Vec3 } from 'cc';
import { DailyChallengeSnapshot } from '../core/GameTypes';
import { DailyChallengeManager } from '../game/DailyChallengeManager';

const { ccclass, property } = _decorator;

/**
 * UI 管理器。
 * 负责页面显隐和结算文案，不直接修改游戏数据。
 */
@ccclass('UIManager')
export class UIManager extends Component {
    @property(Node)
    public homePanel: Node | null = null;

    @property(Node)
    public gamePanel: Node | null = null;

    @property(Node)
    public resultPanel: Node | null = null;

    @property(Node)
    public pauseMask: Node | null = null;

    @property(Node)
    public leaderboardPanel: Node | null = null;

    @property(Label)
    public finalScoreLabel: Label | null = null;

    @property(Label)
    public bestScoreLabel: Label | null = null;

    @property(Label)
    public ratingLabel: Label | null = null;

    @property(Label)
    public newRecordLabel: Label | null = null;

    @property(Label)
    public dailyChallengeLabel: Label | null = null;

    @property(Label)
    public resultChallengeLabel: Label | null = null;

    public showHome(): void {
        this.setActive(this.homePanel, true);
        this.setActive(this.gamePanel, false);
        this.setActive(this.resultPanel, false);
        this.setActive(this.pauseMask, false);
        this.setActive(this.leaderboardPanel, false);
        this.resetPanelTransform(this.homePanel);
    }

    public showGame(): void {
        this.setActive(this.homePanel, false);
        this.setActive(this.gamePanel, true);
        this.setActive(this.resultPanel, false);
        this.setActive(this.pauseMask, false);
        this.setActive(this.leaderboardPanel, false);
        this.resetPanelTransform(this.gamePanel);
    }

    public showResult(finalScore: number, bestScore = finalScore, isNewRecord = false, rating = ''): void {
        this.setActive(this.homePanel, false);
        this.setActive(this.gamePanel, false);
        this.setActive(this.resultPanel, true);
        this.setActive(this.pauseMask, false);
        this.setActive(this.leaderboardPanel, false);

        if (this.finalScoreLabel) {
            this.finalScoreLabel.string = `最终得分：${finalScore}`;
        }

        if (this.bestScoreLabel) {
            this.bestScoreLabel.string = `历史最高：${bestScore}`;
        }

        if (this.ratingLabel) {
            this.ratingLabel.string = rating;
        }

        if (this.newRecordLabel) {
            this.newRecordLabel.node.active = isNewRecord;
            this.newRecordLabel.string = isNewRecord ? '新纪录！' : '';
        }

        this.playResultEntrance(isNewRecord);
    }

    public showPauseMask(show: boolean): void {
        if (!this.pauseMask) {
            return;
        }

        const opacity = this.pauseMask.getComponent(UIOpacity) ?? this.pauseMask.addComponent(UIOpacity);
        Tween.stopAllByTarget(opacity);
        if (show) {
            this.pauseMask.active = true;
            opacity.opacity = 0;
            tween(opacity).to(0.12, { opacity: 255 }).start();
            return;
        }

        tween(opacity)
            .to(0.1, { opacity: 0 })
            .call(() => {
                if (this.pauseMask) {
                    this.pauseMask.active = false;
                }
            })
            .start();
    }

    public showDailyChallenge(snapshot: DailyChallengeSnapshot, justCompleted = false): void {
        const progress = Math.min(snapshot.progress, snapshot.target);
        const status = snapshot.completed ? '已完成' : `${progress}/${snapshot.target}`;
        const text = DailyChallengeManager.getDisplayText(snapshot);
        if (this.dailyChallengeLabel) {
            this.dailyChallengeLabel.string = `今日挑战：${snapshot.title}\n进度 ${status}    勋章 ${snapshot.medalCount}`;
        }

        if (this.resultChallengeLabel) {
            this.resultChallengeLabel.string = justCompleted
                ? `挑战完成！获得 1 枚勋章  当前：${snapshot.medalCount}`
                : text;
        }
    }

    private playResultEntrance(isNewRecord: boolean): void {
        if (!this.resultPanel) {
            return;
        }

        const opacity = this.resultPanel.getComponent(UIOpacity) ?? this.resultPanel.addComponent(UIOpacity);
        Tween.stopAllByTarget(this.resultPanel);
        Tween.stopAllByTarget(opacity);
        this.resultPanel.setScale(new Vec3(0.84, 0.84, 1));
        opacity.opacity = 0;

        tween(opacity).to(0.18, { opacity: 255 }).start();
        tween(this.resultPanel)
            .to(0.24, { scale: new Vec3(1.04, 1.04, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: Vec3.ONE })
            .start();

        if (isNewRecord && this.newRecordLabel?.node.active) {
            const recordNode = this.newRecordLabel.node;
            Tween.stopAllByTarget(recordNode);
            recordNode.setScale(new Vec3(0.3, 0.3, 1));
            tween(recordNode)
                .delay(0.2)
                .to(0.25, { scale: new Vec3(1.16, 1.16, 1) }, { easing: 'backOut' })
                .to(0.1, { scale: Vec3.ONE })
                .start();
        }
    }

    private resetPanelTransform(panel: Node | null): void {
        if (!panel) {
            return;
        }

        Tween.stopAllByTarget(panel);
        panel.setScale(Vec3.ONE);
        const opacity = panel.getComponent(UIOpacity);
        if (opacity) {
            Tween.stopAllByTarget(opacity);
            opacity.opacity = 255;
        }
    }

    private setActive(node: Node | null, active: boolean): void {
        if (node) {
            node.active = active;
        }
    }
}
