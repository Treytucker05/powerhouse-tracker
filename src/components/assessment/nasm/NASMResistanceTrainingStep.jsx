import React, { useState } from 'react';
import '../../../styles/GlobalNASMStyles.css';

const NASMResistanceTrainingStep = () => {
    const [resistanceData, setResistanceData] = useState({
        trainingPhase: '',
        exerciseSelection: [],
        setRepsScheme: '',
        intensityLevel: '',
        restPeriods: '',
        trainingFrequency: '',
        progressionPlan: '',
        equipmentUsed: [],
        specialConsiderations: ''
    });

    const handleInputChange = (field, value) => {
        setResistanceData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (field, value, checked) => {
        setResistanceData(prev => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    const exerciseCategories = {
        'total-body': ['Squat to overhead press', 'Deadlift to upright row', 'Lunge with rotation', 'Burpee variations'],
        'chest': ['Push-ups', 'Chest press', 'Incline press', 'Chest fly', 'Cable crossover'],
        'back': ['Lat pulldown', 'Seated row', 'Single-arm row', 'Pull-ups', 'Reverse fly'],
        'shoulders': ['Overhead press', 'Lateral raise', 'Front raise', 'Rear deltoid fly', 'Upright row'],
        'arms': ['Bicep curls', 'Tricep extensions', 'Hammer curls', 'Tricep dips', 'Close-grip press'],
        'legs': ['Squats', 'Lunges', 'Deadlifts', 'Leg press', 'Calf raises', 'Step-ups'],
        'core': ['Planks', 'Dead bugs', 'Bird dogs', 'Russian twists', 'Mountain climbers']
    };

    return (
        <div className="step-content">
            {/* Consistent Header */}
            <div className="step-header-container">
                <h1 className="step-header-title">
                    💪 Step 11: Resistance Training Block
                </h1>
                <p className="step-header-subtitle">
                    Design the resistance training component with exercise selection, sets/reps, intensity, and progression
                </p>
                <span className="step-progress">Step 11 of 17</span>
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
                <h3>💪 Resistance Training Design</h3>

                <div className="form-section">
                    <h4>🎯 Training Parameters</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">OPT Phase Focus</label>
                            <select
                                className="form-select"
                                value={resistanceData.trainingPhase}
                                onChange={(e) => handleInputChange('trainingPhase', e.target.value)}
                            >
                                <option value="">Select phase focus...</option>
                                <option value="stabilization">Phase 1: Stabilization Endurance</option>
                                <option value="strength-endurance">Phase 2: Strength Endurance</option>
                                <option value="hypertrophy">Phase 3: Muscular Development</option>
                                <option value="maximal-strength">Phase 4: Maximal Strength</option>
                                <option value="power">Phase 5: Power</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Training Frequency</label>
                            <select
                                className="form-select"
                                value={resistanceData.trainingFrequency}
                                onChange={(e) => handleInputChange('trainingFrequency', e.target.value)}
                            >
                                <option value="">Select frequency...</option>
                                <option value="2-days">2 days per week</option>
                                <option value="3-days">3 days per week</option>
                                <option value="4-days">4 days per week</option>
                                <option value="5-days">5+ days per week</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>🏋️ Exercise Selection</h4>
                    {Object.entries(exerciseCategories).map(([category, exercises]) => (
                        <div key={category} className="exercise-category">
                            <h5>{category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Exercises</h5>
                            <div className="checkbox-group">
                                {exercises.map(exercise => (
                                    <div key={exercise} className={`checkbox-item ${resistanceData.exerciseSelection.includes(exercise) ? 'checked' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={resistanceData.exerciseSelection.includes(exercise)}
                                            onChange={(e) => handleCheckboxChange('exerciseSelection', exercise, e.target.checked)}
                                        />
                                        <label>{exercise}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <h4>📊 Sets, Reps & Intensity</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Sets x Reps Scheme</label>
                            <select
                                className="form-select"
                                value={resistanceData.setRepsScheme}
                                onChange={(e) => handleInputChange('setRepsScheme', e.target.value)}
                            >
                                <option value="">Select scheme...</option>
                                <option value="1x12-20">1 set x 12-20 reps (Stabilization)</option>
                                <option value="2x12-15">2 sets x 12-15 reps (Strength Endurance)</option>
                                <option value="3x8-12">3 sets x 8-12 reps (Hypertrophy)</option>
                                <option value="3-5x1-5">3-5 sets x 1-5 reps (Max Strength)</option>
                                <option value="3-5x1-5-power">3-5 sets x 1-5 reps (Power)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Intensity Level</label>
                            <select
                                className="form-select"
                                value={resistanceData.intensityLevel}
                                onChange={(e) => handleInputChange('intensityLevel', e.target.value)}
                            >
                                <option value="">Select intensity...</option>
                                <option value="50-70">50-70% 1RM (Stabilization)</option>
                                <option value="70-80">70-80% 1RM (Strength Endurance)</option>
                                <option value="75-85">75-85% 1RM (Hypertrophy)</option>
                                <option value="85-100">85-100% 1RM (Max Strength)</option>
                                <option value="30-45">30-45% 1RM (Power)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Rest Periods</label>
                            <select
                                className="form-select"
                                value={resistanceData.restPeriods}
                                onChange={(e) => handleInputChange('restPeriods', e.target.value)}
                            >
                                <option value="">Select rest...</option>
                                <option value="0-90s">0-90 seconds (Stabilization)</option>
                                <option value="0-60s">0-60 seconds (Strength Endurance)</option>
                                <option value="0-60s-hypertrophy">0-60 seconds (Hypertrophy)</option>
                                <option value="3-5min">3-5 minutes (Max Strength)</option>
                                <option value="3-5min-power">3-5 minutes (Power)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>🛠️ Equipment Requirements</h4>
                    <div className="form-group">
                        <label className="form-label">Equipment to be Used</label>
                        <div className="checkbox-group">
                            {[
                                'Dumbbells',
                                'Barbells',
                                'Resistance bands',
                                'Cable machine',
                                'Stability ball',
                                'BOSU ball',
                                'Suspension trainer',
                                'Kettlebells',
                                'Bodyweight only',
                                'Medicine ball'
                            ].map(equipment => (
                                <div key={equipment} className={`checkbox-item ${resistanceData.equipmentUsed.includes(equipment) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={resistanceData.equipmentUsed.includes(equipment)}
                                        onChange={(e) => handleCheckboxChange('equipmentUsed', equipment, e.target.checked)}
                                    />
                                    <label>{equipment}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>📈 Progression Strategy</h4>
                    <div className="form-group">
                        <label className="form-label">Progression Plan</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Describe how to progress this client (increase weight, reps, sets, complexity, etc.)..."
                            value={resistanceData.progressionPlan}
                            onChange={(e) => handleInputChange('progressionPlan', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Special Considerations</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Note any exercise modifications, contraindications, or special attention areas..."
                            value={resistanceData.specialConsiderations}
                            onChange={(e) => handleInputChange('specialConsiderations', e.target.value)}
                        />
                    </div>
                </div>

                {resistanceData.exerciseSelection.length > 0 && (
                    <div className="training-summary">
                        <h4>📋 Resistance Training Summary</h4>
                        <div className="summary-card">
                            <div className="summary-row">
                                <span><strong>Phase:</strong> {resistanceData.trainingPhase}</span>
                                <span><strong>Frequency:</strong> {resistanceData.trainingFrequency}</span>
                            </div>
                            <div className="summary-row">
                                <span><strong>Sets x Reps:</strong> {resistanceData.setRepsScheme}</span>
                                <span><strong>Intensity:</strong> {resistanceData.intensityLevel}</span>
                            </div>
                            <div className="summary-row">
                                <span><strong>Rest:</strong> {resistanceData.restPeriods}</span>
                                <span><strong>Exercises Selected:</strong> {resistanceData.exerciseSelection.length}</span>
                            </div>
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
                    <option>Step 7: Choose Starting OPT Phase</option>
                    <option>Step 8: Corrective Warm-up Block</option>
                    <option>Step 9: Core / Balance / Plyometric Block</option>
                    <option>Step 10: SAQ (if used)</option>
                    <option selected>Step 11: Resistance Training Block</option>
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

export default NASMResistanceTrainingStep;
