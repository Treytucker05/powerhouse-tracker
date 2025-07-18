function e(e, t, a, o) {
  Object.defineProperty(e, t, {
    get: a,
    set: o,
    enumerable: !0,
    configurable: !0,
  });
}
var t = globalThis,
  a = {},
  o = {},
  s = t.parcelRequire66c8;
null == s &&
  (((s = function (e) {
    if (e in a) return a[e].exports;
    if (e in o) {
      var t = o[e];
      delete o[e];
      var s = { id: e, exports: {} };
      return (a[e] = s), t.call(s.exports, s, s.exports), s.exports;
    }
    var n = Error("Cannot find module '" + e + "'");
    throw ((n.code = "MODULE_NOT_FOUND"), n);
  }).register = function (e, t) {
    o[e] = t;
  }),
  (t.parcelRequire66c8 = s));
var n = s.register;
n("e8wst", function (t, a) {
  e(t.exports, "initChart", () => i),
    e(t.exports, "updateChart", () => l),
    e(t.exports, "resetChart", () => d),
    e(t.exports, "addVolumeLandmarks", () => m),
    e(t.exports, "exportChartImage", () => u);
  var o = s("gBc5V");
  let n = null,
    r = Object.keys(o.default.volumeLandmarks);
  function i() {
    let e = document.getElementById("weeklyChart");
    if (!e) return console.error("Chart canvas not found"), null;
    let t = e.getContext("2d");
    if (!t) return console.error("Cannot get canvas context"), null;
    if ("undefined" == typeof Chart)
      return console.error("Chart.js not loaded"), null;
    let a = r.map((e) => o.default.currentWeekSets[e] || 0),
      s = r.map((e) => o.default.getVolumeColor(e));
    return (n = new Chart(t, {
      type: "bar",
      data: {
        labels: r,
        datasets: [
          {
            label: "Current Sets",
            data: a,
            backgroundColor: s,
            borderColor: s.map((e) => e.replace("0.6", "1")),
            borderWidth: 2,
          },
          {
            label: "MEV",
            data: r.map((e) => o.default.volumeLandmarks[e].MEV),
            type: "line",
            borderColor: "rgba(255, 255, 0, 0.8)",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: "rgba(255, 255, 0, 1)",
            borderDash: [5, 5],
          },
          {
            label: "MRV",
            data: r.map((e) => o.default.volumeLandmarks[e].MRV),
            type: "line",
            borderColor: "rgba(255, 0, 0, 0.8)",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: "rgba(255, 0, 0, 1)",
            borderDash: [10, 5],
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
                  s = o.default.volumeLandmarks[t],
                  n = o.default.getVolumeStatus(t, a);
                return [
                  `Status: ${n}`,
                  `MEV: ${s.MEV} | MRV: ${s.MRV}`,
                  `Target RIR: ${o.default.getTargetRIR()}`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: !0,
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: { color: "#fff", stepSize: 5 },
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
    if (!n) return;
    let e = r.map((e) => o.default.currentWeekSets[e] || 0),
      t = r.map((e) => o.default.getVolumeColor(e));
    (n.data.datasets[0].data = e),
      (n.data.datasets[0].backgroundColor = t),
      (n.data.datasets[0].borderColor = t.map((e) => e.replace("0.6", "1"))),
      (n.data.datasets[1].data = r.map(
        (e) => o.default.volumeLandmarks[e].MEV,
      )),
      (n.data.datasets[2].data = r.map(
        (e) => o.default.volumeLandmarks[e].MRV,
      )),
      n.update();
  }
  function d() {
    r.forEach((e) => {
      o.default.updateWeeklySets(e, o.default.volumeLandmarks[e].MEV);
    }),
      l();
  }
  function m() {
    n && console.log("Volume landmarks are permanently displayed on chart");
  }
  function u() {
    if (!n) return console.warn("No chart available for export"), null;
    try {
      let e = n.toBase64Image("image/png", 1),
        t = document.createElement("a");
      (t.download = `workout-volume-chart-week-${o.default.weekNo}.png`),
        (t.href = e),
        document.body.appendChild(t),
        t.click(),
        document.body.removeChild(t);
      let a = document.createElement("div");
      return (
        (a.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
    `),
        (a.textContent = "Chart exported successfully!"),
        document.body.appendChild(a),
        setTimeout(() => {
          document.body.removeChild(a);
        }, 3e3),
        e
      );
    } catch (t) {
      console.error("Chart export failed:", t);
      let e = document.createElement("div");
      return (
        (e.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
    `),
        (e.textContent = "Export failed. Please try again."),
        document.body.appendChild(e),
        setTimeout(() => {
          document.body.removeChild(e);
        }, 3e3),
        null
      );
    }
  }
}),
  n("gBc5V", function (t, a) {
    e(t.exports, "default", () => n);
    class o {
      constructor() {
        if (o.instance) return o.instance;
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
          (o.instance = this),
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
          o = this.volumeLandmarks[e];
        return a < o.MV
          ? "under-minimum"
          : a < o.MEV
            ? "maintenance"
            : a < o.MAV
              ? "optimal"
              : a < o.MRV
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
            o = localStorage.getItem(a);
          o &&
            ((this.currentWeekSets[e] = parseInt(o, 10)),
            localStorage.removeItem(a),
            (t = !0));
          let s = `${e}-MEV`,
            n = `${e}-MRV`,
            r = localStorage.getItem(s),
            i = localStorage.getItem(n);
          (r || i) &&
            ((this.volumeLandmarks[e] = {
              ...this.volumeLandmarks[e],
              MEV: r ? parseInt(r, 10) : this.volumeLandmarks[e].MEV,
              MRV: i ? parseInt(i, 10) : this.volumeLandmarks[e].MRV,
            }),
            r && localStorage.removeItem(s),
            i && localStorage.removeItem(n),
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
    let s = new o();
    var n = s;
    "undefined" != typeof window && (window.trainingState = s);
  }),
  n("jlKM8", function (t, a) {
    e(t.exports, "scoreStimulus", () => n),
      e(t.exports, "setProgressionAlgorithm", () => r),
      e(t.exports, "analyzeVolumeStatus", () => i),
      e(t.exports, "validateVolumeInput", () => l),
      e(t.exports, "getVolumeProgression", () => d),
      e(t.exports, "analyzeDeloadNeed", () => m);
    var o = s("gBc5V");
    function n({ mmc: e, pump: t, disruption: a }) {
      let o,
        s,
        n,
        r = (e, t, a) => Math.max(t, Math.min(a, e)),
        i = r(e, 0, 3),
        l = r(t, 0, 3),
        d = r(a, 0, 3),
        m = i + l + d;
      return (
        m <= 3
          ? ((o = `Stimulus too low (${m}/9) \u{2192} Add 2 sets next session`),
            (s = "add_sets"),
            (n = 2))
          : m <= 6
            ? ((o = `Stimulus adequate (${m}/9) \u{2192} Keep sets the same`),
              (s = "maintain"),
              (n = 0))
            : ((o = `Stimulus excessive (${m}/9) \u{2192} Remove 1-2 sets next session`),
              (s = "reduce_sets"),
              (n = -1)),
        {
          score: m,
          advice: o,
          action: s,
          setChange: n,
          breakdown: { mmc: i, pump: l, disruption: d },
        }
      );
    }
    function r(e, t) {
      let a = (e, t, a) => Math.max(t, Math.min(a, e)),
        o = a(e, 0, 3),
        s = a(t, 0, 3);
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
      ][o][s];
    }
    function i(e, t = null) {
      let a = null !== t ? t : o.default.currentWeekSets[e],
        s = o.default.volumeLandmarks[e];
      if (!s) throw Error(`Unknown muscle group: ${e}`);
      let n = o.default.getVolumeStatus(e, a),
        r = (a / s.MRV) * 100,
        l = "",
        d = "normal";
      switch (n) {
        case "under-minimum":
          (l = `Below MV (${s.MV}). Increase volume significantly.`),
            (d = "high");
          break;
        case "maintenance":
          (l = `In maintenance zone (${s.MV}-${s.MEV}). Consider increasing for growth.`),
            (d = "low");
          break;
        case "optimal":
          (l = `In optimal zone (${s.MEV}-${s.MAV}). Continue progressive overload.`),
            (d = "normal");
          break;
        case "high":
          (l = `High volume zone (${s.MAV}-${s.MRV}). Monitor recovery closely.`),
            (d = "medium");
          break;
        case "maximum":
          (l = `At/above MRV (${s.MRV}). Deload recommended.`), (d = "high");
      }
      return {
        muscle: e,
        currentSets: a,
        landmarks: s,
        status: n,
        percentage: Math.round(r),
        recommendation: l,
        urgency: d,
        color: o.default.getVolumeColor(e, a),
      };
    }
    function l(e, t) {
      let a = o.default.volumeLandmarks[e],
        s = t >= 0 && t <= 1.2 * a.MRV,
        n = "";
      return (
        t < 0
          ? (n = "Sets cannot be negative")
          : t > a.MRV
            ? (n = `Above MRV (${a.MRV}). Consider deload.`)
            : t < a.MV &&
              (n = `Below MV (${a.MV}). May not be sufficient for adaptation.`),
        { isValid: s, warning: n, proposedSets: t, landmarks: a }
      );
    }
    function d(e, t) {
      let a = o.default.currentWeekSets[e],
        s = i(e),
        l = n(t.stimulus),
        d = r(t.soreness, t.performance),
        m = d.setChange,
        u = d.advice;
      if (
        ("maximum" === s.status &&
          m > 0 &&
          ((m = 0), (u = "At MRV limit. Hold sets or consider deload.")),
        "under-minimum" === s.status &&
          m <= 0 &&
          ((m = 2),
          (u = "Below minimum volume. Add sets regardless of fatigue.")),
        "recovery" === d.action)
      ) {
        let s = (function (e, t = !1) {
          let a = o.default.volumeLandmarks[e],
            s = o.default.getRecoveryVolume(e, t);
          return {
            muscle: e,
            recommendedSets: s,
            reasoning: t ? "illness adjustment" : "standard recovery",
            landmarks: a,
            percentage: Math.round((s / a.MEV) * 100),
          };
        })(e, t.hasIllness);
        (m = s.recommendedSets - a),
          (u = `Recovery session: ${s.recommendedSets} sets (${s.reasoning})`);
      }
      let c = Math.max(0, a + m);
      return {
        muscle: e,
        currentSets: a,
        projectedSets: c,
        setChange: m,
        advice: u,
        stimulusScore: l.score,
        volumeStatus: s.status,
        targetRIR: o.default.getTargetRIR(),
        deloadRecommended: o.default.shouldDeload(),
      };
    }
    function m() {
      let e = Object.keys(o.default.volumeLandmarks),
        t = e.filter((e) => "maximum" === o.default.getVolumeStatus(e)),
        a = o.default.shouldDeload(),
        s = [];
      return (
        o.default.consecutiveMRVWeeks >= 2 &&
          s.push("Two consecutive weeks at MRV"),
        o.default.totalMusclesNeedingRecovery >= Math.ceil(e.length / 2) &&
          s.push("Most muscles need recovery sessions"),
        o.default.weekNo >= o.default.mesoLen &&
          s.push("End of mesocycle reached"),
        t.length >= Math.ceil(e.length / 3) &&
          s.push(`${t.length} muscle groups at/above MRV`),
        {
          shouldDeload: a,
          reasons: s,
          mrvBreaches: t,
          consecutiveMRVWeeks: o.default.consecutiveMRVWeeks,
          currentWeek: o.default.weekNo,
          mesoLength: o.default.mesoLen,
          musclesNeedingRecovery: o.default.totalMusclesNeedingRecovery,
        }
      );
    }
  }),
  n("9Ev1P", function (t, a) {
    e(t.exports, "calculateTargetRIR", () => n),
      e(t.exports, "validateEffortLevel", () => r);
    var o = s("gBc5V");
    function n(e = null, t = null, a = 3, s = 0.5) {
      let r = e || o.default.weekNo,
        i = t || o.default.mesoLen;
      if (r > i)
        return {
          targetRIR: a,
          warning: "Week exceeds mesocycle length",
          progression: 0,
        };
      let l = Math.max(s, Math.min(a, a - ((a - s) / (i - 1)) * (r - 1))),
        d = "moderate",
        m = "";
      return (
        l >= 2.5
          ? ((d = "low"), (m = "Focus on form and mind-muscle connection"))
          : l >= 2
            ? ((d = "moderate"),
              (m = "Balanced effort - challenge without excessive fatigue"))
            : l >= 1
              ? ((d = "high"), (m = "High effort - monitor recovery closely"))
              : ((d = "maximum"), (m = "Maximum effort - deload approaching")),
        {
          targetRIR: Math.round(2 * l) / 2,
          intensityLevel: d,
          advice: m,
          progression: Math.round(((r - 1) / (i - 1)) * 100),
          week: r,
          mesoLength: i,
        }
      );
    }
    function r(e, t = null, a = 1) {
      let s = t || o.default.getTargetRIR(),
        n = Math.abs(e - s),
        i = n <= a,
        l = "",
        d = "",
        m = "normal";
      if (i)
        (l = `On target (${e} vs ${s} RIR)`),
          (d = "Continue current effort level"),
          (m = "normal");
      else if (e > s) {
        let t = e - s;
        (l = `Too easy (${t} RIR above target)`),
          (d =
            t > 2
              ? "Increase weight significantly"
              : "Increase weight moderately"),
          (m = t > 2 ? "high" : "medium");
      } else {
        let t = s - e;
        (l = `Too hard (${t} RIR below target)`),
          (d =
            t > 2 ? "Reduce weight significantly" : "Reduce weight slightly"),
          (m = t > 2 ? "high" : "medium");
      }
      return {
        actualRIR: e,
        targetRIR: s,
        deviation: n,
        isWithinTolerance: i,
        feedback: l,
        recommendation: d,
        urgency: m,
      };
    }
  }),
  n("76QZC", function (t, a) {
    e(t.exports, "analyzeFrequency", () => n),
      e(t.exports, "calculateOptimalFrequency", () => r);
    var o = s("gBc5V");
    function n(e, t, a = null) {
      let s = Math.max(0, e),
        r = Math.max(1, t),
        i = "",
        l = "",
        d = "normal",
        m = 0,
        u = s / r;
      if (
        (u < 0.7
          ? ((i = "You heal early → Add one session per week"),
            (l = "increase_frequency"),
            (m = 1),
            (d = "medium"))
          : u > 1.3
            ? ((i = "Recovery lags → Insert an extra rest day"),
              (l = "decrease_frequency"),
              (m = -1),
              (d = "high"))
            : ((i = "Frequency is optimal"),
              (l = "maintain"),
              (m = 0),
              (d = "normal")),
        a)
      ) {
        let e = o.default.getVolumeStatus(a);
        "maximum" === e &&
          "increase_frequency" === l &&
          ((i = "At MRV - maintain frequency despite early recovery"),
          (l = "maintain"),
          (m = 0)),
          "under-minimum" === e &&
            "decrease_frequency" === l &&
            ((i =
              "Below MV - consider recovery methods instead of reducing frequency"),
            (l = "improve_recovery"),
            (m = 0));
      }
      return {
        sorenessRecoveryDays: s,
        currentSessionGap: r,
        recoveryRatio: Math.round(100 * u) / 100,
        recommendation: i,
        action: l,
        frequencyAdjustment: m,
        urgency: d,
        muscle: a,
      };
    }
    function r(e, t = {}) {
      let {
          availableDays: a = 6,
          currentVolume: s = null,
          recoveryCapacity: n = "normal",
          trainingAge: i = "intermediate",
        } = t,
        l = s || o.default.currentWeekSets[e],
        d = o.default.volumeLandmarks[e],
        m = {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 2, max: 4 },
          advanced: { min: 3, max: 5 },
        }[i],
        u = 2,
        c = Math.round(
          (u =
            l >= d.MAV
              ? Math.min(4, Math.ceil(l / 6))
              : l >= d.MEV
                ? Math.min(3, Math.ceil(l / 8))
                : Math.max(2, Math.ceil(l / 10))) *
            { low: 0.8, normal: 1, high: 1.2 }[n],
        ),
        h = Math.max(m.min, Math.min(m.max, c, a)),
        g = Math.ceil(l / h);
      return {
        muscle: e,
        recommendedFrequency: h,
        setsPerSession: g,
        totalVolume: l,
        reasoning: [
          `${l} weekly sets`,
          `${n} recovery capacity`,
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
  n("b3qqF", function (t, a) {
    function o(e, t = "hypertrophy") {
      let a = parseFloat(e);
      if (isNaN(a) || a <= 0)
        return {
          isValid: !1,
          warning: "Load must be a positive number",
          recommendation: "Enter a valid load percentage",
        };
      let s = {
          hypertrophy: { min: 30, max: 85, optimal: [65, 80] },
          strength: { min: 70, max: 100, optimal: [85, 95] },
          power: { min: 30, max: 70, optimal: [40, 60] },
          endurance: { min: 20, max: 60, optimal: [30, 50] },
        },
        n = s[t] || s.hypertrophy,
        r = !0,
        i = "",
        l = "",
        d = "normal";
      return (
        a < n.min
          ? ((r = !1),
            (i = `Load too light for ${t} (${a}% < ${n.min}%)`),
            (l = `Increase to ${n.optimal[0]}-${n.optimal[1]}% for optimal ${t} adaptations`),
            (d = "high"))
          : a > n.max
            ? ((r = !1),
              (i = `Load too heavy for ${t} (${a}% > ${n.max}%)`),
              (l = `Reduce to ${n.optimal[0]}-${n.optimal[1]}% for safer ${t} training`),
              (d = "high"))
            : a < n.optimal[0]
              ? ((i = `Load is light for ${t} (${a}% < ${n.optimal[0]}%)`),
                (l = `Consider increasing to ${n.optimal[0]}-${n.optimal[1]}% for better stimulus`),
                (d = "medium"))
              : a > n.optimal[1]
                ? ((i = `Load is heavy for ${t} (${a}% > ${n.optimal[1]}%)`),
                  (l = `Consider reducing to ${n.optimal[0]}-${n.optimal[1]}% for better recovery`),
                  (d = "medium"))
                : (l = `Good load for ${t} training`),
        {
          isValid: r,
          load: a,
          context: t,
          warning: i,
          recommendation: l,
          severity: d,
          range: n,
          isOptimal: a >= n.optimal[0] && a <= n.optimal[1],
        }
      );
    }
    function s(e, t, a = !1) {
      let o = parseInt(e, 10);
      if (isNaN(o) || o < 0)
        return {
          isValid: !1,
          warning: "Set count must be 0 or greater",
          recommendation: "Enter a valid number of sets",
        };
      let { MV: n = 0, MEV: r, MAV: i, MRV: l } = t,
        d = !0,
        m = "",
        u = "",
        c = "normal",
        h = "";
      return (
        o < n
          ? ((h = "below-maintenance"),
            (m = `Below maintenance volume (${o} < ${n})`),
            (u = "Increase sets for minimal stimulus"),
            (c = "high"))
          : o < r
            ? ((h = "maintenance"),
              (m = `In maintenance zone (${o} < ${r})`),
              (u = "Increase sets for growth stimulus"),
              (c = "medium"))
            : o <= i
              ? ((h = "optimal"), (u = `Optimal volume zone (${r}-${i} sets)`))
              : o <= l
                ? ((h = "high"),
                  (m = `High volume zone (${o} approaching ${l})`),
                  (u = "Monitor recovery closely"),
                  (c = "medium"))
                : ((h = "maximum"),
                  a
                    ? ((m = `Overreaching territory (${o} > ${l})`),
                      (u = "Short-term only - deload soon"))
                    : ((d = !1),
                      (m = `Above maximum recoverable volume (${o} > ${l})`),
                      (u = "Reduce sets or plan deload")),
                  (c = "high")),
        {
          isValid: d,
          sets: o,
          landmarks: t,
          zone: h,
          warning: m,
          recommendation: u,
          severity: c,
          percentage: Math.round((o / l) * 100),
        }
      );
    }
    function n(e, t = "hypertrophy") {
      let a = parseInt(e, 10);
      if (isNaN(a) || a < 1)
        return {
          isValid: !1,
          warning: "Mesocycle must be at least 1 week",
          recommendation: "Enter a valid mesocycle length",
        };
      let o = {
          hypertrophy: { min: 3, max: 6, optimal: 4 },
          strength: { min: 2, max: 8, optimal: 4 },
          power: { min: 2, max: 4, optimal: 3 },
          endurance: { min: 4, max: 12, optimal: 6 },
        },
        s = o[t] || o.hypertrophy,
        r = "",
        i = "",
        l = "normal";
      return (
        a < s.min
          ? ((r = `Short mesocycle for ${t} (${a} < ${s.min} weeks)`),
            (i = `Consider ${s.optimal} weeks for better ${t} adaptations`),
            (l = "medium"))
          : a > s.max
            ? ((r = `Long mesocycle for ${t} (${a} > ${s.max} weeks)`),
              (i = `Consider ${s.optimal} weeks to prevent overreaching`),
              (l = "medium"))
            : (i =
                a === s.optimal
                  ? `Optimal length for ${t} training`
                  : `Good length for ${t} training`),
        {
          isValid: !0,
          weeks: a,
          goal: t,
          warning: r,
          recommendation: i,
          severity: l,
          isOptimal: a === s.optimal,
          range: s,
        }
      );
    }
    e(t.exports, "validateLoad", () => o),
      e(t.exports, "validateSets", () => s),
      e(t.exports, "validateMesocycleLength", () => n);
  });
//# sourceMappingURL=ProgramDesignWorkspace.a153faa7.js.map
