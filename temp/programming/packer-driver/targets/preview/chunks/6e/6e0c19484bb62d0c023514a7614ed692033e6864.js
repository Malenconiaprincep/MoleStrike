System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, AudioManager, DEFAULT_GAME_SECONDS, GameState, StorageManager, PlatformAdapter, UIManager, TutorialManager, ComboManager, DailyChallengeManager, MoleManager, ScoreManager, TimerManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../core/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDEFAULT_GAME_SECONDS(extras) {
    _reporterNs.report("DEFAULT_GAME_SECONDS", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameState(extras) {
    _reporterNs.report("GameState", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "../core/StorageManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlatformAdapter(extras) {
    _reporterNs.report("PlatformAdapter", "../platform/PlatformAdapter", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIManager(extras) {
    _reporterNs.report("UIManager", "../ui/UIManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTutorialManager(extras) {
    _reporterNs.report("TutorialManager", "../ui/TutorialManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfComboManager(extras) {
    _reporterNs.report("ComboManager", "./ComboManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDailyChallengeManager(extras) {
    _reporterNs.report("DailyChallengeManager", "./DailyChallengeManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoleManager(extras) {
    _reporterNs.report("MoleManager", "./MoleManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfScoreManager(extras) {
    _reporterNs.report("ScoreManager", "./ScoreManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTimerManager(extras) {
    _reporterNs.report("TimerManager", "./TimerManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      AudioManager = _unresolved_2.AudioManager;
    }, function (_unresolved_3) {
      DEFAULT_GAME_SECONDS = _unresolved_3.DEFAULT_GAME_SECONDS;
      GameState = _unresolved_3.GameState;
    }, function (_unresolved_4) {
      StorageManager = _unresolved_4.StorageManager;
    }, function (_unresolved_5) {
      PlatformAdapter = _unresolved_5.PlatformAdapter;
    }, function (_unresolved_6) {
      UIManager = _unresolved_6.UIManager;
    }, function (_unresolved_7) {
      TutorialManager = _unresolved_7.TutorialManager;
    }, function (_unresolved_8) {
      ComboManager = _unresolved_8.ComboManager;
    }, function (_unresolved_9) {
      DailyChallengeManager = _unresolved_9.DailyChallengeManager;
    }, function (_unresolved_10) {
      MoleManager = _unresolved_10.MoleManager;
    }, function (_unresolved_11) {
      ScoreManager = _unresolved_11.ScoreManager;
    }, function (_unresolved_12) {
      TimerManager = _unresolved_12.TimerManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7fb0c4a1AtLPZLOLu2apsG/", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 游戏总控。
       * 只做状态编排，把计时、计分、地鼠生成和 UI 显示交给对应模块。
       */

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(_crd && ScoreManager === void 0 ? (_reportPossibleCrUseOfScoreManager({
        error: Error()
      }), ScoreManager) : ScoreManager), _dec3 = property(_crd && TimerManager === void 0 ? (_reportPossibleCrUseOfTimerManager({
        error: Error()
      }), TimerManager) : TimerManager), _dec4 = property(_crd && MoleManager === void 0 ? (_reportPossibleCrUseOfMoleManager({
        error: Error()
      }), MoleManager) : MoleManager), _dec5 = property(_crd && UIManager === void 0 ? (_reportPossibleCrUseOfUIManager({
        error: Error()
      }), UIManager) : UIManager), _dec6 = property(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
        error: Error()
      }), AudioManager) : AudioManager), _dec7 = property(_crd && ComboManager === void 0 ? (_reportPossibleCrUseOfComboManager({
        error: Error()
      }), ComboManager) : ComboManager), _dec8 = property(_crd && TutorialManager === void 0 ? (_reportPossibleCrUseOfTutorialManager({
        error: Error()
      }), TutorialManager) : TutorialManager), _dec(_class = (_class2 = class GameManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "scoreManager", _descriptor, this);

          _initializerDefineProperty(this, "timerManager", _descriptor2, this);

          _initializerDefineProperty(this, "moleManager", _descriptor3, this);

          _initializerDefineProperty(this, "uiManager", _descriptor4, this);

          _initializerDefineProperty(this, "audioManager", _descriptor5, this);

          _initializerDefineProperty(this, "comboManager", _descriptor6, this);

          _initializerDefineProperty(this, "tutorialManager", _descriptor7, this);

          _initializerDefineProperty(this, "gameSeconds", _descriptor8, this);

          this.onHitFeedback = null;
          this.onDifficultyChanged = null;
          this.state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Home;
          this.difficultyLevel = 1;
          this.roundPositiveHits = 0;
          this.roundGoldenHits = 0;
        }

        start() {
          (_crd && PlatformAdapter === void 0 ? (_reportPossibleCrUseOfPlatformAdapter({
            error: Error()
          }), PlatformAdapter) : PlatformAdapter).setupShareMenu();
          this.enterHome();
        }

        handleStartButton() {
          var _this$audioManager, _this$audioManager2, _this$tutorialManager;

          (_this$audioManager = this.audioManager) == null || _this$audioManager.playButtonClick();
          (_this$audioManager2 = this.audioManager) == null || _this$audioManager2.ensureBackgroundMusic();

          if ((_this$tutorialManager = this.tutorialManager) != null && _this$tutorialManager.shouldShow()) {
            this.tutorialManager.show(() => this.startGame());
            return;
          }

          this.startGame();
        }

        handleReplayButton() {
          var _this$audioManager3;

          (_this$audioManager3 = this.audioManager) == null || _this$audioManager3.playButtonClick();
          this.startGame();
        }

        handleHomeButton() {
          var _this$audioManager4;

          (_this$audioManager4 = this.audioManager) == null || _this$audioManager4.playButtonClick();
          this.enterHome();
        }

        handlePauseButton() {
          var _this$audioManager5;

          (_this$audioManager5 = this.audioManager) == null || _this$audioManager5.playButtonClick();

          if (this.state === (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Playing) {
            this.pauseGame();
            return;
          }

          if (this.state === (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Paused) {
            this.resumeGame();
          }
        }

        startGame() {
          var _this$scoreManager, _this$comboManager, _this$uiManager, _this$moleManager, _this$onDifficultyCha, _this$timerManager, _this$moleManager2;

          this.state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Playing;
          this.difficultyLevel = 1;
          this.roundPositiveHits = 0;
          this.roundGoldenHits = 0;
          (_this$scoreManager = this.scoreManager) == null || _this$scoreManager.reset();
          (_this$comboManager = this.comboManager) == null || _this$comboManager.reset();
          (_this$uiManager = this.uiManager) == null || _this$uiManager.showGame();
          (_this$moleManager = this.moleManager) == null || _this$moleManager.setDifficultyLevel(this.difficultyLevel);
          (_this$onDifficultyCha = this.onDifficultyChanged) == null || _this$onDifficultyCha.call(this, this.difficultyLevel);
          (_this$timerManager = this.timerManager) == null || _this$timerManager.startTimer(this.gameSeconds, () => this.finishGame(), secondsLeft => this.updateDifficulty(secondsLeft));
          (_this$moleManager2 = this.moleManager) == null || _this$moleManager2.startSpawning((score, hit, target) => {
            var _this$scoreManager2, _this$comboManager$ad, _this$comboManager3, _this$onHitFeedback;

            if (!hit) {
              var _this$comboManager2;

              (_this$comboManager2 = this.comboManager) == null || _this$comboManager2.breakCombo();
              return;
            }

            (_this$scoreManager2 = this.scoreManager) == null || _this$scoreManager2.addScore(score);

            if (score > 0) {
              this.roundPositiveHits += 1;
            }

            if (score >= 5) {
              this.roundGoldenHits += 1;
            }

            (_crd && PlatformAdapter === void 0 ? (_reportPossibleCrUseOfPlatformAdapter({
              error: Error()
            }), PlatformAdapter) : PlatformAdapter).vibrateShort(score < 0 ? 'medium' : 'light');
            var combo = score > 0 ? (_this$comboManager$ad = (_this$comboManager3 = this.comboManager) == null ? void 0 : _this$comboManager3.addCombo()) != null ? _this$comboManager$ad : 0 : 0;

            if (score < 0) {
              var _this$comboManager4;

              (_this$comboManager4 = this.comboManager) == null || _this$comboManager4.breakCombo();
            }

            (_this$onHitFeedback = this.onHitFeedback) == null || _this$onHitFeedback.call(this, score, combo, target);
          });
        }

        pauseGame() {
          var _this$timerManager2, _this$moleManager3, _this$uiManager2;

          if (this.state !== (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Playing) {
            return;
          }

          this.state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Paused;
          (_this$timerManager2 = this.timerManager) == null || _this$timerManager2.pauseTimer();
          (_this$moleManager3 = this.moleManager) == null || _this$moleManager3.pauseSpawning();
          (_this$uiManager2 = this.uiManager) == null || _this$uiManager2.showPauseMask(true);
        }

        resumeGame() {
          var _this$timerManager3, _this$moleManager4, _this$uiManager3;

          if (this.state !== (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Paused) {
            return;
          }

          this.state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Playing;
          (_this$timerManager3 = this.timerManager) == null || _this$timerManager3.resumeTimer();
          (_this$moleManager4 = this.moleManager) == null || _this$moleManager4.resumeSpawning();
          (_this$uiManager3 = this.uiManager) == null || _this$uiManager3.showPauseMask(false);
        }

        enterHome() {
          var _this$timerManager4, _this$timerManager5, _this$scoreManager3, _this$comboManager5, _this$moleManager5, _this$uiManager4, _this$uiManager5;

          this.state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Home;
          (_this$timerManager4 = this.timerManager) == null || _this$timerManager4.stopTimer();
          (_this$timerManager5 = this.timerManager) == null || _this$timerManager5.resetTimer(this.gameSeconds);
          (_this$scoreManager3 = this.scoreManager) == null || _this$scoreManager3.reset();
          (_this$comboManager5 = this.comboManager) == null || _this$comboManager5.reset();
          (_this$moleManager5 = this.moleManager) == null || _this$moleManager5.stopSpawning();
          (_this$uiManager4 = this.uiManager) == null || _this$uiManager4.showDailyChallenge((_crd && DailyChallengeManager === void 0 ? (_reportPossibleCrUseOfDailyChallengeManager({
            error: Error()
          }), DailyChallengeManager) : DailyChallengeManager).getSnapshot());
          (_this$uiManager5 = this.uiManager) == null || _this$uiManager5.showHome();
        }

        finishGame() {
          var _this$moleManager6, _this$audioManager6, _this$audioManager7, _this$scoreManager$ge, _this$scoreManager4, _this$uiManager6, _this$uiManager7;

          if (this.state === (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).GameOver) {
            return;
          }

          this.state = (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).GameOver;
          (_this$moleManager6 = this.moleManager) == null || _this$moleManager6.stopSpawning();
          (_this$audioManager6 = this.audioManager) == null || _this$audioManager6.playTimeout();
          (_this$audioManager7 = this.audioManager) == null || _this$audioManager7.playGameOver();
          var finalScore = (_this$scoreManager$ge = (_this$scoreManager4 = this.scoreManager) == null ? void 0 : _this$scoreManager4.getScore()) != null ? _this$scoreManager$ge : 0;
          var previousBestScore = (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).getBestScore();
          var isNewRecord = finalScore > previousBestScore;
          (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).saveBestScore(finalScore);
          (_crd && PlatformAdapter === void 0 ? (_reportPossibleCrUseOfPlatformAdapter({
            error: Error()
          }), PlatformAdapter) : PlatformAdapter).submitScore(finalScore);
          var challengeUpdate = (_crd && DailyChallengeManager === void 0 ? (_reportPossibleCrUseOfDailyChallengeManager({
            error: Error()
          }), DailyChallengeManager) : DailyChallengeManager).recordRound({
            score: finalScore,
            positiveHits: this.roundPositiveHits,
            goldenHits: this.roundGoldenHits
          });
          (_this$uiManager6 = this.uiManager) == null || _this$uiManager6.showDailyChallenge(challengeUpdate.snapshot, challengeUpdate.justCompleted);
          (_this$uiManager7 = this.uiManager) == null || _this$uiManager7.showResult(finalScore, (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).getBestScore(), isNewRecord, this.getRatingText(finalScore));
        }

        updateDifficulty(secondsLeft) {
          var _this$moleManager7, _this$onDifficultyCha2;

          if (this.state !== (_crd && GameState === void 0 ? (_reportPossibleCrUseOfGameState({
            error: Error()
          }), GameState) : GameState).Playing) {
            return;
          }

          var elapsedSeconds = this.gameSeconds - secondsLeft;
          var nextLevel = elapsedSeconds >= 40 ? 3 : elapsedSeconds >= 20 ? 2 : 1;

          if (nextLevel === this.difficultyLevel) {
            return;
          }

          this.difficultyLevel = nextLevel;
          (_this$moleManager7 = this.moleManager) == null || _this$moleManager7.setDifficultyLevel(nextLevel);
          (_this$onDifficultyCha2 = this.onDifficultyChanged) == null || _this$onDifficultyCha2.call(this, nextLevel);
        }

        getRatingText(score) {
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

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scoreManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "timerManager", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "moleManager", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "uiManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "audioManager", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "comboManager", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "tutorialManager", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "gameSeconds", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return _crd && DEFAULT_GAME_SECONDS === void 0 ? (_reportPossibleCrUseOfDEFAULT_GAME_SECONDS({
            error: Error()
          }), DEFAULT_GAME_SECONDS) : DEFAULT_GAME_SECONDS;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6e0c19484bb62d0c023514a7614ed692033e6864.js.map