!(function (e, t, s, i, r, a, n, o) {
  var l =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof self
          ? self
          : "undefined" != typeof window
            ? window
            : "undefined" != typeof global
              ? global
              : {},
    h = "function" == typeof l[i] && l[i],
    u = h.i || {},
    c = h.cache || {},
    d =
      "undefined" != typeof module &&
      "function" == typeof module.require &&
      module.require.bind(module);
  function m(t, s) {
    if (!c[t]) {
      if (!e[t]) {
        if (r[t]) return r[t];
        var a = "function" == typeof l[i] && l[i];
        if (!s && a) return a(t, !0);
        if (h) return h(t, !0);
        if (d && "string" == typeof t) return d(t);
        var n = Error("Cannot find module '" + t + "'");
        throw ((n.code = "MODULE_NOT_FOUND"), n);
      }
      (u.resolve = function (s) {
        var i = e[t][1][s];
        return null != i ? i : s;
      }),
        (u.cache = {});
      var o = (c[t] = new m.Module(t));
      e[t][0].call(o.exports, u, o, o.exports, l);
    }
    return c[t].exports;
    function u(e) {
      var t = u.resolve(e);
      return !1 === t ? {} : m(t);
    }
  }
  (m.isParcelRequire = !0),
    (m.Module = function (e) {
      (this.id = e), (this.bundle = m), (this.require = d), (this.exports = {});
    }),
    (m.modules = e),
    (m.cache = c),
    (m.parent = h),
    (m.distDir = void 0),
    (m.publicUrl = void 0),
    (m.devServer = void 0),
    (m.i = u),
    (m.register = function (t, s) {
      e[t] = [
        function (e, t) {
          t.exports = s;
        },
        {},
      ];
    }),
    Object.defineProperty(m, "root", {
      get: function () {
        return l[i];
      },
    }),
    (l[i] = m);
  for (var M = 0; M < t.length; M++) m(t[M]);
  if (s) {
    var k = m(s);
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = k)
      : "function" == typeof define &&
        define.amd &&
        define(function () {
          return k;
        });
  }
})(
  {
    e7afj: [
      function (e, t, s, i) {
        e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(
          s,
        );
        class r {
          constructor() {
            if (r.instance) return r.instance;
            (this.volumeLandmarks = {
              Chest: { MV: 4, MEV: 8, MAV: 16, MRV: 22 },
              Back: { MV: 6, MEV: 10, MAV: 20, MRV: 25 },
              Quads: { MV: 6, MEV: 10, MAV: 20, MRV: 25 },
              Hamstrings: { MV: 4, MEV: 6, MAV: 16, MRV: 20 },
              Shoulders: { MV: 4, MEV: 8, MAV: 16, MRV: 20 },
              Biceps: { MV: 4, MEV: 6, MAV: 14, MRV: 20 },
              Triceps: { MV: 4, MEV: 6, MAV: 14, MRV: 18 },
              Calves: { MV: 6, MEV: 8, MAV: 16, MRV: 22 },
              Abs: { MV: 0, MEV: 6, MAV: 16, MRV: 25 },
              Forearms: { MV: 2, MEV: 4, MAV: 10, MRV: 16 },
              Neck: { MV: 0, MEV: 2, MAV: 8, MRV: 12 },
              Traps: { MV: 2, MEV: 4, MAV: 12, MRV: 16 },
            }),
              (this.weekNo = 1),
              (this.mesoLen = 4),
              (this.blockNo = 1),
              (this.deloadPhase = !1),
              (this.resensitizationPhase = !1),
              (this.currentWeekSets = {}),
              (this.lastWeekSets = {}),
              (this.baselineStrength = {}),
              Object.keys(this.volumeLandmarks).forEach((e) => {
                (this.currentWeekSets[e] = this.volumeLandmarks[e].MEV),
                  (this.lastWeekSets[e] = this.volumeLandmarks[e].MEV),
                  (this.baselineStrength[e] = 100);
              }),
              (this.consecutiveMRVWeeks = 0),
              (this.recoverySessionsThisWeek = 0),
              (this.totalMusclesNeedingRecovery = 0),
              (r.instance = this),
              this.loadState();
          }
          getTargetRIR() {
            return Math.max(
              0.5,
              Math.min(3, 3 - (2.5 / (this.mesoLen - 1)) * (this.weekNo - 1)),
            );
          }
          getVolumeStatus(e, t = null) {
            let s = null !== t ? t : this.currentWeekSets[e],
              i = this.volumeLandmarks[e];
            return s < i.MV
              ? "under-minimum"
              : s < i.MEV
                ? "maintenance"
                : s < i.MAV
                  ? "optimal"
                  : s < i.MRV
                    ? "high"
                    : "maximum";
          }
          getVolumeColor(e, t = null) {
            return {
              "under-minimum": "#ff4444",
              maintenance: "#ffaa00",
              optimal: "#44ff44",
              high: "#ffff44",
              maximum: "#ff4444",
            }[this.getVolumeStatus(e, t)];
          }
          updateWeeklySets(e, t) {
            (this.currentWeekSets[e] = Math.max(0, t)), this.saveState();
          }
          addSets(e, t) {
            (this.currentWeekSets[e] += t),
              (this.currentWeekSets[e] = Math.max(0, this.currentWeekSets[e])),
              this.saveState();
          }
          shouldDeload() {
            if (this.consecutiveMRVWeeks >= 2) return !0;
            let e = Object.keys(this.volumeLandmarks).length;
            return (
              this.totalMusclesNeedingRecovery >= Math.ceil(e / 2) ||
              !!["Chest", "Back", "Quads", "Shoulders"].some(
                (e) =>
                  this.currentWeekSets[e] >= this.volumeLandmarks[e].MRV &&
                  this.totalMusclesNeedingRecovery > 0,
              ) ||
              !!(this.weekNo >= this.mesoLen)
            );
          }
          shouldResensitize() {
            return this.blockNo % 4 == 0;
          }
          startDeload() {
            (this.deloadPhase = !0),
              Object.keys(this.volumeLandmarks).forEach((e) => {
                let t = Math.round(0.5 * this.volumeLandmarks[e].MEV);
                this.currentWeekSets[e] = t;
              }),
              this.saveState();
          }
          startResensitization() {
            (this.resensitizationPhase = !0),
              Object.keys(this.volumeLandmarks).forEach((e) => {
                this.currentWeekSets[e] = this.volumeLandmarks[e].MV;
              }),
              this.saveState();
          }
          nextWeek() {
            (this.lastWeekSets = { ...this.currentWeekSets }),
              Object.keys(this.volumeLandmarks).filter(
                (e) => this.currentWeekSets[e] >= this.volumeLandmarks[e].MRV,
              ).length > 0
                ? this.consecutiveMRVWeeks++
                : (this.consecutiveMRVWeeks = 0),
              this.weekNo++,
              this.weekNo > this.mesoLen &&
                ((this.weekNo = 1),
                this.blockNo++,
                (this.consecutiveMRVWeeks = 0)),
              (this.recoverySessionsThisWeek = 0),
              (this.totalMusclesNeedingRecovery = 0),
              this.saveState();
          }
          resetWeek() {
            Object.keys(this.volumeLandmarks).forEach((e) => {
              this.currentWeekSets[e] = this.volumeLandmarks[e].MEV;
            }),
              this.saveState();
          }
          hitMRV(e) {
            this.totalMusclesNeedingRecovery++,
              this.currentWeekSets[e] >= this.volumeLandmarks[e].MRV &&
                this.consecutiveMRVWeeks++,
              this.saveState();
          }
          getWeeklySets(e) {
            return this.currentWeekSets[e] || this.volumeLandmarks[e].MEV;
          }
          initializeMuscleAtMEV(e) {
            (this.currentWeekSets[e] = this.volumeLandmarks[e].MEV),
              this.saveState();
          }
          mostMusclesAtMRV() {
            let e = Object.keys(this.volumeLandmarks);
            return (
              e.filter(
                (e) => this.currentWeekSets[e] >= this.volumeLandmarks[e].MRV,
              ).length >= Math.ceil(0.5 * e.length)
            );
          }
          setBaselineStrength(e, t) {
            (this.baselineStrength[e] = t), this.saveState();
          }
          repStrengthDrop(e, t) {
            let s = this.baselineStrength[e];
            return !!s && !!t && t < 0.97 * s;
          }
          updateVolumeLandmarks(e, t) {
            (this.volumeLandmarks[e] = { ...this.volumeLandmarks[e], ...t }),
              this.saveState();
          }
          getRecoveryVolume(e, t = !1) {
            let s = this.volumeLandmarks[e];
            return Math.max(
              Math.round((s.MEV + s.MRV) / 2) - (t ? 2 : 1),
              Math.ceil(0.5 * s.MEV),
            );
          }
          saveState() {
            let e = {
              volumeLandmarks: this.volumeLandmarks,
              weekNo: this.weekNo,
              mesoLen: this.mesoLen,
              blockNo: this.blockNo,
              deloadPhase: this.deloadPhase,
              resensitizationPhase: this.resensitizationPhase,
              currentWeekSets: this.currentWeekSets,
              lastWeekSets: this.lastWeekSets,
              consecutiveMRVWeeks: this.consecutiveMRVWeeks,
              recoverySessionsThisWeek: this.recoverySessionsThisWeek,
              totalMusclesNeedingRecovery: this.totalMusclesNeedingRecovery,
            };
            localStorage.setItem("rp-training-state", JSON.stringify(e));
          }
          loadState() {
            let e = localStorage.getItem("rp-training-state");
            if (e)
              try {
                let t = JSON.parse(e);
                Object.assign(this, t);
              } catch (e) {
                console.warn("Failed to load training state, using defaults");
              }
          }
          migrateLegacyData() {
            let e = Object.keys(this.volumeLandmarks),
              t = !1;
            e.forEach((e) => {
              let s = `week-1-${e}`,
                i = localStorage.getItem(s);
              i &&
                ((this.currentWeekSets[e] = parseInt(i, 10)),
                localStorage.removeItem(s),
                (t = !0));
              let r = `${e}-MEV`,
                a = `${e}-MRV`,
                n = localStorage.getItem(r),
                o = localStorage.getItem(a);
              (n || o) &&
                ((this.volumeLandmarks[e] = {
                  ...this.volumeLandmarks[e],
                  MEV: n ? parseInt(n, 10) : this.volumeLandmarks[e].MEV,
                  MRV: o ? parseInt(o, 10) : this.volumeLandmarks[e].MRV,
                }),
                n && localStorage.removeItem(r),
                o && localStorage.removeItem(a),
                (t = !0));
            }),
              t &&
                (this.saveState(),
                console.log("Legacy data migrated to new RP training state"));
          }
          getStateSummary() {
            return {
              week: this.weekNo,
              meso: this.mesoLen,
              block: this.blockNo,
              targetRIR: this.getTargetRIR(),
              deloadRecommended: this.shouldDeload(),
              resensitizationRecommended: this.shouldResensitize(),
              currentPhase: this.deloadPhase
                ? "deload"
                : this.resensitizationPhase
                  ? "resensitization"
                  : "accumulation",
            };
          }
        }
        let a = new r();
        (s.default = a),
          "undefined" != typeof window && (window.trainingState = a);
      },
      { "@parcel/transformer-js/src/esmodule-helpers.js": "k3151" },
    ],
    k3151: [
      function (e, t, s, i) {
        (s.interopDefault = function (e) {
          return e && e.__esModule ? e : { default: e };
        }),
          (s.defineInteropFlag = function (e) {
            Object.defineProperty(e, "__esModule", { value: !0 });
          }),
          (s.exportAll = function (e, t) {
            return (
              Object.keys(e).forEach(function (s) {
                "default" === s ||
                  "__esModule" === s ||
                  Object.prototype.hasOwnProperty.call(t, s) ||
                  Object.defineProperty(t, s, {
                    enumerable: !0,
                    get: function () {
                      return e[s];
                    },
                  });
              }),
              t
            );
          }),
          (s.export = function (e, t, s) {
            Object.defineProperty(e, t, { enumerable: !0, get: s });
          });
      },
      {},
    ],
  },
  ["e7afj"],
  "e7afj",
  "parcelRequire66c8",
  {},
);
//# sourceMappingURL=trainingState.be96fca7.js.map
