import React, { useState } from 'react';
import '../../../styles/GlobalNASMStyles.css';

const NASMVitalsStep = () => {
    const [vitalsData, setVitalsData] = useState({
        // Basic Measurements
        height: '',
        weight: '',
        age: '',

        // Vital Signs
        restingHR: '',
        restingBP: '',
        bodyFatPercentage: '',

        // Body Composition
        waistCircumference: '',
        hipCircumference: '',
        waistToHipRatio: '',

        // Initial Photos/Measurements
        photosConsent: false,
        circumferenceMeasurements: {},
        skinFoldMeasurements: {},

        // Baseline Fitness Metrics
        previousFitnessTests: '',
        healthRiskFactors: []
    });

    const handleInputChange = (field, value) => {
        setVitalsData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (field, value, checked) => {
        setVitalsData(prev => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    const calculateBMI = () => {
        const heightM = vitalsData.height / 100; // Convert cm to meters
        const weight = parseFloat(vitalsData.weight);
        if (heightM && weight) {
            return (weight / (heightM * heightM)).toFixed(1);
        }
        return '';
    };

    const calculateWHR = () => {
        const waist = parseFloat(vitalsData.waistCircumference);
        const hip = parseFloat(vitalsData.hipCircumference);
        if (waist && hip) {
            return (waist / hip).toFixed(2);
        }
        return '';
    };

    return (
        <div className="step-content">
            {/* Consistent Header */}
            <div className="step-header-container">
                <h1 className="step-header-title">
                    📊 Step 2: Baseline Vitals & Body Measures
                </h1>
                <p className="step-header-subtitle">
                    Height, weight, vitals, body composition, circumference measurements, and baseline health metrics
                </p>
                <span className="step-progress">Step 2 of 17</span>
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
                <h3>📊 Baseline Measurements</h3>

                <div className="form-section">
                    <h4>Basic Demographics</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Height (cm)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="175"
                                value={vitalsData.height}
                                onChange={(e) => handleInputChange('height', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Weight (kg)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="70"
                                value={vitalsData.weight}
                                onChange={(e) => handleInputChange('weight', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Age</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="30"
                                value={vitalsData.age}
                                onChange={(e) => handleInputChange('age', e.target.value)}
                            />
                        </div>
                    </div>

                    {(vitalsData.height && vitalsData.weight) && (
                        <div className="metric-display">
                            <strong>BMI: {calculateBMI()}</strong>
                        </div>
                    )}
                </div>

                <div className="form-section">
                    <h4>Vital Signs</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Resting Heart Rate (bpm)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="65"
                                value={vitalsData.restingHR}
                                onChange={(e) => handleInputChange('restingHR', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Resting Blood Pressure</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="120/80"
                                value={vitalsData.restingBP}
                                onChange={(e) => handleInputChange('restingBP', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Body Fat % (if available)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="15"
                                value={vitalsData.bodyFatPercentage}
                                onChange={(e) => handleInputChange('bodyFatPercentage', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Body Composition</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Waist Circumference (cm)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="85"
                                value={vitalsData.waistCircumference}
                                onChange={(e) => handleInputChange('waistCircumference', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Hip Circumference (cm)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="95"
                                value={vitalsData.hipCircumference}
                                onChange={(e) => handleInputChange('hipCircumference', e.target.value)}
                            />
                        </div>
                    </div>

                    {(vitalsData.waistCircumference && vitalsData.hipCircumference) && (
                        <div className="metric-display">
                            <strong>Waist-to-Hip Ratio: {calculateWHR()}</strong>
                            <small>
                                {parseFloat(calculateWHR()) > 0.85 ? ' (Higher risk)' : ' (Lower risk)'}
                            </small>
                        </div>
                    )}
                </div>

                <div className="form-section">
                    <h4>Health Risk Assessment</h4>
                    <div className="form-group">
                        <label className="form-label">Cardiovascular Risk Factors (Select all that apply)</label>
                        <div className="checkbox-group">
                            {[
                                'Family history of heart disease',
                                'Smoking history',
                                'High cholesterol',
                                'High blood pressure',
                                'Diabetes/pre-diabetes',
                                'Sedentary lifestyle',
                                'Age (men >45, women >55)',
                                'Stress/sleep issues'
                            ].map(factor => (
                                <div key={factor} className={`checkbox-item ${vitalsData.healthRiskFactors.includes(factor) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={vitalsData.healthRiskFactors.includes(factor)}
                                        onChange={(e) => handleCheckboxChange('healthRiskFactors', factor, e.target.checked)}
                                    />
                                    <label>{factor}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Documentation</h4>
                    <div className="form-group">
                        <div className={`checkbox-item ${vitalsData.photosConsent ? 'checked' : ''}`}>
                            <input
                                type="checkbox"
                                checked={vitalsData.photosConsent}
                                onChange={(e) => handleInputChange('photosConsent', e.target.checked)}
                            />
                            <label>Client consents to progress photos</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Previous Fitness Test Results</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Record any previous fitness assessments, lab values, or health screenings..."
                            value={vitalsData.previousFitnessTests}
                            onChange={(e) => handleInputChange('previousFitnessTests', e.target.value)}
                        />
                    </div>
                </div>

                <div className="assessment-note">
                    <h4>📋 Assessment Notes</h4>
                    <p>These baseline measurements will be used to:</p>
                    <ul>
                        <li>Calculate training intensity zones</li>
                        <li>Track progress over time</li>
                        <li>Identify health risk stratification</li>
                        <li>Customize program recommendations</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-navigation">
                <button className="nav-button back">← Previous Step</button>
                <select className="step-selector">
                    <option>Step 1: Intake & Readiness</option>
                    <option selected>Step 2: Baseline Vitals & Body Measures</option>
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

export default NASMVitalsStep;
