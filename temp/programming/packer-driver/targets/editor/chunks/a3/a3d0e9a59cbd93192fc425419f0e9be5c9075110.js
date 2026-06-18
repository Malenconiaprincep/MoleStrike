System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Sprite, tween, Vec3, NORMAL_MOLE_CONFIG, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, Mole;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMoleConfig(extras) {
    _reporterNs.report("MoleConfig", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoleType(extras) {
    _reporterNs.report("MoleType", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNORMAL_MOLE_CONFIG(extras) {
    _reporterNs.report("NORMAL_MOLE_CONFIG", "../core/GameTypes", _context.meta, extras);
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
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      NORMAL_MOLE_CONFIG = _unresolved_2.NORMAL_MOLE_CONFIG;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c9da4aGaPFKhry+Lbv6VZnW", "Mole", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EventTouch', 'Node', 'Sprite', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      /**
       * 单只地鼠的行为组件。
       * 负责出现、点击命中、自动缩回动画，不关心分数和整体游戏状态。
       */
      _export("Mole", Mole = (_dec = ccclass('Mole'), _dec2 = property(Sprite), _dec(_class = (_class2 = class Mole extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bodySprite", _descriptor, this);

          this.config = _crd && NORMAL_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfNORMAL_MOLE_CONFIG({
            error: Error()
          }), NORMAL_MOLE_CONFIG) : NORMAL_MOLE_CONFIG;
          this.secondsLeft = (_crd && NORMAL_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfNORMAL_MOLE_CONFIG({
            error: Error()
          }), NORMAL_MOLE_CONFIG) : NORMAL_MOLE_CONFIG).staySeconds;
          this.visible = false;
          this.paused = false;
          this.onHit = null;
          this.onHidden = null;
        }

        onEnable() {
          this.node.on(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
        }

        onDisable() {
          this.node.off(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
        }

        show(config, onHit, onHidden) {
          this.config = config;
          this.secondsLeft = config.staySeconds;
          this.visible = true;
          this.paused = false;
          this.onHit = onHit;
          this.onHidden = onHidden;
          this.node.active = true;
          this.node.setScale(new Vec3(0.1, 0.1, 1));
          tween(this.node).to(0.12, {
            scale: new Vec3(1.12, 1.12, 1)
          }).to(0.06, {
            scale: Vec3.ONE
          }).start();
        }

        pauseMole() {
          this.paused = true;
        }

        resumeMole() {
          this.paused = false;
        }

        update(deltaTime) {
          if (!this.visible || this.paused) {
            return;
          }

          this.secondsLeft -= deltaTime;

          if (this.secondsLeft <= 0) {
            this.hide(false);
          }
        }

        handleTouchEnd(event) {
          var _this$onHit;

          event.propagationStopped = true;

          if (!this.visible || this.paused) {
            return;
          }

          (_this$onHit = this.onHit) == null || _this$onHit.call(this, this.config.score, this.config.type);
          this.hide(true);
        }

        hide(hit) {
          if (!this.visible) {
            return;
          }

          this.visible = false;
          tween(this.node).to(0.08, {
            scale: new Vec3(1.08, 1.08, 1)
          }).to(0.12, {
            scale: new Vec3(0.1, 0.1, 1)
          }).call(() => {
            var _this$onHidden;

            (_this$onHidden = this.onHidden) == null || _this$onHidden.call(this, hit);
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bodySprite", [_dec2], {
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
//# sourceMappingURL=a3d0e9a59cbd93192fc425419f0e9be5c9075110.js.map