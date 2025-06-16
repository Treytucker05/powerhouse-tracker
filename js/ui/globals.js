console.log("AUTH SYSTEM NUKED");
console.log("globals.js loaded");

/*  Maps module functions onto window so legacy inline onclick="" handlers keep working */

import {
  initChart,
  updateChart,
  addVolumeLandmarks,
  resetChart,
  exportChartImage,
} from "./chartManager.js";

import {
  scoreStimulus,
  setProgressionAlgorithm,
  getVolumeProgression,
  analyzeDeloadNeed,
  autoSetIncrement,
  processWeeklyVolumeProgression,
} from "../algorithms/volume.js";

import {
  calculateTargetRIR,
  validateEffortLevel,
  getScheduledRIR,
  processWeeklyLoadAdjustments,
  getLoadProgression,
  simulateWeeklyRIRFeedback,
} from "../algorithms/effort.js";

import {
  analyzeFrequency,
  calculateOptimalFrequency,
  isHighFatigue,
} from "../algorithms/fatigue.js";

import {
  validateLoad,
  validateSets,
  validateMesocycleLength,
} from "../algorithms/validation.js";

import trainingState from "../core/trainingState.js";

/* ----- expose key objects ----- */
window.trainingState = trainingState;

/* ----- UI utility functions ----- */
function hideGuide() {
  document.getElementById("quickStartGuide").style.display = "none";
}
window.hideGuide = hideGuide;

/* ----- expose chart functions ----- */
window.updateChart = updateChart;
window.resetWeeklyData = resetChart;
window.showVolumeLandmarks = addVolumeLandmarks;
window.exportSummary = exportChartImage;

/* ----- expose section toggle (enhanced with display:none) ----- */
window.toggleSection = function (sectionId) {
  const content = document.getElementById(sectionId + "-content");
  const banner = content.previousElementSibling;
  const icon = banner.querySelector(".expand-icon");

  const opening = !content.classList.contains("expanded");

  // ------- EXPAND -------
  if (opening) {
    content.style.display = "block"; // back in flow
    // allow next paint, then add class so CSS transition plays
    requestAnimationFrame(() => {
      content.classList.add("expanded");
      banner.classList.add("expanded");
      // Update icon rotation
      if (icon) {
        icon.style.transform = "rotate(180deg)";
      }
      postHeight(); // send new tall height
    });
  }

  // ------- COLLAPSE -------
  else {
    content.classList.remove("expanded"); // start transition
    banner.classList.remove("expanded");
    // Update icon rotation
    if (icon) {
      icon.style.transform = "rotate(0deg)";
    }

    // when transition ends hide element to drop layout height
    content.addEventListener("transitionend", function handler() {
      content.style.display = "none";
      content.removeEventListener("transitionend", handler);
      postHeight(); // send shorter height
    });
  }
  // helper sends current height to parent iframe
  function postHeight() {
    if (!window.parent || window.parent === window) return;
    try {
      const h = document.documentElement.getBoundingClientRect().height;
      window.parent.postMessage({ phxHeight: h }, "*");
    } catch (err) {
      console.debug("Frame messaging error:", err.message);
    }
  }
};

/* ----- expose RP algorithm functions ----- */
window.scoreStimulus = scoreStimulus;
window.setProgressionAlgorithm = setProgressionAlgorithm;
window.getVolumeProgression = getVolumeProgression;
window.analyzeDeloadNeed = analyzeDeloadNeed;
window.autoSetIncrement = autoSetIncrement;
window.processWeeklyVolumeProgression = processWeeklyVolumeProgression;
window.calculateTargetRIR = calculateTargetRIR;
window.validateEffortLevel = validateEffortLevel;
window.getScheduledRIR = getScheduledRIR;
window.processWeeklyLoadAdjustments = processWeeklyLoadAdjustments;
window.getLoadProgression = getLoadProgression;
window.simulateWeeklyRIRFeedback = simulateWeeklyRIRFeedback;
window.analyzeFrequency = analyzeFrequency;
window.calculateOptimalFrequency = calculateOptimalFrequency;
window.isHighFatigue = isHighFatigue;
window.validateLoad = validateLoad;
window.validateSets = validateSets;
window.validateMesocycleLength = validateMesocycleLength;

/* ----- expose advanced intelligence functions ----- */
import {
  optimizeVolumeLandmarks,
  predictDeloadTiming,
  adaptiveRIRRecommendations,
  detectTrainingPlateaus,
} from "../algorithms/analytics.js";

import {
  selectOptimalExercises,
  generateWeeklyProgram as generateProgram,
} from "../algorithms/exerciseSelection.js";

import { liveMonitor } from "../algorithms/livePerformance.js";
import { advancedIntelligence } from "../algorithms/intelligenceHub.js";

/* ----- expose next-generation features ----- */
import { dataVisualizer } from "../algorithms/dataVisualization.js";
import { wellnessSystem } from "../algorithms/wellnessIntegration.js";
import { periodizationSystem } from "../algorithms/periodizationSystem.js";

/* ----- expose new utility features ----- */
import { dataExportManager } from "../utils/dataExport.js";
import { userFeedbackManager } from "../utils/userFeedback.js";
import { performanceManager } from "../utils/performance.js";

window.optimizeVolumeLandmarks = optimizeVolumeLandmarks;
window.predictDeloadTiming = predictDeloadTiming;
window.adaptiveRIRRecommendations = adaptiveRIRRecommendations;
window.detectTrainingPlateaus = detectTrainingPlateaus;
window.selectOptimalExercises = selectOptimalExercises;
window.generateWeeklyProgram = generateProgram;
window.dataVisualizer = dataVisualizer;
window.wellnessSystem = wellnessSystem;
window.periodizationSystem = periodizationSystem;
window.liveMonitor = liveMonitor;
window.advancedIntelligence = advancedIntelligence;

/* ----- expose new utility systems ----- */
window.dataExportManager = dataExportManager;
window.userFeedbackManager = userFeedbackManager;
window.performanceManager = performanceManager;

