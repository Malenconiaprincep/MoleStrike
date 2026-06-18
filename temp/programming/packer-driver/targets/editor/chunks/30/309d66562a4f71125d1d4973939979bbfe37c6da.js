System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, sys, view, _dec, _class, _crd, ccclass, SafeAreaLayout;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      sys = _cc.sys;
      view = _cc.view;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d24693vOz9A/aG9LolgnOkt", "SafeAreaLayout", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'sys', 'Vec3', 'view']);

      ({
        ccclass
      } = _decorator);

      /**
       * 将关键交互节点推入设备安全区域。
       * 微信 Android 首帧可能稍后才返回准确值，因此运行期间低频复查安全区。
       */
      _export("SafeAreaLayout", SafeAreaLayout = (_dec = ccclass('SafeAreaLayout'), _dec(_class = class SafeAreaLayout extends Component {
        constructor(...args) {
          super(...args);
          this.topEntries = [];
          this.bottomEntries = [];
          this.elapsed = 0;
          this.lastTopInset = -1;
          this.lastBottomInset = -1;
        }

        configure(topNodes, bottomNodes) {
          this.topEntries = this.createEntries(topNodes);
          this.bottomEntries = this.createEntries(bottomNodes);
          this.refresh(true);
        }

        update(deltaTime) {
          this.elapsed += deltaTime;

          if (this.elapsed < 0.5) {
            return;
          }

          this.elapsed = 0;
          this.refresh(false);
        }

        refresh(force) {
          const visibleSize = view.getVisibleSize();
          const safeArea = sys.getSafeAreaRect(false);
          const topInset = Math.max(0, visibleSize.height - safeArea.y - safeArea.height);
          const bottomInset = Math.max(0, safeArea.y);

          if (!force && Math.abs(topInset - this.lastTopInset) < 0.5 && Math.abs(bottomInset - this.lastBottomInset) < 0.5) {
            return;
          }

          this.lastTopInset = topInset;
          this.lastBottomInset = bottomInset;

          for (const entry of this.topEntries) {
            if (entry.node.isValid) {
              entry.node.setPosition(entry.basePosition.x, entry.basePosition.y - topInset, entry.basePosition.z);
            }
          }

          for (const entry of this.bottomEntries) {
            if (entry.node.isValid) {
              entry.node.setPosition(entry.basePosition.x, entry.basePosition.y + bottomInset, entry.basePosition.z);
            }
          }
        }

        createEntries(nodes) {
          return nodes.map(node => ({
            node,
            basePosition: node.position.clone()
          }));
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=309d66562a4f71125d1d4973939979bbfe37c6da.js.map