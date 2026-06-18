System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, StorageManager, DailyChallengeManager, _crd;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _reportPossibleCrUseOfDailyChallengeKind(extras) {
    _reporterNs.report("DailyChallengeKind", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDailyChallengeSnapshot(extras) {
    _reporterNs.report("DailyChallengeSnapshot", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDailyChallengeState(extras) {
    _reporterNs.report("DailyChallengeState", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoundStats(extras) {
    _reporterNs.report("RoundStats", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "../core/StorageManager", _context.meta, extras);
  }

  _export("DailyChallengeManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      StorageManager = _unresolved_2.StorageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2ac34+kk+BKFJKSuS46s08R", "DailyChallengeManager", undefined);

      /** 每日挑战规则与结算，按本地自然日轮换且离线可用。 */
      _export("DailyChallengeManager", DailyChallengeManager = class DailyChallengeManager {
        static getSnapshot(now) {
          if (now === void 0) {
            now = new Date();
          }

          var dateKey = this.getDateKey(now);
          var definition = this.getDefinition(now);
          var savedState = (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).getDailyChallengeState();
          var state = (savedState == null ? void 0 : savedState.dateKey) === dateKey ? savedState : this.createState(dateKey);

          if ((savedState == null ? void 0 : savedState.dateKey) !== dateKey) {
            (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
              error: Error()
            }), StorageManager) : StorageManager).saveDailyChallengeState(state);
          }

          return this.toSnapshot(state, definition);
        }

        static recordRound(stats, now) {
          if (now === void 0) {
            now = new Date();
          }

          var snapshot = this.getSnapshot(now);
          var previousCompleted = snapshot.completed;
          var roundProgress = this.getRoundProgress(snapshot.kind, stats);
          var progress = snapshot.kind === 'score' ? Math.max(snapshot.progress, roundProgress) : snapshot.progress + roundProgress;
          var completed = progress >= snapshot.target;
          var state = {
            dateKey: snapshot.dateKey,
            progress: Math.min(progress, snapshot.target),
            completed,
            rewardGranted: snapshot.rewardGranted
          };

          if (completed && !state.rewardGranted) {
            (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
              error: Error()
            }), StorageManager) : StorageManager).addMedals(1);
            state.rewardGranted = true;
          }

          (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).saveDailyChallengeState(state);
          return {
            snapshot: this.toSnapshot(state, snapshot),
            justCompleted: completed && !previousCompleted
          };
        }

        static getDisplayText(snapshot) {
          var progress = Math.min(snapshot.progress, snapshot.target);
          var status = snapshot.completed ? '已完成' : progress + "/" + snapshot.target;
          return "\u4ECA\u65E5\u6311\u6218\uFF1A" + snapshot.title + "  " + status;
        }

        static getRoundProgress(kind, stats) {
          if (kind === 'score') {
            return Math.max(0, Math.floor(stats.score));
          }

          if (kind === 'golden') {
            return Math.max(0, Math.floor(stats.goldenHits));
          }

          return Math.max(0, Math.floor(stats.positiveHits));
        }

        static createState(dateKey) {
          return {
            dateKey,
            progress: 0,
            completed: false,
            rewardGranted: false
          };
        }

        static toSnapshot(state, definition) {
          return _extends({}, state, definition, {
            medalCount: (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
              error: Error()
            }), StorageManager) : StorageManager).getMedalCount()
          });
        }

        static getDefinition(now) {
          var dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
          var definitions = [{
            kind: 'score',
            title: '单局达到25分',
            target: 25
          }, {
            kind: 'hits',
            title: '累计命中30只地鼠',
            target: 30
          }, {
            kind: 'golden',
            title: '累计命中3只金色地鼠',
            target: 3
          }];
          return definitions[Math.abs(dayNumber) % definitions.length];
        }

        static getDateKey(now) {
          var year = now.getFullYear();
          var monthValue = now.getMonth() + 1;
          var dayValue = now.getDate();
          var month = monthValue < 10 ? "0" + monthValue : "" + monthValue;
          var day = dayValue < 10 ? "0" + dayValue : "" + dayValue;
          return year + "-" + month + "-" + day;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=18935775fa2193078554793d8b863e837fe4924e.js.map