/* ----- main UI handlers for buttons ----- */
window.submitFeedback = function () {
  const muscle = document.getElementById("muscleSelect").value;
  const mmc = parseInt(document.getElementById("mmc").value, 10);
  const pump = parseInt(document.getElementById("pump").value, 10);
  const workload = parseInt(document.getElementById("dis").value, 10);
  const soreness = parseInt(document.getElementById("sore").value, 10);
  const actualRIR = document.getElementById("actualRIR").value;

  const perfRadio = document.querySelector('input[name="perf"]:checked');
  const performance = perfRadio ? parseInt(perfRadio.value, 10) : 2;
  // Validate inputs
  if (!muscle || isNaN(mmc) || isNaN(pump) || isNaN(workload)) {
    alert("Please fill in all required fields");
    return;
  }
  // Process with RP algorithms
  const stimulusResult = scoreStimulus({ mmc, pump, disruption: workload });
  const progressionResult = setProgressionAlgorithm(soreness, performance);
  const volumeProgression = getVolumeProgression(muscle, {
    stimulus: { mmc, pump, disruption: workload },
    soreness,
    performance,
    hasIllness: false,
  });

  // Validate RIR if provided
  let rirValidation = null;
  if (actualRIR) {
    rirValidation = validateEffortLevel(parseFloat(actualRIR));
  }

  // Apply changes
  if (progressionResult.setChange !== -99) {
    trainingState.addSets(muscle, progressionResult.setChange);
  }

  // Display results
  const output = document.getElementById("mevOut");
  let html = `
    <div class="feedback-results">
      <div class="main-recommendation">
        <h4>${muscle} Recommendation</h4>
        <p class="advice">${volumeProgression.advice}</p>
        <p class="sets-info">
          ${volumeProgression.currentSets} → ${volumeProgression.projectedSets} sets
          ${volumeProgression.setChange !== 0 ? `(${volumeProgression.setChange > 0 ? "+" : ""}${volumeProgression.setChange})` : ""}
        </p>
      </div>
      
      <div class="algorithm-details">
        <div>
          <strong>Stimulus:</strong> ${stimulusResult.score}/9 
          <span class="stimulus-${stimulusResult.action}">(${stimulusResult.action.replace("_", " ")})</span>
        </div>
        <div>
          <strong>Volume Status:</strong> ${volumeProgression.volumeStatus}
        </div>
        <div>
          <strong>RP Progression:</strong> ${progressionResult.advice}
        </div>
      </div>
    </div>
  `;

  if (rirValidation) {
    html += `
      <div class="rir-feedback ${rirValidation.urgency}">
        <strong>RIR Check:</strong> ${rirValidation.feedback}<br>
        <em>${rirValidation.recommendation}</em>
      </div>
    `;
  }

  if (volumeProgression.deloadRecommended) {
    html += `
      <div class="deload-warning">
        ⚠️ <strong>Deload Recommended</strong>
      </div>
    `;
  }

  output.innerHTML = html;
  output.className = "result success active";

  updateChart();
};

window.analyzeDeload = function () {
  const halfMuscles = document.getElementById("halfMuscles").checked;
  const mrvBreach = document.getElementById("mrvBreach").checked;
  const illness = document.getElementById("illness").checked;
  const lowMotivation = document.getElementById("lowMotivation").checked;

  const analysis = analyzeDeloadNeed();

  // Override with manual inputs
  if (halfMuscles)
    analysis.reasons.push("Most muscles need recovery (manual check)");
  if (mrvBreach)
    analysis.reasons.push("Hit MRV twice consecutively (manual check)");
  if (illness) analysis.reasons.push("Illness/injury present");
  if (lowMotivation) analysis.reasons.push("Low motivation levels");

  const shouldDeload =
    analysis.shouldDeload ||
    halfMuscles ||
    mrvBreach ||
    illness ||
    lowMotivation;

  const output = document.getElementById("deloadOut");

  if (shouldDeload) {
    output.innerHTML = `
      <strong>Deload Recommended</strong><br>
      Reasons: ${analysis.reasons.join(", ")}<br>
      <em>Take 1 week at 50% volume and 50% of normal load</em>
    `;
    output.className = "result warning active";

    // Offer to start deload
    setTimeout(() => {
      if (
        confirm(
          "Start deload phase now? This will reduce all muscle volumes to 50% of MEV and loads to 50% of normal.",
        )
      ) {
        trainingState.startDeload();
        updateChart();
      }
    }, 1000);
  } else {
    output.innerHTML = "No deload needed - continue current program";
    output.className = "result success active";
  }
};

window.analyzeFrequency = function () {
  const soreDays = parseInt(document.getElementById("soreDays").value, 10);
  const sessionGap = parseInt(document.getElementById("sessionGap").value, 10);
  const trainingAge = document.getElementById("trainingAge").value;
  const muscle = document.getElementById("muscleSelect").value;

  const analysis = analyzeFrequency(soreDays, sessionGap, muscle);
  const optimal = calculateOptimalFrequency(muscle, {
    trainingAge,
    currentVolume: trainingState.currentWeekSets[muscle],
  });

  const output = document.getElementById("freqOut");
  output.innerHTML = `
    <strong>${analysis.recommendation}</strong><br>
    Current: ${sessionGap} days between sessions<br>
    Recovery: ${soreDays} days<br>
    Optimal frequency: ${optimal.recommendedFrequency}x/week (${optimal.setsPerSession} sets/session)
  `;

  const type =
    analysis.urgency === "high"
      ? "warning"
      : analysis.urgency === "medium"
        ? "warning"
        : "success";
  output.className = `result ${type} active`;
};

window.saveLandmarks = function () {
  const muscle = document.getElementById("landmarkMuscle").value;
  const mv = parseInt(document.getElementById("mv").value, 10);
  const mev = parseInt(document.getElementById("mev").value, 10);
  const mav = parseInt(document.getElementById("mav").value, 10);
  const mrv = parseInt(document.getElementById("mrv").value, 10);

  // Validate relationships
  if (mv > mev || mev > mav || mav > mrv) {
    alert("Invalid landmark relationship (MV ≤ MEV ≤ MAV ≤ MRV)");
    return;
  }

  trainingState.updateVolumeLandmarks(muscle, {
    MV: mv,
    MEV: mev,
    MAV: mav,
    MRV: mrv,
  });
  updateChart();

  const output = document.getElementById("volumeOut");
  output.innerHTML = `Landmarks saved for ${muscle}: MV:${mv}, MEV:${mev}, MAV:${mav}, MRV:${mrv}`;
  output.className = "result success active";
};

window.applyVolumePreset = function (level) {
  const muscle = document.getElementById("landmarkMuscle").value;
  const multipliers = {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.2,
  };

  const mult = multipliers[level];
  const baseLandmarks = trainingState.volumeLandmarks[muscle];

  document.getElementById("mv").value = Math.round(baseLandmarks.MV * mult);
  document.getElementById("mev").value = Math.round(baseLandmarks.MEV * mult);
  document.getElementById("mav").value = Math.round(baseLandmarks.MAV * mult);
  document.getElementById("mrv").value = Math.round(baseLandmarks.MRV * mult);
};

