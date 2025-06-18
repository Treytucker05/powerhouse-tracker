/**
 * Experience Toggle Component
 * Manages user experience level and updates phase visibility
 */

import trainingState from '../core/trainingState.js';
import { phaseSections } from './phaseSections.js';

class ExperienceToggle {
  constructor() {
    this.toggle = null;
    this.currentLevel = trainingState.userLevel || 1;
  }

  /**
   * Initialize the experience toggle
   */
  initialize() {
    // Wait for phase sections to be ready
    setTimeout(() => {
      this.toggle = document.getElementById('experienceToggle');
      if (!this.toggle) {
        console.warn('ExperienceToggle: #experienceToggle not found');
        return;
      }

      this.bindEvents();
      this.loadSavedLevel();
      console.log('🎯 Experience toggle initialized at level', this.currentLevel);
    }, 100);
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    if (!this.toggle) return;    this.toggle.addEventListener('change', (e) => {
      const level = e.target.value || "beginner";

      // ✅ persist to state layer
      if (trainingState?.setExperienceLevel) {
        trainingState.setExperienceLevel(level);
      }

      // ✅ inform listeners (phaseSections.js)
      window.dispatchEvent(
        new CustomEvent("experienceLevelChanged", { detail: { level } })
      );
    });
  }

  /**
   * Load saved experience level from training state
   */
  loadSavedLevel() {
    const savedLevel = trainingState.userLevel || this.getSavedLevel();
    this.updateLevel(savedLevel, false); // Don't save on initial load
  }

  /**
   * Update experience level
   */
  updateLevel(level, save = true) {
    const oldLevel = this.currentLevel;
    this.currentLevel = parseInt(level);

    // Update toggle UI
    if (this.toggle) {
      this.toggle.value = this.currentLevel.toString();
    }

    // Update training state
    if (trainingState) {
      trainingState.userLevel = this.currentLevel;
    }

    // Update phase visibility
    if (phaseSections) {
      phaseSections.updateVisibility(this.currentLevel);
    }

    // Save to localStorage
    if (save) {
      this.saveLevel();
    }

    // Log the change
    if (oldLevel !== this.currentLevel) {
      console.log(`🎯 Experience level changed: ${oldLevel} → ${this.currentLevel}`);
      this.trackLevelChange(oldLevel, this.currentLevel);
    }
  }

  /**
   * Save experience level to localStorage
   */
  saveLevel() {
    try {
      localStorage.setItem('userExperienceLevel', this.currentLevel.toString());
      console.log('💾 Experience level saved:', this.currentLevel);
    } catch (error) {
      console.warn('Failed to save experience level:', error);
    }
  }

  /**
   * Get saved experience level from localStorage
   */
  getSavedLevel() {
    try {
      const saved = localStorage.getItem('userExperienceLevel');
      return saved ? parseInt(saved) : 1;
    } catch (error) {
      console.warn('Failed to load experience level:', error);
      return 1;
    }
  }

  /**
   * Track level change for analytics
   */
  trackLevelChange(oldLevel, newLevel) {
    const event = {
      type: 'experience_level_change',
      timestamp: new Date().toISOString(),
      data: {
        from: oldLevel,
        to: newLevel,
        direction: newLevel > oldLevel ? 'upgrade' : 'downgrade'
      }
    };

    // Store in training state if available
    if (trainingState && trainingState.events) {
      trainingState.events.push(event);
    }

    // Log visible phases count
    if (phaseSections) {
      const stats = phaseSections.getStats();
      console.log(`📊 Phase visibility: ${stats.visiblePhases}/${stats.totalPhases} phases visible`);
    }
  }

