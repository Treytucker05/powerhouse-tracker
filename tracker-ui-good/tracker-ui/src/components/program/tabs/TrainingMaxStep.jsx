import React from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

const TrainingMaxStep = () => {
  const { state, actions } = useProgramContext();

  return (
    <div className="training-max-step">
      <div className="step-header">
        <h2>💪 Training Max Assessment - 5/3/1</h2>
        <p className="step-description">
          Current 1RM testing and Training Max establishment with Bromley AMRAP protocols
        </p>
      </div>

      <div className="content-section">
        <h3>Current 1RM or Recent Max Lifts</h3>
        <div className="max-inputs">
          <div className="lift-input">
            <label>Squat 1RM (lbs)</label>
            <input
              type="number"
              value={state.trainingMaxes?.squat || ''}
              onChange={(e) => actions.updateTrainingMaxes({ squat: e.target.value })}
              placeholder="315"
            />
          </div>

          <div className="lift-input">
            <label>Bench Press 1RM (lbs)</label>
            <input
              type="number"
              value={state.trainingMaxes?.bench || ''}
              onChange={(e) => actions.updateTrainingMaxes({ bench: e.target.value })}
              placeholder="225"
            />
          </div>

          <div className="lift-input">
            <label>Deadlift 1RM (lbs)</label>
            <input
              type="number"
              value={state.trainingMaxes?.deadlift || ''}
              onChange={(e) => actions.updateTrainingMaxes({ deadlift: e.target.value })}
              placeholder="365"
            />
          </div>

          <div className="lift-input">
            <label>Overhead Press 1RM (lbs)</label>
            <input
              type="number"
              value={state.trainingMaxes?.ohp || ''}
              onChange={(e) => actions.updateTrainingMaxes({ ohp: e.target.value })}
              placeholder="145"
            />
          </div>
        </div>

        <h3>🔄 Bromley AMRAP Testing Protocol</h3>
        <div className="amrap-protocol">
          <p>Enhanced 5/3/1 with Bromley AMRAP testing for accurate Training Max calculation</p>

          <div className="protocol-option">
            <label>
              <input
                type="radio"
                name="testing-method"
                value="current-max"
                checked={state.testingMethod === 'current-max'}
                onChange={(e) => actions.updateTestingMethod(e.target.value)}
              />
              Use current known 1RM
            </label>
          </div>

          <div className="protocol-option">
            <label>
              <input
                type="radio"
                name="testing-method"
                value="amrap-estimate"
                checked={state.testingMethod === 'amrap-estimate'}
                onChange={(e) => actions.updateTestingMethod(e.target.value)}
              />
              Estimate from recent AMRAP set
            </label>
          </div>

          <div className="protocol-option">
            <label>
              <input
                type="radio"
                name="testing-method"
                value="conservative-estimate"
                checked={state.testingMethod === 'conservative-estimate'}
                onChange={(e) => actions.updateTestingMethod(e.target.value)}
              />
              Conservative estimate (90% of known max)
            </label>
          </div>
        </div>

        <h3>Training Max Calculation</h3>
        <div className="training-max-calculation">
          <p>5/3/1 Training Max = 90% of 1RM (conservative for consistent progression)</p>

          {state.trainingMaxes && (
            <div className="calculated-maxes">
              <h4>Calculated Training Maxes:</h4>
              <ul>
                {state.trainingMaxes.squat && (
                  <li>Squat TM: {Math.round(state.trainingMaxes.squat * 0.9)} lbs</li>
                )}
                {state.trainingMaxes.bench && (
                  <li>Bench TM: {Math.round(state.trainingMaxes.bench * 0.9)} lbs</li>
                )}
                {state.trainingMaxes.deadlift && (
                  <li>Deadlift TM: {Math.round(state.trainingMaxes.deadlift * 0.9)} lbs</li>
                )}
                {state.trainingMaxes.ohp && (
                  <li>OHP TM: {Math.round(state.trainingMaxes.ohp * 0.9)} lbs</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="step-navigation">
        <button
          className="btn-secondary"
          onClick={() => actions.setCurrentStep(5)}
        >
          ← Back to System Selection
        </button>

        <button
          className="btn-primary"
          onClick={() => actions.setCurrentStep(6)}
          disabled={!state.trainingMaxes?.squat || !state.testingMethod}
        >
          Continue to Periodization →
        </button>
      </div>

      <div className="bromley-integration-info">
        <h4>🔄 Bromley 5/3/1 Enhancements</h4>
        <ul>
          <li>AMRAP testing protocols for accurate max estimation</li>
          <li>Wave periodization integration with 5/3/1 structure</li>
          <li>RPE-based auto-regulation</li>
          <li>Enhanced deload and recovery protocols</li>
        </ul>
      </div>
    </div>
  );
};

export default TrainingMaxStep;
