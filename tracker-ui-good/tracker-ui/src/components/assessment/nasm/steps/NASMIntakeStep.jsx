import React, { useState } from 'react';
import '../../../styles/GlobalNASMStyles.css';

const NASMIntakeStep = () => {
    const [formData, setFormData] = useState({
        primaryGoal: '',
        secondaryGoals: [],
        timeline: '',
        trainingHistory: '',
        injuries: '',
        medications: '',
        sessionAvailability: '',
        equipmentAccess: [],
        constraints: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (field, value, checked) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    return (
        <div className="step-content">
            {/* Consistent Header */}
            <div className="step-header-container">
                <h1 className="step-header-title">
                    📋 Step 1: Intake & Readiness
                </h1>
                <p className="step-header-subtitle">
                    Goals, timeline, training history, injuries/medications, session availability, equipment access, and constraints
                </p>
                <span className="step-progress">Step 1 of 17</span>
            </div>

            {/* Progress Pills */}
            <div className="progress-pills">
                <div className="progress-pill active">
                    <div>Foundation</div>
                    <small>Steps 1-2</small>
                </div>
                <div className="progress-pill">
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
                <h3>📋 Client Intake Assessment</h3>

                <div className="form-section">
                    <h4>Training Goals</h4>
                    <div className="form-group">
                        <label className="form-label">Primary Training Goal</label>
                        <select
                            className="form-select"
                            value={formData.primaryGoal}
                            onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                        >
                            <option value="">Select primary goal...</option>
                            <option value="weight-loss">Weight Loss</option>
                            <option value="muscle-building">Muscle Building</option>
                            <option value="strength">Strength</option>
                            <option value="endurance">Endurance</option>
                            <option value="sports-performance">Sports Performance</option>
                            <option value="general-fitness">General Fitness</option>
                            <option value="injury-rehab">Injury Rehabilitation</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Secondary Goals (Select all that apply)</label>
                        <div className="checkbox-group">
                            {['Improved posture', 'Better flexibility', 'Stress relief', 'Better sleep', 'Increased energy', 'Improved confidence'].map(goal => (
                                <div key={goal} className={`checkbox-item ${formData.secondaryGoals.includes(goal) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={formData.secondaryGoals.includes(goal)}
                                        onChange={(e) => handleCheckboxChange('secondaryGoals', goal, e.target.checked)}
                                    />
                                    <label>{goal}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Timeline & Availability</h4>
                    <div className="form-group">
                        <label className="form-label">Desired Timeline</label>
                        <select
                            className="form-select"
                            value={formData.timeline}
                            onChange={(e) => handleInputChange('timeline', e.target.value)}
                        >
                            <option value="">Select timeline...</option>
                            <option value="1-month">1 Month</option>
                            <option value="3-months">3 Months</option>
                            <option value="6-months">6 Months</option>
                            <option value="1-year">1 Year</option>
                            <option value="ongoing">Ongoing Lifestyle</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Session Availability (days per week)</label>
                        <div className="radio-group">
                            {[
                                { value: '2-days', label: '2 days per week' },
                                { value: '3-days', label: '3 days per week' },
                                { value: '4-days', label: '4 days per week' },
                                { value: '5-days', label: '5+ days per week' }
                            ].map(option => (
                                <div key={option.value} className={`radio-item ${formData.sessionAvailability === option.value ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="sessionAvailability"
                                        value={option.value}
                                        checked={formData.sessionAvailability === option.value}
                                        onChange={(e) => handleInputChange('sessionAvailability', e.target.value)}
                                    />
                                    <label>{option.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Training History & Health</h4>
                    <div className="form-group">
                        <label className="form-label">Previous Training Experience</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Describe your training background, previous programs, sports participation..."
                            value={formData.trainingHistory}
                            onChange={(e) => handleInputChange('trainingHistory', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Current Injuries or Limitations</label>
                        <textarea
                            className="form-textarea"
                            placeholder="List any current injuries, pain, or movement limitations..."
                            value={formData.injuries}
                            onChange={(e) => handleInputChange('injuries', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Current Medications</label>
                        <textarea
                            className="form-textarea"
                            placeholder="List any medications that might affect exercise (optional)..."
                            value={formData.medications}
                            onChange={(e) => handleInputChange('medications', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h4>Equipment & Constraints</h4>
                    <div className="form-group">
                        <label className="form-label">Available Equipment</label>
                        <div className="checkbox-group">
                            {['Home gym', 'Commercial gym', 'Dumbbells', 'Resistance bands', 'Bodyweight only', 'Cardio equipment', 'Functional trainer'].map(equipment => (
                                <div key={equipment} className={`checkbox-item ${formData.equipmentAccess.includes(equipment) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={formData.equipmentAccess.includes(equipment)}
                                        onChange={(e) => handleCheckboxChange('equipmentAccess', equipment, e.target.checked)}
                                    />
                                    <label>{equipment}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Preference Constraints</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Any specific preferences, dislikes, or constraints we should consider..."
                            value={formData.constraints}
                            onChange={(e) => handleInputChange('constraints', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-navigation">
                <button className="nav-button back">← Previous Step</button>
                <select className="step-selector">
                    <option selected>Step 1: Intake & Readiness</option>
                    <option>Step 2: Baseline Vitals & Body Measures</option>
                    <option>Step 3: Static Posture Assessment</option>
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

export default NASMIntakeStep;
