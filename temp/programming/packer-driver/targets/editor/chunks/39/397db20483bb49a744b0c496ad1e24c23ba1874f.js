System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AudioClip, AudioSource, Component, resources, StorageManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, AudioManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "./StorageManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      AudioClip = _cc.AudioClip;
      AudioSource = _cc.AudioSource;
      Component = _cc.Component;
      resources = _cc.resources;
    }, function (_unresolved_2) {
      StorageManager = _unresolved_2.StorageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "52157PX34VE2YHCAjazrpf1", "AudioManager", undefined);

      __checkObsolete__(['_decorator', 'AudioClip', 'AudioSource', 'Component', 'resources']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 统一管理音效播放。
       * 微信/抖音小游戏环境中不要直接使用浏览器 Audio，这里只依赖 Cocos 的 AudioSource。
       */

      _export("AudioManager", AudioManager = (_dec = ccclass('AudioManager'), _dec2 = property(AudioSource), _dec3 = property(AudioSource), _dec4 = property(AudioClip), _dec5 = property(AudioClip), _dec6 = property(AudioClip), _dec7 = property(AudioClip), _dec8 = property(AudioClip), _dec9 = property(AudioClip), _dec(_class = (_class2 = class AudioManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "audioSource", _descriptor, this);

          _initializerDefineProperty(this, "musicSource", _descriptor2, this);

          _initializerDefineProperty(this, "buttonClickClip", _descriptor3, this);

          _initializerDefineProperty(this, "moleAppearClip", _descriptor4, this);

          _initializerDefineProperty(this, "hitMoleClip", _descriptor5, this);

          _initializerDefineProperty(this, "timeoutClip", _descriptor6, this);

          _initializerDefineProperty(this, "gameOverClip", _descriptor7, this);

          _initializerDefineProperty(this, "backgroundMusicClip", _descriptor8, this);

          this.soundEnabled = true;
        }

        onLoad() {
          this.soundEnabled = (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).isSoundEnabled();
          this.loadDefaultClips();
        }

        playButtonClick() {
          this.playOneShot(this.buttonClickClip);
        }

        playMoleAppear() {
          this.playOneShot(this.moleAppearClip);
        }

        playHitMole() {
          this.playOneShot(this.hitMoleClip);
        }

        playTimeout() {
          this.playOneShot(this.timeoutClip);
        }

        playGameOver() {
          this.playOneShot(this.gameOverClip);
        }
        /** 在真实用户点击后再次尝试启动音乐，兼容自动播放限制。 */


        ensureBackgroundMusic() {
          this.playBackgroundMusic();
        }

        toggleSound() {
          this.setSoundEnabled(!this.soundEnabled);
          return this.soundEnabled;
        }

        setSoundEnabled(enabled) {
          this.soundEnabled = enabled;
          (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).saveSoundEnabled(enabled);

          if (!enabled) {
            var _this$audioSource, _this$musicSource;

            (_this$audioSource = this.audioSource) == null || _this$audioSource.stop();
            (_this$musicSource = this.musicSource) == null || _this$musicSource.stop();
            return;
          }

          this.playBackgroundMusic();
        }

        isSoundEnabled() {
          return this.soundEnabled;
        }

        playOneShot(clip) {
          if (!this.soundEnabled || !this.audioSource || !clip) {
            return;
          }

          this.audioSource.playOneShot(clip, 1);
        }

        loadDefaultClips() {
          this.loadClipIfEmpty('audio/sfx_button_click', clip => {
            this.buttonClickClip = clip;
          });
          this.loadClipIfEmpty('audio/sfx_mole_appear', clip => {
            this.moleAppearClip = clip;
          });
          this.loadClipIfEmpty('audio/sfx_hit_mole', clip => {
            this.hitMoleClip = clip;
          });
          this.loadClipIfEmpty('audio/sfx_countdown_end', clip => {
            this.timeoutClip = clip;
          });
          this.loadClipIfEmpty('audio/sfx_game_win', clip => {
            this.gameOverClip = clip;
          });
          this.loadClipIfEmpty('audio/bgm_meadow_loop', clip => {
            this.backgroundMusicClip = clip;
            this.playBackgroundMusic();
          });
        }

        playBackgroundMusic() {
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

        loadClipIfEmpty(path, assign) {
          resources.load(path, AudioClip, (error, clip) => {
            if (error || !clip) {
              return;
            }

            assign(clip);
          });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "audioSource", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "musicSource", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "buttonClickClip", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "moleAppearClip", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "hitMoleClip", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "timeoutClip", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "gameOverClip", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "backgroundMusicClip", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=397db20483bb49a744b0c496ad1e24c23ba1874f.js.map