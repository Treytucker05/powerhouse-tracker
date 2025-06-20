!(function (e, t, a, s, n, r, i, o) {
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
    c = "function" == typeof l[s] && l[s],
    d = c.i || {},
    u = c.cache || {},
    m =
      "undefined" != typeof module &&
      "function" == typeof module.require &&
      module.require.bind(module);
  function g(t, a) {
    if (!u[t]) {
      if (!e[t]) {
        if (n[t]) return n[t];
        var r = "function" == typeof l[s] && l[s];
        if (!a && r) return r(t, !0);
        if (c) return c(t, !0);
        if (m && "string" == typeof t) return m(t);
        var i = Error("Cannot find module '" + t + "'");
        throw ((i.code = "MODULE_NOT_FOUND"), i);
      }
      (d.resolve = function (a) {
        var s = e[t][1][a];
        return null != s ? s : a;
      }),
        (d.cache = {});
      var o = (u[t] = new g.Module(t));
      e[t][0].call(o.exports, d, o, o.exports, l);
    }
    return u[t].exports;
    function d(e) {
      var t = d.resolve(e);
      return !1 === t ? {} : g(t);
    }
  }
  (g.isParcelRequire = !0),
    (g.Module = function (e) {
      (this.id = e), (this.bundle = g), (this.require = m), (this.exports = {});
    }),
    (g.modules = e),
    (g.cache = u),
    (g.parent = c),
    (g.distDir = void 0),
    (g.publicUrl = void 0),
    (g.devServer = void 0),
    (g.i = d),
    (g.register = function (t, a) {
      e[t] = [
        function (e, t) {
          t.exports = a;
        },
        {},
      ];
    }),
    Object.defineProperty(g, "root", {
      get: function () {
        return l[s];
      },
    }),
    (l[s] = g);
  for (var h = 0; h < t.length; h++) g(t[h]);
  if (a) {
    var p = g(a);
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = p)
      : "function" == typeof define &&
        define.amd &&
        define(function () {
          return p;
        });
  }
})(
  {
    lEf4n: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js"),
          r = e("./chartManager.js"),
          i = e("../algorithms/volume.js"),
          o = e("../algorithms/effort.js"),
          l = e("../algorithms/fatigue.js"),
          c = e("../algorithms/validation.js"),
          d = e("../core/trainingState.js"),
          u = n.interopDefault(d),
          m = e("../algorithms/analytics.js"),
          g = e("../algorithms/exerciseSelection.js"),
          h = e("../algorithms/livePerformance.js"),
          p = e("../algorithms/intelligenceHub.js"),
          f = e("../algorithms/dataVisualization.js"),
          y = e("../algorithms/wellnessIntegration.js"),
          v = e("../algorithms/periodizationSystem.js"),
          b = e("../utils/dataExport.js"),
          k = e("../utils/userFeedback.js"),
          S = e("../utils/performance.js");
        (window.trainingState = u.default),
          (window.updateChart = r.updateChart),
          (window.resetWeeklyData = r.resetChart),
          (window.showVolumeLandmarks = r.addVolumeLandmarks),
          (window.exportSummary = r.exportChartImage),
          (window.toggleSection = function (e) {
            let t = document.getElementById(e + "-content"),
              a = t.previousElementSibling,
              s = a.querySelector(".expand-icon");
            function n() {
              if (!window.parent) return;
              let e = document.documentElement.getBoundingClientRect().height;
              window.parent.postMessage({ phxHeight: e }, "*");
            }
            t.classList.contains("expanded")
              ? (t.classList.remove("expanded"),
                a.classList.remove("expanded"),
                s && (s.style.transform = "rotate(0deg)"),
                t.addEventListener("transitionend", function e() {
                  (t.style.display = "none"),
                    t.removeEventListener("transitionend", e),
                    n();
                }))
              : ((t.style.display = "block"),
                requestAnimationFrame(() => {
                  t.classList.add("expanded"),
                    a.classList.add("expanded"),
                    s && (s.style.transform = "rotate(180deg)"),
                    n();
                }));
          }),
          (window.scoreStimulus = i.scoreStimulus),
          (window.setProgressionAlgorithm = i.setProgressionAlgorithm),
          (window.getVolumeProgression = i.getVolumeProgression),
          (window.analyzeDeloadNeed = i.analyzeDeloadNeed),
          (window.autoSetIncrement = i.autoSetIncrement),
          (window.processWeeklyVolumeProgression =
            i.processWeeklyVolumeProgression),
          (window.calculateTargetRIR = o.calculateTargetRIR),
          (window.validateEffortLevel = o.validateEffortLevel),
          (window.getScheduledRIR = o.getScheduledRIR),
          (window.processWeeklyLoadAdjustments =
            o.processWeeklyLoadAdjustments),
          (window.getLoadProgression = o.getLoadProgression),
          (window.simulateWeeklyRIRFeedback = o.simulateWeeklyRIRFeedback),
          (window.analyzeFrequency = l.analyzeFrequency),
          (window.calculateOptimalFrequency = l.calculateOptimalFrequency),
          (window.isHighFatigue = l.isHighFatigue),
          (window.validateLoad = c.validateLoad),
          (window.validateSets = c.validateSets),
          (window.validateMesocycleLength = c.validateMesocycleLength),
          (window.optimizeVolumeLandmarks = m.optimizeVolumeLandmarks),
          (window.predictDeloadTiming = m.predictDeloadTiming),
          (window.adaptiveRIRRecommendations = m.adaptiveRIRRecommendations),
          (window.detectTrainingPlateaus = m.detectTrainingPlateaus),
          (window.selectOptimalExercises = g.selectOptimalExercises),
          (window.generateWeeklyProgram = g.generateWeeklyProgram),
          (window.dataVisualizer = f.dataVisualizer),
          (window.wellnessSystem = y.wellnessSystem),
          (window.periodizationSystem = v.periodizationSystem),
          (window.liveMonitor = h.liveMonitor),
          (window.advancedIntelligence = p.advancedIntelligence),
          (window.dataExportManager = b.dataExportManager),
          (window.userFeedbackManager = k.userFeedbackManager),
          (window.performanceManager = S.performanceManager),
          (window.submitFeedback = function () {
            let e = document.getElementById("muscleSelect").value,
              t = parseInt(document.getElementById("mmc").value, 10),
              a = parseInt(document.getElementById("pump").value, 10),
              s = parseInt(document.getElementById("dis").value, 10),
              n = parseInt(document.getElementById("sore").value, 10),
              l = document.getElementById("actualRIR").value,
              c = document.querySelector('input[name="perf"]:checked'),
              d = c ? parseInt(c.value, 10) : 2;
            if (!e || isNaN(t) || isNaN(a) || isNaN(s))
              return void alert("Please fill in all required fields");
            let m = (0, i.scoreStimulus)({ mmc: t, pump: a, disruption: s }),
              g = (0, i.setProgressionAlgorithm)(n, d),
              h = (0, i.getVolumeProgression)(e, {
                stimulus: { mmc: t, pump: a, disruption: s },
                soreness: n,
                performance: d,
                hasIllness: !1,
              }),
              p = null;
            l && (p = (0, o.validateEffortLevel)(parseFloat(l))),
              -99 !== g.setChange && u.default.addSets(e, g.setChange);
            let f = document.getElementById("mevOut"),
              y = `
    <div class="feedback-results">
      <div class="main-recommendation">
        <h4>${e} Recommendation</h4>
        <p class="advice">${h.advice}</p>
        <p class="sets-info">
          ${h.currentSets} \u{2192} ${h.projectedSets} sets
          ${0 !== h.setChange ? `(${h.setChange > 0 ? "+" : ""}${h.setChange})` : ""}
        </p>
      </div>
      
      <div class="algorithm-details">
        <div>
          <strong>Stimulus:</strong> ${m.score}/9 
          <span class="stimulus-${m.action}">(${m.action.replace("_", " ")})</span>
        </div>
        <div>
          <strong>Volume Status:</strong> ${h.volumeStatus}
        </div>
        <div>
          <strong>RP Progression:</strong> ${g.advice}
        </div>
      </div>
    </div>
  `;
            p &&
              (y += `
      <div class="rir-feedback ${p.urgency}">
        <strong>RIR Check:</strong> ${p.feedback}<br>
        <em>${p.recommendation}</em>
      </div>
    `),
              h.deloadRecommended &&
                (y += `
      <div class="deload-warning">
        \u{26A0}\u{FE0F} <strong>Deload Recommended</strong>
      </div>
    `),
              (f.innerHTML = y),
              (f.className = "result success active"),
              (0, r.updateChart)();
          }),
          (window.analyzeDeload = function () {
            let e = document.getElementById("halfMuscles").checked,
              t = document.getElementById("mrvBreach").checked,
              a = document.getElementById("illness").checked,
              s = document.getElementById("lowMotivation").checked,
              n = (0, i.analyzeDeloadNeed)();
            e && n.reasons.push("Most muscles need recovery (manual check)"),
              t && n.reasons.push("Hit MRV twice consecutively (manual check)"),
              a && n.reasons.push("Illness/injury present"),
              s && n.reasons.push("Low motivation levels");
            let o = n.shouldDeload || e || t || a || s,
              l = document.getElementById("deloadOut");
            o
              ? ((l.innerHTML = `
      <strong>Deload Recommended</strong><br>
      Reasons: ${n.reasons.join(", ")}<br>
      <em>Take 1 week at 50% volume + 25-50% load reduction</em>
    `),
                (l.className = "result warning active"),
                setTimeout(() => {
                  confirm(
                    "Start deload phase now? This will reduce all muscle volumes to 50% of MEV.",
                  ) && (u.default.startDeload(), (0, r.updateChart)());
                }, 1e3))
              : ((l.innerHTML = "No deload needed - continue current program"),
                (l.className = "result success active"));
          }),
          (window.analyzeFrequency = function () {
            let e = parseInt(document.getElementById("soreDays").value, 10),
              t = parseInt(document.getElementById("sessionGap").value, 10),
              a = document.getElementById("trainingAge").value,
              s = document.getElementById("muscleSelect").value,
              n = (0, l.analyzeFrequency)(e, t, s),
              r = (0, l.calculateOptimalFrequency)(s, {
                trainingAge: a,
                currentVolume: u.default.currentWeekSets[s],
              }),
              i = document.getElementById("freqOut");
            i.innerHTML = `
    <strong>${n.recommendation}</strong><br>
    Current: ${t} days between sessions<br>
    Recovery: ${e} days<br>
    Optimal frequency: ${r.recommendedFrequency}x/week (${r.setsPerSession} sets/session)
  `;
            let o =
              "high" === n.urgency || "medium" === n.urgency
                ? "warning"
                : "success";
            i.className = `result ${o} active`;
          }),
          (window.saveLandmarks = function () {
            let e = document.getElementById("landmarkMuscle").value,
              t = parseInt(document.getElementById("mv").value, 10),
              a = parseInt(document.getElementById("mev").value, 10),
              s = parseInt(document.getElementById("mav").value, 10),
              n = parseInt(document.getElementById("mrv").value, 10);
            if (t > a || a > s || s > n)
              return void alert(
                "Invalid landmark relationship (MV ≤ MEV ≤ MAV ≤ MRV)",
              );
            u.default.updateVolumeLandmarks(e, {
              MV: t,
              MEV: a,
              MAV: s,
              MRV: n,
            }),
              (0, r.updateChart)();
            let i = document.getElementById("volumeOut");
            (i.innerHTML = `Landmarks saved for ${e}: MV:${t}, MEV:${a}, MAV:${s}, MRV:${n}`),
              (i.className = "result success active");
          }),
          (window.applyVolumePreset = function (e) {
            let t = document.getElementById("landmarkMuscle").value,
              a = { beginner: 0.8, intermediate: 1, advanced: 1.2 }[e],
              s = u.default.volumeLandmarks[t];
            (document.getElementById("mv").value = Math.round(s.MV * a)),
              (document.getElementById("mev").value = Math.round(s.MEV * a)),
              (document.getElementById("mav").value = Math.round(s.MAV * a)),
              (document.getElementById("mrv").value = Math.round(s.MRV * a));
          }),
          (window.setupMeso = function () {
            let e = parseInt(document.getElementById("mesoLength").value, 10),
              t = parseInt(document.getElementById("currentWeekNum").value, 10),
              a = document.getElementById("trainingGoal").value,
              s = (0, c.validateMesocycleLength)(e, a);
            if (!s.isValid) return void alert(s.warning);
            (u.default.mesoLen = e),
              (u.default.weekNo = t),
              u.default.saveState();
            let n = document.getElementById("mesoOut");
            (n.innerHTML = `
    Mesocycle configured: ${e} weeks for ${a}<br>
    Currently week ${t} (Target RIR: ${u.default.getTargetRIR().toFixed(1)})<br>
    ${s.recommendation}
  `),
              (n.className = "result success active");
          }),
          (window.advanceToNextWeek = function () {
            u.default.nextWeek(), (0, r.updateChart)(), updateAllDisplays();
            let e = u.default.getStateSummary(),
              t =
                document.getElementById("autoVolumeOut") ||
                document.getElementById("volumeOut");
            (t.innerHTML = `
    <div class="auto-progression-result">
      <h4>\u{1F4C5} Advanced to Week ${e.week}</h4>
      <div class="progression-details">
        <div>Week: ${e.week} of ${e.meso}</div>
        <div>Block: ${e.block}</div>
        <div>Target RIR: ${e.targetRIR.toFixed(1)}</div>
        <div>Phase: ${e.currentPhase}</div>
      </div>
    </div>
  `),
              (t.className = "result success active"),
              console.log("Advanced to next week:", e);
          }),
          (window.initializeAllMusclesAtMEV = function () {
            let e = Object.keys(u.default.volumeLandmarks);
            e.forEach((e) => {
              u.default.initializeMuscleAtMEV(e);
            }),
              (0, r.updateChart)();
            let t =
              document.getElementById("autoVolumeOut") ||
              document.getElementById("volumeOut");
            (t.innerHTML = `
    <div class="auto-progression-result">
      <h4>\u{1F3AF} All muscles initialized at MEV</h4>
      <div class="progression-details">
        ${e.map((e) => `<div>${e}: ${u.default.volumeLandmarks[e].MEV} sets (MEV)</div>`).join("")}
      </div>
    </div>
  `),
              (t.className = "result success active"),
              console.log("All muscles initialized at MEV");
          }),
          (window.runAutoVolumeProgression = function () {
            let e = {};
            Object.keys(u.default.volumeLandmarks).forEach((t) => {
              let a, s, n;
              u.default.getWeeklySets(t), u.default.volumeLandmarks[t];
              let r = u.default.getVolumeStatus(t);
              "under-minimum" === r || "maintenance" === r
                ? ((a = Math.floor(4 * Math.random()) + 2),
                  (s = Math.floor(2 * Math.random())),
                  (n = Math.floor(2 * Math.random()) + 1))
                : "optimal" === r
                  ? ((a = Math.floor(3 * Math.random()) + 4),
                    (s = Math.floor(2 * Math.random()) + 1),
                    (n = Math.floor(2 * Math.random()) + 1))
                  : "high" === r &&
                    ((a = Math.floor(3 * Math.random()) + 5),
                    (s = Math.floor(2 * Math.random()) + 1),
                    (n = Math.floor(3 * Math.random())),
                    (a = Math.floor(4 * Math.random()) + 4),
                    (s = Math.floor(2 * Math.random()) + 2),
                    (n = Math.floor(2 * Math.random())));
              let i = 0,
                o = 0,
                l = 100;
              "maximum" === r
                ? ((i = Math.floor(3 * Math.random()) + 1),
                  (o = Math.random() > 0.6 ? -1 : 0),
                  (l = 95))
                : "high" === r
                  ? ((i = Math.floor(2 * Math.random())),
                    (o =
                      Math.random() > 0.8 ? -1 : Math.random() > 0.5 ? 0 : 1),
                    (l = 98))
                  : ((i = Math.floor(2 * Math.random())),
                    (o = +(Math.random() > 0.7)),
                    (l = 102)),
                (e[t] = {
                  stimulus: a,
                  soreness: s,
                  perf: n,
                  jointAche: i,
                  perfChange: o,
                  lastLoad: l,
                  pump: Math.floor(a / 3),
                  disruption: Math.floor(a / 3),
                  recoverySession:
                    s >= 3 || ("maximum" === r && 0.3 > Math.random()),
                });
            });
            let t = (0, i.processWeeklyVolumeProgression)(e, u.default);
            (0, r.updateChart)();
            let a = t.deloadTriggered
                ? `\u{1F6D1} ${t.recommendation} (${t.mrvHits} muscles at MRV)`
                : `\u{1F4C8} Auto-progression complete (+${Object.values(t.progressionLog).reduce((e, t) => e + t.increment, 0)} total sets)`,
              s =
                document.getElementById("autoVolumeOut") ||
                document.getElementById("volumeOut") ||
                document.createElement("div"),
              n = Object.entries(t.progressionLog)
                .map(
                  ([e, t]) =>
                    `<div>${e}: ${t.previousSets} \u{2192} ${t.currentSets} sets (${t.reason})</div>`,
                )
                .join("");
            (s.innerHTML = `
    <div class="auto-progression-result">
      <h4>${a}</h4>
      <div class="progression-details">
        ${n}
      </div>
    </div>
  `),
              (s.className = t.deloadTriggered
                ? "result warning active"
                : "result success active"),
              console.log("Auto-progression result:", t);
          }),
          (window.runWeeklyLoadAdjustments = function () {
            let e = Object.keys(u.default.volumeLandmarks),
              t = u.default.weekNo,
              a = (0, o.simulateWeeklyRIRFeedback)(e, t),
              s = (0, o.processWeeklyLoadAdjustments)(a),
              n =
                document.getElementById("autoVolumeOut") ||
                document.getElementById("volumeOut") ||
                document.createElement("div"),
              r = Object.entries(s.adjustments)
                .map(
                  ([e, t]) => `<div class="load-adjustment ${t.urgency}">
      <strong>${e}:</strong> ${t.loadAdjustment > 0 ? "+" : ""}${t.loadAdjustment.toFixed(1)}% 
      (${t.currentRIR.toFixed(1)} vs ${t.targetRIR.toFixed(1)} RIR)
      <div class="adjustment-reason">${t.reason}</div>
    </div>`,
                )
                .join("");
            (n.innerHTML = `
    <div class="auto-progression-result">
      <h4>\u{2696}\u{FE0F} Weekly Load Adjustments - Week ${s.week}</h4>
      <div class="rir-summary">
        <div>Target RIR: ${s.targetRIR.toFixed(1)}</div>
        <div>Muscles Adjusted: ${s.summary.musclesAdjusted}/${s.summary.totalMuscles}</div>
        <div>Avg Load Change: ${s.summary.avgLoadChange > 0 ? "+" : ""}${s.summary.avgLoadChange.toFixed(1)}%</div>
      </div>
      <div class="load-adjustments">
        ${r}
      </div>
    </div>
  `),
              (n.className = "result success active"),
              console.log("Weekly load adjustments:", s);
          }),
          (window.showNextWeekLoadProgression = function () {
            let e = Object.keys(u.default.volumeLandmarks),
              t = [];
            e.forEach((e) => {
              let a = {
                  averageRIR:
                    (0, o.getScheduledRIR)(
                      u.default.weekNo,
                      u.default.mesoLen,
                    ) +
                    (2 * Math.random() - 1),
                },
                s = (0, o.getLoadProgression)(e, a);
              t.push(s);
            });
            let a =
                document.getElementById("autoVolumeOut") ||
                document.getElementById("volumeOut") ||
                document.createElement("div"),
              s = t
                .map(
                  (e) => `<div class="load-progression">
      <strong>${e.muscle}:</strong> ${e.loadIncrease > 0 ? "+" : ""}${e.loadIncrease}% 
      (${e.currentRIR.toFixed(1)} \u{2192} ${e.nextRIR.toFixed(1)} RIR)
      <div class="progression-recommendation">${e.recommendation}</div>
    </div>`,
                )
                .join(""),
              n = u.default.weekNo + 1,
              r = (0, o.getScheduledRIR)(n, u.default.mesoLen);
            (a.innerHTML = `
    <div class="auto-progression-result">
      <h4>\u{1F4C8} Load Progression for Week ${n}</h4>
      <div class="rir-summary">
        <div>Next Week Target RIR: ${r.toFixed(1)}</div>
        <div>Total Muscles: ${t.length}</div>
        <div>Avg Load Increase: +${(t.reduce((e, t) => e + t.loadIncrease, 0) / t.length).toFixed(1)}%</div>
      </div>
      <div class="load-progressions">
        ${s}
      </div>
    </div>
  `),
              (a.className = "result success active"),
              console.log("Next week load progressions:", t);
          }),
          (window.showRIRSchedule = function () {
            let e = u.default.mesoLen,
              t = u.default.weekNo,
              a = [];
            for (let s = 1; s <= e; s++) {
              let n = (0, o.getScheduledRIR)(s, e),
                r = s === t;
              a.push({
                week: s,
                rir: n,
                isCurrent: r,
                intensity:
                  n >= 2.5
                    ? "Low"
                    : n >= 2
                      ? "Moderate"
                      : n >= 1
                        ? "High"
                        : "Maximum",
              });
            }
            let s =
                document.getElementById("autoVolumeOut") ||
                document.getElementById("volumeOut") ||
                document.createElement("div"),
              n = a
                .map(
                  (
                    e,
                  ) => `<div class="rir-week ${e.isCurrent ? "current-week" : ""}">
      <strong>Week ${e.week}:</strong> ${e.rir.toFixed(1)} RIR (${e.intensity})
      ${e.isCurrent ? " ← Current" : ""}
    </div>`,
                )
                .join("");
            (s.innerHTML = `
    <div class="auto-progression-result">
      <h4>\u{1F4C5} RIR Schedule - ${e} Week Mesocycle</h4>
      <div class="rir-schedule">
        ${n}
      </div>
      <div class="schedule-notes">
        <div>\u{2022} Scheduled progression follows RP guidelines</div>
        <div>\u{2022} Lower RIR = Higher intensity (closer to failure)</div>
        <div>\u{2022} Deload after final week</div>
      </div>
    </div>
  `),
              (s.className = "result success active"),
              console.log("RIR Schedule:", a);
          });
        let w = !1,
          M = 0;
        function x(e, t = "info") {
          let a = document.querySelector(".system-message");
          a && a.remove();
          let s = document.createElement("div");
          (s.className = `system-message ${t}`),
            (s.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 1000;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    ${"success" === t ? "background: #d1fae5; color: #065f46; border: 1px solid #10b981;" : ""}
    ${"error" === t ? "background: #fee2e2; color: #991b1b; border: 1px solid #ef4444;" : ""}
    ${"info" === t ? "background: #dbeafe; color: #1e40af; border: 1px solid #3b82f6;" : ""}
  `),
            (s.textContent = e),
            document.body.appendChild(s),
            setTimeout(() => s.remove(), 5e3);
        }
        function R(e) {
          let t = document.getElementById(e);
          if (!t) {
            for (let a of (((t = document.createElement("div")).id = e),
            (t.className = "result"),
            ["advanced-content", "setup-content", "feedback-content"])) {
              let e = document.getElementById(a);
              if (e) {
                e.appendChild(t);
                break;
              }
            }
            t.parentNode || document.body.appendChild(t);
          }
          return t;
        }
        (window.startLiveSession = function () {
          let e = document.getElementById("liveExercise").value,
            t = document.getElementById("liveMuscle").value,
            a = parseInt(document.getElementById("plannedSets").value),
            s = u.default.getTargetRIR(),
            n = h.liveMonitor.startSession({
              muscle: t,
              exercise: e,
              plannedSets: a,
              targetRIR: s,
            });
          (w = !0),
            (M = 0),
            (document.getElementById("startSessionBtn").style.display = "none"),
            (document.getElementById("logSetBtn").style.display =
              "inline-block"),
            (document.getElementById("endSessionBtn").style.display =
              "inline-block"),
            (document.getElementById("liveMonitor").style.display = "block");
          let r = document.getElementById("liveMonitorOut");
          (r.innerHTML = `<strong>\u{1F3AE} Live Session Started!</strong><br>${n.message}<br><br>Target RIR: ${s}<br>Planned Sets: ${a}`),
            (r.className = "result success active");
        }),
          (window.logTrainingSet = function () {
            var e;
            if (!w) return void alert("Please start a session first!");
            M++;
            let t = {
                weight: 80 + (10 * Math.random() - 5),
                reps: 8 + Math.floor(3 * Math.random()),
                rir: 1.5 + +Math.random(),
                rpe: null,
                techniqueRating: 7 + Math.floor(3 * Math.random()),
                notes: `Set ${M} - simulated`,
              },
              a = h.liveMonitor.logSet(t);
            (e = {
              sessionProgress: h.liveMonitor.getSessionProgress(),
              setInfo: { rir: t.rir },
            }).sessionProgress &&
              ((document.getElementById("currentSet").textContent =
                e.sessionProgress.completedSets),
              (document.getElementById("sessionProgress").textContent =
                Math.round(e.sessionProgress.progressPercentage) + "%"),
              (document.getElementById("totalLoad").textContent =
                e.sessionProgress.totalLoad)),
              e.setInfo &&
                (document.getElementById("currentRIR").textContent =
                  e.setInfo.rir.toFixed(1)),
              (function (e) {
                let t = document.getElementById("liveMonitorOut");
                t.className = `result ${e.feedback.type} active`;
                let a = `<strong>Set ${M} Feedback:</strong><br>`;
                (a += `${e.feedback.message}<br><br>`),
                  e.nextSetRecommendations.rationale.length > 0 &&
                    (a += `<strong>Next Set Recommendations:</strong><br>Weight: ${e.nextSetRecommendations.weight}kg<br>Rest: ${e.nextSetRecommendations.rest}<br>Strategy: ${e.nextSetRecommendations.strategy}<br>Rationale: ${e.nextSetRecommendations.rationale.join(", ")}<br>`),
                  (t.innerHTML = a);
              })(a);
          }),
          (window.endLiveSession = function () {
            if (!w) return void alert("No active session to end!");
            let e = h.liveMonitor.endSession();
            (w = !1),
              (M = 0),
              (document.getElementById("startSessionBtn").style.display =
                "inline-block"),
              (document.getElementById("logSetBtn").style.display = "none"),
              (document.getElementById("endSessionBtn").style.display = "none"),
              (document.getElementById("liveMonitor").style.display = "none"),
              (function (e) {
                let t = document.getElementById("liveMonitorOut");
                t.className = "result success active";
                let a = `<strong>\u{1F3AF} Session Complete!</strong><br><br>`;
                (a += `<strong>Performance Grade:</strong> ${e.performance.targetAchievement.grade}<br><strong>Consistency Rating:</strong> ${e.performance.consistency.rating}<br><strong>Total Load:</strong> ${e.progress.totalLoad}<br><strong>Duration:</strong> ${e.progress.duration} minutes<br><br>`),
                  e.recommendations.length > 0 &&
                    ((a += "<strong>Recommendations:</strong><br>"),
                    e.recommendations.forEach((e) => {
                      a += `\u{2022} ${e.message}<br>`;
                    })),
                  (t.innerHTML = a);
              })(e);
          }),
          (window.initializeIntelligence = function () {
            let e = document.getElementById("intelligenceOut");
            (e.innerHTML =
              '<div class="loading"></div> Initializing Advanced Training Intelligence...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = p.advancedIntelligence.initialize(),
                  a =
                    "<strong>\uD83E\uDDE0 Intelligence System Initialized!</strong><br><br>";
                (a += `<strong>Analytics:</strong> ${t.analytics ? "✅ Enabled" : "❌ Disabled (need more data)"}<br><strong>Exercise Selection:</strong> ${t.exerciseSelection ? "✅ Enabled" : "❌ Disabled"}<br><strong>Live Monitoring:</strong> ${t.liveMonitoring ? "✅ Enabled" : "❌ Disabled"}<br><br><strong>Status:</strong> ${t.message}`),
                  (document.getElementById("analyticsStatus").textContent =
                    t.analytics ? "✅" : "❌"),
                  (document.getElementById("exerciseStatus").textContent =
                    t.exerciseSelection ? "✅" : "❌"),
                  (document.getElementById("liveStatus").textContent =
                    t.liveMonitoring ? "✅" : "❌"),
                  (document.getElementById("hubStatus").textContent = "✅"),
                  (e.className = "result success active"),
                  (e.innerHTML = a);
              }, 1500);
          }),
          (window.getWeeklyIntelligence = function () {
            let e = document.getElementById("intelligenceOut");
            (e.innerHTML =
              '<div class="loading"></div> Generating weekly intelligence report...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = p.advancedIntelligence.getWeeklyIntelligence(),
                  a =
                    "<strong>\uD83D\uDCC8 Weekly Intelligence Report</strong><br><br>";
                (a += `<strong>Week:</strong> ${t.week}, Block: ${t.block}<br><br>`),
                  t.recommendations.length > 0 &&
                    ((a +=
                      "<strong>\uD83C\uDFAF Recommendations:</strong><br>"),
                    t.recommendations.forEach((e) => {
                      a += `\u{2022} [${e.urgency.toUpperCase()}] ${e.message}<br>`;
                    }),
                    (a += "<br>")),
                  t.optimizations.length > 0 &&
                    ((a +=
                      "<strong>\uD83D\uDD27 Available Optimizations:</strong><br>"),
                    t.optimizations.forEach((e) => {
                      a += `\u{2022} ${e.type}: ${e.recommendation || e.muscle}<br>`;
                    }),
                    (a += "<br>")),
                  t.riskAssessment &&
                    (a += `<strong>\u{26A0}\u{FE0F} Risk Level:</strong> ${t.riskAssessment.riskLevel.toUpperCase()}<br><strong>Risk Score:</strong> ${t.riskAssessment.riskScore}/100<br>`),
                  (document.getElementById("intelligencePanel").style.display =
                    "block"),
                  (document.getElementById("intelligenceContent").innerHTML = `
      <div class="recommendation">
        <strong>\u{1F4CA} Current Assessment</strong><br>
        Week ${t.week} analysis shows ${t.recommendations.length} active recommendations
        and ${t.optimizations.length} optimization opportunities.
      </div>
    `),
                  (e.className = "result success active"),
                  (e.innerHTML = a);
              }, 2e3);
          }),
          (window.getOptimalExercises = function () {
            let e = document.getElementById("intelligenceOut");
            (e.innerHTML =
              '<div class="loading"></div> Analyzing optimal exercises for current training state...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = "Chest",
                  a = (0, g.selectOptimalExercises)(t, {
                    availableEquipment: ["barbell", "dumbbells", "cables"],
                    trainingGoal: "hypertrophy",
                    experienceLevel: "intermediate",
                    fatigueLevel: 4,
                    timeConstraint: "moderate",
                  }),
                  s =
                    "<strong>\uD83D\uDCA1 Smart Exercise Recommendations</strong><br><br>";
                (s += `<strong>For ${t}:</strong><br>`),
                  a.slice(0, 3).forEach((e, t) => {
                    s += `${t + 1}. <strong>${e.name}</strong> (Score: ${e.score.toFixed(1)})<br>   Sets: ${e.sets}, Reps: ${e.repRange[0]}-${e.repRange[1]}<br>   ${e.reasoning}<br><br>`;
                  }),
                  (e.className = "result success active"),
                  (e.innerHTML = s);
              }, 1500);
          }),
          (window.assessTrainingRisk = function () {
            let e = document.getElementById("intelligenceOut");
            (e.innerHTML =
              '<div class="loading"></div> Assessing training risk factors...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = p.advancedIntelligence.assessTrainingRisk(),
                  a = "<strong>⚠️ Training Risk Assessment</strong><br><br>";
                (a += `<strong>Risk Score:</strong> ${t.riskScore}/100<br><strong>Risk Level:</strong> ${t.riskLevel.toUpperCase()}<br><br>`),
                  t.riskFactors.length > 0 &&
                    ((a += "<strong>Risk Factors:</strong><br>"),
                    t.riskFactors.forEach((e) => {
                      a += `\u{2022} ${e}<br>`;
                    }),
                    (a += "<br>")),
                  t.recommendations.length > 0 &&
                    ((a += "<strong>Recommendations:</strong><br>"),
                    t.recommendations.forEach((e) => {
                      a += `\u{2022} ${e}<br>`;
                    }));
                let s =
                  "low" === t.riskLevel
                    ? "success"
                    : "moderate" === t.riskLevel
                      ? "warning"
                      : "error";
                (e.className = `result ${s} active`), (e.innerHTML = a);
              }, 2e3);
          }),
          (window.optimizeVolumeLandmarks = function () {
            let e = document.getElementById("analyticsOut");
            (e.innerHTML =
              '<div class="loading"></div> Analyzing historical data for volume optimization...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = (0, m.optimizeVolumeLandmarks)("Chest", [
                    {
                      sets: 8,
                      avgStimulus: 7,
                      avgFatigue: 2,
                      performanceChange: 1,
                    },
                    {
                      sets: 10,
                      avgStimulus: 8,
                      avgFatigue: 3,
                      performanceChange: 1,
                    },
                    {
                      sets: 12,
                      avgStimulus: 8,
                      avgFatigue: 4,
                      performanceChange: 0,
                    },
                    {
                      sets: 14,
                      avgStimulus: 7,
                      avgFatigue: 6,
                      performanceChange: -1,
                    },
                  ]),
                  a =
                    "<strong>\uD83D\uDCCA Volume Landmark Optimization Results:</strong><br><br>";
                (a += `<strong>Optimized Landmarks for Chest:</strong><br>MEV: ${t.MEV} sets<br>MAV: ${t.MAV} sets<br>MRV: ${t.MRV} sets<br><br><strong>Confidence:</strong> ${t.confidence}%<br>`),
                  (e.className = "result success active"),
                  (e.innerHTML = a);
              }, 2e3);
          }),
          (window.predictDeloadTiming = function () {
            let e = document.getElementById("analyticsOut");
            (e.innerHTML =
              '<div class="loading"></div> Analyzing fatigue patterns and performance trends...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = (0, m.predictDeloadTiming)({
                    weeklyFatigueScore: [3, 4, 6, 7],
                    performanceTrend: [85, 82, 78, 75],
                    volumeProgression: [40, 44, 48, 52],
                    motivationLevel: 6,
                    sleepQuality: 7,
                  }),
                  a =
                    "<strong>\uD83D\uDD2E Deload Prediction Analysis:</strong><br><br>";
                a += `<strong>Weeks Until Deload:</strong> ${t.weeksUntilDeload}<br><strong>Confidence:</strong> ${t.confidence}%<br><strong>Primary Indicator:</strong> ${t.primaryIndicator}<br><strong>Recommended Action:</strong> ${t.recommendedAction}<br>`;
                let s = t.weeksUntilDeload <= 2 ? "warning" : "success";
                (e.className = `result ${s} active`), (e.innerHTML = a);
              }, 2500);
          }),
          (window.detectPlateaus = function () {
            let e = document.getElementById("analyticsOut");
            (e.innerHTML =
              '<div class="loading"></div> Analyzing training plateaus and stagnation patterns...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = (0, m.detectTrainingPlateaus)({
                    weeklyPerformance: [85, 84, 83, 83, 82, 82],
                    weeklyVolume: [45, 47, 48, 48, 48, 48],
                    weeklyIntensity: [7, 7.5, 8, 8, 8, 8],
                    weeklyFatigue: [3, 4, 5, 6, 7, 8],
                  }),
                  a =
                    "<strong>\uD83D\uDCC8 Plateau Detection Results:</strong><br><br>";
                t.plateauDetected
                  ? ((a += `<strong>\u{1F6A8} Plateau Detected:</strong> ${t.plateauType}<br><strong>Urgency Level:</strong> ${t.urgency}<br><br><strong>\u{1F4A1} Recommended Interventions:</strong><br>`),
                    t.interventions.forEach((e) => {
                      a += `\u{2022} ${e}<br>`;
                    }),
                    (e.className = "result warning active"))
                  : ((a += `<strong>\u{2705} No Plateau Detected</strong><br>Training progression appears healthy.<br><br>Continue current program with monitoring.`),
                    (e.className = "result success active")),
                  (e.innerHTML = a);
              }, 2e3);
          }),
          (window.getAdaptiveRIR = function () {
            let e = document.getElementById("analyticsOut");
            (e.innerHTML =
              '<div class="loading"></div> Analyzing RIR patterns for personalized recommendations...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = (0, m.adaptiveRIRRecommendations)("Chest", [
                    {
                      actualRIR: 2.5,
                      targetRIR: 2,
                      nextDayFatigue: 3,
                      recoveryDays: 2,
                    },
                    {
                      actualRIR: 1.5,
                      targetRIR: 1,
                      nextDayFatigue: 4,
                      recoveryDays: 3,
                    },
                    {
                      actualRIR: 3,
                      targetRIR: 2,
                      nextDayFatigue: 2,
                      recoveryDays: 1,
                    },
                  ]),
                  a =
                    "<strong>\uD83C\uDF9B️ Adaptive RIR Recommendations:</strong><br><br>";
                (a += `<strong>Recommended RIR:</strong> ${t.recommendedRIR}<br><strong>Confidence:</strong> ${t.confidence}%<br><strong>Reasoning:</strong> ${t.reasoning}<br><br><strong>Personalization Notes:</strong><br>`),
                  t.personalizedFactors.forEach((e) => {
                    a += `\u{2022} ${e}<br>`;
                  }),
                  (e.className = "result success active"),
                  (e.innerHTML = a);
              }, 1500);
          }),
          (window.generateWeeklyProgram = function () {
            let e = document.getElementById("programOut");
            (e.innerHTML =
              '<div class="loading"></div> Generating intelligent weekly program...'),
              (e.className = "result active"),
              setTimeout(() => {
                let t = parseInt(document.getElementById("programDays").value),
                  a = document.getElementById("programSplit").value,
                  s = parseInt(document.getElementById("sessionTime").value),
                  n = document.getElementById("experienceLevel").value,
                  r = (0, g.generateWeeklyProgram)({
                    daysPerWeek: t,
                    splitType: a,
                    experienceLevel: n,
                    timePerSession: s,
                  }),
                  i =
                    "<strong>\uD83D\uDCCB Generated Weekly Program:</strong><br><br>";
                (i += `<strong>Split Type:</strong> ${r.splitType}<br><strong>Days Per Week:</strong> ${r.daysPerWeek}<br><br>`),
                  r.sessions.forEach((e) => {
                    (i += `<strong>Day ${e.day}: ${e.name}</strong><br>`),
                      e.exercises.forEach((e) => {
                        i += `\u{2022} ${e.exercise} - ${e.sets} sets x ${e.reps[0]}-${e.reps[1]} reps<br>`;
                      }),
                      (i += "<br>");
                  }),
                  (e.className = "result success active"),
                  (e.innerHTML = i);
              }, 2e3);
          }),
          (window.exportAllData = function (e = "json") {
            let t = b.dataExportManager.exportAllData(e, {
              includePersonalData: !0,
              includeAnalytics: !0,
              includeWellness: !0,
            });
            t.success
              ? (console.log(
                  `\u{2705} Data exported successfully: ${t.filename}`,
                ),
                x(
                  `\u{1F4E4} Data exported: ${t.filename} (${(t.size / 1024).toFixed(1)}KB)`,
                  "success",
                ))
              : (console.error("❌ Export failed:", t.error),
                x(`\u{274C} Export failed: ${t.error}`, "error"));
          }),
          (window.createBackup = function () {
            let e = b.dataExportManager.createAutoBackup();
            e.success
              ? (console.log("✅ Backup created:", e.backupKey),
                x(
                  `\u{1F4BE} Backup created successfully (${e.dataPoints} data points)`,
                  "success",
                ))
              : (console.error("❌ Backup failed:", e.error),
                x(`\u{274C} Backup failed: ${e.error}`, "error"));
          }),
          (window.viewBackups = function () {
            let e = b.dataExportManager.getAvailableBackups(),
              t = "<strong>\uD83D\uDCE6 Available Backups:</strong><br><br>";
            0 === e.length
              ? (t += "<p>No backups available. Create your first backup!</p>")
              : e.forEach((e) => {
                  let a = new Date(e.date).toLocaleString(),
                    s = (e.size / 1024).toFixed(1);
                  t += `<div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;"><strong>\u{1F4C5} ${a}</strong><br>\u{1F4CA} ${e.dataPoints} data points | \u{1F4BE} ${s}KB<br><button onclick="restoreBackup('${e.key}')" style="margin-top: 5px; padding: 5px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Restore</button></div>`;
                });
            let a =
              document.getElementById("backupResults") || R("backupResults");
            (a.innerHTML = t), (a.className = "result active");
          }),
          (window.restoreBackup = function (e) {
            if (
              confirm("⚠️ This will overwrite your current data. Are you sure?")
            ) {
              let t = b.dataExportManager.restoreFromBackup(e);
              t.success
                ? (x(
                    "✅ Backup restored successfully! Refreshing page...",
                    "success",
                  ),
                  setTimeout(() => location.reload(), 2e3))
                : x(`\u{274C} Restore failed: ${t.error}`, "error");
            }
          }),
          (window.getPerformanceReport = function () {
            let e = S.performanceManager.generatePerformanceReport(),
              t = "<strong>⚡ Performance Report:</strong><br><br>";
            (t += `<strong>\u{1F4CA} Load Performance:</strong><br>\u{2022} Average Load Time: ${Math.round(e.performance.averageLoadTime)}ms<br>\u{2022} 95th Percentile: ${Math.round(e.performance.loadTimeP95)}ms<br><br><strong>\u{1F4BE} Memory Usage:</strong><br>\u{2022} Current: ${e.memory.currentUsage.toFixed(1)}MB<br>\u{2022} Peak: ${e.memory.peakUsage.toFixed(1)}MB<br><br><strong>\u{1F5B1}\u{FE0F} Interactions:</strong><br>\u{2022} Total: ${e.interactions.totalInteractions}<br>\u{2022} Average Delay: ${Math.round(e.interactions.averageDelay)}ms<br><br>`),
              e.recommendations.length > 0 &&
                ((t += `<strong>\u{1F4A1} Recommendations:</strong><br>`),
                e.recommendations.forEach((e) => {
                  let a =
                    "high" === e.priority
                      ? "\uD83D\uDD34"
                      : "medium" === e.priority
                        ? "\uD83D\uDFE1"
                        : "\uD83D\uDFE2";
                  t += `${a} ${e.message}<br>`;
                }));
            let a =
              document.getElementById("performanceResults") ||
              R("performanceResults");
            (a.innerHTML = t), (a.className = "result active");
          }),
          (window.clearPerformanceData = function () {
            confirm("Clear all performance monitoring data?") &&
              (S.performanceManager.clearOldMetrics(),
              localStorage.removeItem("performance-issues"),
              x("\uD83E\uDDF9 Performance data cleared", "success"));
          }),
          (window.openFeedbackWidget = function () {
            k.userFeedbackManager.openFeedbackPanel();
          }),
          (window.getUserAnalytics = function () {
            let e = k.userFeedbackManager.generateAnalyticsDashboard(),
              t = "<strong>\uD83D\uDCC8 Usage Analytics:</strong><br><br>";
            (t += `<strong>\u{1F4F1} Usage Stats:</strong><br>\u{2022} Total Sessions: ${e.usage.totalSessions}<br>\u{2022} Average Duration: ${e.usage.averageSessionDuration} minutes<br>\u{2022} Features Used: ${e.usage.featuresUsed}<br>\u{2022} Most Used: ${e.usage.mostUsedFeature}<br><br>`),
              e.feedback.totalFeedback > 0 &&
                (t += `<strong>\u{1F4AC} Feedback Summary:</strong><br>\u{2022} Total Feedback: ${e.feedback.totalFeedback}<br>\u{2022} Average Rating: ${e.feedback.averageRating}/5 \u{2B50}<br><br>`),
              e.insights.length > 0 &&
                ((t += `<strong>\u{1F4A1} Insights:</strong><br>`),
                e.insights.forEach((e) => {
                  let a =
                    "milestone" === e.type
                      ? "\uD83C\uDF89"
                      : "satisfaction" === e.type
                        ? "⭐"
                        : "advanced" === e.type
                          ? "\uD83E\uDDE0"
                          : "\uD83D\uDCA1";
                  t += `${a} ${e.message}<br>`;
                }));
            let a =
              document.getElementById("analyticsResults") ||
              R("analyticsResults");
            (a.innerHTML = t), (a.className = "result active");
          });
      },
      {
        "./chartManager.js": "kLZpA",
        "../algorithms/volume.js": "1HfJW",
        "../algorithms/effort.js": "dELBV",
        "../algorithms/fatigue.js": "5s7BT",
        "../algorithms/validation.js": "cOYv8",
        "../core/trainingState.js": "iohWK",
        "../algorithms/analytics.js": "5eA0i",
        "../algorithms/exerciseSelection.js": "gGpfv",
        "../algorithms/livePerformance.js": "6qXhO",
        "../algorithms/intelligenceHub.js": "bDUtg",
        "../algorithms/dataVisualization.js": "ewacr",
        "../algorithms/wellnessIntegration.js": "baIS0",
        "../algorithms/periodizationSystem.js": "gvkvx",
        "../utils/dataExport.js": "iZ0Js",
        "../utils/userFeedback.js": "4cMS8",
        "../utils/performance.js": "5E6aE",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    kLZpA: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "initChart", () => c),
          n.export(a, "updateChart", () => d),
          n.export(a, "resetChart", () => u),
          n.export(a, "addVolumeLandmarks", () => g),
          n.export(a, "exportChartImage", () => h),
          n.export(a, "showDeloadVisualization", () => m),
          n.export(a, "weeklyChart", () => o);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r);
        let o = null,
          l = Object.keys(i.default.volumeLandmarks);
        function c() {
          let e = document.getElementById("weeklyChart");
          if (!e) return console.error("Chart canvas not found"), null;
          let t = e.getContext("2d");
          if (!t) return console.error("Cannot get canvas context"), null;
          if ("undefined" == typeof Chart)
            return console.error("Chart.js not loaded"), null;
          let a = l.map((e) => i.default.currentWeekSets[e] || 0),
            s = l.map((e) => i.default.getVolumeColor(e));
          return (o = new Chart(t, {
            type: "bar",
            data: {
              labels: l,
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
                  data: l.map((e) => i.default.volumeLandmarks[e].MEV),
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
                  data: l.map((e) => i.default.volumeLandmarks[e].MRV),
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
                        s = i.default.volumeLandmarks[t],
                        n = i.default.getVolumeStatus(t, a);
                      return [
                        `Status: ${n}`,
                        `MEV: ${s.MEV} | MRV: ${s.MRV}`,
                        `Target RIR: ${i.default.getTargetRIR()}`,
                      ];
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: !0,
                  grid: { color: "rgba(255, 255, 255, 0.1)" },
                  ticks: { color: "#fff", stepSize: 1 },
                },
                x: {
                  grid: { color: "rgba(255, 255, 255, 0.1)" },
                  ticks: { color: "#fff" },
                },
              },
            },
          }));
        }
        function d() {
          if (!o) return;
          let e = l.map((e) => i.default.currentWeekSets[e] || 0),
            t = l.map((e) => i.default.getVolumeColor(e));
          (o.data.datasets[0].data = e),
            (o.data.datasets[0].backgroundColor = t),
            (o.data.datasets[0].borderColor = t.map((e) =>
              e.replace("0.6", "1"),
            )),
            (o.data.datasets[1].data = l.map(
              (e) => i.default.volumeLandmarks[e].MEV,
            )),
            (o.data.datasets[2].data = l.map(
              (e) => i.default.volumeLandmarks[e].MRV,
            )),
            o.update();
        }
        function u() {
          l.forEach((e) => {
            i.default.updateWeeklySets(e, i.default.volumeLandmarks[e].MEV);
          }),
            d();
        }
        function m() {
          if (!o) return;
          let e = l.map((e) =>
            Math.round(0.5 * i.default.volumeLandmarks[e].MEV),
          );
          (o.data.datasets[0].data = e),
            (o.data.datasets[0].backgroundColor = l.map(
              () => "rgba(100, 100, 100, 0.6)",
            )),
            o.update(),
            setTimeout(() => {
              d();
            }, 3e3);
        }
        function g() {
          o &&
            console.log("Volume landmarks are permanently displayed on chart");
        }
        function h() {
          if (!o) return console.warn("No chart available for export"), null;
          try {
            let e = o.toBase64Image("image/png", 1),
              t = document.createElement("a");
            (t.download = `workout-volume-chart-week-${i.default.weekNo}.png`),
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
      },
      {
        "../core/trainingState.js": "iohWK",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    iohWK: [
      function (e, t, a, s) {
        e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(
          a,
        );
        class n {
          constructor() {
            if (n.instance) return n.instance;
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
              (n.instance = this),
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
            let a = this.baselineStrength[e];
            return !!a && !!t && t < 0.97 * a;
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
                r = `${e}-MRV`,
                i = localStorage.getItem(n),
                o = localStorage.getItem(r);
              (i || o) &&
                ((this.volumeLandmarks[e] = {
                  ...this.volumeLandmarks[e],
                  MEV: i ? parseInt(i, 10) : this.volumeLandmarks[e].MEV,
                  MRV: o ? parseInt(o, 10) : this.volumeLandmarks[e].MRV,
                }),
                i && localStorage.removeItem(n),
                o && localStorage.removeItem(r),
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
        let r = new n();
        (a.default = r),
          "undefined" != typeof window && (window.trainingState = r);
      },
      { "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb" },
    ],
    "91HVb": [
      function (e, t, a, s) {
        (a.interopDefault = function (e) {
          return e && e.__esModule ? e : { default: e };
        }),
          (a.defineInteropFlag = function (e) {
            Object.defineProperty(e, "__esModule", { value: !0 });
          }),
          (a.exportAll = function (e, t) {
            return (
              Object.keys(e).forEach(function (a) {
                "default" === a ||
                  "__esModule" === a ||
                  Object.prototype.hasOwnProperty.call(t, a) ||
                  Object.defineProperty(t, a, {
                    enumerable: !0,
                    get: function () {
                      return e[a];
                    },
                  });
              }),
              t
            );
          }),
          (a.export = function (e, t, a) {
            Object.defineProperty(e, t, { enumerable: !0, get: a });
          });
      },
      {},
    ],
    "1HfJW": [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "scoreStimulus", () => l),
          n.export(a, "mevStimulusEstimator", () => l),
          n.export(a, "setProgressionAlgorithm", () => u),
          n.export(a, "rpSetProgression", () => u),
          n.export(a, "analyzeVolumeStatus", () => m),
          n.export(a, "calculateRecoveryVolume", () => g),
          n.export(a, "validateVolumeInput", () => h),
          n.export(a, "getVolumeProgression", () => p),
          n.export(a, "analyzeDeloadNeed", () => f),
          n.export(a, "autoSetIncrement", () => c),
          n.export(a, "processWeeklyVolumeProgression", () => d);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r),
          o = e("./fatigue.js");
        function l({ mmc: e, pump: t, disruption: a }) {
          let s,
            n,
            r,
            i = (e, t, a) => Math.max(t, Math.min(a, e)),
            o = i(e, 0, 3),
            l = i(t, 0, 3),
            c = i(a, 0, 3),
            d = o + l + c;
          return (
            d <= 3
              ? ((s = `Stimulus too low (${d}/9) \u{2192} Add 2 sets next session`),
                (n = "add_sets"),
                (r = 2))
              : d <= 6
                ? ((s = `Stimulus adequate (${d}/9) \u{2192} Keep sets the same`),
                  (n = "maintain"),
                  (r = 0))
                : ((s = `Stimulus excessive (${d}/9) \u{2192} Remove 1-2 sets next session`),
                  (n = "reduce_sets"),
                  (r = -1)),
            {
              score: d,
              advice: s,
              action: n,
              setChange: r,
              breakdown: { mmc: o, pump: l, disruption: c },
            }
          );
        }
        function c(e, t, a) {
          let { MEV: s, MRV: n } = a.volumeLandmarks[e],
            r = a.currentWeekSets[e] || s,
            i = r <= s,
            o = r >= n,
            l = t.stimulus <= 3,
            c = t.soreness <= 1 && t.perf >= 0;
          return o || t.recoverySession
            ? {
                add: !1,
                delta: 0,
                reason: o
                  ? "At MRV - holding volume"
                  : "Recovery session needed",
              }
            : i || (l && c)
              ? {
                  add: !0,
                  delta: Math.min(1 + +!!i, 2),
                  reason: i
                    ? "Starting from MEV - aggressive progression"
                    : "Low stimulus with good recovery",
                }
              : { add: !1, delta: 0, reason: "Maintaining current volume" };
        }
        function d(e, t) {
          let a = {},
            s = !1,
            n = 0;
          return (
            Object.keys(e).forEach((s) => {
              let r = e[s];
              (0, o.isHighFatigue)(s, r, t) &&
                (t.hitMRV(s),
                n++,
                console.log(`hitMRV: true (fatigue) - ${s}`),
                (r.recoverySession = !0));
              let i = c(s, r, t);
              i.add && t.addSets(s, i.delta),
                t.getWeeklySets(s) >= t.volumeLandmarks[s].MRV &&
                  (t.hitMRV(s), n++),
                (a[s] = {
                  previousSets: t.lastWeekSets[s] || t.volumeLandmarks[s].MEV,
                  currentSets: t.getWeeklySets(s),
                  increment: i.delta,
                  reason: i.reason,
                  status: t.getVolumeStatus(s),
                });
            }),
            t.shouldDeload() && (t.startDeload(), (s = !0)),
            {
              progressionLog: a,
              deloadTriggered: s,
              mrvHits: n,
              weekComplete: !0,
              recommendation: s
                ? "Deload phase initiated"
                : "Continue progression",
            }
          );
        }
        function u(e, t) {
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
          ][s][n];
        }
        function m(e, t = null) {
          let a = null !== t ? t : i.default.currentWeekSets[e],
            s = i.default.volumeLandmarks[e];
          if (!s) throw Error(`Unknown muscle group: ${e}`);
          let n = i.default.getVolumeStatus(e, a),
            r = (a / s.MRV) * 100,
            o = "",
            l = "normal";
          switch (n) {
            case "under-minimum":
              (o = `Below MV (${s.MV}). Increase volume significantly.`),
                (l = "high");
              break;
            case "maintenance":
              (o = `In maintenance zone (${s.MV}-${s.MEV}). Consider increasing for growth.`),
                (l = "low");
              break;
            case "optimal":
              (o = `In optimal zone (${s.MEV}-${s.MAV}). Continue progressive overload.`),
                (l = "normal");
              break;
            case "high":
              (o = `High volume zone (${s.MAV}-${s.MRV}). Monitor recovery closely.`),
                (l = "medium");
              break;
            case "maximum":
              (o = `At/above MRV (${s.MRV}). Deload recommended.`),
                (l = "high");
          }
          return {
            muscle: e,
            currentSets: a,
            landmarks: s,
            status: n,
            percentage: Math.round(r),
            recommendation: o,
            urgency: l,
            color: i.default.getVolumeColor(e, a),
          };
        }
        function g(e, t = !1) {
          let a = i.default.volumeLandmarks[e],
            s = i.default.getRecoveryVolume(e, t);
          return {
            muscle: e,
            recommendedSets: s,
            reasoning: t ? "illness adjustment" : "standard recovery",
            landmarks: a,
            percentage: Math.round((s / a.MEV) * 100),
          };
        }
        function h(e, t) {
          let a = i.default.volumeLandmarks[e],
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
        function p(e, t) {
          let a = i.default.currentWeekSets[e],
            s = m(e),
            n = l(t.stimulus),
            r = u(t.soreness, t.performance),
            o = r.setChange,
            c = r.advice;
          if (
            ("maximum" === s.status &&
              o > 0 &&
              ((o = 0), (c = "At MRV limit. Hold sets or consider deload.")),
            "under-minimum" === s.status &&
              o <= 0 &&
              ((o = 2),
              (c = "Below minimum volume. Add sets regardless of fatigue.")),
            "recovery" === r.action)
          ) {
            let s = g(e, t.hasIllness);
            (o = s.recommendedSets - a),
              (c = `Recovery session: ${s.recommendedSets} sets (${s.reasoning})`);
          }
          let d = Math.max(0, a + o);
          return {
            muscle: e,
            currentSets: a,
            projectedSets: d,
            setChange: o,
            advice: c,
            stimulusScore: n.score,
            volumeStatus: s.status,
            targetRIR: i.default.getTargetRIR(),
            deloadRecommended: i.default.shouldDeload(),
          };
        }
        function f() {
          let e = Object.keys(i.default.volumeLandmarks),
            t = e.filter((e) => "maximum" === i.default.getVolumeStatus(e)),
            a = i.default.shouldDeload(),
            s = [];
          return (
            i.default.consecutiveMRVWeeks >= 2 &&
              s.push("Two consecutive weeks at MRV"),
            i.default.totalMusclesNeedingRecovery >= Math.ceil(e.length / 2) &&
              s.push("Most muscles need recovery sessions"),
            i.default.weekNo >= i.default.mesoLen &&
              s.push("End of mesocycle reached"),
            t.length >= Math.ceil(e.length / 3) &&
              s.push(`${t.length} muscle groups at/above MRV`),
            {
              shouldDeload: a,
              reasons: s,
              mrvBreaches: t,
              consecutiveMRVWeeks: i.default.consecutiveMRVWeeks,
              currentWeek: i.default.weekNo,
              mesoLength: i.default.mesoLen,
              musclesNeedingRecovery: i.default.totalMusclesNeedingRecovery,
            }
          );
        }
      },
      {
        "../core/trainingState.js": "iohWK",
        "./fatigue.js": "5s7BT",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    "5s7BT": [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "analyzeFrequency", () => o),
          n.export(a, "calculateOptimalFrequency", () => l),
          n.export(a, "isHighFatigue", () => c);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r);
        function o(e, t, a = null) {
          let s = Math.max(0, e),
            n = Math.max(1, t),
            r = "",
            l = "",
            c = "normal",
            d = 0,
            u = s / n;
          if (
            (u < 0.7
              ? ((r = "You heal early → Add one session per week"),
                (l = "increase_frequency"),
                (d = 1),
                (c = "medium"))
              : u > 1.3
                ? ((r = "Recovery lags → Insert an extra rest day"),
                  (l = "decrease_frequency"),
                  (d = -1),
                  (c = "high"))
                : ((r = "Frequency is optimal"),
                  (l = "maintain"),
                  (d = 0),
                  (c = "normal")),
            a)
          ) {
            let e = i.default.getVolumeStatus(a);
            "maximum" === e &&
              "increase_frequency" === l &&
              ((r = "At MRV - maintain frequency despite early recovery"),
              (l = "maintain"),
              (d = 0)),
              "under-minimum" === e &&
                "decrease_frequency" === l &&
                ((r =
                  "Below MV - consider recovery methods instead of reducing frequency"),
                (l = "improve_recovery"),
                (d = 0));
          }
          return {
            sorenessRecoveryDays: s,
            currentSessionGap: n,
            recoveryRatio: Math.round(100 * u) / 100,
            recommendation: r,
            action: l,
            frequencyAdjustment: d,
            urgency: c,
            muscle: a,
          };
        }
        function l(e, t = {}) {
          let {
              availableDays: a = 6,
              currentVolume: s = null,
              recoveryCapacity: n = "normal",
              trainingAge: r = "intermediate",
            } = t,
            o = s || i.default.currentWeekSets[e],
            c = i.default.volumeLandmarks[e],
            d = {
              beginner: { min: 2, max: 3 },
              intermediate: { min: 2, max: 4 },
              advanced: { min: 3, max: 5 },
            }[r],
            u = 2,
            m = Math.round(
              (u =
                o >= c.MAV
                  ? Math.min(4, Math.ceil(o / 6))
                  : o >= c.MEV
                    ? Math.min(3, Math.ceil(o / 8))
                    : Math.max(2, Math.ceil(o / 10))) *
                { low: 0.8, normal: 1, high: 1.2 }[n],
            ),
            g = Math.max(d.min, Math.min(d.max, m, a)),
            h = Math.ceil(o / g);
          return {
            muscle: e,
            recommendedFrequency: g,
            setsPerSession: h,
            totalVolume: o,
            reasoning: [
              `${o} weekly sets`,
              `${n} recovery capacity`,
              `${r} training age`,
              `${a} available days`,
            ],
            alternatives: {
              conservative: Math.max(2, g - 1),
              aggressive: Math.min(a, g + 1),
            },
          };
        }
        function c(e, t, a) {
          let s = t.soreness || 0,
            n = t.jointAche || 0,
            r = t.perfChange || 0,
            i = (t.pump || 0) + (t.disruption || 0),
            o = !!t.lastLoad && a.repStrengthDrop(e, t.lastLoad);
          return i / (s + n + 2 * (r < 0) || 1) <= 1 || o;
        }
      },
      {
        "../core/trainingState.js": "iohWK",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    dELBV: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "calculateTargetRIR", () => l),
          n.export(a, "validateEffortLevel", () => d),
          n.export(a, "getEffortProgression", () => u),
          n.export(a, "getWeeklyEffortSummary", () => p),
          n.export(a, "getAutoregulationAdvice", () => h),
          n.export(a, "getScheduledRIR", () => c),
          n.export(a, "processWeeklyLoadAdjustments", () => m),
          n.export(a, "getLoadProgression", () => g),
          n.export(a, "simulateWeeklyRIRFeedback", () => f);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r);
        let o = {
          4: [3, 2, 1, 0],
          5: [3, 2.5, 2, 1, 0],
          6: [3, 2.5, 2, 1.5, 1, 0],
        };
        function l(e = null, t = null, a = 3, s = 0.5) {
          let n = e || i.default.weekNo,
            r = t || i.default.mesoLen;
          if (n > r)
            return {
              targetRIR: a,
              warning: "Week exceeds mesocycle length",
              progression: 0,
            };
          let o = Math.max(s, Math.min(a, a - ((a - s) / (r - 1)) * (n - 1))),
            c = "moderate",
            d = "";
          return (
            o >= 2.5
              ? ((c = "low"), (d = "Focus on form and mind-muscle connection"))
              : o >= 2
                ? ((c = "moderate"),
                  (d = "Balanced effort - challenge without excessive fatigue"))
                : o >= 1
                  ? ((c = "high"),
                    (d = "High effort - monitor recovery closely"))
                  : ((c = "maximum"),
                    (d = "Maximum effort - deload approaching")),
            {
              targetRIR: Math.round(2 * o) / 2,
              intensityLevel: c,
              advice: d,
              progression: Math.round(((n - 1) / (r - 1)) * 100),
              week: n,
              mesoLength: r,
            }
          );
        }
        function c(e, t) {
          let a = o[t];
          if (!a) return Math.max(0, 3 - (3 / (t - 1)) * (e - 1));
          let s = Math.min(e - 1, a.length - 1);
          return a[s];
        }
        function d(e, t = null, a = 1) {
          let s = t || i.default.getTargetRIR(),
            n = Math.abs(e - s),
            r = n <= a,
            o = "",
            l = "",
            c = "normal";
          if (r)
            (o = `On target (${e} vs ${s} RIR)`),
              (l = "Continue current effort level"),
              (c = "normal");
          else if (e > s) {
            let t = e - s;
            (o = `Too easy (${t} RIR above target)`),
              (l =
                t > 2
                  ? "Increase weight significantly"
                  : "Increase weight moderately"),
              (c = t > 2 ? "high" : "medium");
          } else {
            let t = s - e;
            (o = `Too hard (${t} RIR below target)`),
              (l =
                t > 2
                  ? "Reduce weight significantly"
                  : "Reduce weight slightly"),
              (c = t > 2 ? "high" : "medium");
          }
          return {
            actualRIR: e,
            targetRIR: s,
            deviation: n,
            isWithinTolerance: r,
            feedback: o,
            recommendation: l,
            urgency: c,
          };
        }
        function u(e, t) {
          let a = i.default.getTargetRIR(),
            s = i.default.getVolumeStatus(e),
            n = "maintain",
            r = 0,
            o = "";
          t.actualRIR < t.targetRIR - 1.5
            ? ((n = "decrease"),
              (r = 0.5),
              (o = "Reduce weight to hit target RIR"))
            : t.actualRIR > t.targetRIR + 1.5
              ? ((n = "increase"),
                (r = -0.5),
                (o = "Increase weight to hit target RIR"))
              : (o =
                  "maximum" === s
                    ? "Maintain weight - at volume limit"
                    : "Good effort level - continue progression"),
            "maximum" === s &&
              "increase" === n &&
              ((n = "maintain"),
              (o = "At MRV - avoid adding intensity stress"));
          let l = Math.max(0, a + r);
          return {
            muscle: e,
            currentTargetRIR: a,
            projectedRIR: l,
            weightRecommendation: n,
            advice: o,
            volumeStatus: s,
          };
        }
        function m(e) {
          let t = i.default.weekNo,
            a = c(t, i.default.mesoLen),
            s = {},
            n = 0;
          return (
            Object.keys(e).forEach((t) => {
              let r = e[t],
                i = r.averageRIR || a,
                o = i - a,
                l = 0,
                c = "";
              0.5 >= Math.abs(o)
                ? ((l = 2.5), (c = "On target - progressive overload"))
                : o > 0.5
                  ? o > 2
                    ? ((l = 10), (c = "Too easy - major increase needed"))
                    : o > 1
                      ? ((l = 7.5), (c = "Too easy - moderate increase"))
                      : ((l = 5), (c = "Slightly easy - small increase"))
                  : o < -2
                    ? ((l = -10), (c = "Too hard - major decrease needed"))
                    : o < -1
                      ? ((l = -5), (c = "Too hard - moderate decrease"))
                      : ((l = -2.5), (c = "Slightly hard - small decrease"));
              let d = r.performanceTrend || 0;
              d < 0
                ? ((l -= 2.5), (c += " (performance declining)"))
                : d > 0 &&
                  o >= 0 &&
                  ((l += 2.5), (c += " (performance improving)")),
                (l = Math.max(-15, Math.min(15, l))),
                (s[t] = {
                  currentRIR: i,
                  targetRIR: a,
                  deviation: o,
                  loadAdjustment: l,
                  reason: c,
                  urgency:
                    Math.abs(o) > 1.5
                      ? "high"
                      : Math.abs(o) > 1
                        ? "medium"
                        : "low",
                }),
                Math.abs(l) > 2.5 && n++;
            }),
            {
              week: t,
              targetRIR: a,
              adjustments: s,
              summary: {
                totalMuscles: Object.keys(e).length,
                musclesAdjusted: n,
                avgLoadChange:
                  Object.values(s).reduce((e, t) => e + t.loadAdjustment, 0) /
                  Object.keys(s).length,
              },
            }
          );
        }
        function g(e, t = {}) {
          let a = i.default.weekNo,
            s = a + 1,
            n = c(a, i.default.mesoLen),
            r = c(s, i.default.mesoLen),
            o = n - r,
            l = (t.averageRIR || n) - n,
            d = 0,
            u = "";
          if (o > 0) {
            let e = 5 * o;
            l > 1
              ? ((d = e + 5),
                (u = `Increase load ${d.toFixed(1)}% for Week ${s} (RIR ${r}) - currently too easy`))
              : l < -1
                ? ((d = 0.5 * e),
                  (u = `Conservative increase ${d.toFixed(1)}% for Week ${s} (RIR ${r}) - struggling with current load`))
                : ((d = e),
                  (u = `Standard increase ${d.toFixed(1)}% for Week ${s} (RIR ${r})`));
          } else
            0 === o
              ? ((d = 2.5),
                (u = `Small progressive overload ${d.toFixed(1)}% for Week ${s} (RIR ${r})`))
              : ((d = 0),
                (u = `Maintain current load for Week ${s} (RIR ${r})`));
          let m = i.default.getVolumeStatus(e);
          return (
            "maximum" === m && ((d *= 0.75), (u += " (reduced due to MRV)")),
            {
              muscle: e,
              currentWeek: a,
              nextWeek: s,
              currentRIR: n,
              nextRIR: r,
              rirDrop: o,
              loadIncrease: Math.round(10 * d) / 10,
              recommendation: u,
              volumeStatus: m,
            }
          );
        }
        function h(e) {
          let {
              actualRIR: t,
              plannedRIR: a,
              setNumber: s,
              totalPlannedSets: n,
              muscle: r,
            } = e,
            i = t - a,
            o = "",
            l = "continue",
            c = 0;
          return (
            s <= Math.ceil(n / 3)
              ? i > 1.5
                ? ((o = "Weight too light - increase by 5-10%"),
                  (l = "increase_weight"),
                  (c = 7.5))
                : i < -1.5
                  ? ((o = "Weight too heavy - decrease by 5-10%"),
                    (l = "decrease_weight"),
                    (c = -7.5))
                  : (o = "Weight appropriate - continue")
              : s <= Math.ceil((2 * n) / 3)
                ? i > 2
                  ? ((o = "Still too easy - increase weight"),
                    (l = "increase_weight"),
                    (c = 5))
                  : i < -2
                    ? ((o = "Too fatiguing - consider stopping early"),
                      (l = "consider_stopping"),
                      (c = 0))
                    : (o = "Good progression - continue")
                : i < -1
                  ? ((o =
                      "Very fatiguing - consider stopping to preserve recovery"),
                    (l = "consider_stopping"))
                  : i > 2
                    ? ((o =
                        "Could push harder - add 1-2 sets if recovering well"),
                      (l = "consider_adding_sets"))
                    : (o = "Appropriate fatigue for final sets"),
            {
              setNumber: s,
              totalPlannedSets: n,
              actualRIR: t,
              plannedRIR: a,
              deviation: i,
              advice: o,
              action: l,
              weightAdjustment: c,
            }
          );
        }
        function p() {
          let e = i.default.weekNo,
            t = i.default.mesoLen,
            a = i.default.getTargetRIR(),
            s = [];
          return (
            1 === e
              ? (s.push("Focus on technique and mind-muscle connection"),
                s.push("Establish baseline weights for the mesocycle"))
              : e === t
                ? (s.push("Peak intensity week - push close to failure"),
                  s.push("Prepare for upcoming deload"))
                : e > 0.75 * t
                  ? (s.push("High intensity phase - monitor recovery closely"),
                    s.push("Focus on performance over volume additions"))
                  : (s.push(
                      "Progressive overload phase - gradually increase demands",
                    ),
                    s.push("Balance volume and intensity progression")),
            {
              currentWeek: e,
              mesoLength: t,
              targetRIR: a,
              weeklyAdvice: s,
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
        function f(e, t) {
          let a = c(t, i.default.mesoLen),
            s = {};
          return (
            e.forEach((e) => {
              let n = i.default.getVolumeStatus(e),
                r = 0,
                o = Math.max(
                  0,
                  a +
                    ("maximum" === n
                      ? 1.5 * Math.random() - 0.5
                      : t <= 2
                        ? 1.5 * Math.random() + 0.5
                        : t >= i.default.mesoLen - 1
                          ? 1.5 * Math.random() - 1
                          : 2 * Math.random() - 1),
                ),
                l = 0,
                c = 0,
                d = 100,
                u = 1;
              "maximum" === n
                ? ((l = Math.floor(3 * Math.random()) + 1),
                  (c = Math.random() > 0.6 ? -1 : 0),
                  (d = 0.95 * i.default.baselineStrength[e]),
                  (u = Math.floor(2 * Math.random()) + 2))
                : "high" === n
                  ? ((l = Math.floor(2 * Math.random())),
                    (c =
                      Math.random() > 0.8 ? -1 : Math.random() > 0.5 ? 0 : 1),
                    (d = 0.98 * i.default.baselineStrength[e]),
                    (u = Math.floor(2 * Math.random()) + 1))
                  : ((l = Math.floor(2 * Math.random())),
                    (c = +(Math.random() > 0.7)),
                    (d = 1.02 * i.default.baselineStrength[e]),
                    (u = Math.floor(2 * Math.random()))),
                (s[e] = {
                  actualRIR: o,
                  targetRIR: a,
                  averageRIR: Math.round(10 * o) / 10,
                  performanceTrend:
                    t > 1 && Math.random() > 0.7
                      ? Math.random() > 0.5
                        ? 1
                        : -1
                      : 0,
                  sessions: 2,
                  volumeStatus: n,
                  soreness: u,
                  jointAche: l,
                  perfChange: c,
                  lastLoad: Math.round(10 * d) / 10,
                  pump: Math.min(3, Math.floor(3 * Math.random()) + 1),
                  disruption: Math.min(3, Math.floor(3 * Math.random()) + 1),
                });
            }),
            s
          );
        }
      },
      {
        "../core/trainingState.js": "iohWK",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    cOYv8: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        function r(e, t = "hypertrophy") {
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
            i = !0,
            o = "",
            l = "",
            c = "normal";
          return (
            a < n.min
              ? ((i = !1),
                (o = `Load too light for ${t} (${a}% < ${n.min}%)`),
                (l = `Increase to ${n.optimal[0]}-${n.optimal[1]}% for optimal ${t} adaptations`),
                (c = "high"))
              : a > n.max
                ? ((i = !1),
                  (o = `Load too heavy for ${t} (${a}% > ${n.max}%)`),
                  (l = `Reduce to ${n.optimal[0]}-${n.optimal[1]}% for safer ${t} training`),
                  (c = "high"))
                : a < n.optimal[0]
                  ? ((o = `Load is light for ${t} (${a}% < ${n.optimal[0]}%)`),
                    (l = `Consider increasing to ${n.optimal[0]}-${n.optimal[1]}% for better stimulus`),
                    (c = "medium"))
                  : a > n.optimal[1]
                    ? ((o = `Load is heavy for ${t} (${a}% > ${n.optimal[1]}%)`),
                      (l = `Consider reducing to ${n.optimal[0]}-${n.optimal[1]}% for better recovery`),
                      (c = "medium"))
                    : (l = `Good load for ${t} training`),
            {
              isValid: i,
              load: a,
              context: t,
              warning: o,
              recommendation: l,
              severity: c,
              range: n,
              isOptimal: a >= n.optimal[0] && a <= n.optimal[1],
            }
          );
        }
        function i(e, t, a = !1) {
          let s = parseInt(e, 10);
          if (isNaN(s) || s < 0)
            return {
              isValid: !1,
              warning: "Set count must be 0 or greater",
              recommendation: "Enter a valid number of sets",
            };
          let { MV: n = 0, MEV: r, MAV: o, MRV: l } = t,
            c = !0,
            d = "",
            u = "",
            m = "normal",
            g = "";
          return (
            s < n
              ? ((g = "below-maintenance"),
                (d = `Below maintenance volume (${s} < ${n})`),
                (u = "Increase sets for minimal stimulus"),
                (m = "high"))
              : s < r
                ? ((g = "maintenance"),
                  (d = `In maintenance zone (${s} < ${r})`),
                  (u = "Increase sets for growth stimulus"),
                  (m = "medium"))
                : s <= o
                  ? ((g = "optimal"),
                    (u = `Optimal volume zone (${r}-${o} sets)`))
                  : s <= l
                    ? ((g = "high"),
                      (d = `High volume zone (${s} approaching ${l})`),
                      (u = "Monitor recovery closely"),
                      (m = "medium"))
                    : ((g = "maximum"),
                      a
                        ? ((d = `Overreaching territory (${s} > ${l})`),
                          (u = "Short-term only - deload soon"))
                        : ((c = !1),
                          (d = `Above maximum recoverable volume (${s} > ${l})`),
                          (u = "Reduce sets or plan deload")),
                      (m = "high")),
            {
              isValid: c,
              sets: s,
              landmarks: t,
              zone: g,
              warning: d,
              recommendation: u,
              severity: m,
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
        n.defineInteropFlag(a),
          n.export(a, "validateLoad", () => r),
          n.export(a, "validateSets", () => i),
          n.export(a, "validateMesocycleLength", () => o);
      },
      { "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb" },
    ],
    "5eA0i": [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "optimizeVolumeLandmarks", () => o),
          n.export(a, "predictDeloadTiming", () => c),
          n.export(a, "adaptiveRIRRecommendations", () => g),
          n.export(a, "detectTrainingPlateaus", () => h),
          n.export(a, "calculateTrajectory", () => d),
          n.export(a, "calculateConfidence", () => l);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r);
        function o(e, t) {
          let a, s;
          if (t.length < 4) return i.default.volumeLandmarks[e];
          let n = t.map((e) => ({
              volume: e.sets,
              stimulus: e.avgStimulus,
              fatigue: e.avgFatigue,
              performance: e.performanceChange,
            })),
            r = (function (e) {
              let t = e.filter((e) => e.stimulus >= 6);
              return 0 === t.length
                ? e[0]?.volume || 6
                : Math.min(...t.map((e) => e.volume));
            })(n),
            o =
              ((a = 0),
              (s = 12),
              n.forEach((e) => {
                let t = e.stimulus / Math.max(1, e.fatigue);
                t > a && ((a = t), (s = e.volume));
              }),
              s),
            c = (function (e) {
              let t = e.filter((e) => e.stimulus / Math.max(1, e.fatigue) < 1);
              return 0 === t.length
                ? Math.max(...e.map((e) => e.volume)) + 2
                : Math.min(...t.map((e) => e.volume)) - 1;
            })(n);
          return {
            MV: i.default.volumeLandmarks[e].MV,
            MEV: Math.round(r),
            MAV: Math.round(o),
            MRV: Math.round(c),
            confidence: l(t.length),
            lastOptimized: new Date().toISOString(),
          };
        }
        function l(e) {
          return e < 4 ? 0 : e < 8 ? 60 : e < 12 ? 80 : 95;
        }
        function c(e) {
          let {
              weeklyFatigueScore: t,
              performanceTrend: a,
              volumeProgression: s,
              motivationLevel: n,
              sleepQuality: r,
            } = e,
            i = d(t),
            o = d(a),
            l = u(i, 75),
            c = u(o, -15, "decline"),
            g = Math.min(l, c);
          return {
            weeksUntilDeload: Math.max(1, g),
            confidence: (function (e, t) {
              let a = m(e);
              return Math.round(((a + m(t)) / 2) * 100);
            })(i, o),
            primaryIndicator: l < c ? "fatigue" : "performance",
            recommendedAction: g <= 2 ? "plan_deload" : "monitor_closely",
            fatigueProjection: i,
            performanceProjection: o,
          };
        }
        function d(e) {
          if (e.length < 2) return { slope: 0, intercept: e[0] || 0 };
          let t = e.length,
            a = e.reduce((e, t, a) => e + a, 0),
            s = e.reduce((e, t) => e + t, 0),
            n =
              (t * e.reduce((e, t, a) => e + a * t, 0) - a * s) /
              (t * e.reduce((e, t, a) => e + a * a, 0) - a * a);
          return { slope: n, intercept: (s - n * a) / t };
        }
        function u(e, t, a = "exceed") {
          let { slope: s, intercept: n } = e;
          return 0 === s ||
            ("decline" === a && s >= 0) ||
            ("exceed" === a && s <= 0)
            ? 1 / 0
            : Math.max(0, (t - n) / s);
        }
        function m(e) {
          return 0.3 * Math.random() + 0.7;
        }
        function g(e, t) {
          var a, s;
          let n = i.default.getTargetRIR(),
            r = i.default.getVolumeStatus(e),
            o =
              (a = t).length < 3
                ? 0.5
                : a.filter(
                    (e) =>
                      e.actualRIR < e.targetRIR - 1 && e.nextDayFatigue > 7,
                  ).length / a.length,
            l = (function (e) {
              if (e.length < 3) return 0.6;
              let t = e
                .filter((e) => e.recoveryDays)
                .map((e) => e.recoveryDays);
              return 0 === t.length
                ? 0.6
                : Math.max(
                    0,
                    Math.min(
                      1,
                      (4 - t.reduce((e, t) => e + t, 0) / t.length) / 3,
                    ),
                  );
            })(t),
            c = (function (e) {
              if (e.length < 3) return 0.7;
              let t = e
                .filter((e) => e.techniqueRating)
                .map((e) => e.techniqueRating);
              return 0 === t.length
                ? 0.7
                : t.reduce((e, t) => e + t, 0) / t.length / 10;
            })(t),
            d = 0,
            u = [];
          o > 0.7
            ? ((d += 0.5), u.push("High overreaching tendency detected"))
            : o < 0.3 &&
              ((d -= 0.5),
              u.push("Low overreaching tendency - can push harder")),
            l > 0.8
              ? ((d -= 0.3), u.push("Fast recovery allows higher intensity"))
              : l < 0.4 &&
                ((d += 0.3),
                u.push("Slow recovery requires more conservative approach")),
            c < 0.6 &&
              ((d += 0.5), u.push("Technique breakdown requires higher RIR"));
          let m = Math.max(0.5, Math.min(4, n + d));
          return {
            baseRIR: n,
            adaptedRIR: Math.round(2 * m) / 2,
            adjustment: d,
            reasoning: u,
            confidence: (s = t.length) < 3 ? 40 : s < 6 ? 60 : s < 10 ? 80 : 95,
            muscle: e,
            volumeStatus: r,
          };
        }
        function h(e) {
          var t;
          let {
              weeklyPerformance: a,
              weeklyVolume: s,
              weeklyIntensity: n,
              weeklyFatigue: r,
            } = e,
            i = p(a, 4),
            o = p(s, 3),
            l = (function (e, t) {
              if (e.length < 3) return !1;
              let a = d(e);
              return "increasing" === t ? a.slope > 0.1 : a.slope < -0.1;
            })(r, "increasing"),
            c = "none",
            u = [],
            m = "low";
          return (
            i && o
              ? ((c = "complete_stagnation"),
                (m = "high"),
                (u = [
                  "Implement planned deload (1-2 weeks)",
                  "Vary exercise selection and rep ranges",
                  "Address potential lifestyle factors",
                  "Consider periodization block change",
                ]))
              : i
                ? ((c = "performance_plateau"),
                  (m = "medium"),
                  (u = [
                    "Increase training intensity (lower RIR)",
                    "Implement exercise variations",
                    "Focus on technique refinement",
                    "Short deload if fatigue is high",
                  ]))
                : o &&
                  l &&
                  ((c = "volume_plateau"),
                  (m = "medium"),
                  (u = [
                    "Prioritize recovery methods",
                    "Implement recovery weeks",
                    "Optimize frequency distribution",
                    "Address sleep and nutrition",
                  ])),
            {
              plateauDetected: "none" !== c,
              plateauType: c,
              urgency: m,
              interventions: u,
              analysisDetails: {
                performanceStagnant: i,
                volumeStagnant: o,
                fatigueAccumulating: l,
              },
              recommendations:
                ((t = 0),
                {
                  complete_stagnation: [
                    "Implement 7-14 day deload immediately",
                    "Complete exercise selection overhaul",
                    "Reassess training age and advancement needs",
                    "Consider block periodization transition",
                  ],
                  performance_plateau: [
                    "Increase intensity via reduced RIR (0.5-1 RIR drop)",
                    "Implement exercise variations or new movements",
                    "Focus on technique refinement sessions",
                    "Add specialization phase for lagging areas",
                  ],
                  volume_plateau: [
                    "Prioritize sleep optimization (8+ hours)",
                    "Implement stress management protocols",
                    "Add extra recovery days between sessions",
                    "Focus on nutrition timing and quality",
                  ],
                }[c] || ["Continue current program with close monitoring"]),
            }
          );
        }
        function p(e, t = 3) {
          if (e.length < t) return !1;
          let a = e.slice(-t);
          return (
            Math.sqrt(
              (function (e) {
                let t = e.reduce((e, t) => e + t, 0) / e.length;
                return (
                  e.map((e) => Math.pow(e - t, 2)).reduce((e, t) => e + t, 0) /
                  e.length
                );
              })(a),
            ) /
              Math.abs(a.reduce((e, t) => e + t, 0) / a.length) <
            0.05
          );
        }
      },
      {
        "../core/trainingState.js": "iohWK",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    gGpfv: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "selectOptimalExercises", () => o),
          n.export(a, "generateWeeklyProgram", () => c),
          n.export(a, "EXERCISE_DATABASE", () => i),
          n.export(a, "formatExerciseName", () => l);
        var r = e("../core/trainingState.js");
        n.interopDefault(r);
        let i = {
          chest: {
            barbell_bench_press: {
              type: "compound",
              primaryMuscles: ["chest"],
              secondaryMuscles: ["triceps", "front_delts"],
              equipment: ["barbell", "bench"],
              fatigueIndex: 8.5,
              skillRequirement: 7,
              ranges: {
                strength: [1, 5],
                hypertrophy: [6, 12],
                endurance: [12, 20],
              },
              biomechanics: {
                rangeOfMotion: "full",
                stabilityRequirement: "high",
                coordination: "moderate",
              },
            },
            dumbbell_bench_press: {
              type: "compound",
              primaryMuscles: ["chest"],
              secondaryMuscles: ["triceps", "front_delts"],
              equipment: ["dumbbells", "bench"],
              fatigueIndex: 7.5,
              skillRequirement: 6,
              ranges: {
                strength: [1, 6],
                hypertrophy: [6, 15],
                endurance: [12, 25],
              },
              biomechanics: {
                rangeOfMotion: "extended",
                stabilityRequirement: "moderate",
                coordination: "moderate",
              },
            },
            push_ups: {
              type: "compound",
              primaryMuscles: ["chest"],
              secondaryMuscles: ["triceps", "front_delts", "core"],
              equipment: ["bodyweight"],
              fatigueIndex: 4,
              skillRequirement: 3,
              ranges: {
                strength: [1, 8],
                hypertrophy: [8, 20],
                endurance: [15, 50],
              },
              biomechanics: {
                rangeOfMotion: "moderate",
                stabilityRequirement: "high",
                coordination: "low",
              },
            },
            incline_dumbbell_press: {
              type: "compound",
              primaryMuscles: ["chest"],
              secondaryMuscles: ["triceps", "front_delts"],
              equipment: ["dumbbells", "incline_bench"],
              fatigueIndex: 7,
              skillRequirement: 5,
              ranges: {
                strength: [1, 6],
                hypertrophy: [6, 15],
                endurance: [12, 20],
              },
              biomechanics: {
                rangeOfMotion: "full",
                stabilityRequirement: "moderate",
                coordination: "moderate",
              },
            },
            cable_flyes: {
              type: "isolation",
              primaryMuscles: ["chest"],
              secondaryMuscles: [],
              equipment: ["cables"],
              fatigueIndex: 5.5,
              skillRequirement: 4,
              ranges: {
                strength: [1, 8],
                hypertrophy: [8, 20],
                endurance: [15, 30],
              },
              biomechanics: {
                rangeOfMotion: "extended",
                stabilityRequirement: "low",
                coordination: "low",
              },
            },
          },
          back: {
            deadlift: {
              type: "compound",
              primaryMuscles: ["back"],
              secondaryMuscles: ["glutes", "hamstrings", "traps"],
              equipment: ["barbell"],
              fatigueIndex: 9.5,
              skillRequirement: 9,
              ranges: {
                strength: [1, 5],
                hypertrophy: [5, 10],
                endurance: [8, 15],
              },
              biomechanics: {
                rangeOfMotion: "full",
                stabilityRequirement: "very_high",
                coordination: "high",
              },
            },
            pull_ups: {
              type: "compound",
              primaryMuscles: ["back"],
              secondaryMuscles: ["biceps", "rear_delts"],
              equipment: ["pull_up_bar"],
              fatigueIndex: 7.5,
              skillRequirement: 6,
              ranges: {
                strength: [1, 6],
                hypertrophy: [5, 12],
                endurance: [10, 20],
              },
              biomechanics: {
                rangeOfMotion: "full",
                stabilityRequirement: "moderate",
                coordination: "moderate",
              },
            },
            barbell_rows: {
              type: "compound",
              primaryMuscles: ["back"],
              secondaryMuscles: ["biceps", "rear_delts"],
              equipment: ["barbell"],
              fatigueIndex: 8,
              skillRequirement: 7,
              ranges: {
                strength: [1, 6],
                hypertrophy: [6, 12],
                endurance: [10, 20],
              },
              biomechanics: {
                rangeOfMotion: "full",
                stabilityRequirement: "high",
                coordination: "high",
              },
            },
            lat_pulldowns: {
              type: "compound",
              primaryMuscles: ["back"],
              secondaryMuscles: ["biceps", "rear_delts"],
              equipment: ["cable_machine"],
              fatigueIndex: 6,
              skillRequirement: 4,
              ranges: {
                strength: [1, 8],
                hypertrophy: [6, 15],
                endurance: [12, 25],
              },
              biomechanics: {
                rangeOfMotion: "full",
                stabilityRequirement: "low",
                coordination: "low",
              },
            },
          },
          quads: {
            back_squat: {
              type: "compound",
              primaryMuscles: ["quads"],
              secondaryMuscles: ["glutes", "core"],
              equipment: ["barbell", "squat_rack"],
              fatigueIndex: 9,
              skillRequirement: 8,
              ranges: {
                strength: [1, 5],
                hypertrophy: [6, 12],
                endurance: [12, 20],
              },
            },
            leg_press: {
              type: "compound",
              primaryMuscles: ["quads"],
              secondaryMuscles: ["glutes"],
              equipment: ["leg_press_machine"],
              fatigueIndex: 6.5,
              skillRequirement: 3,
              ranges: {
                strength: [1, 8],
                hypertrophy: [8, 20],
                endurance: [15, 30],
              },
            },
          },
        };
        function o(e, t = {}) {
          let {
              availableEquipment: a = [
                "barbell",
                "dumbbells",
                "cables",
                "machines",
              ],
              trainingGoal: s = "hypertrophy",
              experienceLevel: n = "intermediate",
              fatigueLevel: r = 5,
              timeConstraint: c = "moderate",
              previousExercises: d = [],
              injuryHistory: u = [],
              preferredStyle: m = "balanced",
            } = t,
            g = i[e.toLowerCase()] || {};
          return 0 === Object.keys(g).length
            ? [
                {
                  name: "No exercises found",
                  score: 0,
                  reasoning: "Muscle not in database",
                },
              ]
            : Object.entries(g)
                .map(([e, t]) => {
                  var i, o, g, h, p, f;
                  let y,
                    v = 0,
                    b = [];
                  if (!t.equipment.every((e) => a.includes(e)))
                    return {
                      name: e,
                      score: 0,
                      reasoning: ["Equipment not available"],
                      exercise: t,
                    };
                  let k = Math.abs(
                    t.skillRequirement -
                      ({ beginner: 3, intermediate: 6, advanced: 9 }[n] || 6),
                  );
                  k <= 2
                    ? ((v += 20), b.push("Skill level appropriate"))
                    : k <= 4
                      ? ((v += 10), b.push("Skill level manageable"))
                      : ((v += 0), b.push("Skill level mismatch"));
                  let S = t.ranges[s];
                  S
                    ? ((v += 15), b.push(`Optimal for ${s}`))
                    : ((v += 5), b.push(`Suboptimal for ${s}`)),
                    (v += 10 - Math.abs(t.fatigueIndex - (10 - r))),
                    t.fatigueIndex <= 10 - r
                      ? b.push("Good fatigue compatibility")
                      : b.push("High fatigue exercise - use carefully"),
                    "high" === c &&
                      ("compound" === t.type
                        ? ((v += 15),
                          b.push("Time-efficient compound movement"))
                        : ((v += 5),
                          b.push("Isolation movement - less time efficient"))),
                    "compound_focused" === m && "compound" === t.type
                      ? ((v += 10), b.push("Matches compound preference"))
                      : "isolation_focused" === m && "isolation" === t.type
                        ? ((v += 10), b.push("Matches isolation preference"))
                        : "balanced" === m &&
                          ((v += 8), b.push("Balanced selection")),
                    d.includes(e)
                      ? ((v -= 5),
                        b.push("Recently used - may cause adaptation plateau"))
                      : ((v += 8), b.push("Novel exercise selection"));
                  let w =
                    ((i = t),
                    (o = u),
                    (y = 0),
                    i.skillRequirement > 7 && o.includes("back") && (y += 3),
                    i.fatigueIndex > 8 && o.length > 0 && (y += 2),
                    i.primaryMuscles.forEach((e) => {
                      o.includes(e) && (y += 4);
                    }),
                    Math.min(5, y));
                  return (
                    w > 0 &&
                      ((v -= 5 * w),
                      b.push(`Injury risk consideration: -${5 * w} points`)),
                    {
                      name: l(e),
                      score: Math.max(0, v),
                      reasoning: b,
                      exercise: t,
                      repRange: S || [6, 12],
                      sets:
                        ((g = t),
                        (h = s),
                        {
                          strength: "compound" === g.type ? 3 : 2,
                          hypertrophy: (g.type, 3),
                          endurance: "compound" === g.type ? 2 : 4,
                        }[h] || 3),
                      rest:
                        ((p = t),
                        (f = s),
                        {
                          strength:
                            "compound" === p.type
                              ? "3-5 minutes"
                              : "2-3 minutes",
                          hypertrophy:
                            "compound" === p.type
                              ? "2-3 minutes"
                              : "1-2 minutes",
                          endurance:
                            "compound" === p.type
                              ? "1-2 minutes"
                              : "30-60 seconds",
                        }[f] || "2-3 minutes"),
                    }
                  );
                })
                .sort((e, t) => t.score - e.score)
                .slice(0, 5);
        }
        function l(e) {
          return e
            .split("_")
            .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
            .join(" ");
        }
        function c(e = {}) {
          let {
              daysPerWeek: t = 4,
              muscleGroups: a = ["chest", "back", "quads", "shoulders"],
              splitType: s = "upper_lower",
              availableEquipment: n = ["barbell", "dumbbells", "cables"],
              experienceLevel: r = "intermediate",
              timePerSession: l = 60,
            } = e,
            d = { splitType: s, daysPerWeek: t, sessions: [] };
          switch (s) {
            case "upper_lower":
            default:
              d.sessions = (function (e, t) {
                let a = [],
                  s = { name: "Upper Body", type: "upper", exercises: [] };
                ["chest", "back", "shoulders", "biceps", "triceps"].forEach(
                  (e) => {
                    if (i[e]) {
                      let a = o(e, t);
                      a.length > 0 &&
                        s.exercises.push({
                          muscle: e,
                          exercise: a[0].name,
                          sets: a[0].sets,
                          reps: a[0].repRange,
                          rest: a[0].rest,
                        });
                    }
                  },
                );
                let n = { name: "Lower Body", type: "lower", exercises: [] };
                ["quads", "hamstrings", "glutes", "calves"].forEach((e) => {
                  if (i[e]) {
                    let a = o(e, t);
                    a.length > 0 &&
                      n.exercises.push({
                        muscle: e,
                        exercise: a[0].name,
                        sets: a[0].sets,
                        reps: a[0].repRange,
                        rest: a[0].rest,
                      });
                  }
                });
                for (let t = 1; t <= e; t++)
                  t % 2 == 1
                    ? a.push({ ...s, day: t })
                    : a.push({ ...n, day: t });
                return a;
              })(t, e);
              break;
            case "push_pull_legs":
              d.sessions = (function (e, t) {
                let a = [],
                  s = {
                    push: {
                      name: "Push (Chest, Shoulders, Triceps)",
                      muscles: ["chest", "shoulders", "triceps"],
                    },
                    pull: {
                      name: "Pull (Back, Biceps)",
                      muscles: ["back", "biceps"],
                    },
                    legs: {
                      name: "Legs (Quads, Hamstrings, Glutes, Calves)",
                      muscles: ["quads", "hamstrings", "glutes", "calves"],
                    },
                  },
                  n = ["push", "pull", "legs"];
                for (let r = 1; r <= e; r++) {
                  let e = n[(r - 1) % 3],
                    l = s[e],
                    c = { name: l.name, type: e, day: r, exercises: [] };
                  l.muscles.forEach((e) => {
                    if (i[e]) {
                      let a = o(e, t);
                      a.length > 0 &&
                        c.exercises.push({
                          muscle: e,
                          exercise: a[0].name,
                          sets: a[0].sets,
                          reps: a[0].repRange,
                          rest: a[0].rest,
                        });
                    }
                  }),
                    a.push(c);
                }
                return a;
              })(t, e);
              break;
            case "full_body":
              d.sessions = (function (e, t) {
                let a = [],
                  s = ["chest", "back", "quads", "shoulders"];
                for (let n = 1; n <= e; n++) {
                  let e = {
                    name: `Full Body - Day ${n}`,
                    type: "full_body",
                    day: n,
                    exercises: [],
                  };
                  s.forEach((a) => {
                    if (i[a]) {
                      let s = o(a, {
                        ...t,
                        previousExercises:
                          n > 1 ? [`exercise_from_day_${n - 1}`] : [],
                      });
                      s.length > 0 &&
                        e.exercises.push({
                          muscle: a,
                          exercise: s[0].name,
                          sets: Math.max(1, s[0].sets - 1),
                          reps: s[0].repRange,
                          rest: s[0].rest,
                        });
                    }
                  }),
                    a.push(e);
                }
                return a;
              })(t, e);
          }
          return d;
        }
      },
      {
        "../core/trainingState.js": "iohWK",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    "6qXhO": [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "LivePerformanceMonitor", () => c),
          n.export(a, "liveMonitor", () => d);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r),
          o = e("./fatigue.js"),
          l = e("./effort.js");
        class c {
          constructor() {
            (this.sessionData = {
              startTime: null,
              currentExercise: null,
              sets: [],
              muscle: null,
              targetRIR: null,
              plannedSets: 0,
              completedSets: 0,
            }),
              (this.isActive = !1),
              (this.callbacks = {});
          }
          startSession(e) {
            let {
              muscle: t,
              exercise: a,
              plannedSets: s = 3,
              targetRIR: n = null,
            } = e;
            return (
              (this.sessionData = {
                startTime: new Date(),
                currentExercise: a,
                sets: [],
                muscle: t,
                targetRIR: n || i.default.getTargetRIR(),
                plannedSets: s,
                completedSets: 0,
              }),
              (this.isActive = !0),
              this.emit("sessionStarted", this.sessionData),
              {
                sessionId: this.generateSessionId(),
                status: "active",
                message: `Session started for ${t} - ${a}`,
              }
            );
          }
          logSet(e) {
            if (!this.isActive) throw Error("No active session");
            let {
                weight: t,
                reps: a,
                rir: s,
                rpe: n = null,
                techniqueRating: r = null,
                notes: i = "",
              } = e,
              o = this.sessionData.sets.length + 1,
              c = new Date(),
              d = this.sessionData.targetRIR,
              u = s - d,
              m = (0, l.validateEffortLevel)(s, d),
              g = {
                setNumber: o,
                timestamp: c,
                weight: t,
                reps: a,
                rir: s,
                rpe: n,
                techniqueRating: r,
                notes: i,
                targetRIR: d,
                rirDeviation: u,
                validation: m,
                estimatedLoad: this.calculateEstimatedLoad(t, a, s),
              };
            this.sessionData.sets.push(g), (this.sessionData.completedSets = o);
            let h = this.generateSetFeedback(g),
              p = this.generateNextSetRecommendations(g);
            return (
              this.emit("setCompleted", {
                setInfo: g,
                feedback: h,
                nextSetRecommendations: p,
                sessionProgress: this.getSessionProgress(),
              }),
              {
                setNumber: o,
                feedback: h,
                nextSetRecommendations: p,
                shouldContinue: this.shouldContinueSession(),
              }
            );
          }
          generateSetFeedback(e) {
            let { rir: t, targetRIR: a, validation: s, weight: n, reps: r } = e,
              i = {
                type: "success",
                message: "",
                urgency: "normal",
                recommendations: [],
              };
            return (
              s.isWithinTolerance
                ? ((i.message = `\u{2705} Perfect effort level (${t} RIR vs ${a} target)`),
                  (i.type = "success"))
                : "high" === s.urgency
                  ? t > a + 1.5
                    ? ((i.message = `\u{26A0}\u{FE0F} Too easy - consider increasing weight next set`),
                      (i.type = "warning"),
                      i.recommendations.push(
                        `Try ${Math.round(1.05 * n)}-${Math.round(1.1 * n)}kg next set`,
                      ))
                    : ((i.message = `\u{1F6A8} Too hard - consider reducing weight or stopping`),
                      (i.type = "danger"),
                      (i.urgency = "high"),
                      i.recommendations.push(
                        `Reduce to ${Math.round(0.9 * n)}-${Math.round(0.95 * n)}kg`,
                      ))
                  : ((i.message = `\u{26A1} Close to target but could be dialed in better`),
                    (i.type = "info")),
              e.setNumber > 1 &&
                this.analyzeIntraSessionTrend().declining &&
                (i.recommendations.push("Consider longer rest between sets"),
                i.recommendations.push(
                  "Monitor for excessive fatigue buildup",
                )),
              i
            );
          }
          generateNextSetRecommendations(e) {
            let { weight: t, reps: a, rir: s, targetRIR: n } = e,
              r = s - n,
              i = {
                weight: t,
                reps: a,
                rest: "2-3 minutes",
                strategy: "maintain",
                rationale: [],
              };
            return (
              r > 1.5
                ? ((i.weight = Math.round(t * (1 + (r > 2.5 ? 0.1 : 0.05)))),
                  (i.strategy = "increase_intensity"),
                  i.rationale.push(
                    `Increase weight due to ${s} RIR (target: ${n})`,
                  ))
                : r < -1.5 &&
                  ((i.weight = Math.round(t * (1 - (r < -2.5 ? 0.1 : 0.05)))),
                  (i.strategy = "reduce_intensity"),
                  i.rationale.push(
                    "Reduce weight due to excessive difficulty",
                  )),
              a < 6 &&
                n <= 2 &&
                ((i.reps = Math.min(a + 1, 8)),
                i.rationale.push("Aim for hypertrophy rep range")),
              s < 1
                ? ((i.rest = "3-4 minutes"),
                  i.rationale.push("Extended rest due to high effort"))
                : s > 3 &&
                  ((i.rest = "1-2 minutes"),
                  i.rationale.push("Shorter rest - effort level manageable")),
              e.setNumber >= 3 &&
                this.assessIntraSetFatigue().high &&
                ((i.strategy = "maintain_or_stop"),
                i.rationale.push("High fatigue detected - consider stopping")),
              i
            );
          }
          analyzeIntraSessionTrend() {
            if (this.sessionData.sets.length < 2)
              return { trending: "insufficient_data" };
            let e = this.sessionData.sets.slice(-3),
              t = e.map((e) => e.rir),
              a = t.every((e, a) => 0 === a || e >= t[a - 1] - 0.5),
              s = e.map((e) => e.estimatedLoad),
              n = s[0] - s[s.length - 1],
              r = n > 0.15 * s[0];
            return {
              declining: r || !a,
              rirTrend: t,
              loadDecline: (n / s[0]) * 100,
              recommendation: r ? "consider_stopping" : "continue",
            };
          }
          assessIntraSetFatigue() {
            let e = this.sessionData.sets.length,
              t = this.calculateAvgRIRDecrease(),
              a = (new Date() - this.sessionData.startTime) / 6e4,
              s = 0;
            return (
              t < 0.3 && (s += 2),
              a > 45 && (s += 1),
              e > this.sessionData.plannedSets + 2 && (s += 2),
              {
                score: s,
                high: s >= 3,
                indicators: {
                  poorRIRProgression: t < 0.3,
                  longSession: a > 45,
                  excessiveSets: e > this.sessionData.plannedSets + 2,
                },
              }
            );
          }
          calculateAvgRIRDecrease() {
            if (this.sessionData.sets.length < 2) return 0;
            let e = this.sessionData.sets.map((e) => e.rir),
              t = [];
            for (let a = 1; a < e.length; a++) t.push(e[a - 1] - e[a]);
            return t.reduce((e, t) => e + t, 0) / t.length;
          }
          calculateEstimatedLoad(e, t, a) {
            return Math.round(e * t * Math.max(0.5, (10 - a) / 10));
          }
          shouldContinueSession() {
            let e = this.assessIntraSetFatigue(),
              t = this.analyzeIntraSessionTrend(),
              a = this.sessionData.plannedSets - this.sessionData.completedSets;
            return e.high
              ? {
                  shouldContinue: !1,
                  reason: "High fatigue detected",
                  recommendation: "Stop session and rest",
                }
              : t.declining && "consider_stopping" === t.recommendation
                ? {
                    shouldContinue: !1,
                    reason: "Significant performance decline",
                    recommendation: "End session to prevent overreaching",
                  }
                : a <= 0
                  ? {
                      shouldContinue: !1,
                      reason: "Planned sets completed",
                      recommendation: "Session complete - good work!",
                    }
                  : {
                      shouldContinue: !0,
                      reason: "Performance maintained",
                      recommendation: `Continue with ${a} sets remaining`,
                    };
          }
          getSessionProgress() {
            let e = this.isActive
                ? (new Date() - this.sessionData.startTime) / 6e4
                : 0,
              t =
                this.sessionData.sets.length > 0
                  ? this.sessionData.sets.reduce((e, t) => e + t.rir, 0) /
                    this.sessionData.sets.length
                  : 0,
              a = this.sessionData.sets.reduce(
                (e, t) => e + t.estimatedLoad,
                0,
              );
            return {
              completedSets: this.sessionData.completedSets,
              plannedSets: this.sessionData.plannedSets,
              progressPercentage:
                (this.sessionData.completedSets /
                  this.sessionData.plannedSets) *
                100,
              duration: Math.round(e),
              averageRIR: Math.round(10 * t) / 10,
              totalLoad: a,
              status: this.isActive ? "active" : "completed",
            };
          }
          endSession() {
            if (!this.isActive) throw Error("No active session to end");
            let e = this.generateSessionSummary();
            return (this.isActive = !1), this.emit("sessionEnded", e), e;
          }
          generateSessionSummary() {
            let e = this.getSessionProgress(),
              t = this.analyzeIntraSessionTrend(),
              a = {
                ...this.sessionData,
                endTime: new Date(),
                progress: e,
                trend: t,
                performance: {
                  targetAchievement: this.calculateTargetAchievement(),
                  consistency: this.calculateConsistency(),
                  volumeLoad: e.totalLoad,
                },
                recommendations: this.generateSessionRecommendations(),
              };
            return this.storeSessionData(a), a;
          }
          calculateTargetAchievement() {
            let e = this.sessionData.sets,
              t = this.sessionData.targetRIR,
              a = e.map((e) => Math.abs(e.rir - t)),
              s = a.reduce((e, t) => e + t, 0) / a.length,
              n = e.filter((e) => 1 >= Math.abs(e.rir - t)).length,
              r = (n / e.length) * 100;
            return {
              averageDeviation: Math.round(10 * s) / 10,
              setsOnTarget: n,
              targetPercentage: Math.round(r),
              grade: r >= 80 ? "A" : r >= 70 ? "B" : r >= 60 ? "C" : "D",
            };
          }
          calculateConsistency() {
            let e = this.sessionData.sets;
            if (e.length < 2) return { score: 0, rating: "insufficient_data" };
            let t = e.map((e) => e.rir),
              a = t.map((e, a) => t[0] + 0.5 * a),
              s = this.calculateVariance(t, a),
              n = e.map((e) => e.estimatedLoad),
              r = this.calculateVariance(n),
              i = Math.max(0, 100 - (50 * s + 50 * r));
            return {
              score: Math.round(i),
              rating:
                i >= 80
                  ? "excellent"
                  : i >= 70
                    ? "good"
                    : i >= 60
                      ? "fair"
                      : "poor",
              rirConsistency: Math.max(0, 100 - 100 * s),
              loadConsistency: Math.max(0, 100 - 100 * r),
            };
          }
          calculateVariance(e, t = null) {
            if (e.length < 2) return 0;
            if (t) {
              let a =
                  e
                    .map((e, a) => Math.pow(e - t[a], 2))
                    .reduce((e, t) => e + t, 0) / e.length,
                s = Math.max(...t);
              return Math.min(1, a / (s * s));
            }
            {
              let t = e.reduce((e, t) => e + t, 0) / e.length;
              return Math.min(
                1,
                e.map((e) => Math.pow(e - t, 2)).reduce((e, t) => e + t, 0) /
                  e.length /
                  (t * t),
              );
            }
          }
          generateSessionRecommendations() {
            let e = [],
              t = this.calculateTargetAchievement(),
              a = this.calculateConsistency();
            return (
              t.averageDeviation > 1.5 &&
                e.push({
                  type: "technique",
                  message: "Focus on better RIR estimation accuracy",
                  priority: "high",
                }),
              a.score < 70 &&
                e.push({
                  type: "consistency",
                  message:
                    "Work on maintaining consistent effort levels throughout sets",
                  priority: "medium",
                }),
              this.sessionData.completedSets <
                0.8 * this.sessionData.plannedSets &&
                e.push({
                  type: "volume",
                  message:
                    "Consider reducing planned volume or improving recovery between sessions",
                  priority: "medium",
                }),
              e
            );
          }
          storeSessionData(e) {
            let t = `session-${this.generateSessionId()}`,
              a = {
                ...e,
                muscle: this.sessionData.muscle,
                exercise: this.sessionData.currentExercise,
                weekNo: i.default.weekNo,
                blockNo: i.default.blockNo,
              };
            localStorage.setItem(t, JSON.stringify(a)),
              this.updateTrainingStateFromSession(a);
          }
          updateTrainingStateFromSession(e) {
            let t = Math.max(...e.sets.map((e) => e.weight)),
              a = i.default.baselineStrength[e.muscle] || 0;
            t > a && i.default.setBaselineStrength(e.muscle, t);
            let s = {
              soreness: e.performance.consistency.score < 70 ? 2 : 1,
              jointAche: 0,
              perfChange: +(t > a),
              pump: e.progress.totalLoad > 1e3 ? 3 : 2,
              disruption: e.progress.totalLoad > 1e3 ? 3 : 2,
              lastLoad: t,
            };
            (0, o.isHighFatigue)(e.muscle, s, i.default) &&
              console.log(
                `High fatigue detected for ${e.muscle} after session`,
              );
          }
          generateSessionId() {
            return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          }
          emit(e, t) {
            this.callbacks[e] && this.callbacks[e].forEach((e) => e(t));
          }
          on(e, t) {
            this.callbacks[e] || (this.callbacks[e] = []),
              this.callbacks[e].push(t);
          }
        }
        let d = new c();
      },
      {
        "../core/trainingState.js": "iohWK",
        "./fatigue.js": "5s7BT",
        "./effort.js": "dELBV",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    bDUtg: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "AdvancedTrainingIntelligence", () => u),
          n.export(a, "advancedIntelligence", () => m);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r),
          o = e("./analytics.js"),
          l = e("./exerciseSelection.js"),
          c = e("./livePerformance.js"),
          d = e("./fatigue.js");
        e("./volume.js");
        class u {
          constructor() {
            (this.analyticsEnabled = !0),
              (this.exerciseSelectionEnabled = !0),
              (this.liveMonitoringEnabled = !0),
              (this.lastOptimization = null),
              (this.trainingInsights = {});
          }
          initialize() {
            return (
              console.log(
                "\uD83E\uDDE0 Advanced Training Intelligence initializing...",
              ),
              this.setupLiveMonitoring(),
              this.initializeAnalytics(),
              console.log("✅ Advanced features ready"),
              {
                analytics: this.analyticsEnabled,
                exerciseSelection: this.exerciseSelectionEnabled,
                liveMonitoring: this.liveMonitoringEnabled,
                message: "Advanced Training Intelligence is online",
              }
            );
          }
          setupLiveMonitoring() {
            this.liveMonitoringEnabled &&
              (c.liveMonitor.on("sessionCompleted", (e) => {
                this.processSessionData(e);
              }),
              c.liveMonitor.on("setCompleted", (e) => {
                this.processLiveSetData(e);
              }));
          }
          initializeAnalytics() {
            let e = this.getHistoricalData();
            e.length >= 4
              ? ((this.analyticsEnabled = !0),
                console.log(
                  `\u{1F4CA} Analytics enabled with ${e.length} weeks of data`,
                ))
              : (console.log(
                  `\u{1F4CA} Analytics disabled - need ${4 - e.length} more weeks of data`,
                ),
                (this.analyticsEnabled = !1));
          }
          getWeeklyIntelligence() {
            let e = {
              week: i.default.weekNo,
              block: i.default.blockNo,
              recommendations: [],
              analytics: null,
              exerciseSelections: {},
              riskAssessment: null,
              optimizations: [],
            };
            if (this.analyticsEnabled) {
              e.analytics = this.generateAnalyticsInsights();
              let t = this.predictDeloadTiming();
              t.weeksUntilDeload <= 2 &&
                e.recommendations.push({
                  type: "deload_prediction",
                  urgency: "high",
                  message: `Deload predicted in ${t.weeksUntilDeload} weeks`,
                  action: t.recommendedAction,
                });
              let a = this.detectPlateaus();
              a.plateauDetected &&
                e.recommendations.push({
                  type: "plateau_intervention",
                  urgency: a.urgency,
                  message: `${a.plateauType} detected`,
                  interventions: a.interventions,
                });
            }
            this.exerciseSelectionEnabled &&
              (e.exerciseSelections = this.generateExerciseRecommendations());
            let t = this.checkForOptimizations();
            return (
              t.length > 0 && (e.optimizations = t),
              (e.riskAssessment = this.assessTrainingRisk()),
              e
            );
          }
          generateAnalyticsInsights() {
            let e = this.getHistoricalData(),
              t = Object.keys(i.default.volumeLandmarks),
              a = {
                volumeLandmarkOptimizations: {},
                adaptiveRIRRecommendations: {},
                performanceTrends: {},
              };
            return (
              t.forEach((t) => {
                let s = e.filter((e) => e.muscle === t);
                if (s.length >= 4) {
                  let e = (0, o.optimizeVolumeLandmarks)(t, s);
                  e.confidence >= 60 && (a.volumeLandmarkOptimizations[t] = e);
                  let n = s.map((e) => ({
                      actualRIR: e.averageRIR,
                      targetRIR: e.targetRIR,
                      nextDayFatigue: e.fatigue,
                      recoveryDays: e.recoveryTime,
                      techniqueRating: e.techniqueRating || 7,
                    })),
                    r = (0, o.adaptiveRIRRecommendations)(t, n);
                  r.confidence >= 60 && (a.adaptiveRIRRecommendations[t] = r);
                }
              }),
              a
            );
          }
          generateExerciseRecommendations() {
            let e = Object.keys(i.default.volumeLandmarks),
              t = {};
            return (
              e.forEach((e) => {
                let a = i.default.getVolumeStatus(e),
                  s = this.estimateFatigueLevel(e),
                  n = (0, l.selectOptimalExercises)(e, {
                    availableEquipment: [
                      "barbell",
                      "dumbbells",
                      "cables",
                      "machines",
                    ],
                    trainingGoal: "hypertrophy",
                    experienceLevel: "intermediate",
                    fatigueLevel: s,
                    timeConstraint: "moderate",
                    previousExercises: this.getRecentExercises(e),
                    preferredStyle:
                      "maximum" === a ? "isolation_focused" : "balanced",
                  });
                t[e] = {
                  primary: n[0],
                  alternatives: n.slice(1, 3),
                  rationale: `Selected based on ${a} volume status and fatigue level ${s}`,
                };
              }),
              t
            );
          }
          checkForOptimizations() {
            let e = [],
              t = this.lastOptimization;
            if (
              (t ? i.default.weekNo - t.week : 1 / 0) >= 4 &&
              this.analyticsEnabled
            ) {
              let t = this.getHistoricalData();
              Object.keys(i.default.volumeLandmarks).forEach((a) => {
                let s = t.filter((e) => e.muscle === a);
                if (s.length >= 6) {
                  let t = (0, o.optimizeVolumeLandmarks)(a, s);
                  t.confidence >= 70 &&
                    e.push({
                      type: "volume_landmarks",
                      muscle: a,
                      currentLandmarks: i.default.volumeLandmarks[a],
                      optimizedLandmarks: t,
                      confidence: t.confidence,
                      estimatedImprovement: this.calculateImprovementEstimate(
                        a,
                        t,
                      ),
                    });
                }
              });
            }
            let a = this.detectStaleExercises();
            return (
              a.length > 0 &&
                e.push({
                  type: "exercise_rotation",
                  staleExercises: a,
                  recommendation:
                    "Consider rotating exercises to prevent adaptation plateau",
                }),
              e
            );
          }
          assessTrainingRisk() {
            let e = [],
              t = 0,
              a = this.getHighFatigueMuscles();
            return (
              a.length > 0 &&
                ((t += 10 * a.length),
                e.push(`${a.length} muscles showing high fatigue`)),
              i.default.consecutiveMRVWeeks >= 2 &&
                ((t += 20), e.push("Multiple consecutive weeks at MRV")),
              this.calculateVolumeProgressionRate() > 2 &&
                ((t += 15), e.push("Rapid volume progression detected")),
              this.detectPerformanceDecline() &&
                ((t += 25), e.push("Performance decline detected")),
              {
                riskScore: t,
                riskLevel:
                  t <= 25
                    ? "low"
                    : t <= 50
                      ? "moderate"
                      : t <= 75
                        ? "high"
                        : "critical",
                riskFactors: e,
                recommendations: this.generateRiskMitigationRecommendations(
                  t,
                  e,
                ),
              }
            );
          }
          processSessionData(e) {
            console.log("\uD83D\uDD04 Processing session data for insights..."),
              (this.trainingInsights[e.muscle] = {
                lastSession: e,
                performance: e.performance,
                consistency: e.performance.consistency,
                updatedAt: new Date(),
              }),
              "D" === e.performance.targetAchievement.grade &&
                console.warn(
                  "⚠️ Poor target achievement - consider technique review",
                ),
              "poor" === e.performance.consistency.rating &&
                console.warn(
                  "⚠️ Poor consistency - fatigue or technique issues",
                );
            let t = this.extractFatigueFromSession(e);
            (0, d.isHighFatigue)(e.muscle, t, i.default) &&
              (console.warn(`\u{1F6A8} High fatigue detected for ${e.muscle}`),
              this.triggerRecoveryRecommendations(e.muscle));
          }
          processLiveSetData(e) {
            e.setInfo.rir > e.setInfo.targetRIR + 2 &&
              console.log(
                "\uD83D\uDCA1 Tip: Consider increasing weight next set",
              ),
              e.setInfo.techniqueRating &&
                e.setInfo.techniqueRating < 6 &&
                console.warn(
                  "⚠️ Technique breakdown detected - consider stopping or reducing weight",
                );
          }
          triggerRecoveryRecommendations(e) {
            let t = {
              immediate: [
                "Reduce training volume by 20-30% next session",
                "Extend rest periods between sets",
                "Focus on technique over intensity",
              ],
              shortTerm: [
                "Add extra rest day before next session",
                "Implement stress management techniques",
                "Prioritize sleep quality (8+ hours)",
              ],
              longTerm: [
                "Consider deload if fatigue persists",
                "Review nutrition and hydration status",
                "Assess life stress factors",
              ],
            };
            return (
              console.log(`\u{1F527} Recovery recommendations for ${e}:`, t), t
            );
          }
          getHistoricalData() {
            let e = [];
            for (let t = 0; t < localStorage.length; t++) {
              let a = localStorage.key(t);
              if (a && a.startsWith("session-"))
                try {
                  let t = JSON.parse(localStorage.getItem(a));
                  e.push(t);
                } catch (e) {
                  console.warn("Failed to parse session data:", a);
                }
            }
            return e.sort(
              (e, t) => new Date(e.startTime) - new Date(t.startTime),
            );
          }
          estimateFatigueLevel(e) {
            let t =
                { "under-minimum": 2, optimal: 4, high: 6, maximum: 8 }[
                  i.default.getVolumeStatus(e)
                ] || 5,
              a = this.trainingInsights[e];
            return (
              a &&
                ("poor" === a.performance.consistency.rating && (t += 2),
                "D" === a.performance.targetAchievement.grade && (t += 1)),
              Math.min(10, Math.max(1, t))
            );
          }
          getRecentExercises(e) {
            return this.getHistoricalData()
              .filter((t) => t.muscle === e)
              .slice(-3)
              .map((e) => e.exercise);
          }
          getHighFatigueMuscles() {
            return Object.keys(i.default.volumeLandmarks).filter(
              (e) => this.estimateFatigueLevel(e) >= 7,
            );
          }
          calculateVolumeProgressionRate() {
            let e = this.getHistoricalData();
            if (e.length < 3) return 0;
            let t = e.slice(-3),
              a = [];
            for (let e = 1; e < t.length; e++) {
              let s = t[e].totalSets - t[e - 1].totalSets;
              a.push(s);
            }
            return a.reduce((e, t) => e + t, 0) / a.length;
          }
          detectPerformanceDecline() {
            let e = this.getHistoricalData();
            if (e.length < 3) return !1;
            let t = e
              .slice(-3)
              .map(
                (e) => e.performance?.targetAchievement?.targetPercentage || 70,
              );
            return t.every((e, a) => 0 === a || e <= t[a - 1]);
          }
          detectStaleExercises() {
            let e = this.getHistoricalData(),
              t = {};
            return (
              e.slice(-6).forEach((e) => {
                let a = `${e.muscle}-${e.exercise}`;
                t[a] = (t[a] || 0) + 1;
              }),
              Object.entries(t)
                .filter(([e, t]) => t >= 4)
                .map(([e, t]) => ({ exercise: e, usageCount: t }))
            );
          }
          generateRiskMitigationRecommendations(e, t) {
            let a = [];
            return (
              e >= 75
                ? (a.push("Implement immediate deload (50% volume reduction)"),
                  a.push("Address sleep and stress management urgently"))
                : e >= 50
                  ? (a.push("Plan deload within 1-2 weeks"),
                    a.push("Reduce volume progression rate"))
                  : e >= 25 &&
                    (a.push("Monitor fatigue indicators closely"),
                    a.push("Ensure adequate recovery between sessions")),
              a
            );
          }
          calculateImprovementEstimate(e, t) {
            let a = i.default.volumeLandmarks[e],
              s = ((t.MEV - a.MEV) / a.MEV) * 100,
              n = ((t.MAV - a.MAV) / a.MAV) * 100;
            return {
              mevChange: Math.round(s),
              mavChange: Math.round(n),
              estimatedVolumeIncrease: Math.round((s + n) / 2),
              confidence: t.confidence,
            };
          }
          extractFatigueFromSession(e) {
            return {
              soreness: "poor" === e.performance.consistency.rating ? 3 : 1,
              jointAche: 0,
              perfChange: +("A" === e.performance.targetAchievement.grade),
              pump: e.progress.totalLoad > 1e3 ? 3 : 2,
              disruption: e.progress.totalLoad > 1e3 ? 3 : 2,
              lastLoad: Math.max(...e.sets.map((e) => e.weight)),
            };
          }
          predictDeloadTiming() {
            if (!this.analyticsEnabled)
              return { weeksUntilDeload: 1 / 0, confidence: 0 };
            let e = this.getHistoricalData(),
              t = {
                weeklyFatigueScore: e
                  .slice(-4)
                  .map((e) => this.estimateFatigueLevel(e.muscle)),
                performanceTrend: e
                  .slice(-4)
                  .map(
                    (e) =>
                      e.performance?.targetAchievement?.targetPercentage || 70,
                  ),
                volumeProgression: e.slice(-4).map((e) => e.totalSets || 0),
                motivationLevel: 7,
                sleepQuality: 7,
              };
            return (0, o.predictDeloadTiming)(t);
          }
          detectPlateaus() {
            if (!this.analyticsEnabled) return { plateauDetected: !1 };
            let e = this.getHistoricalData(),
              t = {
                weeklyPerformance: e
                  .slice(-6)
                  .map(
                    (e) =>
                      e.performance?.targetAchievement?.targetPercentage || 70,
                  ),
                weeklyVolume: e.slice(-6).map((e) => e.totalSets || 0),
                weeklyIntensity: e
                  .slice(-6)
                  .map((e) => (e.averageRIR ? 10 - e.averageRIR : 7)),
                weeklyFatigue: e
                  .slice(-6)
                  .map((e) => this.estimateFatigueLevel(e.muscle)),
              };
            return (0, o.detectTrainingPlateaus)(t);
          }
        }
        let m = new u();
      },
      {
        "../core/trainingState.js": "iohWK",
        "./analytics.js": "5eA0i",
        "./exerciseSelection.js": "gGpfv",
        "./livePerformance.js": "6qXhO",
        "./fatigue.js": "5s7BT",
        "./volume.js": "1HfJW",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    ewacr: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "AdvancedDataVisualizer", () => o),
          n.export(a, "dataVisualizer", () => l);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r);
        class o {
          constructor() {
            this.chartConfigs = {
              performance: this.getPerformanceChartConfig(),
              volume: this.getVolumeChartConfig(),
              fatigue: this.getFatigueChartConfig(),
              intelligence: this.getIntelligenceChartConfig(),
            };
          }
          createTrainingDashboard() {
            let e = this.getHistoricalData();
            return {
              overview: this.generateOverviewMetrics(e),
              trends: this.generateTrendAnalysis(e),
              predictions: this.generatePredictiveAnalytics(e),
              recommendations: this.generateActionableInsights(e),
              visualizations: this.generateChartData(e),
            };
          }
          generatePerformanceTrendChart(e) {
            let t = e.slice(-12);
            return {
              type: "line",
              data: {
                labels: t.map((e) => `Week ${e.weekNo}`),
                datasets: [
                  {
                    label: "Performance Score",
                    data: t.map(
                      (e) =>
                        e.performance?.targetAchievement?.targetPercentage ||
                        70,
                    ),
                    borderColor: "rgb(99, 102, 241)",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    tension: 0.4,
                    fill: !0,
                  },
                  {
                    label: "Fatigue Level",
                    data: t.map((e) => e.fatigueScore || 5),
                    borderColor: "rgb(239, 68, 68)",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    tension: 0.4,
                    yAxisID: "y1",
                  },
                ],
              },
              options: this.getAdvancedChartOptions(),
            };
          }
          generateVolumeHeatmap(e) {
            let t = Object.keys(i.default.volumeLandmarks),
              a = Array.from({ length: 12 }, (e, t) => t + 1);
            return {
              data: t
                .map((t) =>
                  a.map((a) => {
                    let s = e.find((e) => e.weekNo === a && e.muscle === t),
                      n = s?.totalSets || 0,
                      r = i.default.volumeLandmarks[t],
                      o = 0;
                    return (
                      (o =
                        n >= r.MRV
                          ? 1
                          : n >= r.MAV
                            ? 0.8
                            : n >= r.MEV
                              ? 0.6
                              : 0.3),
                      { x: a, y: t, value: n, intensity: o }
                    );
                  }),
                )
                .flat(),
              config: this.getHeatmapConfig(),
            };
          }
          generatePredictiveChart(e) {
            let t = e.slice(-6),
              a = this.calculateTrendLine(
                t.map((e, t) => [
                  t,
                  e.performance?.targetAchievement?.targetPercentage || 70,
                ]),
              ),
              s = this.calculateTrendLine(
                t.map((e, t) => [t, e.fatigueScore || 5]),
              ),
              n = Array.from(
                { length: 4 },
                (e, a) => `Predicted Week ${t.length + a + 1}`,
              ),
              r = Array.from({ length: 4 }, (e, s) =>
                Math.max(
                  0,
                  Math.min(100, a.slope * (t.length + s) + a.intercept),
                ),
              );
            return (
              Array.from({ length: 4 }, (e, a) =>
                Math.max(
                  0,
                  Math.min(10, s.slope * (t.length + a) + s.intercept),
                ),
              ),
              {
                type: "line",
                data: {
                  labels: [...t.map((e) => `Week ${e.weekNo}`), ...n],
                  datasets: [
                    {
                      label: "Historical Performance",
                      data: [
                        ...t.map(
                          (e) =>
                            e.performance?.targetAchievement
                              ?.targetPercentage || 70,
                        ),
                        ...[, , , ,].fill(null),
                      ],
                      borderColor: "rgb(99, 102, 241)",
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      pointRadius: 5,
                    },
                    {
                      label: "Predicted Performance",
                      data: [
                        ...Array(t.length).fill(null),
                        t[t.length - 1]?.performance?.targetAchievement
                          ?.targetPercentage || 70,
                        ...r,
                      ],
                      borderColor: "rgb(99, 102, 241)",
                      backgroundColor: "rgba(99, 102, 241, 0.2)",
                      borderDash: [5, 5],
                      pointRadius: 3,
                    },
                  ],
                },
                options: this.getPredictiveChartOptions(),
              }
            );
          }
          generateMuscleComparisonRadar() {
            let e = Object.keys(i.default.volumeLandmarks);
            i.default.weekNo;
            let t = e.map((e) => {
              let t = i.default.getVolumeStatus(e),
                a = i.default.volumeLandmarks[e],
                s = i.default.currentWeekSets[e] || 0,
                n = (s / a.MEV) * 100;
              return {
                muscle: e,
                efficiency: Math.min(100, n),
                volume: Math.min(100, (s / a.MAV) * 100),
                intensity: Math.min(100, (s / a.MRV) * 100),
                status: this.getVolumeStatusScore(t),
              };
            });
            return {
              type: "radar",
              data: {
                labels: e,
                datasets: [
                  {
                    label: "Current Training Distribution",
                    data: t.map((e) => e.efficiency),
                    borderColor: "rgb(99, 102, 241)",
                    backgroundColor: "rgba(99, 102, 241, 0.2)",
                    pointBackgroundColor: "rgb(99, 102, 241)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgb(99, 102, 241)",
                  },
                ],
              },
              options: this.getRadarChartOptions(),
            };
          }
          generateTrainingTimeline(e) {
            return e.map((e) => {
              let t = [];
              return (
                e.volumeProgression?.deloadTriggered &&
                  t.push({
                    type: "deload",
                    title: "Deload Week",
                    description: "Training volume reduced for recovery",
                    severity: "high",
                  }),
                e.performance?.targetAchievement?.grade === "A" &&
                  t.push({
                    type: "achievement",
                    title: "Excellent Performance",
                    description: "Training targets exceeded",
                    severity: "success",
                  }),
                e.fatigueScore >= 7 &&
                  t.push({
                    type: "warning",
                    title: "High Fatigue Detected",
                    description: "Consider recovery protocols",
                    severity: "warning",
                  }),
                {
                  week: e.weekNo,
                  date: e.startTime,
                  events: t,
                  metrics: {
                    totalVolume: e.totalSets || 0,
                    avgPerformance:
                      e.performance?.targetAchievement?.targetPercentage || 70,
                    fatigueLevel: e.fatigueScore || 5,
                  },
                }
              );
            });
          }
          generateExecutiveSummary(e) {
            let t = e.slice(-4);
            return {
              trainingConsistency: this.calculateConsistency(t),
              performanceTrend: this.calculatePerformanceTrend(t),
              volumeEfficiency: this.calculateVolumeEfficiency(t),
              recoveryStatus: this.calculateRecoveryStatus(t),
              nextActions: this.generateNextActions(t),
              keyInsights: this.generateKeyInsights(t),
            };
          }
          calculateTrendLine(e) {
            let t = e.length,
              a = e.reduce((e, t) => e + t[0], 0),
              s = e.reduce((e, t) => e + t[1], 0),
              n =
                (t * e.reduce((e, t) => e + t[0] * t[1], 0) - a * s) /
                (t * e.reduce((e, t) => e + t[0] * t[0], 0) - a * a);
            return { slope: n, intercept: (s - n * a) / t };
          }
          calculateConsistency(e) {
            return (e.filter((e) => e.totalSets > 0).length / e.length) * 100;
          }
          calculatePerformanceTrend(e) {
            let t = e.map(
              (e) => e.performance?.targetAchievement?.targetPercentage || 70,
            );
            return this.calculateTrendLine(t.map((e, t) => [t, e])).slope;
          }
          getVolumeStatusScore(e) {
            return (
              { "under-minimum": 25, optimal: 75, high: 90, maximum: 100 }[e] ||
              50
            );
          }
          getHistoricalData() {
            let e = [];
            for (let t = 0; t < localStorage.length; t++) {
              let a = localStorage.key(t);
              if (a && a.startsWith("session-"))
                try {
                  let t = JSON.parse(localStorage.getItem(a));
                  e.push(t);
                } catch (e) {
                  console.warn("Failed to parse session data:", a);
                }
            }
            return e.sort(
              (e, t) => new Date(e.startTime) - new Date(t.startTime),
            );
          }
          getAdvancedChartOptions() {
            return {
              responsive: !0,
              interaction: { mode: "index", intersect: !1 },
              scales: {
                x: {
                  display: !0,
                  title: { display: !0, text: "Training Week" },
                },
                y: {
                  type: "linear",
                  display: !0,
                  position: "left",
                  title: { display: !0, text: "Performance %" },
                },
                y1: {
                  type: "linear",
                  display: !0,
                  position: "right",
                  title: { display: !0, text: "Fatigue Level" },
                  grid: { drawOnChartArea: !1 },
                },
              },
            };
          }
          getPredictiveChartOptions() {
            return {
              responsive: !0,
              plugins: {
                title: { display: !0, text: "Performance Prediction Analysis" },
                legend: { display: !0 },
              },
              scales: {
                x: { title: { display: !0, text: "Training Timeline" } },
                y: {
                  title: { display: !0, text: "Performance Score" },
                  min: 0,
                  max: 100,
                },
              },
            };
          }
          generateNextActions(e) {
            let t = [],
              a = e[e.length - 1];
            return (
              a?.fatigueScore >= 7 &&
                t.push("Consider deload or extra recovery day"),
              -2 > this.calculatePerformanceTrend(e) &&
                t.push("Review training intensity and technique"),
              75 > this.calculateConsistency(e) &&
                t.push("Focus on training consistency"),
              t
            );
          }
          generateKeyInsights(e) {
            let t = [],
              a = this.calculatePerformanceTrend(e);
            return (
              a > 2
                ? t.push("Performance is trending upward - excellent progress")
                : a < -2 &&
                  t.push("Performance decline detected - review program"),
              e.reduce((e, t) => e + (t.totalSets || 0), 0) / e.length > 50 &&
                t.push("High volume training detected - monitor recovery"),
              t
            );
          }
        }
        let l = new o();
      },
      {
        "../core/trainingState.js": "iohWK",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    baIS0: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "WellnessRecoverySystem", () => i),
          n.export(a, "wellnessSystem", () => o);
        var r = e("../core/trainingState.js");
        n.interopDefault(r), e("./fatigue.js");
        class i {
          constructor() {
            (this.wellnessMetrics = this.initializeWellnessTracking()),
              (this.recoveryProtocols = this.initializeRecoveryProtocols());
          }
          initializeWellnessTracking() {
            return {
              sleep: {
                duration: 7.5,
                quality: 7,
                efficiency: 85,
                deepSleepPercentage: 20,
                wakeups: 1,
                bedtimeConsistency: 8,
              },
              stress: {
                workStress: 5,
                lifeStress: 4,
                trainingStress: 6,
                overallStress: 5,
                stressManagementPractices: [],
              },
              nutrition: {
                hydration: 7,
                proteinAdequacy: 8,
                carbTiming: 7,
                micronutrients: 6,
                mealTiming: 7,
                supplements: [],
              },
              lifestyle: {
                screenTime: 6,
                sunlightExposure: 5,
                socialConnection: 7,
                natureExposure: 4,
                workLifeBalance: 6,
              },
              physiological: {
                restingHeartRate: 60,
                heartRateVariability: 35,
                bodyTemperature: 98.6,
                bloodPressure: { systolic: 120, diastolic: 80 },
                bodyWeight: 180,
              },
            };
          }
          initializeRecoveryProtocols() {
            return {
              sleep: {
                optimization: [
                  "Maintain consistent bedtime ±30 minutes",
                  "Limit blue light 2 hours before bed",
                  "Keep bedroom temperature 65-68°F (18-20°C)",
                  "Use blackout curtains or eye mask",
                  "Avoid caffeine 8+ hours before bed",
                ],
                intervention: [
                  "Implement progressive muscle relaxation",
                  "Try guided meditation apps (Headspace, Calm)",
                  "Consider magnesium supplementation",
                  "Use white noise or earplugs",
                  "Review medications affecting sleep",
                ],
              },
              stress: {
                daily: [
                  "10-minute meditation or breathing exercises",
                  "Schedule stress-free time blocks",
                  "Practice gratitude journaling",
                  "Limit news/social media consumption",
                  "Engage in enjoyable hobbies",
                ],
                acute: [
                  "Box breathing (4-4-4-4 pattern)",
                  "Progressive muscle relaxation",
                  "Take a walk in nature",
                  "Call a supportive friend/family member",
                  "Use stress management apps",
                ],
                chronic: [
                  "Consider professional counseling",
                  "Evaluate and modify stressors where possible",
                  "Develop robust stress management routine",
                  "Consider stress-reducing supplements",
                  "Implement time management strategies",
                ],
              },
              nutrition: {
                hydration: [
                  "Aim for 35-40ml per kg body weight daily",
                  "Monitor urine color (pale yellow optimal)",
                  "Increase intake during training days",
                  "Add electrolytes for sessions >90 minutes",
                  "Spread intake throughout the day",
                ],
                recovery: [
                  "Consume protein within 2 hours post-workout",
                  "Include anti-inflammatory foods (berries, fatty fish)",
                  "Ensure adequate carbohydrate replenishment",
                  "Consider tart cherry juice for sleep/recovery",
                  "Time largest meals away from bedtime",
                ],
                energy: [
                  "Eat balanced meals every 3-4 hours",
                  "Include complex carbs for sustained energy",
                  "Don't skip breakfast",
                  "Limit processed foods and added sugars",
                  "Consider caffeine timing for training",
                ],
              },
              lifestyle: {
                activeRecovery: [
                  "Light walking for 20-30 minutes",
                  "Gentle yoga or stretching",
                  "Swimming at easy pace",
                  "Foam rolling or self-massage",
                  "Breathing exercises",
                ],
                passiveRecovery: [
                  "Massage therapy",
                  "Sauna or hot bath",
                  "Meditation or mindfulness",
                  "Reading or gentle hobbies",
                  "Quality time with loved ones",
                ],
              },
            };
          }
          trackDailyWellness(e) {
            let t = {
                date: new Date().toISOString().split("T")[0],
                sleep: e.sleep || {},
                stress: e.stress || {},
                nutrition: e.nutrition || {},
                lifestyle: e.lifestyle || {},
                physiological: e.physiological || {},
                recoveryScore: this.calculateRecoveryScore(e),
                readinessScore: this.calculateReadinessScore(e),
                recommendations: this.generateWellnessRecommendations(e),
              },
              a = `wellness-${t.date}`;
            return (
              localStorage.setItem(a, JSON.stringify(t)),
              (this.wellnessMetrics = { ...this.wellnessMetrics, ...e }),
              t
            );
          }
          calculateRecoveryScore(e) {
            let t = 0,
              a = 0;
            return (
              e.sleep &&
                ((t += 0.4 * this.calculateSleepScore(e.sleep)), (a += 0.4)),
              e.stress &&
                ((t += 0.25 * this.calculateStressScore(e.stress)),
                (a += 0.25)),
              e.nutrition &&
                ((t += 0.2 * this.calculateNutritionScore(e.nutrition)),
                (a += 0.2)),
              e.lifestyle &&
                ((t += 0.15 * this.calculateLifestyleScore(e.lifestyle)),
                (a += 0.15)),
              a > 0 ? Math.round(t / a) : 50
            );
          }
          calculateReadinessScore(e) {
            let t = this.calculateRecoveryScore(e),
              a = this.getRecentTrainingLoad(),
              s = this.getCurrentFatigueLevel(),
              n = 0;
            return (
              a.consecutiveHighDays >= 3 && (n -= 15),
              s >= 7 && (n -= 20),
              e.physiological?.restingHeartRate > this.getBaselineHR() + 10 &&
                (n -= 10),
              Math.max(0, Math.min(100, t + n))
            );
          }
          generateWellnessRecommendations(e) {
            let t = {
              priority: [],
              sleep: [],
              stress: [],
              nutrition: [],
              training: [],
            };
            e.sleep?.duration < 7 &&
              (t.priority.push(
                "Prioritize increasing sleep duration to 7-9 hours",
              ),
              t.sleep.push(...this.recoveryProtocols.sleep.optimization)),
              e.sleep?.quality < 6 &&
                t.sleep.push(...this.recoveryProtocols.sleep.intervention),
              e.stress?.overallStress > 7 &&
                (t.priority.push("Implement stress management strategies"),
                t.stress.push(...this.recoveryProtocols.stress.acute)),
              e.nutrition?.hydration < 6 &&
                (t.priority.push("Increase daily hydration"),
                t.nutrition.push(
                  ...this.recoveryProtocols.nutrition.hydration,
                ));
            let a = this.calculateReadinessScore(e);
            return (
              a < 60
                ? (t.priority.push(
                    "Consider reducing training intensity today",
                  ),
                  t.training.push("Focus on technique and movement quality"),
                  t.training.push("Reduce volume by 20-30%"),
                  t.training.push("Include extra warm-up and cool-down"))
                : a > 85 &&
                  (t.training.push("Good day for higher intensity training"),
                  t.training.push("Consider pushing challenging sets")),
              t
            );
          }
          analyzeWellnessTrends(e = 14) {
            let t = this.getWellnessHistory(e);
            return {
              sleep: this.analyzeSleepTrend(t),
              stress: this.analyzeStressTrend(t),
              recovery: this.analyzeRecoveryTrend(t),
              readiness: this.analyzeReadinessTrend(t),
              correlations: this.analyzeWellnessCorrelations(t),
            };
          }
          generateWellnessReport() {
            let e = this.wellnessMetrics,
              t = this.analyzeWellnessTrends(30),
              a = this.analyzeTrainingWellnessImpact();
            return {
              current: {
                recoveryScore: this.calculateRecoveryScore(e),
                readinessScore: this.calculateReadinessScore(e),
                keyMetrics: this.getKeyWellnessMetrics(e),
                alerts: this.generateWellnessAlerts(e),
              },
              trends: t,
              trainingImpact: a,
              recommendations: this.generateWellnessRecommendations(e),
              protocols: this.getPersonalizedProtocols(),
              insights: this.generateWellnessInsights(t, a),
            };
          }
          optimizeTrainingBasedOnWellness(e) {
            let t = this.calculateReadinessScore(this.wellnessMetrics),
              a = this.calculateRecoveryScore(this.wellnessMetrics),
              s = {
                volumeMultiplier: 1,
                intensityMultiplier: 1,
                recommendations: [],
                rationale: "",
              };
            return (
              t >= 85 && a >= 80
                ? ((s.volumeMultiplier = 1.1),
                  (s.intensityMultiplier = 1.05),
                  s.recommendations.push("Excellent day for pushing limits"),
                  (s.rationale =
                    "High wellness scores support increased training stress"))
                : t >= 65
                  ? (s.recommendations.push("Proceed with planned training"),
                    (s.rationale = "Wellness scores support normal training"))
                  : t < 60
                    ? ((s.volumeMultiplier = 0.8),
                      (s.intensityMultiplier = 0.9),
                      s.recommendations.push("Reduce volume and intensity"),
                      s.recommendations.push("Focus on movement quality"),
                      (s.rationale =
                        "Wellness scores suggest increased recovery need"))
                    : t < 40 &&
                      ((s.volumeMultiplier = 0.6),
                      (s.intensityMultiplier = 0.8),
                      s.recommendations.push(
                        "Consider active recovery instead",
                      ),
                      s.recommendations.push(
                        "Light movement, stretching, breathing",
                      ),
                      (s.rationale =
                        "Very low wellness scores require prioritizing recovery")),
              {
                originalTraining: e,
                modifications: s,
                adjustedTraining: this.applyTrainingModifications(e, s),
              }
            );
          }
          calculateSleepScore(e) {
            let t;
            return Math.round(
              0 +
                Math.min(100, (e.duration / 8) * 40) +
                (e.quality / 10) * 30 +
                (e.efficiency / 100) * 20 +
                10 * Math.max(0, (10 - e.wakeups) / 10),
            );
          }
          calculateStressScore(e) {
            return Math.round(
              Math.max(
                0,
                100 -
                  10 * ((e.workStress + e.lifeStress + e.trainingStress) / 3),
              ),
            );
          }
          calculateNutritionScore(e) {
            let t = [
              "hydration",
              "proteinAdequacy",
              "carbTiming",
              "micronutrients",
              "mealTiming",
            ];
            return Math.round(
              (t.reduce((t, a) => t + (e[a] || 5), 0) / t.length / 10) * 100,
            );
          }
          calculateLifestyleScore(e) {
            let t = [
              "screenTime",
              "sunlightExposure",
              "socialConnection",
              "natureExposure",
              "workLifeBalance",
            ];
            return Math.round(
              (t.reduce((t, a) => t + (e[a] || 5), 0) / t.length / 10) * 100,
            );
          }
          getWellnessHistory(e) {
            let t = [],
              a = new Date();
            for (let s = 0; s < e; s++) {
              let e = new Date(a);
              e.setDate(e.getDate() - s);
              let n = `wellness-${e.toISOString().split("T")[0]}`,
                r = localStorage.getItem(n);
              if (r)
                try {
                  t.push(JSON.parse(r));
                } catch (e) {
                  console.warn("Failed to parse wellness data:", n);
                }
            }
            return t.reverse();
          }
          getRecentTrainingLoad() {
            return { consecutiveHighDays: 2, weeklyVolume: 45, intensity: 7 };
          }
          getCurrentFatigueLevel() {
            return 5;
          }
          getBaselineHR() {
            return 60;
          }
          applyTrainingModifications(e, t) {
            return {
              ...e,
              volume: Math.round(e.volume * t.volumeMultiplier),
              intensity: e.intensity * t.intensityMultiplier,
              modifications: t.recommendations,
            };
          }
        }
        let o = new i();
      },
      {
        "../core/trainingState.js": "iohWK",
        "./fatigue.js": "5s7BT",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    gvkvx: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "AdvancedPeriodizationSystem", () => o),
          n.export(a, "periodizationSystem", () => l);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r);
        e("./wellnessIntegration.js"), e("./intelligenceHub.js");
        class o {
          constructor() {
            (this.periodizationModels = this.initializePeriodizationModels()),
              (this.planningTemplates = this.initializePlanningTemplates()),
              (this.adaptationAlgorithms =
                this.initializeAdaptationAlgorithms());
          }
          initializePeriodizationModels() {
            return {
              linear: {
                name: "Linear Periodization",
                description:
                  "Progressive volume increase with intensity modulation",
                phases: [
                  "Accumulation",
                  "Intensification",
                  "Realization",
                  "Deload",
                ],
                volumeProgression: [100, 120, 110, 60],
                intensityProgression: [70, 75, 85, 60],
                duration: 4,
                applications: [
                  "Beginners",
                  "Strength focus",
                  "Competition prep",
                ],
              },
              undulating: {
                name: "Undulating Periodization",
                description: "Frequent variation in volume and intensity",
                phases: ["High Volume", "High Intensity", "Moderate", "Deload"],
                volumeProgression: [130, 80, 100, 60],
                intensityProgression: [70, 90, 80, 60],
                duration: 4,
                applications: [
                  "Intermediate/Advanced",
                  "Hypertrophy",
                  "Avoiding plateaus",
                ],
              },
              block: {
                name: "Block Periodization",
                description:
                  "Focused training blocks with specific adaptations",
                phases: ["Accumulation", "Intensification", "Realization"],
                volumeProgression: [120, 90, 70],
                intensityProgression: [75, 85, 95],
                duration: 3,
                applications: [
                  "Advanced athletes",
                  "Sport-specific",
                  "Competition cycles",
                ],
              },
              conjugate: {
                name: "Conjugate Method",
                description: "Simultaneous development of multiple qualities",
                phases: ["Max Effort", "Dynamic Effort", "Repetition Method"],
                volumeProgression: [90, 110, 120],
                intensityProgression: [95, 70, 80],
                duration: 3,
                applications: [
                  "Powerlifting",
                  "Strength athletes",
                  "Advanced training",
                ],
              },
              autoregulated: {
                name: "Autoregulated Training",
                description:
                  "AI-driven adaptive periodization based on real-time feedback",
                phases: ["Adaptive", "Responsive", "Predictive"],
                volumeProgression: "dynamic",
                intensityProgression: "dynamic",
                duration: "variable",
                applications: [
                  "All levels",
                  "Optimal adaptation",
                  "Injury prevention",
                ],
              },
            };
          }
          initializePlanningTemplates() {
            return {
              hypertrophy12Week: {
                name: "12-Week Hypertrophy Specialization",
                duration: 12,
                phases: [
                  {
                    name: "Foundation Building",
                    weeks: 4,
                    focus: "Volume accumulation and movement quality",
                    volumeMultiplier: 1,
                    intensityRange: [70, 80],
                    exercises: "compound and isolation mix",
                  },
                  {
                    name: "Progressive Overload",
                    weeks: 4,
                    focus: "Systematic volume and intensity increase",
                    volumeMultiplier: 1.2,
                    intensityRange: [75, 85],
                    exercises: "add complexity and variety",
                  },
                  {
                    name: "Peak Volume",
                    weeks: 3,
                    focus: "Maximum tolerable volume",
                    volumeMultiplier: 1.4,
                    intensityRange: [70, 80],
                    exercises: "isolation focus for weak points",
                  },
                  {
                    name: "Deload & Assessment",
                    weeks: 1,
                    focus: "Recovery and progress evaluation",
                    volumeMultiplier: 0.6,
                    intensityRange: [60, 70],
                    exercises: "movement quality and mobility",
                  },
                ],
              },
              strength16Week: {
                name: "16-Week Strength Specialization",
                duration: 16,
                phases: [
                  {
                    name: "General Preparation",
                    weeks: 4,
                    focus: "Movement patterns and base building",
                    volumeMultiplier: 1.1,
                    intensityRange: [70, 80],
                    exercises: "compound movements with accessories",
                  },
                  {
                    name: "Specific Preparation",
                    weeks: 6,
                    focus: "Strength development in competition lifts",
                    volumeMultiplier: 1,
                    intensityRange: [80, 90],
                    exercises: "competition lifts and close variants",
                  },
                  {
                    name: "Competition Preparation",
                    weeks: 4,
                    focus: "Peak strength and competition readiness",
                    volumeMultiplier: 0.8,
                    intensityRange: [85, 100],
                    exercises: "competition lifts only",
                  },
                  {
                    name: "Peaking",
                    weeks: 2,
                    focus: "Peak performance",
                    volumeMultiplier: 0.5,
                    intensityRange: [90, 105],
                    exercises: "competition lifts with opener/attempts",
                  },
                ],
              },
              powerbuilding20Week: {
                name: "20-Week Powerbuilding Program",
                duration: 20,
                phases: [
                  {
                    name: "Hypertrophy Block",
                    weeks: 8,
                    focus: "Muscle mass and volume tolerance",
                    volumeMultiplier: 1.3,
                    intensityRange: [65, 80],
                    exercises: "high volume, pump-focused",
                  },
                  {
                    name: "Strength Block",
                    weeks: 8,
                    focus: "Maximal strength development",
                    volumeMultiplier: 0.9,
                    intensityRange: [80, 95],
                    exercises: "compound movements, heavy loads",
                  },
                  {
                    name: "Power Block",
                    weeks: 3,
                    focus: "Power and speed development",
                    volumeMultiplier: 0.7,
                    intensityRange: [70, 85],
                    exercises: "explosive movements, plyometrics",
                  },
                  {
                    name: "Deload",
                    weeks: 1,
                    focus: "Recovery and reassessment",
                    volumeMultiplier: 0.5,
                    intensityRange: [60, 70],
                    exercises: "movement quality and mobility",
                  },
                ],
              },
            };
          }
          initializeAdaptationAlgorithms() {
            return {
              volumeAdaptation: {
                minIncrease: 0.05,
                maxIncrease: 0.25,
                baseIncrease: 0.1,
                fatigueThreshold: 7,
                recoveryThreshold: 5,
              },
              intensityAdaptation: {
                minIncrease: 0.025,
                maxIncrease: 0.1,
                baseIncrease: 0.05,
                performanceThreshold: 80,
                plateauThreshold: 75,
              },
              frequencyAdaptation: {
                minFrequency: 1,
                maxFrequency: 4,
                recoveryFactor: 0.8,
                volumeFactor: 1.2,
              },
            };
          }
          createLongTermPlan(e, t = 16) {
            let a = this.analyzeUserProfile(),
              s = this.selectOptimalPeriodization(e, a),
              n = this.generatePlanStructure(s, t, e),
              r = this.generateWeeklyPlans(n),
              i = this.createProgressionPlan(r);
            return {
              overview: {
                duration: t,
                model: s.name,
                goals: e,
                userProfile: a,
                startDate: new Date(),
                estimatedCompletion: this.calculateCompletionDate(t),
              },
              structure: n,
              weeklyPlans: r,
              progressionPlan: i,
              adaptationTriggers: this.defineAdaptationTriggers(),
              milestones: this.definePlanMilestones(t, e),
              contingencyPlans: this.createContingencyPlans(),
            };
          }
          analyzeUserProfile() {
            let e = this.getHistoricalTrainingData(),
              t = this.assessCurrentCapacity(),
              a = this.analyzeResponsePatterns(e);
            return {
              experience: this.determineExperienceLevel(e),
              capacity: t,
              responsePatterns: a,
              preferences: this.analyzeTrainingPreferences(e),
              limitingFactors: this.identifyLimitingFactors(),
              adaptationRate: this.calculateAdaptationRate(e),
            };
          }
          selectOptimalPeriodization(e, t) {
            let a = {};
            Object.entries(this.periodizationModels).forEach(([s, n]) => {
              let r = 0;
              "hypertrophy" === e.primary &&
                n.applications.includes("Hypertrophy") &&
                (r += 3),
                "strength" === e.primary &&
                  n.applications.includes("Strength focus") &&
                  (r += 3),
                "powerlifting" === e.primary &&
                  n.applications.includes("Powerlifting") &&
                  (r += 3),
                "beginner" === t.experience &&
                  n.applications.includes("Beginners") &&
                  (r += 2),
                "intermediate" === t.experience &&
                  n.applications.includes("Intermediate/Advanced") &&
                  (r += 2),
                "advanced" === t.experience &&
                  n.applications.includes("Advanced athletes") &&
                  (r += 2),
                "fast" === t.adaptationRate && "undulating" === s && (r += 1),
                "slow" === t.adaptationRate && "linear" === s && (r += 1),
                "high" === t.responsePatterns.variabilityTolerance &&
                  "conjugate" === s &&
                  (r += 1),
                (a[s] = r);
            });
            let s = Object.keys(a).reduce((e, t) => (a[e] > a[t] ? e : t));
            return this.periodizationModels[s];
          }
          generateWeeklyPlans(e) {
            let t = [],
              a = 1;
            return (
              e.phases.forEach((e) => {
                for (let s = 0; s < e.weeks; s++) {
                  let n = this.generateWeekPlan(e, s, a);
                  t.push(n), a++;
                }
              }),
              t
            );
          }
          generateWeekPlan(e, t, a) {
            let s = Object.keys(i.default.volumeLandmarks),
              n = (t + 1) / e.weeks,
              r = {
                week: a,
                phase: e.name,
                focus: e.focus,
                progressionFactor: n,
                muscles: {},
              };
            return (
              s.forEach((t) => {
                let a = i.default.volumeLandmarks[t],
                  s = this.adjustLandmarksForPhase(a, e, n);
                r.muscles[t] = {
                  landmarks: s,
                  targetSets: this.calculateTargetSets(s, e),
                  intensityRange: e.intensityRange,
                  exerciseSelection: this.selectPhaseExercises(t, e),
                  loadProgression: this.calculateLoadProgression(e, n),
                  recoveryRequirements: this.calculateRecoveryRequirements(
                    t,
                    e,
                  ),
                };
              }),
              r
            );
          }
          createProgressionPlan(e) {
            return {
              volumeProgression: this.createVolumeProgression(e),
              intensityProgression: this.createIntensityProgression(e),
              exerciseProgression: this.createExerciseProgression(e),
              deloadTriggers: this.defineDeloadTriggers(),
              adaptationChecks: this.scheduleAdaptationChecks(e),
              autoAdjustmentRules: this.defineAutoAdjustmentRules(),
            };
          }
          adaptPlanBasedOnPerformance(e, t) {
            let a = {
                volumeAdjustment: 1,
                intensityAdjustment: 1,
                frequencyAdjustment: 1,
                exerciseModifications: [],
                phaseModifications: [],
                reasoning: [],
              },
              s = this.analyzePerformanceTrend(t),
              n = this.assessFatigueStatus(t),
              r = this.assessWellnessImpact();
            return (
              "declining" === s.direction &&
                s.significance > 0.7 &&
                ((a.volumeAdjustment = 0.85),
                (a.intensityAdjustment = 0.9),
                a.reasoning.push(
                  "Performance decline detected - reducing training stress",
                )),
              "high" === n.level &&
                n.duration >= 3 &&
                ((a.volumeAdjustment *= 0.8),
                a.reasoning.push(
                  "Sustained high fatigue - additional volume reduction",
                )),
              r.readiness < 60 &&
                ((a.frequencyAdjustment = 0.8),
                a.reasoning.push(
                  "Low wellness readiness - reducing training frequency",
                )),
              "improving" === s.direction &&
                "low" === n.level &&
                ((a.volumeAdjustment = 1.1),
                a.reasoning.push(
                  "Strong performance with low fatigue - increasing volume",
                )),
              this.applyPlanAdaptations(e, a)
            );
          }
          generateIntelligentDeload(e) {
            let t = this.calculateDeloadIntensity(e),
              a = this.calculateDeloadDuration(e),
              s = this.selectDeloadActivities(e);
            return {
              type: this.determineDeloadType(e),
              intensity: t,
              duration: a,
              activities: s,
              volumeReduction: this.calculateVolumeReduction(t),
              intensityReduction: this.calculateIntensityReduction(t),
              focusAreas: this.identifyDeloadFocusAreas(e),
              returnCriteria: this.defineReturnCriteria(e),
              monitoring: this.defineDeloadMonitoring(),
            };
          }
          createPeakingProtocol(e, t) {
            let a = this.definePeakingPhases(t);
            return {
              phases: a,
              tapering: this.createTaperingPlan(t),
              competitionPrep: this.createCompetitionPrep(e),
              timeline: this.createPeakingTimeline(t),
              keyWorkouts: this.scheduleKeyWorkouts(t),
              recoveryProtocol: this.createPeakingRecoveryProtocol(),
              nutritionGuidance: this.createPeakingNutritionPlan(),
              mentalPreparation: this.createMentalPrepPlan(),
            };
          }
          determineExperienceLevel(e) {
            let t = e.length,
              a = this.calculateConsistency(e),
              s = this.calculateProgressionRate(e);
            return t < 12 || a < 60
              ? "beginner"
              : t < 52 || s > 0.8
                ? "intermediate"
                : "advanced";
          }
          assessCurrentCapacity() {
            return {
              totalVolume: Object.keys(i.default.volumeLandmarks).reduce(
                (e, t) => e + i.default.volumeLandmarks[t].MRV,
                0,
              ),
              muscleDistribution: this.analyzeMuscleDistribution(),
              recoveryCapacity: this.assessRecoveryCapacity(),
              adaptationPotential: this.assessAdaptationPotential(),
            };
          }
          calculateTargetSets(e, t) {
            return Math.round(((e.MEV + e.MAV) / 2) * t.volumeMultiplier);
          }
          getHistoricalTrainingData() {
            let e = [];
            for (let t = 0; t < localStorage.length; t++) {
              let a = localStorage.key(t);
              if (a && a.startsWith("session-"))
                try {
                  let t = JSON.parse(localStorage.getItem(a));
                  e.push(t);
                } catch (e) {
                  console.warn("Failed to parse session data:", a);
                }
            }
            return e.sort(
              (e, t) => new Date(e.startTime) - new Date(t.startTime),
            );
          }
          calculateCompletionDate(e) {
            let t = new Date(new Date());
            return t.setDate(t.getDate() + 7 * e), t;
          }
        }
        let l = new o();
      },
      {
        "../core/trainingState.js": "iohWK",
        "./wellnessIntegration.js": "baIS0",
        "./intelligenceHub.js": "bDUtg",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    iZ0Js: [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "DataExportManager", () => o),
          n.export(a, "dataExportManager", () => l);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r);
        class o {
          constructor() {
            (this.exportFormats = ["json", "csv", "excel"]),
              (this.compressionEnabled = !0),
              (this.encryptionEnabled = !1);
          }
          exportAllData(e = "json", t = {}) {
            let {
              includePersonalData: a = !0,
              includeAnalytics: s = !0,
              includeWellness: n = !0,
              dateRange: r = null,
              compress: i = this.compressionEnabled,
            } = t;
            try {
              let t = this.gatherExportData({
                includePersonalData: a,
                includeAnalytics: s,
                includeWellness: n,
                dateRange: r,
              });
              switch (e.toLowerCase()) {
                case "json":
                  return this.exportAsJSON(t, i);
                case "csv":
                  return this.exportAsCSV(t);
                case "excel":
                  return this.exportAsExcel(t);
                default:
                  throw Error(`Unsupported export format: ${e}`);
              }
            } catch (e) {
              return (
                console.error("Export failed:", e),
                {
                  success: !1,
                  error: e.message,
                  timestamp: new Date().toISOString(),
                }
              );
            }
          }
          gatherExportData(e) {
            let {
                includePersonalData: t,
                includeAnalytics: a,
                includeWellness: s,
                dateRange: n,
              } = e,
              r = {
                metadata: {
                  exportDate: new Date().toISOString(),
                  appVersion: "2.0.0",
                  exportType: "full",
                  dataPoints: 0,
                },
                trainingState: null,
                sessionHistory: [],
                feedback: [],
                analytics: null,
                wellness: null,
                preferences: null,
              };
            return (
              t &&
                ((r.trainingState = this.serializeTrainingState()),
                (r.preferences = this.gatherUserPreferences())),
              (r.sessionHistory = this.gatherSessionHistory(n)),
              (r.feedback = this.gatherFeedbackData(n)),
              a && (r.analytics = this.gatherAnalyticsData(n)),
              s && (r.wellness = this.gatherWellnessData(n)),
              (r.metadata.dataPoints = this.calculateDataPoints(r)),
              r
            );
          }
          serializeTrainingState() {
            return {
              volumeLandmarks: i.default.volumeLandmarks,
              currentSets: i.default.currentSets,
              weekNo: i.default.weekNo,
              blockNo: i.default.blockNo,
              deloadWeeks: i.default.deloadWeeks,
              targetRIR: i.default.getTargetRIR(),
              currentPhase: i.default.getCurrentPhase(),
              stateHistory: i.default.getStateHistory(),
              totalMusclesNeedingRecovery:
                i.default.totalMusclesNeedingRecovery,
              recoverySessionsThisWeek: i.default.recoverySessionsThisWeek,
            };
          }
          gatherSessionHistory(e) {
            let t = [];
            for (let a = 0; a < localStorage.length; a++) {
              let s = localStorage.key(a);
              if (s && s.startsWith("session-"))
                try {
                  let a = JSON.parse(localStorage.getItem(s));
                  this.isWithinDateRange(a.timestamp, e) &&
                    t.push({ sessionId: s, ...a });
                } catch (e) {
                  console.warn(`Failed to parse session data: ${s}`, e);
                }
            }
            return t.sort(
              (e, t) => new Date(e.timestamp) - new Date(t.timestamp),
            );
          }
          gatherFeedbackData(e) {
            let t = [];
            for (let a = 0; a < localStorage.length; a++) {
              let s = localStorage.key(a);
              if (s && s.startsWith("feedback-"))
                try {
                  let a = JSON.parse(localStorage.getItem(s));
                  this.isWithinDateRange(a.timestamp, e) &&
                    t.push({ feedbackId: s, ...a });
                } catch (e) {
                  console.warn(`Failed to parse feedback data: ${s}`, e);
                }
            }
            return t.sort(
              (e, t) => new Date(e.timestamp) - new Date(t.timestamp),
            );
          }
          gatherAnalyticsData(e) {
            let t = {
              volumeOptimizations: [],
              deloadPredictions: [],
              plateauAnalyses: [],
              performanceMetrics: [],
            };
            for (let a = 0; a < localStorage.length; a++) {
              let s = localStorage.key(a);
              if (
                s &&
                (s.startsWith("analytics-") || s.startsWith("optimization-"))
              )
                try {
                  let a = JSON.parse(localStorage.getItem(s));
                  this.isWithinDateRange(a.timestamp, e) &&
                    (s.includes("volume")
                      ? t.volumeOptimizations.push(a)
                      : s.includes("deload")
                        ? t.deloadPredictions.push(a)
                        : s.includes("plateau") && t.plateauAnalyses.push(a));
                } catch (e) {
                  console.warn(`Failed to parse analytics data: ${s}`, e);
                }
            }
            return t;
          }
          gatherWellnessData(e) {
            let t = [];
            for (let a = 0; a < localStorage.length; a++) {
              let s = localStorage.key(a);
              if (s && s.startsWith("wellness-"))
                try {
                  let a = JSON.parse(localStorage.getItem(s));
                  this.isWithinDateRange(a.date, e) && t.push(a);
                } catch (e) {
                  console.warn(`Failed to parse wellness data: ${s}`, e);
                }
            }
            return t.sort((e, t) => new Date(e.date) - new Date(t.date));
          }
          gatherUserPreferences() {
            return {
              theme: localStorage.getItem("user-theme") || "dark",
              units: localStorage.getItem("user-units") || "metric",
              notifications:
                localStorage.getItem("user-notifications") || "enabled",
              autoProgression:
                localStorage.getItem("user-auto-progression") || "enabled",
              analyticsEnabled:
                localStorage.getItem("analytics-enabled") || "true",
            };
          }
          exportAsJSON(e, t = !1) {
            try {
              let a = JSON.stringify(e, null, 2 * !t),
                s = new Blob([a], { type: "application/json" }),
                n = `powerhouseatx-backup-${this.getDateString()}.json`;
              return (
                this.downloadBlob(s, n),
                {
                  success: !0,
                  filename: n,
                  size: s.size,
                  format: "JSON",
                  dataPoints: e.metadata.dataPoints,
                  timestamp: new Date().toISOString(),
                }
              );
            } catch (e) {
              throw Error(`JSON export failed: ${e.message}`);
            }
          }
          exportAsCSV(e) {
            try {
              let t = this.convertToCSV(e),
                a = new Blob([t], { type: "text/csv" }),
                s = `powerhouseatx-data-${this.getDateString()}.csv`;
              return (
                this.downloadBlob(a, s),
                {
                  success: !0,
                  filename: s,
                  size: a.size,
                  format: "CSV",
                  dataPoints: e.metadata.dataPoints,
                  timestamp: new Date().toISOString(),
                }
              );
            } catch (e) {
              throw Error(`CSV export failed: ${e.message}`);
            }
          }
          convertToCSV(e) {
            let t = "";
            return (
              e.sessionHistory.length > 0 &&
                ((t +=
                  "SESSION DATA\nDate,Muscle,Exercise,Sets,Reps,Weight,RIR,Performance,Duration\n"),
                e.sessionHistory.forEach((e) => {
                  t += `${e.timestamp},${e.muscle || ""},${e.exercise || ""},${e.sets || ""},${e.reps || ""},${e.weight || ""},${e.rir || ""},${e.performance || ""},${e.duration || ""}
`;
                }),
                (t += "\n")),
              e.feedback.length > 0 &&
                ((t +=
                  "FEEDBACK DATA\nDate,Muscle,Current Sets,MMC,Pump,Disruption,Performance,Soreness,Recommendation\n"),
                e.feedback.forEach((e) => {
                  t += `${e.timestamp},${e.muscle},${e.currentSets},${e.stimulus?.mmc || ""},${e.stimulus?.pump || ""},${e.stimulus?.disruption || ""},${e.performance},${e.soreness},${e.results?.recommendedAction?.advice || ""}
`;
                }),
                (t += "\n")),
              e.wellness &&
                e.wellness.length > 0 &&
                ((t +=
                  "WELLNESS DATA\nDate,Recovery Score,Readiness Score,Sleep Duration,Sleep Quality,Stress Level\n"),
                e.wellness.forEach((e) => {
                  t += `${e.date},${e.recoveryScore},${e.readinessScore},${e.sleep?.duration || ""},${e.sleep?.quality || ""},${e.stress?.overall || ""}
`;
                })),
              t
            );
          }
          async importData(e, t = {}) {
            let { overwrite: a = !1, merge: s = !0 } = t;
            try {
              let t,
                n = await this.readFile(e);
              if (e.name.endsWith(".json")) t = JSON.parse(n);
              else if (e.name.endsWith(".csv")) t = this.parseCSV(n);
              else throw Error("Unsupported file format");
              return this.processImportData(t, { overwrite: a, merge: s });
            } catch (e) {
              return {
                success: !1,
                error: e.message,
                timestamp: new Date().toISOString(),
              };
            }
          }
          processImportData(e, t) {
            let { overwrite: a, merge: s } = t,
              n = {
                success: !0,
                imported: {
                  trainingState: !1,
                  sessions: 0,
                  feedback: 0,
                  wellness: 0,
                  analytics: 0,
                },
                warnings: [],
                errors: [],
              };
            try {
              return (
                e.trainingState &&
                  (a || !i.default.hasData()
                    ? (this.importTrainingState(e.trainingState),
                      (n.imported.trainingState = !0))
                    : s &&
                      (this.mergeTrainingState(e.trainingState),
                      (n.imported.trainingState = !0),
                      n.warnings.push(
                        "Training state merged with existing data",
                      ))),
                e.sessionHistory &&
                  (n.imported.sessions = this.importSessionHistory(
                    e.sessionHistory,
                    a,
                  )),
                e.feedback &&
                  (n.imported.feedback = this.importFeedback(e.feedback, a)),
                e.wellness &&
                  (n.imported.wellness = this.importWellness(e.wellness, a)),
                e.analytics &&
                  (n.imported.analytics = this.importAnalytics(e.analytics, a)),
                (n.timestamp = new Date().toISOString()),
                n
              );
            } catch (e) {
              return (n.success = !1), n.errors.push(e.message), n;
            }
          }
          createAutoBackup() {
            let e = this.gatherExportData({
                includePersonalData: !0,
                includeAnalytics: !0,
                includeWellness: !0,
              }),
              t = `backup-${this.getDateString()}`,
              a = JSON.stringify(e);
            try {
              return (
                localStorage.setItem(t, a),
                this.cleanOldBackups(),
                {
                  success: !0,
                  backupKey: t,
                  size: a.length,
                  dataPoints: e.metadata.dataPoints,
                  timestamp: new Date().toISOString(),
                }
              );
            } catch (e) {
              return {
                success: !1,
                error: e.message,
                timestamp: new Date().toISOString(),
              };
            }
          }
          getAvailableBackups() {
            let e = [];
            for (let t = 0; t < localStorage.length; t++) {
              let a = localStorage.key(t);
              if (a && a.startsWith("backup-"))
                try {
                  let t = localStorage.getItem(a),
                    s = JSON.parse(t).metadata;
                  e.push({
                    key: a,
                    date: s.exportDate,
                    dataPoints: s.dataPoints,
                    size: t.length,
                  });
                } catch (e) {
                  console.warn(`Failed to parse backup: ${a}`, e);
                }
            }
            return e.sort((e, t) => new Date(t.date) - new Date(e.date));
          }
          restoreFromBackup(e) {
            try {
              let t = localStorage.getItem(e);
              if (!t) throw Error("Backup not found");
              let a = JSON.parse(t);
              return this.processImportData(a, { overwrite: !0, merge: !1 });
            } catch (e) {
              return {
                success: !1,
                error: e.message,
                timestamp: new Date().toISOString(),
              };
            }
          }
          isWithinDateRange(e, t) {
            if (!t) return !0;
            let a = new Date(e),
              s = t.start ? new Date(t.start) : null,
              n = t.end ? new Date(t.end) : null;
            return (!s || !(a < s)) && (!n || !(a > n));
          }
          calculateDataPoints(e) {
            return (
              (e.sessionHistory?.length || 0) +
              (e.feedback?.length || 0) +
              (e.wellness?.length || 0) +
              (e.analytics?.volumeOptimizations?.length || 0) +
              (e.analytics?.deloadPredictions?.length || 0)
            );
          }
          getDateString() {
            return new Date().toISOString().split("T")[0];
          }
          downloadBlob(e, t) {
            let a = URL.createObjectURL(e),
              s = document.createElement("a");
            (s.href = a),
              (s.download = t),
              document.body.appendChild(s),
              s.click(),
              document.body.removeChild(s),
              URL.revokeObjectURL(a);
          }
          readFile(e) {
            return new Promise((t, a) => {
              let s = new FileReader();
              (s.onload = (e) => t(e.target.result)),
                (s.onerror = (e) => a(Error("Failed to read file"))),
                s.readAsText(e);
            });
          }
          cleanOldBackups() {
            let e = this.getAvailableBackups();
            e.length > 5 &&
              e.slice(5).forEach((e) => {
                localStorage.removeItem(e.key);
              });
          }
          importTrainingState(e) {
            Object.keys(e.volumeLandmarks).forEach((t) => {
              i.default.updateVolumeLandmarks(t, e.volumeLandmarks[t]);
            }),
              Object.keys(e.currentSets).forEach((t) => {
                i.default.setSets(t, e.currentSets[t]);
              }),
              (i.default.weekNo = e.weekNo),
              (i.default.blockNo = e.blockNo);
          }
          importSessionHistory(e, t) {
            let a = 0;
            return (
              e.forEach((e) => {
                let s = e.sessionId || `session-imported-${Date.now()}-${a}`;
                (t || !localStorage.getItem(s)) &&
                  (localStorage.setItem(s, JSON.stringify(e)), a++);
              }),
              a
            );
          }
          importFeedback(e, t) {
            let a = 0;
            return (
              e.forEach((e) => {
                let s = e.feedbackId || `feedback-imported-${Date.now()}-${a}`;
                (t || !localStorage.getItem(s)) &&
                  (localStorage.setItem(s, JSON.stringify(e)), a++);
              }),
              a
            );
          }
          importWellness(e, t) {
            let a = 0;
            return (
              e.forEach((e) => {
                let s = `wellness-${e.date}`;
                (t || !localStorage.getItem(s)) &&
                  (localStorage.setItem(s, JSON.stringify(e)), a++);
              }),
              a
            );
          }
          importAnalytics(e, t) {
            return 0;
          }
        }
        let l = new o();
      },
      {
        "../core/trainingState.js": "iohWK",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    "4cMS8": [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "UserFeedbackManager", () => o),
          n.export(a, "userFeedbackManager", () => d);
        var r = e("../core/trainingState.js"),
          i = n.interopDefault(r);
        class o {
          constructor() {
            (this.feedbackCategories = [
              "usability",
              "accuracy",
              "features",
              "performance",
              "mobile",
              "suggestions",
            ]),
              (this.analyticsEnabled = !0),
              (this.privacyMode = !0);
          }
          initializeFeedbackSystem() {
            this.createFeedbackWidget(),
              this.setupUsageTracking(),
              this.schedulePeriodicFeedback();
          }
          createFeedbackWidget() {
            let e = document.createElement("div");
            (e.id = "feedback-widget"),
              (e.className = "feedback-widget"),
              (e.innerHTML = `
      <div class="feedback-toggle" onclick="userFeedbackManager.toggleFeedbackPanel()">
        \u{1F4AC} Feedback
      </div>
      <div class="feedback-panel" id="feedbackPanel" style="display: none;">
        <div class="feedback-header">
          <h3>\u{1F4A1} Help Improve PowerHouseATX</h3>
          <button onclick="userFeedbackManager.closeFeedbackPanel()">\xd7</button>
        </div>
        <div class="feedback-content">
          <div class="feedback-category">
            <label>What would you like feedback on?</label>
            <select id="feedbackCategory">
              <option value="usability">\u{1F4BB} Ease of Use</option>
              <option value="accuracy">\u{1F3AF} Recommendation Accuracy</option>
              <option value="features">\u{2728} Features & Functionality</option>
              <option value="performance">\u{26A1} App Performance</option>
              <option value="mobile">\u{1F4F1} Mobile Experience</option>
              <option value="suggestions">\u{1F4A1} New Feature Ideas</option>
            </select>
          </div>
          
          <div class="feedback-rating">
            <label>Overall satisfaction (1-5):</label>
            <div class="rating-stars" id="satisfactionRating">
              ${[1, 2, 3, 4, 5].map((e) => `<span class="star" data-rating="${e}">\u{2B50}</span>`).join("")}
            </div>
          </div>
          
          <div class="feedback-text">
            <label>Your feedback:</label>
            <textarea id="feedbackText" placeholder="Tell us what's working well or what could be improved..."></textarea>
          </div>
          
          <div class="feedback-usage" id="usageContext">
            <!-- Automatically populated with usage context -->
          </div>
          
          <div class="feedback-actions">
            <button onclick="userFeedbackManager.submitFeedback()" class="submit-btn">
              \u{1F4E4} Send Feedback
            </button>
            <button onclick="userFeedbackManager.laterReminder()" class="later-btn">
              \u{23F0} Remind Later
            </button>
          </div>
        </div>
      </div>
    `),
              document.body.appendChild(e),
              this.setupFeedbackEvents();
          }
          setupFeedbackEvents() {
            document.querySelectorAll(".star").forEach((e) => {
              e.addEventListener("click", (e) => {
                let t = parseInt(e.target.dataset.rating);
                this.setRating(t);
              });
            });
          }
          setRating(e) {
            document.querySelectorAll(".star").forEach((t, a) => {
              a < e
                ? ((t.style.opacity = "1"), (t.style.transform = "scale(1.2)"))
                : ((t.style.opacity = "0.3"), (t.style.transform = "scale(1)"));
            }),
              (this.currentRating = e);
          }
          toggleFeedbackPanel() {
            "none" !== document.getElementById("feedbackPanel").style.display
              ? this.closeFeedbackPanel()
              : this.openFeedbackPanel();
          }
          openFeedbackPanel() {
            (document.getElementById("feedbackPanel").style.display = "block"),
              this.populateUsageContext(),
              this.trackEvent("feedback_panel_opened");
          }
          closeFeedbackPanel() {
            document.getElementById("feedbackPanel").style.display = "none";
          }
          populateUsageContext() {
            let e = document.getElementById("usageContext"),
              t = this.getUsageContext();
            e.innerHTML = `
      <div class="usage-context">
        <h4>\u{1F4CA} Your Usage Context (helps us improve):</h4>
        <div class="context-grid">
          <div class="context-item">
            <span class="context-label">Training Week:</span>
            <span class="context-value">${t.currentWeek}</span>
          </div>
          <div class="context-item">
            <span class="context-label">Features Used:</span>
            <span class="context-value">${t.featuresUsed.join(", ")}</span>
          </div>
          <div class="context-item">
            <span class="context-label">Device:</span>
            <span class="context-value">${t.deviceType}</span>
          </div>
          <div class="context-item">
            <span class="context-label">Session Count:</span>
            <span class="context-value">${t.sessionCount}</span>
          </div>
        </div>
        <div class="privacy-note">
          \u{1F512} No personal training data is shared - only anonymized usage patterns
        </div>
      </div>
    `;
          }
          getUsageContext() {
            let e = this.getStoredUsage();
            return {
              currentWeek: i.default.weekNo,
              currentBlock: i.default.blockNo,
              featuresUsed: e.featuresUsed || [],
              deviceType: this.getDeviceType(),
              sessionCount: e.sessionCount || 0,
              lastActive: e.lastActive || new Date().toISOString(),
              averageSessionDuration: e.averageSessionDuration || 0,
            };
          }
          async submitFeedback() {
            let e = document.getElementById("feedbackCategory").value,
              t = document.getElementById("feedbackText").value,
              a = this.currentRating || 0;
            if (!t.trim())
              return void this.showFeedbackMessage(
                "Please provide some feedback text",
                "warning",
              );
            let s = {
              id: this.generateFeedbackId(),
              timestamp: new Date().toISOString(),
              category: e,
              rating: a,
              text: t.trim(),
              context: this.getUsageContext(),
              appVersion: "2.0.0",
              userAgent: navigator.userAgent,
            };
            try {
              (await this.processFeedback(s)).success
                ? (this.showFeedbackMessage(
                    "Thank you! Your feedback helps us improve \uD83D\uDE4F",
                    "success",
                  ),
                  this.resetFeedbackForm(),
                  setTimeout(() => this.closeFeedbackPanel(), 2e3),
                  this.trackEvent("feedback_submitted", {
                    category: e,
                    rating: a,
                  }))
                : this.showFeedbackMessage(
                    "Feedback saved locally. Thank you! \uD83D\uDCBE",
                    "info",
                  );
            } catch (e) {
              console.error("Feedback submission error:", e),
                this.showFeedbackMessage(
                  "Feedback saved locally. Thank you! \uD83D\uDCBE",
                  "info",
                );
            }
          }
          async processFeedback(e) {
            let t = `feedback-user-${e.id}`;
            return (
              localStorage.setItem(t, JSON.stringify(e)),
              this.updateFeedbackAnalytics(e),
              { success: !0, stored: "local", id: e.id }
            );
          }
          updateFeedbackAnalytics(e) {
            let t = this.getFeedbackAnalytics();
            t.categories[e.category] ||
              (t.categories[e.category] = {
                count: 0,
                averageRating: 0,
                totalRating: 0,
              });
            let a = t.categories[e.category];
            a.count++,
              (a.totalRating += e.rating),
              (a.averageRating = a.totalRating / a.count),
              t.totalFeedback++,
              (t.totalRating += e.rating),
              (t.averageRating = t.totalRating / t.totalFeedback),
              (t.lastFeedback = e.timestamp),
              localStorage.setItem("feedback-analytics", JSON.stringify(t));
          }
          getFeedbackAnalytics() {
            let e = localStorage.getItem("feedback-analytics");
            return e
              ? JSON.parse(e)
              : {
                  totalFeedback: 0,
                  averageRating: 0,
                  totalRating: 0,
                  categories: {},
                  lastFeedback: null,
                  trends: [],
                };
          }
          setupUsageTracking() {
            this.trackEvent("app_loaded"),
              this.setupFeatureTracking(),
              this.trackSessionStart(),
              window.addEventListener("beforeunload", () => {
                this.trackSessionEnd();
              });
          }
          setupFeatureTracking() {
            [
              "submitFeedbackBtn",
              "runAutoVolumeProgression",
              "initializeIntelligence",
              "startLiveSession",
              "optimizeVolumeLandmarks",
              "predictDeloadTiming",
            ].forEach((e) => {
              let t = document.getElementById(e);
              t &&
                t.addEventListener("click", () => {
                  this.trackFeatureUsage(e);
                });
            }),
              document.querySelectorAll(".section-banner").forEach((e) => {
                e.addEventListener("click", () => {
                  let t = e.textContent.trim().split(" ")[0];
                  this.trackFeatureUsage(`section_${t.toLowerCase()}`);
                });
              });
          }
          trackFeatureUsage(e) {
            let t = this.getStoredUsage();
            t.featuresUsed || (t.featuresUsed = []),
              t.featuresUsed.includes(e) || t.featuresUsed.push(e),
              t.featureCount || (t.featureCount = {}),
              (t.featureCount[e] = (t.featureCount[e] || 0) + 1),
              (t.lastFeatureUsed = e),
              (t.lastActivity = new Date().toISOString()),
              this.storeUsage(t),
              this.trackEvent("feature_used", { feature: e });
          }
          trackSessionStart() {
            (this.sessionStartTime = Date.now()),
              this.trackEvent("session_started");
          }
          trackSessionEnd() {
            if (this.sessionStartTime) {
              let e = Date.now() - this.sessionStartTime,
                t = this.getStoredUsage();
              (t.sessionCount = (t.sessionCount || 0) + 1),
                (t.totalSessionTime = (t.totalSessionTime || 0) + e),
                (t.averageSessionDuration =
                  t.totalSessionTime / t.sessionCount),
                (t.lastSession = new Date().toISOString()),
                this.storeUsage(t),
                this.trackEvent("session_ended", { duration: e });
            }
          }
          trackEvent(e, t = {}) {
            if (!this.analyticsEnabled) return;
            let a = {
                event: e,
                timestamp: new Date().toISOString(),
                data: t,
                sessionId: this.getSessionId(),
              },
              s = this.getStoredEvents();
            s.push(a),
              s.length > 100 && s.splice(0, s.length - 100),
              localStorage.setItem("usage-events", JSON.stringify(s));
          }
          schedulePeriodicFeedback() {
            let e = this.getStoredUsage(),
              t = e.lastFeedbackRequest,
              a = t ? (Date.now() - new Date(t).getTime()) / 864e5 : 1 / 0;
            e.sessionCount >= 10 &&
              a > 7 &&
              setTimeout(() => this.showFeedbackPrompt(), 3e4);
          }
          showFeedbackPrompt() {
            let e = this.getStoredUsage();
            confirm(
              `\u{1F4AA} You've used PowerHouseATX for ${e.sessionCount} sessions! Would you like to share feedback to help us improve?`,
            )
              ? this.openFeedbackPanel()
              : this.laterReminder();
          }
          laterReminder() {
            let e = this.getStoredUsage();
            (e.lastFeedbackRequest = new Date().toISOString()),
              this.storeUsage(e),
              this.closeFeedbackPanel();
          }
          generateAnalyticsDashboard() {
            let e = this.getStoredUsage(),
              t = this.getFeedbackAnalytics(),
              a = this.getStoredEvents();
            return {
              usage: {
                totalSessions: e.sessionCount || 0,
                averageSessionDuration: Math.round(
                  (e.averageSessionDuration || 0) / 1e3 / 60,
                ),
                totalTimeSpent: Math.round(
                  (e.totalSessionTime || 0) / 1e3 / 60,
                ),
                featuresUsed: e.featuresUsed?.length || 0,
                mostUsedFeature: this.getMostUsedFeature(e.featureCount),
                lastActive: e.lastActivity,
              },
              feedback: {
                totalFeedback: t.totalFeedback,
                averageRating: Math.round(10 * t.averageRating) / 10,
                categoryBreakdown: t.categories,
                lastFeedback: t.lastFeedback,
              },
              events: {
                totalEvents: a.length,
                recentEvents: a.slice(-10),
                eventTypes: this.getEventTypeBreakdown(a),
              },
              insights: this.generateInsights(e, t, a),
            };
          }
          generateInsights(e, t, a) {
            let s = [];
            return (
              e.sessionCount > 20 &&
                s.push({
                  type: "milestone",
                  message: `\u{1F389} Power user! You've completed ${e.sessionCount} sessions`,
                  action: "Consider sharing your experience",
                }),
              e.averageSessionDuration > 18e5 &&
                s.push({
                  type: "usage",
                  message: "⏱️ Your sessions are comprehensive and detailed",
                  action: "Great attention to training detail!",
                }),
              t.averageRating >= 4.5 &&
                s.push({
                  type: "satisfaction",
                  message: "⭐ High satisfaction rating - thank you!",
                  action: "Your feedback helps us improve",
                }),
              (e.featuresUsed?.includes("analytics") ||
                e.featuresUsed?.includes("intelligence")) &&
                s.push({
                  type: "advanced",
                  message: "\uD83E\uDDE0 Advanced features user detected",
                  action: "Perfect for the next-generation updates!",
                }),
              s
            );
          }
          getStoredUsage() {
            let e = localStorage.getItem("usage-analytics");
            return e ? JSON.parse(e) : {};
          }
          storeUsage(e) {
            localStorage.setItem("usage-analytics", JSON.stringify(e));
          }
          getStoredEvents() {
            let e = localStorage.getItem("usage-events");
            return e ? JSON.parse(e) : [];
          }
          getSessionId() {
            return (
              this.sessionId ||
                (this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
              this.sessionId
            );
          }
          getDeviceType() {
            let e = window.innerWidth;
            return e < 768 ? "Mobile" : e < 1024 ? "Tablet" : "Desktop";
          }
          getMostUsedFeature(e) {
            if (!e) return "None";
            let t = Object.entries(e);
            return 0 === t.length
              ? "None"
              : t.reduce((e, t) => (t[1] > e[1] ? t : e))[0];
          }
          getEventTypeBreakdown(e) {
            let t = {};
            return (
              e.forEach((e) => {
                t[e.event] = (t[e.event] || 0) + 1;
              }),
              t
            );
          }
          generateFeedbackId() {
            return `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          }
          resetFeedbackForm() {
            (document.getElementById("feedbackText").value = ""),
              (document.getElementById("feedbackCategory").selectedIndex = 0),
              this.setRating(0);
          }
          showFeedbackMessage(e, t = "info") {
            let a = document.querySelector(".feedback-message");
            a && a.remove();
            let s = document.createElement("div");
            (s.className = `feedback-message ${t}`),
              (s.textContent = e),
              document.getElementById("feedbackPanel").appendChild(s),
              setTimeout(() => s.remove(), 3e3);
          }
        }
        let l = `
.feedback-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.feedback-toggle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.feedback-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.feedback-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 400px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.feedback-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feedback-header h3 {
  margin: 0;
  font-size: 16px;
}

.feedback-header button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-content {
  padding: 20px;
}

.feedback-category,
.feedback-rating,
.feedback-text {
  margin-bottom: 15px;
}

.feedback-category label,
.feedback-rating label,
.feedback-text label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.feedback-category select,
.feedback-text textarea {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.feedback-category select:focus,
.feedback-text textarea:focus {
  outline: none;
  border-color: #667eea;
}

.feedback-text textarea {
  height: 80px;
  resize: vertical;
}

.rating-stars {
  display: flex;
  gap: 5px;
}

.star {
  cursor: pointer;
  font-size: 20px;
  opacity: 0.3;
  transition: all 0.2s ease;
}

.star:hover {
  opacity: 1;
  transform: scale(1.1);
}

.usage-context {
  background: #f9fafb;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}

.usage-context h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #374151;
}

.context-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.context-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.context-label {
  color: #6b7280;
}

.context-value {
  color: #374151;
  font-weight: 600;
}

.privacy-note {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 10px;
}

.feedback-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  flex: 1;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.later-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.later-btn:hover {
  background: #e5e7eb;
}

.feedback-message {
  position: absolute;
  bottom: 10px;
  left: 20px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.feedback-message.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.feedback-message.info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.feedback-message.warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #f59e0b;
}

@media (max-width: 768px) {
  .feedback-panel {
    width: 350px;
  }
  
  .context-grid {
    grid-template-columns: 1fr;
  }
}
`,
          c = document.createElement("style");
        (c.textContent = l), document.head.appendChild(c);
        let d = new o();
      },
      {
        "../core/trainingState.js": "iohWK",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    "5E6aE": [
      function (e, t, a, s) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(a),
          n.export(a, "PerformanceManager", () => r),
          n.export(a, "performanceManager", () => i);
        class r {
          constructor() {
            (this.metrics = {
              loadTimes: [],
              renderTimes: [],
              memoryUsage: [],
              userInteractions: [],
              errors: [],
            }),
              (this.observers = new Map()),
              (this.isMonitoring = !1),
              (this.optimizationEnabled = !0),
              (this.thresholds = {
                loadTime: 3e3,
                renderTime: 100,
                memoryLimit: 50,
                fpsTarget: 60,
                interactionDelay: 100,
              });
          }
          initialize() {
            this.isMonitoring ||
              (this.setupPerformanceObservers(),
              this.setupMemoryMonitoring(),
              this.setupUserInteractionTracking(),
              this.setupErrorTracking(),
              this.optimizeInitialLoad(),
              (this.isMonitoring = !0),
              console.log("\uD83D\uDE80 Performance monitoring initialized"));
          }
          setupPerformanceObservers() {
            if ("PerformanceObserver" in window) {
              let e = new PerformanceObserver((e) => {
                e.getEntries().forEach((e) => {
                  this.processPerformanceEntry(e);
                });
              });
              e.observe({
                entryTypes: ["navigation", "resource", "measure", "paint"],
              }),
                this.observers.set("performance", e);
            }
            if ("IntersectionObserver" in window) {
              let e = new IntersectionObserver(
                (e) => {
                  e.forEach((e) => {
                    e.isIntersecting &&
                      this.optimizeElementVisibility(e.target);
                  });
                },
                { rootMargin: "50px" },
              );
              this.observers.set("intersection", e), this.setupLazyLoading(e);
            }
            if ("MutationObserver" in window) {
              let e = new MutationObserver((e) => {
                this.optimizeDOMChanges(e);
              });
              e.observe(document.body, {
                childList: !0,
                subtree: !0,
                attributes: !0,
                attributeFilter: ["class", "style"],
              }),
                this.observers.set("mutation", e);
            }
          }
          processPerformanceEntry(e) {
            switch (e.entryType) {
              case "navigation":
                this.handleNavigationTiming(e);
                break;
              case "resource":
                this.handleResourceTiming(e);
                break;
              case "measure":
                this.handleUserTiming(e);
                break;
              case "paint":
                this.handlePaintTiming(e);
            }
          }
          handleNavigationTiming(e) {
            let t = {
              timestamp: Date.now(),
              loadTime: e.loadEventEnd - e.navigationStart,
              domContentLoaded: e.domContentLoadedEventEnd - e.navigationStart,
              firstPaint: e.loadEventEnd - e.navigationStart,
              networkTime: e.responseEnd - e.requestStart,
              renderTime: e.loadEventEnd - e.responseEnd,
            };
            this.metrics.loadTimes.push(t),
              t.loadTime > this.thresholds.loadTime &&
                this.reportPerformanceIssue("slow_load", t),
              this.updatePerformanceDashboard(t);
          }
          handleResourceTiming(e) {
            let t = e.responseEnd - e.requestStart;
            t > 1e3 &&
              (console.warn(`\u{1F40C} Slow resource: ${e.name} (${t}ms)`),
              this.suggestResourceOptimization(e)),
              e.name.includes("chart.js") && this.optimizeChartLoading(e);
          }
          setupMemoryMonitoring() {
            "memory" in performance &&
              setInterval(() => {
                let e = performance.memory,
                  t = {
                    timestamp: Date.now(),
                    used: e.usedJSHeapSize / 1024 / 1024,
                    total: e.totalJSHeapSize / 1024 / 1024,
                    limit: e.jsHeapSizeLimit / 1024 / 1024,
                  };
                this.metrics.memoryUsage.push(t),
                  t.used > this.thresholds.memoryLimit &&
                    this.handleMemoryPressure(t),
                  this.metrics.memoryUsage.length > 100 &&
                    this.metrics.memoryUsage.shift();
              }, 1e4);
          }
          setupUserInteractionTracking() {
            ["click", "keydown", "touchstart"].forEach((e) => {
              document.addEventListener(
                e,
                (t) => {
                  let a = performance.now();
                  requestAnimationFrame(() => {
                    let s = performance.now() - a;
                    this.metrics.userInteractions.push({
                      timestamp: Date.now(),
                      type: e,
                      target: t.target.tagName,
                      delay: s,
                    }),
                      s > this.thresholds.interactionDelay &&
                        this.reportInteractionDelay(t, s);
                  });
                },
                { passive: !0 },
              );
            });
          }
          setupErrorTracking() {
            window.addEventListener("error", (e) => {
              this.metrics.errors.push({
                timestamp: Date.now(),
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error?.stack,
              });
            }),
              window.addEventListener("unhandledrejection", (e) => {
                this.metrics.errors.push({
                  timestamp: Date.now(),
                  type: "promise_rejection",
                  reason: e.reason,
                });
              });
          }
          optimizeInitialLoad() {
            this.deferNonCriticalScripts(),
              this.preloadCriticalResources(),
              this.optimizeImages(),
              this.setupServiceWorker();
          }
          deferNonCriticalScripts() {
            document.querySelectorAll("script[src]").forEach((e) => {
              let t = e.src;
              (t.includes("analytics") ||
                t.includes("feedback") ||
                t.includes("chart.js")) &&
                (e.defer = !0);
            });
          }
          preloadCriticalResources() {
            [
              "/js/core/trainingState.js",
              "/js/algorithms/volume.js",
              "/js/ui/globals.js",
              "/css/enhancedAdvanced.css",
            ].forEach((e) => {
              let t = document.createElement("link");
              (t.rel = "preload"),
                (t.href = e),
                (t.as = e.endsWith(".js") ? "script" : "style"),
                document.head.appendChild(t);
            });
          }
          setupLazyLoading(e) {
            document.querySelectorAll(".section-content").forEach((t) => {
              e.observe(t);
            }),
              document.querySelectorAll(".calculator").forEach((t) => {
                e.observe(t);
              });
          }
          optimizeElementVisibility(e) {
            e.classList.contains("calculator") &&
              this.initializeCalculatorFeatures(e),
              "advanced-content" === e.id && this.loadAdvancedFeatures();
          }
          initializeCalculatorFeatures(e) {
            switch (e.id) {
              case "analyticsCard":
                this.loadAnalyticsFeatures();
                break;
              case "liveMonitorCard":
                this.loadLiveMonitorFeatures();
                break;
              case "trainingIntelligenceCard":
                this.loadIntelligenceFeatures();
            }
          }
          loadAnalyticsFeatures() {
            window.optimizeVolumeLandmarks ||
              e("864404735f7854f3").then((e) => {
                console.log("\uD83D\uDCCA Analytics features loaded");
              });
          }
          loadLiveMonitorFeatures() {
            window.liveMonitor ||
              e("6a4f4548e66827a3").then((e) => {
                console.log("⚡ Live monitor features loaded");
              });
          }
          loadIntelligenceFeatures() {
            window.advancedIntelligence ||
              e("e666532c0399e35a").then((e) => {
                console.log("\uD83E\uDDE0 Intelligence features loaded");
              });
          }
          loadAdvancedFeatures() {
            if (!window.Chart) {
              import("chart.js/auto")
                .then((e) => {
                  (window.Chart = e.default),
                    console.log("\uD83D\uDCC8 Chart.js loaded on demand"),
                    this.initializeCharts();
                })
                .catch((e) => console.error("Failed to load Chart.js", e));
            }
          }
          optimizeDOMChanges(e) {
            let t = !1,
              a = !1;
            e.forEach((e) => {
              "attributes" === e.type &&
              ("style" === e.attributeName || "class" === e.attributeName)
                ? (t = !0)
                : "childList" === e.type && (a = !0);
            }),
              t && this.batchStyleUpdates(),
              a && this.optimizeContentUpdates();
          }
          batchStyleUpdates() {
            this.styleUpdateScheduled ||
              ((this.styleUpdateScheduled = !0),
              requestAnimationFrame(() => {
                this.applyStyleOptimizations(),
                  (this.styleUpdateScheduled = !1);
              }));
          }
          handleMemoryPressure(e) {
            console.warn("\uD83D\uDEA8 High memory usage detected:", e),
              this.clearOldMetrics(),
              window.gc && window.gc(),
              e.used > 1.5 * this.thresholds.memoryLimit &&
                this.showMemoryWarning();
          }
          reportPerformanceIssue(e, t) {
            console.warn(
              `\u{26A0}\u{FE0F} Performance issue detected: ${e}`,
              t,
            );
            let a = {
                type: e,
                timestamp: Date.now(),
                data: t,
                userAgent: navigator.userAgent,
                url: window.location.href,
              },
              s = JSON.parse(
                localStorage.getItem("performance-issues") || "[]",
              );
            s.push(a),
              s.length > 50 && s.splice(0, s.length - 50),
              localStorage.setItem("performance-issues", JSON.stringify(s));
          }
          generatePerformanceReport() {
            let e = Date.now(),
              t = e - 36e5,
              a = this.metrics.loadTimes.filter((e) => e.timestamp > t),
              s = this.metrics.memoryUsage.filter((e) => e.timestamp > t),
              n = this.metrics.userInteractions.filter((e) => e.timestamp > t),
              r = this.metrics.errors.filter((e) => e.timestamp > t);
            return {
              timestamp: e,
              performance: {
                averageLoadTime: this.calculateAverage(a, "loadTime"),
                averageRenderTime: this.calculateAverage(a, "renderTime"),
                slowestLoad: Math.max(...a.map((e) => e.loadTime), 0),
                loadTimeP95: this.calculatePercentile(
                  a.map((e) => e.loadTime),
                  95,
                ),
              },
              memory: {
                currentUsage: s[s.length - 1]?.used || 0,
                peakUsage: Math.max(...s.map((e) => e.used), 0),
                averageUsage: this.calculateAverage(s, "used"),
              },
              interactions: {
                totalInteractions: n.length,
                averageDelay: this.calculateAverage(n, "delay"),
                slowInteractions: n.filter(
                  (e) => e.delay > this.thresholds.interactionDelay,
                ).length,
              },
              errors: {
                totalErrors: r.length,
                errorTypes: this.categorizeErrors(r),
              },
              recommendations: this.generateRecommendations(),
            };
          }
          generateRecommendations() {
            let e = [],
              t = this.metrics;
            this.calculateAverage(t.loadTimes, "loadTime") >
              this.thresholds.loadTime &&
              e.push({
                type: "load_time",
                priority: "high",
                message: "Page load time is above optimal threshold",
                suggestion:
                  "Consider enabling service worker caching and optimizing resource loading",
              });
            let a = t.memoryUsage[t.memoryUsage.length - 1];
            return (
              a &&
                a.used > 0.8 * this.thresholds.memoryLimit &&
                e.push({
                  type: "memory",
                  priority: "medium",
                  message: "Memory usage is approaching limits",
                  suggestion: "Clear old data and optimize data structures",
                }),
              t.userInteractions.filter(
                (e) => e.delay > this.thresholds.interactionDelay,
              ).length > 5 &&
                e.push({
                  type: "interactions",
                  priority: "medium",
                  message: "Multiple slow user interactions detected",
                  suggestion: "Optimize event handlers and consider debouncing",
                }),
              e
            );
          }
          optimizeImages() {
            document.querySelectorAll("img").forEach((e) => {
              e.hasAttribute("loading") || (e.loading = "lazy"),
                (e.hasAttribute("width") && e.hasAttribute("height")) ||
                  ((e.style.width = "auto"), (e.style.height = "auto"));
            });
          }
          setupServiceWorker() {
            "serviceWorker" in navigator &&
              navigator.serviceWorker
                .register(e("9913b1cce8578079"))
                .then((e) => {
                  console.log("✅ Service Worker registered");
                })
                .catch((e) => {
                  console.warn("❌ Service Worker registration failed:", e);
                });
          }
          calculateAverage(e, t) {
            return 0 === e.length
              ? 0
              : e.reduce((e, a) => e + (a[t] || 0), 0) / e.length;
          }
          calculatePercentile(e, t) {
            if (0 === e.length) return 0;
            let a = e.sort((e, t) => e - t),
              s = Math.ceil((t / 100) * a.length) - 1;
            return a[s] || 0;
          }
          categorizeErrors(e) {
            let t = {};
            return (
              e.forEach((e) => {
                let a = e.type || "runtime";
                t[a] = (t[a] || 0) + 1;
              }),
              t
            );
          }
          clearOldMetrics() {
            let e = Date.now() - 36e5;
            (this.metrics.loadTimes = this.metrics.loadTimes.filter(
              (t) => t.timestamp > e,
            )),
              (this.metrics.userInteractions =
                this.metrics.userInteractions.filter((t) => t.timestamp > e)),
              (this.metrics.errors = this.metrics.errors.filter(
                (t) => t.timestamp > e,
              ));
          }
          showMemoryWarning() {
            if (!document.querySelector(".memory-warning")) {
              let e = document.createElement("div");
              (e.className = "memory-warning"),
                (e.innerHTML = `
        <div style="background: #fef3c7; color: #92400e; padding: 10px; border-radius: 8px; margin: 10px; border: 1px solid #f59e0b;">
          \u{26A0}\u{FE0F} High memory usage detected. Consider refreshing the page for optimal performance.
          <button onclick="location.reload()" style="margin-left: 10px; padding: 5px 10px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh</button>
        </div>
      `),
                document.body.appendChild(e),
                setTimeout(() => e.remove(), 1e4);
            }
          }
          applyStyleOptimizations() {}
          optimizeContentUpdates() {}
          initializeCharts() {
            window.Chart &&
              ((Chart.defaults.animation.duration = 300),
              (Chart.defaults.responsive = !0),
              (Chart.defaults.maintainAspectRatio = !1));
          }
          suggestResourceOptimization(e) {
            console.log(`\u{1F4A1} Optimization suggestion for ${e.name}:`, {
              duration: e.responseEnd - e.requestStart,
              suggestion: "Consider caching or CDN optimization",
            });
          }
          optimizeChartLoading(e) {
            console.log(
              "\uD83D\uDCC8 Optimizing Chart.js loading based on timing:",
              e,
            );
          }
          reportInteractionDelay(e, t) {
            console.warn(`\u{1F40C} Slow interaction detected:`, {
              type: e.type,
              target: e.target,
              delay: `${t}ms`,
            });
          }
          updatePerformanceDashboard(e) {
            let t = document.getElementById("performance-indicator");
            t &&
              (t.textContent =
                e.loadTime < this.thresholds.loadTime
                  ? "\uD83D\uDFE2"
                  : "\uD83D\uDFE1");
          }
        }
        let i = new r();
        "loading" === document.readyState
          ? document.addEventListener("DOMContentLoaded", () => {
              i.initialize();
            })
          : i.initialize();
      },
      {
        "864404735f7854f3": "eJGy5",
        "6a4f4548e66827a3": "ebfAS",
        e666532c0399e35a: "dwVvp",
        "9913b1cce8578079": "4V7Og",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
    eJGy5: [
      function (e, t, a, s) {
        t.exports = Promise.resolve(t.bundle.root("5eA0i"));
      },
      {},
    ],
    ebfAS: [
      function (e, t, a, s) {
        t.exports = Promise.resolve(t.bundle.root("6qXhO"));
      },
      {},
    ],
    dwVvp: [
      function (e, t, a, s) {
        t.exports = Promise.resolve(t.bundle.root("bDUtg"));
      },
      {},
    ],
    "4V7Og": [
      function (e, t, a, s) {
        t.exports = import.meta.resolve("4ujR8");
      },
      {},
    ],
  },
  ["lEf4n"],
  "lEf4n",
  "parcelRequire66c8",
  {},
);
//# sourceMappingURL=ProgramDesignWorkspace.99e626fb.js.map
