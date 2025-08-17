import React from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

const PeriodizationStep = () => {
  const { state, actions } = useProgramContext();

  return (
    <div className="periodization-step">
      <div className="step-header">
        <h2>📅 Periodization</h2>
        <p className="step-description">
          Complete periodization strategy with Bromley wave integration
        </p>
      </div>

      <div className="content-section">
        <h3>🌊 Bromley Wave Periodization</h3>
        <p>Enhanced periodization with Specificity, Recovery, and Novelty principles</p>

        <div className="periodization-options">
          <div className="wave-type-selection">
            <h4>Wave Type</h4>
            <div className="wave-options">
              <button
                className={`wave-btn ${state.periodization?.waveType === 'volumizing' ? 'active' : ''}`}
                onClick={() => actions.updatePeriodization({ waveType: 'volumizing' })}
              >
                📈 Volumizing Waves
                <span className="wave-description">3×12 → 4×10 → 5×8</span>
              </button>

              <button
                className={`wave-btn ${state.periodization?.waveType === 'intensifying' ? 'active' : ''}`}
                onClick={() => actions.updatePeriodization({ waveType: 'intensifying' })}
              >
                💪 Intensifying Waves
                <span className="wave-description">5×5 → 4×4 → 3×3</span>
              </button>
            </div>
          </div>

          <div className="phase-structure">
            <h4>Phase Structure</h4>
            <div className="phases">
              <div className="phase-item">
                <strong>Base Phase:</strong> 6-8 weeks of volume building
              </div>
              <div className="phase-item">
                <strong>Peak Phase:</strong> 4-6 weeks of intensity focus
              </div>
              <div className="phase-item">
                <strong>Deload:</strong> Every 3-4 weeks
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="step-navigation">
        <button
          className="btn-secondary"
          onClick={() => actions.setCurrentStep('5a')}
        >
          ← Back
        </button>

        <button
          className="btn-primary"
          onClick={() => actions.setCurrentStep(7)}
        >
          Continue to Program Design →
        </button>
      </div>
    </div>
  );
};

export default PeriodizationStep;