window.setupMeso = function () {
  const length = parseInt(document.getElementById("mesoLength").value, 10);
  const week = parseInt(document.getElementById("currentWeekNum").value, 10);
  const goal = document.getElementById("trainingGoal").value;

  const validation = validateMesocycleLength(length, goal);

  if (!validation.isValid) {
    alert(validation.warning);
    return;
  }

  trainingState.mesoLen = length;
  trainingState.weekNo = week;
  trainingState.saveState();

  const output = document.getElementById("mesoOut");
  output.innerHTML = `
    Mesocycle configured: ${length} weeks for ${goal}<br>
    Currently week ${week} (Target RIR: ${trainingState.getTargetRIR().toFixed(1)})<br>
    ${validation.recommendation}
  `;
  output.className = "result success active";
};

/* ----- week progression helpers ----- */
window.advanceToNextWeek = function () {
  trainingState.nextWeek();
  updateChart();
  updateAllDisplays();

  const summary = trainingState.getStateSummary();
  const output =
    document.getElementById("autoVolumeOut") ||
    document.getElementById("volumeOut");

  output.innerHTML = `
    <div class="auto-progression-result">
      <h4>📅 Advanced to Week ${summary.week}</h4>
      <div class="progression-details">
        <div>Week: ${summary.week} of ${summary.meso}</div>
        <div>Block: ${summary.block}</div>
        <div>Target RIR: ${summary.targetRIR.toFixed(1)}</div>
        <div>Phase: ${summary.currentPhase}</div>
      </div>
    </div>
  `;
  output.className = "result success active";

  console.log("Advanced to next week:", summary);
};

/* ----- initialization helpers ----- */
window.initializeAllMusclesAtMEV = function () {
  const muscles = Object.keys(trainingState.volumeLandmarks);

  muscles.forEach((muscle) => {
    trainingState.initializeMuscleAtMEV(muscle);
  });

  updateChart();

  const output =
    document.getElementById("autoVolumeOut") ||
    document.getElementById("volumeOut");
  output.innerHTML = `
    <div class="auto-progression-result">
      <h4>🎯 All muscles initialized at MEV</h4>
      <div class="progression-details">
        ${muscles
          .map(
            (muscle) =>
              `<div>${muscle}: ${trainingState.volumeLandmarks[muscle].MEV} sets (MEV)</div>`,
          )
          .join("")}
      </div>
    </div>
  `;
  output.className = "result success active";

  console.log("All muscles initialized at MEV");
};

/* ----- auto-volume progression demo function ----- */
window.runAutoVolumeProgression = function () {
  // Demo: simulate weekly feedback for all muscles
  const weeklyFeedback = {};
  const muscles = Object.keys(trainingState.volumeLandmarks);
  muscles.forEach((muscle) => {
    const currentSets = trainingState.getWeeklySets(muscle);
    const landmarks = trainingState.volumeLandmarks[muscle];
    const volumeStatus = trainingState.getVolumeStatus(muscle);

    // Generate adaptive feedback based on volume status
    let stimulus, soreness, perf;

    if (volumeStatus === "under-minimum" || volumeStatus === "maintenance") {
      // Low volume = good recovery, potentially low stimulus
      stimulus = Math.floor(Math.random() * 4) + 2; // 2-5 (moderate to low)
      soreness = Math.floor(Math.random() * 2); // 0-1 (low)
      perf = Math.floor(Math.random() * 2) + 1; // 1-2 (same to better)
    } else if (volumeStatus === "optimal") {
      // Optimal volume = moderate stimulus, manageable fatigue
      stimulus = Math.floor(Math.random() * 3) + 4; // 4-6 (moderate)
      soreness = Math.floor(Math.random() * 2) + 1; // 1-2 (mild to moderate)
      perf = Math.floor(Math.random() * 2) + 1; // 1-2 (same to better)
    } else if (volumeStatus === "high") {
      // High volume = good stimulus but building fatigue
      stimulus = Math.floor(Math.random() * 3) + 5; // 5-7 (moderate to high)
      soreness = Math.floor(Math.random() * 2) + 1; // 1-2 (mild to moderate)
      perf = Math.floor(Math.random() * 3); // 0-2 (worse to better)    } else { // maximum
      // At MRV = high fatigue, may need recovery
      stimulus = Math.floor(Math.random() * 4) + 4; // 4-7 (variable)
      soreness = Math.floor(Math.random() * 2) + 2; // 2-3 (moderate to high)
      perf = Math.floor(Math.random() * 2); // 0-1 (worse to same)
    }

    // Generate enhanced fatigue indicators
    let jointAche = 0;
    let perfChange = 0;
    let lastLoad = 100; // Default baseline

    // Higher volume status = more likely to have joint issues and performance drops
    if (volumeStatus === "maximum") {
      jointAche = Math.floor(Math.random() * 3) + 1; // 1-3 (mild to pain)
      perfChange = Math.random() > 0.6 ? -1 : 0; // 40% chance of performance drop
      lastLoad = 95; // Simulate strength drop
    } else if (volumeStatus === "high") {
      jointAche = Math.floor(Math.random() * 2); // 0-1 (none to mild)
      perfChange = Math.random() > 0.8 ? -1 : Math.random() > 0.5 ? 0 : 1; // Mixed performance
      lastLoad = 98; // Slight strength drop
    } else {
      jointAche = Math.floor(Math.random() * 2); // 0-1 (none to mild)
      perfChange = Math.random() > 0.7 ? 1 : 0; // 30% chance of PR
      lastLoad = 102; // Strength increase
    }

    weeklyFeedback[muscle] = {
      stimulus,
      soreness,
      perf,
      jointAche,
      perfChange,
      lastLoad,
      pump: Math.floor(stimulus / 3), // Derive pump from stimulus
      disruption: Math.floor(stimulus / 3), // Derive workload from stimulus
      recoverySession:
        soreness >= 3 || (volumeStatus === "maximum" && Math.random() < 0.3),
    };
  });

  // Process auto-progression
  const result = processWeeklyVolumeProgression(weeklyFeedback, trainingState);
  // Update chart
  updateChart();

  // Show notification
  const message = result.deloadTriggered
    ? `🛑 ${result.recommendation} (${result.mrvHits} muscles at MRV)`
    : `📈 Auto-progression complete (+${Object.values(result.progressionLog).reduce((sum, log) => sum + log.increment, 0)} total sets)`;

  const output =
    document.getElementById("autoVolumeOut") ||
    document.getElementById("volumeOut") ||
    document.createElement("div");
  const progressionDetails = Object.entries(result.progressionLog)
    .map(
      ([muscle, log]) =>
        `<div>${muscle}: ${log.previousSets} → ${log.currentSets} sets (${log.reason})</div>`,
    )
    .join("");
  output.innerHTML = `
    <div class="auto-progression-result">
      <h4>${message}</h4>
      <div class="progression-details">
        ${progressionDetails}
      </div>
    </div>
  `;
  output.className = result.deloadTriggered
    ? "result warning active"
    : "result success active";

  console.log("Auto-progression result:", result);
};

