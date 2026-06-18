System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Label, tween, Vec3, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, ComboManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      Label = _cc.Label;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e9083K7odxMN79Wjtj36uVF", "ComboManager", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Label', 'Node', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 连击管理器。
       * 连续命中会刷新连击时间，超过窗口未命中则自动断连。
       */

      _export("ComboManager", ComboManager = (_dec = ccclass('ComboManager'), _dec2 = property(Label), _dec(_class = (_class2 = class ComboManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "comboLabel", _descriptor, this);

          _initializerDefineProperty(this, "comboWindowSeconds", _descriptor2, this);

          this.combo = 0;
          this.remainSeconds = 0;
        }

        reset() {
          this.combo = 0;
          this.remainSeconds = 0;
          this.refreshView();
        }

        addCombo() {
          this.combo += 1;
          this.remainSeconds = this.comboWindowSeconds;
          this.refreshView(true);
          return this.combo;
        }

        breakCombo() {
          this.combo = 0;
          this.remainSeconds = 0;
          this.refreshView();
        }

        update(deltaTime) {
          if (this.combo <= 0) {
            return;
          }

          this.remainSeconds -= deltaTime;

          if (this.remainSeconds <= 0) {
            this.breakCombo();
          }
        }

        refreshView(playPulse = false) {
          if (!this.comboLabel) {
            return;
          }

          const labelNode = this.comboLabel.node;
          labelNode.active = this.combo >= 2;
          this.comboLabel.string = this.combo >= 2 ? `Combo x${this.combo}` : '';
          this.comboLabel.color = this.combo >= 5 ? new Color(255, 117, 76, 255) : new Color(255, 244, 174, 255);

          if (playPulse) {
            this.playPulse(labelNode);
          }
        }

        playPulse(node) {
          tween(node).stop().set({
            scale: new Vec3(0.86, 0.86, 1)
          }).to(0.1, {
            scale: new Vec3(1.15, 1.15, 1)
          }).to(0.08, {
            scale: Vec3.ONE
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "comboLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "comboWindowSeconds", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=de0c129000dfae02bd3440ba5d17a9ded6ad65cb.js.map