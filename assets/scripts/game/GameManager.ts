import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../core/AudioManager';
import { DEFAULT_GAME_SECONDS, GameState } from '../core/GameTypes';
import { StorageManager } from '../core/StorageManager';
import { PlatformAdapter } from '../platform/PlatformAdapter';
import { UIManager } from '../ui/UIManager';
import { TutorialManager } from '../ui/TutorialManager';
import { ComboManager } from './ComboManager';
import { DailyChallengeManager } from './DailyChallengeManager';
import { MoleManager } from './MoleManager';
import { ScoreManager } from './ScoreManager';
import { TimerManager } from './TimerManager';

const { ccclass, property } = _decorator;

/**
 * 游戏总控。
 * 只做状态编排，把计时、计分、地鼠生成和 UI 显示交给对应模块。
 */
@ccclass('GameManager')
export class GameManager extends Component {
    @property(ScoreManager)
    public scoreManager: ScoreManager | null = null;

    @property(TimerManager)
    public timerManager: TimerManager | null = null;

    @property(MoleManager)
    public moleManager: MoleManager | null = null;

    @property(UIManager)
    public uiManager: UIManager | null = null;

    @property(AudioManager)
    public audioManager: AudioManager | null = null;

    @property(ComboManager)
    public comboManager: ComboManager | null = null;

    @property(TutorialManager)
    public tutorialManager: TutorialManager | null = null;

    @property
    public gameSeconds = DEFAULT_GAME_SECONDS;

    public onHitFeedback: ((score: number, combo: number, target: Node) => void) | null = null;
    public onDifficultyChanged: ((level: number) => void) | null = null;

    private state = GameState.Home;
    private difficultyLevel = 1;
    private roundPositiveHits = 0;
    private roundGoldenHits = 0;

    protected start(): void {
        PlatformAdapter.setupShareMenu();
        this.enterHome();
    }

    public handleStartButton(): void {
        this.audioManager?.playButtonClick();
        this.audioManager?.ensureBackgroundMusic();
        if (this.tutorialManager?.shouldShow()) {
            this.tutorialManager.show(() => this.startGame());
            return;
        }
        this.startGame();
    }

    public handleReplayButton(): void {
        this.audioManager?.playButtonClick();
        this.startGame();
    }

    public handleHomeButton(): void {
        this.audioManager?.playButtonClick();
        this.enterHome();
    }

    public handlePauseButton(): void {
        this.audioManager?.playButtonClick();

        if (this.state === GameState.Playing) {
            this.pauseGame();
            return;
        }

        if (this.state === GameState.Paused) {
            this.resumeGame();
        }
    }

    public startGame(): void {
        this.state = GameState.Playing;
        this.difficultyLevel = 1;
        this.roundPositiveHits = 0;
        this.roundGoldenHits = 0;
        this.scoreManager?.reset();
        this.comboManager?.reset();
        this.uiManager?.showGame();
        this.moleManager?.setDifficultyLevel(this.difficultyLevel);
        this.onDifficultyChanged?.(this.difficultyLevel);

        this.timerManager?.startTimer(
            this.gameSeconds,
            () => this.finishGame(),
            (secondsLeft) => this.updateDifficulty(secondsLeft),
        );

        this.moleManager?.startSpawning((score, hit, target) => {
            if (!hit) {
                this.comboManager?.breakCombo();
                return;
            }

            this.scoreManager?.addScore(score);
            if (score > 0) {
                this.roundPositiveHits += 1;
            }
            if (score >= 5) {
                this.roundGoldenHits += 1;
            }
            PlatformAdapter.vibrateShort(score < 0 ? 'medium' : 'light');
            const combo = score > 0 ? this.comboManager?.addCombo() ?? 0 : 0;
            if (score < 0) {
                this.comboManager?.breakCombo();
            }
            this.onHitFeedback?.(score, combo, target);
        });
    }

    public pauseGame(): void {
        if (this.state !== GameState.Playing) {
            return;
        }

        this.state = GameState.Paused;
        this.timerManager?.pauseTimer();
        this.moleManager?.pauseSpawning();
        this.uiManager?.showPauseMask(true);
    }

    public resumeGame(): void {
        if (this.state !== GameState.Paused) {
            return;
        }

        this.state = GameState.Playing;
        this.timerManager?.resumeTimer();
        this.moleManager?.resumeSpawning();
        this.uiManager?.showPauseMask(false);
    }

    private enterHome(): void {
        this.state = GameState.Home;
        this.timerManager?.stopTimer();
        this.timerManager?.resetTimer(this.gameSeconds);
        this.scoreManager?.reset();
        this.comboManager?.reset();
        this.moleManager?.stopSpawning();
        this.uiManager?.showDailyChallenge(DailyChallengeManager.getSnapshot());
        this.uiManager?.showHome();
    }

    private finishGame(): void {
        if (this.state === GameState.GameOver) {
            return;
        }

        this.state = GameState.GameOver;
        this.moleManager?.stopSpawning();
        this.audioManager?.playTimeout();
        this.audioManager?.playGameOver();
        const finalScore = this.scoreManager?.getScore() ?? 0;
        const previousBestScore = StorageManager.getBestScore();
        const isNewRecord = finalScore > previousBestScore;
        StorageManager.saveBestScore(finalScore);
        PlatformAdapter.submitScore(finalScore);
        const challengeUpdate = DailyChallengeManager.recordRound({
            score: finalScore,
            positiveHits: this.roundPositiveHits,
            goldenHits: this.roundGoldenHits,
        });
        this.uiManager?.showDailyChallenge(challengeUpdate.snapshot, challengeUpdate.justCompleted);
        this.uiManager?.showResult(finalScore, StorageManager.getBestScore(), isNewRecord, this.getRatingText(finalScore));
    }

    private updateDifficulty(secondsLeft: number): void {
        if (this.state !== GameState.Playing) {
            return;
        }

        const elapsedSeconds = this.gameSeconds - secondsLeft;
        const nextLevel = elapsedSeconds >= 40 ? 3 : elapsedSeconds >= 20 ? 2 : 1;
        if (nextLevel === this.difficultyLevel) {
            return;
        }

        this.difficultyLevel = nextLevel;
        this.moleManager?.setDifficultyLevel(nextLevel);
        this.onDifficultyChanged?.(nextLevel);
    }

    private getRatingText(score: number): string {
        if (score >= 45) {
            return '评级：地鼠克星';
        }

        if (score >= 25) {
            return '评级：神射手';
        }

        if (score >= 10) {
            return '评级：熟练队员';
        }

        return '评级：见习队员';
    }
}
