System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, sys, PlatformAdapter, AnalyticsManager, _crd, DIAGNOSTICS_KEY, MAX_DIAGNOSTIC_EVENTS;

  function _reportPossibleCrUseOfPlatformAdapter(extras) {
    _reporterNs.report("PlatformAdapter", "../platform/PlatformAdapter", _context.meta, extras);
  }

  _export("AnalyticsManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      PlatformAdapter = _unresolved_2.PlatformAdapter;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "764ea8MJh1KyIbjuFgac27x", "AnalyticsManager", undefined);

      __checkObsolete__(['sys']);

      DIAGNOSTICS_KEY = 'mole_strike_diagnostics_v1';
      MAX_DIAGNOSTIC_EVENTS = 20;
      /** 统一事件与错误采集。失败时仅降级，不允许影响游戏主流程。 */

      _export("AnalyticsManager", AnalyticsManager = class AnalyticsManager {
        static initialize() {
          if (this.initialized) {
            return;
          }

          this.initialized = true;
          this.sessionId = this.createSessionId();
          (_crd && PlatformAdapter === void 0 ? (_reportPossibleCrUseOfPlatformAdapter({
            error: Error()
          }), PlatformAdapter) : PlatformAdapter).registerErrorHandlers((kind, message) => {
            this.track('runtime_error', {
              kind,
              message
            });
          });
          this.track('game_launch', {
            platform: (_crd && PlatformAdapter === void 0 ? (_reportPossibleCrUseOfPlatformAdapter({
              error: Error()
            }), PlatformAdapter) : PlatformAdapter).getPlatformType(),
            version: '0.1.0'
          });
        }

        static track(name, payload = {}) {
          try {
            const eventName = this.normalizeName(name);
            const data = this.normalizePayload({ ...payload,
              session_id: this.sessionId || 'not_initialized'
            });
            this.storeDiagnostic({
              timestamp: Date.now(),
              name: eventName,
              data
            });
            (_crd && PlatformAdapter === void 0 ? (_reportPossibleCrUseOfPlatformAdapter({
              error: Error()
            }), PlatformAdapter) : PlatformAdapter).reportAnalytics(eventName, data);
          } catch {// 埋点与诊断绝不能中断玩法。
          }
        }

        static getRecentDiagnostics() {
          try {
            const rawValue = sys.localStorage.getItem(DIAGNOSTICS_KEY);

            if (!rawValue) {
              return [];
            }

            const events = JSON.parse(rawValue);
            return Array.isArray(events) ? events.slice(-MAX_DIAGNOSTIC_EVENTS) : [];
          } catch {
            return [];
          }
        }

        static storeDiagnostic(event) {
          const events = [...this.getRecentDiagnostics(), event].slice(-MAX_DIAGNOSTIC_EVENTS);
          sys.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(events));
        }

        static normalizePayload(payload) {
          const normalized = {};
          const entries = Object.keys(payload).slice(0, 20);

          for (const key of entries) {
            const safeKey = this.normalizeName(key);
            const value = payload[key];

            if (typeof value === 'number') {
              normalized[safeKey] = Number.isFinite(value) ? value : 0;
            } else if (typeof value === 'boolean') {
              normalized[safeKey] = value ? 1 : 0;
            } else {
              normalized[safeKey] = value.slice(0, 160);
            }
          }

          return normalized;
        }

        static normalizeName(name) {
          const safeName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 40);
          return safeName || 'unknown_event';
        }

        static createSessionId() {
          const timePart = Date.now().toString(36);
          const randomPart = Math.floor(Math.random() * 0x1000000).toString(36);
          return `${timePart}_${randomPart}`;
        }

      });

      AnalyticsManager.initialized = false;
      AnalyticsManager.sessionId = '';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=888a57ff411b9cfb2e4e3c634fde240e7973ec2f.js.map