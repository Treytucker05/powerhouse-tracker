/*  Maps module functions onto window so legacy inline onclick="" handlers keep working */

import { 
  initChart, 
  updateChart, 
  addVolumeLandmarks, 
  resetChart, 
  exportChartImage 
} from './chartManager.js';

import { 
  scoreStimulus, 
  setProgressionAlgorithm, 
  getVolumeProgression,
  analyzeDeloadNeed 
} from '../algorithms/volume.js';

import { 
  calculateTargetRIR, 
  validateEffortLevel 
} from '../algorithms/effort.js';

import { 
  analyzeFrequency, 
  calculateOptimalFrequency 
} from '../algorithms/fatigue.js';

import { 
  validateLoad, 
  validateSets, 
  validateMesocycleLength 
} from '../algorithms/validation.js';

import trainingState from '../core/trainingState.js';

/* ----- expose key objects ----- */
window.trainingState = trainingState;

/* ----- expose chart functions ----- */
window.updateChart = updateChart;
window.resetWeeklyData = resetChart;
window.showVolumeLandmarks = addVolumeLandmarks;
window.exportSummary = exportChartImage;

/* ----- expose section toggle (enhanced with display:none) ----- */
window.toggleSection = function(sectionId) {
  const content = document.getElementById(sectionId + '-content');
  const banner = content.previousElementSibling;
  const icon = banner.querySelector('.expand-icon');

  const opening = !content.classList.contains('expanded');

  // ------- EXPAND -------
  if (opening) {
    content.style.display = 'block';           // back in flow
    // allow next paint, then add class so CSS transition plays
    requestAnimationFrame(() => {
      content.classList.add('expanded');
      banner.classList.add('expanded');
      // Update icon rotation
      if (icon) {
        icon.style.transform = 'rotate(180deg)';
      }
      postHeight();                            // send new tall height
    });
  }

  // ------- COLLAPSE -------
  else {
    content.classList.remove('expanded');      // start transition
    banner.classList.remove('expanded');
    // Update icon rotation
    if (icon) {
      icon.style.transform = 'rotate(0deg)';
    }

    // when transition ends hide element to drop layout height
    content.addEventListener('transitionend', function handler() {
      content.style.display = 'none';
      content.removeEventListener('transitionend', handler);
      postHeight();                            // send shorter height
    });
  }

  // helper sends current height to parent iframe
  function postHeight() {
    if (!window.parent) return;
    const h = document.documentElement.getBoundingClientRect().height;
    window.parent.postMessage({ phxHeight: h }, '*');
  }
};

/* ----- expose RP algorithm functions ----- */
window.scoreStimulus = scoreStimulus;
window.setProgressionAlgorithm = setProgressionAlgorithm;
window.getVolumeProgression = getVolumeProgression;
window.analyzeDeloadNeed = analyzeDeloadNeed;
window.calculateTargetRIR = calculateTargetRIR;
window.validateEffortLevel = validateEffortLevel;
window.analyzeFrequency = analyzeFrequency;
window.calculateOptimalFrequency = calculateOptimalFrequency;
window.validateLoad = validateLoad;
window.validateSets = validateSets;
window.validateMesocycleLength = validateMesocycleLength;

