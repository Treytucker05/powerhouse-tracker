import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';
import { nasmMethodologyConfig } from '../../assessment/nasm/shared/nasmOPTModel';
import './SystemRecommendationStep.css';

const SystemRecommendationStep = () => {
  const { state, actions } = useProgramContext();

  const systems = [
    {
      id: 'NASM',
      name: nasmMethodologyConfig.name,
      description: nasmMethodologyConfig.description,
      bromleyIntegration: 'Comprehensive movement assessment and corrective exercise integration',
      goals: ['corrective_exercise', 'movement_quality', 'injury_prevention', 'general_fitness', 'hypertrophy', 'sports_performance'],
      movementConsiderations: 'Evidence-based movement assessment with 5-phase OPT model progression',
      features: nasmMethodologyConfig.features,
      systemConfiguration: nasmMethodologyConfig.systemConfiguration
    },
    {
      id: 'RP',
      name: 'Renaissance Periodization',
      description: 'Volume-based hypertrophy and weight loss',
      bromleyIntegration: 'Enhanced with wave progression',
      goals: ['hypertrophy', 'weight_loss'],
      movementConsiderations: 'Best with good movement quality; includes corrective work in warm-up'
    },
    {
      id: 'linear',
      name: 'Linear Periodization',
      description: 'Motor control and general fitness',
      bromleyIntegration: 'Movement quality waves',
      goals: ['motor_control', 'general_fitness'],
      movementConsiderations: 'Ideal for addressing movement compensations with progressive overload'
    },
    {
      id: '5/3/1',
      name: '5/3/1 Method',
      description: 'Strength and powerlifting focus',
      bromleyIntegration: 'AMRAP testing protocols',
      goals: ['strength', 'powerlifting'],
      movementConsiderations: 'Requires good movement foundation; may need corrective phase first'
    },
    {
      id: 'josh-bryant',
      name: 'Josh Bryant Method',
      description: 'Tactical and strongman training',
      bromleyIntegration: 'Specificity optimization',
      goals: ['tactical', 'strongman'],
      movementConsiderations: 'Emphasizes functional movement patterns and injury prevention'
    }
  ];

  const handleSystemSelect = (systemId) => {
    // Set the selected system in the context
    actions.setSelectedSystem(systemId);
    // Do NOT automatically advance the step - let the user click "Next"
  };

  const handleNext = () => {
    if (state.selectedSystem) {
      // Move to the next step in the methodology-first workflow (User Info Phase)
      actions.setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    actions.setCurrentStep(1);
  };

  return (
    <div className="system-recommendation-step">
      <div className="step-header">
        <h2>🤖 System Recommendation</h2>
        <p className="step-description">
          Movement assessment and goal-based system selection with Bromley integration
        </p>
      </div>

      <div className="content-section">
        <h3>📋 Training Systems</h3>
        <p className="recommendation-note">
          Based on your goal: <strong>{state.primaryGoal || state.programData?.goal || 'Not selected'}</strong>
        </p>

        <div className="systems-grid">
          {systems.map((system) => (
            <div
              key={system.id}
              className={`system-card ${state.selectedSystem === system.id ? 'selected' : ''}`}
              onClick={() => handleSystemSelect(system.id)}
            >
              <h4>{system.name}</h4>
              <p className="system-description">{system.description}</p>
              <div className="system-details">
                <div className="bromley-integration">
                  <strong>Bromley Integration:</strong> {system.bromleyIntegration}
                </div>
                <div className="movement-considerations">
                  <strong>Movement Focus:</strong> {system.movementConsiderations}
                </div>
                {system.goals && (
                  <div className="applicable-goals">
                    <strong>Best for:</strong> {system.goals.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="navigation-section">
          <div className="nav-buttons">
            <button
              onClick={handlePrevious}
              className="btn-secondary"
            >
              ← Previous
            </button>

            {state.selectedSystem && (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                Continue to User Information →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemRecommendationStep;
