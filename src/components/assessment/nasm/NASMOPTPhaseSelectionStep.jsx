import React, { useState } from 'react';
import '../../../styles/GlobalNASMStyles.css';

const NASMOPTPhaseSelectionStep = () => {
    const [phaseData, setPhaseData] = useState({
        recommendedPhase: '',
        phaseRationale: '',
        clientReadiness: '',
        modificationNeeds: [],
        phaseGoals: [],
        timelineEstimate: '',
        progressionCriteria: ''
    });

    const handleInputChange = (field, value) => {
        setPhaseData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (field, value, checked) => {
        setPhaseData(prev => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    const optPhases = {
        'phase-1': {
            name: 'Phase 1: Stabilization Endurance',
            description: 'Focus on postural stability, core strength, and movement quality',
            indicators: ['New to exercise', 'Poor movement quality', 'Postural deviations', 'Injury history'],
            goals: ['Improve postural control', 'Develop core stability', 'Enhance movement quality', 'Build endurance base']
        },
        'phase-2': {
            name: 'Phase 2: Strength Endurance',
            description: 'Bridge stabilization and strength with supersets and circuit training',
            indicators: ['Completed Phase 1', 'Good movement quality', 'Ready for intensity increase'],
            goals: ['Maintain stability gains', 'Increase strength endurance', 'Prepare for heavier loads']
        },
        'phase-3': {
            name: 'Phase 3: Muscular Development',
            description: 'Focus on muscle hypertrophy and strength building',
            indicators: ['Strength endurance established', 'Muscle building goals', 'Adequate recovery capacity'],
            goals: ['Increase muscle mass', 'Build absolute strength', 'Enhance muscle definition']
        },
        'phase-4': {
            name: 'Phase 4: Maximal Strength',
            description: 'High-intensity strength training for maximum force production',
            indicators: ['Advanced training background', 'Strength sport goals', 'Excellent movement quality'],
            goals: ['Maximize strength', 'Increase power potential', 'Peak strength performance']
        },
        'phase-5': {
            name: 'Phase 5: Power',
            description: 'Explosive power development for athletic performance',
            indicators: ['Sport-specific needs', 'Strength foundation established', 'Power/speed goals'],
            goals: ['Develop explosive power', 'Enhance rate of force development', 'Sport-specific performance']
        }
    };

    return (
        <div className="step-content">
            {/* Consistent Header */}
            <div className="step-header-container">
                <h1 className="step-header-title">
                    🎯 Step 7: Choose Starting OPT Phase
                </h1>
                <p className="step-header-subtitle">
                    Select the appropriate OPT model phase based on assessment results, goals, and client readiness
                </p>
                <span className="step-progress">Step 7 of 17</span>
            </div>

            {/* Progress Pills */}
            <div className="progress-pills">
                <div className="progress-pill completed">
                    <div>Foundation</div>
                    <small>Steps 1-2</small>
                </div>
                <div className="progress-pill completed">
                    <div>Assessment</div>
                    <small>Steps 3-6</small>
                </div>
                <div className="progress-pill active">
                    <div>Programming</div>
                    <small>Steps 7-12</small>
                </div>
                <div className="progress-pill">
                    <div>Implementation</div>
                    <small>Steps 13-17</small>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-card">
                <h3>🎯 OPT Model Phase Selection</h3>

                <div className="phase-selector-section">
                    <h4>📊 Available OPT Phases</h4>
                    <div className="phase-options">
                        {Object.entries(optPhases).map(([phaseKey, phase]) => (
                            <div
                                key={phaseKey}
                                className={`phase-option ${phaseData.recommendedPhase === phaseKey ? 'selected' : ''}`}
                                onClick={() => handleInputChange('recommendedPhase', phaseKey)}
                            >
                                <div className="phase-header">
                                    <input
                                        type="radio"
                                        name="recommendedPhase"
                                        value={phaseKey}
                                        checked={phaseData.recommendedPhase === phaseKey}
                                        onChange={(e) => handleInputChange('recommendedPhase', e.target.value)}
                                    />
                                    <h5>{phase.name}</h5>
                                </div>
                                <p className="phase-description">{phase.description}</p>

                                <div className="phase-details">
                                    <div className="phase-indicators">
                                        <strong>Best for clients with:</strong>
                                        <ul>
                                            {phase.indicators.map(indicator => (
                                                <li key={indicator}>{indicator}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="phase-goals">
                                        <strong>Primary goals:</strong>
                                        <ul>
                                            {phase.goals.map(goal => (
                                                <li key={goal}>{goal}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {phaseData.recommendedPhase && (
                    <div className="form-section">
                        <h4>📝 Phase Selection Rationale</h4>
                        <div className="form-group">
                            <label className="form-label">Why is this phase appropriate for this client?</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Explain your rationale based on assessment results, client goals, training history, and current fitness level..."
                                value={phaseData.phaseRationale}
                                onChange={(e) => handleInputChange('phaseRationale', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="form-section">
                    <h4>🎯 Client Readiness Assessment</h4>
                    <div className="form-group">
                        <label className="form-label">Overall Training Readiness</label>
                        <div className="radio-group">
                            {[
                                { value: 'beginner', label: 'Beginner - New to structured exercise' },
                                { value: 'intermediate', label: 'Intermediate - Some training experience' },
                                { value: 'advanced', label: 'Advanced - Extensive training background' }
                            ].map(option => (
                                <div key={option.value} className={`radio-item ${phaseData.clientReadiness === option.value ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="clientReadiness"
                                        value={option.value}
                                        checked={phaseData.clientReadiness === option.value}
                                        onChange={(e) => handleInputChange('clientReadiness', e.target.value)}
                                    />
                                    <label>{option.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>⚙️ Program Modifications Needed</h4>
                    <div className="form-group">
                        <label className="form-label">Select any modifications required (based on assessment results)</label>
                        <div className="checkbox-group">
                            {[
                                'Extra corrective exercises',
                                'Movement restrictions due to injury',
                                'Postural correction emphasis',
                                'Balance/stability focus',
                                'Flexibility/mobility priority',
                                'Cardiovascular limitations',
                                'Time constraints',
                                'Equipment limitations'
                            ].map(modification => (
                                <div key={modification} className={`checkbox-item ${phaseData.modificationNeeds.includes(modification) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={phaseData.modificationNeeds.includes(modification)}
                                        onChange={(e) => handleCheckboxChange('modificationNeeds', modification, e.target.checked)}
                                    />
                                    <label>{modification}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>📅 Timeline & Progression</h4>
                    <div className="form-group">
                        <label className="form-label">Estimated Time in This Phase</label>
                        <select
                            className="form-select"
                            value={phaseData.timelineEstimate}
                            onChange={(e) => handleInputChange('timelineEstimate', e.target.value)}
                        >
                            <option value="">Select timeline...</option>
                            <option value="2-4-weeks">2-4 weeks</option>
                            <option value="4-6-weeks">4-6 weeks</option>
                            <option value="6-8-weeks">6-8 weeks</option>
                            <option value="8-12-weeks">8-12 weeks</option>
                            <option value="ongoing">Ongoing maintenance</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Progression Criteria</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Define what success looks like and when to progress to the next phase..."
                            value={phaseData.progressionCriteria}
                            onChange={(e) => handleInputChange('progressionCriteria', e.target.value)}
                        />
                    </div>
                </div>

                {phaseData.recommendedPhase && (
                    <div className="phase-summary">
                        <h4>✅ Phase Selection Summary</h4>
                        <div className="summary-card">
                            <h5>{optPhases[phaseData.recommendedPhase].name}</h5>
                            <p><strong>Primary Focus:</strong> {optPhases[phaseData.recommendedPhase].description}</p>
                            <p><strong>Client Readiness:</strong> {phaseData.clientReadiness}</p>
                            <p><strong>Timeline:</strong> {phaseData.timelineEstimate}</p>
                            {phaseData.modificationNeeds.length > 0 && (
                                <p><strong>Modifications:</strong> {phaseData.modificationNeeds.join(', ')}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-navigation">
                <button className="nav-button back">← Previous Step</button>
                <select className="step-selector">
                    <option>Step 1: Intake & Readiness</option>
                    <option>Step 2: Baseline Vitals & Body Measures</option>
                    <option>Step 3: Static Posture Assessment</option>
                    <option>Step 4: Dynamic Movement Screens</option>
                    <option>Step 5: Map Compensations → Muscle Strategy</option>
                    <option>Step 6: Performance & Capacity</option>
                    <option selected>Step 7: Choose Starting OPT Phase</option>
                    <option>Step 8: Corrective Warm-up Block</option>
                    <option>Step 9: Core / Balance / Plyometric Block</option>
                    <option>Step 10: SAQ (if used)</option>
                    <option>Step 11: Resistance Training Block</option>
                    <option>Step 12: Cardiorespiratory Plan (FITTE)</option>
                    <option>Step 13: Session Template & Weekly Split</option>
                    <option>Step 14: Monthly Progression Rules</option>
                    <option>Step 15: Annual Plan (Macrocycle)</option>
                    <option>Step 16: Special Population/Constraint Mods</option>
                    <option>Step 17: Monitoring & Reassessment</option>
                </select>
                <button className="nav-button">Next Step →</button>
            </div>
        </div>
    );
};

export default NASMOPTPhaseSelectionStep;
