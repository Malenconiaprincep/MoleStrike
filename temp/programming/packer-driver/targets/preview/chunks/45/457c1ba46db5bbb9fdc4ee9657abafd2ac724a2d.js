System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, TimerManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "54bc6HFoApCVKnX4rf0CiyI", "TimerManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      /**
       * 倒计时管理器。
       * 使用 update 驱动，避免依赖平台计时器，小游戏端表现更稳定。
       */
      _export("TimerManager", TimerManager = (_dec = ccclass('TimerManager'), _dec2 = property(Label), _dec(_class = (_class2 = class TimerManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "timeLabel", _descriptor, this);

          this.totalSeconds = 60;
          this.secondsLeft = 60;
          this.running = false;
          this.paused = false;
          this.onComplete = null;
          this.onTick = null;
          this.lastDisplaySeconds = -1;
        }

        startTimer(seconds, onComplete, onTick) {
          this.totalSeconds = Math.max(1, seconds);
          this.secondsLeft = this.totalSeconds;
          this.running = true;
          this.paused = false;
          this.onComplete = onComplete;
          this.onTick = onTick != null ? onTick : null;
          this.lastDisplaySeconds = -1;
          this.refreshView(true);
        }

        pauseTimer() {
          if (this.running) {
            this.paused = true;
          }
        }

        resumeTimer() {
          if (this.running) {
            this.paused = false;
          }
        }

        stopTimer() {
          this.running = false;
          this.paused = false;
          this.onComplete = null;
          this.onTick = null;
        }

        resetTimer(seconds) {
          this.totalSeconds = Math.max(1, seconds);
          this.secondsLeft = this.totalSeconds;
          this.running = false;
          this.paused = false;
          this.lastDisplaySeconds = -1;
          this.refreshView(true);
        }

        getSecondsLeft() {
          return Math.max(0, Math.ceil(this.secondsLeft));
        }

        update(deltaTime) {
          if (!this.running || this.paused) {
            return;
          }

          this.secondsLeft -= deltaTime;
          this.refreshView();

          if (this.secondsLeft <= 0) {
            var _this$onComplete;

            this.secondsLeft = 0;
            this.running = false;
            this.refreshView(true);
            (_this$onComplete = this.onComplete) == null || _this$onComplete.call(this);
          }
        }

        refreshView(force) {
          var _this$onTick;

          if (force === void 0) {
            force = false;
          }

          var displaySeconds = this.getSecondsLeft();

          if (!force && displaySeconds === this.lastDisplaySeconds) {
            return;
          }

          this.lastDisplaySeconds = displaySeconds;

          if (this.timeLabel) {
            this.timeLabel.string = "" + displaySeconds;
          }

          (_this$onTick = this.onTick) == null || _this$onTick.call(this, displaySeconds);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "timeLabel", [_dec2], {
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
//# sourceMappingURL=457c1ba46db5bbb9fdc4ee9657abafd2ac724a2d.js.map