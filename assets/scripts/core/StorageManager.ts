import { sys } from 'cc';
import { DailyChallengeState } from './GameTypes';

const BEST_SCORE_KEY = 'mole_strike_best_score';
const SOUND_ENABLED_KEY = 'mole_strike_sound_enabled';
const TUTORIAL_COMPLETED_KEY = 'mole_strike_tutorial_completed';
const DAILY_CHALLENGE_KEY = 'mole_strike_daily_challenge';
const MEDAL_COUNT_KEY = 'mole_strike_medal_count';

/**
 * 本地存档管理。
 * 通过 Cocos sys.localStorage 访问平台存储，微信/抖音小游戏会由引擎适配。
 */
export class StorageManager {
    public static getBestScore(): number {
        const rawValue = sys.localStorage.getItem(BEST_SCORE_KEY);
        const score = Number(rawValue);
        return Number.isFinite(score) ? score : 0;
    }

    public static saveBestScore(score: number): void {
        const bestScore = Math.max(this.getBestScore(), score);
        sys.localStorage.setItem(BEST_SCORE_KEY, `${bestScore}`);
    }

    public static isSoundEnabled(): boolean {
        const rawValue = sys.localStorage.getItem(SOUND_ENABLED_KEY);
        return rawValue !== 'false';
    }

    public static saveSoundEnabled(enabled: boolean): void {
        sys.localStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
    }

    public static hasCompletedTutorial(): boolean {
        return sys.localStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
    }

    public static saveTutorialCompleted(): void {
        sys.localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    }

    public static getDailyChallengeState(): DailyChallengeState | null {
        const rawValue = sys.localStorage.getItem(DAILY_CHALLENGE_KEY);
        if (!rawValue) {
            return null;
        }

        try {
            const value = JSON.parse(rawValue) as Partial<DailyChallengeState>;
            if (typeof value.dateKey !== 'string' || !Number.isFinite(value.progress)) {
                return null;
            }

            return {
                dateKey: value.dateKey,
                progress: Math.max(0, Math.floor(value.progress ?? 0)),
                completed: value.completed === true,
                rewardGranted: value.rewardGranted === true,
            };
        } catch {
            return null;
        }
    }

    public static saveDailyChallengeState(state: DailyChallengeState): void {
        sys.localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(state));
    }

    public static getMedalCount(): number {
        const count = Number(sys.localStorage.getItem(MEDAL_COUNT_KEY));
        return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
    }

    public static addMedals(count: number): number {
        const nextCount = this.getMedalCount() + Math.max(0, Math.floor(count));
        sys.localStorage.setItem(MEDAL_COUNT_KEY, `${nextCount}`);
        return nextCount;
    }
}