/* ----- main UI handlers for buttons ----- */
window.submitFeedback = function() {
  const muscle = document.getElementById('muscleSelect').value;
  const mmc = parseInt(document.getElementById('mmc').value, 10);
  const pump = parseInt(document.getElementById('pump').value, 10);
  const disruption = parseInt(document.getElementById('dis').value, 10);
  const soreness = parseInt(document.getElementById('sore').value, 10);
  const actualRIR = document.getElementById('actualRIR').value;
  
  const perfRadio = document.querySelector('input[name="perf"]:checked');
  const performance = perfRadio ? parseInt(perfRadio.value, 10) : 2;
  
  // Validate inputs
  if (!muscle || isNaN(mmc) || isNaN(pump) || isNaN(disruption)) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Process with RP algorithms
  const stimulusResult = scoreStimulus({ mmc, pump, disruption });
  const progressionResult = setProgressionAlgorithm(soreness, performance);
  
  const volumeProgression = getVolumeProgression(muscle, {
    stimulus: { mmc, pump, disruption },
    soreness,
    performance,
    hasIllness: false
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
  const output = document.getElementById('mevOut');
  let html = `
    <div class="feedback-results">
      <div class="main-recommendation">
        <h4>${muscle} Recommendation</h4>
        <p class="advice">${volumeProgression.advice}</p>
        <p class="sets-info">
          ${volumeProgression.currentSets} → ${volumeProgression.projectedSets} sets
          ${volumeProgression.setChange !== 0 ? `(${volumeProgression.setChange > 0 ? '+' : ''}${volumeProgression.setChange})` : ''}
        </p>
      </div>
      
      <div class="algorithm-details">
        <div>
          <strong>Stimulus:</strong> ${stimulusResult.score}/9 
          <span class="stimulus-${stimulusResult.action}">(${stimulusResult.action.replace('_', ' ')})</span>
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
  output.className = 'result success active';
  
  updateChart();
};

window.analyzeDeload = function() {
  const halfMuscles = document.getElementById('halfMuscles').checked;
  const mrvBreach = document.getElementById('mrvBreach').checked;
  const illness = document.getElementById('illness').checked;
  const lowMotivation = document.getElementById('lowMotivation').checked;
  
  const analysis = analyzeDeloadNeed();
  
  // Override with manual inputs
  if (halfMuscles) analysis.reasons.push('Most muscles need recovery (manual check)');
  if (mrvBreach) analysis.reasons.push('Hit MRV twice consecutively (manual check)');
  if (illness) analysis.reasons.push('Illness/injury present');
  if (lowMotivation) analysis.reasons.push('Low motivation levels');
  
  const shouldDeload = analysis.shouldDeload || halfMuscles || mrvBreach || illness || lowMotivation;
  
  const output = document.getElementById('deloadOut');
  
  if (shouldDeload) {
    output.innerHTML = `
      <strong>Deload Recommended</strong><br>
      Reasons: ${analysis.reasons.join(', ')}<br>
      <em>Take 1 week at 50% volume + 25-50% load reduction</em>
    `;
    output.className = 'result warning active';
    
    // Offer to start deload
    setTimeout(() => {
      if (confirm('Start deload phase now? This will reduce all muscle volumes to 50% of MEV.')) {
        trainingState.startDeload();
        updateChart();
      }
    }, 1000);
  } else {
    output.innerHTML = 'No deload needed - continue current program';
    output.className = 'result success active';
  }
};

window.analyzeFrequency = function() {
  const soreDays = parseInt(document.getElementById('soreDays').value, 10);
  const sessionGap = parseInt(document.getElementById('sessionGap').value, 10);
  const trainingAge = document.getElementById('trainingAge').value;
  const muscle = document.getElementById('muscleSelect').value;
  
  const analysis = analyzeFrequency(soreDays, sessionGap, muscle);
  const optimal = calculateOptimalFrequency(muscle, {
    trainingAge,
    currentVolume: trainingState.currentWeekSets[muscle]
  });
  
  const output = document.getElementById('freqOut');
  output.innerHTML = `
    <strong>${analysis.recommendation}</strong><br>
    Current: ${sessionGap} days between sessions<br>
    Recovery: ${soreDays} days<br>
    Optimal frequency: ${optimal.recommendedFrequency}x/week (${optimal.setsPerSession} sets/session)
  `;
  
  const type = analysis.urgency === 'high' ? 'warning' : 
               analysis.urgency === 'medium' ? 'warning' : 'success';
  output.className = `result ${type} active`;
};

window.saveLandmarks = function() {
  const muscle = document.getElementById('landmarkMuscle').value;
  const mv = parseInt(document.getElementById('mv').value, 10);
  const mev = parseInt(document.getElementById('mev').value, 10);
  const mav = parseInt(document.getElementById('mav').value, 10);
  const mrv = parseInt(document.getElementById('mrv').value, 10);
  
  // Validate relationships
  if (mv > mev || mev > mav || mav > mrv) {
    alert('Invalid landmark relationship (MV ≤ MEV ≤ MAV ≤ MRV)');
    return;
  }
  
  trainingState.updateVolumeLandmarks(muscle, { MV: mv, MEV: mev, MAV: mav, MRV: mrv });
  updateChart();
  
  const output = document.getElementById('volumeOut');
  output.innerHTML = `Landmarks saved for ${muscle}: MV:${mv}, MEV:${mev}, MAV:${mav}, MRV:${mrv}`;
  output.className = 'result success active';
};

window.applyVolumePreset = function(level) {
  const muscle = document.getElementById('landmarkMuscle').value;
  const multipliers = {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.2
  };
  
  const mult = multipliers[level];
  const baseLandmarks = trainingState.volumeLandmarks[muscle];
  
  document.getElementById('mv').value = Math.round(baseLandmarks.MV * mult);
  document.getElementById('mev').value = Math.round(baseLandmarks.MEV * mult);
  document.getElementById('mav').value = Math.round(baseLandmarks.MAV * mult);
  document.getElementById('mrv').value = Math.round(baseLandmarks.MRV * mult);
};

window.setupMeso = function() {
  const length = parseInt(document.getElementById('mesoLength').value, 10);
  const week = parseInt(document.getElementById('currentWeekNum').value, 10);
  const goal = document.getElementById('trainingGoal').value;
  
  const validation = validateMesocycleLength(length, goal);
  
  if (!validation.isValid) {
    alert(validation.warning);
    return;
  }
  
  trainingState.mesoLen = length;
  trainingState.weekNo = week;
  trainingState.saveState();
  
  const output = document.getElementById('mesoOut');
  output.innerHTML = `
    Mesocycle configured: ${length} weeks for ${goal}<br>
    Currently week ${week} (Target RIR: ${trainingState.getTargetRIR().toFixed(1)})<br>
    ${validation.recommendation}
  `;
  output.className = 'result success active';
};
