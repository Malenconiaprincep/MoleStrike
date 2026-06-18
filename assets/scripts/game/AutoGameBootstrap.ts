import {
    _decorator,
    AudioSource,
    BlockInputEvents,
    Button,
    Color,
    Component,
    Graphics,
    Label,
    Layers,
    Node,
    profiler,
    tween,
    UITransform,
    UIOpacity,
    Vec3,
    Widget,
    Tween,
    view,
} from 'cc';
import { AudioManager } from '../core/AudioManager';
import { ArtAssetKey, ArtResourceManager } from '../core/ArtResourceManager';
import { GameManager } from './GameManager';
import { MoleManager } from './MoleManager';
import { ScoreManager } from './ScoreManager';
import { TimerManager } from './TimerManager';
import { UIManager } from '../ui/UIManager';
import { ComboManager } from './ComboManager';
import { PlatformAdapter } from '../platform/PlatformAdapter';
import { TutorialManager } from '../ui/TutorialManager';
import { SafeAreaLayout } from '../ui/SafeAreaLayout';

const { ccclass, executeInEditMode, property } = _decorator;
const DESIGN_WIDTH = 750;
const DESIGN_HEIGHT = 1334;

/**
 * 自动场景搭建脚本。
 * 学习阶段只需要把它挂到 Canvas 上，就能自动生成可运行的首版游戏界面。
 */
@ccclass('AutoGameBootstrap')
@executeInEditMode
export class AutoGameBootstrap extends Component {
    @property
    public rebuildOnLoad = true;

    protected onLoad(): void {
        profiler.hideStats();

        if (!this.rebuildOnLoad) {
            return;
        }

        this.clearGeneratedNodes();
        this.buildGame();
    }

    protected start(): void {
        if (!this.rebuildOnLoad || this.node.getChildByName('Managers')) {
            return;
        }

        // 仅在 onLoad 尚未完成构建时兜底，避免运行时重复创建资源和管理器。
        this.clearGeneratedNodes();
        this.buildGame();
    }

    private buildGame(): void {
        const layout = this.getLayoutSize();
        ArtResourceManager.preloadGameplayArt();
        this.node.layer = Layers.Enum.UI_2D;
        this.node.getComponent(UITransform)?.setContentSize(layout.width, layout.height);
        this.ensureWidget(this.node);

        const background = this.createPanel('Background', true);
        this.drawGrassBackground(background);
        ArtResourceManager.applySprite(background, ArtAssetKey.GameplayBackground, layout.width, layout.height);

        const homePanel = this.createPanel('HomePanel', true);
        const gamePanel = this.createPanel('GamePanel', false);
        const resultPanel = this.createPanel('ResultPanel', false);
        const pauseMask = this.createPanel('PauseMask', false);
        const effectsLayer = this.createPanel('EffectsLayer', true);
        const tutorialPanel = this.createPanel('TutorialPanel', false);
        this.drawPauseMask(pauseMask);
        this.drawPauseMask(tutorialPanel);
        pauseMask.addComponent(BlockInputEvents);
        tutorialPanel.addComponent(BlockInputEvents);

        const managers = new Node('Managers');
        managers.layer = Layers.Enum.UI_2D;
        managers.active = false;
        this.node.addChild(managers);

        const audioSource = managers.addComponent(AudioSource);
        const musicSource = managers.addComponent(AudioSource);
        const audioManager = managers.addComponent(AudioManager);
        audioManager.audioSource = audioSource;
        audioManager.musicSource = musicSource;
        const uiManager = managers.addComponent(UIManager);
        const tutorialManager = managers.addComponent(TutorialManager);
        const safeAreaLayout = managers.addComponent(SafeAreaLayout);
        const scoreManager = managers.addComponent(ScoreManager);
        const timerManager = managers.addComponent(TimerManager);
        const comboManager = managers.addComponent(ComboManager);
        const moleManager = managers.addComponent(MoleManager);
        const gameManager = managers.addComponent(GameManager);

        const homeLabels = this.buildHomePanel(homePanel, gameManager, audioManager);
        const gameLabels = this.buildGamePanel(gamePanel, gameManager, moleManager);
        const resultLabels = this.buildResultPanel(resultPanel, gameManager, audioManager);
        this.buildTutorialPanel(tutorialPanel, tutorialManager);
        safeAreaLayout.configure(gameLabels.topSafeNodes, [
            ...gameLabels.bottomSafeNodes,
            ...resultLabels.bottomSafeNodes,
        ]);

        const pauseLabel = this.createLabel('PauseLabel', '已暂停', 48, new Color(255, 255, 255, 255));
        pauseMask.addChild(pauseLabel);
        pauseLabel.setPosition(0, 0, 0);

        scoreManager.scoreLabel = gameLabels.scoreLabel;
        timerManager.timeLabel = gameLabels.timeLabel;
        comboManager.comboLabel = gameLabels.comboLabel;
        moleManager.audioManager = audioManager;
        tutorialManager.audioManager = audioManager;

        uiManager.homePanel = homePanel;
        uiManager.gamePanel = gamePanel;
        uiManager.resultPanel = resultPanel;
        uiManager.pauseMask = pauseMask;
        uiManager.finalScoreLabel = resultLabels.finalScoreLabel;
        uiManager.bestScoreLabel = resultLabels.bestScoreLabel;
        uiManager.ratingLabel = resultLabels.ratingLabel;
        uiManager.newRecordLabel = resultLabels.newRecordLabel;
        uiManager.dailyChallengeLabel = homeLabels.dailyChallengeLabel;
        uiManager.resultChallengeLabel = resultLabels.challengeLabel;

        gameManager.scoreManager = scoreManager;
        gameManager.timerManager = timerManager;
        gameManager.moleManager = moleManager;
        gameManager.uiManager = uiManager;
        gameManager.audioManager = audioManager;
        gameManager.comboManager = comboManager;
        gameManager.tutorialManager = tutorialManager;
        gameManager.gameSeconds = 60;
        gameManager.onHitFeedback = (score, combo, target) => {
            this.showHitFeedback(effectsLayer, score, combo, target);
            if (score < 0) {
                this.playScreenShake(gamePanel.getChildByName('HoleRoot') ?? gamePanel);
            }
        };
        gameManager.onDifficultyChanged = (level) => {
            gameLabels.difficultyLabel.string = this.getDifficultyText(level);
            gameLabels.difficultyLabel.color = level === 3
                ? new Color(255, 116, 78, 255)
                : level === 2
                    ? new Color(224, 142, 48, 255)
                    : new Color(82, 124, 50, 255);
        };

        // 所有引用配置完成后再触发生命周期，避免 onLoad 读取到未注入的依赖。
        managers.active = true;
    }

