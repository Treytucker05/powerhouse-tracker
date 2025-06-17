import trainingState from '../core/trainingState.js';

export function setExperienceLevel(level) {
  trainingState.userLevel = level;
  document.body.className = 'level-' + trainingState.userLevel;
}

export function initExperienceToggle(id = 'experienceToggle') {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('change', (e) => {
    setExperienceLevel(e.target.value);
  });
}
