System.register("chunks:///_virtual/AnalyticsManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './PlatformAdapter.ts'], function (exports) {
  var _extends, _createForOfIteratorHelperLoose, cclegacy, sys, PlatformAdapter;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      PlatformAdapter = module.PlatformAdapter;
    }],
    execute: function () {
      cclegacy._RF.push({}, "764ea8MJh1KyIbjuFgac27x", "AnalyticsManager", undefined);
      var DIAGNOSTICS_KEY = 'mole_strike_diagnostics_v1';
      var MAX_DIAGNOSTIC_EVENTS = 20;

      /** 统一事件与错误采集。失败时仅降级，不允许影响游戏主流程。 */
      var AnalyticsManager = exports('AnalyticsManager', /*#__PURE__*/function () {
        function AnalyticsManager() {}
        AnalyticsManager.initialize = function initialize() {
          var _this = this;
          if (this.initialized) {
            return;
          }
          this.initialized = true;
          this.sessionId = this.createSessionId();
          PlatformAdapter.registerErrorHandlers(function (kind, message) {
            _this.track('runtime_error', {
              kind: kind,
              message: message
            });
          });
          this.track('game_launch', {
            platform: PlatformAdapter.getPlatformType(),
            version: '0.1.0'
          });
        };
        AnalyticsManager.track = function track(name, payload) {
          if (payload === void 0) {
            payload = {};
          }
          try {
            var eventName = this.normalizeName(name);
            var data = this.normalizePayload(_extends({}, payload, {
              session_id: this.sessionId || 'not_initialized'
            }));
            this.storeDiagnostic({
              timestamp: Date.now(),
              name: eventName,
              data: data
            });
            PlatformAdapter.reportAnalytics(eventName, data);
          } catch (_unused) {
            // 埋点与诊断绝不能中断玩法。
          }
        };
        AnalyticsManager.getRecentDiagnostics = function getRecentDiagnostics() {
          try {
            var rawValue = sys.localStorage.getItem(DIAGNOSTICS_KEY);
            if (!rawValue) {
              return [];
            }
            var events = JSON.parse(rawValue);
            return Array.isArray(events) ? events.slice(-MAX_DIAGNOSTIC_EVENTS) : [];
          } catch (_unused2) {
            return [];
          }
        };
        AnalyticsManager.storeDiagnostic = function storeDiagnostic(event) {
          var events = [].concat(this.getRecentDiagnostics(), [event]).slice(-MAX_DIAGNOSTIC_EVENTS);
          sys.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(events));
        };
        AnalyticsManager.normalizePayload = function normalizePayload(payload) {
          var normalized = {};
          var entries = Object.keys(payload).slice(0, 20);
          for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done;) {
            var key = _step.value;
            var safeKey = this.normalizeName(key);
            var value = payload[key];
            if (typeof value === 'number') {
              normalized[safeKey] = Number.isFinite(value) ? value : 0;
            } else if (typeof value === 'boolean') {
              normalized[safeKey] = value ? 1 : 0;
            } else {
              normalized[safeKey] = value.slice(0, 160);
            }
          }
          return normalized;
        };
        AnalyticsManager.normalizeName = function normalizeName(name) {
          var safeName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 40);
          return safeName || 'unknown_event';
        };
        AnalyticsManager.createSessionId = function createSessionId() {
          var timePart = Date.now().toString(36);
          var randomPart = Math.floor(Math.random() * 0x1000000).toString(36);
          return timePart + "_" + randomPart;
        };
        return AnalyticsManager;
      }());
      AnalyticsManager.initialized = false;
      AnalyticsManager.sessionId = '';
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ArtResourceManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, Node, UITransform, Sprite, Graphics, resources, Texture2D, SpriteFrame;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
      Graphics = module.Graphics;
      resources = module.resources;
      Texture2D = module.Texture2D;
      SpriteFrame = module.SpriteFrame;
    }],
    execute: function () {
      var _ART_PATHS;
      cclegacy._RF.push({}, "d7b36q54g9Py4+CTO/0B7Zz", "ArtResourceManager", undefined);

      /**
       * 可由运行时加载的正式美术资源。
       * 路径统一维护在这里，避免业务组件依赖具体目录结构。
       */
      var ArtAssetKey = exports('ArtAssetKey', /*#__PURE__*/function (ArtAssetKey) {
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
      var ART_PATHS = (_ART_PATHS = {}, _ART_PATHS[ArtAssetKey.GameplayBackground] = 'textures/gameplay/gameplay_background/texture', _ART_PATHS[ArtAssetKey.NormalMole] = 'textures/gameplay/mole_normal/texture', _ART_PATHS[ArtAssetKey.GoldenMole] = 'textures/gameplay/mole_golden/texture', _ART_PATHS[ArtAssetKey.BombMole] = 'textures/gameplay/mole_bomb/texture', _ART_PATHS[ArtAssetKey.WoodHole] = 'textures/gameplay/hole_wood/texture', _ART_PATHS[ArtAssetKey.PrimaryButton] = 'textures/ui/btn_primary/texture', _ART_PATHS[ArtAssetKey.SecondaryButton] = 'textures/ui/btn_secondary/texture', _ART_PATHS[ArtAssetKey.PauseButton] = 'textures/ui/btn_pause/texture', _ART_PATHS[ArtAssetKey.TitleSign] = 'textures/ui/title_sign/texture', _ART_PATHS[ArtAssetKey.ResultCard] = 'textures/ui/result_card/texture', _ART_PATHS[ArtAssetKey.ScoreIcon] = 'textures/ui/icon_score/texture', _ART_PATHS[ArtAssetKey.TimeIcon] = 'textures/ui/icon_time/texture', _ART_PATHS);
      var GAMEPLAY_ART_KEYS = [ArtAssetKey.GameplayBackground, ArtAssetKey.NormalMole, ArtAssetKey.GoldenMole, ArtAssetKey.BombMole, ArtAssetKey.WoodHole, ArtAssetKey.PrimaryButton, ArtAssetKey.SecondaryButton, ArtAssetKey.PauseButton, ArtAssetKey.TitleSign, ArtAssetKey.ResultCard, ArtAssetKey.ScoreIcon, ArtAssetKey.TimeIcon];

      /**
       * 美术资源加载与缓存入口。
       * Cocos 的 resources.load 本身会缓存资源，这里额外合并并发请求并统一处理降级逻辑。
       */
      var ArtResourceManager = exports('ArtResourceManager', /*#__PURE__*/function () {
        function ArtResourceManager() {}
        ArtResourceManager.preloadGameplayArt = function preloadGameplayArt() {
          for (var _i = 0, _GAMEPLAY_ART_KEYS = GAMEPLAY_ART_KEYS; _i < _GAMEPLAY_ART_KEYS.length; _i++) {
            var key = _GAMEPLAY_ART_KEYS[_i];
            this.loadSpriteFrame(key, function () {
              return undefined;
            });
          }
        };
        ArtResourceManager.applySprite = function applySprite(node, key, width, height) {
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
          this.loadSpriteFrame(key, function (spriteFrame) {
            var _node$getComponent;
            if (!spriteFrame || !node.isValid || !artwork.isValid) {
              return;
            }
            (_node$getComponent = node.getComponent(UITransform)) == null || _node$getComponent.setContentSize(width, height);
            artwork.layer = node.layer;
            sprite.spriteFrame = spriteFrame;
            sprite.enabled = true;

            // 正式贴图加载成功后关闭程序绘制，加载失败时它仍是可靠的兜底画面。
            var fallbackGraphics = node.getComponent(Graphics);
            if (fallbackGraphics) {
              fallbackGraphics.enabled = false;
            }
          });
        };
        ArtResourceManager.loadSpriteFrame = function loadSpriteFrame(key, callback) {
          var _this = this;
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
          resources.load(ART_PATHS[key], Texture2D, function (error, texture) {
            var _this$pendingCallback;
            var spriteFrame = !error && texture ? new SpriteFrame() : null;
            if (spriteFrame && texture) {
              spriteFrame.texture = texture;
              _this.spriteFrames.set(key, spriteFrame);
            }
            var callbacks = (_this$pendingCallback = _this.pendingCallbacks.get(key)) != null ? _this$pendingCallback : [];
            _this.pendingCallbacks["delete"](key);
            for (var _iterator = _createForOfIteratorHelperLoose(callbacks), _step; !(_step = _iterator()).done;) {
              var pendingCallback = _step.value;
              pendingCallback(error ? null : spriteFrame);
            }
          });
        };
        return ArtResourceManager;
      }());
      ArtResourceManager.spriteFrames = new Map();
      ArtResourceManager.pendingCallbacks = new Map();
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './StorageManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, AudioSource, AudioClip, resources, Component, StorageManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      AudioSource = module.AudioSource;
      AudioClip = module.AudioClip;
      resources = module.resources;
      Component = module.Component;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "52157PX34VE2YHCAjazrpf1", "AudioManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * 统一管理音效播放。
       * 微信/抖音小游戏环境中不要直接使用浏览器 Audio，这里只依赖 Cocos 的 AudioSource。
       */
      var AudioManager = exports('AudioManager', (_dec = ccclass('AudioManager'), _dec2 = property(AudioSource), _dec3 = property(AudioSource), _dec4 = property(AudioClip), _dec5 = property(AudioClip), _dec6 = property(AudioClip), _dec7 = property(AudioClip), _dec8 = property(AudioClip), _dec9 = property(AudioClip), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(AudioManager, _Component);
        function AudioManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "audioSource", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "musicSource", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "buttonClickClip", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "moleAppearClip", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "hitMoleClip", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "timeoutClip", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "gameOverClip", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "backgroundMusicClip", _descriptor8, _assertThisInitialized(_this));
          _this.soundEnabled = true;
          return _this;
        }
        var _proto = AudioManager.prototype;
        _proto.onLoad = function onLoad() {
          this.soundEnabled = StorageManager.isSoundEnabled();
          this.loadDefaultClips();
        };
        _proto.playButtonClick = function playButtonClick() {
          this.playOneShot(this.buttonClickClip);
        };
        _proto.playMoleAppear = function playMoleAppear() {
          this.playOneShot(this.moleAppearClip);
        };
        _proto.playHitMole = function playHitMole() {
          this.playOneShot(this.hitMoleClip);
        };
        _proto.playTimeout = function playTimeout() {
          this.playOneShot(this.timeoutClip);
        };
        _proto.playGameOver = function playGameOver() {
          this.playOneShot(this.gameOverClip);
        }

        /** 在真实用户点击后再次尝试启动音乐，兼容自动播放限制。 */;
        _proto.ensureBackgroundMusic = function ensureBackgroundMusic() {
          this.playBackgroundMusic();
        };
        _proto.toggleSound = function toggleSound() {
          this.setSoundEnabled(!this.soundEnabled);
          return this.soundEnabled;
        };
        _proto.setSoundEnabled = function setSoundEnabled(enabled) {
          this.soundEnabled = enabled;
          StorageManager.saveSoundEnabled(enabled);
          if (!enabled) {
            var _this$audioSource, _this$musicSource;
            (_this$audioSource = this.audioSource) == null || _this$audioSource.stop();
            (_this$musicSource = this.musicSource) == null || _this$musicSource.stop();
            return;
          }
          this.playBackgroundMusic();
        };
        _proto.isSoundEnabled = function isSoundEnabled() {
          return this.soundEnabled;
        };
        _proto.playOneShot = function playOneShot(clip) {
          if (!this.soundEnabled || !this.audioSource || !clip) {
            return;
          }
          this.audioSource.playOneShot(clip, 1);
        };
        _proto.loadDefaultClips = function loadDefaultClips() {
          var _this2 = this;
          this.loadClipIfEmpty('audio/sfx_button_click', function (clip) {
            _this2.buttonClickClip = clip;
          });
          this.loadClipIfEmpty('audio/sfx_mole_appear', function (clip) {
            _this2.moleAppearClip = clip;
          });
          this.loadClipIfEmpty('audio/sfx_hit_mole', function (clip) {
            _this2.hitMoleClip = clip;
          });
          this.loadClipIfEmpty('audio/sfx_countdown_end', function (clip) {
            _this2.timeoutClip = clip;
          });
          this.loadClipIfEmpty('audio/sfx_game_win', function (clip) {
            _this2.gameOverClip = clip;
          });
          this.loadClipIfEmpty('audio/bgm_meadow_loop', function (clip) {
            _this2.backgroundMusicClip = clip;
            _this2.playBackgroundMusic();
          });
        };
        _proto.playBackgroundMusic = function playBackgroundMusic() {
          if (!this.soundEnabled || !this.musicSource || !this.backgroundMusicClip) {
            return;
          }
          this.musicSource.clip = this.backgroundMusicClip;
          this.musicSource.loop = true;
          this.musicSource.volume = 0.22;
          if (!this.musicSource.playing) {
            this.musicSource.play();
          }
        };
        _proto.loadClipIfEmpty = function loadClipIfEmpty(path, assign) {
          resources.load(path, AudioClip, function (error, clip) {
            if (error || !clip) {
              return;
            }
            assign(clip);
          });
        };
        return AudioManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "audioSource", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "musicSource", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "buttonClickClip", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "moleAppearClip", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "hitMoleClip", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "timeoutClip", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "gameOverClip", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "backgroundMusicClip", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AutoGameBootstrap.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts', './AnalyticsManager.ts', './ArtResourceManager.ts', './GameManager.ts', './MoleManager.ts', './ScoreManager.ts', './TimerManager.ts', './UIManager.ts', './ComboManager.ts', './PlatformAdapter.ts', './TutorialManager.ts', './SafeAreaLayout.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createForOfIteratorHelperLoose, cclegacy, _decorator, profiler, Layers, UITransform, BlockInputEvents, Node, AudioSource, Color, Label, Graphics, SubContextView, Vec3, Button, view, Widget, tween, Tween, UIOpacity, Component, AudioManager, AnalyticsManager, ArtResourceManager, ArtAssetKey, GameManager, MoleManager, ScoreManager, TimerManager, UIManager, ComboManager, PlatformAdapter, TutorialManager, SafeAreaLayout;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      profiler = module.profiler;
      Layers = module.Layers;
      UITransform = module.UITransform;
      BlockInputEvents = module.BlockInputEvents;
      Node = module.Node;
      AudioSource = module.AudioSource;
      Color = module.Color;
      Label = module.Label;
      Graphics = module.Graphics;
      SubContextView = module.SubContextView;
      Vec3 = module.Vec3;
      Button = module.Button;
      view = module.view;
      Widget = module.Widget;
      tween = module.tween;
      Tween = module.Tween;
      UIOpacity = module.UIOpacity;
      Component = module.Component;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AnalyticsManager = module.AnalyticsManager;
    }, function (module) {
      ArtResourceManager = module.ArtResourceManager;
      ArtAssetKey = module.ArtAssetKey;
    }, function (module) {
      GameManager = module.GameManager;
    }, function (module) {
      MoleManager = module.MoleManager;
    }, function (module) {
      ScoreManager = module.ScoreManager;
    }, function (module) {
      TimerManager = module.TimerManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      ComboManager = module.ComboManager;
    }, function (module) {
      PlatformAdapter = module.PlatformAdapter;
    }, function (module) {
      TutorialManager = module.TutorialManager;
    }, function (module) {
      SafeAreaLayout = module.SafeAreaLayout;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "f4552CedVlBhYPY1ubW6ul8", "AutoGameBootstrap", undefined);
      var ccclass = _decorator.ccclass,
        executeInEditMode = _decorator.executeInEditMode,
        property = _decorator.property;
      var DESIGN_WIDTH = 750;
      var DESIGN_HEIGHT = 1334;

      /**
       * 自动场景搭建脚本。
       * 学习阶段只需要把它挂到 Canvas 上，就能自动生成可运行的首版游戏界面。
       */
      var AutoGameBootstrap = exports('AutoGameBootstrap', (_dec = ccclass('AutoGameBootstrap'), _dec(_class = executeInEditMode(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(AutoGameBootstrap, _Component);
        function AutoGameBootstrap() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "rebuildOnLoad", _descriptor, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = AutoGameBootstrap.prototype;
        _proto.onLoad = function onLoad() {
          profiler.hideStats();
          if (!this.rebuildOnLoad) {
            return;
          }
          this.clearGeneratedNodes();
          this.buildGame();
        };
        _proto.start = function start() {
          if (!this.rebuildOnLoad || this.node.getChildByName('Managers')) {
            return;
          }

          // 仅在 onLoad 尚未完成构建时兜底，避免运行时重复创建资源和管理器。
          this.clearGeneratedNodes();
          this.buildGame();
        };
        _proto.buildGame = function buildGame() {
          var _this$node$getCompone,
            _this2 = this;
          var layout = this.getLayoutSize();
          ArtResourceManager.preloadGameplayArt();
          this.node.layer = Layers.Enum.UI_2D;
          (_this$node$getCompone = this.node.getComponent(UITransform)) == null || _this$node$getCompone.setContentSize(layout.width, layout.height);
          this.ensureWidget(this.node);
          var background = this.createPanel('Background', true);
          this.drawGrassBackground(background);
          ArtResourceManager.applySprite(background, ArtAssetKey.GameplayBackground, layout.width, layout.height);
          var homePanel = this.createPanel('HomePanel', true);
          var gamePanel = this.createPanel('GamePanel', false);
          var resultPanel = this.createPanel('ResultPanel', false);
          var pauseMask = this.createPanel('PauseMask', false);
          var effectsLayer = this.createPanel('EffectsLayer', true);
          var tutorialPanel = this.createPanel('TutorialPanel', false);
          var leaderboardPanel = this.createPanel('LeaderboardPanel', false);
          this.drawPauseMask(pauseMask);
          this.drawPauseMask(tutorialPanel);
          pauseMask.addComponent(BlockInputEvents);
          tutorialPanel.addComponent(BlockInputEvents);
          leaderboardPanel.addComponent(BlockInputEvents);
          var managers = new Node('Managers');
          managers.layer = Layers.Enum.UI_2D;
          managers.active = false;
          this.node.addChild(managers);
          var audioSource = managers.addComponent(AudioSource);
          var musicSource = managers.addComponent(AudioSource);
          var audioManager = managers.addComponent(AudioManager);
          audioManager.audioSource = audioSource;
          audioManager.musicSource = musicSource;
          var uiManager = managers.addComponent(UIManager);
          var tutorialManager = managers.addComponent(TutorialManager);
          var safeAreaLayout = managers.addComponent(SafeAreaLayout);
          var scoreManager = managers.addComponent(ScoreManager);
          var timerManager = managers.addComponent(TimerManager);
          var comboManager = managers.addComponent(ComboManager);
          var moleManager = managers.addComponent(MoleManager);
          var gameManager = managers.addComponent(GameManager);
          var homeLabels = this.buildHomePanel(homePanel, gameManager, audioManager);
          var gameLabels = this.buildGamePanel(gamePanel, gameManager, moleManager);
          var leaderboardFallback = this.buildLeaderboardPanel(leaderboardPanel, audioManager);
          var resultLabels = this.buildResultPanel(resultPanel, gameManager, audioManager, leaderboardPanel, leaderboardFallback);
          this.buildTutorialPanel(tutorialPanel, tutorialManager);
          safeAreaLayout.configure(gameLabels.topSafeNodes, [].concat(gameLabels.bottomSafeNodes, resultLabels.bottomSafeNodes));
          var pauseLabel = this.createLabel('PauseLabel', '已暂停', 48, new Color(255, 255, 255, 255));
          pauseMask.addChild(pauseLabel);
          pauseLabel.setPosition(0, 70, 0);
          var resumeButton = this.createButton('ResumeButton', '继续游戏', new Color(255, 184, 65, 255), function () {
            gameManager.handlePauseButton();
          }, 300, 88, 34, ArtAssetKey.PrimaryButton);
          pauseMask.addChild(resumeButton);
          resumeButton.setPosition(0, -55, 0);
          scoreManager.scoreLabel = gameLabels.scoreLabel;
          timerManager.timeLabel = gameLabels.timeLabel;
          comboManager.comboLabel = gameLabels.comboLabel;
          moleManager.audioManager = audioManager;
          tutorialManager.audioManager = audioManager;
          uiManager.homePanel = homePanel;
          uiManager.gamePanel = gamePanel;
          uiManager.resultPanel = resultPanel;
          uiManager.pauseMask = pauseMask;
          uiManager.leaderboardPanel = leaderboardPanel;
          uiManager.finalScoreLabel = resultLabels.finalScoreLabel;
          uiManager.bestScoreLabel = resultLabels.bestScoreLabel;
          uiManager.ratingLabel = resultLabels.ratingLabel;
          uiManager.newRecordLabel = resultLabels.newRecordLabel;
          uiManager.dailyChallengeLabel = homeLabels.dailyChallengeLabel;
          uiManager.resultChallengeLabel = resultLabels.challengeLabel;
          gameManager.scoreManager = scoreManager;
          gameManager.timerManager = timerManager;
          gameManager.moleManager = moleManager;
          gameManager.uiManager = uiManager;
          gameManager.audioManager = audioManager;
          gameManager.comboManager = comboManager;
          gameManager.tutorialManager = tutorialManager;
          gameManager.gameSeconds = 60;
          gameManager.onHitFeedback = function (score, combo, target) {
            _this2.showHitFeedback(effectsLayer, score, combo, target);
            if (score < 0) {
              var _gamePanel$getChildBy;
              _this2.playScreenShake((_gamePanel$getChildBy = gamePanel.getChildByName('HoleRoot')) != null ? _gamePanel$getChildBy : gamePanel);
            }
          };
          gameManager.onDifficultyChanged = function (level) {
            gameLabels.difficultyLabel.string = _this2.getDifficultyText(level);
            gameLabels.difficultyLabel.color = level === 3 ? new Color(255, 116, 78, 255) : level === 2 ? new Color(224, 142, 48, 255) : new Color(82, 124, 50, 255);
          };

          // 所有引用配置完成后再触发生命周期，避免 onLoad 读取到未注入的依赖。
          managers.active = true;
        };
        _proto.buildHomePanel = function buildHomePanel(homePanel, gameManager, audioManager) {
          var layout = this.getLayoutSize();
          var sign = this.createWoodSign('TitleSign', 610, 170);
          homePanel.addChild(sign);
          sign.setPosition(0, layout.height / 2 - 345, 0);
          var title = this.createLabel('Title', '地鼠突击队', 66, new Color(255, 247, 207, 255), 560, 120);
          homePanel.addChild(title);
          title.setPosition(0, layout.height / 2 - 360, 0);
          var subtitle = this.createLabel('Subtitle', '60秒打地鼠挑战', 34, new Color(101, 83, 35, 255), 460, 70);
          homePanel.addChild(subtitle);
          subtitle.setPosition(0, layout.height / 2 - 485, 0);
          var dailyChallenge = this.createLabel('DailyChallengeLabel', '今日挑战载入中…', 25, new Color(91, 72, 47, 255), 600, 86);
          homePanel.addChild(dailyChallenge);
          dailyChallenge.setPosition(0, layout.height / 2 - 575, 0);
          var startButton = this.createButton('StartButton', '开始游戏', new Color(255, 184, 65, 255), function () {
            gameManager.handleStartButton();
          }, 360, 104, 38, ArtAssetKey.PrimaryButton);
          homePanel.addChild(startButton);
          startButton.setPosition(0, layout.height / 2 - 735, 0);
          var soundButton = this.createSoundButton('SoundButton', audioManager);
          homePanel.addChild(soundButton);
          soundButton.setPosition(0, layout.height / 2 - 845, 0);
          var demoMole = this.createCuteMolePreview();
          homePanel.addChild(demoMole);
          demoMole.setPosition(0, layout.height / 2 - 990, 0);
          var hint = this.createLabel('HintLabel', '金色+5，炸弹-3，小心连击断掉', 26, new Color(82, 124, 50, 255), 560, 60);
          homePanel.addChild(hint);
          hint.setPosition(0, -layout.height / 2 + 140, 0);
          return {
            dailyChallengeLabel: dailyChallenge.getComponent(Label)
          };
        };
        _proto.buildGamePanel = function buildGamePanel(gamePanel, gameManager, moleManager) {
          var layout = this.getLayoutSize();
          var topBar = new Node('TopBar');
          topBar.layer = Layers.Enum.UI_2D;
          topBar.addComponent(UITransform).setContentSize(690, 150);
          gamePanel.addChild(topBar);
          topBar.setPosition(0, layout.height / 2 - 145, 0);
          var scorePill = this.createStatusPill('ScorePill', new Color(255, 247, 206, 255));
          var timePill = this.createStatusPill('TimePill', new Color(255, 238, 221, 255));
          topBar.addChild(scorePill);
          topBar.addChild(timePill);
          scorePill.setPosition(-185, 0, 0);
          timePill.setPosition(185, 0, 0);
          var scoreIcon = this.createCircleIcon('ScoreIcon', new Color(255, 202, 63, 255));
          var timeIcon = this.createCircleIcon('TimeIcon', new Color(255, 116, 78, 255));
          scorePill.addChild(scoreIcon);
          timePill.addChild(timeIcon);
          scoreIcon.setPosition(-100, 0, 0);
          timeIcon.setPosition(-100, 0, 0);
          this.drawStarIcon(scoreIcon);
          this.drawClockIcon(timeIcon);
          ArtResourceManager.applySprite(scoreIcon, ArtAssetKey.ScoreIcon, 64, 64);
          ArtResourceManager.applySprite(timeIcon, ArtAssetKey.TimeIcon, 64, 64);
          var scoreLabelNode = this.createLabel('ScoreLabel', 'Score: 0', 32, new Color(74, 45, 28, 255), 210, 70);
          var timeLabelNode = this.createLabel('TimeLabel', '60', 42, new Color(206, 72, 41, 255), 160, 70);
          topBar.addChild(scoreLabelNode);
          topBar.addChild(timeLabelNode);
          scoreLabelNode.setPosition(-160, 0, 0);
          timeLabelNode.setPosition(210, 0, 0);
          var holeRoot = new Node('HoleRoot');
          holeRoot.layer = Layers.Enum.UI_2D;
          holeRoot.addComponent(UITransform).setContentSize(690, 720);
          gamePanel.addChild(holeRoot);
          holeRoot.setPosition(0, layout.height / 2 - 705, 0);
          var fieldFrame = this.createFieldFrame('FieldFrame');
          gamePanel.addChild(fieldFrame);
          fieldFrame.setSiblingIndex(holeRoot.getSiblingIndex());
          fieldFrame.setPosition(0, layout.height / 2 - 705, 0);
          moleManager.holes = this.createHoles(holeRoot);
          var pauseButton = this.createIconButton('PauseButton', ArtAssetKey.PauseButton, function () {
            gameManager.handlePauseButton();
          }, 92);
          gamePanel.addChild(pauseButton);
          pauseButton.setPosition(layout.width / 2 - 78, -layout.height / 2 + 100, 0);
          var comboLabelNode = this.createLabel('ComboLabel', '', 46, new Color(255, 244, 174, 255), 360, 80);
          gamePanel.addChild(comboLabelNode);
          comboLabelNode.active = false;
          comboLabelNode.setPosition(0, layout.height / 2 - 290, 0);
          var difficultyLabelNode = this.createLabel('DifficultyLabel', '难度：轻松', 26, new Color(82, 124, 50, 255), 260, 54);
          gamePanel.addChild(difficultyLabelNode);
          difficultyLabelNode.setPosition(0, layout.height / 2 - 220, 0);
          return {
            scoreLabel: scoreLabelNode.getComponent(Label),
            timeLabel: timeLabelNode.getComponent(Label),
            comboLabel: comboLabelNode.getComponent(Label),
            difficultyLabel: difficultyLabelNode.getComponent(Label),
            topSafeNodes: [topBar, difficultyLabelNode, comboLabelNode],
            bottomSafeNodes: [pauseButton]
          };
        };
        _proto.buildResultPanel = function buildResultPanel(resultPanel, gameManager, audioManager, leaderboardPanel, leaderboardFallback) {
          var _this3 = this;
          var layout = this.getLayoutSize();
          var card = this.createResultCard();
          resultPanel.addChild(card);
          card.setPosition(0, layout.height / 2 - 600, 0);
          var title = this.createLabel('ResultTitle', '游戏结束', 68, new Color(91, 52, 31, 255), 520, 120);
          var finalScoreNode = this.createLabel('FinalScoreLabel', '最终得分：0', 42, new Color(74, 45, 28, 255), 520, 90);
          var bestScore = this.createLabel('BestScoreLabel', '历史最高：0', 34, new Color(102, 117, 51, 255), 520, 74);
          var rating = this.createLabel('RatingLabel', '评级：见习队员', 34, new Color(173, 110, 55, 255), 520, 74);
          var newRecord = this.createLabel('NewRecordLabel', '新纪录！', 38, new Color(255, 116, 78, 255), 520, 74);
          var challenge = this.createLabel('ResultChallengeLabel', '', 24, new Color(91, 72, 47, 255), 390, 100);
          resultPanel.addChild(title);
          resultPanel.addChild(finalScoreNode);
          resultPanel.addChild(bestScore);
          resultPanel.addChild(rating);
          resultPanel.addChild(newRecord);
          resultPanel.addChild(challenge);
          title.setPosition(0, layout.height / 2 - 420, 0);
          finalScoreNode.setPosition(0, layout.height / 2 - 540, 0);
          bestScore.setPosition(0, layout.height / 2 - 610, 0);
          rating.setPosition(0, layout.height / 2 - 675, 0);
          newRecord.setPosition(0, layout.height / 2 - 480, 0);
          challenge.setPosition(105, layout.height / 2 - 770, 0);
          newRecord.active = false;
          var resultMole = this.createCuteMolePreview();
          resultPanel.addChild(resultMole);
          resultMole.setPosition(-235, layout.height / 2 - 765, 0);
          var replayButton = this.createButton('ReplayButton', '再来一次', new Color(255, 184, 65, 255), function () {
            gameManager.handleReplayButton();
          }, 350, 96, 36, ArtAssetKey.PrimaryButton);
          var homeButton = this.createButton('HomeButton', '返回首页', new Color(122, 190, 91, 255), function () {
            gameManager.handleHomeButton();
          }, 350, 96, 36, ArtAssetKey.SecondaryButton);
          var shareButton = this.createButton('ShareButton', '分享战绩', new Color(255, 211, 97, 255), function () {
            var _finalScoreNode$getCo, _finalScoreNode$getCo2;
            audioManager.playButtonClick();
            var score = _this3.parseScoreFromLabel((_finalScoreNode$getCo = (_finalScoreNode$getCo2 = finalScoreNode.getComponent(Label)) == null ? void 0 : _finalScoreNode$getCo2.string) != null ? _finalScoreNode$getCo : '');
            AnalyticsManager.track('share_result', {
              score: score,
              available: PlatformAdapter.shareScore(score)
            });
          }, 250, 78, 30, ArtAssetKey.PrimaryButton);
          var leaderboardButton = this.createButton('LeaderboardButton', '排行榜', new Color(141, 205, 255, 255), function () {
            audioManager.playButtonClick();
            leaderboardPanel.active = true;
            var available = PlatformAdapter.showLeaderboard();
            leaderboardFallback.active = !available;
            AnalyticsManager.track('leaderboard_open', {
              available: available
            });
          }, 250, 78, 30, ArtAssetKey.SecondaryButton);
          var soundButton = this.createSoundButton('ResultSoundButton', audioManager);
          resultPanel.addChild(replayButton);
          resultPanel.addChild(homeButton);
          resultPanel.addChild(shareButton);
          resultPanel.addChild(leaderboardButton);
          resultPanel.addChild(soundButton);
          replayButton.setPosition(0, -layout.height / 2 + 380, 0);
          homeButton.setPosition(0, -layout.height / 2 + 265, 0);
          shareButton.setPosition(-140, -layout.height / 2 + 155, 0);
          leaderboardButton.setPosition(140, -layout.height / 2 + 155, 0);
          soundButton.setPosition(0, -layout.height / 2 + 60, 0);
          return {
            finalScoreLabel: finalScoreNode.getComponent(Label),
            bestScoreLabel: bestScore.getComponent(Label),
            ratingLabel: rating.getComponent(Label),
            newRecordLabel: newRecord.getComponent(Label),
            challengeLabel: challenge.getComponent(Label),
            bottomSafeNodes: [replayButton, homeButton, shareButton, leaderboardButton, soundButton]
          };
        };
        _proto.buildLeaderboardPanel = function buildLeaderboardPanel(panel, audioManager) {
          this.drawPauseMask(panel);
          var card = new Node('LeaderboardCard');
          card.layer = Layers.Enum.UI_2D;
          card.addComponent(UITransform).setContentSize(650, 990);
          var graphics = card.addComponent(Graphics);
          graphics.fillColor = new Color(118, 74, 37, 255);
          graphics.roundRect(-325, -495, 650, 990, 38);
          graphics.fill();
          graphics.fillColor = new Color(255, 247, 206, 255);
          graphics.roundRect(-307, -477, 614, 954, 32);
          graphics.fill();
          panel.addChild(card);
          var title = this.createLabel('LeaderboardTitle', '好友排行榜', 48, new Color(91, 52, 31, 255), 500, 80);
          panel.addChild(title);
          title.setPosition(0, 405, 0);
          var subContextNode = new Node('LeaderboardSubContext');
          subContextNode.layer = Layers.Enum.UI_2D;
          subContextNode.addComponent(UITransform).setContentSize(580, 760);
          var subContextView = subContextNode.addComponent(SubContextView);
          subContextView.fps = 15;
          panel.addChild(subContextNode);
          subContextNode.setPosition(0, -20, 0);
          var fallback = this.createLabel('LeaderboardFallback', '排行榜需要在微信或抖音开发者工具中查看', 27, new Color(91, 72, 47, 255), 520, 130);
          panel.addChild(fallback);
          fallback.setPosition(0, 0, 0);
          fallback.active = false;
          var closeButton = this.createButton('LeaderboardCloseButton', '关闭', new Color(122, 190, 91, 255), function () {
            audioManager.playButtonClick();
            PlatformAdapter.hideLeaderboard();
            panel.active = false;
          }, 240, 76, 30, ArtAssetKey.SecondaryButton);
          panel.addChild(closeButton);
          closeButton.setPosition(0, -420, 0);
          return fallback;
        };
        _proto.buildTutorialPanel = function buildTutorialPanel(tutorialPanel, tutorialManager) {
          var _actionButton$getChil, _actionButton$getChil2;
          var card = new Node('TutorialCard');
          card.layer = Layers.Enum.UI_2D;
          card.addComponent(UITransform).setContentSize(620, 760);
          var cardGraphics = card.addComponent(Graphics);
          cardGraphics.fillColor = new Color(104, 65, 37, 255);
          cardGraphics.roundRect(-310, -380, 620, 760, 42);
          cardGraphics.fill();
          cardGraphics.fillColor = new Color(255, 249, 219, 255);
          cardGraphics.roundRect(-294, -364, 588, 728, 34);
          cardGraphics.fill();
          cardGraphics.strokeColor = new Color(215, 151, 72, 255);
          cardGraphics.lineWidth = 6;
          cardGraphics.roundRect(-294, -364, 588, 728, 34);
          cardGraphics.stroke();
          tutorialPanel.addChild(card);
          var badge = new Node('TutorialBadge');
          badge.layer = Layers.Enum.UI_2D;
          badge.addComponent(UITransform).setContentSize(430, 130);
          var badgeGraphics = badge.addComponent(Graphics);
          badgeGraphics.fillColor = new Color(143, 211, 99, 255);
          badgeGraphics.roundRect(-215, -65, 430, 130, 32);
          badgeGraphics.fill();
          badgeGraphics.fillColor = new Color(255, 255, 255, 46);
          badgeGraphics.roundRect(-190, 32, 380, 14, 7);
          badgeGraphics.fill();
          tutorialPanel.addChild(badge);
          badge.setPosition(0, 88, 0);
          var heading = this.createLabel('TutorialHeading', '新兵训练', 30, new Color(168, 105, 48, 255), 360, 60);
          var title = this.createLabel('TutorialTitle', '', 52, new Color(91, 52, 31, 255), 520, 90);
          var symbol = this.createLabel('TutorialSymbol', '', 36, new Color(255, 255, 235, 255), 400, 90);
          var description = this.createLabel('TutorialDescription', '', 31, new Color(91, 72, 47, 255), 520, 150);
          var progress = this.createLabel('TutorialProgress', '', 30, new Color(114, 166, 74, 255), 300, 55);
          tutorialPanel.addChild(heading);
          tutorialPanel.addChild(title);
          tutorialPanel.addChild(symbol);
          tutorialPanel.addChild(description);
          tutorialPanel.addChild(progress);
          heading.setPosition(0, 305, 0);
          title.setPosition(0, 240, 0);
          symbol.setPosition(0, 88, 0);
          description.setPosition(0, -38, 0);
          progress.setPosition(0, -142, 0);
          var actionButton = this.createButton('TutorialActionButton', '下一步', new Color(255, 184, 65, 255), function () {
            tutorialManager.handleNext();
          }, 330, 92, 34, ArtAssetKey.PrimaryButton);
          var skipButton = this.createButton('TutorialSkipButton', '跳过引导', new Color(183, 215, 145, 255), function () {
            tutorialManager.handleSkip();
          }, 230, 68, 26, ArtAssetKey.SecondaryButton);
          tutorialPanel.addChild(actionButton);
          tutorialPanel.addChild(skipButton);
          actionButton.setPosition(0, -245, 0);
          skipButton.setPosition(0, -332, 0);
          tutorialManager.panel = tutorialPanel;
          tutorialManager.titleLabel = title.getComponent(Label);
          tutorialManager.descriptionLabel = description.getComponent(Label);
          tutorialManager.symbolLabel = symbol.getComponent(Label);
          tutorialManager.progressLabel = progress.getComponent(Label);
          tutorialManager.actionLabel = (_actionButton$getChil = (_actionButton$getChil2 = actionButton.getChildByName('Label')) == null ? void 0 : _actionButton$getChil2.getComponent(Label)) != null ? _actionButton$getChil : null;
        };
        _proto.createHoles = function createHoles(holeRoot) {
          var holes = [];
          var startX = -220;
          var startY = 245;
          var gapX = 220;
          var gapY = 230;
          for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
              var hole = new Node("Hole_" + (row * 3 + col + 1));
              hole.layer = Layers.Enum.UI_2D;
              hole.addComponent(UITransform).setContentSize(178, 132);
              var graphics = hole.addComponent(Graphics);
              graphics.fillColor = new Color(91, 164, 72, 160);
              graphics.ellipse(0, -24, 96, 24);
              graphics.fill();
              graphics.fillColor = new Color(129, 77, 39, 255);
              graphics.ellipse(0, -2, 88, 52);
              graphics.fill();
              graphics.strokeColor = new Color(92, 55, 30, 255);
              graphics.lineWidth = 5;
              graphics.ellipse(0, -2, 88, 52);
              graphics.stroke();
              graphics.strokeColor = new Color(174, 108, 55, 255);
              graphics.lineWidth = 3;
              graphics.moveTo(-55, -28);
              graphics.quadraticCurveTo(-18, -45, 20, -38);
              graphics.moveTo(-38, 18);
              graphics.quadraticCurveTo(0, 34, 43, 16);
              graphics.stroke();
              graphics.fillColor = new Color(84, 48, 30, 255);
              graphics.ellipse(0, -5, 72, 40);
              graphics.fill();
              graphics.fillColor = new Color(48, 28, 23, 255);
              graphics.ellipse(0, -12, 58, 30);
              graphics.fill();
              ArtResourceManager.applySprite(hole, ArtAssetKey.WoodHole, 188, 188);
              holeRoot.addChild(hole);
              hole.setPosition(startX + col * gapX, startY - row * gapY, 0);
              holes.push(hole);
            }
          }
          return holes;
        };
        _proto.createPanel = function createPanel(name, active) {
          var layout = this.getLayoutSize();
          var panel = new Node(name);
          panel.layer = Layers.Enum.UI_2D;
          panel.active = active;
          panel.addComponent(UITransform).setContentSize(layout.width, layout.height);
          this.ensureWidget(panel);
          this.node.addChild(panel);
          panel.setPosition(Vec3.ZERO);
          return panel;
        };
        _proto.createLabel = function createLabel(name, text, fontSize, color, width, height) {
          if (width === void 0) {
            width = 360;
          }
          if (height === void 0) {
            height = 90;
          }
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform).setContentSize(width, height);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = fontSize + 8;
          label.color = color;
          label.useSystemFont = true;
          label.fontFamily = 'Arial';
          label.isBold = fontSize >= 30;
          label.enableOutline = true;
          label.outlineWidth = fontSize >= 38 ? 3 : 2;
          var luminance = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
          label.outlineColor = luminance >= 170 ? new Color(91, 52, 31, 220) : new Color(255, 249, 219, 210);
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          return node;
        };
        _proto.createButton = function createButton(name, text, color, onClick, width, height, fontSize, artKey) {
          if (width === void 0) {
            width = 300;
          }
          if (height === void 0) {
            height = 88;
          }
          if (fontSize === void 0) {
            fontSize = 34;
          }
          if (artKey === void 0) {
            artKey = null;
          }
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = new Color(118, 74, 37, 255);
          graphics.roundRect(-width / 2, -height / 2 - 8, width, height, 24);
          graphics.fill();
          graphics.fillColor = color;
          graphics.roundRect(-width / 2, -height / 2, width, height, 24);
          graphics.fill();
          graphics.fillColor = new Color(255, 255, 255, 65);
          graphics.roundRect(-width / 2 + 18, height / 2 - 24, width - 36, 12, 6);
          graphics.fill();
          graphics.strokeColor = new Color(112, 72, 39, 255);
          graphics.lineWidth = 4;
          graphics.roundRect(-width / 2, -height / 2, width, height, 24);
          graphics.stroke();
          node.addComponent(Button);
          this.bindButtonPressAnimation(node);
          node.on(Node.EventType.TOUCH_END, function () {
            onClick();
            // 页面可能在回调中立即隐藏，仍要保证下次显示时按钮比例正确。
            node.setScale(Vec3.ONE);
          });
          var labelNode = this.createLabel('Label', text, fontSize, new Color(91, 52, 31, 255));
          labelNode.getComponent(UITransform).setContentSize(width, height);
          node.addChild(labelNode);
          labelNode.setPosition(0, 0, 0);
          if (artKey) {
            ArtResourceManager.applySprite(node, artKey, width + 34, height + 24);
          }
          return node;
        };
        _proto.createIconButton = function createIconButton(name, artKey, onClick, size) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform).setContentSize(size, size);
          node.addComponent(Button);
          this.bindButtonPressAnimation(node);
          node.on(Node.EventType.TOUCH_END, function () {
            onClick();
            node.setScale(Vec3.ONE);
          });
          ArtResourceManager.applySprite(node, artKey, size, size);
          return node;
        };
        _proto.createSoundButton = function createSoundButton(name, audioManager) {
          var soundButton = this.createButton(name, audioManager.isSoundEnabled() ? '声音：开' : '声音：关', new Color(255, 232, 149, 255), function () {
            var _soundButton$getChild;
            audioManager.playButtonClick();
            var enabled = audioManager.toggleSound();
            AnalyticsManager.track('sound_toggle', {
              enabled: enabled
            });
            var label = (_soundButton$getChild = soundButton.getChildByName('Label')) == null ? void 0 : _soundButton$getChild.getComponent(Label);
            if (label) {
              label.string = enabled ? '声音：开' : '声音：关';
            }
          }, 220, 72, 28);
          return soundButton;
        };
        _proto.drawGrassBackground = function drawGrassBackground(background) {
          var layout = this.getLayoutSize();
          var graphics = background.addComponent(Graphics);
          graphics.fillColor = new Color(142, 219, 98, 255);
          graphics.rect(-layout.width / 2, -layout.height / 2, layout.width, layout.height);
          graphics.fill();
          graphics.fillColor = new Color(111, 196, 82, 255);
          graphics.moveTo(-layout.width / 2, -layout.height / 2 + 210);
          graphics.bezierCurveTo(-170, -layout.height / 2 + 300, 120, -layout.height / 2 + 160, layout.width / 2, -layout.height / 2 + 260);
          graphics.lineTo(layout.width / 2, -layout.height / 2);
          graphics.lineTo(-layout.width / 2, -layout.height / 2);
          graphics.close();
          graphics.fill();
          graphics.fillColor = new Color(111, 200, 82, 255);
          for (var i = 0; i < 28; i++) {
            var x = -350 + i * 28;
            graphics.circle(x, -layout.height / 2 + 92 + i % 4 * 18, 18 + i % 2 * 6);
          }
          graphics.fill();
          graphics.fillColor = new Color(255, 238, 127, 255);
          this.drawFlower(graphics, -285, layout.height / 2 - 250);
          this.drawFlower(graphics, 292, layout.height / 2 - 430);
          this.drawFlower(graphics, -250, -layout.height / 2 + 420);
          this.drawFlower(graphics, 310, -layout.height / 2 + 230);
          graphics.fill();
        };
        _proto.drawPauseMask = function drawPauseMask(mask) {
          var layout = this.getLayoutSize();
          var graphics = mask.addComponent(Graphics);
          graphics.fillColor = new Color(0, 0, 0, 135);
          graphics.rect(-layout.width / 2, -layout.height / 2, layout.width, layout.height);
          graphics.fill();
        };
        _proto.getLayoutSize = function getLayoutSize() {
          var visibleSize = view.getVisibleSize();
          return {
            width: Math.max(DESIGN_WIDTH, visibleSize.width),
            height: Math.max(DESIGN_HEIGHT, visibleSize.height)
          };
        };
        _proto.createStatusPill = function createStatusPill(name, color) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          var width = 300;
          var height = 86;
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = new Color(118, 74, 37, 255);
          graphics.roundRect(-width / 2, -height / 2 - 5, width, height, 26);
          graphics.fill();
          graphics.fillColor = color;
          graphics.roundRect(-width / 2, -height / 2, width, height, 26);
          graphics.fill();
          return node;
        };
        _proto.createCircleIcon = function createCircleIcon(name, color) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform).setContentSize(52, 52);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.circle(0, 0, 24);
          graphics.fill();
          graphics.fillColor = new Color(255, 255, 255, 95);
          graphics.circle(-7, 8, 8);
          graphics.fill();
          return node;
        };
        _proto.drawStarIcon = function drawStarIcon(node) {
          var graphics = node.getComponent(Graphics);
          if (!graphics) {
            return;
          }
          graphics.fillColor = new Color(255, 255, 255, 210);
          var points = [[0, 18], [6, 6], [19, 5], [9, -4], [12, -17], [0, -10], [-12, -17], [-9, -4], [-19, 5], [-6, 6]];
          graphics.moveTo(points[0][0], points[0][1]);
          for (var i = 1; i < points.length; i++) {
            graphics.lineTo(points[i][0], points[i][1]);
          }
          graphics.close();
          graphics.fill();
        };
        _proto.drawClockIcon = function drawClockIcon(node) {
          var graphics = node.getComponent(Graphics);
          if (!graphics) {
            return;
          }
          graphics.strokeColor = new Color(255, 255, 255, 225);
          graphics.lineWidth = 5;
          graphics.circle(0, 0, 15);
          graphics.stroke();
          graphics.moveTo(0, 0);
          graphics.lineTo(0, 10);
          graphics.moveTo(0, 0);
          graphics.lineTo(9, -6);
          graphics.stroke();
        };
        _proto.createWoodSign = function createWoodSign(name, width, height) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = new Color(112, 70, 38, 255);
          graphics.roundRect(-width / 2, -height / 2, width, height, 34);
          graphics.fill();
          graphics.fillColor = new Color(163, 102, 51, 255);
          graphics.roundRect(-width / 2 + 14, -height / 2 + 12, width - 28, height - 24, 28);
          graphics.fill();
          graphics.strokeColor = new Color(91, 52, 31, 255);
          graphics.lineWidth = 5;
          graphics.moveTo(-width / 2 + 70, 18);
          graphics.quadraticCurveTo(-120, 38, 25, 20);
          graphics.moveTo(-width / 2 + 90, -28);
          graphics.quadraticCurveTo(-10, -8, width / 2 - 120, -30);
          graphics.stroke();
          ArtResourceManager.applySprite(node, ArtAssetKey.TitleSign, width, 276);
          return node;
        };
        _proto.createFieldFrame = function createFieldFrame(name) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform).setContentSize(700, 760);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = new Color(121, 204, 86, 115);
          graphics.roundRect(-350, -380, 700, 760, 38);
          graphics.fill();
          graphics.strokeColor = new Color(96, 181, 75, 180);
          graphics.lineWidth = 5;
          graphics.roundRect(-350, -380, 700, 760, 38);
          graphics.stroke();
          return node;
        };
        _proto.createResultCard = function createResultCard() {
          var node = new Node('ResultCard');
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform).setContentSize(620, 520);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = new Color(118, 74, 37, 255);
          graphics.roundRect(-310, -260, 620, 520, 40);
          graphics.fill();
          graphics.fillColor = new Color(255, 247, 206, 255);
          graphics.roundRect(-292, -242, 584, 484, 34);
          graphics.fill();
          graphics.strokeColor = new Color(173, 110, 55, 255);
          graphics.lineWidth = 6;
          graphics.roundRect(-292, -242, 584, 484, 34);
          graphics.stroke();
          ArtResourceManager.applySprite(node, ArtAssetKey.ResultCard, 620, 422);
          return node;
        };
        _proto.drawFlower = function drawFlower(graphics, x, y) {
          graphics.circle(x - 8, y, 7);
          graphics.circle(x + 8, y, 7);
          graphics.circle(x, y - 8, 7);
          graphics.circle(x, y + 8, 7);
          graphics.circle(x, y, 5);
        };
        _proto.createCuteMolePreview = function createCuteMolePreview() {
          var node = new Node('CuteMolePreview');
          node.layer = Layers.Enum.UI_2D;
          node.addComponent(UITransform).setContentSize(220, 220);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = new Color(104, 63, 37, 255);
          graphics.ellipse(0, -70, 108, 42);
          graphics.fill();
          graphics.fillColor = new Color(139, 83, 45, 255);
          graphics.circle(0, -10, 74);
          graphics.fill();
          graphics.fillColor = new Color(200, 132, 78, 255);
          graphics.circle(0, -33, 46);
          graphics.fill();
          graphics.fillColor = new Color(255, 255, 255, 255);
          graphics.circle(-27, 18, 18);
          graphics.circle(27, 18, 18);
          graphics.fill();
          graphics.fillColor = new Color(35, 22, 18, 255);
          graphics.circle(-27, 18, 8);
          graphics.circle(27, 18, 8);
          graphics.circle(0, -6, 7);
          graphics.fill();
          ArtResourceManager.applySprite(node, ArtAssetKey.NormalMole, 220, 220);
          return node;
        };
        _proto.ensureWidget = function ensureWidget(node) {
          var _node$getComponent;
          var widget = (_node$getComponent = node.getComponent(Widget)) != null ? _node$getComponent : node.addComponent(Widget);
          widget.isAlignLeft = true;
          widget.isAlignRight = true;
          widget.isAlignTop = true;
          widget.isAlignBottom = true;
          widget.left = 0;
          widget.right = 0;
          widget.top = 0;
          widget.bottom = 0;
          widget.alignMode = Widget.AlignMode.ALWAYS;
        };
        _proto.clearGeneratedNodes = function clearGeneratedNodes() {
          var generatedNames = new Set(['Background', 'HomePanel', 'GamePanel', 'ResultPanel', 'PauseMask', 'EffectsLayer', 'TutorialPanel', 'LeaderboardPanel', 'Managers']);
          var children = [].concat(this.node.children);
          for (var _iterator = _createForOfIteratorHelperLoose(children), _step; !(_step = _iterator()).done;) {
            var child = _step.value;
            if (generatedNames.has(child.name)) {
              child.destroy();
            }
          }
        };
        _proto.showHitFeedback = function showHitFeedback(effectsLayer, score, combo, target) {
          var worldPosition = target.worldPosition;
          var localPosition = new Vec3();
          effectsLayer.inverseTransformPoint(localPosition, worldPosition);
          this.showHitBurst(effectsLayer, localPosition, score);
          var scoreText = score > 0 ? "+" + score : "" + score;
          var labelText = score > 0 && combo >= 2 ? scoreText + "  x" + combo : scoreText;
          var labelColor = score < 0 ? new Color(255, 92, 82, 255) : score >= 5 ? new Color(255, 223, 67, 255) : new Color(255, 247, 124, 255);
          var labelNode = this.createLabel('HitFloatText', labelText, combo >= 5 || score >= 5 ? 42 : 36, labelColor, 240, 70);
          effectsLayer.addChild(labelNode);
          labelNode.setPosition(localPosition.x, localPosition.y + 70, 0);
          tween(labelNode).set({
            scale: new Vec3(0.75, 0.75, 1)
          }).to(0.12, {
            scale: new Vec3(1.18, 1.18, 1)
          }).to(0.55, {
            position: new Vec3(localPosition.x, localPosition.y + 148, 0),
            scale: new Vec3(0.95, 0.95, 1)
          }).call(function () {
            labelNode.destroy();
          }).start();
        }

        /** 为所有按钮提供一致的按压回弹，避免每个页面重复配置。 */;
        _proto.bindButtonPressAnimation = function bindButtonPressAnimation(button) {
          var restore = function restore() {
            Tween.stopAllByTarget(button);
            tween(button).to(0.08, {
              scale: Vec3.ONE
            }, {
              easing: 'backOut'
            }).start();
          };
          button.on(Node.EventType.TOUCH_START, function () {
            Tween.stopAllByTarget(button);
            tween(button).to(0.05, {
              scale: new Vec3(0.94, 0.94, 1)
            }, {
              easing: 'quadOut'
            }).start();
          });
          button.on(Node.EventType.TOUCH_END, restore);
          button.on(Node.EventType.TOUCH_CANCEL, restore);
        }

        /** 命中时显示扩散光圈和短促粒子，颜色区分普通、金色与炸弹。 */;
        _proto.showHitBurst = function showHitBurst(effectsLayer, position, score) {
          var burst = new Node('HitBurst');
          burst.layer = Layers.Enum.UI_2D;
          burst.addComponent(UITransform).setContentSize(220, 220);
          var opacity = burst.addComponent(UIOpacity);
          var graphics = burst.addComponent(Graphics);
          var color = score < 0 ? new Color(255, 82, 72, 230) : score >= 5 ? new Color(255, 220, 52, 245) : new Color(255, 249, 154, 225);
          graphics.strokeColor = color;
          graphics.lineWidth = score >= 5 ? 10 : 7;
          graphics.circle(0, 0, score >= 5 ? 62 : 48);
          graphics.stroke();
          graphics.fillColor = color;
          var particleCount = score >= 5 ? 10 : 7;
          for (var i = 0; i < particleCount; i++) {
            var angle = Math.PI * 2 * i / particleCount;
            var radius = score >= 5 ? 86 : 72;
            graphics.circle(Math.cos(angle) * radius, Math.sin(angle) * radius, i % 2 === 0 ? 8 : 5);
          }
          graphics.fill();
          effectsLayer.addChild(burst);
          burst.setPosition(position.x, position.y + 4, 0);
          burst.setScale(new Vec3(0.3, 0.3, 1));
          opacity.opacity = 255;
          tween(burst).to(0.24, {
            scale: new Vec3(score >= 5 ? 1.55 : 1.35, score >= 5 ? 1.55 : 1.35, 1)
          }, {
            easing: 'quadOut'
          }).start();
          tween(opacity).delay(0.08).to(0.2, {
            opacity: 0
          }).call(function () {
            return burst.destroy();
          }).start();
        }

        /** 炸弹命中时轻微震动游戏层，幅度短且可控，不影响节点最终布局。 */;
        _proto.playScreenShake = function playScreenShake(gamePanel) {
          Tween.stopAllByTarget(gamePanel);
          gamePanel.setPosition(Vec3.ZERO);
          tween(gamePanel).to(0.035, {
            position: new Vec3(-9, 5, 0)
          }).to(0.035, {
            position: new Vec3(8, -4, 0)
          }).to(0.035, {
            position: new Vec3(-5, -3, 0)
          }).to(0.045, {
            position: Vec3.ZERO
          }).start();
        };
        _proto.getDifficultyText = function getDifficultyText(level) {
          if (level >= 3) {
            return '难度：突击';
          }
          if (level >= 2) {
            return '难度：加速';
          }
          return '难度：轻松';
        };
        _proto.parseScoreFromLabel = function parseScoreFromLabel(text) {
          var match = text.match(/\d+/);
          return match ? Number(match[0]) : 0;
        };
        return AutoGameBootstrap;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "rebuildOnLoad", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _class2)) || _class) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ComboManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Label, Color, tween, Vec3, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Color = module.Color;
      tween = module.tween;
      Vec3 = module.Vec3;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "e9083K7odxMN79Wjtj36uVF", "ComboManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * 连击管理器。
       * 连续命中会刷新连击时间，超过窗口未命中则自动断连。
       */
      var ComboManager = exports('ComboManager', (_dec = ccclass('ComboManager'), _dec2 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(ComboManager, _Component);
        function ComboManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "comboLabel", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "comboWindowSeconds", _descriptor2, _assertThisInitialized(_this));
          _this.combo = 0;
          _this.remainSeconds = 0;
          return _this;
        }
        var _proto = ComboManager.prototype;
        _proto.reset = function reset() {
          this.combo = 0;
          this.remainSeconds = 0;
          this.refreshView();
        };
        _proto.addCombo = function addCombo() {
          this.combo += 1;
          this.remainSeconds = this.comboWindowSeconds;
          this.refreshView(true);
          return this.combo;
        };
        _proto.breakCombo = function breakCombo() {
          this.combo = 0;
          this.remainSeconds = 0;
          this.refreshView();
        };
        _proto.update = function update(deltaTime) {
          if (this.combo <= 0) {
            return;
          }
          this.remainSeconds -= deltaTime;
          if (this.remainSeconds <= 0) {
            this.breakCombo();
          }
        };
        _proto.refreshView = function refreshView(playPulse) {
          if (playPulse === void 0) {
            playPulse = false;
          }
          if (!this.comboLabel) {
            return;
          }
          var labelNode = this.comboLabel.node;
          labelNode.active = this.combo >= 2;
          this.comboLabel.string = this.combo >= 2 ? "Combo x" + this.combo : '';
          this.comboLabel.color = this.combo >= 5 ? new Color(255, 117, 76, 255) : new Color(255, 244, 174, 255);
          if (playPulse) {
            this.playPulse(labelNode);
          }
        };
        _proto.playPulse = function playPulse(node) {
          tween(node).stop().set({
            scale: new Vec3(0.86, 0.86, 1)
          }).to(0.1, {
            scale: new Vec3(1.15, 1.15, 1)
          }).to(0.08, {
            scale: Vec3.ONE
          }).start();
        };
        return ComboManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "comboLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "comboWindowSeconds", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DailyChallengeManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './StorageManager.ts'], function (exports) {
  var _extends, cclegacy, StorageManager;
  return {
    setters: [function (module) {
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2ac34+kk+BKFJKSuS46s08R", "DailyChallengeManager", undefined);
      /** 每日挑战规则与结算，按本地自然日轮换且离线可用。 */
      var DailyChallengeManager = exports('DailyChallengeManager', /*#__PURE__*/function () {
        function DailyChallengeManager() {}
        DailyChallengeManager.getSnapshot = function getSnapshot(now) {
          if (now === void 0) {
            now = new Date();
          }
          var dateKey = this.getDateKey(now);
          var definition = this.getDefinition(now);
          var savedState = StorageManager.getDailyChallengeState();
          var state = (savedState == null ? void 0 : savedState.dateKey) === dateKey ? savedState : this.createState(dateKey);
          if ((savedState == null ? void 0 : savedState.dateKey) !== dateKey) {
            StorageManager.saveDailyChallengeState(state);
          }
          return this.toSnapshot(state, definition);
        };
        DailyChallengeManager.recordRound = function recordRound(stats, now) {
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
            completed: completed,
            rewardGranted: snapshot.rewardGranted
          };
          if (completed && !state.rewardGranted) {
            StorageManager.addMedals(1);
            state.rewardGranted = true;
          }
          StorageManager.saveDailyChallengeState(state);
          return {
            snapshot: this.toSnapshot(state, snapshot),
            justCompleted: completed && !previousCompleted
          };
        };
        DailyChallengeManager.getDisplayText = function getDisplayText(snapshot) {
          var progress = Math.min(snapshot.progress, snapshot.target);
          var status = snapshot.completed ? '已完成' : progress + "/" + snapshot.target;
          return "\u4ECA\u65E5\u6311\u6218\uFF1A" + snapshot.title + "  " + status;
        };
        DailyChallengeManager.getRoundProgress = function getRoundProgress(kind, stats) {
          if (kind === 'score') {
            return Math.max(0, Math.floor(stats.score));
          }
          if (kind === 'golden') {
            return Math.max(0, Math.floor(stats.goldenHits));
          }
          return Math.max(0, Math.floor(stats.positiveHits));
        };
        DailyChallengeManager.createState = function createState(dateKey) {
          return {
            dateKey: dateKey,
            progress: 0,
            completed: false,
            rewardGranted: false
          };
        };
        DailyChallengeManager.toSnapshot = function toSnapshot(state, definition) {
          return _extends({}, state, definition, {
            medalCount: StorageManager.getMedalCount()
          });
        };
        DailyChallengeManager.getDefinition = function getDefinition(now) {
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
        };
        DailyChallengeManager.getDateKey = function getDateKey(now) {
          var year = now.getFullYear();
          var monthValue = now.getMonth() + 1;
          var dayValue = now.getDate();
          var month = monthValue < 10 ? "0" + monthValue : "" + monthValue;
          var day = dayValue < 10 ? "0" + dayValue : "" + dayValue;
          return year + "-" + month + "-" + day;
        };
        return DailyChallengeManager;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts', './AnalyticsManager.ts', './GameTypes.ts', './StorageManager.ts', './PlatformAdapter.ts', './UIManager.ts', './TutorialManager.ts', './ComboManager.ts', './DailyChallengeManager.ts', './MoleManager.ts', './ScoreManager.ts', './TimerManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Component, AudioManager, AnalyticsManager, GameState, DEFAULT_GAME_SECONDS, StorageManager, PlatformAdapter, UIManager, TutorialManager, ComboManager, DailyChallengeManager, MoleManager, ScoreManager, TimerManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AnalyticsManager = module.AnalyticsManager;
    }, function (module) {
      GameState = module.GameState;
      DEFAULT_GAME_SECONDS = module.DEFAULT_GAME_SECONDS;
    }, function (module) {
      StorageManager = module.StorageManager;
    }, function (module) {
      PlatformAdapter = module.PlatformAdapter;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      TutorialManager = module.TutorialManager;
    }, function (module) {
      ComboManager = module.ComboManager;
    }, function (module) {
      DailyChallengeManager = module.DailyChallengeManager;
    }, function (module) {
      MoleManager = module.MoleManager;
    }, function (module) {
      ScoreManager = module.ScoreManager;
    }, function (module) {
      TimerManager = module.TimerManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;
      cclegacy._RF.push({}, "7fb0c4a1AtLPZLOLu2apsG/", "GameManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * 游戏总控。
       * 只做状态编排，把计时、计分、地鼠生成和 UI 显示交给对应模块。
       */
      var GameManager = exports('GameManager', (_dec = ccclass('GameManager'), _dec2 = property(ScoreManager), _dec3 = property(TimerManager), _dec4 = property(MoleManager), _dec5 = property(UIManager), _dec6 = property(AudioManager), _dec7 = property(ComboManager), _dec8 = property(TutorialManager), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameManager, _Component);
        function GameManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "scoreManager", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "timerManager", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "moleManager", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "uiManager", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "audioManager", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "comboManager", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "tutorialManager", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "gameSeconds", _descriptor8, _assertThisInitialized(_this));
          _this.onHitFeedback = null;
          _this.onDifficultyChanged = null;
          _this.state = GameState.Home;
          _this.difficultyLevel = 1;
          _this.roundPositiveHits = 0;
          _this.roundGoldenHits = 0;
          _this.roundBombHits = 0;
          _this.roundMisses = 0;
          _this.roundMaxCombo = 0;
          _this.roundStartedAt = 0;
          return _this;
        }
        var _proto = GameManager.prototype;
        _proto.start = function start() {
          AnalyticsManager.initialize();
          PlatformAdapter.setupShareMenu();
          void PlatformAdapter.login().then(function (result) {
            AnalyticsManager.track('login_result', {
              platform: result.platform,
              success: result.success,
              error: result.errorMessage
            });
          });
          this.enterHome();
        };
        _proto.handleStartButton = function handleStartButton() {
          var _this$audioManager,
            _this$audioManager2,
            _this$tutorialManager,
            _this2 = this;
          (_this$audioManager = this.audioManager) == null || _this$audioManager.playButtonClick();
          (_this$audioManager2 = this.audioManager) == null || _this$audioManager2.ensureBackgroundMusic();
          if ((_this$tutorialManager = this.tutorialManager) != null && _this$tutorialManager.shouldShow()) {
            AnalyticsManager.track('tutorial_open');
            this.tutorialManager.show(function () {
              return _this2.startGame('home');
            });
            return;
          }
          this.startGame('home');
        };
        _proto.handleReplayButton = function handleReplayButton() {
          var _this$audioManager3;
          (_this$audioManager3 = this.audioManager) == null || _this$audioManager3.playButtonClick();
          this.startGame('replay');
        };
        _proto.handleHomeButton = function handleHomeButton() {
          var _this$audioManager4;
          (_this$audioManager4 = this.audioManager) == null || _this$audioManager4.playButtonClick();
          this.enterHome();
        };
        _proto.handlePauseButton = function handlePauseButton() {
          var _this$audioManager5;
          (_this$audioManager5 = this.audioManager) == null || _this$audioManager5.playButtonClick();
          if (this.state === GameState.Playing) {
            this.pauseGame();
            return;
          }
          if (this.state === GameState.Paused) {
            this.resumeGame();
          }
        };
        _proto.startGame = function startGame(source) {
          var _this$scoreManager,
            _this$comboManager,
            _this$uiManager,
            _this$moleManager,
            _this$onDifficultyCha,
            _this$timerManager,
            _this3 = this,
            _this$moleManager2;
          if (source === void 0) {
            source = 'home';
          }
          this.state = GameState.Playing;
          this.difficultyLevel = 1;
          this.roundPositiveHits = 0;
          this.roundGoldenHits = 0;
          this.roundBombHits = 0;
          this.roundMisses = 0;
          this.roundMaxCombo = 0;
          this.roundStartedAt = Date.now();
          var playCount = StorageManager.incrementPlayCount();
          AnalyticsManager.track('game_start', {
            source: source,
            play_count: playCount
          });
          (_this$scoreManager = this.scoreManager) == null || _this$scoreManager.reset();
          (_this$comboManager = this.comboManager) == null || _this$comboManager.reset();
          (_this$uiManager = this.uiManager) == null || _this$uiManager.showGame();
          (_this$moleManager = this.moleManager) == null || _this$moleManager.setDifficultyLevel(this.difficultyLevel);
          (_this$onDifficultyCha = this.onDifficultyChanged) == null || _this$onDifficultyCha.call(this, this.difficultyLevel);
          (_this$timerManager = this.timerManager) == null || _this$timerManager.startTimer(this.gameSeconds, function () {
            return _this3.finishGame();
          }, function (secondsLeft) {
            return _this3.updateDifficulty(secondsLeft);
          });
          (_this$moleManager2 = this.moleManager) == null || _this$moleManager2.startSpawning(function (score, hit, target) {
            var _this3$scoreManager, _this3$comboManager$a, _this3$comboManager2;
            if (!hit) {
              var _this3$comboManager;
              _this3.roundMisses += 1;
              (_this3$comboManager = _this3.comboManager) == null || _this3$comboManager.breakCombo();
              return;
            }
            (_this3$scoreManager = _this3.scoreManager) == null || _this3$scoreManager.addScore(score);
            if (score > 0) {
              _this3.roundPositiveHits += 1;
            }
            if (score >= 5) {
              _this3.roundGoldenHits += 1;
            }
            if (score < 0) {
              _this3.roundBombHits += 1;
            }
            PlatformAdapter.vibrateShort(score < 0 ? 'medium' : 'light');
            var combo = score > 0 ? (_this3$comboManager$a = (_this3$comboManager2 = _this3.comboManager) == null ? void 0 : _this3$comboManager2.addCombo()) != null ? _this3$comboManager$a : 0 : 0;
            if (score < 0) {
              var _this3$comboManager3;
              (_this3$comboManager3 = _this3.comboManager) == null || _this3$comboManager3.breakCombo();
            }
            _this3.roundMaxCombo = Math.max(_this3.roundMaxCombo, combo);
            _this3.onHitFeedback == null || _this3.onHitFeedback(score, combo, target);
          });
        };
        _proto.pauseGame = function pauseGame() {
          var _this$timerManager2, _this$moleManager3, _this$uiManager2, _this$timerManager$ge, _this$timerManager3;
          if (this.state !== GameState.Playing) {
            return;
          }
          this.state = GameState.Paused;
          (_this$timerManager2 = this.timerManager) == null || _this$timerManager2.pauseTimer();
          (_this$moleManager3 = this.moleManager) == null || _this$moleManager3.pauseSpawning();
          (_this$uiManager2 = this.uiManager) == null || _this$uiManager2.showPauseMask(true);
          AnalyticsManager.track('game_pause', {
            seconds_left: (_this$timerManager$ge = (_this$timerManager3 = this.timerManager) == null ? void 0 : _this$timerManager3.getSecondsLeft()) != null ? _this$timerManager$ge : 0
          });
        };
        _proto.resumeGame = function resumeGame() {
          var _this$timerManager4, _this$moleManager4, _this$uiManager3, _this$timerManager$ge2, _this$timerManager5;
          if (this.state !== GameState.Paused) {
            return;
          }
          this.state = GameState.Playing;
          (_this$timerManager4 = this.timerManager) == null || _this$timerManager4.resumeTimer();
          (_this$moleManager4 = this.moleManager) == null || _this$moleManager4.resumeSpawning();
          (_this$uiManager3 = this.uiManager) == null || _this$uiManager3.showPauseMask(false);
          AnalyticsManager.track('game_resume', {
            seconds_left: (_this$timerManager$ge2 = (_this$timerManager5 = this.timerManager) == null ? void 0 : _this$timerManager5.getSecondsLeft()) != null ? _this$timerManager$ge2 : 0
          });
        };
        _proto.enterHome = function enterHome() {
          var _this$timerManager6, _this$timerManager7, _this$scoreManager2, _this$comboManager2, _this$moleManager5, _this$uiManager4, _this$uiManager5;
          this.state = GameState.Home;
          (_this$timerManager6 = this.timerManager) == null || _this$timerManager6.stopTimer();
          (_this$timerManager7 = this.timerManager) == null || _this$timerManager7.resetTimer(this.gameSeconds);
          (_this$scoreManager2 = this.scoreManager) == null || _this$scoreManager2.reset();
          (_this$comboManager2 = this.comboManager) == null || _this$comboManager2.reset();
          (_this$moleManager5 = this.moleManager) == null || _this$moleManager5.stopSpawning();
          (_this$uiManager4 = this.uiManager) == null || _this$uiManager4.showDailyChallenge(DailyChallengeManager.getSnapshot());
          (_this$uiManager5 = this.uiManager) == null || _this$uiManager5.showHome();
        };
        _proto.finishGame = function finishGame() {
          var _this$moleManager6, _this$audioManager6, _this$audioManager7, _this$scoreManager$ge, _this$scoreManager3, _this$uiManager6, _this$uiManager7;
          if (this.state === GameState.GameOver) {
            return;
          }
          this.state = GameState.GameOver;
          (_this$moleManager6 = this.moleManager) == null || _this$moleManager6.stopSpawning();
          (_this$audioManager6 = this.audioManager) == null || _this$audioManager6.playTimeout();
          (_this$audioManager7 = this.audioManager) == null || _this$audioManager7.playGameOver();
          var finalScore = (_this$scoreManager$ge = (_this$scoreManager3 = this.scoreManager) == null ? void 0 : _this$scoreManager3.getScore()) != null ? _this$scoreManager$ge : 0;
          var previousBestScore = StorageManager.getBestScore();
          var isNewRecord = finalScore > previousBestScore;
          StorageManager.saveBestScore(finalScore);
          var bestScore = StorageManager.getBestScore();
          PlatformAdapter.submitScore(bestScore);
          var challengeUpdate = DailyChallengeManager.recordRound({
            score: finalScore,
            positiveHits: this.roundPositiveHits,
            goldenHits: this.roundGoldenHits
          });
          AnalyticsManager.track('game_end', {
            score: finalScore,
            best_score: bestScore,
            positive_hits: this.roundPositiveHits,
            golden_hits: this.roundGoldenHits,
            bomb_hits: this.roundBombHits,
            misses: this.roundMisses,
            max_combo: this.roundMaxCombo,
            duration_ms: Math.max(0, Date.now() - this.roundStartedAt),
            challenge_completed: challengeUpdate.snapshot.completed,
            new_record: isNewRecord
          });
          (_this$uiManager6 = this.uiManager) == null || _this$uiManager6.showDailyChallenge(challengeUpdate.snapshot, challengeUpdate.justCompleted);
          (_this$uiManager7 = this.uiManager) == null || _this$uiManager7.showResult(finalScore, bestScore, isNewRecord, this.getRatingText(finalScore));
        };
        _proto.updateDifficulty = function updateDifficulty(secondsLeft) {
          var _this$moleManager7, _this$onDifficultyCha2;
          if (this.state !== GameState.Playing) {
            return;
          }
          var elapsedSeconds = this.gameSeconds - secondsLeft;
          var nextLevel = elapsedSeconds >= 40 ? 3 : elapsedSeconds >= 20 ? 2 : 1;
          if (nextLevel === this.difficultyLevel) {
            return;
          }
          this.difficultyLevel = nextLevel;
          (_this$moleManager7 = this.moleManager) == null || _this$moleManager7.setDifficultyLevel(nextLevel);
          (_this$onDifficultyCha2 = this.onDifficultyChanged) == null || _this$onDifficultyCha2.call(this, nextLevel);
        };
        _proto.getRatingText = function getRatingText(score) {
          if (score >= 45) {
            return '评级：地鼠克星';
          }
          if (score >= 25) {
            return '评级：神射手';
          }
          if (score >= 10) {
            return '评级：熟练队员';
          }
          return '评级：见习队员';
        };
        return GameManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scoreManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "timerManager", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "moleManager", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "uiManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "audioManager", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "comboManager", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "tutorialManager", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "gameSeconds", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return DEFAULT_GAME_SECONDS;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameTypes.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "58a05JQDiFLB4iko6FTDwvG", "GameTypes", undefined);
      /**
       * 游戏公共类型定义。
       * 所有模块共享的枚举和配置集中放在这里，避免字符串散落在业务代码中。
       */

      var GameState = exports('GameState', /*#__PURE__*/function (GameState) {
        GameState["Home"] = "Home";
        GameState["Playing"] = "Playing";
        GameState["Paused"] = "Paused";
        GameState["GameOver"] = "GameOver";
        return GameState;
      }({}));
      var MoleType = exports('MoleType', /*#__PURE__*/function (MoleType) {
        MoleType["Normal"] = "Normal";
        MoleType["Golden"] = "Golden";
        MoleType["Bomb"] = "Bomb";
        return MoleType;
      }({}));
      var DEFAULT_GAME_SECONDS = exports('DEFAULT_GAME_SECONDS', 60);
      var NORMAL_MOLE_CONFIG = exports('NORMAL_MOLE_CONFIG', {
        type: MoleType.Normal,
        score: 1,
        staySeconds: 1
      });
      var GOLDEN_MOLE_CONFIG = exports('GOLDEN_MOLE_CONFIG', {
        type: MoleType.Golden,
        score: 5,
        staySeconds: 0.8
      });
      var BOMB_MOLE_CONFIG = exports('BOMB_MOLE_CONFIG', {
        type: MoleType.Bomb,
        score: -3,
        staySeconds: 0.9
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./AnalyticsManager.ts', './ArtResourceManager.ts', './AudioManager.ts', './GameTypes.ts', './StorageManager.ts', './AutoGameBootstrap.ts', './ComboManager.ts', './DailyChallengeManager.ts', './GameManager.ts', './Mole.ts', './MoleManager.ts', './ScoreManager.ts', './TimerManager.ts', './PlatformAdapter.ts', './SafeAreaLayout.ts', './TutorialManager.ts', './UIManager.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/Mole.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './GameTypes.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Sprite, Node, Vec3, tween, Component, NORMAL_MOLE_CONFIG;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Node = module.Node;
      Vec3 = module.Vec3;
      tween = module.tween;
      Component = module.Component;
    }, function (module) {
      NORMAL_MOLE_CONFIG = module.NORMAL_MOLE_CONFIG;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "c9da4aGaPFKhry+Lbv6VZnW", "Mole", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      /**
       * 单只地鼠的行为组件。
       * 负责出现、点击命中、自动缩回动画，不关心分数和整体游戏状态。
       */
      var Mole = exports('Mole', (_dec = ccclass('Mole'), _dec2 = property(Sprite), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Mole, _Component);
        function Mole() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "bodySprite", _descriptor, _assertThisInitialized(_this));
          _this.config = NORMAL_MOLE_CONFIG;
          _this.secondsLeft = NORMAL_MOLE_CONFIG.staySeconds;
          _this.visible = false;
          _this.paused = false;
          _this.onHit = null;
          _this.onHidden = null;
          return _this;
        }
        var _proto = Mole.prototype;
        _proto.onEnable = function onEnable() {
          this.node.on(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
        };
        _proto.onDisable = function onDisable() {
          this.node.off(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
        };
        _proto.show = function show(config, onHit, onHidden) {
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
        };
        _proto.pauseMole = function pauseMole() {
          this.paused = true;
        };
        _proto.resumeMole = function resumeMole() {
          this.paused = false;
        };
        _proto.update = function update(deltaTime) {
          if (!this.visible || this.paused) {
            return;
          }
          this.secondsLeft -= deltaTime;
          if (this.secondsLeft <= 0) {
            this.hide(false);
          }
        };
        _proto.handleTouchEnd = function handleTouchEnd(event) {
          var _this$onHit;
          event.propagationStopped = true;
          if (!this.visible || this.paused) {
            return;
          }
          (_this$onHit = this.onHit) == null || _this$onHit.call(this, this.config.score, this.config.type);
          this.hide(true);
        };
        _proto.hide = function hide(hit) {
          var _this2 = this;
          if (!this.visible) {
            return;
          }
          this.visible = false;
          tween(this.node).to(0.08, {
            scale: new Vec3(1.08, 1.08, 1)
          }).to(0.12, {
            scale: new Vec3(0.1, 0.1, 1)
          }).call(function () {
            _this2.onHidden == null || _this2.onHidden(hit);
          }).start();
        };
        return Mole;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "bodySprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MoleManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts', './ArtResourceManager.ts', './GameTypes.ts', './Mole.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createForOfIteratorHelperLoose, _extends, cclegacy, _decorator, Node, Prefab, Vec3, instantiate, UITransform, Graphics, Color, Component, AudioManager, ArtResourceManager, ArtAssetKey, GOLDEN_MOLE_CONFIG, NORMAL_MOLE_CONFIG, BOMB_MOLE_CONFIG, MoleType, Mole;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Prefab = module.Prefab;
      Vec3 = module.Vec3;
      instantiate = module.instantiate;
      UITransform = module.UITransform;
      Graphics = module.Graphics;
      Color = module.Color;
      Component = module.Component;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      ArtResourceManager = module.ArtResourceManager;
      ArtAssetKey = module.ArtAssetKey;
    }, function (module) {
      GOLDEN_MOLE_CONFIG = module.GOLDEN_MOLE_CONFIG;
      NORMAL_MOLE_CONFIG = module.NORMAL_MOLE_CONFIG;
      BOMB_MOLE_CONFIG = module.BOMB_MOLE_CONFIG;
      MoleType = module.MoleType;
    }, function (module) {
      Mole = module.Mole;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
      cclegacy._RF.push({}, "6a086oJMUVKnaGlehliLx20", "MoleManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      /**
       * 地鼠生成管理器。
       * 当前阶段同一时间只生成 1 只普通地鼠；后续扩展不同地鼠类型时只需要替换 pickMoleConfig。
       */
      var MoleManager = exports('MoleManager', (_dec = ccclass('MoleManager'), _dec2 = property({
        type: [Node]
      }), _dec3 = property(Prefab), _dec4 = property(AudioManager), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(MoleManager, _Component);
        function MoleManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "holes", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "molePrefab", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "audioManager", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "minSpawnDelay", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "maxSpawnDelay", _descriptor5, _assertThisInitialized(_this));
          _this.running = false;
          _this.paused = false;
          _this.activeMoleNode = null;
          _this.activeMole = null;
          _this.onScore = null;
          _this.difficultyLevel = 1;
          _this.molePools = new Map();
          _this.spawnOneMole = function () {
            var _this$audioManager;
            if (!_this.running || _this.paused || _this.activeMoleNode || _this.holes.length === 0) {
              return;
            }
            var hole = _this.holes[Math.floor(Math.random() * _this.holes.length)];
            var config = _this.pickMoleConfig();
            var moleNode = _this.getMoleNode(config.type);
            hole.addChild(moleNode);
            moleNode.active = true;
            moleNode.setPosition(Vec3.ZERO);
            moleNode.layer = hole.layer;
            for (var _iterator = _createForOfIteratorHelperLoose(moleNode.children), _step; !(_step = _iterator()).done;) {
              var child = _step.value;
              child.layer = hole.layer;
            }
            var mole = moleNode.getComponent(Mole);
            if (!mole) {
              moleNode.destroy();
              return;
            }
            _this.activeMoleNode = moleNode;
            _this.activeMole = mole;
            (_this$audioManager = _this.audioManager) == null || _this$audioManager.playMoleAppear();
            mole.show(config, function (score) {
              var _this$audioManager2;
              (_this$audioManager2 = _this.audioManager) == null || _this$audioManager2.playHitMole();
              _this.onScore == null || _this.onScore(score, true, hole);
            }, function (hit) {
              if (!hit) {
                _this.onScore == null || _this.onScore(0, false, hole);
              }
              _this.clearActiveMole();
              _this.scheduleNextSpawn();
            });
          };
          return _this;
        }
        var _proto = MoleManager.prototype;
        _proto.startSpawning = function startSpawning(onScore) {
          this.stopSpawning();
          this.running = true;
          this.paused = false;
          this.onScore = onScore;
          this.setDifficultyLevel(1);
          this.scheduleNextSpawn(0);
        };
        _proto.setDifficultyLevel = function setDifficultyLevel(level) {
          this.difficultyLevel = Math.max(1, Math.min(3, Math.floor(level)));
          if (this.difficultyLevel === 1) {
            this.minSpawnDelay = 0.28;
            this.maxSpawnDelay = 0.8;
            return;
          }
          if (this.difficultyLevel === 2) {
            this.minSpawnDelay = 0.2;
            this.maxSpawnDelay = 0.62;
            return;
          }
          this.minSpawnDelay = 0.12;
          this.maxSpawnDelay = 0.46;
        };
        _proto.pauseSpawning = function pauseSpawning() {
          var _this$activeMole;
          if (!this.running) {
            return;
          }
          this.paused = true;
          this.unschedule(this.spawnOneMole);
          (_this$activeMole = this.activeMole) == null || _this$activeMole.pauseMole();
        };
        _proto.resumeSpawning = function resumeSpawning() {
          if (!this.running) {
            return;
          }
          this.paused = false;
          if (this.activeMole) {
            this.activeMole.resumeMole();
            return;
          }
          this.scheduleNextSpawn();
        };
        _proto.stopSpawning = function stopSpawning() {
          this.running = false;
          this.paused = false;
          this.onScore = null;
          this.unschedule(this.spawnOneMole);
          this.clearActiveMole();
        };
        _proto.scheduleNextSpawn = function scheduleNextSpawn(delay) {
          if (!this.running || this.paused) {
            return;
          }
          var nextDelay = delay != null ? delay : this.randomRange(this.minSpawnDelay, this.maxSpawnDelay);
          this.scheduleOnce(this.spawnOneMole, nextDelay);
        };
        _proto.pickMoleConfig = function pickMoleConfig() {
          var roll = Math.random();
          if (this.difficultyLevel === 1) {
            if (roll < 0.1) {
              return this.withDifficulty(GOLDEN_MOLE_CONFIG);
            }
            return this.withDifficulty(NORMAL_MOLE_CONFIG);
          }
          if (this.difficultyLevel === 2) {
            if (roll < 0.16) {
              return this.withDifficulty(GOLDEN_MOLE_CONFIG);
            }
            if (roll < 0.28) {
              return this.withDifficulty(BOMB_MOLE_CONFIG);
            }
            return this.withDifficulty(NORMAL_MOLE_CONFIG);
          }
          if (roll < 0.18) {
            return this.withDifficulty(GOLDEN_MOLE_CONFIG);
          }
          if (roll < 0.38) {
            return this.withDifficulty(BOMB_MOLE_CONFIG);
          }
          return this.withDifficulty(NORMAL_MOLE_CONFIG);
        };
        _proto.withDifficulty = function withDifficulty(config) {
          var stayMultiplier = this.difficultyLevel === 1 ? 1 : this.difficultyLevel === 2 ? 0.82 : 0.66;
          return _extends({}, config, {
            staySeconds: Math.max(0.45, config.staySeconds * stayMultiplier)
          });
        };
        _proto.clearActiveMole = function clearActiveMole() {
          if (this.activeMoleNode && this.activeMoleNode.isValid) {
            this.recycleMoleNode(this.activeMoleNode);
          }
          this.activeMoleNode = null;
          this.activeMole = null;
        };
        _proto.randomRange = function randomRange(min, max) {
          return min + Math.random() * Math.max(0, max - min);
        };
        _proto.getMoleNode = function getMoleNode(type) {
          var pool = this.molePools.get(type);
          var pooledNode = pool == null ? void 0 : pool.pop();
          if (pooledNode != null && pooledNode.isValid) {
            return pooledNode;
          }
          return this.molePrefab ? instantiate(this.molePrefab) : this.createDefaultMoleNode(type);
        };
        _proto.recycleMoleNode = function recycleMoleNode(moleNode) {
          var _this$molePools$get;
          var moleType = this.getNodeMoleType(moleNode);
          moleNode.removeFromParent();
          moleNode.active = false;
          moleNode.setScale(Vec3.ONE);
          var pool = (_this$molePools$get = this.molePools.get(moleType)) != null ? _this$molePools$get : [];
          pool.push(moleNode);
          this.molePools.set(moleType, pool);
        };
        _proto.getNodeMoleType = function getNodeMoleType(moleNode) {
          if (moleNode.name.includes(MoleType.Golden)) {
            return MoleType.Golden;
          }
          if (moleNode.name.includes(MoleType.Bomb)) {
            return MoleType.Bomb;
          }
          return MoleType.Normal;
        };
        _proto.createDefaultMoleNode = function createDefaultMoleNode(type) {
          var moleNode = new Node('Mole');
          moleNode.name = "Mole_" + type;
          moleNode.addComponent(UITransform).setContentSize(142, 142);
          var graphics = moleNode.addComponent(Graphics);
          var mainColor = this.getMoleMainColor(type);
          var bellyColor = this.getMoleBellyColor(type);
          var eyeColor = type === MoleType.Bomb ? new Color(255, 245, 212, 255) : new Color(255, 255, 255, 255);
          graphics.fillColor = mainColor;
          graphics.circle(0, -4, 58);
          graphics.fill();
          if (type === MoleType.Golden) {
            graphics.fillColor = new Color(255, 246, 137, 255);
            graphics.circle(-24, 33, 14);
            graphics.circle(0, 43, 14);
            graphics.circle(24, 33, 14);
            graphics.fill();
          }
          if (type === MoleType.Bomb) {
            graphics.fillColor = new Color(255, 88, 64, 255);
            graphics.circle(0, 47, 14);
            graphics.fill();
            graphics.strokeColor = new Color(255, 213, 87, 255);
            graphics.lineWidth = 5;
            graphics.moveTo(0, 60);
            graphics.lineTo(16, 77);
            graphics.stroke();
          }
          graphics.fillColor = bellyColor;
          graphics.circle(0, -18, 40);
          graphics.fill();
          graphics.fillColor = eyeColor;
          graphics.circle(-22, 20, 14);
          graphics.circle(22, 20, 14);
          graphics.fill();
          graphics.fillColor = type === MoleType.Bomb ? new Color(206, 37, 31, 255) : new Color(35, 22, 18, 255);
          if (type === MoleType.Bomb) {
            graphics.moveTo(-32, 27);
            graphics.lineTo(-12, 16);
            graphics.lineTo(-30, 11);
            graphics.close();
            graphics.moveTo(32, 27);
            graphics.lineTo(12, 16);
            graphics.lineTo(30, 11);
            graphics.close();
            graphics.fill();
          } else {
            graphics.circle(-22, 20, 7);
            graphics.circle(22, 20, 7);
            graphics.fill();
          }
          graphics.fillColor = new Color(35, 22, 18, 255);
          graphics.circle(0, -1, 6);
          graphics.fill();
          graphics.strokeColor = new Color(83, 45, 27, 255);
          graphics.lineWidth = 4;
          if (type === MoleType.Bomb) {
            graphics.moveTo(-17, -31);
            graphics.lineTo(17, -31);
          } else {
            graphics.moveTo(-16, -24);
            graphics.quadraticCurveTo(0, -34, 16, -24);
          }
          graphics.stroke();
          graphics.fillColor = type === MoleType.Bomb ? new Color(255, 245, 212, 140) : new Color(255, 255, 255, 120);
          graphics.circle(-27, 26, 4);
          graphics.circle(17, 26, 4);
          graphics.fill();
          moleNode.addComponent(Mole);
          ArtResourceManager.applySprite(moleNode, this.getMoleArtKey(type), 172, 172);
          return moleNode;
        };
        _proto.getMoleArtKey = function getMoleArtKey(type) {
          if (type === MoleType.Golden) {
            return ArtAssetKey.GoldenMole;
          }
          if (type === MoleType.Bomb) {
            return ArtAssetKey.BombMole;
          }
          return ArtAssetKey.NormalMole;
        };
        _proto.getMoleMainColor = function getMoleMainColor(type) {
          if (type === MoleType.Golden) {
            return new Color(245, 177, 45, 255);
          }
          if (type === MoleType.Bomb) {
            return new Color(58, 57, 63, 255);
          }
          return new Color(139, 83, 45, 255);
        };
        _proto.getMoleBellyColor = function getMoleBellyColor(type) {
          if (type === MoleType.Golden) {
            return new Color(255, 216, 88, 255);
          }
          if (type === MoleType.Bomb) {
            return new Color(91, 88, 96, 255);
          }
          return new Color(190, 123, 72, 255);
        };
        return MoleManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "holes", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "molePrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "audioManager", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PlatformAdapter.ts", ['cc'], function (exports) {
  var cclegacy, sys;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }],
    execute: function () {
      cclegacy._RF.push({}, "67ffetmEbVMPr92JG8PUtOn", "PlatformAdapter", undefined);
      var PlatformType = exports('PlatformType', /*#__PURE__*/function (PlatformType) {
        PlatformType["Wechat"] = "wechat";
        PlatformType["Douyin"] = "douyin";
        PlatformType["Editor"] = "editor";
        PlatformType["Unknown"] = "unknown";
        return PlatformType;
      }({}));
      /**
       * 小游戏平台适配层。
       * 玩法代码只调用这里，微信/抖音 API 差异集中封装，编辑器预览时安全降级。
       */
      var PlatformAdapter = exports('PlatformAdapter', /*#__PURE__*/function () {
        function PlatformAdapter() {}
        PlatformAdapter.getPlatformType = function getPlatformType() {
          var api = this.getWechatApi();
          if (api) {
            return PlatformType.Wechat;
          }
          var douyinApi = this.getDouyinApi();
          if (douyinApi) {
            return PlatformType.Douyin;
          }
          if (sys.isBrowser || sys.isNative) {
            return PlatformType.Editor;
          }
          return PlatformType.Unknown;
        };
        PlatformAdapter.setupShareMenu = function setupShareMenu() {
          var api = this.getActiveApi();
          api == null || api.showShareMenu == null || api.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
          });
        }

        /**
         * 获取平台临时登录凭证。正式服必须由业务服务端交换 openId/session，
         * 客户端不保存 code，也不把 AppSecret 放进包内。
         */;
        PlatformAdapter.login = function login() {
          var _this = this;
          if (this.loginPromise) {
            return this.loginPromise;
          }
          var platform = this.getPlatformType();
          var api = this.getActiveApi();
          if (!(api != null && api.login)) {
            return Promise.resolve({
              platform: platform,
              success: platform === PlatformType.Editor,
              code: '',
              errorMessage: platform === PlatformType.Editor ? '' : '当前环境不支持平台登录'
            });
          }
          this.loginPromise = new Promise(function (resolve) {
            api.login == null || api.login({
              force: false,
              success: function success(result) {
                var _ref, _result$code;
                var code = (_ref = (_result$code = result.code) != null ? _result$code : result.anonymousCode) != null ? _ref : '';
                resolve({
                  platform: platform,
                  success: code.length > 0,
                  code: code,
                  errorMessage: code ? '' : '平台未返回登录凭证'
                });
              },
              fail: function fail(error) {
                var _error$errMsg;
                _this.loginPromise = null;
                resolve({
                  platform: platform,
                  success: false,
                  code: '',
                  errorMessage: (_error$errMsg = error.errMsg) != null ? _error$errMsg : '平台登录失败'
                });
              }
            });
          });
          return this.loginPromise;
        };
        PlatformAdapter.vibrateShort = function vibrateShort(type) {
          if (type === void 0) {
            type = 'light';
          }
          var api = this.getActiveApi();
          api == null || api.vibrateShort == null || api.vibrateShort({
            type: type
          });
        };
        PlatformAdapter.shareScore = function shareScore(score) {
          var api = this.getActiveApi();
          if (!(api != null && api.shareAppMessage)) {
            return false;
          }
          api.shareAppMessage({
            title: "\u6211\u5728\u5730\u9F20\u7A81\u51FB\u961F\u62FF\u5230\u4E86 " + score + " \u5206\uFF0C\u6765\u6311\u6218\u6211\uFF01",
            query: "score=" + score
          });
          return true;
        };
        PlatformAdapter.showLeaderboard = function showLeaderboard() {
          var _this$getActiveApi;
          var openDataContext = (_this$getActiveApi = this.getActiveApi()) == null || _this$getActiveApi.getOpenDataContext == null ? void 0 : _this$getActiveApi.getOpenDataContext();
          if (!(openDataContext != null && openDataContext.postMessage)) {
            return false;
          }
          openDataContext.postMessage({
            type: 'showLeaderboard'
          });
          return true;
        };
        PlatformAdapter.hideLeaderboard = function hideLeaderboard() {
          var _this$getActiveApi2;
          (_this$getActiveApi2 = this.getActiveApi()) == null || _this$getActiveApi2.getOpenDataContext == null || (_this$getActiveApi2 = _this$getActiveApi2.getOpenDataContext()) == null || _this$getActiveApi2.postMessage == null || _this$getActiveApi2.postMessage({
            type: 'hideLeaderboard'
          });
        };
        PlatformAdapter.submitScore = function submitScore(score) {
          var api = this.getActiveApi();
          var normalizedScore = Math.max(0, Math.floor(score));
          var openDataContext = api == null || api.getOpenDataContext == null ? void 0 : api.getOpenDataContext();
          openDataContext == null || openDataContext.postMessage == null || openDataContext.postMessage({
            type: 'submitScore',
            score: normalizedScore
          });
          if (!(api != null && api.setUserCloudStorage)) {
            return false;
          }
          api.setUserCloudStorage({
            KVDataList: [{
              key: 'best_score',
              value: "" + normalizedScore
            }]
          });
          return true;
        };
        PlatformAdapter.reportAnalytics = function reportAnalytics(eventName, data) {
          var api = this.getActiveApi();
          try {
            if (this.getPlatformType() === PlatformType.Wechat && api != null && api.reportEvent) {
              api.reportEvent(eventName, data);
              return true;
            }
            if (this.getPlatformType() === PlatformType.Douyin && api != null && api.reportAnalytics) {
              api.reportAnalytics(eventName, data);
              return true;
            }
          } catch (_unused) {
            return false;
          }
          return false;
        };
        PlatformAdapter.registerErrorHandlers = function registerErrorHandlers(handler) {
          var api = this.getActiveApi();
          api == null || api.onError == null || api.onError(function (error) {
            var _error$errMsg2;
            var message = typeof error === 'string' ? error : (_error$errMsg2 = error.errMsg) != null ? _error$errMsg2 : 'unknown runtime error';
            handler('runtime', message);
          });
          api == null || api.onUnhandledRejection == null || api.onUnhandledRejection(function (result) {
            var reason = result.reason;
            var message = reason instanceof Error ? reason.message : String(reason != null ? reason : 'unknown rejection');
            handler('promise', message);
          });
        };
        PlatformAdapter.getActiveApi = function getActiveApi() {
          var _this$getWechatApi;
          return (_this$getWechatApi = this.getWechatApi()) != null ? _this$getWechatApi : this.getDouyinApi();
        };
        PlatformAdapter.getWechatApi = function getWechatApi() {
          return typeof wx !== 'undefined' ? wx : null;
        };
        PlatformAdapter.getDouyinApi = function getDouyinApi() {
          return typeof tt !== 'undefined' ? tt : null;
        };
        return PlatformAdapter;
      }());
      PlatformAdapter.loginPromise = null;
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SafeAreaLayout.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _createForOfIteratorHelperLoose, cclegacy, _decorator, view, sys, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      view = module.view;
      sys = module.sys;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "d24693vOz9A/aG9LolgnOkt", "SafeAreaLayout", undefined);
      var ccclass = _decorator.ccclass;
      /**
       * 将关键交互节点推入设备安全区域。
       * 微信 Android 首帧可能稍后才返回准确值，因此运行期间低频复查安全区。
       */
      var SafeAreaLayout = exports('SafeAreaLayout', (_dec = ccclass('SafeAreaLayout'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(SafeAreaLayout, _Component);
        function SafeAreaLayout() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.topEntries = [];
          _this.bottomEntries = [];
          _this.elapsed = 0;
          _this.lastTopInset = -1;
          _this.lastBottomInset = -1;
          return _this;
        }
        var _proto = SafeAreaLayout.prototype;
        _proto.configure = function configure(topNodes, bottomNodes) {
          this.topEntries = this.createEntries(topNodes);
          this.bottomEntries = this.createEntries(bottomNodes);
          this.refresh(true);
        };
        _proto.update = function update(deltaTime) {
          this.elapsed += deltaTime;
          if (this.elapsed < 0.5) {
            return;
          }
          this.elapsed = 0;
          this.refresh(false);
        };
        _proto.refresh = function refresh(force) {
          var visibleSize = view.getVisibleSize();
          var safeArea = sys.getSafeAreaRect(false);
          var topInset = Math.max(0, visibleSize.height - safeArea.y - safeArea.height);
          var bottomInset = Math.max(0, safeArea.y);
          if (!force && Math.abs(topInset - this.lastTopInset) < 0.5 && Math.abs(bottomInset - this.lastBottomInset) < 0.5) {
            return;
          }
          this.lastTopInset = topInset;
          this.lastBottomInset = bottomInset;
          for (var _iterator = _createForOfIteratorHelperLoose(this.topEntries), _step; !(_step = _iterator()).done;) {
            var entry = _step.value;
            if (entry.node.isValid) {
              entry.node.setPosition(entry.basePosition.x, entry.basePosition.y - topInset, entry.basePosition.z);
            }
          }
          for (var _iterator2 = _createForOfIteratorHelperLoose(this.bottomEntries), _step2; !(_step2 = _iterator2()).done;) {
            var _entry = _step2.value;
            if (_entry.node.isValid) {
              _entry.node.setPosition(_entry.basePosition.x, _entry.basePosition.y + bottomInset, _entry.basePosition.z);
            }
          }
        };
        _proto.createEntries = function createEntries(nodes) {
          return nodes.map(function (node) {
            return {
              node: node,
              basePosition: node.position.clone()
            };
          });
        };
        return SafeAreaLayout;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ScoreManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Label, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "e3548iCSldOdrU9+M+5+dd+", "ScoreManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * 分数管理器。
       * 只负责分数数据和分数显示，不处理游戏流程。
       */
      var ScoreManager = exports('ScoreManager', (_dec = ccclass('ScoreManager'), _dec2 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(ScoreManager, _Component);
        function ScoreManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "scoreLabel", _descriptor, _assertThisInitialized(_this));
          _this.score = 0;
          return _this;
        }
        var _proto = ScoreManager.prototype;
        _proto.reset = function reset() {
          this.score = 0;
          this.refreshView();
        };
        _proto.addScore = function addScore(value) {
          this.score = Math.max(0, this.score + value);
          this.refreshView();
          return this.score;
        };
        _proto.getScore = function getScore() {
          return this.score;
        };
        _proto.refreshView = function refreshView() {
          if (this.scoreLabel) {
            this.scoreLabel.string = "Score: " + this.score;
          }
        };
        return ScoreManager;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "scoreLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/StorageManager.ts", ['cc'], function (exports) {
  var cclegacy, sys;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }],
    execute: function () {
      cclegacy._RF.push({}, "0db8cd7yptJsaL4sbpIfktI", "StorageManager", undefined);
      var BEST_SCORE_KEY = 'mole_strike_best_score';
      var SOUND_ENABLED_KEY = 'mole_strike_sound_enabled';
      var TUTORIAL_COMPLETED_KEY = 'mole_strike_tutorial_completed';
      var DAILY_CHALLENGE_KEY = 'mole_strike_daily_challenge';
      var MEDAL_COUNT_KEY = 'mole_strike_medal_count';
      var PLAY_COUNT_KEY = 'mole_strike_play_count';

      /**
       * 本地存档管理。
       * 通过 Cocos sys.localStorage 访问平台存储，微信/抖音小游戏会由引擎适配。
       */
      var StorageManager = exports('StorageManager', /*#__PURE__*/function () {
        function StorageManager() {}
        StorageManager.getBestScore = function getBestScore() {
          var rawValue = sys.localStorage.getItem(BEST_SCORE_KEY);
          var score = Number(rawValue);
          return Number.isFinite(score) ? score : 0;
        };
        StorageManager.saveBestScore = function saveBestScore(score) {
          var bestScore = Math.max(this.getBestScore(), score);
          sys.localStorage.setItem(BEST_SCORE_KEY, "" + bestScore);
        };
        StorageManager.isSoundEnabled = function isSoundEnabled() {
          var rawValue = sys.localStorage.getItem(SOUND_ENABLED_KEY);
          return rawValue !== 'false';
        };
        StorageManager.saveSoundEnabled = function saveSoundEnabled(enabled) {
          sys.localStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
        };
        StorageManager.hasCompletedTutorial = function hasCompletedTutorial() {
          return sys.localStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
        };
        StorageManager.saveTutorialCompleted = function saveTutorialCompleted() {
          sys.localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
        };
        StorageManager.getDailyChallengeState = function getDailyChallengeState() {
          var rawValue = sys.localStorage.getItem(DAILY_CHALLENGE_KEY);
          if (!rawValue) {
            return null;
          }
          try {
            var _value$progress;
            var value = JSON.parse(rawValue);
            if (typeof value.dateKey !== 'string' || !Number.isFinite(value.progress)) {
              return null;
            }
            return {
              dateKey: value.dateKey,
              progress: Math.max(0, Math.floor((_value$progress = value.progress) != null ? _value$progress : 0)),
              completed: value.completed === true,
              rewardGranted: value.rewardGranted === true
            };
          } catch (_unused) {
            return null;
          }
        };
        StorageManager.saveDailyChallengeState = function saveDailyChallengeState(state) {
          sys.localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(state));
        };
        StorageManager.getMedalCount = function getMedalCount() {
          var count = Number(sys.localStorage.getItem(MEDAL_COUNT_KEY));
          return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
        };
        StorageManager.addMedals = function addMedals(count) {
          var nextCount = this.getMedalCount() + Math.max(0, Math.floor(count));
          sys.localStorage.setItem(MEDAL_COUNT_KEY, "" + nextCount);
          return nextCount;
        };
        StorageManager.getPlayCount = function getPlayCount() {
          var count = Number(sys.localStorage.getItem(PLAY_COUNT_KEY));
          return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
        };
        StorageManager.incrementPlayCount = function incrementPlayCount() {
          var playCount = this.getPlayCount() + 1;
          sys.localStorage.setItem(PLAY_COUNT_KEY, "" + playCount);
          return playCount;
        };
        return StorageManager;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TimerManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Label, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;
      cclegacy._RF.push({}, "54bc6HFoApCVKnX4rf0CiyI", "TimerManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      /**
       * 倒计时管理器。
       * 使用 update 驱动，避免依赖平台计时器，小游戏端表现更稳定。
       */
      var TimerManager = exports('TimerManager', (_dec = ccclass('TimerManager'), _dec2 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(TimerManager, _Component);
        function TimerManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "timeLabel", _descriptor, _assertThisInitialized(_this));
          _this.totalSeconds = 60;
          _this.secondsLeft = 60;
          _this.running = false;
          _this.paused = false;
          _this.onComplete = null;
          _this.onTick = null;
          _this.lastDisplaySeconds = -1;
          return _this;
        }
        var _proto = TimerManager.prototype;
        _proto.startTimer = function startTimer(seconds, onComplete, onTick) {
          this.totalSeconds = Math.max(1, seconds);
          this.secondsLeft = this.totalSeconds;
          this.running = true;
          this.paused = false;
          this.onComplete = onComplete;
          this.onTick = onTick != null ? onTick : null;
          this.lastDisplaySeconds = -1;
          this.refreshView(true);
        };
        _proto.pauseTimer = function pauseTimer() {
          if (this.running) {
            this.paused = true;
          }
        };
        _proto.resumeTimer = function resumeTimer() {
          if (this.running) {
            this.paused = false;
          }
        };
        _proto.stopTimer = function stopTimer() {
          this.running = false;
          this.paused = false;
          this.onComplete = null;
          this.onTick = null;
        };
        _proto.resetTimer = function resetTimer(seconds) {
          this.totalSeconds = Math.max(1, seconds);
          this.secondsLeft = this.totalSeconds;
          this.running = false;
          this.paused = false;
          this.lastDisplaySeconds = -1;
          this.refreshView(true);
        };
        _proto.getSecondsLeft = function getSecondsLeft() {
          return Math.max(0, Math.ceil(this.secondsLeft));
        };
        _proto.update = function update(deltaTime) {
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
        };
        _proto.refreshView = function refreshView(force) {
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
        };
        return TimerManager;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "timeLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TutorialManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './AudioManager.ts', './AnalyticsManager.ts', './StorageManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Label, UIOpacity, Vec3, tween, Component, AudioManager, AnalyticsManager, StorageManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Label = module.Label;
      UIOpacity = module.UIOpacity;
      Vec3 = module.Vec3;
      tween = module.tween;
      Component = module.Component;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      AnalyticsManager = module.AnalyticsManager;
    }, function (module) {
      StorageManager = module.StorageManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;
      cclegacy._RF.push({}, "33c3ce6MmlEx5uB8K5njqTU", "TutorialManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var TUTORIAL_PAGES = [{
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
      var TutorialManager = exports('TutorialManager', (_dec = ccclass('TutorialManager'), _dec2 = property(Node), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(AudioManager), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(TutorialManager, _Component);
        function TutorialManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "panel", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "titleLabel", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "descriptionLabel", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "symbolLabel", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "progressLabel", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "actionLabel", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "audioManager", _descriptor7, _assertThisInitialized(_this));
          _this.pageIndex = 0;
          _this.onCompleted = null;
          return _this;
        }
        var _proto = TutorialManager.prototype;
        _proto.shouldShow = function shouldShow() {
          return !StorageManager.hasCompletedTutorial();
        };
        _proto.show = function show(onCompleted) {
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
        };
        _proto.handleNext = function handleNext() {
          var _this$audioManager;
          (_this$audioManager = this.audioManager) == null || _this$audioManager.playButtonClick();
          if (this.pageIndex >= TUTORIAL_PAGES.length - 1) {
            AnalyticsManager.track('tutorial_complete');
            this.complete();
            return;
          }
          this.pageIndex += 1;
          this.renderPage();
        };
        _proto.handleSkip = function handleSkip() {
          var _this$audioManager2;
          (_this$audioManager2 = this.audioManager) == null || _this$audioManager2.playButtonClick();
          AnalyticsManager.track('tutorial_skip', {
            page: this.pageIndex + 1
          });
          this.complete();
        };
        _proto.renderPage = function renderPage() {
          var _this2 = this;
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
            this.progressLabel.string = TUTORIAL_PAGES.map(function (_, index) {
              return index === _this2.pageIndex ? '●' : '○';
            }).join('  ');
          }
          if (this.actionLabel) {
            this.actionLabel.string = this.pageIndex === TUTORIAL_PAGES.length - 1 ? '开始挑战' : '下一步';
          }
        };
        _proto.complete = function complete() {
          StorageManager.saveTutorialCompleted();
          if (this.panel) {
            this.panel.active = false;
          }
          var callback = this.onCompleted;
          this.onCompleted = null;
          callback == null || callback();
        };
        return TutorialManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "panel", [_dec2], {
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
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UIManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './DailyChallengeManager.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Label, UIOpacity, Tween, tween, Vec3, Component, DailyChallengeManager;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Label = module.Label;
      UIOpacity = module.UIOpacity;
      Tween = module.Tween;
      tween = module.tween;
      Vec3 = module.Vec3;
      Component = module.Component;
    }, function (module) {
      DailyChallengeManager = module.DailyChallengeManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11;
      cclegacy._RF.push({}, "d74f2W+8txPA5VFBGml4Ht6", "UIManager", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;

      /**
       * UI 管理器。
       * 负责页面显隐和结算文案，不直接修改游戏数据。
       */
      var UIManager = exports('UIManager', (_dec = ccclass('UIManager'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Label), _dec10 = property(Label), _dec11 = property(Label), _dec12 = property(Label), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(UIManager, _Component);
        function UIManager() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "homePanel", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "gamePanel", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "resultPanel", _descriptor3, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "pauseMask", _descriptor4, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "leaderboardPanel", _descriptor5, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "finalScoreLabel", _descriptor6, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "bestScoreLabel", _descriptor7, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "ratingLabel", _descriptor8, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "newRecordLabel", _descriptor9, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "dailyChallengeLabel", _descriptor10, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "resultChallengeLabel", _descriptor11, _assertThisInitialized(_this));
          return _this;
        }
        var _proto = UIManager.prototype;
        _proto.showHome = function showHome() {
          this.setActive(this.homePanel, true);
          this.setActive(this.gamePanel, false);
          this.setActive(this.resultPanel, false);
          this.setActive(this.pauseMask, false);
          this.setActive(this.leaderboardPanel, false);
          this.resetPanelTransform(this.homePanel);
        };
        _proto.showGame = function showGame() {
          this.setActive(this.homePanel, false);
          this.setActive(this.gamePanel, true);
          this.setActive(this.resultPanel, false);
          this.setActive(this.pauseMask, false);
          this.setActive(this.leaderboardPanel, false);
          this.resetPanelTransform(this.gamePanel);
        };
        _proto.showResult = function showResult(finalScore, bestScore, isNewRecord, rating) {
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
        };
        _proto.showPauseMask = function showPauseMask(show) {
          var _this$pauseMask$getCo,
            _this2 = this;
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
          }).call(function () {
            if (_this2.pauseMask) {
              _this2.pauseMask.active = false;
            }
          }).start();
        };
        _proto.showDailyChallenge = function showDailyChallenge(snapshot, justCompleted) {
          if (justCompleted === void 0) {
            justCompleted = false;
          }
          var text = DailyChallengeManager.getDisplayText(snapshot);
          if (this.dailyChallengeLabel) {
            this.dailyChallengeLabel.string = text + "\n\u52CB\u7AE0\uFF1A" + snapshot.medalCount;
          }
          if (this.resultChallengeLabel) {
            this.resultChallengeLabel.string = justCompleted ? "\u6311\u6218\u5B8C\u6210\uFF01\u83B7\u5F97 1 \u679A\u52CB\u7AE0  \u5F53\u524D\uFF1A" + snapshot.medalCount : text;
          }
        };
        _proto.playResultEntrance = function playResultEntrance(isNewRecord) {
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
        };
        _proto.resetPanelTransform = function resetPanelTransform(panel) {
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
        };
        _proto.setActive = function setActive(node, active) {
          if (node) {
            node.active = active;
          }
        };
        return UIManager;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "homePanel", [_dec2], {
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
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});