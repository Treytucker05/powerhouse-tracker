/**
 * Phase Sections UI Component
 * Builds progressive disclosure interface for RP workflow phases
 */

import { workflowPhases } from '../core/workflowPhases.js';
import trainingState from '../core/trainingState.js';

class PhaseSections {
  constructor() {
    this.container = null;
    this.phases = workflowPhases;
    this.userLevel = trainingState.userLevel || 1;
  }

  /**
   * Initialize the phase sections UI
   */
  initialize() {
    this.container = document.getElementById('phasesRoot');
    if (!this.container) {
      console.warn('PhaseSections: #phasesRoot container not found');
      return;
    }

    this.render();
    console.log('🎯 Phase sections initialized with', this.phases.length, 'phases');
  }

  /**
   * Render all phase sections
   */
  render() {
    if (!this.container) return;

    // Clear container
    this.container.innerHTML = '';
    
    // Add experience toggle
    this.renderExperienceToggle();
    
    // Add phases container
    const phasesContainer = document.createElement('div');
    phasesContainer.className = 'phases-container';
    
    // Render each phase
    this.phases.forEach(phase => {
      const phaseElement = this.renderPhase(phase);
      phasesContainer.appendChild(phaseElement);
    });
    
    this.container.appendChild(phasesContainer);
    
    // Move existing buttons into phases
    this.moveButtonsToPhases();
  }

  /**
   * Render experience level toggle
   */
  renderExperienceToggle() {
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'experience-toggle-container';
    
    toggleContainer.innerHTML = `
      <label class="experience-toggle-label" for="experienceToggle">
        Experience Level:
      </label>
      <select id="experienceToggle" class="experience-toggle-select">
        <option value="1" ${this.userLevel === 1 ? 'selected' : ''}>Beginner</option>
        <option value="2" ${this.userLevel === 2 ? 'selected' : ''}>Intermediate</option>
        <option value="3" ${this.userLevel === 3 ? 'selected' : ''}>Advanced</option>
      </select>
      <div class="phase-button-count">
        ${this.getVisiblePhaseCount()} phases visible
      </div>
    `;
    
    this.container.appendChild(toggleContainer);
  }

  /**
   * Render a single phase section
   */
  renderPhase(phase) {
    const isVisible = phase.level <= this.userLevel;
    const levelClass = `level-${phase.level}`;
    const hiddenClass = isVisible ? '' : 'level--hidden';
    
    const phaseElement = document.createElement('details');
    phaseElement.className = `phase-section ${levelClass} ${hiddenClass}`;
    phaseElement.dataset.phaseId = phase.id;
    phaseElement.dataset.level = phase.level;
    
    // Create summary (header)
    const summary = document.createElement('summary');
    summary.className = 'phase-summary';
    
    const levelIndicator = this.getLevelIndicator(phase.level);
    const buttonCount = phase.buttons.length;
    
    summary.innerHTML = `
      <div class="phase-header">
        <h3 class="phase-title">${phase.title}</h3>
        <div class="phase-meta">
          <span class="phase-cadence">${phase.cadence}</span>
          <span class="phase-description">${phase.description}</span>
          ${levelIndicator}
        </div>
      </div>
      <div class="phase-expand-icon">▼</div>
    `;
    
    // Create content area
    const content = document.createElement('div');
    content.className = 'phase-content';
    
    content.innerHTML = `
      <div class="phase-buttons" data-phase="${phase.id}">
        <!-- Buttons will be moved here dynamically -->
      </div>
    `;
    
    phaseElement.appendChild(summary);
    phaseElement.appendChild(content);
    
    return phaseElement;
  }

  /**
   * Get level indicator HTML
   */
  getLevelIndicator(level) {
    const labels = {
      1: 'Beginner',
      2: 'Intermediate', 
      3: 'Advanced'
    };
    
    return `<span class="phase-level-indicator level-${level}">${labels[level]}</span>`;
  }

  /**
   * Move existing buttons from HTML into phase sections
   */
  moveButtonsToPhases() {
    this.phases.forEach(phase => {
      const phaseContainer = document.querySelector(`[data-phase="${phase.id}"]`);
      if (!phaseContainer) return;
      
      phase.buttons.forEach(buttonConfig => {
        const existingButton = document.querySelector(buttonConfig.selector);
        if (existingButton) {
          // Clone the button to preserve event listeners
          const newButton = existingButton.cloneNode(true);
          newButton.className = `phase-button ${buttonConfig.primary ? 'primary' : ''}`;
          
          // Update text if specified
          if (buttonConfig.label) {
            newButton.textContent = buttonConfig.label;
          }
          
          // Add to phase container
          phaseContainer.appendChild(newButton);
          
          // Hide original button
          existingButton.style.display = 'none';
        } else {
          console.warn(`Button not found: ${buttonConfig.selector}`);
        }
      });
    });
  }

  /**
   * Update visibility based on user level
   */
  updateVisibility(newLevel) {
    this.userLevel = parseInt(newLevel);
    
    // Update phase visibility
    const phaseElements = document.querySelectorAll('.phase-section');
    phaseElements.forEach(element => {
      const phaseLevel = parseInt(element.dataset.level);
      const isVisible = phaseLevel <= this.userLevel;
      
      if (isVisible) {
        element.classList.remove('level--hidden');
      } else {
        element.classList.add('level--hidden');
      }
    });
    
    // Update button count
    const countElement = document.querySelector('.phase-button-count');
    if (countElement) {
      countElement.textContent = `${this.getVisiblePhaseCount()} phases visible`;
    }
    
    console.log(`🎯 Updated visibility to level ${this.userLevel}`);
  }

  /**
   * Get count of visible phases
   */
  getVisiblePhaseCount() {
    return this.phases.filter(phase => phase.level <= this.userLevel).length;
  }

  /**
   * Get phase statistics
   */
  getStats() {
    const stats = {
      totalPhases: this.phases.length,
      visiblePhases: this.getVisiblePhaseCount(),
      totalButtons: this.phases.reduce((total, phase) => total + phase.buttons.length, 0),
      byLevel: {
        1: this.phases.filter(p => p.level === 1).length,
        2: this.phases.filter(p => p.level === 2).length,
        3: this.phases.filter(p => p.level === 3).length
      }
    };
    
    return stats;
  }
}

// Create and export singleton instance
export const phaseSections = new PhaseSections();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    phaseSections.initialize();
  });
} else {
  phaseSections.initialize();
}

export default phaseSections;