    private buildHomePanel(
        homePanel: Node,
        gameManager: GameManager,
        audioManager: AudioManager,
    ): { dailyChallengeLabel: Label } {
        const layout = this.getLayoutSize();

        const sign = this.createWoodSign('TitleSign', 610, 170);
        homePanel.addChild(sign);
        sign.setPosition(0, layout.height / 2 - 345, 0);

        const sun = new Node('Sun');
        sun.layer = Layers.Enum.UI_2D;
        sun.addComponent(UITransform).setContentSize(120, 120);
        const sunGraphics = sun.addComponent(Graphics);
        sunGraphics.fillColor = new Color(255, 235, 116, 255);
        sunGraphics.circle(0, 0, 48);
        sunGraphics.fill();
        homePanel.addChild(sun);
        sun.setPosition(-245, 440, 0);

        const title = this.createLabel('Title', '地鼠突击队', 72, new Color(255, 247, 207, 255), 560, 120);
        homePanel.addChild(title);
        title.setPosition(0, layout.height / 2 - 360, 0);

        const subtitle = this.createLabel('Subtitle', '60秒打地鼠挑战', 34, new Color(101, 83, 35, 255), 460, 70);
        homePanel.addChild(subtitle);
        subtitle.setPosition(0, layout.height / 2 - 485, 0);

        const dailyChallenge = this.createLabel(
            'DailyChallengeLabel',
            '今日挑战载入中…',
            25,
            new Color(91, 72, 47, 255),
            600,
            86,
        );
        homePanel.addChild(dailyChallenge);
        dailyChallenge.setPosition(0, layout.height / 2 - 575, 0);

        const startButton = this.createButton('StartButton', '开始游戏', new Color(255, 184, 65, 255), () => {
            gameManager.handleStartButton();
        }, 340, 96, 38);
        homePanel.addChild(startButton);
        startButton.setPosition(0, layout.height / 2 - 735, 0);

        const soundButton = this.createSoundButton('SoundButton', audioManager);
        homePanel.addChild(soundButton);
        soundButton.setPosition(0, layout.height / 2 - 845, 0);

        const demoMole = this.createCuteMolePreview();
        homePanel.addChild(demoMole);
        demoMole.setPosition(0, layout.height / 2 - 990, 0);

        const hint = this.createLabel('HintLabel', '金色+5，炸弹-3，小心连击断掉', 26, new Color(82, 124, 50, 255), 560, 60);
        homePanel.addChild(hint);
        hint.setPosition(0, -layout.height / 2 + 140, 0);

        return {
            dailyChallengeLabel: dailyChallenge.getComponent(Label)!,
        };
    }

