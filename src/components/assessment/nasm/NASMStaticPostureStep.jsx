import React, { useState } from 'react';
import '../../../styles/GlobalNASMStyles.css';

const NASMStaticPostureStep = () => {
    const [postureData, setPostureData] = useState({
        anteriorView: [],
        lateralView: [],
        posteriorView: [],
        additionalObservations: '',
        overallPosturalRating: ''
    });

    const handleCheckboxChange = (view, deviation, checked) => {
        setPostureData(prev => ({
            ...prev,
            [view]: checked
                ? [...prev[view], deviation]
                : prev[view].filter(item => item !== deviation)
        }));
    };

    const handleInputChange = (field, value) => {
        setPostureData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const postureDeviations = {
        anteriorView: [
            'Forward head position',
            'Rounded shoulders',
            'Elevated/depressed shoulders',
            'Knee valgus (knocked knees)',
            'Foot pronation (flat feet)',
            'Asymmetrical shoulder height',
            'Tilted pelvis'
        ],
        lateralView: [
            'Forward head position',
            'Rounded shoulders',
            'Kyphosis (rounded upper back)',
            'Lordosis (excessive lower back arch)',
            'Anterior pelvic tilt',
            'Posterior pelvic tilt',
            'Knee hyperextension',
            'Forward torso lean'
        ],
        posteriorView: [
            'Forward head position',
            'Rounded shoulders',
            'Elevated/depressed shoulders',
            'Asymmetrical shoulder blades',
            'Scoliosis indicators',
            'Uneven hip height',
            'Knee valgus',
            'Foot pronation'
        ]
    };

    return (
        <div className="step-content">
            {/* Consistent Header */}
            <div className="step-header-container">
                <h1 className="step-header-title">
                    🧍 Step 3: Static Posture Assessment
                </h1>
                <p className="step-header-subtitle">
                    Analyze postural deviations from anterior, lateral, and posterior views to identify compensation patterns
                </p>
                <span className="step-progress">Step 3 of 17</span>
            </div>

            {/* Progress Pills */}
            <div className="progress-pills">
                <div className="progress-pill completed">
                    <div>Foundation</div>
                    <small>Steps 1-2</small>
                </div>
                <div className="progress-pill active">
                    <div>Assessment</div>
                    <small>Steps 3-6</small>
                </div>
                <div className="progress-pill">
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
                <h3>🧍 Static Posture Analysis</h3>

                <div className="assessment-instructions">
                    <h4>📋 Assessment Instructions</h4>
                    <p>Have the client stand in their natural, relaxed posture. Observe from three angles and check all visible deviations:</p>
                    <ul>
                        <li><strong>Anterior View:</strong> Face the client directly</li>
                        <li><strong>Lateral View:</strong> View from the side</li>
                        <li><strong>Posterior View:</strong> View from behind</li>
                    </ul>
                </div>

                <div className="form-section">
                    <h4>👀 Anterior View Assessment</h4>
                    <div className="checkbox-group">
                        {postureDeviations.anteriorView.map(deviation => (
                            <div key={deviation} className={`checkbox-item ${postureData.anteriorView.includes(deviation) ? 'checked' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={postureData.anteriorView.includes(deviation)}
                                    onChange={(e) => handleCheckboxChange('anteriorView', deviation, e.target.checked)}
                                />
                                <label>{deviation}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h4>👤 Lateral View Assessment</h4>
                    <div className="checkbox-group">
                        {postureDeviations.lateralView.map(deviation => (
                            <div key={deviation} className={`checkbox-item ${postureData.lateralView.includes(deviation) ? 'checked' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={postureData.lateralView.includes(deviation)}
                                    onChange={(e) => handleCheckboxChange('lateralView', deviation, e.target.checked)}
                                />
                                <label>{deviation}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h4>🔄 Posterior View Assessment</h4>
                    <div className="checkbox-group">
                        {postureDeviations.posteriorView.map(deviation => (
                            <div key={deviation} className={`checkbox-item ${postureData.posteriorView.includes(deviation) ? 'checked' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={postureData.posteriorView.includes(deviation)}
                                    onChange={(e) => handleCheckboxChange('posteriorView', deviation, e.target.checked)}
                                />
                                <label>{deviation}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h4>📝 Additional Observations</h4>
                    <div className="form-group">
                        <label className="form-label">Additional Notes</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Note any additional postural observations, asymmetries, or client compensations..."
                            value={postureData.additionalObservations}
                            onChange={(e) => handleInputChange('additionalObservations', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Overall Postural Quality</label>
                        <div className="radio-group">
                            {[
                                { value: 'good', label: 'Good - Minimal deviations' },
                                { value: 'fair', label: 'Fair - Some notable deviations' },
                                { value: 'poor', label: 'Poor - Multiple significant deviations' }
                            ].map(option => (
                                <div key={option.value} className={`radio-item ${postureData.overallPosturalRating === option.value ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="overallPosturalRating"
                                        value={option.value}
                                        checked={postureData.overallPosturalRating === option.value}
                                        onChange={(e) => handleInputChange('overallPosturalRating', e.target.value)}
                                    />
                                    <label>{option.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="assessment-summary">
                    <h4>📊 Assessment Summary</h4>
                    <div className="summary-stats">
                        <div className="stat-item">
                            <span className="stat-value">{postureData.anteriorView.length}</span>
                            <span className="stat-label">Anterior Deviations</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{postureData.lateralView.length}</span>
                            <span className="stat-label">Lateral Deviations</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{postureData.posteriorView.length}</span>
                            <span className="stat-label">Posterior Deviations</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{postureData.anteriorView.length + postureData.lateralView.length + postureData.posteriorView.length}</span>
                            <span className="stat-label">Total Deviations</span>
                        </div>
                    </div>

                    {(postureData.anteriorView.length + postureData.lateralView.length + postureData.posteriorView.length) > 0 && (
                        <div className="next-steps">
                            <h5>🎯 Next Steps</h5>
                            <p>Identified postural deviations will inform:</p>
                            <ul>
                                <li>Movement screen priorities</li>
                                <li>Corrective exercise selection</li>
                                <li>Program contraindications</li>
                                <li>Progression modifications</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-navigation">
                <button className="nav-button back">← Previous Step</button>
                <select className="step-selector">
                    <option>Step 1: Intake & Readiness</option>
                    <option>Step 2: Baseline Vitals & Body Measures</option>
                    <option selected>Step 3: Static Posture Assessment</option>
                    <option>Step 4: Dynamic Movement Screens</option>
                    <option>Step 5: Map Compensations → Muscle Strategy</option>
                    <option>Step 6: Performance & Capacity</option>
                    <option>Step 7: Choose Starting OPT Phase</option>
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

export default NASMStaticPostureStep;
