System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Graphics, instantiate, Node, Prefab, UITransform, Vec3, AudioManager, ArtAssetKey, ArtResourceManager, BOMB_MOLE_CONFIG, GOLDEN_MOLE_CONFIG, MoleType, NORMAL_MOLE_CONFIG, Mole, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, MoleManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../core/AudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArtAssetKey(extras) {
    _reporterNs.report("ArtAssetKey", "../core/ArtResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArtResourceManager(extras) {
    _reporterNs.report("ArtResourceManager", "../core/ArtResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBOMB_MOLE_CONFIG(extras) {
    _reporterNs.report("BOMB_MOLE_CONFIG", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGOLDEN_MOLE_CONFIG(extras) {
    _reporterNs.report("GOLDEN_MOLE_CONFIG", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoleConfig(extras) {
    _reporterNs.report("MoleConfig", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoleType(extras) {
    _reporterNs.report("MoleType", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNORMAL_MOLE_CONFIG(extras) {
    _reporterNs.report("NORMAL_MOLE_CONFIG", "../core/GameTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMole(extras) {
    _reporterNs.report("Mole", "./Mole", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      Graphics = _cc.Graphics;
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      AudioManager = _unresolved_2.AudioManager;
    }, function (_unresolved_3) {
      ArtAssetKey = _unresolved_3.ArtAssetKey;
      ArtResourceManager = _unresolved_3.ArtResourceManager;
    }, function (_unresolved_4) {
      BOMB_MOLE_CONFIG = _unresolved_4.BOMB_MOLE_CONFIG;
      GOLDEN_MOLE_CONFIG = _unresolved_4.GOLDEN_MOLE_CONFIG;
      MoleType = _unresolved_4.MoleType;
      NORMAL_MOLE_CONFIG = _unresolved_4.NORMAL_MOLE_CONFIG;
    }, function (_unresolved_5) {
      Mole = _unresolved_5.Mole;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6a086oJMUVKnaGlehliLx20", "MoleManager", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Graphics', 'instantiate', 'Node', 'Prefab', 'UITransform', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      /**
       * 地鼠生成管理器。
       * 当前阶段同一时间只生成 1 只普通地鼠；后续扩展不同地鼠类型时只需要替换 pickMoleConfig。
       */
      _export("MoleManager", MoleManager = (_dec = ccclass('MoleManager'), _dec2 = property({
        type: [Node]
      }), _dec3 = property(Prefab), _dec4 = property(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
        error: Error()
      }), AudioManager) : AudioManager), _dec(_class = (_class2 = class MoleManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "holes", _descriptor, this);

          _initializerDefineProperty(this, "molePrefab", _descriptor2, this);

          _initializerDefineProperty(this, "audioManager", _descriptor3, this);

          _initializerDefineProperty(this, "minSpawnDelay", _descriptor4, this);

          _initializerDefineProperty(this, "maxSpawnDelay", _descriptor5, this);

          this.running = false;
          this.paused = false;
          this.activeMoleNode = null;
          this.activeMole = null;
          this.onScore = null;
          this.difficultyLevel = 1;
          this.molePools = new Map();

          this.spawnOneMole = () => {
            var _this$audioManager;

            if (!this.running || this.paused || this.activeMoleNode || this.holes.length === 0) {
              return;
            }

            const hole = this.holes[Math.floor(Math.random() * this.holes.length)];
            const config = this.pickMoleConfig();
            const moleNode = this.getMoleNode(config.type);
            hole.addChild(moleNode);
            moleNode.active = true;
            moleNode.setPosition(Vec3.ZERO);
            moleNode.layer = hole.layer;

            for (const child of moleNode.children) {
              child.layer = hole.layer;
            }

            const mole = moleNode.getComponent(_crd && Mole === void 0 ? (_reportPossibleCrUseOfMole({
              error: Error()
            }), Mole) : Mole);

            if (!mole) {
              moleNode.destroy();
              return;
            }

            this.activeMoleNode = moleNode;
            this.activeMole = mole;
            (_this$audioManager = this.audioManager) == null || _this$audioManager.playMoleAppear();
            mole.show(config, score => {
              var _this$audioManager2, _this$onScore;

              (_this$audioManager2 = this.audioManager) == null || _this$audioManager2.playHitMole();
              (_this$onScore = this.onScore) == null || _this$onScore.call(this, score, true, hole);
            }, hit => {
              if (!hit) {
                var _this$onScore2;

                (_this$onScore2 = this.onScore) == null || _this$onScore2.call(this, 0, false, hole);
              }

              this.clearActiveMole();
              this.scheduleNextSpawn();
            });
          };
        }

        startSpawning(onScore) {
          this.stopSpawning();
          this.running = true;
          this.paused = false;
          this.onScore = onScore;
          this.setDifficultyLevel(1);
          this.scheduleNextSpawn(0);
        }

        setDifficultyLevel(level) {
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
        }

        pauseSpawning() {
          var _this$activeMole;

          if (!this.running) {
            return;
          }

          this.paused = true;
          this.unschedule(this.spawnOneMole);
          (_this$activeMole = this.activeMole) == null || _this$activeMole.pauseMole();
        }

        resumeSpawning() {
          if (!this.running) {
            return;
          }

          this.paused = false;

          if (this.activeMole) {
            this.activeMole.resumeMole();
            return;
          }

          this.scheduleNextSpawn();
        }

        stopSpawning() {
          this.running = false;
          this.paused = false;
          this.onScore = null;
          this.unschedule(this.spawnOneMole);
          this.clearActiveMole();
        }

        scheduleNextSpawn(delay) {
          if (!this.running || this.paused) {
            return;
          }

          const nextDelay = delay != null ? delay : this.randomRange(this.minSpawnDelay, this.maxSpawnDelay);
          this.scheduleOnce(this.spawnOneMole, nextDelay);
        }

        pickMoleConfig() {
          const roll = Math.random();

          if (this.difficultyLevel === 1) {
            if (roll < 0.1) {
              return this.withDifficulty(_crd && GOLDEN_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfGOLDEN_MOLE_CONFIG({
                error: Error()
              }), GOLDEN_MOLE_CONFIG) : GOLDEN_MOLE_CONFIG);
            }

            return this.withDifficulty(_crd && NORMAL_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfNORMAL_MOLE_CONFIG({
              error: Error()
            }), NORMAL_MOLE_CONFIG) : NORMAL_MOLE_CONFIG);
          }

          if (this.difficultyLevel === 2) {
            if (roll < 0.16) {
              return this.withDifficulty(_crd && GOLDEN_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfGOLDEN_MOLE_CONFIG({
                error: Error()
              }), GOLDEN_MOLE_CONFIG) : GOLDEN_MOLE_CONFIG);
            }

            if (roll < 0.28) {
              return this.withDifficulty(_crd && BOMB_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfBOMB_MOLE_CONFIG({
                error: Error()
              }), BOMB_MOLE_CONFIG) : BOMB_MOLE_CONFIG);
            }

            return this.withDifficulty(_crd && NORMAL_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfNORMAL_MOLE_CONFIG({
              error: Error()
            }), NORMAL_MOLE_CONFIG) : NORMAL_MOLE_CONFIG);
          }

          if (roll < 0.18) {
            return this.withDifficulty(_crd && GOLDEN_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfGOLDEN_MOLE_CONFIG({
              error: Error()
            }), GOLDEN_MOLE_CONFIG) : GOLDEN_MOLE_CONFIG);
          }

          if (roll < 0.38) {
            return this.withDifficulty(_crd && BOMB_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfBOMB_MOLE_CONFIG({
              error: Error()
            }), BOMB_MOLE_CONFIG) : BOMB_MOLE_CONFIG);
          }

          return this.withDifficulty(_crd && NORMAL_MOLE_CONFIG === void 0 ? (_reportPossibleCrUseOfNORMAL_MOLE_CONFIG({
            error: Error()
          }), NORMAL_MOLE_CONFIG) : NORMAL_MOLE_CONFIG);
        }

        withDifficulty(config) {
          const stayMultiplier = this.difficultyLevel === 1 ? 1 : this.difficultyLevel === 2 ? 0.82 : 0.66;
          return { ...config,
            staySeconds: Math.max(0.45, config.staySeconds * stayMultiplier)
          };
        }

        clearActiveMole() {
          if (this.activeMoleNode && this.activeMoleNode.isValid) {
            this.recycleMoleNode(this.activeMoleNode);
          }

          this.activeMoleNode = null;
          this.activeMole = null;
        }

        randomRange(min, max) {
          return min + Math.random() * Math.max(0, max - min);
        }

        getMoleNode(type) {
          const pool = this.molePools.get(type);
          const pooledNode = pool == null ? void 0 : pool.pop();

          if (pooledNode != null && pooledNode.isValid) {
            return pooledNode;
          }

          return this.molePrefab ? instantiate(this.molePrefab) : this.createDefaultMoleNode(type);
        }

        recycleMoleNode(moleNode) {
          var _this$molePools$get;

          const moleType = this.getNodeMoleType(moleNode);
          moleNode.removeFromParent();
          moleNode.active = false;
          moleNode.setScale(Vec3.ONE);
          const pool = (_this$molePools$get = this.molePools.get(moleType)) != null ? _this$molePools$get : [];
          pool.push(moleNode);
          this.molePools.set(moleType, pool);
        }

        getNodeMoleType(moleNode) {
          if (moleNode.name.includes((_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Golden)) {
            return (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
              error: Error()
            }), MoleType) : MoleType).Golden;
          }

          if (moleNode.name.includes((_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb)) {
            return (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
              error: Error()
            }), MoleType) : MoleType).Bomb;
          }

          return (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Normal;
        }

        createDefaultMoleNode(type) {
          const moleNode = new Node('Mole');
          moleNode.name = `Mole_${type}`;
          moleNode.addComponent(UITransform).setContentSize(142, 142);
          const graphics = moleNode.addComponent(Graphics);
          const mainColor = this.getMoleMainColor(type);
          const bellyColor = this.getMoleBellyColor(type);
          const eyeColor = type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb ? new Color(255, 245, 212, 255) : new Color(255, 255, 255, 255);
          graphics.fillColor = mainColor;
          graphics.circle(0, -4, 58);
          graphics.fill();

          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Golden) {
            graphics.fillColor = new Color(255, 246, 137, 255);
            graphics.circle(-24, 33, 14);
            graphics.circle(0, 43, 14);
            graphics.circle(24, 33, 14);
            graphics.fill();
          }

          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb) {
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
          graphics.fillColor = type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb ? new Color(206, 37, 31, 255) : new Color(35, 22, 18, 255);

          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb) {
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

          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb) {
            graphics.moveTo(-17, -31);
            graphics.lineTo(17, -31);
          } else {
            graphics.moveTo(-16, -24);
            graphics.quadraticCurveTo(0, -34, 16, -24);
          }

          graphics.stroke();
          graphics.fillColor = type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb ? new Color(255, 245, 212, 140) : new Color(255, 255, 255, 120);
          graphics.circle(-27, 26, 4);
          graphics.circle(17, 26, 4);
          graphics.fill();
          moleNode.addComponent(_crd && Mole === void 0 ? (_reportPossibleCrUseOfMole({
            error: Error()
          }), Mole) : Mole);
          (_crd && ArtResourceManager === void 0 ? (_reportPossibleCrUseOfArtResourceManager({
            error: Error()
          }), ArtResourceManager) : ArtResourceManager).applySprite(moleNode, this.getMoleArtKey(type), 172, 172);
          return moleNode;
        }

        getMoleArtKey(type) {
          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Golden) {
            return (_crd && ArtAssetKey === void 0 ? (_reportPossibleCrUseOfArtAssetKey({
              error: Error()
            }), ArtAssetKey) : ArtAssetKey).GoldenMole;
          }

          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb) {
            return (_crd && ArtAssetKey === void 0 ? (_reportPossibleCrUseOfArtAssetKey({
              error: Error()
            }), ArtAssetKey) : ArtAssetKey).BombMole;
          }

          return (_crd && ArtAssetKey === void 0 ? (_reportPossibleCrUseOfArtAssetKey({
            error: Error()
          }), ArtAssetKey) : ArtAssetKey).NormalMole;
        }

        getMoleMainColor(type) {
          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Golden) {
            return new Color(245, 177, 45, 255);
          }

          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb) {
            return new Color(58, 57, 63, 255);
          }

          return new Color(139, 83, 45, 255);
        }

        getMoleBellyColor(type) {
          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Golden) {
            return new Color(255, 216, 88, 255);
          }

          if (type === (_crd && MoleType === void 0 ? (_reportPossibleCrUseOfMoleType({
            error: Error()
          }), MoleType) : MoleType).Bomb) {
            return new Color(91, 88, 96, 255);
          }

          return new Color(190, 123, 72, 255);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "holes", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "molePrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "audioManager", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=29fdef50c80fd46eb2347a38c50b8ff3664fdb2a.js.map