/* ----- RIR Schedule & Load Feedback Functions ----- */
window.runWeeklyLoadAdjustments = function () {
  const muscles = Object.keys(trainingState.volumeLandmarks);
  const currentWeek = trainingState.weekNo;

  // Simulate weekly RIR feedback
  const weeklyRIRFeedback = simulateWeeklyRIRFeedback(muscles, currentWeek);

  // Process load adjustments
  const adjustmentResult = processWeeklyLoadAdjustments(weeklyRIRFeedback);

  // Update display
  const output =
    document.getElementById("autoVolumeOut") ||
    document.getElementById("volumeOut") ||
    document.createElement("div");

  const adjustmentDetails = Object.entries(adjustmentResult.adjustments)
    .map(
      ([muscle, adj]) =>
        `<div class="load-adjustment ${adj.urgency}">
      <strong>${muscle}:</strong> ${adj.loadAdjustment > 0 ? "+" : ""}${adj.loadAdjustment.toFixed(1)}% 
      (${adj.currentRIR.toFixed(1)} vs ${adj.targetRIR.toFixed(1)} RIR)
      <div class="adjustment-reason">${adj.reason}</div>
    </div>`,
    )
    .join("");

  output.innerHTML = `
    <div class="auto-progression-result">
      <h4>⚖️ Weekly Load Adjustments - Week ${adjustmentResult.week}</h4>
      <div class="rir-summary">
        <div>Target RIR: ${adjustmentResult.targetRIR.toFixed(1)}</div>
        <div>Muscles Adjusted: ${adjustmentResult.summary.musclesAdjusted}/${adjustmentResult.summary.totalMuscles}</div>
        <div>Avg Load Change: ${adjustmentResult.summary.avgLoadChange > 0 ? "+" : ""}${adjustmentResult.summary.avgLoadChange.toFixed(1)}%</div>
      </div>
      <div class="load-adjustments">
        ${adjustmentDetails}
      </div>
    </div>
  `;
  output.className = "result success active";

  console.log("Weekly load adjustments:", adjustmentResult);
};

window.showNextWeekLoadProgression = function () {
  const muscles = Object.keys(trainingState.volumeLandmarks);
  const progressions = [];

  muscles.forEach((muscle) => {
    // Simulate session history for the muscle
    const sessionHistory = {
      averageRIR:
        getScheduledRIR(trainingState.weekNo, trainingState.mesoLen) +
        (Math.random() * 2 - 1),
    };

    const progression = getLoadProgression(muscle, sessionHistory);
    progressions.push(progression);
  });

  const output =
    document.getElementById("autoVolumeOut") ||
    document.getElementById("volumeOut") ||
    document.createElement("div");

  const progressionDetails = progressions
    .map(
      (prog) =>
        `<div class="load-progression">
      <strong>${prog.muscle}:</strong> ${prog.loadIncrease > 0 ? "+" : ""}${prog.loadIncrease}% 
      (${prog.currentRIR.toFixed(1)} → ${prog.nextRIR.toFixed(1)} RIR)
      <div class="progression-recommendation">${prog.recommendation}</div>
    </div>`,
    )
    .join("");

  const nextWeek = trainingState.weekNo + 1;
  const nextRIR = getScheduledRIR(nextWeek, trainingState.mesoLen);

  output.innerHTML = `
    <div class="auto-progression-result">
      <h4>📈 Load Progression for Week ${nextWeek}</h4>
      <div class="rir-summary">
        <div>Next Week Target RIR: ${nextRIR.toFixed(1)}</div>
        <div>Total Muscles: ${progressions.length}</div>
        <div>Avg Load Increase: +${(progressions.reduce((sum, p) => sum + p.loadIncrease, 0) / progressions.length).toFixed(1)}%</div>
      </div>
      <div class="load-progressions">
        ${progressionDetails}
      </div>
    </div>
  `;
  output.className = "result success active";

  console.log("Next week load progressions:", progressions);
};

window.showRIRSchedule = function () {
  const mesoLength = trainingState.mesoLen;
  const currentWeek = trainingState.weekNo;

  const schedule = [];
  for (let week = 1; week <= mesoLength; week++) {
    const scheduledRIR = getScheduledRIR(week, mesoLength);
    const isCurrent = week === currentWeek;
    schedule.push({
      week,
      rir: scheduledRIR,
      isCurrent,
      intensity:
        scheduledRIR >= 2.5
          ? "Low"
          : scheduledRIR >= 2.0
            ? "Moderate"
            : scheduledRIR >= 1.0
              ? "High"
              : "Maximum",
    });
  }

  const output =
    document.getElementById("autoVolumeOut") ||
    document.getElementById("volumeOut") ||
    document.createElement("div");

  const scheduleDisplay = schedule
    .map(
      (item) =>
        `<div class="rir-week ${item.isCurrent ? "current-week" : ""}">
      <strong>Week ${item.week}:</strong> ${item.rir.toFixed(1)} RIR (${item.intensity})
      ${item.isCurrent ? " ← Current" : ""}
    </div>`,
    )
    .join("");

  output.innerHTML = `
    <div class="auto-progression-result">
      <h4>📅 RIR Schedule - ${mesoLength} Week Mesocycle</h4>
      <div class="rir-schedule">
        ${scheduleDisplay}
      </div>
      <div class="schedule-notes">
        <div>• Scheduled progression follows RP guidelines</div>
        <div>• Lower RIR = Higher intensity (closer to failure)</div>
        <div>• Deload after final week</div>
      </div>
    </div>
  `;
  output.className = "result success active";

  console.log("RIR Schedule:", schedule);
};
/* ----- Advanced Intelligence UI Functions ----- */

// Live Performance Monitoring
let sessionActive = false;
let currentSetNumber = 0;

