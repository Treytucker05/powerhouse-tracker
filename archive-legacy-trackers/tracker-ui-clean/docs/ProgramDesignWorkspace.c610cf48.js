!(function (e, t, a, r, o, n, i, s) {
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
    u = "function" == typeof l[r] && l[r],
    d = u.i || {},
    c = u.cache || {},
    h =
      "undefined" != typeof module &&
      "function" == typeof module.require &&
      module.require.bind(module);
  function f(t, a) {
    if (!c[t]) {
      if (!e[t]) {
        if (o[t]) return o[t];
        var n = "function" == typeof l[r] && l[r];
        if (!a && n) return n(t, !0);
        if (u) return u(t, !0);
        if (h && "string" == typeof t) return h(t);
        var i = Error("Cannot find module '" + t + "'");
        throw ((i.code = "MODULE_NOT_FOUND"), i);
      }
      (d.resolve = function (a) {
        var r = e[t][1][a];
        return null != r ? r : a;
      }),
        (d.cache = {});
      var s = (c[t] = new f.Module(t));
      e[t][0].call(s.exports, d, s, s.exports, l);
    }
    return c[t].exports;
    function d(e) {
      var t = d.resolve(e);
      return !1 === t ? {} : f(t);
    }
  }
  (f.isParcelRequire = !0),
    (f.Module = function (e) {
      (this.id = e), (this.bundle = f), (this.require = h), (this.exports = {});
    }),
    (f.modules = e),
    (f.cache = c),
    (f.parent = u),
    (f.distDir = void 0),
    (f.publicUrl = void 0),
    (f.devServer = void 0),
    (f.i = d),
    (f.register = function (t, a) {
      e[t] = [
        function (e, t) {
          t.exports = a;
        },
        {},
      ];
    }),
    Object.defineProperty(f, "root", {
      get: function () {
        return l[r];
      },
    }),
    (l[r] = f);
  for (var m = 0; m < t.length; m++) f(t[m]);
})(
  {
    hZYkR: [
      function (e, t, a, r) {
        var o = e("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(a),
          o.export(a, "calculateTargetRIR", () => l),
          o.export(a, "validateEffortLevel", () => d),
          o.export(a, "getEffortProgression", () => c),
          o.export(a, "getWeeklyEffortSummary", () => g),
          o.export(a, "getAutoregulationAdvice", () => m),
          o.export(a, "getScheduledRIR", () => u),
          o.export(a, "processWeeklyLoadAdjustments", () => h),
          o.export(a, "getLoadProgression", () => f),
          o.export(a, "simulateWeeklyRIRFeedback", () => p);
        var n = e("../core/trainingState.js"),
          i = o.interopDefault(n);
        let s = {
          4: [3, 2, 1, 0],
          5: [3, 2.5, 2, 1, 0],
          6: [3, 2.5, 2, 1.5, 1, 0],
        };
        function l(e = null, t = null, a = 3, r = 0.5) {
          let o = e || i.default.weekNo,
            n = t || i.default.mesoLen;
          if (o > n)
            return {
              targetRIR: a,
              warning: "Week exceeds mesocycle length",
              progression: 0,
            };
          let s = Math.max(r, Math.min(a, a - ((a - r) / (n - 1)) * (o - 1))),
            u = "moderate",
            d = "";
          return (
            s >= 2.5
              ? ((u = "low"), (d = "Focus on form and mind-muscle connection"))
              : s >= 2
                ? ((u = "moderate"),
                  (d = "Balanced effort - challenge without excessive fatigue"))
                : s >= 1
                  ? ((u = "high"),
                    (d = "High effort - monitor recovery closely"))
                  : ((u = "maximum"),
                    (d = "Maximum effort - deload approaching")),
            {
              targetRIR: Math.round(2 * s) / 2,
              intensityLevel: u,
              advice: d,
              progression: Math.round(((o - 1) / (n - 1)) * 100),
              week: o,
              mesoLength: n,
            }
          );
        }
        function u(e, t) {
          let a = s[t];
          if (!a) return Math.max(0, 3 - (3 / (t - 1)) * (e - 1));
          let r = Math.min(e - 1, a.length - 1);
          return a[r];
        }
        function d(e, t = null, a = 1) {
          let r = t || i.default.getTargetRIR(),
            o = Math.abs(e - r),
            n = o <= a,
            s = "",
            l = "",
            u = "normal";
          if (n)
            (s = `On target (${e} vs ${r} RIR)`),
              (l = "Continue current effort level"),
              (u = "normal");
          else if (e > r) {
            let t = e - r;
            (s = `Too easy (${t} RIR above target)`),
              (l =
                t > 2
                  ? "Increase weight significantly"
                  : "Increase weight moderately"),
              (u = t > 2 ? "high" : "medium");
          } else {
            let t = r - e;
            (s = `Too hard (${t} RIR below target)`),
              (l =
                t > 2
                  ? "Reduce weight significantly"
                  : "Reduce weight slightly"),
              (u = t > 2 ? "high" : "medium");
          }
          return {
            actualRIR: e,
            targetRIR: r,
            deviation: o,
            isWithinTolerance: n,
            feedback: s,
            recommendation: l,
            urgency: u,
          };
        }
        function c(e, t) {
          let a = i.default.getTargetRIR(),
            r = i.default.getVolumeStatus(e),
            o = "maintain",
            n = 0,
            s = "";
          t.actualRIR < t.targetRIR - 1.5
            ? ((o = "decrease"),
              (n = 0.5),
              (s = "Reduce weight to hit target RIR"))
            : t.actualRIR > t.targetRIR + 1.5
              ? ((o = "increase"),
                (n = -0.5),
                (s = "Increase weight to hit target RIR"))
              : (s =
                  "maximum" === r
                    ? "Maintain weight - at volume limit"
                    : "Good effort level - continue progression"),
            "maximum" === r &&
              "increase" === o &&
              ((o = "maintain"),
              (s = "At MRV - avoid adding intensity stress"));
          let l = Math.max(0, a + n);
          return {
            muscle: e,
            currentTargetRIR: a,
            projectedRIR: l,
            weightRecommendation: o,
            advice: s,
            volumeStatus: r,
          };
        }
        function h(e) {
          let t = i.default.weekNo,
            a = u(t, i.default.mesoLen),
            r = {},
            o = 0;
          return (
            Object.keys(e).forEach((t) => {
              let n = e[t],
                i = n.averageRIR || a,
                s = i - a,
                l = 0,
                u = "";
              0.5 >= Math.abs(s)
                ? ((l = 2.5), (u = "On target - progressive overload"))
                : s > 0.5
                  ? s > 2
                    ? ((l = 10), (u = "Too easy - major increase needed"))
                    : s > 1
                      ? ((l = 7.5), (u = "Too easy - moderate increase"))
                      : ((l = 5), (u = "Slightly easy - small increase"))
                  : s < -2
                    ? ((l = -10), (u = "Too hard - major decrease needed"))
                    : s < -1
                      ? ((l = -5), (u = "Too hard - moderate decrease"))
                      : ((l = -2.5), (u = "Slightly hard - small decrease"));
              let d = n.performanceTrend || 0;
              d < 0
                ? ((l -= 2.5), (u += " (performance declining)"))
                : d > 0 &&
                  s >= 0 &&
                  ((l += 2.5), (u += " (performance improving)")),
                (l = Math.max(-15, Math.min(15, l))),
                (r[t] = {
                  currentRIR: i,
                  targetRIR: a,
                  deviation: s,
                  loadAdjustment: l,
                  reason: u,
                  urgency:
                    Math.abs(s) > 1.5
                      ? "high"
                      : Math.abs(s) > 1
                        ? "medium"
                        : "low",
                }),
                Math.abs(l) > 2.5 && o++;
            }),
            {
              week: t,
              targetRIR: a,
              adjustments: r,
              summary: {
                totalMuscles: Object.keys(e).length,
                musclesAdjusted: o,
                avgLoadChange:
                  Object.values(r).reduce((e, t) => e + t.loadAdjustment, 0) /
                  Object.keys(r).length,
              },
            }
          );
        }
        function f(e, t = {}) {
          let a = i.default.weekNo,
            r = a + 1,
            o = u(a, i.default.mesoLen),
            n = u(r, i.default.mesoLen),
            s = o - n,
            l = (t.averageRIR || o) - o,
            d = 0,
            c = "";
          if (s > 0) {
            let e = 5 * s;
            l > 1
              ? ((d = e + 5),
                (c = `Increase load ${d.toFixed(1)}% for Week ${r} (RIR ${n}) - currently too easy`))
              : l < -1
                ? ((d = 0.5 * e),
                  (c = `Conservative increase ${d.toFixed(1)}% for Week ${r} (RIR ${n}) - struggling with current load`))
                : ((d = e),
                  (c = `Standard increase ${d.toFixed(1)}% for Week ${r} (RIR ${n})`));
          } else
            0 === s
              ? ((d = 2.5),
                (c = `Small progressive overload ${d.toFixed(1)}% for Week ${r} (RIR ${n})`))
              : ((d = 0),
                (c = `Maintain current load for Week ${r} (RIR ${n})`));
          let h = i.default.getVolumeStatus(e);
          return (
            "maximum" === h && ((d *= 0.75), (c += " (reduced due to MRV)")),
            {
              muscle: e,
              currentWeek: a,
              nextWeek: r,
              currentRIR: o,
              nextRIR: n,
              rirDrop: s,
              loadIncrease: Math.round(10 * d) / 10,
              recommendation: c,
              volumeStatus: h,
            }
          );
        }
        function m(e) {
          let {
              actualRIR: t,
              plannedRIR: a,
              setNumber: r,
              totalPlannedSets: o,
              muscle: n,
            } = e,
            i = t - a,
            s = "",
            l = "continue",
            u = 0;
          return (
            r <= Math.ceil(o / 3)
              ? i > 1.5
                ? ((s = "Weight too light - increase by 5-10%"),
                  (l = "increase_weight"),
                  (u = 7.5))
                : i < -1.5
                  ? ((s = "Weight too heavy - decrease by 5-10%"),
                    (l = "decrease_weight"),
                    (u = -7.5))
                  : (s = "Weight appropriate - continue")
              : r <= Math.ceil((2 * o) / 3)
                ? i > 2
                  ? ((s = "Still too easy - increase weight"),
                    (l = "increase_weight"),
                    (u = 5))
                  : i < -2
                    ? ((s = "Too fatiguing - consider stopping early"),
                      (l = "consider_stopping"),
                      (u = 0))
                    : (s = "Good progression - continue")
                : i < -1
                  ? ((s =
                      "Very fatiguing - consider stopping to preserve recovery"),
                    (l = "consider_stopping"))
                  : i > 2
                    ? ((s =
                        "Could push harder - add 1-2 sets if recovering well"),
                      (l = "consider_adding_sets"))
                    : (s = "Appropriate fatigue for final sets"),
            {
              setNumber: r,
              totalPlannedSets: o,
              actualRIR: t,
              plannedRIR: a,
              deviation: i,
              advice: s,
              action: l,
              weightAdjustment: u,
            }
          );
        }
        function g() {
          let e = i.default.weekNo,
            t = i.default.mesoLen,
            a = i.default.getTargetRIR(),
            r = [];
          return (
            1 === e
              ? (r.push("Focus on technique and mind-muscle connection"),
                r.push("Establish baseline weights for the mesocycle"))
              : e === t
                ? (r.push("Peak intensity week - push close to failure"),
                  r.push("Prepare for upcoming deload"))
                : e > 0.75 * t
                  ? (r.push("High intensity phase - monitor recovery closely"),
                    r.push("Focus on performance over volume additions"))
                  : (r.push(
                      "Progressive overload phase - gradually increase demands",
                    ),
                    r.push("Balance volume and intensity progression")),
            {
              currentWeek: e,
              mesoLength: t,
              targetRIR: a,
              weeklyAdvice: r,
              phaseDescription: (function (e, t) {
                let a = (e / t) * 100;
                return a <= 25
                  ? "Accumulation Phase - Building foundation"
                  : a <= 60
                    ? "Progression Phase - Steady overload"
                    : a <= 85
                      ? "Intensification Phase - High demands"
                      : "Peak Phase - Maximum effort";
              })(e, t),
            }
          );
        }
        function p(e, t) {
          let a = u(t, i.default.mesoLen),
            r = {};
          return (
            e.forEach((e) => {
              let o = i.default.getVolumeStatus(e),
                n = 0,
                s = Math.max(
                  0,
                  a +
                    ("maximum" === o
                      ? 1.5 * Math.random() - 0.5
                      : t <= 2
                        ? 1.5 * Math.random() + 0.5
                        : t >= i.default.mesoLen - 1
                          ? 1.5 * Math.random() - 1
                          : 2 * Math.random() - 1),
                ),
                l = 0,
                u = 0,
                d = 100,
                c = 1;
              "maximum" === o
                ? ((l = Math.floor(3 * Math.random()) + 1),
                  (u = Math.random() > 0.6 ? -1 : 0),
                  (d = 0.95 * i.default.baselineStrength[e]),
                  (c = Math.floor(2 * Math.random()) + 2))
                : "high" === o
                  ? ((l = Math.floor(2 * Math.random())),
                    (u =
                      Math.random() > 0.8 ? -1 : Math.random() > 0.5 ? 0 : 1),
                    (d = 0.98 * i.default.baselineStrength[e]),
                    (c = Math.floor(2 * Math.random()) + 1))
                  : ((l = Math.floor(2 * Math.random())),
                    (u = +(Math.random() > 0.7)),
                    (d = 1.02 * i.default.baselineStrength[e]),
                    (c = Math.floor(2 * Math.random()))),
                (r[e] = {
                  actualRIR: s,
                  targetRIR: a,
                  averageRIR: Math.round(10 * s) / 10,
                  performanceTrend:
                    t > 1 && Math.random() > 0.7
                      ? Math.random() > 0.5
                        ? 1
                        : -1
                      : 0,
                  sessions: 2,
                  volumeStatus: o,
                  soreness: c,
                  jointAche: l,
                  perfChange: u,
                  lastLoad: Math.round(10 * d) / 10,
                  pump: Math.min(3, Math.floor(3 * Math.random()) + 1),
                  disruption: Math.min(3, Math.floor(3 * Math.random()) + 1),
                });
            }),
            r
          );
        }
      },
      {
        "../core/trainingState.js": "e7afj",
        "@parcel/transformer-js/src/esmodule-helpers.js": "k3151",
      },
    ],
  },
  [],
  0,
  "parcelRequire66c8",
  {},
);
//# sourceMappingURL=ProgramDesignWorkspace.c610cf48.js.map
