System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, StorageManager, _crd, BEST_SCORE_KEY, SOUND_ENABLED_KEY, TUTORIAL_COMPLETED_KEY, DAILY_CHALLENGE_KEY, MEDAL_COUNT_KEY;

  function _reportPossibleCrUseOfDailyChallengeState(extras) {
    _reporterNs.report("DailyChallengeState", "./GameTypes", _context.meta, extras);
  }

  _export("StorageManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0db8cd7yptJsaL4sbpIfktI", "StorageManager", undefined);

      __checkObsolete__(['sys']);

      BEST_SCORE_KEY = 'mole_strike_best_score';
      SOUND_ENABLED_KEY = 'mole_strike_sound_enabled';
      TUTORIAL_COMPLETED_KEY = 'mole_strike_tutorial_completed';
      DAILY_CHALLENGE_KEY = 'mole_strike_daily_challenge';
      MEDAL_COUNT_KEY = 'mole_strike_medal_count';
      /**
       * 本地存档管理。
       * 通过 Cocos sys.localStorage 访问平台存储，微信/抖音小游戏会由引擎适配。
       */

      _export("StorageManager", StorageManager = class StorageManager {
        static getBestScore() {
          const rawValue = sys.localStorage.getItem(BEST_SCORE_KEY);
          const score = Number(rawValue);
          return Number.isFinite(score) ? score : 0;
        }

        static saveBestScore(score) {
          const bestScore = Math.max(this.getBestScore(), score);
          sys.localStorage.setItem(BEST_SCORE_KEY, `${bestScore}`);
        }

        static isSoundEnabled() {
          const rawValue = sys.localStorage.getItem(SOUND_ENABLED_KEY);
          return rawValue !== 'false';
        }

        static saveSoundEnabled(enabled) {
          sys.localStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
        }

        static hasCompletedTutorial() {
          return sys.localStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
        }

        static saveTutorialCompleted() {
          sys.localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
        }

        static getDailyChallengeState() {
          const rawValue = sys.localStorage.getItem(DAILY_CHALLENGE_KEY);

          if (!rawValue) {
            return null;
          }

          try {
            var _value$progress;

            const value = JSON.parse(rawValue);

            if (typeof value.dateKey !== 'string' || !Number.isFinite(value.progress)) {
              return null;
            }

            return {
              dateKey: value.dateKey,
              progress: Math.max(0, Math.floor((_value$progress = value.progress) != null ? _value$progress : 0)),
              completed: value.completed === true,
              rewardGranted: value.rewardGranted === true
            };
          } catch {
            return null;
          }
        }

        static saveDailyChallengeState(state) {
          sys.localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(state));
        }

        static getMedalCount() {
          const count = Number(sys.localStorage.getItem(MEDAL_COUNT_KEY));
          return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
        }

        static addMedals(count) {
          const nextCount = this.getMedalCount() + Math.max(0, Math.floor(count));
          sys.localStorage.setItem(MEDAL_COUNT_KEY, `${nextCount}`);
          return nextCount;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=350384e1eb15521fa71956fe8fc55584247c74fd.js.map