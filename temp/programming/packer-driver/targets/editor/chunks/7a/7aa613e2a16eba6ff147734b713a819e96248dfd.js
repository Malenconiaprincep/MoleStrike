System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, GameState, MoleType, DEFAULT_GAME_SECONDS, NORMAL_MOLE_CONFIG, GOLDEN_MOLE_CONFIG, BOMB_MOLE_CONFIG;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "58a05JQDiFLB4iko6FTDwvG", "GameTypes", undefined);

      /**
       * 游戏公共类型定义。
       * 所有模块共享的枚举和配置集中放在这里，避免字符串散落在业务代码中。
       */
      _export("GameState", GameState = /*#__PURE__*/function (GameState) {
        GameState["Home"] = "Home";
        GameState["Playing"] = "Playing";
        GameState["Paused"] = "Paused";
        GameState["GameOver"] = "GameOver";
        return GameState;
      }({}));

      _export("MoleType", MoleType = /*#__PURE__*/function (MoleType) {
        MoleType["Normal"] = "Normal";
        MoleType["Golden"] = "Golden";
        MoleType["Bomb"] = "Bomb";
        return MoleType;
      }({}));

      _export("DEFAULT_GAME_SECONDS", DEFAULT_GAME_SECONDS = 60);

      _export("NORMAL_MOLE_CONFIG", NORMAL_MOLE_CONFIG = {
        type: MoleType.Normal,
        score: 1,
        staySeconds: 1
      });

      _export("GOLDEN_MOLE_CONFIG", GOLDEN_MOLE_CONFIG = {
        type: MoleType.Golden,
        score: 5,
        staySeconds: 0.8
      });

      _export("BOMB_MOLE_CONFIG", BOMB_MOLE_CONFIG = {
        type: MoleType.Bomb,
        score: -3,
        staySeconds: 0.9
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7aa613e2a16eba6ff147734b713a819e96248dfd.js.map