window.startLiveSession = function () {
  const exercise = document.getElementById("liveExercise").value;
  const muscle = document.getElementById("liveMuscle").value;
  const plannedSets = parseInt(document.getElementById("plannedSets").value);
  const targetRIR = trainingState.getTargetRIR();

  const result = liveMonitor.startSession({
    muscle: muscle,
    exercise: exercise,
    plannedSets: plannedSets,
    targetRIR: targetRIR,
  });

  sessionActive = true;
  currentSetNumber = 0;

  // Update UI
  document.getElementById("startSessionBtn").style.display = "none";
  document.getElementById("logSetBtn").style.display = "inline-block";
  document.getElementById("endSessionBtn").style.display = "inline-block";
  document.getElementById("liveMonitor").style.display = "block";

  const output = document.getElementById("liveMonitorOut");
  output.innerHTML = `<strong>🎮 Live Session Started!</strong><br>${result.message}<br><br>Target RIR: ${targetRIR}<br>Planned Sets: ${plannedSets}`;
  output.className = "result success active";
};

window.logTrainingSet = function () {
  if (!sessionActive) {
    alert("Please start a session first!");
    return;
  }

  currentSetNumber++;

  // Simulate realistic set data (in real app, this would come from user input)
  const setData = {
    weight: 80 + (Math.random() * 10 - 5), // 75-85kg range
    reps: 8 + Math.floor(Math.random() * 3), // 8-10 reps
    rir: 1.5 + Math.random() * 1, // 1.5-2.5 RIR
    rpe: null,
    techniqueRating: 7 + Math.floor(Math.random() * 3), // 7-9 rating
    notes: `Set ${currentSetNumber} - simulated`,
  };

  const result = liveMonitor.logSet(setData);

  // Update live display
  updateLiveDisplay({
    sessionProgress: liveMonitor.getSessionProgress(),
    setInfo: { rir: setData.rir },
  });

  // Show feedback
  showSetFeedback(result);
};

window.endLiveSession = function () {
  if (!sessionActive) {
    alert("No active session to end!");
    return;
  }

  const summary = liveMonitor.endSession();
  sessionActive = false;
  currentSetNumber = 0;

  // Update UI
  document.getElementById("startSessionBtn").style.display = "inline-block";
  document.getElementById("logSetBtn").style.display = "none";
  document.getElementById("endSessionBtn").style.display = "none";
  document.getElementById("liveMonitor").style.display = "none";

  showSessionSummary(summary);
};

function updateLiveDisplay(data) {
  if (data.sessionProgress) {
    document.getElementById("currentSet").textContent =
      data.sessionProgress.completedSets;
    document.getElementById("sessionProgress").textContent =
      Math.round(data.sessionProgress.progressPercentage) + "%";
    document.getElementById("totalLoad").textContent =
      data.sessionProgress.totalLoad;
  }
  if (data.setInfo) {
    document.getElementById("currentRIR").textContent =
      data.setInfo.rir.toFixed(1);
  }
}

function showSetFeedback(data) {
  const output = document.getElementById("liveMonitorOut");
  output.className = `result ${data.feedback.type} active`;

  let html = `<strong>Set ${currentSetNumber} Feedback:</strong><br>`;
  html += `${data.feedback.message}<br><br>`;

  if (data.nextSetRecommendations.rationale.length > 0) {
    html += `<strong>Next Set Recommendations:</strong><br>`;
    html += `Weight: ${data.nextSetRecommendations.weight}kg<br>`;
    html += `Rest: ${data.nextSetRecommendations.rest}<br>`;
    html += `Strategy: ${data.nextSetRecommendations.strategy}<br>`;
    html += `Rationale: ${data.nextSetRecommendations.rationale.join(", ")}<br>`;
  }

  output.innerHTML = html;
}

function showSessionSummary(data) {
  const output = document.getElementById("liveMonitorOut");
  output.className = "result success active";

  let html = `<strong>🎯 Session Complete!</strong><br><br>`;
  html += `<strong>Performance Grade:</strong> ${data.performance.targetAchievement.grade}<br>`;
  html += `<strong>Consistency Rating:</strong> ${data.performance.consistency.rating}<br>`;
  html += `<strong>Total Load:</strong> ${data.progress.totalLoad}<br>`;
  html += `<strong>Duration:</strong> ${data.progress.duration} minutes<br><br>`;

  if (data.recommendations.length > 0) {
    html += `<strong>Recommendations:</strong><br>`;
    data.recommendations.forEach((rec) => {
      html += `• ${rec.message}<br>`;
    });
  }

  output.innerHTML = html;
}

// Intelligence Hub Functions
window.initializeIntelligence = function () {
  const output = document.getElementById("intelligenceOut");
  output.innerHTML =
    '<div class="loading"></div> Initializing Advanced Training Intelligence...';
  output.className = "result active";

  setTimeout(() => {
    const result = advancedIntelligence.initialize();

    let html = "<strong>🧠 Intelligence System Initialized!</strong><br><br>";
    html += `<strong>Analytics:</strong> ${result.analytics ? "✅ Enabled" : "❌ Disabled (need more data)"}<br>`;
    html += `<strong>Exercise Selection:</strong> ${result.exerciseSelection ? "✅ Enabled" : "❌ Disabled"}<br>`;
    html += `<strong>Live Monitoring:</strong> ${result.liveMonitoring ? "✅ Enabled" : "❌ Disabled"}<br><br>`;
    html += `<strong>Status:</strong> ${result.message}`;

    // Update status indicators
    document.getElementById("analyticsStatus").textContent = result.analytics
      ? "✅"
      : "❌";
    document.getElementById("exerciseStatus").textContent =
      result.exerciseSelection ? "✅" : "❌";
    document.getElementById("liveStatus").textContent = result.liveMonitoring
      ? "✅"
      : "❌";
    document.getElementById("hubStatus").textContent = "✅";

    output.className = "result success active";
    output.innerHTML = html;
  }, 1500);
};

