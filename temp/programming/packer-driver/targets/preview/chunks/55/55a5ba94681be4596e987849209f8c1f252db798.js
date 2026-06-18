System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Node, tween, UIOpacity, Vec3, AudioManager, StorageManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, TUTORIAL_PAGES, TutorialManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../core/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfStorageManager(extras) {
    _reporterNs.report("StorageManager", "../core/StorageManager", _context.meta, extras);
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
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      AudioManager = _unresolved_2.AudioManager;
    }, function (_unresolved_3) {
      StorageManager = _unresolved_3.StorageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "33c3ce6MmlEx5uB8K5njqTU", "TutorialManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node', 'tween', 'UIOpacity', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      TUTORIAL_PAGES = [{
        title: '眼疾手快',
        description: '地鼠冒出来后立刻点击\n普通地鼠可以获得 1 分',
        symbol: '地鼠  +1'
      }, {
        title: '认准目标',
        description: '金色地鼠 +5 分\n炸弹地鼠 -3 分，千万别点错',
        symbol: '金色 +5   炸弹 -3'
      }, {
        title: '保持连击',
        description: '连续命中会累积 Combo\n60 秒内挑战你的最高分',
        symbol: 'COMBO x3'
      }];
      /** 首次游戏的新手引导，负责分页展示和完成状态持久化。 */

      _export("TutorialManager", TutorialManager = (_dec = ccclass('TutorialManager'), _dec2 = property(Node), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
        error: Error()
      }), AudioManager) : AudioManager), _dec(_class = (_class2 = class TutorialManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "panel", _descriptor, this);

          _initializerDefineProperty(this, "titleLabel", _descriptor2, this);

          _initializerDefineProperty(this, "descriptionLabel", _descriptor3, this);

          _initializerDefineProperty(this, "symbolLabel", _descriptor4, this);

          _initializerDefineProperty(this, "progressLabel", _descriptor5, this);

          _initializerDefineProperty(this, "actionLabel", _descriptor6, this);

          _initializerDefineProperty(this, "audioManager", _descriptor7, this);

          this.pageIndex = 0;
          this.onCompleted = null;
        }

        shouldShow() {
          return !(_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).hasCompletedTutorial();
        }

        show(onCompleted) {
          var _this$panel$getCompon;

          if (!this.panel) {
            onCompleted();
            return;
          }

          this.pageIndex = 0;
          this.onCompleted = onCompleted;
          this.panel.active = true;
          var opacity = (_this$panel$getCompon = this.panel.getComponent(UIOpacity)) != null ? _this$panel$getCompon : this.panel.addComponent(UIOpacity);
          opacity.opacity = 0;
          this.panel.setScale(new Vec3(0.94, 0.94, 1));
          this.renderPage();
          tween(opacity).to(0.15, {
            opacity: 255
          }).start();
          tween(this.panel).to(0.2, {
            scale: Vec3.ONE
          }, {
            easing: 'backOut'
          }).start();
        }

        handleNext() {
          var _this$audioManager;

          (_this$audioManager = this.audioManager) == null || _this$audioManager.playButtonClick();

          if (this.pageIndex >= TUTORIAL_PAGES.length - 1) {
            this.complete();
            return;
          }

          this.pageIndex += 1;
          this.renderPage();
        }

        handleSkip() {
          var _this$audioManager2;

          (_this$audioManager2 = this.audioManager) == null || _this$audioManager2.playButtonClick();
          this.complete();
        }

        renderPage() {
          var page = TUTORIAL_PAGES[this.pageIndex];

          if (this.titleLabel) {
            this.titleLabel.string = page.title;
          }

          if (this.descriptionLabel) {
            this.descriptionLabel.string = page.description;
          }

          if (this.symbolLabel) {
            this.symbolLabel.string = page.symbol;
          }

          if (this.progressLabel) {
            this.progressLabel.string = TUTORIAL_PAGES.map((_, index) => index === this.pageIndex ? '●' : '○').join('  ');
          }

          if (this.actionLabel) {
            this.actionLabel.string = this.pageIndex === TUTORIAL_PAGES.length - 1 ? '开始挑战' : '下一步';
          }
        }

        complete() {
          (_crd && StorageManager === void 0 ? (_reportPossibleCrUseOfStorageManager({
            error: Error()
          }), StorageManager) : StorageManager).saveTutorialCompleted();

          if (this.panel) {
            this.panel.active = false;
          }

          var callback = this.onCompleted;
          this.onCompleted = null;
          callback == null || callback();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "panel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "titleLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "descriptionLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "symbolLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "progressLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "actionLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "audioManager", [_dec8], {
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
//# sourceMappingURL=55a5ba94681be4596e987849209f8c1f252db798.js.map