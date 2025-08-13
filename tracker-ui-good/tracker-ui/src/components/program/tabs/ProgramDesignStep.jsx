import React, { useEffect, useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';
import {
  generateNASMProgram,
  determineNASMStartingPhase,
  nasmOPTPhases,
  nasmProgressionModels
} from '../../assessment/nasm/shared/nasmOPTModel';

const ProgramDesignStep = () => {
  const { state, actions } = useProgramContext();
  const [nasmProgram, setNasmProgram] = useState(null);
  const [selectedProgressionModel, setSelectedProgressionModel] = useState('linear');

  // Check if NASM is selected methodology
  const isNASMSelected = state.selectedSystem === 'NASM';

  // Generate NASM program when NASM is selected and we have required data
  useEffect(() => {
    if (isNASMSelected && state.primaryGoal && state.assessmentData) {
      const clientData = {
        goal: state.primaryGoal,
        assessmentResults: state.assessmentData,
        experienceLevel: state.assessmentData.trainingExperience || 'intermediate',
        timeline: state.timeline || { weeks: 12 },
        progressionModel: selectedProgressionModel,
        populationType: state.populationType
      };

      const program = generateNASMProgram(clientData);
      setNasmProgram(program);
    }
  }, [isNASMSelected, state.primaryGoal, state.assessmentData, selectedProgressionModel, state.populationType]);

  if (isNASMSelected) {
    return (
      <div className="program-design-step space-y-6">
        {/* Header */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h2 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
            ⚙️ NASM Program Design
          </h2>
          <p className="text-blue-300 text-sm">
            Complete program design using the NASM OPT model with movement assessment integration
          </p>
        </div>

        {/* Progression Model Selection */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Progression Model</h3>
          <p className="text-gray-400 mb-4">
            Choose how your program will progress through the OPT phases
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(nasmProgressionModels).map(([key, model]) => (
              <button
                key={key}
                onClick={() => setSelectedProgressionModel(key)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${selectedProgressionModel === key
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                  }`}
              >
                <h4 className="text-white font-semibold mb-2">{model.name}</h4>
                <p className="text-gray-300 text-sm mb-3">{model.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="text-blue-400">
                    <strong>Flexibility:</strong> {model.implementation.flexibility}
                  </div>
                  <div className="text-green-400">
                    <strong>Best for:</strong> {model.implementation.bestFor}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generated Program Display */}
        {nasmProgram && (
          <>
            {/* Program Overview */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Program Overview</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-blue-400 font-medium mb-3">Program Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-white">Goal:</strong> <span className="text-gray-300">{nasmProgram.goal}</span></p>
                    <p><strong className="text-white">Pathway:</strong> <span className="text-gray-300">{nasmProgram.pathway.name}</span></p>
                    <p><strong className="text-white">Starting Phase:</strong> <span className="text-gray-300">{nasmProgram.startingPhase.phase}</span></p>
                    <p><strong className="text-white">Duration:</strong> <span className="text-gray-300">{nasmProgram.startingPhase.duration}</span></p>
                    <p><strong className="text-white">Focus:</strong> <span className="text-gray-300">{nasmProgram.startingPhase.focus}</span></p>
                  </div>
                </div>

                <div>
                  <h4 className="text-green-400 font-medium mb-3">OPT Phases</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-white">Phase Sequence:</strong></p>
                    <div className="text-gray-300">
                      {nasmProgram.pathway.phases.join(' → ')}
                    </div>
                    <p><strong className="text-white">Timeline:</strong></p>
                    <div className="text-gray-300 text-xs">
                      {nasmProgram.pathway.timeline}
                    </div>
                  </div>
                </div>
              </div>

              {/* Population Modifications */}
              {nasmProgram.populationType && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <h4 className="text-yellow-400 font-medium mb-2">Special Population Considerations</h4>
                  <p className="text-yellow-300 text-sm">
                    Program modified for: <strong>{nasmProgram.populationType}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Phase Plan */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Phase Progression Plan</h3>

              <div className="space-y-4">
                {nasmProgram.phasePlan.phases.map((phase, index) => {
                  const phaseSpec = nasmOPTPhases[phase.id];
                  return (
                    <div key={phase.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold">
                          {phase.name} (Weeks {phase.startWeek}-{phase.endWeek})
                        </h4>
                        <span className="text-blue-400 text-sm">{phase.duration} weeks</span>
                      </div>

                      <p className="text-gray-300 text-sm mb-3">{phase.focus}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-blue-400 text-sm font-medium mb-2">Acute Variables</h5>
                          <div className="text-xs space-y-1">
                            <p><strong>Reps:</strong> {phaseSpec.acuteVariables.reps}</p>
                            <p><strong>Sets:</strong> {phaseSpec.acuteVariables.sets}</p>
                            <p><strong>Intensity:</strong> {phaseSpec.acuteVariables.intensity}</p>
                            <p><strong>Tempo:</strong> {phaseSpec.acuteVariables.tempo}</p>
                            <p><strong>Rest:</strong> {phaseSpec.acuteVariables.rest}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-green-400 text-sm font-medium mb-2">Exercise Selection</h5>
                          <div className="text-xs space-y-1">
                            <p><strong>Type:</strong> {phaseSpec.exerciseSelection.characteristics}</p>
                            <p><strong>Progression:</strong> {phaseSpec.exerciseSelection.progression}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Corrective Strategies */}
            {nasmProgram.correctiveStrategies && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Corrective Exercise Integration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-red-400 font-medium mb-3">Overactive Muscles (Inhibit/Lengthen)</h4>
                    <div className="space-y-2">
                      {nasmProgram.correctiveStrategies.overactive.map((muscle, index) => (
                        <div key={index} className="bg-red-900/20 rounded p-2">
                          <p className="text-red-300 text-sm font-medium">{muscle.muscle}</p>
                          <p className="text-red-400 text-xs">{muscle.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-blue-400 font-medium mb-3">Underactive Muscles (Activate/Strengthen)</h4>
                    <div className="space-y-2">
                      {nasmProgram.correctiveStrategies.underactive.map((muscle, index) => (
                        <div key={index} className="bg-blue-900/20 rounded p-2">
                          <p className="text-blue-300 text-sm font-medium">{muscle.muscle}</p>
                          <p className="text-blue-400 text-xs">{muscle.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reassessment Schedule */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Assessment & Progress Monitoring</h3>

              <div className="space-y-3">
                {nasmProgram.reassessmentSchedule.map((assessment, index) => (
                  <div key={index} className="bg-gray-700 rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Week {assessment.week}</span>
                      <span className="text-blue-400 text-sm">{assessment.type}</span>
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      Assessments: {assessment.assessments.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Non-NASM program design (original functionality)
  return (
    <div className="program-design-step">
      <div className="step-header">
        <h2>⚙️ Program Design</h2>
        <p className="step-description">
          Complete program design with Bromley wave progression
        </p>
      </div>

      <div className="content-section">
        <h3>Exercise Selection</h3>
        <div className="exercise-categories">
          <div className="category">
            <h4>Primary Movements</h4>
            <ul>
              <li>Squat variations</li>
              <li>Deadlift variations</li>
              <li>Bench press variations</li>
              <li>Overhead press variations</li>
            </ul>
          </div>

          <div className="category">
            <h4>Accessory Work</h4>
            <ul>
              <li>Unilateral movements</li>
              <li>Isolation exercises</li>
              <li>Corrective exercises</li>
              <li>Conditioning work</li>
            </ul>
          </div>
        </div>

        <h3>Loading Parameters</h3>
        <div className="loading-params">
          <div className="param-group">
            <label>Sets per Exercise</label>
            <select
              value={state.programDesign?.sets || ''}
              onChange={(e) => actions.updateProgramDesign({ sets: e.target.value })}
            >
              <option value="">Select sets</option>
              <option value="3">3 sets</option>
              <option value="4">4 sets</option>
              <option value="5">5 sets</option>
            </select>
          </div>

          <div className="param-group">
            <label>Rep Range Focus</label>
            <select
              value={state.programDesign?.repRange || ''}
              onChange={(e) => actions.updateProgramDesign({ repRange: e.target.value })}
            >
              <option value="">Select rep range</option>
              <option value="strength">1-5 reps (Strength)</option>
              <option value="hypertrophy">6-12 reps (Hypertrophy)</option>
              <option value="endurance">12+ reps (Endurance)</option>
            </select>
          </div>
        </div>

        <h3>🌊 Bromley Wave Integration</h3>
        <div className="wave-preview">
          <p>Your selected system: <strong>{state.selectedSystem}</strong></p>
          <p>Wave type: <strong>{state.periodization?.waveType || 'Not selected'}</strong></p>
          <div className="wave-example">
            {state.periodization?.waveType === 'volumizing' && (
              <div>Week 1: 3×12 → Week 2: 4×10 → Week 3: 5×8</div>
            )}
            {state.periodization?.waveType === 'intensifying' && (
              <div>Week 1: 5×5 → Week 2: 4×4 → Week 3: 3×3</div>
            )}
          </div>
        </div>
      </div>

      <div className="step-navigation">
        <button
          className="btn-secondary"
          onClick={() => actions.setCurrentStep(6)}
        >
          ← Back
        </button>

        <button
          className="btn-primary"
          onClick={() => actions.setCurrentStep(8)}
        >
          Continue to Implementation →
        </button>
      </div>
    </div>
  );
};

export default ProgramDesignStep;