window.getWeeklyIntelligence = function () {
  const output = document.getElementById("intelligenceOut");
  output.innerHTML =
    '<div class="loading"></div> Generating weekly intelligence report...';
  output.className = "result active";

  setTimeout(() => {
    const intelligence = advancedIntelligence.getWeeklyIntelligence();

    let html = "<strong>📈 Weekly Intelligence Report</strong><br><br>";
    html += `<strong>Week:</strong> ${intelligence.week}, Block: ${intelligence.block}<br><br>`;

    if (intelligence.recommendations.length > 0) {
      html += "<strong>🎯 Recommendations:</strong><br>";
      intelligence.recommendations.forEach((rec) => {
        html += `• [${rec.urgency.toUpperCase()}] ${rec.message}<br>`;
      });
      html += "<br>";
    }

    if (intelligence.optimizations.length > 0) {
      html += "<strong>🔧 Available Optimizations:</strong><br>";
      intelligence.optimizations.forEach((opt) => {
        html += `• ${opt.type}: ${opt.recommendation || opt.muscle}<br>`;
      });
      html += "<br>";
    }

    if (intelligence.riskAssessment) {
      html += `<strong>⚠️ Risk Level:</strong> ${intelligence.riskAssessment.riskLevel.toUpperCase()}<br>`;
      html += `<strong>Risk Score:</strong> ${intelligence.riskAssessment.riskScore}/100<br>`;
    }

    // Show in intelligence panel
    document.getElementById("intelligencePanel").style.display = "block";
    document.getElementById("intelligenceContent").innerHTML = `
      <div class="recommendation">
        <strong>📊 Current Assessment</strong><br>
        Week ${intelligence.week} analysis shows ${intelligence.recommendations.length} active recommendations
        and ${intelligence.optimizations.length} optimization opportunities.
      </div>
    `;

    output.className = "result success active";
    output.innerHTML = html;
  }, 2000);
};

window.getOptimalExercises = function () {
  const output = document.getElementById("intelligenceOut");
  output.innerHTML =
    '<div class="loading"></div> Analyzing optimal exercises for current training state...';
  output.className = "result active";

  setTimeout(() => {
    const muscle = "Chest"; // Example muscle
    const exercises = selectOptimalExercises(muscle, {
      availableEquipment: ["barbell", "dumbbells", "cables"],
      trainingGoal: "hypertrophy",
      experienceLevel: "intermediate",
      fatigueLevel: 4,
      timeConstraint: "moderate",
    });

    let html = "<strong>💡 Smart Exercise Recommendations</strong><br><br>";
    html += `<strong>For ${muscle}:</strong><br>`;

    exercises.slice(0, 3).forEach((exercise, index) => {
      html += `${index + 1}. <strong>${exercise.name}</strong> (Score: ${exercise.score.toFixed(1)})<br>`;
      html += `   Sets: ${exercise.sets}, Reps: ${exercise.repRange[0]}-${exercise.repRange[1]}<br>`;
      html += `   ${exercise.reasoning}<br><br>`;
    });

    output.className = "result success active";
    output.innerHTML = html;
  }, 1500);
};

window.assessTrainingRisk = function () {
  const output = document.getElementById("intelligenceOut");
  output.innerHTML =
    '<div class="loading"></div> Assessing training risk factors...';
  output.className = "result active";

  setTimeout(() => {
    const riskAssessment = advancedIntelligence.assessTrainingRisk();

    let html = "<strong>⚠️ Training Risk Assessment</strong><br><br>";
    html += `<strong>Risk Score:</strong> ${riskAssessment.riskScore}/100<br>`;
    html += `<strong>Risk Level:</strong> ${riskAssessment.riskLevel.toUpperCase()}<br><br>`;

    if (riskAssessment.riskFactors.length > 0) {
      html += "<strong>Risk Factors:</strong><br>";
      riskAssessment.riskFactors.forEach((factor) => {
        html += `• ${factor}<br>`;
      });
      html += "<br>";
    }

    if (riskAssessment.recommendations.length > 0) {
      html += "<strong>Recommendations:</strong><br>";
      riskAssessment.recommendations.forEach((rec) => {
        html += `• ${rec}<br>`;
      });
    }

    const urgency =
      riskAssessment.riskLevel === "low"
        ? "success"
        : riskAssessment.riskLevel === "moderate"
          ? "warning"
          : "error";
    output.className = `result ${urgency} active`;
    output.innerHTML = html;
  }, 2000);
};

// Analytics Functions
window.optimizeVolumeLandmarks = function () {
  const output = document.getElementById("analyticsOut");
  output.innerHTML =
    '<div class="loading"></div> Analyzing historical data for volume optimization...';
  output.className = "result active";

  setTimeout(() => {
    // Mock historical data for demo
    const mockHistoricalData = [
      { sets: 8, avgStimulus: 7, avgFatigue: 2, performanceChange: 1 },
      { sets: 10, avgStimulus: 8, avgFatigue: 3, performanceChange: 1 },
      { sets: 12, avgStimulus: 8, avgFatigue: 4, performanceChange: 0 },
      { sets: 14, avgStimulus: 7, avgFatigue: 6, performanceChange: -1 },
    ];

    const optimized = optimizeVolumeLandmarks("Chest", mockHistoricalData);

    let html =
      "<strong>📊 Volume Landmark Optimization Results:</strong><br><br>";
    html += `<strong>Optimized Landmarks for Chest:</strong><br>`;
    html += `MEV: ${optimized.MEV} sets<br>`;
    html += `MAV: ${optimized.MAV} sets<br>`;
    html += `MRV: ${optimized.MRV} sets<br><br>`;
    html += `<strong>Confidence:</strong> ${optimized.confidence}%<br>`;

    output.className = "result success active";
    output.innerHTML = html;
  }, 2000);
};

window.predictDeloadTiming = function () {
  const output = document.getElementById("analyticsOut");
  output.innerHTML =
    '<div class="loading"></div> Analyzing fatigue patterns and performance trends...';
  output.className = "result active";

  setTimeout(() => {
    const mockMetrics = {
      weeklyFatigueScore: [3, 4, 6, 7],
      performanceTrend: [85, 82, 78, 75],
      volumeProgression: [40, 44, 48, 52],
      motivationLevel: 6,
      sleepQuality: 7,
    };

    const prediction = predictDeloadTiming(mockMetrics);

    let html = "<strong>🔮 Deload Prediction Analysis:</strong><br><br>";
    html += `<strong>Weeks Until Deload:</strong> ${prediction.weeksUntilDeload}<br>`;
    html += `<strong>Confidence:</strong> ${prediction.confidence}%<br>`;
    html += `<strong>Primary Indicator:</strong> ${prediction.primaryIndicator}<br>`;
    html += `<strong>Recommended Action:</strong> ${prediction.recommendedAction}<br>`;

    const urgency = prediction.weeksUntilDeload <= 2 ? "warning" : "success";
    output.className = `result ${urgency} active`;
    output.innerHTML = html;
  }, 2500);
};

