!(function (e, t, n, a, s, o, r, i) {
  var u =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof self
          ? self
          : "undefined" != typeof window
            ? window
            : "undefined" != typeof global
              ? global
              : {},
    l = "function" == typeof u[a] && u[a],
    d = l.i || {},
    c = l.cache || {},
    m =
      "undefined" != typeof module &&
      "function" == typeof module.require &&
      module.require.bind(module);
  function f(t, n) {
    if (!c[t]) {
      if (!e[t]) {
        if (s[t]) return s[t];
        var o = "function" == typeof u[a] && u[a];
        if (!n && o) return o(t, !0);
        if (l) return l(t, !0);
        if (m && "string" == typeof t) return m(t);
        var r = Error("Cannot find module '" + t + "'");
        throw ((r.code = "MODULE_NOT_FOUND"), r);
      }
      (d.resolve = function (n) {
        var a = e[t][1][n];
        return null != a ? a : n;
      }),
        (d.cache = {});
      var i = (c[t] = new f.Module(t));
      e[t][0].call(i.exports, d, i, i.exports, u);
    }
    return c[t].exports;
    function d(e) {
      var t = d.resolve(e);
      return !1 === t ? {} : f(t);
    }
  }
  (f.isParcelRequire = !0),
    (f.Module = function (e) {
      (this.id = e), (this.bundle = f), (this.require = m), (this.exports = {});
    }),
    (f.modules = e),
    (f.cache = c),
    (f.parent = l),
    (f.distDir = void 0),
    (f.publicUrl = void 0),
    (f.devServer = void 0),
    (f.i = d),
    (f.register = function (t, n) {
      e[t] = [
        function (e, t) {
          t.exports = n;
        },
        {},
      ];
    }),
    Object.defineProperty(f, "root", {
      get: function () {
        return u[a];
      },
    }),
    (u[a] = f);
  for (var v = 0; v < t.length; v++) f(t[v]);
  if (n) {
    var g = f(n);
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = g)
      : "function" == typeof define &&
        define.amd &&
        define(function () {
          return g;
        });
  }
})(
  {
    boGW6: [
      function (e, t, n, a) {
        var s = e("@parcel/transformer-js/src/esmodule-helpers.js");
        s.defineInteropFlag(n),
          s.export(n, "scoreStimulus", () => u),
          s.export(n, "mevStimulusEstimator", () => u),
          s.export(n, "setProgressionAlgorithm", () => c),
          s.export(n, "rpSetProgression", () => c),
          s.export(n, "analyzeVolumeStatus", () => m),
          s.export(n, "calculateRecoveryVolume", () => f),
          s.export(n, "validateVolumeInput", () => v),
          s.export(n, "getVolumeProgression", () => g),
          s.export(n, "analyzeDeloadNeed", () => h),
          s.export(n, "autoSetIncrement", () => l),
          s.export(n, "processWeeklyVolumeProgression", () => d);
        var o = e("../core/trainingState.js"),
          r = s.interopDefault(o),
          i = e("./fatigue.js");
        function u({ mmc: e, pump: t, disruption: n }) {
          let a,
            s,
            o,
            r = (e, t, n) => Math.max(t, Math.min(n, e)),
            i = r(e, 0, 3),
            u = r(t, 0, 3),
            l = r(n, 0, 3),
            d = i + u + l;
          return (
            d <= 3
              ? ((a = `Stimulus too low (${d}/9) \u{2192} Add 2 sets next session`),
                (s = "add_sets"),
                (o = 2))
              : d <= 6
                ? ((a = `Stimulus adequate (${d}/9) \u{2192} Keep sets the same`),
                  (s = "maintain"),
                  (o = 0))
                : ((a = `Stimulus excessive (${d}/9) \u{2192} Remove 1-2 sets next session`),
                  (s = "reduce_sets"),
                  (o = -1)),
            {
              score: d,
              advice: a,
              action: s,
              setChange: o,
              breakdown: { mmc: i, pump: u, disruption: l },
            }
          );
        }
        function l(e, t, n) {
          let { MEV: a, MRV: s } = n.volumeLandmarks[e],
            o = n.currentWeekSets[e] || a,
            r = o <= a,
            i = o >= s,
            u = t.stimulus <= 3,
            l = t.soreness <= 1 && t.perf >= 0;
          return i || t.recoverySession
            ? {
                add: !1,
                delta: 0,
                reason: i
                  ? "At MRV - holding volume"
                  : "Recovery session needed",
              }
            : r || (u && l)
              ? {
                  add: !0,
                  delta: Math.min(1 + +!!r, 2),
                  reason: r
                    ? "Starting from MEV - aggressive progression"
                    : "Low stimulus with good recovery",
                }
              : { add: !1, delta: 0, reason: "Maintaining current volume" };
        }
        function d(e, t) {
          let n = {},
            a = !1,
            s = 0;
          return (
            Object.keys(e).forEach((a) => {
              let o = e[a];
              (0, i.isHighFatigue)(a, o, t) &&
                (t.hitMRV(a),
                s++,
                console.log(`hitMRV: true (fatigue) - ${a}`),
                (o.recoverySession = !0));
              let r = l(a, o, t);
              r.add && t.addSets(a, r.delta),
                t.getWeeklySets(a) >= t.volumeLandmarks[a].MRV &&
                  (t.hitMRV(a), s++),
                (n[a] = {
                  previousSets: t.lastWeekSets[a] || t.volumeLandmarks[a].MEV,
                  currentSets: t.getWeeklySets(a),
                  increment: r.delta,
                  reason: r.reason,
                  status: t.getVolumeStatus(a),
                });
            }),
            t.shouldDeload() && (t.startDeload(), (a = !0)),
            {
              progressionLog: n,
              deloadTriggered: a,
              mrvHits: s,
              weekComplete: !0,
              recommendation: a
                ? "Deload phase initiated"
                : "Continue progression",
            }
          );
        }
        function c(e, t) {
          let n = (e, t, n) => Math.max(t, Math.min(n, e)),
            a = n(e, 0, 3),
            s = n(t, 0, 3);
          return [
            [
              {
                advice: "Add 1 set next session",
                action: "add_sets",
                setChange: 1,
              },
              {
                advice: "Add 2 sets next session",
                action: "add_sets",
                setChange: 2,
              },
              {
                advice: "Add 2-3 sets next session",
                action: "add_sets",
                setChange: 2,
              },
              {
                advice: "Add 2-3 sets next session",
                action: "add_sets",
                setChange: 3,
              },
            ],
            [
              {
                advice: "Hold sets at current level",
                action: "maintain",
                setChange: 0,
              },
              {
                advice: "Add 1 set next session",
                action: "add_sets",
                setChange: 1,
              },
              {
                advice: "Add 2 sets next session",
                action: "add_sets",
                setChange: 2,
              },
              {
                advice: "Add 2-3 sets next session",
                action: "add_sets",
                setChange: 2,
              },
            ],
            [
              {
                advice: "Do recovery session",
                action: "recovery",
                setChange: -99,
              },
              {
                advice: "Hold sets at current level",
                action: "maintain",
                setChange: 0,
              },
              {
                advice: "Hold sets at current level",
                action: "maintain",
                setChange: 0,
              },
              {
                advice: "Add 1 set next session",
                action: "add_sets",
                setChange: 1,
              },
            ],
            [
              {
                advice: "Do recovery session",
                action: "recovery",
                setChange: -99,
              },
              {
                advice: "Do recovery session",
                action: "recovery",
                setChange: -99,
              },
              {
                advice: "Do recovery session",
                action: "recovery",
                setChange: -99,
              },
              {
                advice: "Hold sets at current level",
                action: "maintain",
                setChange: 0,
              },
            ],
          ][a][s];
        }
        function m(e, t = null) {
          let n = null !== t ? t : r.default.currentWeekSets[e],
            a = r.default.volumeLandmarks[e];
          if (!a) throw Error(`Unknown muscle group: ${e}`);
          let s = r.default.getVolumeStatus(e, n),
            o = (n / a.MRV) * 100,
            i = "",
            u = "normal";
          switch (s) {
            case "under-minimum":
              (i = `Below MV (${a.MV}). Increase volume significantly.`),
                (u = "high");
              break;
            case "maintenance":
              (i = `In maintenance zone (${a.MV}-${a.MEV}). Consider increasing for growth.`),
                (u = "low");
              break;
            case "optimal":
              (i = `In optimal zone (${a.MEV}-${a.MAV}). Continue progressive overload.`),
                (u = "normal");
              break;
            case "high":
              (i = `High volume zone (${a.MAV}-${a.MRV}). Monitor recovery closely.`),
                (u = "medium");
              break;
            case "maximum":
              (i = `At/above MRV (${a.MRV}). Deload recommended.`),
                (u = "high");
          }
          return {
            muscle: e,
            currentSets: n,
            landmarks: a,
            status: s,
            percentage: Math.round(o),
            recommendation: i,
            urgency: u,
            color: r.default.getVolumeColor(e, n),
          };
        }
        function f(e, t = !1) {
          let n = r.default.volumeLandmarks[e],
            a = r.default.getRecoveryVolume(e, t);
          return {
            muscle: e,
            recommendedSets: a,
            reasoning: t ? "illness adjustment" : "standard recovery",
            landmarks: n,
            percentage: Math.round((a / n.MEV) * 100),
          };
        }
        function v(e, t) {
          let n = r.default.volumeLandmarks[e],
            a = t >= 0 && t <= 1.2 * n.MRV,
            s = "";
          return (
            t < 0
              ? (s = "Sets cannot be negative")
              : t > n.MRV
                ? (s = `Above MRV (${n.MRV}). Consider deload.`)
                : t < n.MV &&
                  (s = `Below MV (${n.MV}). May not be sufficient for adaptation.`),
            { isValid: a, warning: s, proposedSets: t, landmarks: n }
          );
        }
        function g(e, t) {
          let n = r.default.currentWeekSets[e],
            a = m(e),
            s = u(t.stimulus),
            o = c(t.soreness, t.performance),
            i = o.setChange,
            l = o.advice;
          if (
            ("maximum" === a.status &&
              i > 0 &&
              ((i = 0), (l = "At MRV limit. Hold sets or consider deload.")),
            "under-minimum" === a.status &&
              i <= 0 &&
              ((i = 2),
              (l = "Below minimum volume. Add sets regardless of fatigue.")),
            "recovery" === o.action)
          ) {
            let a = f(e, t.hasIllness);
            (i = a.recommendedSets - n),
              (l = `Recovery session: ${a.recommendedSets} sets (${a.reasoning})`);
          }
          let d = Math.max(0, n + i);
          return {
            muscle: e,
            currentSets: n,
            projectedSets: d,
            setChange: i,
            advice: l,
            stimulusScore: s.score,
            volumeStatus: a.status,
            targetRIR: r.default.getTargetRIR(),
            deloadRecommended: r.default.shouldDeload(),
          };
        }
        function h() {
          let e = Object.keys(r.default.volumeLandmarks),
            t = e.filter((e) => "maximum" === r.default.getVolumeStatus(e)),
            n = r.default.shouldDeload(),
            a = [];
          return (
            r.default.consecutiveMRVWeeks >= 2 &&
              a.push("Two consecutive weeks at MRV"),
            r.default.totalMusclesNeedingRecovery >= Math.ceil(e.length / 2) &&
              a.push("Most muscles need recovery sessions"),
            r.default.weekNo >= r.default.mesoLen &&
              a.push("End of mesocycle reached"),
            t.length >= Math.ceil(e.length / 3) &&
              a.push(`${t.length} muscle groups at/above MRV`),
            {
              shouldDeload: n,
              reasons: a,
              mrvBreaches: t,
              consecutiveMRVWeeks: r.default.consecutiveMRVWeeks,
              currentWeek: r.default.weekNo,
              mesoLength: r.default.mesoLen,
              musclesNeedingRecovery: r.default.totalMusclesNeedingRecovery,
            }
          );
        }
      },
      {
        "../core/trainingState.js": "e7afj",
        "./fatigue.js": "3GKzs",
        "@parcel/transformer-js/src/esmodule-helpers.js": "k3151",
      },
    ],
    "3GKzs": [
      function (e, t, n, a) {
        var s = e("@parcel/transformer-js/src/esmodule-helpers.js");
        s.defineInteropFlag(n),
          s.export(n, "analyzeFrequency", () => i),
          s.export(n, "calculateOptimalFrequency", () => u),
          s.export(n, "isHighFatigue", () => l);
        var o = e("../core/trainingState.js"),
          r = s.interopDefault(o);
        function i(e, t, n = null) {
          let a = Math.max(0, e),
            s = Math.max(1, t),
            o = "",
            u = "",
            l = "normal",
            d = 0,
            c = a / s;
          if (
            (c < 0.7
              ? ((o = "You heal early → Add one session per week"),
                (u = "increase_frequency"),
                (d = 1),
                (l = "medium"))
              : c > 1.3
                ? ((o = "Recovery lags → Insert an extra rest day"),
                  (u = "decrease_frequency"),
                  (d = -1),
                  (l = "high"))
                : ((o = "Frequency is optimal"),
                  (u = "maintain"),
                  (d = 0),
                  (l = "normal")),
            n)
          ) {
            let e = r.default.getVolumeStatus(n);
            "maximum" === e &&
              "increase_frequency" === u &&
              ((o = "At MRV - maintain frequency despite early recovery"),
              (u = "maintain"),
              (d = 0)),
              "under-minimum" === e &&
                "decrease_frequency" === u &&
                ((o =
                  "Below MV - consider recovery methods instead of reducing frequency"),
                (u = "improve_recovery"),
                (d = 0));
          }
          return {
            sorenessRecoveryDays: a,
            currentSessionGap: s,
            recoveryRatio: Math.round(100 * c) / 100,
            recommendation: o,
            action: u,
            frequencyAdjustment: d,
            urgency: l,
            muscle: n,
          };
        }
        function u(e, t = {}) {
          let {
              availableDays: n = 6,
              currentVolume: a = null,
              recoveryCapacity: s = "normal",
              trainingAge: o = "intermediate",
            } = t,
            i = a || r.default.currentWeekSets[e],
            l = r.default.volumeLandmarks[e],
            d = {
              beginner: { min: 2, max: 3 },
              intermediate: { min: 2, max: 4 },
              advanced: { min: 3, max: 5 },
            }[o],
            c = 2,
            m = Math.round(
              (c =
                i >= l.MAV
                  ? Math.min(4, Math.ceil(i / 6))
                  : i >= l.MEV
                    ? Math.min(3, Math.ceil(i / 8))
                    : Math.max(2, Math.ceil(i / 10))) *
                { low: 0.8, normal: 1, high: 1.2 }[s],
            ),
            f = Math.max(d.min, Math.min(d.max, m, n)),
            v = Math.ceil(i / f);
          return {
            muscle: e,
            recommendedFrequency: f,
            setsPerSession: v,
            totalVolume: i,
            reasoning: [
              `${i} weekly sets`,
              `${s} recovery capacity`,
              `${o} training age`,
              `${n} available days`,
            ],
            alternatives: {
              conservative: Math.max(2, f - 1),
              aggressive: Math.min(n, f + 1),
            },
          };
        }
        function l(e, t, n) {
          let a = t.soreness || 0,
            s = t.jointAche || 0,
            o = t.perfChange || 0,
            r = (t.pump || 0) + (t.disruption || 0),
            i = !!t.lastLoad && n.repStrengthDrop(e, t.lastLoad);
          return r / (a + s + 2 * (o < 0) || 1) <= 1 || i;
        }
      },
      {
        "../core/trainingState.js": "e7afj",
        "@parcel/transformer-js/src/esmodule-helpers.js": "k3151",
      },
    ],
  },
  ["boGW6"],
  "boGW6",
  "parcelRequire66c8",
  {},
);
//# sourceMappingURL=volume.43331bd9.js.map
