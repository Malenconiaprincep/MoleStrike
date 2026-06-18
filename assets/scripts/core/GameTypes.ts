/**
 * 游戏公共类型定义。
 * 所有模块共享的枚举和配置集中放在这里，避免字符串散落在业务代码中。
 */

export enum GameState {
    Home = 'Home',
    Playing = 'Playing',
    Paused = 'Paused',
    GameOver = 'GameOver',
}

export enum MoleType {
    Normal = 'Normal',
    Golden = 'Golden',
    Bomb = 'Bomb',
}

export interface MoleConfig {
    type: MoleType;
    score: number;
    staySeconds: number;
}

export type DailyChallengeKind = 'score' | 'hits' | 'golden';

export interface DailyChallengeState {
    dateKey: string;
    progress: number;
    completed: boolean;
    rewardGranted: boolean;
}

export interface DailyChallengeSnapshot extends DailyChallengeState {
    kind: DailyChallengeKind;
    title: string;
    target: number;
    medalCount: number;
}

export interface RoundStats {
    score: number;
    positiveHits: number;
    goldenHits: number;
}

export const DEFAULT_GAME_SECONDS = 60;

export const NORMAL_MOLE_CONFIG: MoleConfig = {
    type: MoleType.Normal,
    score: 1,
    staySeconds: 1,
};

export const GOLDEN_MOLE_CONFIG: MoleConfig = {
    type: MoleType.Golden,
    score: 5,
    staySeconds: 0.8,
};

export const BOMB_MOLE_CONFIG: MoleConfig = {
    type: MoleType.Bomb,
    score: -3,
    staySeconds: 0.9,
};