window.detectPlateaus = function () {
  const output = document.getElementById("analyticsOut");
  output.innerHTML =
    '<div class="loading"></div> Analyzing training plateaus and stagnation patterns...';
  output.className = "result active";

  setTimeout(() => {
    const mockTrainingData = {
      weeklyPerformance: [85, 84, 83, 83, 82, 82],
      weeklyVolume: [45, 47, 48, 48, 48, 48],
      weeklyIntensity: [7, 7.5, 8, 8, 8, 8],
      weeklyFatigue: [3, 4, 5, 6, 7, 8],
    };

    const plateauAnalysis = detectTrainingPlateaus(mockTrainingData);

    let html = "<strong>📈 Plateau Detection Results:</strong><br><br>";

    if (plateauAnalysis.plateauDetected) {
      html += `<strong>🚨 Plateau Detected:</strong> ${plateauAnalysis.plateauType}<br>`;
      html += `<strong>Urgency Level:</strong> ${plateauAnalysis.urgency}<br><br>`;
      html += `<strong>💡 Recommended Interventions:</strong><br>`;
      plateauAnalysis.interventions.forEach((intervention) => {
        html += `• ${intervention}<br>`;
      });
      output.className = "result warning active";
    } else {
      html += `<strong>✅ No Plateau Detected</strong><br>`;
      html += `Training progression appears healthy.<br><br>`;
      html += `Continue current program with monitoring.`;
      output.className = "result success active";
    }

    output.innerHTML = html;
  }, 2000);
};

window.getAdaptiveRIR = function () {
  const output = document.getElementById("analyticsOut");
  output.innerHTML =
    '<div class="loading"></div> Analyzing RIR patterns for personalized recommendations...';
  output.className = "result active";

  setTimeout(() => {
    const mockRIRHistory = [
      { actualRIR: 2.5, targetRIR: 2, nextDayFatigue: 3, recoveryDays: 2 },
      { actualRIR: 1.5, targetRIR: 1, nextDayFatigue: 4, recoveryDays: 3 },
      { actualRIR: 3, targetRIR: 2, nextDayFatigue: 2, recoveryDays: 1 },
    ];

    const adaptiveRIR = adaptiveRIRRecommendations("Chest", mockRIRHistory);

    let html = "<strong>🎛️ Adaptive RIR Recommendations:</strong><br><br>";
    html += `<strong>Recommended RIR:</strong> ${adaptiveRIR.recommendedRIR}<br>`;
    html += `<strong>Confidence:</strong> ${adaptiveRIR.confidence}%<br>`;
    html += `<strong>Reasoning:</strong> ${adaptiveRIR.reasoning}<br><br>`;
    html += `<strong>Personalization Notes:</strong><br>`;
    adaptiveRIR.personalizedFactors.forEach((factor) => {
      html += `• ${factor}<br>`;
    });

    output.className = "result success active";
    output.innerHTML = html;
  }, 1500);
};

// Program Generator Function
window.generateWeeklyProgram = function () {
  const output = document.getElementById("programOut");
  output.innerHTML =
    '<div class="loading"></div> Generating intelligent weekly program...';
  output.className = "result active";

  setTimeout(() => {
    const days = parseInt(document.getElementById("programDays").value);
    const split = document.getElementById("programSplit").value;
    const sessionTime = parseInt(document.getElementById("sessionTime").value);
    const experience = document.getElementById("experienceLevel").value;

    const program = generateProgram({
      daysPerWeek: days,
      splitType: split,
      experienceLevel: experience,
      timePerSession: sessionTime,
    });

    let html = "<strong>📋 Generated Weekly Program:</strong><br><br>";
    html += `<strong>Split Type:</strong> ${program.splitType}<br>`;
    html += `<strong>Days Per Week:</strong> ${program.daysPerWeek}<br><br>`;

    program.sessions.forEach((session) => {
      html += `<strong>Day ${session.day}: ${session.name}</strong><br>`;
      session.exercises.forEach((exercise) => {
        html += `• ${exercise.exercise} - ${exercise.sets} sets x ${exercise.reps[0]}-${exercise.reps[1]} reps<br>`;
      });
      html += "<br>";
    });

    output.className = "result success active";
    output.innerHTML = html;
  }, 2000);
};

/* ----- new utility system functions ----- */

// Data Export Functions
window.exportAllData = function (format = "json") {
  const result = dataExportManager.exportAllData(format, {
    includePersonalData: true,
    includeAnalytics: true,
    includeWellness: true,
  });

  if (result.success) {
    console.log(`✅ Data exported successfully: ${result.filename}`);
    showSystemMessage(
      `📤 Data exported: ${result.filename} (${(result.size / 1024).toFixed(1)}KB)`,
      "success",
    );
  } else {
    console.error("❌ Export failed:", result.error);
    showSystemMessage(`❌ Export failed: ${result.error}`, "error");
  }
};

window.createBackup = function () {
  const result = dataExportManager.createAutoBackup();

  if (result.success) {
    console.log("✅ Backup created:", result.backupKey);
    showSystemMessage(
      `💾 Backup created successfully (${result.dataPoints} data points)`,
      "success",
    );
  } else {
    console.error("❌ Backup failed:", result.error);
    showSystemMessage(`❌ Backup failed: ${result.error}`, "error");
  }
};

window.viewBackups = function () {
  const backups = dataExportManager.getAvailableBackups();
  let html = "<strong>📦 Available Backups:</strong><br><br>";

  if (backups.length === 0) {
    html += "<p>No backups available. Create your first backup!</p>";
  } else {
    backups.forEach((backup) => {
      const date = new Date(backup.date).toLocaleString();
      const size = (backup.size / 1024).toFixed(1);
      html += `<div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">`;
      html += `<strong>📅 ${date}</strong><br>`;
      html += `📊 ${backup.dataPoints} data points | 💾 ${size}KB<br>`;
      html += `<button onclick="restoreBackup('${backup.key}')" style="margin-top: 5px; padding: 5px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Restore</button>`;
      html += `</div>`;
    });
  }

  const output =
    document.getElementById("backupResults") ||
    createSystemOutput("backupResults");
  output.innerHTML = html;
  output.className = "result active";
};

window.restoreBackup = function (backupKey) {
  if (confirm("⚠️ This will overwrite your current data. Are you sure?")) {
    const result = dataExportManager.restoreFromBackup(backupKey);

    if (result.success) {
      showSystemMessage(
        "✅ Backup restored successfully! Refreshing page...",
        "success",
      );
      setTimeout(() => location.reload(), 2000);
    } else {
      showSystemMessage(`❌ Restore failed: ${result.error}`, "error");
    }
  }
};

