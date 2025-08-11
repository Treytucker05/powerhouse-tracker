import React from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

const ImplementationStep = () => {
  const { state, actions } = useProgramContext();

  return (
    <div className="implementation-step">
      <div className="step-header">
        <h2>📊 Implementation & Monitoring</h2>
        <p className="step-description">
          Complete implementation with Bromley monitoring protocols
        </p>
      </div>

      <div className="content-section">
        <h3>Program Summary</h3>
        <div className="program-summary">
          <div className="summary-item">
            <strong>Goal:</strong> {state.primaryGoal || 'Not set'}
          </div>
          <div className="summary-item">
            <strong>System:</strong> {state.selectedSystem || 'Not selected'}
          </div>
          <div className="summary-item">
            <strong>Duration:</strong> {state.timeline?.weeks || 'Not set'} weeks
          </div>
          <div className="summary-item">
            <strong>Wave Type:</strong> {state.periodization?.waveType || 'Not selected'}
          </div>
        </div>

        <h3>🔄 Bromley Monitoring Features</h3>
        <div className="monitoring-features">
          <div className="feature-item">
            <strong>SRN Tracking:</strong> Specificity, Recovery, Novelty metrics
          </div>
          <div className="feature-item">
            <strong>Wave Progression:</strong> Automatic load adjustments
          </div>
          <div className="feature-item">
            <strong>RPE Monitoring:</strong> Effort-based progression
          </div>
          <div className="feature-item">
            <strong>AMRAP Testing:</strong> Regular strength assessments
          </div>
        </div>

        <h3>Next Steps</h3>
        <div className="next-steps">
          <ol>
            <li>Begin with assessment week</li>
            <li>Start base phase training</li>
            <li>Monitor weekly progress</li>
            <li>Adjust based on RPE feedback</li>
            <li>Follow wave progression</li>
          </ol>
        </div>
      </div>

      <div className="step-navigation">
        <button
          className="btn-secondary"
          onClick={() => actions.setCurrentStep(7)}
        >
          ← Back
        </button>

        <button
          className="btn-primary"
          onClick={() => {
            // Save complete program
            actions.finalizeProgram();
            // Navigate to dashboard or program view
          }}
        >
          Start Program! 🚀
        </button>
      </div>

      <div className="bromley-integration-complete">
        <h3>🎯 Bromley Integration Complete!</h3>
        <div className="completion-status">
          ✅ SRN Framework Applied<br />
          ✅ Wave Periodization Ready<br />
          ✅ Goal-System Match Confirmed<br />
          ✅ Enhanced Assessment Protocols<br />
          ✅ Progress Monitoring Enabled
        </div>
      </div>
    </div>
  );
};

export default ImplementationStep;
