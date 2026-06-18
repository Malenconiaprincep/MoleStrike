System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, PlatformAdapter, _crd, PlatformType;

  _export("PlatformAdapter", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "67ffetmEbVMPr92JG8PUtOn", "PlatformAdapter", undefined);

      __checkObsolete__(['sys']);

      _export("PlatformType", PlatformType = /*#__PURE__*/function (PlatformType) {
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


      _export("PlatformAdapter", PlatformAdapter = class PlatformAdapter {
        static getPlatformType() {
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
        }

        static setupShareMenu() {
          var api = this.getActiveApi();
          api == null || api.showShareMenu == null || api.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
          });
        }

        static vibrateShort(type) {
          if (type === void 0) {
            type = 'light';
          }

          var api = this.getActiveApi();
          api == null || api.vibrateShort == null || api.vibrateShort({
            type
          });
        }

        static shareScore(score) {
          var api = this.getActiveApi();

          if (!(api != null && api.shareAppMessage)) {
            return false;
          }

          api.shareAppMessage({
            title: "\u6211\u5728\u5730\u9F20\u7A81\u51FB\u961F\u62FF\u5230\u4E86 " + score + " \u5206\uFF0C\u6765\u6311\u6218\u6211\uFF01",
            query: "score=" + score
          });
          return true;
        }

        static showLeaderboard() {
          var wechatApi = this.getWechatApi();
          var openDataContext = wechatApi == null || wechatApi.getOpenDataContext == null ? void 0 : wechatApi.getOpenDataContext();

          if (!(openDataContext != null && openDataContext.postMessage)) {
            return false;
          }

          openDataContext.postMessage({
            type: 'showLeaderboard'
          });
          return true;
        }

        static submitScore(score) {
          var wechatApi = this.getWechatApi();
          var openDataContext = wechatApi == null || wechatApi.getOpenDataContext == null ? void 0 : wechatApi.getOpenDataContext();
          openDataContext == null || openDataContext.postMessage == null || openDataContext.postMessage({
            type: 'submitScore',
            score
          });
        }

        static getActiveApi() {
          var _this$getWechatApi;

          return (_this$getWechatApi = this.getWechatApi()) != null ? _this$getWechatApi : this.getDouyinApi();
        }

        static getWechatApi() {
          return typeof wx !== 'undefined' ? wx : null;
        }

        static getDouyinApi() {
          return typeof tt !== 'undefined' ? tt : null;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f120b030e393e0e271026e044bf413c034d782ea.js.map