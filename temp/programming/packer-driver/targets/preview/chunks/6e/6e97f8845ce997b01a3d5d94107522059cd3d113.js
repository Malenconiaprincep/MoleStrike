System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Graphics, Node, resources, Sprite, SpriteFrame, Texture2D, UITransform, ArtResourceManager, _crd, ArtAssetKey, ART_PATHS, GAMEPLAY_ART_KEYS;

  _export("ArtResourceManager", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Graphics = _cc.Graphics;
      Node = _cc.Node;
      resources = _cc.resources;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Texture2D = _cc.Texture2D;
      UITransform = _cc.UITransform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d7b36q54g9Py4+CTO/0B7Zz", "ArtResourceManager", undefined);

      /**
       * 可由运行时加载的正式美术资源。
       * 路径统一维护在这里，避免业务组件依赖具体目录结构。
       */
      __checkObsolete__(['Graphics', 'Node', 'resources', 'Sprite', 'SpriteFrame', 'Texture2D', 'UITransform']);

      _export("ArtAssetKey", ArtAssetKey = /*#__PURE__*/function (ArtAssetKey) {
        ArtAssetKey["GameplayBackground"] = "GameplayBackground";
        ArtAssetKey["NormalMole"] = "NormalMole";
        ArtAssetKey["GoldenMole"] = "GoldenMole";
        ArtAssetKey["BombMole"] = "BombMole";
        ArtAssetKey["WoodHole"] = "WoodHole";
        ArtAssetKey["PrimaryButton"] = "PrimaryButton";
        ArtAssetKey["SecondaryButton"] = "SecondaryButton";
        ArtAssetKey["PauseButton"] = "PauseButton";
        ArtAssetKey["TitleSign"] = "TitleSign";
        ArtAssetKey["ResultCard"] = "ResultCard";
        ArtAssetKey["ScoreIcon"] = "ScoreIcon";
        ArtAssetKey["TimeIcon"] = "TimeIcon";
        return ArtAssetKey;
      }({}));

      ART_PATHS = {
        [ArtAssetKey.GameplayBackground]: 'textures/gameplay/gameplay_background/texture',
        [ArtAssetKey.NormalMole]: 'textures/gameplay/mole_normal/texture',
        [ArtAssetKey.GoldenMole]: 'textures/gameplay/mole_golden/texture',
        [ArtAssetKey.BombMole]: 'textures/gameplay/mole_bomb/texture',
        [ArtAssetKey.WoodHole]: 'textures/gameplay/hole_wood/texture',
        [ArtAssetKey.PrimaryButton]: 'textures/ui/btn_primary/texture',
        [ArtAssetKey.SecondaryButton]: 'textures/ui/btn_secondary/texture',
        [ArtAssetKey.PauseButton]: 'textures/ui/btn_pause/texture',
        [ArtAssetKey.TitleSign]: 'textures/ui/title_sign/texture',
        [ArtAssetKey.ResultCard]: 'textures/ui/result_card/texture',
        [ArtAssetKey.ScoreIcon]: 'textures/ui/icon_score/texture',
        [ArtAssetKey.TimeIcon]: 'textures/ui/icon_time/texture'
      };
      GAMEPLAY_ART_KEYS = [ArtAssetKey.GameplayBackground, ArtAssetKey.NormalMole, ArtAssetKey.GoldenMole, ArtAssetKey.BombMole, ArtAssetKey.WoodHole, ArtAssetKey.PrimaryButton, ArtAssetKey.SecondaryButton, ArtAssetKey.PauseButton, ArtAssetKey.TitleSign, ArtAssetKey.ResultCard, ArtAssetKey.ScoreIcon, ArtAssetKey.TimeIcon];
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
          var _node$getChildByName, _artwork$getComponent, _artwork$getComponent2;

          var artworkName = "Artwork_" + key;
          var artwork = (_node$getChildByName = node.getChildByName(artworkName)) != null ? _node$getChildByName : new Node(artworkName);

          if (!artwork.parent) {
            node.addChild(artwork);
          }

          artwork.setSiblingIndex(0);
          artwork.layer = node.layer;
          artwork.setPosition(0, 0, 0);
          var artworkTransform = (_artwork$getComponent = artwork.getComponent(UITransform)) != null ? _artwork$getComponent : artwork.addComponent(UITransform);
          artworkTransform.setContentSize(width, height);
          var sprite = (_artwork$getComponent2 = artwork.getComponent(Sprite)) != null ? _artwork$getComponent2 : artwork.addComponent(Sprite);
          sprite.enabled = false;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          this.loadSpriteFrame(key, spriteFrame => {
            var _node$getComponent;

            if (!spriteFrame || !node.isValid || !artwork.isValid) {
              return;
            }

            (_node$getComponent = node.getComponent(UITransform)) == null || _node$getComponent.setContentSize(width, height);
            artwork.layer = node.layer;
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
          resources.load(ART_PATHS[key], Texture2D, (error, texture) => {
            var _this$pendingCallback;

            var spriteFrame = !error && texture ? new SpriteFrame() : null;

            if (spriteFrame && texture) {
              spriteFrame.texture = texture;
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