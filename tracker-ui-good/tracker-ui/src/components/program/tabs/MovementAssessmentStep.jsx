import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

/**
 * MovementAssessmentStep - Linear Periodization Specific Assessment
 * 
 * Enhanced with Bromley Motor Control Integration:
 * - Movement quality baseline assessment
 * - Wave progression compatibility
 * - Motor control program customization
 */

const MovementAssessmentStep = () => {
    const { state, actions } = useProgramContext();
    const [assessmentData, setAssessmentData] = useState({
        movementScreen: {},
        motorControlFocus: '',
        currentCapabilities: {},
        progressionPreference: 'wave'
    });

    const movementScreenItems = [
        {
            id: 'overhead-squat',
            name: 'Overhead Squat',
            description: 'Full-body movement screen',
            areas: ['ankle-mobility', 'hip-stability', 'thoracic-mobility', 'shoulder-stability']
        },
        {
            id: 'single-leg-stance',
            name: 'Single Leg Stance',
            description: 'Balance and stability assessment',
            areas: ['balance', 'proprioception', 'unilateral-strength']
        },
        {
            id: 'push-up',
            name: 'Push-up Quality',
            description: 'Upper body movement pattern',
            areas: ['scapular-control', 'core-stability', 'movement-coordination']
        },
        {
            id: 'deep-squat',
            name: 'Deep Squat Hold',
            description: 'Lower body mobility and stability',
            areas: ['hip-mobility', 'ankle-flexibility', 'spine-position']
        }
    ];

    const motorControlFocuses = [
        {
            id: 'movement-quality',
            name: 'Movement Quality Focus',
            description: 'Emphasize perfect movement patterns with Bromley wave structure',
            bromleyIntegration: 'Quality-based wave progression'
        },
        {
            id: 'stability-strength',
            name: 'Stability & Strength',
            description: 'Build foundational strength with motor control',
            bromleyIntegration: 'Stabilization wave with strength integration'
        },
        {
            id: 'coordination-power',
            name: 'Coordination & Power',
            description: 'Advanced motor control with power development',
            bromleyIntegration: 'Motor control waves with power expression'
        }
    ];

    const handleMovementScore = (itemId, areaId, score) => {
        setAssessmentData(prev => ({
            ...prev,
            movementScreen: {
                ...prev.movementScreen,
                [itemId]: {
                    ...prev.movementScreen[itemId],
                    [areaId]: score
                }
            }
        }));
    };

    const handleSaveAndContinue = () => {
        // Save movement assessment data
        actions.updateLinearSpecificData({
            movementAssessment: assessmentData,
            bromleyIntegration: {
                movementBaselineComplete: true,
                motorControlWaveReady: true,
                qualityProgressionEnabled: true
            }
        });

        // Move to next step (Architecture Phase)
        actions.setCurrentStep(6);
    };

    return (
        <div className="movement-assessment-step">
            <div className="step-header">
                <h2>🏃 Movement Assessment - Linear Periodization</h2>
                <p className="step-description">
                    Bromley-enhanced movement quality baseline for motor control programming
                </p>
            </div>

            {/* Movement Screen Section */}
            <div className="assessment-section">
                <h3>Movement Quality Screen</h3>
                <p className="section-description">
                    Rate each movement area (1-5 scale: 1=Poor, 3=Average, 5=Excellent)
                </p>

                <div className="movement-screen-grid">
                    {movementScreenItems.map(item => (
                        <div key={item.id} className="movement-item">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>

                            <div className="movement-areas">
                                {item.areas.map(area => (
                                    <div key={area} className="area-assessment">
                                        <label>{area.replace('-', ' ')}</label>
                                        <div className="score-buttons">
                                            {[1, 2, 3, 4, 5].map(score => (
                                                <button
                                                    key={score}
                                                    className={`score-btn ${assessmentData.movementScreen[item.id]?.[area] === score ? 'active' : ''
                                                        }`}
                                                    onClick={() => handleMovementScore(item.id, area, score)}
                                                >
                                                    {score}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Motor Control Focus Selection */}
            <div className="assessment-section">
                <h3>Motor Control Programming Focus</h3>
                <p className="section-description">
                    Choose your primary motor control emphasis with Bromley wave integration
                </p>

                <div className="focus-options">
                    {motorControlFocuses.map(focus => (
                        <div
                            key={focus.id}
                            className={`focus-option ${assessmentData.motorControlFocus === focus.id ? 'selected' : ''
                                }`}
                            onClick={() => setAssessmentData(prev => ({
                                ...prev,
                                motorControlFocus: focus.id
                            }))}
                        >
                            <h4>{focus.name}</h4>
                            <p>{focus.description}</p>
                            <div className="bromley-integration">
                                🔄 Bromley: {focus.bromleyIntegration}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Capabilities */}
            <div className="assessment-section">
                <h3>Current Training Capabilities</h3>

                <div className="capabilities-grid">
                    <div className="capability-item">
                        <label>Training Experience (months)</label>
                        <input
                            type="number"
                            value={assessmentData.currentCapabilities.experience || ''}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                currentCapabilities: {
                                    ...prev.currentCapabilities,
                                    experience: e.target.value
                                }
                            }))}
                            placeholder="12"
                        />
                    </div>

                    <div className="capability-item">
                        <label>Weekly Training Frequency</label>
                        <select
                            value={assessmentData.currentCapabilities.frequency || ''}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                currentCapabilities: {
                                    ...prev.currentCapabilities,
                                    frequency: e.target.value
                                }
                            }))}
                        >
                            <option value="">Select frequency</option>
                            <option value="2">2 sessions/week</option>
                            <option value="3">3 sessions/week</option>
                            <option value="4">4 sessions/week</option>
                            <option value="5">5+ sessions/week</option>
                        </select>
                    </div>

                    <div className="capability-item">
                        <label>Recovery Capacity</label>
                        <select
                            value={assessmentData.currentCapabilities.recovery || ''}
                            onChange={(e) => setAssessmentData(prev => ({
                                ...prev,
                                currentCapabilities: {
                                    ...prev.currentCapabilities,
                                    recovery: e.target.value
                                }
                            }))}
                        >
                            <option value="">Select recovery</option>
                            <option value="low">Low (need extra recovery)</option>
                            <option value="moderate">Moderate (standard recovery)</option>
                            <option value="high">High (fast recovery)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bromley Wave Progression Preference */}
            <div className="assessment-section">
                <h3>📊 Bromley Wave Progression Style</h3>

                <div className="wave-options">
                    <div
                        className={`wave-option ${assessmentData.progressionPreference === 'wave' ? 'selected' : ''
                            }`}
                        onClick={() => setAssessmentData(prev => ({
                            ...prev,
                            progressionPreference: 'wave'
                        }))}
                    >
                        <h4>🌊 Standard Wave Progression</h4>
                        <p>Classic Bromley waves with motor control emphasis</p>
                        <div className="wave-example">Week 1: 3×12 → Week 2: 4×10 → Week 3: 5×8</div>
                    </div>

                    <div
                        className={`wave-option ${assessmentData.progressionPreference === 'linear-wave' ? 'selected' : ''
                            }`}
                        onClick={() => setAssessmentData(prev => ({
                            ...prev,
                            progressionPreference: 'linear-wave'
                        }))}
                    >
                        <h4>📈 Linear with Wave Enhancement</h4>
                        <p>Traditional linear progression enhanced with Bromley principles</p>
                        <div className="wave-example">Linear base + wave deloads and motor control focus</div>
                    </div>
                </div>
            </div>

            {/* Assessment Summary */}
            <div className="assessment-summary">
                <h3>Assessment Summary</h3>
                <div className="summary-items">
                    <div className="summary-item">
                        <strong>Movement Quality:</strong>
                        {Object.keys(assessmentData.movementScreen).length > 0 ? 'Assessed' : 'Pending'}
                    </div>
                    <div className="summary-item">
                        <strong>Motor Control Focus:</strong>
                        {assessmentData.motorControlFocus || 'Not selected'}
                    </div>
                    <div className="summary-item">
                        <strong>Wave Progression:</strong>
                        {assessmentData.progressionPreference || 'Standard wave'}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="step-navigation">
                <button
                    className="btn-secondary"
                    onClick={() => actions.setCurrentStep(5)}
                >
                    ← Back to System Selection
                </button>

                <button
                    className="btn-primary"
                    onClick={handleSaveAndContinue}
                    disabled={!assessmentData.motorControlFocus}
                >
                    Continue to Periodization →
                </button>
            </div>

            {/* Bromley Integration Status */}
            <div className="bromley-status">
                <h4>🔄 Bromley Linear Integration Status</h4>
                <div className="status-items">
                    ✅ Motor Control Wave Progression Available
                    ✅ Movement Quality Assessment Enhanced
                    ✅ Linear + Wave Periodization Ready
                    ✅ Recovery Protocol Integration
                </div>
            </div>
        </div>
    );
};

export default MovementAssessmentStep;
