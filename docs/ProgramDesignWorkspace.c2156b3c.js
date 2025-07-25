function e(e, t, a, s) {
  Object.defineProperty(e, t, {
    get: a,
    set: s,
    enumerable: !0,
    configurable: !0,
  });
}
var t = globalThis,
  a = {},
  s = {},
  n = t.parcelRequire66c8;
null == n &&
  (((n = function (e) {
    if (e in a) return a[e].exports;
    if (e in s) {
      var t = s[e];
      delete s[e];
      var n = { id: e, exports: {} };
      return (a[e] = n), t.call(n.exports, n, n.exports), n.exports;
    }
    var o = Error("Cannot find module '" + e + "'");
    throw ((o.code = "MODULE_NOT_FOUND"), o);
  }).register = function (e, t) {
    s[e] = t;
  }),
  (t.parcelRequire66c8 = n));
var o = n.register;
o("e8wst", function (t, a) {
  e(t.exports, "initChart", () => i),
    e(t.exports, "updateChart", () => l),
    e(t.exports, "addVolumeLandmarks", () => m),
    e(t.exports, "exportChartImage", () => u),
    e(t.exports, "resetChart", () => c);
  var s = n("gBc5V");
  let o = null,
    r = Object.keys(s.default.volumeLandmarks);
  function i() {
    let e = document.getElementById("weeklyChart");
    if (!e) return console.error("Chart canvas not found"), null;
    let t = e.getContext("2d");
    if (!t) return console.error("Cannot get canvas context"), null;
    if ("undefined" == typeof Chart)
      return console.error("Chart.js not loaded"), null;
    let a = r.map((e) => s.default.currentWeekSets[e] || 0),
      n = r.map((e) => s.default.getVolumeColor(e));
    return (o = new Chart(t, {
      type: "bar",
      data: {
        labels: r,
        datasets: [
          {
            label: "Current Sets",
            data: a,
            backgroundColor: n,
            borderColor: n.map((e) => e.replace("0.6", "1")),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: !0,
        maintainAspectRatio: !1,
        plugins: {
          legend: { labels: { color: "#fff" } },
          tooltip: {
            callbacks: {
              afterLabel: function (e) {
                let t = e.label,
                  a = e.parsed.y,
                  n = s.default.volumeLandmarks[t],
                  o = s.default.getVolumeStatus(t, a);
                return [
                  `Status: ${o}`,
                  `MEV: ${n.MEV} | MRV: ${n.MRV}`,
                  `Target RIR: ${s.default.getTargetRIR()}`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: !0,
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: { color: "#fff" },
          },
          x: {
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: { color: "#fff" },
          },
        },
      },
    }));
  }
  function l() {
    if (!o) return;
    let e = r.map((e) => s.default.currentWeekSets[e] || 0),
      t = r.map((e) => s.default.getVolumeColor(e));
    (o.data.datasets[0].data = e),
      (o.data.datasets[0].backgroundColor = t),
      (o.data.datasets[0].borderColor = t.map((e) => e.replace("0.6", "1"))),
      o.update();
  }
  function m() {
    o &&
      (o.data.datasets.push({
        label: "MEV",
        data: r.map((e) => s.default.volumeLandmarks[e].MEV),
        type: "line",
        borderColor: "rgba(255, 255, 0, 0.8)",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [5, 5],
      }),
      o.data.datasets.push({
        label: "MRV",
        data: r.map((e) => s.default.volumeLandmarks[e].MRV),
        type: "line",
        borderColor: "rgba(255, 0, 0, 0.8)",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [10, 5],
      }),
      o.update());
  }
  function u() {
    if (!o) return null;
    try {
      return o.toBase64Image();
    } catch (e) {
      return console.warn("Chart image export failed:", e), null;
    }
  }
  function c() {
    r.forEach((e) => {
      s.default.updateWeeklySets(e, s.default.volumeLandmarks[e].MEV);
    }),
      l();
  }
}),
  o("gBc5V", function (t, a) {
    e(t.exports, "default", () => o);
    class s {
      constructor() {
        if (s.instance) return s.instance;
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
          Object.keys(this.volumeLandmarks).forEach((e) => {
            (this.currentWeekSets[e] = this.volumeLandmarks[e].MEV),
              (this.lastWeekSets[e] = this.volumeLandmarks[e].MEV);
          }),
          (this.consecutiveMRVWeeks = 0),
          (this.recoverySessionsThisWeek = 0),
          (this.totalMusclesNeedingRecovery = 0),
          (s.instance = this),
          this.loadState();
      }
      getTargetRIR() {
        return Math.max(
          0.5,
          Math.min(3, 3 - (2.5 / (this.mesoLen - 1)) * (this.weekNo - 1)),
        );
      }
      getVolumeStatus(e, t = null) {
        let a = null !== t ? t : this.currentWeekSets[e],
          s = this.volumeLandmarks[e];
        return a < s.MV
          ? "under-minimum"
          : a < s.MEV
            ? "maintenance"
            : a < s.MAV
              ? "optimal"
              : a < s.MRV
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
          !!(this.totalMusclesNeedingRecovery >= Math.ceil(e / 2)) ||
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
            ((this.weekNo = 1), this.blockNo++, (this.consecutiveMRVWeeks = 0)),
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
      updateVolumeLandmarks(e, t) {
        (this.volumeLandmarks[e] = { ...this.volumeLandmarks[e], ...t }),
          this.saveState();
      }
      getRecoveryVolume(e, t = !1) {
        let a = this.volumeLandmarks[e];
        return Math.max(
          Math.round((a.MEV + a.MRV) / 2) - (t ? 2 : 1),
          Math.ceil(0.5 * a.MEV),
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
          let a = `week-1-${e}`,
            s = localStorage.getItem(a);
          s &&
            ((this.currentWeekSets[e] = parseInt(s, 10)),
            localStorage.removeItem(a),
            (t = !0));
          let n = `${e}-MEV`,
            o = `${e}-MRV`,
            r = localStorage.getItem(n),
            i = localStorage.getItem(o);
          (r || i) &&
            ((this.volumeLandmarks[e] = {
              ...this.volumeLandmarks[e],
              MEV: r ? parseInt(r, 10) : this.volumeLandmarks[e].MEV,
              MRV: i ? parseInt(i, 10) : this.volumeLandmarks[e].MRV,
            }),
            r && localStorage.removeItem(n),
            i && localStorage.removeItem(o),
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
    let n = new s();
    var o = n;
    "undefined" != typeof window && (window.trainingState = n);
  }),
  o("jlKM8", function (t, a) {
    e(t.exports, "scoreStimulus", () => o),
      e(t.exports, "setProgressionAlgorithm", () => r),
      e(t.exports, "analyzeVolumeStatus", () => i),
      e(t.exports, "validateVolumeInput", () => l),
      e(t.exports, "getVolumeProgression", () => m),
      e(t.exports, "analyzeDeloadNeed", () => u);
    var s = n("gBc5V");
    function o({ mmc: e, pump: t, disruption: a }) {
      let s,
        n,
        o,
        r = (e, t, a) => Math.max(t, Math.min(a, e)),
        i = r(e, 0, 3),
        l = r(t, 0, 3),
        m = r(a, 0, 3),
        u = i + l + m;
      return (
        u <= 3
          ? ((s = `Stimulus too low (${u}/9) \u{2192} Add 2 sets next session`),
            (n = "add_sets"),
            (o = 2))
          : u <= 6
            ? ((s = `Stimulus adequate (${u}/9) \u{2192} Keep sets the same`),
              (n = "maintain"),
              (o = 0))
            : ((s = `Stimulus excessive (${u}/9) \u{2192} Remove 1-2 sets next session`),
              (n = "reduce_sets"),
              (o = -1)),
        {
          score: u,
          advice: s,
          action: n,
          setChange: o,
          breakdown: { mmc: i, pump: l, disruption: m },
        }
      );
    }
    function r(e, t) {
      let a = (e, t, a) => Math.max(t, Math.min(a, e)),
        s = a(e, 0, 3),
        n = a(t, 0, 3);
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
          { advice: "Do recovery session", action: "recovery", setChange: -99 },
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
          { advice: "Do recovery session", action: "recovery", setChange: -99 },
          { advice: "Do recovery session", action: "recovery", setChange: -99 },
          { advice: "Do recovery session", action: "recovery", setChange: -99 },
          {
            advice: "Hold sets at current level",
            action: "maintain",
            setChange: 0,
          },
        ],
      ][s][n];
    }
    function i(e, t = null) {
      let a = null !== t ? t : s.default.currentWeekSets[e],
        n = s.default.volumeLandmarks[e];
      if (!n) throw Error(`Unknown muscle group: ${e}`);
      let o = s.default.getVolumeStatus(e, a),
        r = (a / n.MRV) * 100,
        l = "",
        m = "normal";
      switch (o) {
        case "under-minimum":
          (l = `Below MV (${n.MV}). Increase volume significantly.`),
            (m = "high");
          break;
        case "maintenance":
          (l = `In maintenance zone (${n.MV}-${n.MEV}). Consider increasing for growth.`),
            (m = "low");
          break;
        case "optimal":
          (l = `In optimal zone (${n.MEV}-${n.MAV}). Continue progressive overload.`),
            (m = "normal");
          break;
        case "high":
          (l = `High volume zone (${n.MAV}-${n.MRV}). Monitor recovery closely.`),
            (m = "medium");
          break;
        case "maximum":
          (l = `At/above MRV (${n.MRV}). Deload recommended.`), (m = "high");
      }
      return {
        muscle: e,
        currentSets: a,
        landmarks: n,
        status: o,
        percentage: Math.round(r),
        recommendation: l,
        urgency: m,
        color: s.default.getVolumeColor(e, a),
      };
    }
    function l(e, t) {
      let a = s.default.volumeLandmarks[e],
        n = t >= 0 && t <= 1.2 * a.MRV,
        o = "";
      return (
        t < 0
          ? (o = "Sets cannot be negative")
          : t > a.MRV
            ? (o = `Above MRV (${a.MRV}). Consider deload.`)
            : t < a.MV &&
              (o = `Below MV (${a.MV}). May not be sufficient for adaptation.`),
        { isValid: n, warning: o, proposedSets: t, landmarks: a }
      );
    }
    function m(e, t) {
      let a = s.default.currentWeekSets[e],
        n = i(e),
        l = o(t.stimulus),
        m = r(t.soreness, t.performance),
        u = m.setChange,
        c = m.advice;
      if (
        ("maximum" === n.status &&
          u > 0 &&
          ((u = 0), (c = "At MRV limit. Hold sets or consider deload.")),
        "under-minimum" === n.status &&
          u <= 0 &&
          ((u = 2),
          (c = "Below minimum volume. Add sets regardless of fatigue.")),
        "recovery" === m.action)
      ) {
        let n = (function (e, t = !1) {
          let a = s.default.volumeLandmarks[e],
            n = s.default.getRecoveryVolume(e, t);
          return {
            muscle: e,
            recommendedSets: n,
            reasoning: t ? "illness adjustment" : "standard recovery",
            landmarks: a,
            percentage: Math.round((n / a.MEV) * 100),
          };
        })(e, t.hasIllness);
        (u = n.recommendedSets - a),
          (c = `Recovery session: ${n.recommendedSets} sets (${n.reasoning})`);
      }
      let d = Math.max(0, a + u);
      return {
        muscle: e,
        currentSets: a,
        projectedSets: d,
        setChange: u,
        advice: c,
        stimulusScore: l.score,
        volumeStatus: n.status,
        targetRIR: s.default.getTargetRIR(),
        deloadRecommended: s.default.shouldDeload(),
      };
    }
    function u() {
      let e = Object.keys(s.default.volumeLandmarks),
        t = e.filter((e) => "maximum" === s.default.getVolumeStatus(e)),
        a = s.default.shouldDeload(),
        n = [];
      return (
        s.default.consecutiveMRVWeeks >= 2 &&
          n.push("Two consecutive weeks at MRV"),
        s.default.totalMusclesNeedingRecovery >= Math.ceil(e.length / 2) &&
          n.push("Most muscles need recovery sessions"),
        s.default.weekNo >= s.default.mesoLen &&
          n.push("End of mesocycle reached"),
        t.length >= Math.ceil(e.length / 3) &&
          n.push(`${t.length} muscle groups at/above MRV`),
        {
          shouldDeload: a,
          reasons: n,
          mrvBreaches: t,
          consecutiveMRVWeeks: s.default.consecutiveMRVWeeks,
          currentWeek: s.default.weekNo,
          mesoLength: s.default.mesoLen,
          musclesNeedingRecovery: s.default.totalMusclesNeedingRecovery,
        }
      );
    }
  }),
  o("9Ev1P", function (t, a) {
    e(t.exports, "calculateTargetRIR", () => o),
      e(t.exports, "validateEffortLevel", () => r);
    var s = n("gBc5V");
    function o(e = null, t = null, a = 3, n = 0.5) {
      let r = e || s.default.weekNo,
        i = t || s.default.mesoLen;
      if (r > i)
        return {
          targetRIR: a,
          warning: "Week exceeds mesocycle length",
          progression: 0,
        };
      let l = Math.max(n, Math.min(a, a - ((a - n) / (i - 1)) * (r - 1))),
        m = "moderate",
        u = "";
      return (
        l >= 2.5
          ? ((m = "low"), (u = "Focus on form and mind-muscle connection"))
          : l >= 2
            ? ((m = "moderate"),
              (u = "Balanced effort - challenge without excessive fatigue"))
            : l >= 1
              ? ((m = "high"), (u = "High effort - monitor recovery closely"))
              : ((m = "maximum"), (u = "Maximum effort - deload approaching")),
        {
          targetRIR: Math.round(2 * l) / 2,
          intensityLevel: m,
          advice: u,
          progression: Math.round(((r - 1) / (i - 1)) * 100),
          week: r,
          mesoLength: i,
        }
      );
    }
    function r(e, t = null, a = 1) {
      let n = t || s.default.getTargetRIR(),
        o = Math.abs(e - n),
        i = o <= a,
        l = "",
        m = "",
        u = "normal";
      if (i)
        (l = `On target (${e} vs ${n} RIR)`),
          (m = "Continue current effort level"),
          (u = "normal");
      else if (e > n) {
        let t = e - n;
        (l = `Too easy (${t} RIR above target)`),
          (m =
            t > 2
              ? "Increase weight significantly"
              : "Increase weight moderately"),
          (u = t > 2 ? "high" : "medium");
      } else {
        let t = n - e;
        (l = `Too hard (${t} RIR below target)`),
          (m =
            t > 2 ? "Reduce weight significantly" : "Reduce weight slightly"),
          (u = t > 2 ? "high" : "medium");
      }
      return {
        actualRIR: e,
        targetRIR: n,
        deviation: o,
        isWithinTolerance: i,
        feedback: l,
        recommendation: m,
        urgency: u,
      };
    }
  }),
  o("76QZC", function (t, a) {
    e(t.exports, "analyzeFrequency", () => o),
      e(t.exports, "calculateOptimalFrequency", () => r);
    var s = n("gBc5V");
    function o(e, t, a = null) {
      let n = Math.max(0, e),
        r = Math.max(1, t),
        i = "",
        l = "",
        m = "normal",
        u = 0,
        c = n / r;
      if (
        (c < 0.7
          ? ((i = "You heal early → Add one session per week"),
            (l = "increase_frequency"),
            (u = 1),
            (m = "medium"))
          : c > 1.3
            ? ((i = "Recovery lags → Insert an extra rest day"),
              (l = "decrease_frequency"),
              (u = -1),
              (m = "high"))
            : ((i = "Frequency is optimal"),
              (l = "maintain"),
              (u = 0),
              (m = "normal")),
        a)
      ) {
        let e = s.default.getVolumeStatus(a);
        "maximum" === e &&
          "increase_frequency" === l &&
          ((i = "At MRV - maintain frequency despite early recovery"),
          (l = "maintain"),
          (u = 0)),
          "under-minimum" === e &&
            "decrease_frequency" === l &&
            ((i =
              "Below MV - consider recovery methods instead of reducing frequency"),
            (l = "improve_recovery"),
            (u = 0));
      }
      return {
        sorenessRecoveryDays: n,
        currentSessionGap: r,
        recoveryRatio: Math.round(100 * c) / 100,
        recommendation: i,
        action: l,
        frequencyAdjustment: u,
        urgency: m,
        muscle: a,
      };
    }
    function r(e, t = {}) {
      let {
          availableDays: a = 6,
          currentVolume: n = null,
          recoveryCapacity: o = "normal",
          trainingAge: i = "intermediate",
        } = t,
        l = n || s.default.currentWeekSets[e],
        m = s.default.volumeLandmarks[e],
        u = {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 2, max: 4 },
          advanced: { min: 3, max: 5 },
        }[i],
        c = 2,
        d = Math.round(
          (c =
            l >= m.MAV
              ? Math.min(4, Math.ceil(l / 6))
              : l >= m.MEV
                ? Math.min(3, Math.ceil(l / 8))
                : Math.max(2, Math.ceil(l / 10))) *
            { low: 0.8, normal: 1, high: 1.2 }[o],
        ),
        h = Math.max(u.min, Math.min(u.max, d, a)),
        g = Math.ceil(l / h);
      return {
        muscle: e,
        recommendedFrequency: h,
        setsPerSession: g,
        totalVolume: l,
        reasoning: [
          `${l} weekly sets`,
          `${o} recovery capacity`,
          `${i} training age`,
          `${a} available days`,
        ],
        alternatives: {
          conservative: Math.max(2, h - 1),
          aggressive: Math.min(a, h + 1),
        },
      };
    }
  }),
  o("b3qqF", function (t, a) {
    function s(e, t = "hypertrophy") {
      let a = parseFloat(e);
      if (isNaN(a) || a <= 0)
        return {
          isValid: !1,
          warning: "Load must be a positive number",
          recommendation: "Enter a valid load percentage",
        };
      let n = {
          hypertrophy: { min: 30, max: 85, optimal: [65, 80] },
          strength: { min: 70, max: 100, optimal: [85, 95] },
          power: { min: 30, max: 70, optimal: [40, 60] },
          endurance: { min: 20, max: 60, optimal: [30, 50] },
        },
        o = n[t] || n.hypertrophy,
        r = !0,
        i = "",
        l = "",
        m = "normal";
      return (
        a < o.min
          ? ((r = !1),
            (i = `Load too light for ${t} (${a}% < ${o.min}%)`),
            (l = `Increase to ${o.optimal[0]}-${o.optimal[1]}% for optimal ${t} adaptations`),
            (m = "high"))
          : a > o.max
            ? ((r = !1),
              (i = `Load too heavy for ${t} (${a}% > ${o.max}%)`),
              (l = `Reduce to ${o.optimal[0]}-${o.optimal[1]}% for safer ${t} training`),
              (m = "high"))
            : a < o.optimal[0]
              ? ((i = `Load is light for ${t} (${a}% < ${o.optimal[0]}%)`),
                (l = `Consider increasing to ${o.optimal[0]}-${o.optimal[1]}% for better stimulus`),
                (m = "medium"))
              : a > o.optimal[1]
                ? ((i = `Load is heavy for ${t} (${a}% > ${o.optimal[1]}%)`),
                  (l = `Consider reducing to ${o.optimal[0]}-${o.optimal[1]}% for better recovery`),
                  (m = "medium"))
                : (l = `Good load for ${t} training`),
        {
          isValid: r,
          load: a,
          context: t,
          warning: i,
          recommendation: l,
          severity: m,
          range: o,
          isOptimal: a >= o.optimal[0] && a <= o.optimal[1],
        }
      );
    }
    function n(e, t, a = !1) {
      let s = parseInt(e, 10);
      if (isNaN(s) || s < 0)
        return {
          isValid: !1,
          warning: "Set count must be 0 or greater",
          recommendation: "Enter a valid number of sets",
        };
      let { MV: o = 0, MEV: r, MAV: i, MRV: l } = t,
        m = !0,
        u = "",
        c = "",
        d = "normal",
        h = "";
      return (
        s < o
          ? ((h = "below-maintenance"),
            (u = `Below maintenance volume (${s} < ${o})`),
            (c = "Increase sets for minimal stimulus"),
            (d = "high"))
          : s < r
            ? ((h = "maintenance"),
              (u = `In maintenance zone (${s} < ${r})`),
              (c = "Increase sets for growth stimulus"),
              (d = "medium"))
            : s <= i
              ? ((h = "optimal"), (c = `Optimal volume zone (${r}-${i} sets)`))
              : s <= l
                ? ((h = "high"),
                  (u = `High volume zone (${s} approaching ${l})`),
                  (c = "Monitor recovery closely"),
                  (d = "medium"))
                : ((h = "maximum"),
                  a
                    ? ((u = `Overreaching territory (${s} > ${l})`),
                      (c = "Short-term only - deload soon"))
                    : ((m = !1),
                      (u = `Above maximum recoverable volume (${s} > ${l})`),
                      (c = "Reduce sets or plan deload")),
                  (d = "high")),
        {
          isValid: m,
          sets: s,
          landmarks: t,
          zone: h,
          warning: u,
          recommendation: c,
          severity: d,
          percentage: Math.round((s / l) * 100),
        }
      );
    }
    function o(e, t = "hypertrophy") {
      let a = parseInt(e, 10);
      if (isNaN(a) || a < 1)
        return {
          isValid: !1,
          warning: "Mesocycle must be at least 1 week",
          recommendation: "Enter a valid mesocycle length",
        };
      let s = {
          hypertrophy: { min: 3, max: 6, optimal: 4 },
          strength: { min: 2, max: 8, optimal: 4 },
          power: { min: 2, max: 4, optimal: 3 },
          endurance: { min: 4, max: 12, optimal: 6 },
        },
        n = s[t] || s.hypertrophy,
        r = "",
        i = "",
        l = "normal";
      return (
        a < n.min
          ? ((r = `Short mesocycle for ${t} (${a} < ${n.min} weeks)`),
            (i = `Consider ${n.optimal} weeks for better ${t} adaptations`),
            (l = "medium"))
          : a > n.max
            ? ((r = `Long mesocycle for ${t} (${a} > ${n.max} weeks)`),
              (i = `Consider ${n.optimal} weeks to prevent overreaching`),
              (l = "medium"))
            : (i =
                a === n.optimal
                  ? `Optimal length for ${t} training`
                  : `Good length for ${t} training`),
        {
          isValid: !0,
          weeks: a,
          goal: t,
          warning: r,
          recommendation: i,
          severity: l,
          isOptimal: a === n.optimal,
          range: n,
        }
      );
    }
    e(t.exports, "validateLoad", () => s),
      e(t.exports, "validateSets", () => n),
      e(t.exports, "validateMesocycleLength", () => o);
  });
//# sourceMappingURL=ProgramDesignWorkspace.c2156b3c.js.map
