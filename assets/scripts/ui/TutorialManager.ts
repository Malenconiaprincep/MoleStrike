import { _decorator, Component, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { AudioManager } from '../core/AudioManager';
import { StorageManager } from '../core/StorageManager';

const { ccclass, property } = _decorator;

interface TutorialPage {
    title: string;
    description: string;
    symbol: string;
}

const TUTORIAL_PAGES: TutorialPage[] = [
    {
        title: '眼疾手快',
        description: '地鼠冒出来后立刻点击\n普通地鼠可以获得 1 分',
        symbol: '地鼠  +1',
    },
    {
        title: '认准目标',
        description: '金色地鼠 +5 分\n炸弹地鼠 -3 分，千万别点错',
        symbol: '金色 +5   炸弹 -3',
    },
    {
        title: '保持连击',
        description: '连续命中会累积 Combo\n60 秒内挑战你的最高分',
        symbol: 'COMBO x3',
    },
];

/** 首次游戏的新手引导，负责分页展示和完成状态持久化。 */
@ccclass('TutorialManager')
export class TutorialManager extends Component {
    @property(Node)
    public panel: Node | null = null;

    @property(Label)
    public titleLabel: Label | null = null;

    @property(Label)
    public descriptionLabel: Label | null = null;

    @property(Label)
    public symbolLabel: Label | null = null;

    @property(Label)
    public progressLabel: Label | null = null;

    @property(Label)
    public actionLabel: Label | null = null;

    @property(AudioManager)
    public audioManager: AudioManager | null = null;

    private pageIndex = 0;
    private onCompleted: (() => void) | null = null;

    public shouldShow(): boolean {
        return !StorageManager.hasCompletedTutorial();
    }

    public show(onCompleted: () => void): void {
        if (!this.panel) {
            onCompleted();
            return;
        }

        this.pageIndex = 0;
        this.onCompleted = onCompleted;
        this.panel.active = true;
        const opacity = this.panel.getComponent(UIOpacity) ?? this.panel.addComponent(UIOpacity);
        opacity.opacity = 0;
        this.panel.setScale(new Vec3(0.94, 0.94, 1));
        this.renderPage();
        tween(opacity).to(0.15, { opacity: 255 }).start();
        tween(this.panel).to(0.2, { scale: Vec3.ONE }, { easing: 'backOut' }).start();
    }

    public handleNext(): void {
        this.audioManager?.playButtonClick();
        if (this.pageIndex >= TUTORIAL_PAGES.length - 1) {
            this.complete();
            return;
        }

        this.pageIndex += 1;
        this.renderPage();
    }

    public handleSkip(): void {
        this.audioManager?.playButtonClick();
        this.complete();
    }

    private renderPage(): void {
        const page = TUTORIAL_PAGES[this.pageIndex];
        if (this.titleLabel) {
            this.titleLabel.string = page.title;
        }
        if (this.descriptionLabel) {
            this.descriptionLabel.string = page.description;
        }
        if (this.symbolLabel) {
            this.symbolLabel.string = page.symbol;
        }
        if (this.progressLabel) {
            this.progressLabel.string = TUTORIAL_PAGES
                .map((_, index) => index === this.pageIndex ? '●' : '○')
                .join('  ');
        }
        if (this.actionLabel) {
            this.actionLabel.string = this.pageIndex === TUTORIAL_PAGES.length - 1 ? '开始挑战' : '下一步';
        }
    }

    private complete(): void {
        StorageManager.saveTutorialCompleted();
        if (this.panel) {
            this.panel.active = false;
        }

        const callback = this.onCompleted;
        this.onCompleted = null;
        callback?.();
    }
}