// Performance Functions
window.getPerformanceReport = function () {
  const report = performanceManager.generatePerformanceReport();

  let html = "<strong>⚡ Performance Report:</strong><br><br>";
  html += `<strong>📊 Load Performance:</strong><br>`;
  html += `• Average Load Time: ${Math.round(report.performance.averageLoadTime)}ms<br>`;
  html += `• 95th Percentile: ${Math.round(report.performance.loadTimeP95)}ms<br><br>`;

  html += `<strong>💾 Memory Usage:</strong><br>`;
  html += `• Current: ${report.memory.currentUsage.toFixed(1)}MB<br>`;
  html += `• Peak: ${report.memory.peakUsage.toFixed(1)}MB<br><br>`;

  html += `<strong>🖱️ Interactions:</strong><br>`;
  html += `• Total: ${report.interactions.totalInteractions}<br>`;
  html += `• Average Delay: ${Math.round(report.interactions.averageDelay)}ms<br><br>`;

  if (report.recommendations.length > 0) {
    html += `<strong>💡 Recommendations:</strong><br>`;
    report.recommendations.forEach((rec) => {
      const priority =
        rec.priority === "high"
          ? "🔴"
          : rec.priority === "medium"
            ? "🟡"
            : "🟢";
      html += `${priority} ${rec.message}<br>`;
    });
  }

  const output =
    document.getElementById("performanceResults") ||
    createSystemOutput("performanceResults");
  output.innerHTML = html;
  output.className = "result active";
};

window.clearPerformanceData = function () {
  if (confirm("Clear all performance monitoring data?")) {
    performanceManager.clearOldMetrics();
    localStorage.removeItem("performance-issues");
    showSystemMessage("🧹 Performance data cleared", "success");
  }
};

// User Feedback Functions
window.openFeedbackWidget = function () {
  userFeedbackManager.openFeedbackPanel();
};

window.getUserAnalytics = function () {
  const analytics = userFeedbackManager.generateAnalyticsDashboard();

  let html = "<strong>📈 Usage Analytics:</strong><br><br>";
  html += `<strong>📱 Usage Stats:</strong><br>`;
  html += `• Total Sessions: ${analytics.usage.totalSessions}<br>`;
  html += `• Average Duration: ${analytics.usage.averageSessionDuration} minutes<br>`;
  html += `• Features Used: ${analytics.usage.featuresUsed}<br>`;
  html += `• Most Used: ${analytics.usage.mostUsedFeature}<br><br>`;

  if (analytics.feedback.totalFeedback > 0) {
    html += `<strong>💬 Feedback Summary:</strong><br>`;
    html += `• Total Feedback: ${analytics.feedback.totalFeedback}<br>`;
    html += `• Average Rating: ${analytics.feedback.averageRating}/5 ⭐<br><br>`;
  }

  if (analytics.insights.length > 0) {
    html += `<strong>💡 Insights:</strong><br>`;
    analytics.insights.forEach((insight) => {
      const icon =
        insight.type === "milestone"
          ? "🎉"
          : insight.type === "satisfaction"
            ? "⭐"
            : insight.type === "advanced"
              ? "🧠"
              : "💡";
      html += `${icon} ${insight.message}<br>`;
    });
  }

  const output =
    document.getElementById("analyticsResults") ||
    createSystemOutput("analyticsResults");
  output.innerHTML = html;
  output.className = "result active";
};

// Authentication handlers removed
// import { signIn, signUp, signOut, onAuth, supa } from "../core/db.js";

// const authEmail = document.getElementById("authEmail");
// const authPass = document.getElementById("authPass");

// function setAuthLoading(isLoading) {
//   const spinner = document.getElementById("authSpinner");
//   const btnLogin = document.getElementById("btnLogin");
//   const btnSignUp = document.getElementById("btnSignUp");
//   if (!spinner || !btnLogin || !btnSignUp) return;
//   spinner.style.display = isLoading ? "inline" : "none";
//   btnLogin.disabled = isLoading;
//   btnSignUp.disabled = isLoading;
// }

// window.handleSignIn = async function () {
//   const email = authEmail.value.trim();
//   const pass = authPass.value;
//   setAuthLoading(true);
//   const { error, data } = await signIn(email, pass);
//   setAuthLoading(false);
//   if (error) return alert(error.message);
//   const modal = document.getElementById("authModal");
//   console.log("signIn authModal:", modal, "ready:", document.readyState);
//   console.log("Logged-in session:", data);
// };

// window.handleSignUp = async function () {
//   const email = authEmail.value.trim();
//   const pass = authPass.value;
//   setAuthLoading(true);
//   const { error, data } = await signUp(email, pass);
//   setAuthLoading(false);
//   if (error) return alert(error.message);
//   const modal = document.getElementById("authModal");
//   console.log("signUp authModal:", modal, "ready:", document.readyState);
//   console.log("Signed-up session:", data);
// };

// window.handleSignOut = async function () {
//   await supa.auth.signOut();
//   const modal = document.getElementById("authModal");
//   console.log("signOut authModal:", modal, "ready:", document.readyState);
// };

// onAuth((sess) => {
//   try {
//     const modal = document.getElementById("authModal");
//     console.log("onAuth authModal:", modal, "ready:", document.readyState);
//     // if (modal) modal.classList.toggle("hidden", !!sess);
//     else console.warn("authModal missing in onAuth");
//     const signOutBtn = document.getElementById("signOutBtn");
//     if (signOutBtn) signOutBtn.style.display = sess ? "inline-block" : "none";
//     console.log("Auth session", sess);
//   } catch (err) {
//     console.error("onAuth callback failed:", err);
//   }
// });

/* Temporary stubs to satisfy ESLint — replace with real logic */
export function showSystemMessage(msg = "") {
  console.warn("showSystemMessage stub:", msg);
}
export function createSystemOutput(data = {}) {
  console.warn("createSystemOutput stub:", data);
}
export function updateAllDisplays() {
  const c = document.querySelector('[data-muscle="chest"]');
  const d = trainingState.weeklyVolume?.Chest;
  if (!c || !d) return;
  const b = c.querySelector(".vol-badge");
  b.textContent = `${d.current} sets`;
  c.querySelector(".volume-fill").style.width =
    `${Math.min((d.current / d.MRV) * 100, 100)}%`;
  const col =
    d.current >= d.MRV
      ? "#ef4444"
      : d.current >= d.MAV
        ? "#f59e0b"
        : d.current >= d.MEV
          ? "#10b981"
          : "#6b7280";
  b.style.backgroundColor = col;
}

console.log("globals loaded – auth handlers ready");