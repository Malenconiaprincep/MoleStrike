System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Graphics, resources, Sprite, SpriteFrame, UITransform, ArtResourceManager, _crd, ArtAssetKey, ART_PATHS, GAMEPLAY_ART_KEYS;

  _export("ArtResourceManager", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Graphics = _cc.Graphics;
      resources = _cc.resources;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      UITransform = _cc.UITransform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d7b36q54g9Py4+CTO/0B7Zz", "ArtResourceManager", undefined);

      /**
       * 可由运行时加载的正式美术资源。
       * 路径统一维护在这里，避免业务组件依赖具体目录结构。
       */
      __checkObsolete__(['Graphics', 'Node', 'resources', 'Sprite', 'SpriteFrame', 'UITransform']);

      _export("ArtAssetKey", ArtAssetKey = /*#__PURE__*/function (ArtAssetKey) {
        ArtAssetKey["GameplayBackground"] = "GameplayBackground";
        ArtAssetKey["NormalMole"] = "NormalMole";
        ArtAssetKey["GoldenMole"] = "GoldenMole";
        ArtAssetKey["BombMole"] = "BombMole";
        ArtAssetKey["WoodHole"] = "WoodHole";
        return ArtAssetKey;
      }({}));

      ART_PATHS = {
        [ArtAssetKey.GameplayBackground]: 'textures/gameplay/gameplay_background/spriteFrame',
        [ArtAssetKey.NormalMole]: 'textures/gameplay/mole_normal/spriteFrame',
        [ArtAssetKey.GoldenMole]: 'textures/gameplay/mole_golden/spriteFrame',
        [ArtAssetKey.BombMole]: 'textures/gameplay/mole_bomb/spriteFrame',
        [ArtAssetKey.WoodHole]: 'textures/gameplay/hole_wood/spriteFrame'
      };
      GAMEPLAY_ART_KEYS = [ArtAssetKey.GameplayBackground, ArtAssetKey.NormalMole, ArtAssetKey.GoldenMole, ArtAssetKey.BombMole, ArtAssetKey.WoodHole];
      /**
       * 美术资源加载与缓存入口。
       * Cocos 的 resources.load 本身会缓存资源，这里额外合并并发请求并统一处理降级逻辑。
       */

      _export("ArtResourceManager", ArtResourceManager = class ArtResourceManager {
        static preloadGameplayArt() {
          for (var key of GAMEPLAY_ART_KEYS) {
            this.loadSpriteFrame(key, () => undefined);
          }
        }

        static applySprite(node, key, width, height) {
          var _node$getComponent;

          var sprite = (_node$getComponent = node.getComponent(Sprite)) != null ? _node$getComponent : node.addComponent(Sprite);
          sprite.enabled = false;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          this.loadSpriteFrame(key, spriteFrame => {
            var _node$getComponent2;

            if (!spriteFrame || !node.isValid) {
              return;
            }

            (_node$getComponent2 = node.getComponent(UITransform)) == null || _node$getComponent2.setContentSize(width, height);
            sprite.spriteFrame = spriteFrame;
            sprite.enabled = true; // 正式贴图加载成功后关闭程序绘制，加载失败时它仍是可靠的兜底画面。

            var fallbackGraphics = node.getComponent(Graphics);

            if (fallbackGraphics) {
              fallbackGraphics.enabled = false;
            }
          });
        }

        static loadSpriteFrame(key, callback) {
          var cached = this.spriteFrames.get(key);

          if (cached != null && cached.isValid) {
            callback(cached);
            return;
          }

          var pending = this.pendingCallbacks.get(key);

          if (pending) {
            pending.push(callback);
            return;
          }

          this.pendingCallbacks.set(key, [callback]);
          resources.load(ART_PATHS[key], SpriteFrame, (error, spriteFrame) => {
            var _this$pendingCallback;

            if (!error && spriteFrame) {
              this.spriteFrames.set(key, spriteFrame);
            }

            var callbacks = (_this$pendingCallback = this.pendingCallbacks.get(key)) != null ? _this$pendingCallback : [];
            this.pendingCallbacks.delete(key);

            for (var pendingCallback of callbacks) {
              pendingCallback(error ? null : spriteFrame);
            }
          });
        }

      });

      ArtResourceManager.spriteFrames = new Map();
      ArtResourceManager.pendingCallbacks = new Map();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6e97f8845ce997b01a3d5d94107522059cd3d113.js.map