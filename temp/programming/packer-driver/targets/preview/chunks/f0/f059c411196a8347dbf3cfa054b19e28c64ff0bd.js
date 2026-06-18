System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Node, tween, Tween, UIOpacity, Vec3, DailyChallengeManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _crd, ccclass, property, UIManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDailyChallengeSnapshot(extras) {
    _reporterNs.report("DailyChallengeSnapshot", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDailyChallengeManager(extras) {
    _reporterNs.report("DailyChallengeManager", "../game/DailyChallengeManager", _context.meta, extras);
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
      Label = _cc.Label;
      Node = _cc.Node;
      tween = _cc.tween;
      Tween = _cc.Tween;
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DailyChallengeManager = _unresolved_2.DailyChallengeManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d74f2W+8txPA5VFBGml4Ht6", "UIManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node', 'tween', 'Tween', 'UIOpacity', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * UI 管理器。
       * 负责页面显隐和结算文案，不直接修改游戏数据。
       */

      _export("UIManager", UIManager = (_dec = ccclass('UIManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Label), _dec10 = property(Label), _dec11 = property(Label), _dec12 = property(Label), _dec(_class = (_class2 = class UIManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "homePanel", _descriptor, this);

          _initializerDefineProperty(this, "gamePanel", _descriptor2, this);

          _initializerDefineProperty(this, "resultPanel", _descriptor3, this);

          _initializerDefineProperty(this, "pauseMask", _descriptor4, this);

          _initializerDefineProperty(this, "leaderboardPanel", _descriptor5, this);

          _initializerDefineProperty(this, "finalScoreLabel", _descriptor6, this);

          _initializerDefineProperty(this, "bestScoreLabel", _descriptor7, this);

          _initializerDefineProperty(this, "ratingLabel", _descriptor8, this);

          _initializerDefineProperty(this, "newRecordLabel", _descriptor9, this);

          _initializerDefineProperty(this, "dailyChallengeLabel", _descriptor10, this);

          _initializerDefineProperty(this, "resultChallengeLabel", _descriptor11, this);
        }

        showHome() {
          this.setActive(this.homePanel, true);
          this.setActive(this.gamePanel, false);
          this.setActive(this.resultPanel, false);
          this.setActive(this.pauseMask, false);
          this.setActive(this.leaderboardPanel, false);
          this.resetPanelTransform(this.homePanel);
        }

        showGame() {
          this.setActive(this.homePanel, false);
          this.setActive(this.gamePanel, true);
          this.setActive(this.resultPanel, false);
          this.setActive(this.pauseMask, false);
          this.setActive(this.leaderboardPanel, false);
          this.resetPanelTransform(this.gamePanel);
        }

        showResult(finalScore, bestScore, isNewRecord, rating) {
          if (bestScore === void 0) {
            bestScore = finalScore;
          }

          if (isNewRecord === void 0) {
            isNewRecord = false;
          }

          if (rating === void 0) {
            rating = '';
          }

          this.setActive(this.homePanel, false);
          this.setActive(this.gamePanel, false);
          this.setActive(this.resultPanel, true);
          this.setActive(this.pauseMask, false);
          this.setActive(this.leaderboardPanel, false);

          if (this.finalScoreLabel) {
            this.finalScoreLabel.string = "\u6700\u7EC8\u5F97\u5206\uFF1A" + finalScore;
          }

          if (this.bestScoreLabel) {
            this.bestScoreLabel.string = "\u5386\u53F2\u6700\u9AD8\uFF1A" + bestScore;
          }

          if (this.ratingLabel) {
            this.ratingLabel.string = rating;
          }

          if (this.newRecordLabel) {
            this.newRecordLabel.node.active = isNewRecord;
            this.newRecordLabel.string = isNewRecord ? '新纪录！' : '';
          }

          this.playResultEntrance(isNewRecord);
        }

        showPauseMask(show) {
          var _this$pauseMask$getCo;

          if (!this.pauseMask) {
            return;
          }

          var opacity = (_this$pauseMask$getCo = this.pauseMask.getComponent(UIOpacity)) != null ? _this$pauseMask$getCo : this.pauseMask.addComponent(UIOpacity);
          Tween.stopAllByTarget(opacity);

          if (show) {
            this.pauseMask.active = true;
            opacity.opacity = 0;
            tween(opacity).to(0.12, {
              opacity: 255
            }).start();
            return;
          }

          tween(opacity).to(0.1, {
            opacity: 0
          }).call(() => {
            if (this.pauseMask) {
              this.pauseMask.active = false;
            }
          }).start();
        }

        showDailyChallenge(snapshot, justCompleted) {
          if (justCompleted === void 0) {
            justCompleted = false;
          }

          var text = (_crd && DailyChallengeManager === void 0 ? (_reportPossibleCrUseOfDailyChallengeManager({
            error: Error()
          }), DailyChallengeManager) : DailyChallengeManager).getDisplayText(snapshot);

          if (this.dailyChallengeLabel) {
            this.dailyChallengeLabel.string = text + "\n\u52CB\u7AE0\uFF1A" + snapshot.medalCount;
          }

          if (this.resultChallengeLabel) {
            this.resultChallengeLabel.string = justCompleted ? "\u6311\u6218\u5B8C\u6210\uFF01\u83B7\u5F97 1 \u679A\u52CB\u7AE0  \u5F53\u524D\uFF1A" + snapshot.medalCount : text;
          }
        }

        playResultEntrance(isNewRecord) {
          var _this$resultPanel$get, _this$newRecordLabel;

          if (!this.resultPanel) {
            return;
          }

          var opacity = (_this$resultPanel$get = this.resultPanel.getComponent(UIOpacity)) != null ? _this$resultPanel$get : this.resultPanel.addComponent(UIOpacity);
          Tween.stopAllByTarget(this.resultPanel);
          Tween.stopAllByTarget(opacity);
          this.resultPanel.setScale(new Vec3(0.84, 0.84, 1));
          opacity.opacity = 0;
          tween(opacity).to(0.18, {
            opacity: 255
          }).start();
          tween(this.resultPanel).to(0.24, {
            scale: new Vec3(1.04, 1.04, 1)
          }, {
            easing: 'backOut'
          }).to(0.1, {
            scale: Vec3.ONE
          }).start();

          if (isNewRecord && (_this$newRecordLabel = this.newRecordLabel) != null && _this$newRecordLabel.node.active) {
            var recordNode = this.newRecordLabel.node;
            Tween.stopAllByTarget(recordNode);
            recordNode.setScale(new Vec3(0.3, 0.3, 1));
            tween(recordNode).delay(0.2).to(0.25, {
              scale: new Vec3(1.16, 1.16, 1)
            }, {
              easing: 'backOut'
            }).to(0.1, {
              scale: Vec3.ONE
            }).start();
          }
        }

        resetPanelTransform(panel) {
          if (!panel) {
            return;
          }

          Tween.stopAllByTarget(panel);
          panel.setScale(Vec3.ONE);
          var opacity = panel.getComponent(UIOpacity);

          if (opacity) {
            Tween.stopAllByTarget(opacity);
            opacity.opacity = 255;
          }
        }

        setActive(node, active) {
          if (node) {
            node.active = active;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "homePanel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gamePanel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "resultPanel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "pauseMask", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "leaderboardPanel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "finalScoreLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "bestScoreLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "ratingLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "newRecordLabel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "dailyChallengeLabel", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "resultChallengeLabel", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f059c411196a8347dbf3cfa054b19e28c64ff0bd.js.map