    private buildGamePanel(
        gamePanel: Node,
        gameManager: GameManager,
        moleManager: MoleManager,
    ): {
        scoreLabel: Label;
        timeLabel: Label;
        comboLabel: Label;
        difficultyLabel: Label;
        topSafeNodes: Node[];
        bottomSafeNodes: Node[];
    } {
        const layout = this.getLayoutSize();

        const topBar = new Node('TopBar');
        topBar.layer = Layers.Enum.UI_2D;
        topBar.addComponent(UITransform).setContentSize(690, 150);
        gamePanel.addChild(topBar);
        topBar.setPosition(0, layout.height / 2 - 145, 0);

        const scorePill = this.createStatusPill('ScorePill', new Color(255, 247, 206, 255));
        const timePill = this.createStatusPill('TimePill', new Color(255, 238, 221, 255));
        topBar.addChild(scorePill);
        topBar.addChild(timePill);
        scorePill.setPosition(-185, 0, 0);
        timePill.setPosition(185, 0, 0);

        const scoreIcon = this.createCircleIcon('ScoreIcon', new Color(255, 202, 63, 255));
        const timeIcon = this.createCircleIcon('TimeIcon', new Color(255, 116, 78, 255));
        scorePill.addChild(scoreIcon);
        timePill.addChild(timeIcon);
        scoreIcon.setPosition(-100, 0, 0);
        timeIcon.setPosition(-100, 0, 0);

        this.drawStarIcon(scoreIcon);
        this.drawClockIcon(timeIcon);

        const scoreLabelNode = this.createLabel('ScoreLabel', 'Score: 0', 32, new Color(74, 45, 28, 255), 210, 70);
        const timeLabelNode = this.createLabel('TimeLabel', '60', 42, new Color(206, 72, 41, 255), 160, 70);
        topBar.addChild(scoreLabelNode);
        topBar.addChild(timeLabelNode);
        scoreLabelNode.setPosition(-160, 0, 0);
        timeLabelNode.setPosition(210, 0, 0);

        const holeRoot = new Node('HoleRoot');
        holeRoot.layer = Layers.Enum.UI_2D;
        holeRoot.addComponent(UITransform).setContentSize(690, 720);
        gamePanel.addChild(holeRoot);
        holeRoot.setPosition(0, layout.height / 2 - 705, 0);

        const fieldFrame = this.createFieldFrame('FieldFrame');
        gamePanel.addChild(fieldFrame);
        fieldFrame.setSiblingIndex(holeRoot.getSiblingIndex());
        fieldFrame.setPosition(0, layout.height / 2 - 705, 0);

        moleManager.holes = this.createHoles(holeRoot);

        const pauseButton = this.createButton('PauseButton', '暂停', new Color(122, 190, 91, 255), () => {
            gameManager.handlePauseButton();
        }, 220, 78, 30);
        gamePanel.addChild(pauseButton);
        pauseButton.setPosition(0, -layout.height / 2 + 135, 0);

        const comboLabelNode = this.createLabel('ComboLabel', '', 46, new Color(255, 244, 174, 255), 360, 80);
        gamePanel.addChild(comboLabelNode);
        comboLabelNode.active = false;
        comboLabelNode.setPosition(0, layout.height / 2 - 290, 0);

        const difficultyLabelNode = this.createLabel('DifficultyLabel', '难度：轻松', 26, new Color(82, 124, 50, 255), 260, 54);
        gamePanel.addChild(difficultyLabelNode);
        difficultyLabelNode.setPosition(0, layout.height / 2 - 220, 0);

        return {
            scoreLabel: scoreLabelNode.getComponent(Label)!,
            timeLabel: timeLabelNode.getComponent(Label)!,
            comboLabel: comboLabelNode.getComponent(Label)!,
            difficultyLabel: difficultyLabelNode.getComponent(Label)!,
            topSafeNodes: [topBar, difficultyLabelNode, comboLabelNode],
            bottomSafeNodes: [pauseButton],
        };
    }

