import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

type TimerCallback = () => void;
type TimerTickCallback = (secondsLeft: number) => void;

/**
 * 倒计时管理器。
 * 使用 update 驱动，避免依赖平台计时器，小游戏端表现更稳定。
 */
@ccclass('TimerManager')
export class TimerManager extends Component {
    @property(Label)
    public timeLabel: Label | null = null;

    private totalSeconds = 60;
    private secondsLeft = 60;
    private running = false;
    private paused = false;
    private onComplete: TimerCallback | null = null;
    private onTick: TimerTickCallback | null = null;
    private lastDisplaySeconds = -1;

    public startTimer(seconds: number, onComplete: TimerCallback, onTick?: TimerTickCallback): void {
        this.totalSeconds = Math.max(1, seconds);
        this.secondsLeft = this.totalSeconds;
        this.running = true;
        this.paused = false;
        this.onComplete = onComplete;
        this.onTick = onTick ?? null;
        this.lastDisplaySeconds = -1;
        this.refreshView(true);
    }

    public pauseTimer(): void {
        if (this.running) {
            this.paused = true;
        }
    }

    public resumeTimer(): void {
        if (this.running) {
            this.paused = false;
        }
    }

    public stopTimer(): void {
        this.running = false;
        this.paused = false;
        this.onComplete = null;
        this.onTick = null;
    }

    public resetTimer(seconds: number): void {
        this.totalSeconds = Math.max(1, seconds);
        this.secondsLeft = this.totalSeconds;
        this.running = false;
        this.paused = false;
        this.lastDisplaySeconds = -1;
        this.refreshView(true);
    }

    public getSecondsLeft(): number {
        return Math.max(0, Math.ceil(this.secondsLeft));
    }

    protected update(deltaTime: number): void {
        if (!this.running || this.paused) {
            return;
        }

        this.secondsLeft -= deltaTime;
        this.refreshView();

        if (this.secondsLeft <= 0) {
            this.secondsLeft = 0;
            this.running = false;
            this.refreshView(true);
            this.onComplete?.();
        }
    }

    private refreshView(force = false): void {
        const displaySeconds = this.getSecondsLeft();
        if (!force && displaySeconds === this.lastDisplaySeconds) {
            return;
        }

        this.lastDisplaySeconds = displaySeconds;
        if (this.timeLabel) {
            this.timeLabel.string = `${displaySeconds}`;
        }

        this.onTick?.(displaySeconds);
    }
}
