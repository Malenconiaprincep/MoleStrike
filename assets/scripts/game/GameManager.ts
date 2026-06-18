import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../core/AudioManager';
import { AnalyticsManager } from '../core/AnalyticsManager';
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
    private roundBombHits = 0;
    private roundMisses = 0;
    private roundMaxCombo = 0;
    private roundStartedAt = 0;

    protected start(): void {
        AnalyticsManager.initialize();
        PlatformAdapter.setupShareMenu();
        void PlatformAdapter.login().then((result) => {
            AnalyticsManager.track('login_result', {
                platform: result.platform,
                success: result.success,
                error: result.errorMessage,
            });
        });
        this.enterHome();
    }

    public handleStartButton(): void {
        this.audioManager?.playButtonClick();
        this.audioManager?.ensureBackgroundMusic();
        if (this.tutorialManager?.shouldShow()) {
            AnalyticsManager.track('tutorial_open');
            this.tutorialManager.show(() => this.startGame('home'));
            return;
        }
        this.startGame('home');
    }

    public handleReplayButton(): void {
        this.audioManager?.playButtonClick();
        this.startGame('replay');
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

    public startGame(source: 'home' | 'replay' = 'home'): void {
        this.state = GameState.Playing;
        this.difficultyLevel = 1;
        this.roundPositiveHits = 0;
        this.roundGoldenHits = 0;
        this.roundBombHits = 0;
        this.roundMisses = 0;
        this.roundMaxCombo = 0;
        this.roundStartedAt = Date.now();
        const playCount = StorageManager.incrementPlayCount();
        AnalyticsManager.track('game_start', { source, play_count: playCount });
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
                this.roundMisses += 1;
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
            if (score < 0) {
                this.roundBombHits += 1;
            }
            PlatformAdapter.vibrateShort(score < 0 ? 'medium' : 'light');
            const combo = score > 0 ? this.comboManager?.addCombo() ?? 0 : 0;
            if (score < 0) {
                this.comboManager?.breakCombo();
            }
            this.roundMaxCombo = Math.max(this.roundMaxCombo, combo);
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
        AnalyticsManager.track('game_pause', { seconds_left: this.timerManager?.getSecondsLeft() ?? 0 });
    }

    public resumeGame(): void {
        if (this.state !== GameState.Paused) {
            return;
        }

        this.state = GameState.Playing;
        this.timerManager?.resumeTimer();
        this.moleManager?.resumeSpawning();
        this.uiManager?.showPauseMask(false);
        AnalyticsManager.track('game_resume', { seconds_left: this.timerManager?.getSecondsLeft() ?? 0 });
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
        const bestScore = StorageManager.getBestScore();
        PlatformAdapter.submitScore(bestScore);
        const challengeUpdate = DailyChallengeManager.recordRound({
            score: finalScore,
            positiveHits: this.roundPositiveHits,
            goldenHits: this.roundGoldenHits,
        });
        AnalyticsManager.track('game_end', {
            score: finalScore,
            best_score: bestScore,
            positive_hits: this.roundPositiveHits,
            golden_hits: this.roundGoldenHits,
            bomb_hits: this.roundBombHits,
            misses: this.roundMisses,
            max_combo: this.roundMaxCombo,
            duration_ms: Math.max(0, Date.now() - this.roundStartedAt),
            challenge_completed: challengeUpdate.snapshot.completed,
            new_record: isNewRecord,
        });
        this.uiManager?.showDailyChallenge(challengeUpdate.snapshot, challengeUpdate.justCompleted);
        this.uiManager?.showResult(finalScore, bestScore, isNewRecord, this.getRatingText(finalScore));
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
