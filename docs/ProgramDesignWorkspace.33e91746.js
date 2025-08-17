import "./ProgramDesignWorkspace.41b0cd88.js";
var e = globalThis,
  t = {},
  n = {},
  a = e.parcelRequire66c8;
null == a &&
  (((a = function (e) {
    if (e in t) return t[e].exports;
    if (e in n) {
      var a = n[e];
      delete n[e];
      var s = { id: e, exports: {} };
      return (t[e] = s), a.call(s.exports, s, s.exports), s.exports;
    }
    var l = Error("Cannot find module '" + e + "'");
    throw ((l.code = "MODULE_NOT_FOUND"), l);
  }).register = function (e, t) {
    n[e] = t;
  }),
  (e.parcelRequire66c8 = a)),
  a.register;
var s = a("e8wst"),
  l = a("jlKM8"),
  d = a("9Ev1P"),
  o = a("76QZC"),
  r = a("b3qqF"),
  u = a("gBc5V");
(window.trainingState = u.default),
  (window.updateChart = s.updateChart),
  (window.resetWeeklyData = s.resetChart),
  (window.showVolumeLandmarks = s.addVolumeLandmarks),
  (window.exportSummary = s.exportChartImage),
  (window.toggleSection = function (e) {
    let t = document.getElementById(e + "-content"),
      n = t.previousElementSibling,
      a = n.querySelector(".expand-icon");
    function s() {
      if (!window.parent) return;
      let e = document.documentElement.getBoundingClientRect().height;
      window.parent.postMessage({ phxHeight: e }, "*");
    }
    t.classList.contains("expanded")
      ? (t.classList.remove("expanded"),
        n.classList.remove("expanded"),
        a && (a.style.transform = "rotate(0deg)"),
        t.addEventListener("transitionend", function e() {
          (t.style.display = "none"),
            t.removeEventListener("transitionend", e),
            s();
        }))
      : ((t.style.display = "block"),
        requestAnimationFrame(() => {
          t.classList.add("expanded"),
            n.classList.add("expanded"),
            a && (a.style.transform = "rotate(180deg)"),
            s();
        }));
  }),
  (window.scoreStimulus = l.scoreStimulus),
  (window.setProgressionAlgorithm = l.setProgressionAlgorithm),
  (window.getVolumeProgression = l.getVolumeProgression),
  (window.analyzeDeloadNeed = l.analyzeDeloadNeed),
  (window.calculateTargetRIR = d.calculateTargetRIR),
  (window.validateEffortLevel = d.validateEffortLevel),
  (window.analyzeFrequency = o.analyzeFrequency),
  (window.calculateOptimalFrequency = o.calculateOptimalFrequency),
  (window.validateLoad = r.validateLoad),
  (window.validateSets = r.validateSets),
  (window.validateMesocycleLength = r.validateMesocycleLength),
  (window.submitFeedback = function () {
    let e = document.getElementById("muscleSelect").value,
      t = parseInt(document.getElementById("mmc").value, 10),
      n = parseInt(document.getElementById("pump").value, 10),
      a = parseInt(document.getElementById("dis").value, 10),
      o = parseInt(document.getElementById("sore").value, 10),
      r = document.getElementById("actualRIR").value,
      i = document.querySelector('input[name="perf"]:checked'),
      c = i ? parseInt(i.value, 10) : 2;
    if (!e || isNaN(t) || isNaN(n) || isNaN(a))
      return void alert("Please fill in all required fields");
    let m = (0, l.scoreStimulus)({ mmc: t, pump: n, disruption: a }),
      g = (0, l.setProgressionAlgorithm)(o, c),
      v = (0, l.getVolumeProgression)(e, {
        stimulus: { mmc: t, pump: n, disruption: a },
        soreness: o,
        performance: c,
        hasIllness: !1,
      }),
      p = null;
    r && (p = (0, d.validateEffortLevel)(parseFloat(r))),
      -99 !== g.setChange && u.default.addSets(e, g.setChange);
    let y = document.getElementById("mevOut"),
      w = `
    <div class="feedback-results">
      <div class="main-recommendation">
        <h4>${e} Recommendation</h4>
        <p class="advice">${v.advice}</p>
        <p class="sets-info">
          ${v.currentSets} \u{2192} ${v.projectedSets} sets
          ${0 !== v.setChange ? `(${v.setChange > 0 ? "+" : ""}${v.setChange})` : ""}
        </p>
      </div>
      
      <div class="algorithm-details">
        <div>
          <strong>Stimulus:</strong> ${m.score}/9 
          <span class="stimulus-${m.action}">(${m.action.replace("_", " ")})</span>
        </div>
        <div>
          <strong>Volume Status:</strong> ${v.volumeStatus}
        </div>
        <div>
          <strong>RP Progression:</strong> ${g.advice}
        </div>
      </div>
    </div>
  `;
    p &&
      (w += `
      <div class="rir-feedback ${p.urgency}">
        <strong>RIR Check:</strong> ${p.feedback}<br>
        <em>${p.recommendation}</em>
      </div>
    `),
      v.deloadRecommended &&
        (w += `
      <div class="deload-warning">
        \u{26A0}\u{FE0F} <strong>Deload Recommended</strong>
      </div>
    `),
      (y.innerHTML = w),
      (y.className = "result success active"),
      (0, s.updateChart)();
  }),
  (window.analyzeDeload = function () {
    let e = document.getElementById("halfMuscles").checked,
      t = document.getElementById("mrvBreach").checked,
      n = document.getElementById("illness").checked,
      a = document.getElementById("lowMotivation").checked,
      d = (0, l.analyzeDeloadNeed)();
    e && d.reasons.push("Most muscles need recovery (manual check)"),
      t && d.reasons.push("Hit MRV twice consecutively (manual check)"),
      n && d.reasons.push("Illness/injury present"),
      a && d.reasons.push("Low motivation levels");
    let o = d.shouldDeload || e || t || n || a,
      r = document.getElementById("deloadOut");
    o
      ? ((r.innerHTML = `
      <strong>Deload Recommended</strong><br>
      Reasons: ${d.reasons.join(", ")}<br>
      <em>Take 1 week at 50% volume + 25-50% load reduction</em>
    `),
        (r.className = "result warning active"),
        setTimeout(() => {
          confirm(
            "Start deload phase now? This will reduce all muscle volumes to 50% of MEV.",
          ) && (u.default.startDeload(), (0, s.updateChart)());
        }, 1e3))
      : ((r.innerHTML = "No deload needed - continue current program"),
        (r.className = "result success active"));
  }),
  (window.analyzeFrequency = function () {
    let e = parseInt(document.getElementById("soreDays").value, 10),
      t = parseInt(document.getElementById("sessionGap").value, 10),
      n = document.getElementById("trainingAge").value,
      a = document.getElementById("muscleSelect").value,
      s = (0, o.analyzeFrequency)(e, t, a),
      l = (0, o.calculateOptimalFrequency)(a, {
        trainingAge: n,
        currentVolume: u.default.currentWeekSets[a],
      }),
      d = document.getElementById("freqOut");
    d.innerHTML = `
    <strong>${s.recommendation}</strong><br>
    Current: ${t} days between sessions<br>
    Recovery: ${e} days<br>
    Optimal frequency: ${l.recommendedFrequency}x/week (${l.setsPerSession} sets/session)
  `;
    let r =
      "high" === s.urgency || "medium" === s.urgency ? "warning" : "success";
    d.className = `result ${r} active`;
  }),
  (window.saveLandmarks = function () {
    let e = document.getElementById("landmarkMuscle").value,
      t = parseInt(document.getElementById("mv").value, 10),
      n = parseInt(document.getElementById("mev").value, 10),
      a = parseInt(document.getElementById("mav").value, 10),
      l = parseInt(document.getElementById("mrv").value, 10);
    if (t > n || n > a || a > l)
      return void alert("Invalid landmark relationship (MV ≤ MEV ≤ MAV ≤ MRV)");
    u.default.updateVolumeLandmarks(e, { MV: t, MEV: n, MAV: a, MRV: l }),
      (0, s.updateChart)();
    let d = document.getElementById("volumeOut");
    (d.innerHTML = `Landmarks saved for ${e}: MV:${t}, MEV:${n}, MAV:${a}, MRV:${l}`),
      (d.className = "result success active");
  }),
  (window.applyVolumePreset = function (e) {
    let t = document.getElementById("landmarkMuscle").value,
      n = { beginner: 0.8, intermediate: 1, advanced: 1.2 }[e],
      a = u.default.volumeLandmarks[t];
    (document.getElementById("mv").value = Math.round(a.MV * n)),
      (document.getElementById("mev").value = Math.round(a.MEV * n)),
      (document.getElementById("mav").value = Math.round(a.MAV * n)),
      (document.getElementById("mrv").value = Math.round(a.MRV * n));
  }),
  (window.setupMeso = function () {
    let e = parseInt(document.getElementById("mesoLength").value, 10),
      t = parseInt(document.getElementById("currentWeekNum").value, 10),
      n = document.getElementById("trainingGoal").value,
      a = (0, r.validateMesocycleLength)(e, n);
    if (!a.isValid) return void alert(a.warning);
    (u.default.mesoLen = e), (u.default.weekNo = t), u.default.saveState();
    let s = document.getElementById("mesoOut");
    (s.innerHTML = `
    Mesocycle configured: ${e} weeks for ${n}<br>
    Currently week ${t} (Target RIR: ${u.default.getTargetRIR().toFixed(1)})<br>
    ${a.recommendation}
  `),
      (s.className = "result success active");
  });
//# sourceMappingURL=ProgramDesignWorkspace.33e91746.js.map
