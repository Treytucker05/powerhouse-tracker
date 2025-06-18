import trainingState from "../core/trainingState.js";
import {
  calculateOptimalFrequency,
  processWeeklyVolumeProgression,
} from "../calculators/unified.js";
import { processRPData } from "../core/rpAlgorithms.js";

export async function btnOptimizeFrequency() {
<<<<<<< HEAD
  const muscles = Object.keys(trainingState.volumeLandmarks);
  
  // Check if any volume landmarks are set
  if (!muscles.length || !trainingState.volumeLandmarks) {
    alert(
      "Please set volume landmarks (MV → MRV) for muscles before optimizing frequency."
    );
    return;
  }
  
  // Check if any muscle has incomplete landmarks
  const incompleteMuscles = muscles.filter(m => {
    const landmarks = trainingState.volumeLandmarks[m];
    return !landmarks || landmarks.MAV == null || landmarks.MRV == null;
  });
  
  if (incompleteMuscles.length > 0) {
    alert(
      `Please complete volume landmarks for: ${incompleteMuscles.join(", ")} before optimizing frequency.`
    );
    return;
  }
    const results = muscles.map((m) => {
    const landmarks = trainingState.volumeLandmarks[m];
    const currentFreq =
      trainingState.currentFrequency?.[m] ??
      trainingState.currentFrequency ??
      0;

    return {
      muscle: m,
      optimal: calculateOptimalFrequency(landmarks, currentFreq),
    };
=======
  const volumeLandmarks = trainingState.volumeLandmarks;
  if (!volumeLandmarks || Object.keys(volumeLandmarks).length === 0) {
    console.warn("btnOptimizeFrequency: No volume landmarks available");
    return;
  }
  const muscles = Object.keys(volumeLandmarks);
  const results = [];
  muscles.forEach((m) => {
    const lm = volumeLandmarks[m];
    if (!lm || lm.MAV === undefined) {
      console.warn(`btnOptimizeFrequency: Missing landmarks for ${m}`);
      return;
    }
    results.push(
      calculateOptimalFrequency(m, {
        currentVolume: trainingState.currentWeekSets[m],
      }),
    );
>>>>>>> 5a1c01a59fbf0b5865cb43f9ef7c52c73314e3af
  });
  const out = document.getElementById("freqOut") || document.body;
  out.innerHTML = `<pre>${JSON.stringify(results, null, 2)}</pre>`;
}

export async function btnProcessWithRPAlgorithms() {
  const data = processRPData(trainingState);
  const out = document.getElementById("output") || document.body;
  out.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

export async function btnAutoProgressWeekly() {
  const feedback = {};
  const result = processWeeklyVolumeProgression(feedback, trainingState);
  console.log(result);
}

export async function btnGenerateMesocycle() {
  const weeks = trainingState.mesoLen;
  const plan = Array.from({ length: weeks }, (_, i) => ({ week: i + 1 }));
  console.log("Generated mesocycle", plan);
}

export async function btnExportProgram() {
  const csv = JSON.stringify(trainingState.currentWeekSets);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "program.csv";
  a.click();
}

export async function btnAnalyzeVolume() {
  const muscles = Object.keys(trainingState.volumeLandmarks);
  const report = muscles.map((m) => ({ muscle: m, sets: trainingState.getWeeklySets(m) }));
  console.log("Volume report", report);
}

export async function btnPredictDeload() {
  alert(trainingState.shouldDeload() ? "Deload soon" : "Keep going");
}

export async function btnDetectPlateau() {
  console.log("Plateau detection placeholder");
}

export async function btnAdaptiveRIR() {
  console.log("Adaptive RIR placeholder");
}

export async function btnSaveToCloud() {
  const data = JSON.stringify(trainingState);
  localStorage.setItem("ph-backup", data);
  alert("Saved to cloud (localStorage)");
}

// attach to window for legacy handlers
Object.assign(window, {
  btnOptimizeFrequency,
  btnProcessWithRPAlgorithms,
  btnAutoProgressWeekly,
  btnGenerateMesocycle,
  btnExportProgram,
  btnAnalyzeVolume,
  btnPredictDeload,
  btnDetectPlateau,
  btnAdaptiveRIR,
  btnSaveToCloud,
});
