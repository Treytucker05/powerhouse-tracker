import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

/**
 * NASMVitalsStep - Step 2: Essential Baseline Vitals & Body Measures
 * 
 * Streamlined to only include measurements used in algorithms:
 * - Resting HR and BP (for risk assessment)
 * - Height, weight (for BMI calculation)
 * - Waist circumference (for health risk)
 * - Optional body fat (for tracking)
 */

const NASMVitalsStep = () => {
    const { state, actions } = useProgramContext();

    const [vitalsData, setVitalsData] = useState({
        // Core Vital Signs (Used in Risk Assessment)
        restingHR: '',
        systolicBP: '',
        diastolicBP: '',

        // Body Measurements (Used in BMI Calculation & Tracking)
        height: '',
        heightUnit: 'inches',
        weight: '',
        weightUnit: 'lbs',
        bmi: '',

        // Essential Girth (Waist only - used for health risk)
        waistCircumference: '',

        // Body Composition (Optional - used in tracking baselines)
        bodyFatPercentage: '',
        bodyFatMethod: 'manual' // Simplified to manual entry only
    });

    const [riskFlags, setRiskFlags] = useState([]);

    const handleInputChange = (field, value) => {
        setVitalsData(prev => {
            const updated = { ...prev, [field]: value };

            // Auto-calculate BMI when height or weight changes
            if (field === 'height' || field === 'weight' || field === 'heightUnit' || field === 'weightUnit') {
                updated.bmi = calculateBMI(updated);
            }

            return updated;
        });
    };

    const calculateBMI = (data) => {
        const { height, weight, heightUnit, weightUnit } = data;

        if (!height || !weight) return '';

        let heightInMeters, weightInKg;

        // Convert height to meters
        switch (heightUnit) {
            case 'inches':
                heightInMeters = height * 0.0254;
                break;
            case 'feet':
                heightInMeters = height * 0.3048;
                break;
            case 'cm':
                heightInMeters = height * 0.01;
                break;
            case 'meters':
                heightInMeters = height;
                break;
            default:
                heightInMeters = height * 0.0254; // default to inches
        }

        // Convert weight to kg
        switch (weightUnit) {
            case 'lbs':
                weightInKg = weight * 0.453592;
                break;
            case 'kg':
                weightInKg = weight;
                break;
            default:
                weightInKg = weight * 0.453592; // default to lbs
        }

        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    };

    const assessRiskFlags = () => {
        const flags = [];

        // Heart rate risk flags
        if (vitalsData.restingHR) {
            const hr = parseFloat(vitalsData.restingHR);
            if (hr > 100) flags.push('Elevated Resting Heart Rate (>100 bpm)');
            if (hr < 50) flags.push('Low Resting Heart Rate (<50 bpm)');
        }

        // Blood pressure risk flags
        if (vitalsData.systolicBP && vitalsData.diastolicBP) {
            const systolic = parseFloat(vitalsData.systolicBP);
            const diastolic = parseFloat(vitalsData.diastolicBP);

            if (systolic >= 140 || diastolic >= 90) {
                flags.push('Hypertension (≥140/90 mmHg)');
            } else if (systolic >= 120 || diastolic >= 80) {
                flags.push('Elevated Blood Pressure (≥120/80 mmHg)');
            }
        }

        // BMI risk flags
        if (vitalsData.bmi) {
            const bmi = parseFloat(vitalsData.bmi);
            if (bmi < 18.5) flags.push('Underweight (BMI <18.5)');
            if (bmi >= 25 && bmi < 30) flags.push('Overweight (BMI 25-29.9)');
            if (bmi >= 30) flags.push('Obese (BMI ≥30)');
        }

        // Waist circumference risk flags
        if (vitalsData.waistCircumference) {
            const waist = parseFloat(vitalsData.waistCircumference);
            // General risk thresholds (would need gender for precise assessment)
            if (waist > 40) flags.push('Elevated Waist Circumference (>40 inches)');
        }

        // Body fat risk flags
        if (vitalsData.bodyFatPercentage) {
            const bf = parseFloat(vitalsData.bodyFatPercentage);
            if (bf > 25) flags.push('Elevated Body Fat Percentage');
            if (bf < 8) flags.push('Very Low Body Fat Percentage');
        }

        return flags;
    };

    // Update risk flags when vitals data changes
    useEffect(() => {
        const newFlags = assessRiskFlags();
        setRiskFlags(newFlags);
    }, [vitalsData.restingHR, vitalsData.systolicBP, vitalsData.diastolicBP, vitalsData.bmi, vitalsData.bodyFatPercentage, vitalsData.waistCircumference]);

    const handleSubmit = () => {
        const currentRiskFlags = assessRiskFlags();

        const trackingBaselines = {
            weight: vitalsData.weight,
            bmi: vitalsData.bmi,
            waistCircumference: vitalsData.waistCircumference,
            bodyFat: vitalsData.bodyFatPercentage,
            restingHR: vitalsData.restingHR,
            bloodPressure: `${vitalsData.systolicBP}/${vitalsData.diastolicBP}`
        };

        // Save vitals results
        actions.setAssessmentData({
            ...state.assessmentData,
            step: 2,
            vitalsData,
            riskFlags: currentRiskFlags,
            trackingBaselines,
            timestamp: new Date().toISOString()
        });

        // Move to next step
        actions.setCurrentStep(3);
    };

    const isFormComplete = () => {
        return vitalsData.height &&
            vitalsData.weight &&
            vitalsData.restingHR;
    };

    const getBMICategory = (bmi) => {
        if (!bmi) return '';
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return 'Underweight';
        if (bmiValue < 25) return 'Normal Weight';
        if (bmiValue < 30) return 'Overweight';
        return 'Obese';
    };

    return (
        <div className="nasm-vitals-step">
            <div className="step-header">
                <h2>Step 2: Essential Vitals & Body Measures</h2>
                <p>Core measurements used in risk assessment and program algorithms</p>
            </div>

            <div className="vitals-sections">
                {/* Vital Signs */}
                <div className="vitals-section">
                    <h3>Vital Signs</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Resting Heart Rate (bpm) *</label>
                            <input
                                type="number"
                                value={vitalsData.restingHR}
                                onChange={(e) => handleInputChange('restingHR', e.target.value)}
                                placeholder="60-100 bpm normal"
                                min="40"
                                max="150"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Systolic BP (mmHg)</label>
                            <input
                                type="number"
                                value={vitalsData.systolicBP}
                                onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                                placeholder="120"
                                min="80"
                                max="200"
                            />
                        </div>

                        <div className="form-group">
                            <label>Diastolic BP (mmHg)</label>
                            <input
                                type="number"
                                value={vitalsData.diastolicBP}
                                onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
                                placeholder="80"
                                min="50"
                                max="120"
                            />
                        </div>
                    </div>
                </div>

                {/* Body Measurements */}
                <div className="vitals-section">
                    <h3>Body Measurements</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Height *</label>
                            <div className="measurement-input">
                                <input
                                    type="number"
                                    value={vitalsData.height}
                                    onChange={(e) => handleInputChange('height', e.target.value)}
                                    placeholder="Height"
                                    step="0.1"
                                    required
                                />
                                <select
                                    value={vitalsData.heightUnit}
                                    onChange={(e) => handleInputChange('heightUnit', e.target.value)}
                                >
                                    <option value="inches">inches</option>
                                    <option value="feet">feet</option>
                                    <option value="cm">cm</option>
                                    <option value="meters">meters</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Weight *</label>
                            <div className="measurement-input">
                                <input
                                    type="number"
                                    value={vitalsData.weight}
                                    onChange={(e) => handleInputChange('weight', e.target.value)}
                                    placeholder="Weight"
                                    step="0.1"
                                    required
                                />
                                <select
                                    value={vitalsData.weightUnit}
                                    onChange={(e) => handleInputChange('weightUnit', e.target.value)}
                                >
                                    <option value="lbs">lbs</option>
                                    <option value="kg">kg</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>BMI (Auto-calculated)</label>
                            <div className="bmi-display">
                                <span className="bmi-value">{vitalsData.bmi || '—'}</span>
                                <span className="bmi-category">{getBMICategory(vitalsData.bmi)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Essential Girth Measurement */}
                <div className="vitals-section">
                    <h3>Waist Circumference</h3>
                    <p className="section-note">Optional: Used for health risk assessment</p>

                    <div className="form-group">
                        <label>Waist Circumference (inches)</label>
                        <input
                            type="number"
                            value={vitalsData.waistCircumference}
                            onChange={(e) => handleInputChange('waistCircumference', e.target.value)}
                            placeholder="Measured at narrowest point"
                            step="0.1"
                        />
                    </div>
                </div>

                {/* Simplified Body Composition */}
                <div className="vitals-section">
                    <h3>Body Composition (Optional)</h3>
                    <p className="section-note">Enter known body fat percentage for tracking purposes</p>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Body Fat Percentage</label>
                            <input
                                type="number"
                                value={vitalsData.bodyFatPercentage}
                                onChange={(e) => handleInputChange('bodyFatPercentage', e.target.value)}
                                placeholder="% body fat"
                                step="0.1"
                                min="3"
                                max="50"
                            />
                        </div>
                        <div className="form-group">
                            <label>Assessment Method</label>
                            <select
                                value={vitalsData.bodyFatMethod}
                                onChange={(e) => handleInputChange('bodyFatMethod', e.target.value)}
                            >
                                <option value="manual">Manual Entry</option>
                                <option value="dexa">DEXA Scan</option>
                                <option value="bodpod">Bod Pod</option>
                                <option value="hydrostatic">Hydrostatic</option>
                                <option value="skinfolds">Skinfold Calipers</option>
                                <option value="bioelectrical">BIA Scale</option>
                                <option value="visual">Visual Estimation</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Risk Flags Display */}
                {riskFlags.length > 0 && (
                    <div className="risk-flags">
                        <h4>⚠️ Risk Flags Identified:</h4>
                        <ul>
                            {riskFlags.map((flag, index) => (
                                <li key={index} className="risk-flag">{flag}</li>
                            ))}
                        </ul>
                        <p className="risk-note">These flags will inform exercise modifications and monitoring protocols.</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="step-navigation">
                <button
                    className="back-button"
                    onClick={() => actions.setCurrentStep(1)}
                >
                    ← Back to Intake
                </button>

                <button
                    className="next-button"
                    onClick={handleSubmit}
                    disabled={!isFormComplete()}
                >
                    Complete Vitals → Step 3: Static Posture
                </button>
            </div>

            <style jsx>{`
                .nasm-vitals-step {
                    padding: 20px;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .step-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .step-header h2 {
                    color: #2563eb;
                    margin-bottom: 10px;
                }

                .vitals-sections {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .vitals-section {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #2563eb;
                }

                .vitals-section h3 {
                    color: #1e40af;
                    margin-bottom: 15px;
                    font-size: 1.2em;
                }

                .section-note {
                    color: #6b7280;
                    font-style: italic;
                    margin-bottom: 15px;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #374151;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .measurement-input {
                    display: flex;
                    gap: 8px;
                }

                .measurement-input input {
                    flex: 2;
                }

                .measurement-input select {
                    flex: 1;
                }

                .bmi-display {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 12px;
                    background: #e5e7eb;
                    border-radius: 4px;
                }

                .bmi-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #1f2937;
                }

                .bmi-category {
                    color: #6b7280;
                    font-size: 14px;
                }

                .risk-flags {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                }

                .risk-flags h4 {
                    color: #d97706;
                    margin-bottom: 10px;
                }

                .risk-flags ul {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 10px 0;
                }

                .risk-flag {
                    color: #92400e;
                    margin-bottom: 5px;
                    padding: 2px 0;
                }

                .risk-note {
                    color: #78716c;
                    font-size: 14px;
                    margin: 0;
                }

                .step-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30px;
                    padding: 20px 0;
                    border-top: 1px solid #e5e7eb;
                }

                .back-button {
                    padding: 10px 20px;
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .back-button:hover {
                    background: #e5e7eb;
                }

                .next-button {
                    padding: 10px 20px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .next-button:hover {
                    background: #1d4ed8;
                }

                .next-button:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .step-navigation {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .back-button,
                    .next-button {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default NASMVitalsStep;
