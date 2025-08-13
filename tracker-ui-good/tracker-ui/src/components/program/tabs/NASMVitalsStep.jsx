import React, { useState, useEffect } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';
// Import the skinfold diagram image
// import skinfoldDiagramMale from '../../../assets/images/skinfold-diagram-male.png';

/**
 * NASMVitalsStep - Step 2: Baseline Vitals & Body Measures
 * 
 * Comprehensive baseline physiological measurements:
 * - Resting HR and BP (if available)
 * - Height, weight, BMI calculation
 * - Girth measurements
 * - Optional body fat assessment
 * - Risk flag identification
 */

const NASMVitalsStep = () => {
    const { state, actions } = useProgramContext();

    const [vitalsData, setVitalsData] = useState({
        // NASM Vital Signs - Enhanced with 3-day RHR
        restingHR_day1: '',
        restingHR_day2: '',
        restingHR_day3: '',
        averageRHR: '',
        systolicBP: '',
        diastolicBP: '',

        // Body Measurements
        height: '',
        heightFeet: '',
        heightInches: '',
        heightUnit: 'feet',
        weight: '',
        weightUnit: 'lbs',
        bmi: '',

        // NASM Required - Waist-to-Hip Ratio
        waistCircumference: '', // narrowest point
        hipCircumference: '',   // widest point
        whr: '', // waist-to-hip ratio
        clientGender: 'male', // for WHR classification

        // NASM Circumference Measurements (all 7 sites)
        girths: {
            neck: '',           // neck circumference
            chest: '',          // chest circumference
            waist: '',          // waist (narrowest point or navel)
            hips: '',           // hips (widest point)
            rightThigh: '',     // thigh (10 inches above patella)
            leftThigh: '',      // thigh (10 inches above patella)
            rightCalf: '',      // calf (maximum circumference)
            leftCalf: '',       // calf (maximum circumference)
            rightBicep: '',     // bicep (maximum, arm extended)
            leftBicep: ''       // bicep (maximum, arm extended)
        },

        // Optional Body Composition
        bodyFatPercentage: '',
        bodyFatMethod: '',
        leanBodyMass: '',

        // Body Composition Assessment Methods (checkboxes)
        assessmentMethods: {
            bioelectrical: false,
            hydrostatic: false,
            dexaScan: false,
            skinfolds: false,
            manual: false
        },

        // Skinfold Measurements (mm) - KEEP ALL EXISTING
        skinfolds: {
            chest: '',
            abdominal: '',
            thigh: '',
            tricep: '',
            subscapular: '',
            suprailiac: '',
            midaxillary: ''
        },
        skinfoldMethod: 'jackson-pollock-3', // Default method
        clientAge: '',

        // Additional Metrics
        restingMetabolism: '',
        hydrationStatus: 'normal'
    });

    const [riskFlags, setRiskFlags] = useState([]);

    const handleInputChange = (field, value) => {
        setVitalsData(prev => {
            const updated = { ...prev, [field]: value };

            // Auto-calculate BMI when height or weight changes
            if (field === 'height' || field === 'weight' || field === 'heightUnit' || field === 'weightUnit') {
                updated.bmi = calculateBMI(updated);
            }

            // Auto-calculate 3-day average RHR
            if (field.includes('restingHR_day')) {
                updated.averageRHR = calculateAverageRHR(updated);
            }

            // Auto-calculate WHR when waist or hip changes
            if (field === 'waistCircumference' || field === 'hipCircumference') {
                updated.whr = calculateWHR(updated);
            }

            return updated;
        });
    };

    // Calculate 3-day average RHR
    const calculateAverageRHR = (data) => {
        const day1 = parseFloat(data.restingHR_day1) || 0;
        const day2 = parseFloat(data.restingHR_day2) || 0;
        const day3 = parseFloat(data.restingHR_day3) || 0;

        const validDays = [day1, day2, day3].filter(hr => hr > 0);
        if (validDays.length === 0) return '';

        const average = validDays.reduce((sum, hr) => sum + hr, 0) / validDays.length;
        return average.toFixed(0);
    };

    // Calculate Waist-to-Hip Ratio
    const calculateWHR = (data) => {
        const waist = parseFloat(data.waistCircumference);
        const hip = parseFloat(data.hipCircumference);

        if (!waist || !hip) return '';

        const whr = waist / hip;
        return whr.toFixed(2);
    };

    // Get RHR Classification
    const getRHRClassification = (rhr) => {
        if (!rhr) return '';
        const hr = parseInt(rhr);
        if (hr < 60) return { category: 'Excellent', color: '#22c55e' };
        if (hr <= 70) return { category: 'Good', color: '#22c55e' };
        if (hr <= 80) return { category: 'Average', color: '#eab308' };
        return { category: 'Poor', color: '#dc2626' };
    };

    // Get Blood Pressure Classification
    const getBPClassification = (systolic, diastolic) => {
        if (!systolic || !diastolic) return '';
        const sys = parseInt(systolic);
        const dia = parseInt(diastolic);

        if (sys >= 140 || dia >= 90) {
            return { category: 'Hypertensive', color: '#dc2626', warning: true };
        } else if ((sys >= 120 && sys <= 135) || (dia >= 80 && dia <= 85)) {
            return { category: 'Prehypertensive', color: '#eab308', warning: false };
        } else if (sys < 120 && dia < 80) {
            return { category: 'Normal', color: '#22c55e', warning: false };
        }
        return { category: 'Check values', color: '#6b7280', warning: false };
    };

    // Get BMI Classification
    const getBMIClassification = (bmi) => {
        if (!bmi) return '';
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return { category: 'Underweight', class: 'below-average', color: '#eab308' };
        if (bmiValue <= 24.9) return { category: 'Normal', class: 'normal', color: '#22c55e' };
        if (bmiValue <= 29.9) return { category: 'Overweight', class: 'elevated', color: '#eab308' };
        if (bmiValue <= 34.9) return { category: 'Obese Class I', class: 'high', color: '#dc2626' };
        if (bmiValue <= 39.9) return { category: 'Obese Class II', class: 'very-high', color: '#dc2626' };
        return { category: 'Obese Class III', class: 'very-high', color: '#dc2626' };
    };

    // Get WHR Risk Assessment
    const getWHRRisk = (whr, gender) => {
        if (!whr) return '';
        const ratio = parseFloat(whr);

        if (gender === 'female') {
            if (ratio > 0.80) return { risk: 'High', class: 'high-risk', color: '#dc2626' };
            return { risk: 'Low', class: 'low-risk', color: '#22c55e' };
        } else {
            if (ratio > 0.95) return { risk: 'High', class: 'high-risk', color: '#dc2626' };
            return { risk: 'Low', class: 'low-risk', color: '#22c55e' };
        }
    };

    const handleGirthChange = (measurement, value) => {
        setVitalsData(prev => ({
            ...prev,
            girths: {
                ...prev.girths,
                [measurement]: value
            }
        }));
    };

    const handleAssessmentMethodChange = (method, checked) => {
        setVitalsData(prev => ({
            ...prev,
            assessmentMethods: {
                ...prev.assessmentMethods,
                [method]: checked
            }
        }));
    };

    const handleSkinfoldChange = (site, value) => {
        setVitalsData(prev => {
            const updated = {
                ...prev,
                skinfolds: {
                    ...prev.skinfolds,
                    [site]: value
                }
            };

            // Auto-calculate body fat percentage when skinfolds change
            const calculatedBF = calculateBodyFatFromSkinfolds(updated.skinfolds, updated.clientAge, updated.clientGender, updated.skinfoldMethod);
            if (calculatedBF) {
                updated.bodyFatPercentage = calculatedBF;
                updated.bodyFatMethod = 'skinfolds';
            }

            return updated;
        });
    };

    // Calculate body fat percentage from skinfold measurements using multiple methods
    const calculateBodyFatFromSkinfolds = (skinfolds, age, gender, method) => {
        // Ensure we have the required measurements
        const chest = parseFloat(skinfolds.chest) || 0;
        const abdominal = parseFloat(skinfolds.abdominal) || 0;
        const thigh = parseFloat(skinfolds.thigh) || 0;
        const tricep = parseFloat(skinfolds.tricep) || 0;
        const subscapular = parseFloat(skinfolds.subscapular) || 0;
        const suprailiac = parseFloat(skinfolds.suprailiac) || 0;
        const midaxillary = parseFloat(skinfolds.midaxillary) || 0;

        const clientAge = parseInt(age) || 25; // default age if not provided

        switch (method) {
            case 'jackson-pollock-3':
                if (gender === 'male') {
                    // Jackson-Pollock 3-site formula for men (chest, abdominal, thigh)
                    if (chest && abdominal && thigh) {
                        const sum = chest + abdominal + thigh;
                        const bodyDensity = 1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * clientAge);
                        const bodyFat = ((495 / bodyDensity) - 450);
                        return bodyFat.toFixed(1);
                    }
                } else {
                    // Jackson-Pollock 3-site formula for women (tricep, suprailiac, thigh)
                    if (tricep && suprailiac && thigh) {
                        const sum = tricep + suprailiac + thigh;
                        const bodyDensity = 1.0994921 - (0.0009929 * sum) + (0.0000023 * sum * sum) - (0.0001392 * clientAge);
                        const bodyFat = ((495 / bodyDensity) - 450);
                        return bodyFat.toFixed(1);
                    }
                }
                break;

            case 'jackson-pollock-7':
                if (gender === 'male') {
                    // Jackson-Pollock 7-site formula for men
                    if (chest && midaxillary && tricep && subscapular && abdominal && suprailiac && thigh) {
                        const sum = chest + midaxillary + tricep + subscapular + abdominal + suprailiac + thigh;
                        const bodyDensity = 1.112 - (0.00043499 * sum) + (0.00000055 * sum * sum) - (0.00028826 * clientAge);
                        const bodyFat = ((495 / bodyDensity) - 450);
                        return bodyFat.toFixed(1);
                    }
                } else {
                    // Jackson-Pollock 7-site formula for women
                    if (chest && midaxillary && tricep && subscapular && abdominal && suprailiac && thigh) {
                        const sum = chest + midaxillary + tricep + subscapular + abdominal + suprailiac + thigh;
                        const bodyDensity = 1.097 - (0.00046971 * sum) + (0.00000056 * sum * sum) - (0.00012828 * clientAge);
                        const bodyFat = ((495 / bodyDensity) - 450);
                        return bodyFat.toFixed(1);
                    }
                }
                break;

            case 'durnin-womersley':
                // Durnin-Womersley 4-site formula (tricep, subscapular, suprailiac, bicep - using chest as bicep substitute)
                if (tricep && subscapular && suprailiac && chest) {
                    const sum = tricep + subscapular + suprailiac + chest;
                    let bodyDensity;

                    if (gender === 'male') {
                        if (clientAge <= 19) {
                            bodyDensity = 1.1533 - (0.0643 * Math.log10(sum));
                        } else if (clientAge <= 29) {
                            bodyDensity = 1.1631 - (0.0632 * Math.log10(sum));
                        } else if (clientAge <= 39) {
                            bodyDensity = 1.1422 - (0.0544 * Math.log10(sum));
                        } else if (clientAge <= 49) {
                            bodyDensity = 1.1620 - (0.0700 * Math.log10(sum));
                        } else {
                            bodyDensity = 1.1715 - (0.0779 * Math.log10(sum));
                        }
                    } else {
                        if (clientAge <= 19) {
                            bodyDensity = 1.1549 - (0.0678 * Math.log10(sum));
                        } else if (clientAge <= 29) {
                            bodyDensity = 1.1599 - (0.0717 * Math.log10(sum));
                        } else if (clientAge <= 39) {
                            bodyDensity = 1.1423 - (0.0632 * Math.log10(sum));
                        } else if (clientAge <= 49) {
                            bodyDensity = 1.1333 - (0.0612 * Math.log10(sum));
                        } else {
                            bodyDensity = 1.1339 - (0.0645 * Math.log10(sum));
                        }
                    }

                    const bodyFat = ((495 / bodyDensity) - 450);
                    return bodyFat.toFixed(1);
                }
                break;

            default:
                return null;
        }

        return null;
    };

    // Determine which measurements are required based on method and gender
    const isRequiredMeasurement = (site, method, gender) => {
        switch (method) {
            case 'jackson-pollock-3':
                if (gender === 'male') {
                    return ['chest', 'abdominal', 'thigh'].includes(site);
                } else {
                    return ['tricep', 'suprailiac', 'thigh'].includes(site);
                }
            case 'jackson-pollock-7':
                return ['chest', 'midaxillary', 'tricep', 'subscapular', 'abdominal', 'suprailiac', 'thigh'].includes(site);
            case 'durnin-womersley':
                return ['tricep', 'subscapular', 'suprailiac', 'chest'].includes(site);
            default:
                return false;
        }
    };

    const calculateBMI = (data) => {
        const { height, heightFeet, heightInches, weight, heightUnit, weightUnit } = data;

        if (!weight) return '';

        let heightInMeters = 0;
        let weightInKg = parseFloat(weight);

        // Calculate height in meters based on unit
        if (heightUnit === 'feet') {
            // Use feet and inches
            if (!heightFeet && !heightInches) return '';
            const totalInches = (parseFloat(heightFeet || 0) * 12) + parseFloat(heightInches || 0);
            heightInMeters = totalInches * 0.0254;
        } else if (heightUnit === 'inches') {
            if (!height) return '';
            heightInMeters = parseFloat(height) * 0.0254;
        } else if (heightUnit === 'cm') {
            if (!height) return '';
            heightInMeters = parseFloat(height) / 100;
        } else if (heightUnit === 'meters') {
            if (!height) return '';
            heightInMeters = parseFloat(height);
        }

        if (heightInMeters <= 0) return '';

        // Convert weight to kg
        if (weightUnit === 'lbs') {
            weightInKg = weightInKg * 0.453592;
        }

        const bmi = weightInKg / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    };

    const assessRiskFlags = () => {
        const flags = [];

        // Cardiovascular risk flags - updated for 3-day average
        if (vitalsData.averageRHR) {
            const hr = parseInt(vitalsData.averageRHR);
            if (hr > 100) flags.push('Elevated Resting Heart Rate (>100 bpm)');
            if (hr < 50) flags.push('Low Resting Heart Rate (<50 bpm)');
        }

        if (vitalsData.systolicBP && vitalsData.diastolicBP) {
            const sys = parseInt(vitalsData.systolicBP);
            const dia = parseInt(vitalsData.diastolicBP);

            if (sys >= 140 || dia >= 90) {
                flags.push('Hypertension Risk (≥140/90 mmHg) - Medical clearance recommended');
            } else if ((sys >= 120 && sys <= 135) || (dia >= 80 && dia <= 85)) {
                flags.push('Prehypertensive Blood Pressure (120-135/80-85 mmHg)');
            }
        }

        // BMI risk flags
        if (vitalsData.bmi) {
            const bmi = parseFloat(vitalsData.bmi);
            if (bmi < 18.5) flags.push('Underweight (BMI <18.5)');
            if (bmi >= 25 && bmi < 30) flags.push('Overweight (BMI 25-29.9)');
            if (bmi >= 30) flags.push('Obese (BMI ≥30)');
        }

        // WHR risk flags
        if (vitalsData.whr) {
            const ratio = parseFloat(vitalsData.whr);
            if (vitalsData.clientGender === 'female' && ratio > 0.80) {
                flags.push('Elevated WHR Risk - Female (>0.80)');
            } else if (vitalsData.clientGender === 'male' && ratio > 0.95) {
                flags.push('Elevated WHR Risk - Male (>0.95)');
            }
        }

        // Body fat risk flags
        if (vitalsData.bodyFatPercentage) {
            const bf = parseFloat(vitalsData.bodyFatPercentage);
            // Gender-specific body fat ranges
            if (vitalsData.clientGender === 'male') {
                if (bf > 25) flags.push('Elevated Body Fat Percentage - Male (>25%)');
                if (bf < 6) flags.push('Very Low Body Fat Percentage - Male (<6%)');
            } else {
                if (bf > 32) flags.push('Elevated Body Fat Percentage - Female (>32%)');
                if (bf < 16) flags.push('Very Low Body Fat Percentage - Female (<16%)');
            }
        }

        return flags;
    };

    // Update risk flags when vitals data changes
    useEffect(() => {
        const newFlags = assessRiskFlags();
        setRiskFlags(newFlags);
    }, [vitalsData.averageRHR, vitalsData.systolicBP, vitalsData.diastolicBP, vitalsData.bmi, vitalsData.bodyFatPercentage, vitalsData.whr, vitalsData.clientGender]);

    const handleSubmit = () => {
        const currentRiskFlags = assessRiskFlags();

        const trackingBaselines = {
            weight: vitalsData.weight,
            bmi: vitalsData.bmi,
            waistCircumference: vitalsData.waistCircumference,
            hipCircumference: vitalsData.hipCircumference,
            whr: vitalsData.whr,
            bodyFat: vitalsData.bodyFatPercentage,
            averageRHR: vitalsData.averageRHR,
            bloodPressure: `${vitalsData.systolicBP}/${vitalsData.diastolicBP}`
        };

        // Classifications for summary
        const classifications = {
            rhrClass: getRHRClassification(vitalsData.averageRHR),
            bpClass: getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP),
            bmiClass: getBMIClassification(vitalsData.bmi),
            whrRisk: getWHRRisk(vitalsData.whr, vitalsData.clientGender)
        };

        // Medical warnings
        const warnings = [];
        if (classifications.bpClass?.warning) {
            warnings.push('Hypertensive blood pressure - Medical clearance recommended');
        }
        if (currentRiskFlags.some(flag => flag.includes('Medical clearance'))) {
            warnings.push('Additional risk factors identified requiring medical attention');
        }

        // Save vitals results using setVitalsData action if available, otherwise setAssessmentData
        if (actions.setVitalsData) {
            actions.setVitalsData({
                vitals: {
                    rhr: vitalsData.averageRHR,
                    bp: { systolic: vitalsData.systolicBP, diastolic: vitalsData.diastolicBP },
                    bmi: vitalsData.bmi,
                    whr: vitalsData.whr,
                    circumferences: vitalsData.girths,
                    skinfolds: vitalsData.skinfolds,
                    bodyFat: vitalsData.bodyFatPercentage
                },
                classifications,
                warnings
            });
        }

        actions.setAssessmentData({
            ...state.assessmentData,
            step: 2,
            vitalsData,
            riskFlags: currentRiskFlags,
            trackingBaselines,
            classifications,
            warnings,
            timestamp: new Date().toISOString()
        });

        // Move to next step
        actions.setCurrentStep(3);
    };

    const isFormComplete = () => {
        // Check height based on unit
        const hasHeight = vitalsData.heightUnit === 'feet'
            ? (vitalsData.heightFeet && vitalsData.heightInches !== '')
            : vitalsData.height;

        return hasHeight &&
            vitalsData.weight &&
            vitalsData.restingHR;
        // Removed waist requirement since it's optional
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
                <h2>Step 2: Baseline Vitals & Body Measures</h2>
                <p>Establish physiological baselines and identify risk factors</p>
            </div>

            <div className="vitals-sections">
                {/* Vital Signs */}
                <div className="vitals-section">
                    <h3>Vital Signs</h3>

                    <div className="form-row">
                        <div className="form-group rhr-tracking-group">
                            <label>3-Day Resting Heart Rate Tracking *</label>
                            <p className="instruction">Take measurements on 3 consecutive mornings upon waking, before getting out of bed.</p>

                            <div className="rhr-inputs">
                                <div className="rhr-day">
                                    <label>Day 1 (bpm):</label>
                                    <input
                                        type="number"
                                        value={vitalsData.restingHR_day1}
                                        onChange={(e) => handleInputChange('restingHR_day1', e.target.value)}
                                        placeholder="60-100"
                                        min="30"
                                        max="220"
                                    />
                                </div>

                                <div className="rhr-day">
                                    <label>Day 2 (bpm):</label>
                                    <input
                                        type="number"
                                        value={vitalsData.restingHR_day2}
                                        onChange={(e) => handleInputChange('restingHR_day2', e.target.value)}
                                        placeholder="60-100"
                                        min="30"
                                        max="220"
                                    />
                                </div>

                                <div className="rhr-day">
                                    <label>Day 3 (bpm):</label>
                                    <input
                                        type="number"
                                        value={vitalsData.restingHR_day3}
                                        onChange={(e) => handleInputChange('restingHR_day3', e.target.value)}
                                        placeholder="60-100"
                                        min="30"
                                        max="220"
                                    />
                                </div>
                            </div>

                            {vitalsData.averageRHR > 0 && (
                                <div className="rhr-summary">
                                    <div className="average-display">
                                        <strong>Average RHR: {vitalsData.averageRHR} bpm</strong>
                                        <span className={`classification ${getRHRClassification(vitalsData.averageRHR)?.class || ''}`}>
                                            {getRHRClassification(vitalsData.averageRHR)?.label}
                                        </span>
                                    </div>
                                    {getRHRClassification(vitalsData.averageRHR)?.warning && (
                                        <div className="warning-text">
                                            ⚠️ {getRHRClassification(vitalsData.averageRHR).warning}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-group bp-group">
                            <label>Blood Pressure (mmHg)</label>
                            <div className="bp-inputs">
                                <div className="bp-input">
                                    <label>Systolic:</label>
                                    <input
                                        type="number"
                                        value={vitalsData.systolicBP}
                                        onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                                        placeholder="120"
                                        min="80"
                                        max="200"
                                    />
                                </div>
                                <span className="bp-divider">/</span>
                                <div className="bp-input">
                                    <label>Diastolic:</label>
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

                            {vitalsData.systolicBP > 0 && vitalsData.diastolicBP > 0 && (
                                <div className="bp-classification">
                                    <div className="bp-reading">
                                        <strong>BP: {vitalsData.systolicBP}/{vitalsData.diastolicBP} mmHg</strong>
                                        <span className={`classification ${getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP)?.class || ''}`}>
                                            {getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP)?.category}
                                        </span>
                                    </div>
                                    {getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP)?.warning && (
                                        <div className="warning-text">
                                            ⚠️ {getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP).warning}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body Measurements */}
                <div className="vitals-section">
                    <h3>Body Measurements</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Height *</label>
                            <div className="height-input-container">
                                {vitalsData.heightUnit === 'feet' ? (
                                    <div className="feet-inches-input">
                                        <div className="feet-input">
                                            <label>Feet:</label>
                                            <select
                                                value={vitalsData.heightFeet}
                                                onChange={(e) => handleInputChange('heightFeet', e.target.value)}
                                                required
                                            >
                                                <option value="">Select feet</option>
                                                <option value="3">3 ft</option>
                                                <option value="4">4 ft</option>
                                                <option value="5">5 ft</option>
                                                <option value="6">6 ft</option>
                                                <option value="7">7 ft</option>
                                                <option value="8">8 ft</option>
                                            </select>
                                        </div>
                                        <div className="inches-input">
                                            <label>Inches:</label>
                                            <select
                                                value={vitalsData.heightInches}
                                                onChange={(e) => handleInputChange('heightInches', e.target.value)}
                                                required
                                            >
                                                <option value="">Select inches</option>
                                                <option value="0">0 in</option>
                                                <option value="1">1 in</option>
                                                <option value="2">2 in</option>
                                                <option value="3">3 in</option>
                                                <option value="4">4 in</option>
                                                <option value="5">5 in</option>
                                                <option value="6">6 in</option>
                                                <option value="7">7 in</option>
                                                <option value="8">8 in</option>
                                                <option value="9">9 in</option>
                                                <option value="10">10 in</option>
                                                <option value="11">11 in</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="single-height-input">
                                        <input
                                            type="number"
                                            value={vitalsData.height}
                                            onChange={(e) => handleInputChange('height', e.target.value)}
                                            placeholder={vitalsData.heightUnit === 'inches' ? '70' : vitalsData.heightUnit === 'cm' ? '178' : '1.78'}
                                            step="0.1"
                                            required
                                        />
                                    </div>
                                )}
                                <select
                                    value={vitalsData.heightUnit}
                                    onChange={(e) => handleInputChange('heightUnit', e.target.value)}
                                    className="height-unit-select"
                                >
                                    <option value="feet">feet & inches</option>
                                    <option value="inches">inches</option>
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
                            <label>BMI & Health Metrics</label>
                            <div className="health-metrics">
                                <div className="bmi-display">
                                    <span className="metric-label">BMI:</span>
                                    <span className="metric-value">{vitalsData.bmi || '—'}</span>
                                    {vitalsData.bmi && (
                                        <span className={`classification ${getBMIClassification(vitalsData.bmi)?.class || ''}`}>
                                            {getBMIClassification(vitalsData.bmi)?.category}
                                        </span>
                                    )}
                                </div>

                                {vitalsData.waistCircumference > 0 && vitalsData.hipCircumference > 0 && (
                                    <div className="whr-display">
                                        <span className="metric-label">WHR:</span>
                                        <span className="metric-value">{vitalsData.whr}</span>
                                        <span className={`classification ${getWHRRisk(vitalsData.whr, vitalsData.clientGender)?.class || ''}`}>
                                            {getWHRRisk(vitalsData.whr, vitalsData.clientGender)?.risk}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Girth Measurements */}
                <div className="vitals-section">
                    <h3>Girth Measurements (inches)</h3>
                    <p className="section-note">Take measurements at standardized anatomical landmarks</p>

                    <div className="girths-grid">
                        <div className="form-group">
                            <label>Neck</label>
                            <input
                                type="number"
                                value={vitalsData.girths.neck}
                                onChange={(e) => handleGirthChange('neck', e.target.value)}
                                placeholder="Neck circumference"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Chest</label>
                            <input
                                type="number"
                                value={vitalsData.girths.chest}
                                onChange={(e) => handleGirthChange('chest', e.target.value)}
                                placeholder="Chest circumference"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Waist * (for WHR)</label>
                            <input
                                type="number"
                                value={vitalsData.waistCircumference}
                                onChange={(e) => handleInputChange('waistCircumference', e.target.value)}
                                placeholder="Waist circumference"
                                step="0.1"
                                required
                            />
                            <small>Narrowest point of torso</small>
                        </div>

                        <div className="form-group">
                            <label>Hips * (for WHR)</label>
                            <input
                                type="number"
                                value={vitalsData.hipCircumference}
                                onChange={(e) => handleInputChange('hipCircumference', e.target.value)}
                                placeholder="Hip circumference"
                                step="0.1"
                                required
                            />
                            <small>Widest point of hips</small>
                        </div>

                        <div className="form-group">
                            <label>Waist (Alternative)</label>
                            <input
                                type="number"
                                value={vitalsData.girths.waist}
                                onChange={(e) => handleGirthChange('waist', e.target.value)}
                                placeholder="Waist circumference"
                                step="0.1"
                            />
                            <small>Additional measurement point</small>
                        </div>

                        <div className="form-group">
                            <label>Hips (Alternative)</label>
                            <input
                                type="number"
                                value={vitalsData.girths.hips}
                                onChange={(e) => handleGirthChange('hips', e.target.value)}
                                placeholder="Hip circumference"
                                step="0.1"
                            />
                            <small>Additional measurement point</small>
                        </div>

                        <div className="form-group">
                            <label>Right Arm</label>
                            <input
                                type="number"
                                value={vitalsData.girths.rightArm}
                                onChange={(e) => handleGirthChange('rightArm', e.target.value)}
                                placeholder="Right arm circumference"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Left Arm</label>
                            <input
                                type="number"
                                value={vitalsData.girths.leftArm}
                                onChange={(e) => handleGirthChange('leftArm', e.target.value)}
                                placeholder="Left arm circumference"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Right Thigh</label>
                            <input
                                type="number"
                                value={vitalsData.girths.rightThigh}
                                onChange={(e) => handleGirthChange('rightThigh', e.target.value)}
                                placeholder="Right thigh circumference"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Left Thigh</label>
                            <input
                                type="number"
                                value={vitalsData.girths.leftThigh}
                                onChange={(e) => handleGirthChange('leftThigh', e.target.value)}
                                placeholder="Left thigh circumference"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Right Calf</label>
                            <input
                                type="number"
                                value={vitalsData.girths.rightCalf}
                                onChange={(e) => handleGirthChange('rightCalf', e.target.value)}
                                placeholder="Right calf circumference"
                                step="0.1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Left Calf</label>
                            <input
                                type="number"
                                value={vitalsData.girths.leftCalf}
                                onChange={(e) => handleGirthChange('leftCalf', e.target.value)}
                                placeholder="Left calf circumference"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>

                {/* Optional Body Composition */}
                <div className="vitals-section">
                    <h3>Body Composition (Optional)</h3>
                    <p className="section-note">Select assessment methods you want to use</p>

                    {/* Assessment Method Checkboxes */}
                    <div className="assessment-methods">
                        <h4>Assessment Methods</h4>
                        <div className="checkbox-grid">
                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={vitalsData.assessmentMethods.bioelectrical}
                                    onChange={(e) => handleAssessmentMethodChange('bioelectrical', e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Bioelectrical Impedance
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={vitalsData.assessmentMethods.hydrostatic}
                                    onChange={(e) => handleAssessmentMethodChange('hydrostatic', e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Hydrostatic Weighing
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={vitalsData.assessmentMethods.dexaScan}
                                    onChange={(e) => handleAssessmentMethodChange('dexaScan', e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                DEXA Scan
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={vitalsData.assessmentMethods.skinfolds}
                                    onChange={(e) => handleAssessmentMethodChange('skinfolds', e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Skinfold Calipers
                            </label>

                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={vitalsData.assessmentMethods.manual}
                                    onChange={(e) => handleAssessmentMethodChange('manual', e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Manual Entry
                            </label>
                        </div>
                    </div>

                    {/* Manual Entry Section */}
                    {vitalsData.assessmentMethods.manual && (
                        <div className="manual-entry-section">
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
                                    <label>Assessment Method Used</label>
                                    <input
                                        type="text"
                                        value={vitalsData.bodyFatMethod}
                                        onChange={(e) => handleInputChange('bodyFatMethod', e.target.value)}
                                        placeholder="e.g., Visual estimation, Previous test"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skinfold Caliper Body Composition - Only show if selected */}
                {vitalsData.assessmentMethods.skinfolds && (
                    <div className="vitals-section">
                        <h3>Skinfold Caliper Assessment</h3>
                        <p className="section-note">
                            Professional skinfold measurement for body fat percentage calculation
                        </p>

                        {/* Client Demographics for Calculation */}
                        <div className="form-row demographics-row">
                            <div className="form-group">
                                <label>Client Age *</label>
                                <input
                                    type="number"
                                    value={vitalsData.clientAge}
                                    onChange={(e) => handleInputChange('clientAge', e.target.value)}
                                    placeholder="Age in years"
                                    min="18"
                                    max="80"
                                />
                            </div>

                            <div className="form-group">
                                <label>Client Gender *</label>
                                <select
                                    value={vitalsData.clientGender}
                                    onChange={(e) => handleInputChange('clientGender', e.target.value)}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>

                        {/* Skinfold Measurement Table */}
                        <div className="skinfold-table">
                            <h4>Skinfold Caliper Body Composition Assessment</h4>

                            {/* Reference Diagram */}
                            <div className="reference-diagram">
                                <h5>📋 Measurement Site Reference</h5>
                                <div className="diagram-container">
                                    {/* Uncomment this line after saving your skinfold diagram image */}
                                    {/* <img 
                                        src={skinfoldDiagramMale} 
                                        alt="7-Site Skinfold Measurement Locations - Male" 
                                        className="skinfold-reference-image"
                                    /> */}
                                    <div className="placeholder-image">
                                        <p>📊 Place your skinfold diagram image here</p>
                                        <p><em>Save as: src/assets/images/skinfold-diagram-male.png</em></p>
                                        <p><em>Then uncomment the img tag above and the import statement</em></p>
                                    </div>
                                    <p className="diagram-caption">
                                        Reference diagram showing all 7 skinfold measurement sites.
                                        Use this visual guide alongside the detailed location descriptions below.
                                    </p>
                                </div>
                            </div>

                            {/* Method Selection */}
                            <div className="method-selection">
                                <div className="form-group">
                                    <label>Skinfold Calculation Method *</label>
                                    <select
                                        value={vitalsData.skinfoldMethod}
                                        onChange={(e) => handleInputChange('skinfoldMethod', e.target.value)}
                                        className="method-selector"
                                    >
                                        <option value="jackson-pollock-3">Jackson-Pollock 3-Site (Most Common)</option>
                                        <option value="jackson-pollock-7">Jackson-Pollock 7-Site (Most Accurate)</option>
                                        <option value="durnin-womersley">Durnin-Womersley 4-Site (Alternative)</option>
                                    </select>
                                </div>

                                <div className="method-info">
                                    {vitalsData.skinfoldMethod === 'jackson-pollock-3' && (
                                        <div className="method-description">
                                            <strong>3-Site Method:</strong> Uses 3 measurements for quick assessment.
                                            <br />Male: Chest, Abdominal, Thigh | Female: Tricep, Suprailiac, Thigh
                                        </div>
                                    )}
                                    {vitalsData.skinfoldMethod === 'jackson-pollock-7' && (
                                        <div className="method-description">
                                            <strong>7-Site Method:</strong> Uses all 7 measurements for highest accuracy.
                                            <br />Both: Chest, Midaxillary, Tricep, Subscapular, Abdominal, Suprailiac, Thigh
                                        </div>
                                    )}
                                    {vitalsData.skinfoldMethod === 'durnin-womersley' && (
                                        <div className="method-description">
                                            <strong>Durnin-Womersley Method:</strong> Age-specific equations using 4 sites.
                                            <br />Both: Tricep, Subscapular, Suprailiac, Chest (as bicep substitute)
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="measurement-instructions">
                                <p><strong>Instructions:</strong> Take measurements on the right side of the body.
                                    Pinch skin fold, apply calipers 1cm away from fingers, read after 2 seconds.</p>
                            </div>

                            <table className="skinfold-measurements-table">
                                <thead>
                                    <tr>
                                        <th>Site</th>
                                        <th>Location</th>
                                        <th>Measurement (mm)</th>
                                        <th>Required for</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={isRequiredMeasurement('chest', vitalsData.skinfoldMethod, vitalsData.clientGender) ? 'required-measurement' : ''}>
                                        <td><strong>Chest</strong></td>
                                        <td>
                                            <div className="measurement-description">
                                                Diagonal fold halfway between anterior axillary line and nipple
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={vitalsData.skinfolds.chest}
                                                onChange={(e) => handleSkinfoldChange('chest', e.target.value)}
                                                placeholder="mm"
                                                step="0.5"
                                                min="0"
                                                max="50"
                                                className="skinfold-input"
                                            />
                                        </td>
                                        <td>
                                            {isRequiredMeasurement('chest', vitalsData.skinfoldMethod, vitalsData.clientGender) ?
                                                <span className="required-indicator">Required</span> :
                                                <span className="optional-indicator">Optional</span>
                                            }
                                        </td>
                                    </tr>

                                    <tr className={isRequiredMeasurement('abdominal', vitalsData.skinfoldMethod, vitalsData.clientGender) ? 'required-measurement' : ''}>
                                        <td><strong>Abdominal</strong></td>
                                        <td>
                                            <div className="measurement-description">
                                                Vertical fold 2cm to the right of the umbilicus
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={vitalsData.skinfolds.abdominal}
                                                onChange={(e) => handleSkinfoldChange('abdominal', e.target.value)}
                                                placeholder="mm"
                                                step="0.5"
                                                min="0"
                                                max="50"
                                                className="skinfold-input"
                                            />
                                        </td>
                                        <td>
                                            {isRequiredMeasurement('abdominal', vitalsData.skinfoldMethod, vitalsData.clientGender) ?
                                                <span className="required-indicator">Required</span> :
                                                <span className="optional-indicator">Optional</span>
                                            }
                                        </td>
                                    </tr>

                                    <tr className={isRequiredMeasurement('thigh', vitalsData.skinfoldMethod, vitalsData.clientGender) ? 'required-measurement' : ''}>
                                        <td><strong>Thigh</strong></td>
                                        <td>
                                            <div className="measurement-description">
                                                Vertical fold on anterior thigh midway between inguinal crease and top of patella
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={vitalsData.skinfolds.thigh}
                                                onChange={(e) => handleSkinfoldChange('thigh', e.target.value)}
                                                placeholder="mm"
                                                step="0.5"
                                                min="0"
                                                max="50"
                                                className="skinfold-input"
                                            />
                                        </td>
                                        <td>
                                            {isRequiredMeasurement('thigh', vitalsData.skinfoldMethod, vitalsData.clientGender) ?
                                                <span className="required-indicator">Required</span> :
                                                <span className="optional-indicator">Optional</span>
                                            }
                                        </td>
                                    </tr>

                                    <tr className={isRequiredMeasurement('tricep', vitalsData.skinfoldMethod, vitalsData.clientGender) ? 'required-measurement' : ''}>
                                        <td><strong>Tricep</strong></td>
                                        <td>
                                            <div className="measurement-description">
                                                Vertical fold on posterior midline of upper arm, halfway between acromion and olecranon
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={vitalsData.skinfolds.tricep}
                                                onChange={(e) => handleSkinfoldChange('tricep', e.target.value)}
                                                placeholder="mm"
                                                step="0.5"
                                                min="0"
                                                max="50"
                                                className="skinfold-input"
                                            />
                                        </td>
                                        <td>
                                            {isRequiredMeasurement('tricep', vitalsData.skinfoldMethod, vitalsData.clientGender) ?
                                                <span className="required-indicator">Required</span> :
                                                <span className="optional-indicator">Optional</span>
                                            }
                                        </td>
                                    </tr>

                                    <tr className={isRequiredMeasurement('subscapular', vitalsData.skinfoldMethod, vitalsData.clientGender) ? 'required-measurement' : ''}>
                                        <td><strong>Subscapular</strong></td>
                                        <td>
                                            <div className="measurement-description">
                                                Diagonal fold below inferior angle of scapula
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={vitalsData.skinfolds.subscapular}
                                                onChange={(e) => handleSkinfoldChange('subscapular', e.target.value)}
                                                placeholder="mm"
                                                step="0.5"
                                                min="0"
                                                max="50"
                                                className="skinfold-input"
                                            />
                                        </td>
                                        <td>
                                            {isRequiredMeasurement('subscapular', vitalsData.skinfoldMethod, vitalsData.clientGender) ?
                                                <span className="required-indicator">Required</span> :
                                                <span className="optional-indicator">Optional</span>
                                            }
                                        </td>
                                    </tr>

                                    <tr className={isRequiredMeasurement('suprailiac', vitalsData.skinfoldMethod, vitalsData.clientGender) ? 'required-measurement' : ''}>
                                        <td><strong>Suprailiac</strong></td>
                                        <td>
                                            <div className="measurement-description">
                                                Diagonal fold above iliac crest at anterior axillary line
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={vitalsData.skinfolds.suprailiac}
                                                onChange={(e) => handleSkinfoldChange('suprailiac', e.target.value)}
                                                placeholder="mm"
                                                step="0.5"
                                                min="0"
                                                max="50"
                                                className="skinfold-input"
                                            />
                                        </td>
                                        <td>
                                            {isRequiredMeasurement('suprailiac', vitalsData.skinfoldMethod, vitalsData.clientGender) ?
                                                <span className="required-indicator">Required</span> :
                                                <span className="optional-indicator">Optional</span>
                                            }
                                        </td>
                                    </tr>

                                    <tr className={isRequiredMeasurement('midaxillary', vitalsData.skinfoldMethod, vitalsData.clientGender) ? 'required-measurement' : ''}>
                                        <td><strong>Midaxillary</strong></td>
                                        <td>
                                            <div className="measurement-description">
                                                Horizontal fold at xiphoid process level along midaxillary line
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={vitalsData.skinfolds.midaxillary}
                                                onChange={(e) => handleSkinfoldChange('midaxillary', e.target.value)}
                                                placeholder="mm"
                                                step="0.5"
                                                min="0"
                                                max="50"
                                                className="skinfold-input"
                                            />
                                        </td>
                                        <td>
                                            {isRequiredMeasurement('midaxillary', vitalsData.skinfoldMethod, vitalsData.clientGender) ?
                                                <span className="required-indicator">Required</span> :
                                                <span className="optional-indicator">Optional</span>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Calculation Results */}
                            {vitalsData.bodyFatPercentage && vitalsData.bodyFatMethod === 'skinfolds' && (
                                <div className="calculation-results">
                                    <h4>📊 Calculation Results</h4>
                                    <div className="results-grid">
                                        <div className="result-item">
                                            <span className="result-label">Body Fat Percentage:</span>
                                            <span className="result-value">{vitalsData.bodyFatPercentage}%</span>
                                        </div>
                                        <div className="result-item">
                                            <span className="result-label">Method:</span>
                                            <span className="result-value">
                                                {vitalsData.skinfoldMethod === 'jackson-pollock-3' &&
                                                    `Jackson-Pollock 3-site (${vitalsData.clientGender === 'male' ? 'Chest/Abdominal/Thigh' : 'Tricep/Suprailiac/Thigh'})`
                                                }
                                                {vitalsData.skinfoldMethod === 'jackson-pollock-7' &&
                                                    'Jackson-Pollock 7-site (All measurements)'
                                                }
                                                {vitalsData.skinfoldMethod === 'durnin-womersley' &&
                                                    'Durnin-Womersley 4-site'
                                                }
                                            </span>
                                        </div>
                                        {vitalsData.weight && (
                                            <div className="result-item">
                                                <span className="result-label">Estimated Fat Mass:</span>
                                                <span className="result-value">
                                                    {((parseFloat(vitalsData.bodyFatPercentage) / 100) * parseFloat(vitalsData.weight)).toFixed(1)} {vitalsData.weightUnit}
                                                </span>
                                            </div>
                                        )}
                                        {vitalsData.weight && (
                                            <div className="result-item">
                                                <span className="result-label">Estimated Lean Mass:</span>
                                                <span className="result-value">
                                                    {(parseFloat(vitalsData.weight) - ((parseFloat(vitalsData.bodyFatPercentage) / 100) * parseFloat(vitalsData.weight))).toFixed(1)} {vitalsData.weightUnit}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Required Measurements Indicator */}
                            <div className="protocol-indicator">
                                <h5>Current Protocol: {vitalsData.clientGender === 'male' ? 'Male' : 'Female'} 3-Site</h5>
                                <p>
                                    <strong>Required measurements:</strong> {' '}
                                    {vitalsData.clientGender === 'male'
                                        ? 'Chest, Abdominal, Thigh'
                                        : 'Tricep, Suprailiac, Thigh'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
            {/* Vitals Summary */}
            {(vitalsData.averageRHR > 0 || vitalsData.bmi > 0 || (vitalsData.systolicBP > 0 && vitalsData.diastolicBP > 0)) && (
                <div className="vitals-section">
                    <h3>Vitals Summary & Classifications</h3>

                    <div className="summary-grid">
                        {vitalsData.averageRHR > 0 && (
                            <div className="summary-item">
                                <div className="summary-label">Average Resting HR:</div>
                                <div className="summary-value">
                                    <span className="value">{vitalsData.averageRHR} bpm</span>
                                    <span className={`classification ${getRHRClassification(vitalsData.averageRHR)?.class || ''}`}>
                                        {getRHRClassification(vitalsData.averageRHR)?.label}
                                    </span>
                                </div>
                            </div>
                        )}

                        {vitalsData.systolicBP > 0 && vitalsData.diastolicBP > 0 && (
                            <div className="summary-item">
                                <div className="summary-label">Blood Pressure:</div>
                                <div className="summary-value">
                                    <span className="value">{vitalsData.systolicBP}/{vitalsData.diastolicBP} mmHg</span>
                                    <span className={`classification ${getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP)?.class || ''}`}>
                                        {getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP)?.category}
                                    </span>
                                </div>
                            </div>
                        )}

                        {vitalsData.bmi > 0 && (
                            <div className="summary-item">
                                <div className="summary-label">BMI:</div>
                                <div className="summary-value">
                                    <span className="value">{vitalsData.bmi}</span>
                                    <span className={`classification ${getBMIClassification(vitalsData.bmi)?.class || ''}`}>
                                        {getBMIClassification(vitalsData.bmi)?.category}
                                    </span>
                                </div>
                            </div>
                        )}

                        {vitalsData.whr > 0 && (
                            <div className="summary-item">
                                <div className="summary-label">Waist-Hip Ratio:</div>
                                <div className="summary-value">
                                    <span className="value">{vitalsData.whr}</span>
                                    <span className={`classification ${getWHRRisk(vitalsData.whr, vitalsData.clientGender)?.class || ''}`}>
                                        {getWHRRisk(vitalsData.whr, vitalsData.clientGender)?.risk} Risk
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Medical Warnings */}
                    {(getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP)?.warning ||
                        getRHRClassification(vitalsData.averageRHR)?.warning) && (
                            <div className="medical-warnings">
                                <h4>⚠️ Medical Attention Recommended</h4>
                                {getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP)?.warning && (
                                    <div className="warning-item">
                                        • {getBPClassification(vitalsData.systolicBP, vitalsData.diastolicBP).warning}
                                    </div>
                                )}
                                {getRHRClassification(vitalsData.averageRHR)?.warning && (
                                    <div className="warning-item">
                                        • {getRHRClassification(vitalsData.averageRHR).warning}
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            )}

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
                    background: #111827;
                    color: #f9fafb;
                    border-radius: 8px;
                }

                .step-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .step-header h2 {
                    color: #dc2626;
                    margin-bottom: 10px;
                    font-size: 1.8em;
                }

                .step-header p {
                    color: #d1d5db;
                }

                .vitals-sections {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .vitals-section {
                    background: #1f2937;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #dc2626;
                    border: 1px solid #374151;
                }

                .vitals-section h3 {
                    color: #dc2626;
                    margin-bottom: 15px;
                    font-size: 1.2em;
                }

                .section-note {
                    color: #9ca3af;
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

                .girths-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #f9fafb;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #4b5563;
                    border-radius: 4px;
                    font-size: 14px;
                    background: #374151;
                    color: #f9fafb;
                }

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
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

                /* Height Input Styles */
                .height-input-container {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .feet-inches-input {
                    display: flex;
                    gap: 12px;
                    flex: 2;
                }

                .feet-input, .inches-input {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    flex: 1;
                    min-width: 80px;
                }

                .feet-input select, .inches-input select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #4b5563;
                    border-radius: 4px;
                    font-size: 14px;
                    background: #374151;
                    color: #f9fafb;
                    min-height: 40px;
                }

                .feet-input select:focus, .inches-input select:focus {
                    outline: none;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
                }

                .feet-input label, .inches-input label {
                    font-size: 12px;
                    color: #d1d5db;
                    font-weight: 500;
                    margin-bottom: 4px;
                }

                .single-height-input {
                    flex: 2;
                }

                .single-height-input input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #4b5563;
                    border-radius: 4px;
                    font-size: 14px;
                    background: #374151;
                    color: #f9fafb;
                }

                .height-unit-select {
                    flex: 1;
                    min-width: 120px;
                }

                .bmi-display {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 12px;
                    background: #374151;
                    border-radius: 4px;
                    border: 1px solid #4b5563;
                }

                .bmi-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #f9fafb;
                }

                .bmi-category {
                    color: #d1d5db;
                    font-size: 14px;
                }

                .risk-flags {
                    background: #451a03;
                    border: 1px solid #dc2626;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                }

                .risk-flags h4 {
                    margin: 0 0 10px 0;
                    color: #fbbf24;
                }

                .risk-flags ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }

                .risk-flag {
                    color: #fca5a5;
                    font-weight: 500;
                    margin-bottom: 5px;
                }

                .risk-note {
                    color: #fbbf24;
                    font-size: 14px;
                    margin: 10px 0 0 0;
                }

                .step-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30px;
                }

                .back-button {
                    background: #4b5563;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .back-button:hover {
                    background: #374151;
                }

                .next-button {
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .next-button:hover:not(:disabled) {
                    background: #b91c1c;
                    transform: translateY(-1px);
                }

                .next-button:disabled {
                    background: #4b5563;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Assessment Method Checkboxes */
                .assessment-methods {
                    background: #1f2937;
                    border: 2px solid #dc2626;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                }

                .assessment-methods h4 {
                    color: #dc2626;
                    margin: 0 0 15px 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .checkbox-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }

                .checkbox-item {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 6px;
                    transition: background-color 0.2s;
                    color: #f9fafb;
                    font-weight: 500;
                }

                .checkbox-item:hover {
                    background: #374151;
                }

                .checkbox-item input[type="checkbox"] {
                    display: none;
                }

                .checkmark {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #dc2626;
                    border-radius: 4px;
                    margin-right: 10px;
                    position: relative;
                    background: #374151;
                }

                .checkbox-item input[type="checkbox"]:checked + .checkmark {
                    background: #dc2626;
                }

                .checkbox-item input[type="checkbox"]:checked + .checkmark::after {
                    content: '✓';
                    position: absolute;
                    left: 3px;
                    top: -2px;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                }

                .manual-entry-section {
                    background: #374151;
                    border: 1px solid #4b5563;
                    border-radius: 6px;
                    padding: 15px;
                    margin-top: 15px;
                }

                /* Skinfold Caliper Styles - Red, White, Black Theme */
                .demographics-row {
                    background: #374151;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    border: 1px solid #4b5563;
                }

                .skinfold-table {
                    margin-top: 20px;
                }

                .skinfold-table h4 {
                    color: #dc2626;
                    margin-bottom: 20px;
                    font-size: 18px;
                }

                /* Reference Diagram Styles */
                .reference-diagram {
                    background: #451a03;
                    border: 2px solid #dc2626;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 25px;
                    text-align: center;
                }

                .reference-diagram h5 {
                    color: #fbbf24;
                    margin: 0 0 15px 0;
                    font-size: 16px;
                }

                .diagram-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }

                .skinfold-reference-image {
                    max-width: 100%;
                    height: auto;
                    max-height: 500px;
                    border: 2px solid #d1d5db;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    background: white;
                }

                .placeholder-image {
                    background: #f9fafb;
                    border: 2px dashed #d1d5db;
                    border-radius: 8px;
                    padding: 40px 20px;
                    color: #6b7280;
                    font-style: italic;
                }

                .placeholder-image p {
                    margin: 5px 0;
                }

                .diagram-caption {
                    color: #78350f;
                    font-size: 14px;
                    font-style: italic;
                    margin: 0;
                    max-width: 500px;
                }

                .method-selection {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border: 2px solid #dc2626;
                }

                .method-selector {
                    font-size: 16px;
                    font-weight: 500;
                    padding: 10px 12px;
                    background: white;
                    border: 2px solid #dc2626;
                    border-radius: 6px;
                    color: #1f2937;
                }

                .method-info {
                    margin-top: 15px;
                    padding: 12px;
                    background: #f9fafb;
                    border-radius: 6px;
                    border-left: 4px solid #dc2626;
                }

                .method-description {
                    color: #374151;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .method-description strong {
                    color: #dc2626;
                }

                .measurement-instructions {
                    background: #fef2f2;
                    border-left: 4px solid #dc2626;
                    padding: 12px 16px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                }

                .measurement-instructions p {
                    margin: 0;
                    color: #dc2626;
                    font-size: 14px;
                    font-weight: 500;
                }

                .skinfold-measurements-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    border: 2px solid #dc2626;
                }

                .skinfold-measurements-table th {
                    background: #dc2626;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: white;
                    border-bottom: 2px solid #b91c1c;
                    font-size: 14px;
                }

                .skinfold-measurements-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                    vertical-align: top;
                    color: #374151;
                }

                .skinfold-measurements-table tr:hover {
                    background: #f9fafb;
                }

                .skinfold-measurements-table .required-measurement {
                    background: #fef2f2;
                    border-left: 4px solid #dc2626;
                }

                .required-indicator {
                    background: #dc2626;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .optional-indicator {
                    background: #374151;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .skinfold-input {
                    width: 80px;
                    padding: 6px 10px;
                    border: 2px solid #d1d5db;
                    border-radius: 4px;
                    font-size: 14px;
                    text-align: center;
                }

                .skinfold-input:focus {
                    outline: none;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
                }

                .measurement-description {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .calculation-results {
                    background: #ecfdf5;
                    border: 1px solid #10b981;
                    border-radius: 8px;
                    padding: 20px;
                    margin-top: 20px;
                }

                .calculation-results h4 {
                    color: #047857;
                    margin: 0 0 15px 0;
                }

                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                }

                .result-item {
                    background: white;
                    padding: 12px;
                    border-radius: 6px;
                    border-left: 3px solid #10b981;
                }

                .result-label {
                    display: block;
                    font-size: 12px;
                    color: #6b7280;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .result-value {
                    display: block;
                    font-size: 16px;
                    font-weight: bold;
                    color: #047857;
                    margin-top: 4px;
                }

                .protocol-indicator {
                    background: #fff7ed;
                    border: 1px solid #f59e0b;
                    border-radius: 6px;
                    padding: 15px;
                    margin-top: 20px;
                }

                .protocol-indicator h5 {
                    color: #92400e;
                    margin: 0 0 8px 0;
                    font-size: 14px;
                }

                .protocol-indicator p {
                    color: #78350f;
                    margin: 0;
                    font-size: 13px;
                }

                /* 3-Day RHR Tracking Styles */
                .rhr-tracking-group {
                    border: 1px solid #4b5563;
                    border-radius: 8px;
                    padding: 16px;
                    background: #374151;
                }

                .rhr-inputs {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin: 12px 0;
                }

                .rhr-day {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .rhr-day label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #d1d5db;
                }

                .rhr-summary {
                    margin-top: 12px;
                    padding: 12px;
                    background: #1f2937;
                    border-radius: 6px;
                    border: 1px solid #4b5563;
                    color: #f9fafb;
                }

                .average-display {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                    color: #f9fafb;
                }

                .average-display strong {
                    color: #f9fafb;
                }

                /* Blood Pressure Styles */
                .bp-group {
                    border: 1px solid #4b5563;
                    border-radius: 8px;
                    padding: 16px;
                    background: #374151;
                }

                .bp-inputs {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 12px 0;
                }

                .bp-input {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .bp-input label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #d1d5db;
                }

                .bp-divider {
                    font-size: 20px;
                    font-weight: bold;
                    color: #d1d5db;
                    margin-top: 16px;
                }

                .bp-classification, .bp-reading {
                    margin-top: 12px;
                    padding: 12px;
                    background: #1f2937;
                    border-radius: 6px;
                    border: 1px solid #4b5563;
                    color: #f9fafb;
                }

                .bp-reading strong {
                    color: #f9fafb;
                }

                /* Health Metrics Styles */
                .form-group .health-metrics {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 12px;
                    background: #374151 !important;
                    border-radius: 6px;
                    border: 1px solid #4b5563;
                    color: #f9fafb;
                }

                .health-metrics .bmi-display, 
                .health-metrics .whr-display {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .health-metrics .metric-label {
                    font-weight: 500;
                    color: #d1d5db !important;
                    min-width: 40px;
                }

                .health-metrics .metric-value {
                    font-weight: bold;
                    color: #f3f4f6 !important;
                    min-width: 50px;
                }

                /* Classification Styles */
                .classification {
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: uppercase;
                }

                .classification.excellent {
                    background: #dcfce7;
                    color: #166534;
                }

                .classification.good, .classification.normal {
                    background: #d1fae5;
                    color: #15803d;
                }

                .classification.average, .classification.elevated {
                    background: #fef3c7;
                    color: #92400e;
                }

                .classification.below-average, .classification.high {
                    background: #fed7d7;
                    color: #c53030;
                }

                .classification.poor, .classification.very-high {
                    background: #fecaca;
                    color: #b91c1c;
                }

                .classification.low-risk {
                    background: #dcfce7;
                    color: #166534;
                }

                .classification.moderate-risk {
                    background: #fef3c7;
                    color: #92400e;
                }

                .classification.high-risk {
                    background: #fecaca;
                    color: #b91c1c;
                }

                .warning-text {
                    color: #dc2626;
                    font-size: 12px;
                    font-weight: 500;
                    margin-top: 4px;
                    padding: 8px;
                    background: #fef2f2;
                    border-radius: 4px;
                    border-left: 3px solid #dc2626;
                }

                .instruction {
                    font-size: 12px;
                    color: #6b7280;
                    font-style: italic;
                    margin-bottom: 8px;
                }

                /* Summary Section Styles */
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 16px;
                    margin-bottom: 20px;
                }

                .summary-item {
                    background: white;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                }

                .summary-label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #6b7280;
                    margin-bottom: 4px;
                }

                .summary-value {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .summary-value .value {
                    font-weight: bold;
                    color: #111827;
                }

                .medical-warnings {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 6px;
                    padding: 16px;
                    margin-top: 16px;
                }

                .medical-warnings h4 {
                    color: #dc2626;
                    margin: 0 0 8px 0;
                    font-size: 14px;
                }

                .warning-item {
                    color: #991b1b;
                    font-size: 13px;
                    margin-bottom: 4px;
                }

                @media (max-width: 768px) {
                    .rhr-inputs {
                        grid-template-columns: 1fr;
                    }
                    
                    .bp-inputs {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .bp-divider {
                        align-self: center;
                        margin: 8px 0;
                    }
                    
                    .health-metrics {
                        gap: 12px;
                    }
                }

                @media (max-width: 768px) {
                    .skinfold-measurements-table {
                        font-size: 12px;
                    }
                    
                    .skinfold-measurements-table th,
                    .skinfold-measurements-table td {
                        padding: 8px;
                    }
                    
                    .results-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default NASMVitalsStep;
