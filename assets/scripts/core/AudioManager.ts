import { _decorator, AudioClip, AudioSource, Component, resources } from 'cc';
import { StorageManager } from './StorageManager';

const { ccclass, property } = _decorator;

/**
 * 统一管理音效播放。
 * 微信/抖音小游戏环境中不要直接使用浏览器 Audio，这里只依赖 Cocos 的 AudioSource。
 */
@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioSource)
    public audioSource: AudioSource | null = null;

    @property(AudioSource)
    public musicSource: AudioSource | null = null;

    @property(AudioClip)
    public buttonClickClip: AudioClip | null = null;

    @property(AudioClip)
    public moleAppearClip: AudioClip | null = null;

    @property(AudioClip)
    public hitMoleClip: AudioClip | null = null;

    @property(AudioClip)
    public timeoutClip: AudioClip | null = null;

    @property(AudioClip)
    public gameOverClip: AudioClip | null = null;

    @property(AudioClip)
    public backgroundMusicClip: AudioClip | null = null;

    private soundEnabled = true;

    protected onLoad(): void {
        this.soundEnabled = StorageManager.isSoundEnabled();
        this.loadDefaultClips();
    }

    public playButtonClick(): void {
        this.playOneShot(this.buttonClickClip);
    }

    public playMoleAppear(): void {
        this.playOneShot(this.moleAppearClip);
    }

    public playHitMole(): void {
        this.playOneShot(this.hitMoleClip);
    }

    public playTimeout(): void {
        this.playOneShot(this.timeoutClip);
    }

    public playGameOver(): void {
        this.playOneShot(this.gameOverClip);
    }

    /** 在真实用户点击后再次尝试启动音乐，兼容自动播放限制。 */
    public ensureBackgroundMusic(): void {
        this.playBackgroundMusic();
    }

    public toggleSound(): boolean {
        this.setSoundEnabled(!this.soundEnabled);
        return this.soundEnabled;
    }

    public setSoundEnabled(enabled: boolean): void {
        this.soundEnabled = enabled;
        StorageManager.saveSoundEnabled(enabled);
        if (!enabled) {
            this.audioSource?.stop();
            this.musicSource?.stop();
            return;
        }

        this.playBackgroundMusic();
    }

    public isSoundEnabled(): boolean {
        return this.soundEnabled;
    }

    private playOneShot(clip: AudioClip | null): void {
        if (!this.soundEnabled || !this.audioSource || !clip) {
            return;
        }

        this.audioSource.playOneShot(clip, 1);
    }

    private loadDefaultClips(): void {
        this.loadClipIfEmpty('audio/sfx_button_click', (clip) => {
            this.buttonClickClip = clip;
        });
        this.loadClipIfEmpty('audio/sfx_mole_appear', (clip) => {
            this.moleAppearClip = clip;
        });
        this.loadClipIfEmpty('audio/sfx_hit_mole', (clip) => {
            this.hitMoleClip = clip;
        });
        this.loadClipIfEmpty('audio/sfx_countdown_end', (clip) => {
            this.timeoutClip = clip;
        });
        this.loadClipIfEmpty('audio/sfx_game_win', (clip) => {
            this.gameOverClip = clip;
        });
        this.loadClipIfEmpty('audio/bgm_meadow_loop', (clip) => {
            this.backgroundMusicClip = clip;
            this.playBackgroundMusic();
        });
    }

    private playBackgroundMusic(): void {
        if (!this.soundEnabled || !this.musicSource || !this.backgroundMusicClip) {
            return;
        }

        this.musicSource.clip = this.backgroundMusicClip;
        this.musicSource.loop = true;
        this.musicSource.volume = 0.22;
        if (!this.musicSource.playing) {
            this.musicSource.play();
        }
    }

    private loadClipIfEmpty(path: string, assign: (clip: AudioClip) => void): void {
        resources.load(path, AudioClip, (error, clip) => {
            if (error || !clip) {
                return;
            }

            assign(clip);
        });
    }
}