    private buildResultPanel(
        resultPanel: Node,
        gameManager: GameManager,
        audioManager: AudioManager,
    ): {
        finalScoreLabel: Label;
        bestScoreLabel: Label;
        ratingLabel: Label;
        newRecordLabel: Label;
        challengeLabel: Label;
        bottomSafeNodes: Node[];
    } {
        const layout = this.getLayoutSize();

        const card = this.createResultCard();
        resultPanel.addChild(card);
        card.setPosition(0, layout.height / 2 - 620, 0);

        const title = this.createLabel('ResultTitle', '游戏结束', 68, new Color(91, 52, 31, 255), 520, 120);
        const finalScoreNode = this.createLabel('FinalScoreLabel', '最终得分：0', 42, new Color(74, 45, 28, 255), 520, 90);
        const bestScore = this.createLabel('BestScoreLabel', '历史最高：0', 34, new Color(102, 117, 51, 255), 520, 74);
        const rating = this.createLabel('RatingLabel', '评级：见习队员', 34, new Color(173, 110, 55, 255), 520, 74);
        const newRecord = this.createLabel('NewRecordLabel', '新纪录！', 38, new Color(255, 116, 78, 255), 520, 74);
        const challenge = this.createLabel('ResultChallengeLabel', '', 24, new Color(91, 72, 47, 255), 390, 100);
        resultPanel.addChild(title);
        resultPanel.addChild(finalScoreNode);
        resultPanel.addChild(bestScore);
        resultPanel.addChild(rating);
        resultPanel.addChild(newRecord);
        resultPanel.addChild(challenge);
        title.setPosition(0, layout.height / 2 - 390, 0);
        finalScoreNode.setPosition(0, layout.height / 2 - 520, 0);
        bestScore.setPosition(0, layout.height / 2 - 590, 0);
        rating.setPosition(0, layout.height / 2 - 655, 0);
        newRecord.setPosition(0, layout.height / 2 - 460, 0);
        challenge.setPosition(105, layout.height / 2 - 770, 0);
        newRecord.active = false;

        const resultMole = this.createCuteMolePreview();
        resultPanel.addChild(resultMole);
        resultMole.setPosition(-235, layout.height / 2 - 765, 0);

        const replayButton = this.createButton('ReplayButton', '再来一次', new Color(255, 184, 65, 255), () => {
            gameManager.handleReplayButton();
        }, 340, 92, 36);
        const homeButton = this.createButton('HomeButton', '返回首页', new Color(122, 190, 91, 255), () => {
            gameManager.handleHomeButton();
        }, 340, 92, 36);
        const shareButton = this.createButton('ShareButton', '分享战绩', new Color(255, 211, 97, 255), () => {
            audioManager.playButtonClick();
            const score = this.parseScoreFromLabel(finalScoreNode.getComponent(Label)?.string ?? '');
            PlatformAdapter.shareScore(score);
        }, 250, 78, 30);
        const leaderboardButton = this.createButton('LeaderboardButton', '排行榜', new Color(141, 205, 255, 255), () => {
            audioManager.playButtonClick();
            PlatformAdapter.showLeaderboard();
        }, 250, 78, 30);
        const soundButton = this.createSoundButton('ResultSoundButton', audioManager);
        resultPanel.addChild(replayButton);
        resultPanel.addChild(homeButton);
        resultPanel.addChild(shareButton);
        resultPanel.addChild(leaderboardButton);
        resultPanel.addChild(soundButton);
        replayButton.setPosition(0, -layout.height / 2 + 380, 0);
        homeButton.setPosition(0, -layout.height / 2 + 265, 0);
        shareButton.setPosition(-140, -layout.height / 2 + 155, 0);
        leaderboardButton.setPosition(140, -layout.height / 2 + 155, 0);
        soundButton.setPosition(0, -layout.height / 2 + 60, 0);

        return {
            finalScoreLabel: finalScoreNode.getComponent(Label)!,
            bestScoreLabel: bestScore.getComponent(Label)!,
            ratingLabel: rating.getComponent(Label)!,
            newRecordLabel: newRecord.getComponent(Label)!,
            challengeLabel: challenge.getComponent(Label)!,
            bottomSafeNodes: [replayButton, homeButton, shareButton, leaderboardButton, soundButton],
        };
    }