  /**
   * Get current level info
   */
  getLevelInfo() {
    const levels = {
      1: {
        name: 'Beginner',
        description: 'Essential features for getting started',
        color: '#4ade80',
        phases: ['Foundation Setup', 'Daily Training', 'Weekly Review']
      },
      2: {
        name: 'Intermediate',
        description: 'Advanced planning and live monitoring',
        color: '#fbbf24',
        phases: ['+ Periodization', '+ Live Training']
      },
      3: {
        name: 'Advanced',
        description: 'AI-powered optimization and system management',
        color: '#f87171',
        phases: ['+ AI Intelligence', '+ Advanced Tools']
      }
    };

    return levels[this.currentLevel] || levels[1];
  }

  /**
   * Show level info tooltip or modal
   */
  showLevelInfo() {
    const info = this.getLevelInfo();
    const stats = phaseSections ? phaseSections.getStats() : null;
    
    const message = `
      ${info.name}: ${info.description}
      
      Visible Features:
      ${info.phases.join('\n')}
      
      ${stats ? `${stats.visiblePhases}/${stats.totalPhases} phases | ${stats.totalButtons} total actions` : ''}
    `;
    
    console.log('ℹ️ Level Info:', message);
    return info;
  }

  /**
   * Auto-detect experience level based on usage patterns
   */
  autoDetectLevel() {
    // This could analyze user behavior to suggest level changes
    // For now, just return current level
    return this.currentLevel;
  }

  /**
   * Render experience selector HTML (if not already present)
   */
  renderExperienceSelector() {
    const selectorHTML = `
      <option value="1">Beginner</option>
      <option value="2">Intermediate</option>
      <option value="3">Advanced</option>
    `;

    const root = document.getElementById("experienceToggle");
    if (!root) {
      console.warn(
        "[experienceToggle] #experienceToggle not found — selector not rendered."
      );
      return;
    }
    if (root.children.length) return; // already rendered
    root.innerHTML = selectorHTML;
  }
}

// Create and export singleton instance
export const experienceToggle = new ExperienceToggle();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {  document.addEventListener('DOMContentLoaded', () => {
    // Prevent duplicate initialization
    if (experienceToggle.toggle) return; // already initialized
    
    experienceToggle.initialize();
      // Render the experience selector options if needed
    experienceToggle.renderExperienceSelector();

    /* -----------------------------------------------------------
     *  Clean up: delete any <select id="experienceToggle"> element
     *  that lacks the 'experience-toggle-select' class.
     *  This gets rid of the blank red-border duplicate at the top.
     * --------------------------------------------------------- */
    [...document.querySelectorAll("select#experienceToggle")]
      .filter((el) => !el.classList.contains("experience-toggle-select"))
      .forEach((el) => {
        const label = el.previousElementSibling;
        if (label && label.tagName === "LABEL" && label.innerText.trim() === "EXPERIENCE:") {
          label.remove();
        }
        el.remove();
      });
    
    // Kick off initial phase-visibility update so tabs appear
    const initEvent = new CustomEvent("experienceLevelChanged", {
      detail: { level: trainingState.getExperienceLevel?.() ?? "beginner" },
    });
    window.dispatchEvent(initEvent);
  });
} else {  // DOM already ready - check for duplicates
  if (!experienceToggle.toggle) {
    experienceToggle.initialize();
    
    // Render the experience selector options if needed
    experienceToggle.renderExperienceSelector();

    /* -----------------------------------------------------------
     *  Clean up: delete any <select id="experienceToggle"> element
     *  that lacks the 'experience-toggle-select' class.
     *  This gets rid of the blank red-border duplicate at the top.
     * --------------------------------------------------------- */    [...document.querySelectorAll("select#experienceToggle")]
      .filter((el) => !el.classList.contains("experience-toggle-select"))
      .forEach((el) => {
        const label = el.previousElementSibling;
        if (label && label.tagName === "LABEL" && label.innerText.trim() === "EXPERIENCE:") {
          label.remove();
        }
        el.remove();
      });
    
    // Kick off initial phase-visibility update so tabs appear
    const initEvent = new CustomEvent("experienceLevelChanged", {
      detail: { level: trainingState.getExperienceLevel?.() ?? "beginner" },
    });
    window.dispatchEvent(initEvent);
  }
}

export default experienceToggle;
