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
        /**
         * 获取平台临时登录凭证。正式服必须由业务服务端交换 openId/session，
         * 客户端不保存 code，也不把 AppSecret 放进包内。
         */


        static login() {
          if (this.loginPromise) {
            return this.loginPromise;
          }

          var platform = this.getPlatformType();
          var api = this.getActiveApi();

          if (!(api != null && api.login)) {
            return Promise.resolve({
              platform,
              success: platform === PlatformType.Editor,
              code: '',
              errorMessage: platform === PlatformType.Editor ? '' : '当前环境不支持平台登录'
            });
          }

          this.loginPromise = new Promise(resolve => {
            api.login == null || api.login({
              force: false,
              success: result => {
                var _ref, _result$code;

                var code = (_ref = (_result$code = result.code) != null ? _result$code : result.anonymousCode) != null ? _ref : '';
                resolve({
                  platform,
                  success: code.length > 0,
                  code,
                  errorMessage: code ? '' : '平台未返回登录凭证'
                });
              },
              fail: error => {
                var _error$errMsg;

                this.loginPromise = null;
                resolve({
                  platform,
                  success: false,
                  code: '',
                  errorMessage: (_error$errMsg = error.errMsg) != null ? _error$errMsg : '平台登录失败'
                });
              }
            });
          });
          return this.loginPromise;
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
          var _this$getActiveApi;

          var openDataContext = (_this$getActiveApi = this.getActiveApi()) == null || _this$getActiveApi.getOpenDataContext == null ? void 0 : _this$getActiveApi.getOpenDataContext();

          if (!(openDataContext != null && openDataContext.postMessage)) {
            return false;
          }

          openDataContext.postMessage({
            type: 'showLeaderboard'
          });
          return true;
        }

        static hideLeaderboard() {
          var _this$getActiveApi2;

          (_this$getActiveApi2 = this.getActiveApi()) == null || _this$getActiveApi2.getOpenDataContext == null || (_this$getActiveApi2 = _this$getActiveApi2.getOpenDataContext()) == null || _this$getActiveApi2.postMessage == null || _this$getActiveApi2.postMessage({
            type: 'hideLeaderboard'
          });
        }

        static submitScore(score) {
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
        }

        static reportAnalytics(eventName, data) {
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
        }

        static registerErrorHandlers(handler) {
          var api = this.getActiveApi();
          api == null || api.onError == null || api.onError(error => {
            var _error$errMsg2;

            var message = typeof error === 'string' ? error : (_error$errMsg2 = error.errMsg) != null ? _error$errMsg2 : 'unknown runtime error';
            handler('runtime', message);
          });
          api == null || api.onUnhandledRejection == null || api.onUnhandledRejection(result => {
            var reason = result.reason;
            var message = reason instanceof Error ? reason.message : String(reason != null ? reason : 'unknown rejection');
            handler('promise', message);
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

      PlatformAdapter.loginPromise = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f120b030e393e0e271026e044bf413c034d782ea.js.map