    private buildTutorialPanel(tutorialPanel: Node, tutorialManager: TutorialManager): void {
        const card = new Node('TutorialCard');
        card.layer = Layers.Enum.UI_2D;
        card.addComponent(UITransform).setContentSize(620, 760);
        const cardGraphics = card.addComponent(Graphics);
        cardGraphics.fillColor = new Color(104, 65, 37, 255);
        cardGraphics.roundRect(-310, -380, 620, 760, 42);
        cardGraphics.fill();
        cardGraphics.fillColor = new Color(255, 249, 219, 255);
        cardGraphics.roundRect(-294, -364, 588, 728, 34);
        cardGraphics.fill();
        cardGraphics.strokeColor = new Color(215, 151, 72, 255);
        cardGraphics.lineWidth = 6;
        cardGraphics.roundRect(-294, -364, 588, 728, 34);
        cardGraphics.stroke();
        tutorialPanel.addChild(card);

        const badge = new Node('TutorialBadge');
        badge.layer = Layers.Enum.UI_2D;
        badge.addComponent(UITransform).setContentSize(430, 130);
        const badgeGraphics = badge.addComponent(Graphics);
        badgeGraphics.fillColor = new Color(143, 211, 99, 255);
        badgeGraphics.roundRect(-215, -65, 430, 130, 32);
        badgeGraphics.fill();
        badgeGraphics.fillColor = new Color(255, 255, 255, 46);
        badgeGraphics.roundRect(-190, 32, 380, 14, 7);
        badgeGraphics.fill();
        tutorialPanel.addChild(badge);
        badge.setPosition(0, 88, 0);

        const heading = this.createLabel('TutorialHeading', '新兵训练', 30, new Color(168, 105, 48, 255), 360, 60);
        const title = this.createLabel('TutorialTitle', '', 52, new Color(91, 52, 31, 255), 520, 90);
        const symbol = this.createLabel('TutorialSymbol', '', 36, new Color(255, 255, 235, 255), 400, 90);
        const description = this.createLabel('TutorialDescription', '', 31, new Color(91, 72, 47, 255), 520, 150);
        const progress = this.createLabel('TutorialProgress', '', 30, new Color(114, 166, 74, 255), 300, 55);
        tutorialPanel.addChild(heading);
        tutorialPanel.addChild(title);
        tutorialPanel.addChild(symbol);
        tutorialPanel.addChild(description);
        tutorialPanel.addChild(progress);
        heading.setPosition(0, 305, 0);
        title.setPosition(0, 240, 0);
        symbol.setPosition(0, 88, 0);
        description.setPosition(0, -38, 0);
        progress.setPosition(0, -142, 0);

        const actionButton = this.createButton('TutorialActionButton', '下一步', new Color(255, 184, 65, 255), () => {
            tutorialManager.handleNext();
        }, 330, 92, 34);
        const skipButton = this.createButton('TutorialSkipButton', '跳过引导', new Color(183, 215, 145, 255), () => {
            tutorialManager.handleSkip();
        }, 230, 68, 26);
        tutorialPanel.addChild(actionButton);
        tutorialPanel.addChild(skipButton);
        actionButton.setPosition(0, -245, 0);
        skipButton.setPosition(0, -332, 0);

        tutorialManager.panel = tutorialPanel;
        tutorialManager.titleLabel = title.getComponent(Label);
        tutorialManager.descriptionLabel = description.getComponent(Label);
        tutorialManager.symbolLabel = symbol.getComponent(Label);
        tutorialManager.progressLabel = progress.getComponent(Label);
        tutorialManager.actionLabel = actionButton.getChildByName('Label')?.getComponent(Label) ?? null;
    }

    private createHoles(holeRoot: Node): Node[] {
        const holes: Node[] = [];
        const startX = -220;
        const startY = 245;
        const gapX = 220;
        const gapY = 230;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const hole = new Node(`Hole_${row * 3 + col + 1}`);
                hole.layer = Layers.Enum.UI_2D;
                hole.addComponent(UITransform).setContentSize(178, 132);

                const graphics = hole.addComponent(Graphics);
                graphics.fillColor = new Color(91, 164, 72, 160);
                graphics.ellipse(0, -24, 96, 24);
                graphics.fill();
                graphics.fillColor = new Color(129, 77, 39, 255);
                graphics.ellipse(0, -2, 88, 52);
                graphics.fill();
                graphics.strokeColor = new Color(92, 55, 30, 255);
                graphics.lineWidth = 5;
                graphics.ellipse(0, -2, 88, 52);
                graphics.stroke();
                graphics.strokeColor = new Color(174, 108, 55, 255);
                graphics.lineWidth = 3;
                graphics.moveTo(-55, -28);
                graphics.quadraticCurveTo(-18, -45, 20, -38);
                graphics.moveTo(-38, 18);
                graphics.quadraticCurveTo(0, 34, 43, 16);
                graphics.stroke();
                graphics.fillColor = new Color(84, 48, 30, 255);
                graphics.ellipse(0, -5, 72, 40);
                graphics.fill();
                graphics.fillColor = new Color(48, 28, 23, 255);
                graphics.ellipse(0, -12, 58, 30);
                graphics.fill();

                ArtResourceManager.applySprite(hole, ArtAssetKey.WoodHole, 188, 188);

                holeRoot.addChild(hole);
                hole.setPosition(startX + col * gapX, startY - row * gapY, 0);
                holes.push(hole);
            }
        }

        return holes;
    }

    private createPanel(name: string, active: boolean): Node {
        const layout = this.getLayoutSize();
        const panel = new Node(name);
        panel.layer = Layers.Enum.UI_2D;
        panel.active = active;
        panel.addComponent(UITransform).setContentSize(layout.width, layout.height);
        this.ensureWidget(panel);
        this.node.addChild(panel);
        panel.setPosition(Vec3.ZERO);
        return panel;
    }

    private createLabel(name: string, text: string, fontSize: number, color: Color, width = 360, height = 90): Node {
        const node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(width, height);
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 8;
        label.color = color;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        return node;
    }

    private createButton(
        name: string,
        text: string,
        color: Color,
        onClick: () => void,
        width = 300,
        height = 88,
        fontSize = 34,
    ): Node {
        const node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(width, height);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = new Color(118, 74, 37, 255);
        graphics.roundRect(-width / 2, -height / 2 - 8, width, height, 24);
        graphics.fill();
        graphics.fillColor = color;
        graphics.roundRect(-width / 2, -height / 2, width, height, 24);
        graphics.fill();
        graphics.fillColor = new Color(255, 255, 255, 65);
        graphics.roundRect(-width / 2 + 18, height / 2 - 24, width - 36, 12, 6);
        graphics.fill();
        graphics.strokeColor = new Color(112, 72, 39, 255);
        graphics.lineWidth = 4;
        graphics.roundRect(-width / 2, -height / 2, width, height, 24);
        graphics.stroke();
        node.addComponent(Button);
        this.bindButtonPressAnimation(node);
        node.on(Node.EventType.TOUCH_END, () => {
            onClick();
            // 页面可能在回调中立即隐藏，仍要保证下次显示时按钮比例正确。
            node.setScale(Vec3.ONE);
        });

        const labelNode = this.createLabel('Label', text, fontSize, new Color(91, 52, 31, 255));
        labelNode.getComponent(UITransform)!.setContentSize(width, height);
        node.addChild(labelNode);
        labelNode.setPosition(0, 0, 0);
        return node;
    }

    private createSoundButton(name: string, audioManager: AudioManager): Node {
        const soundButton = this.createButton(
            name,
            audioManager.isSoundEnabled() ? '声音：开' : '声音：关',
            new Color(255, 232, 149, 255),
            () => {
                audioManager.playButtonClick();
                const enabled = audioManager.toggleSound();
                const label = soundButton.getChildByName('Label')?.getComponent(Label);
                if (label) {
                    label.string = enabled ? '声音：开' : '声音：关';
                }
            },
            220,
            72,
            28,
        );
        return soundButton;
    }

    private drawGrassBackground(background: Node): void {
        const layout = this.getLayoutSize();
        const graphics = background.addComponent(Graphics);
        graphics.fillColor = new Color(142, 219, 98, 255);
        graphics.rect(-layout.width / 2, -layout.height / 2, layout.width, layout.height);
        graphics.fill();

        graphics.fillColor = new Color(111, 196, 82, 255);
        graphics.moveTo(-layout.width / 2, -layout.height / 2 + 210);
        graphics.bezierCurveTo(-170, -layout.height / 2 + 300, 120, -layout.height / 2 + 160, layout.width / 2, -layout.height / 2 + 260);
        graphics.lineTo(layout.width / 2, -layout.height / 2);
        graphics.lineTo(-layout.width / 2, -layout.height / 2);
        graphics.close();
        graphics.fill();

        graphics.fillColor = new Color(111, 200, 82, 255);
        for (let i = 0; i < 28; i++) {
            const x = -350 + i * 28;
            graphics.circle(x, -layout.height / 2 + 92 + (i % 4) * 18, 18 + (i % 2) * 6);
        }
        graphics.fill();

        graphics.fillColor = new Color(255, 238, 127, 255);
        this.drawFlower(graphics, -285, layout.height / 2 - 250);
        this.drawFlower(graphics, 292, layout.height / 2 - 430);
        this.drawFlower(graphics, -250, -layout.height / 2 + 420);
        this.drawFlower(graphics, 310, -layout.height / 2 + 230);
        graphics.fill();
    }

    private drawPauseMask(mask: Node): void {
        const layout = this.getLayoutSize();
        const graphics = mask.addComponent(Graphics);
        graphics.fillColor = new Color(0, 0, 0, 135);
        graphics.rect(-layout.width / 2, -layout.height / 2, layout.width, layout.height);
        graphics.fill();
    }

    private getLayoutSize(): { width: number; height: number } {
        const visibleSize = view.getVisibleSize();
        return {
            width: Math.max(DESIGN_WIDTH, visibleSize.width),
            height: Math.max(DESIGN_HEIGHT, visibleSize.height),
        };
    }

    private createStatusPill(name: string, color: Color): Node {
        const node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        const width = 300;
        const height = 86;
        node.addComponent(UITransform).setContentSize(width, height);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = new Color(118, 74, 37, 255);
        graphics.roundRect(-width / 2, -height / 2 - 5, width, height, 26);
        graphics.fill();
        graphics.fillColor = color;
        graphics.roundRect(-width / 2, -height / 2, width, height, 26);
        graphics.fill();
        return node;
    }

    private createCircleIcon(name: string, color: Color): Node {
        const node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(52, 52);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = color;
        graphics.circle(0, 0, 24);
        graphics.fill();
        graphics.fillColor = new Color(255, 255, 255, 95);
        graphics.circle(-7, 8, 8);
        graphics.fill();
        return node;
    }

    private drawStarIcon(node: Node): void {
        const graphics = node.getComponent(Graphics);
        if (!graphics) {
            return;
        }

        graphics.fillColor = new Color(255, 255, 255, 210);
        const points = [
            [0, 18],
            [6, 6],
            [19, 5],
            [9, -4],
            [12, -17],
            [0, -10],
            [-12, -17],
            [-9, -4],
            [-19, 5],
            [-6, 6],
        ];
        graphics.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i][0], points[i][1]);
        }
        graphics.close();
        graphics.fill();
    }

    private drawClockIcon(node: Node): void {
        const graphics = node.getComponent(Graphics);
        if (!graphics) {
            return;
        }

        graphics.strokeColor = new Color(255, 255, 255, 225);
        graphics.lineWidth = 5;
        graphics.circle(0, 0, 15);
        graphics.stroke();
        graphics.moveTo(0, 0);
        graphics.lineTo(0, 10);
        graphics.moveTo(0, 0);
        graphics.lineTo(9, -6);
        graphics.stroke();
    }

    private createWoodSign(name: string, width: number, height: number): Node {
        const node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(width, height);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = new Color(112, 70, 38, 255);
        graphics.roundRect(-width / 2, -height / 2, width, height, 34);
        graphics.fill();
        graphics.fillColor = new Color(163, 102, 51, 255);
        graphics.roundRect(-width / 2 + 14, -height / 2 + 12, width - 28, height - 24, 28);
        graphics.fill();
        graphics.strokeColor = new Color(91, 52, 31, 255);
        graphics.lineWidth = 5;
        graphics.moveTo(-width / 2 + 70, 18);
        graphics.quadraticCurveTo(-120, 38, 25, 20);
        graphics.moveTo(-width / 2 + 90, -28);
        graphics.quadraticCurveTo(-10, -8, width / 2 - 120, -30);
        graphics.stroke();
        return node;
    }

    private createFieldFrame(name: string): Node {
        const node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(700, 760);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = new Color(121, 204, 86, 115);
        graphics.roundRect(-350, -380, 700, 760, 38);
        graphics.fill();
        graphics.strokeColor = new Color(96, 181, 75, 180);
        graphics.lineWidth = 5;
        graphics.roundRect(-350, -380, 700, 760, 38);
        graphics.stroke();
        return node;
    }

    private createResultCard(): Node {
        const node = new Node('ResultCard');
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(620, 520);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = new Color(118, 74, 37, 255);
        graphics.roundRect(-310, -260, 620, 520, 40);
        graphics.fill();
        graphics.fillColor = new Color(255, 247, 206, 255);
        graphics.roundRect(-292, -242, 584, 484, 34);
        graphics.fill();
        graphics.strokeColor = new Color(173, 110, 55, 255);
        graphics.lineWidth = 6;
        graphics.roundRect(-292, -242, 584, 484, 34);
        graphics.stroke();
        return node;
    }

    private drawFlower(graphics: Graphics, x: number, y: number): void {
        graphics.circle(x - 8, y, 7);
        graphics.circle(x + 8, y, 7);
        graphics.circle(x, y - 8, 7);
        graphics.circle(x, y + 8, 7);
        graphics.circle(x, y, 5);
    }

    private createCuteMolePreview(): Node {
        const node = new Node('CuteMolePreview');
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform).setContentSize(220, 220);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = new Color(104, 63, 37, 255);
        graphics.ellipse(0, -70, 108, 42);
        graphics.fill();
        graphics.fillColor = new Color(139, 83, 45, 255);
        graphics.circle(0, -10, 74);
        graphics.fill();
        graphics.fillColor = new Color(200, 132, 78, 255);
        graphics.circle(0, -33, 46);
        graphics.fill();
        graphics.fillColor = new Color(255, 255, 255, 255);
        graphics.circle(-27, 18, 18);
        graphics.circle(27, 18, 18);
        graphics.fill();
        graphics.fillColor = new Color(35, 22, 18, 255);
        graphics.circle(-27, 18, 8);
        graphics.circle(27, 18, 8);
        graphics.circle(0, -6, 7);
        graphics.fill();
        ArtResourceManager.applySprite(node, ArtAssetKey.NormalMole, 220, 220);
        return node;
    }

    private ensureWidget(node: Node): void {
        const widget = node.getComponent(Widget) ?? node.addComponent(Widget);
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.bottom = 0;
        widget.alignMode = Widget.AlignMode.ALWAYS;
    }

    private clearGeneratedNodes(): void {
        const generatedNames = new Set([
            'Background',
            'HomePanel',
            'GamePanel',
            'ResultPanel',
            'PauseMask',
            'EffectsLayer',
            'TutorialPanel',
            'Managers',
        ]);

        const children = [...this.node.children];
        for (const child of children) {
            if (generatedNames.has(child.name)) {
                child.destroy();
            }
        }
    }

    private showHitFeedback(effectsLayer: Node, score: number, combo: number, target: Node): void {
        const worldPosition = target.worldPosition;
        const localPosition = new Vec3();
        effectsLayer.inverseTransformPoint(localPosition, worldPosition);

        this.showHitBurst(effectsLayer, localPosition, score);

        const scoreText = score > 0 ? `+${score}` : `${score}`;
        const labelText = score > 0 && combo >= 2 ? `${scoreText}  x${combo}` : scoreText;
        const labelColor = score < 0
            ? new Color(255, 92, 82, 255)
            : score >= 5
                ? new Color(255, 223, 67, 255)
                : new Color(255, 247, 124, 255);
        const labelNode = this.createLabel('HitFloatText', labelText, combo >= 5 || score >= 5 ? 42 : 36, labelColor, 240, 70);
        effectsLayer.addChild(labelNode);
        labelNode.setPosition(localPosition.x, localPosition.y + 70, 0);

        tween(labelNode)
            .set({ scale: new Vec3(0.75, 0.75, 1) })
            .to(0.12, { scale: new Vec3(1.18, 1.18, 1) })
            .to(0.55, {
                position: new Vec3(localPosition.x, localPosition.y + 148, 0),
                scale: new Vec3(0.95, 0.95, 1),
            })
            .call(() => {
                labelNode.destroy();
            })
            .start();
    }

    /** 为所有按钮提供一致的按压回弹，避免每个页面重复配置。 */
    private bindButtonPressAnimation(button: Node): void {
        const restore = (): void => {
            Tween.stopAllByTarget(button);
            tween(button)
                .to(0.08, { scale: Vec3.ONE }, { easing: 'backOut' })
                .start();
        };

        button.on(Node.EventType.TOUCH_START, () => {
            Tween.stopAllByTarget(button);
            tween(button)
                .to(0.05, { scale: new Vec3(0.94, 0.94, 1) }, { easing: 'quadOut' })
                .start();
        });
        button.on(Node.EventType.TOUCH_END, restore);
        button.on(Node.EventType.TOUCH_CANCEL, restore);
    }

    /** 命中时显示扩散光圈和短促粒子，颜色区分普通、金色与炸弹。 */
    private showHitBurst(effectsLayer: Node, position: Vec3, score: number): void {
        const burst = new Node('HitBurst');
        burst.layer = Layers.Enum.UI_2D;
        burst.addComponent(UITransform).setContentSize(220, 220);
        const opacity = burst.addComponent(UIOpacity);
        const graphics = burst.addComponent(Graphics);
        const color = score < 0
            ? new Color(255, 82, 72, 230)
            : score >= 5
                ? new Color(255, 220, 52, 245)
                : new Color(255, 249, 154, 225);

        graphics.strokeColor = color;
        graphics.lineWidth = score >= 5 ? 10 : 7;
        graphics.circle(0, 0, score >= 5 ? 62 : 48);
        graphics.stroke();

        graphics.fillColor = color;
        const particleCount = score >= 5 ? 10 : 7;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const radius = score >= 5 ? 86 : 72;
            graphics.circle(Math.cos(angle) * radius, Math.sin(angle) * radius, i % 2 === 0 ? 8 : 5);
        }
        graphics.fill();

        effectsLayer.addChild(burst);
        burst.setPosition(position.x, position.y + 4, 0);
        burst.setScale(new Vec3(0.3, 0.3, 1));
        opacity.opacity = 255;

        tween(burst)
            .to(0.24, { scale: new Vec3(score >= 5 ? 1.55 : 1.35, score >= 5 ? 1.55 : 1.35, 1) }, { easing: 'quadOut' })
            .start();
        tween(opacity)
            .delay(0.08)
            .to(0.2, { opacity: 0 })
            .call(() => burst.destroy())
            .start();
    }

    /** 炸弹命中时轻微震动游戏层，幅度短且可控，不影响节点最终布局。 */
    private playScreenShake(gamePanel: Node): void {
        Tween.stopAllByTarget(gamePanel);
        gamePanel.setPosition(Vec3.ZERO);
        tween(gamePanel)
            .to(0.035, { position: new Vec3(-9, 5, 0) })
            .to(0.035, { position: new Vec3(8, -4, 0) })
            .to(0.035, { position: new Vec3(-5, -3, 0) })
            .to(0.045, { position: Vec3.ZERO })
            .start();
    }

    private getDifficultyText(level: number): string {
        if (level >= 3) {
            return '难度：突击';
        }

        if (level >= 2) {
            return '难度：加速';
        }

        return '难度：轻松';
    }

    private parseScoreFromLabel(text: string): number {
        const match = text.match(/\d+/);
        return match ? Number(match[0]) : 0;
    }
}
