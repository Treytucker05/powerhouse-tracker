import React, { useState } from 'react';
import '../../../styles/GlobalNASMStyles.css';

const NASMMonitoringStep = () => {
    const [monitoringData, setMonitoringData] = useState({
        assessmentSchedule: '',
        progressMetrics: [],
        reassessmentMethods: [],
        adaptationIndicators: [],
        clientFeedbackSystems: [],
        programAdjustmentTriggers: '',
        longTermGoals: '',
        maintenanceStrategy: '',
        referralNeeds: []
    });

    const handleInputChange = (field, value) => {
        setMonitoringData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (field, value, checked) => {
        setMonitoringData(prev => ({
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
                    📊 Step 17: Monitoring & Reassessment
                </h1>
                <p className="step-header-subtitle">
                    Establish ongoing monitoring systems, reassessment protocols, and program adaptation strategies
                </p>
                <span className="step-progress">Step 17 of 17</span>
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
                <div className="progress-pill completed">
                    <div>Programming</div>
                    <small>Steps 7-12</small>
                </div>
                <div className="progress-pill active">
                    <div>Implementation</div>
                    <small>Steps 13-17</small>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-card">
                <h3>📊 Monitoring & Reassessment Protocol</h3>

                <div className="form-section">
                    <h4>📅 Assessment Schedule</h4>
                    <div className="form-group">
                        <label className="form-label">Reassessment Frequency</label>
                        <div className="radio-group">
                            {[
                                { value: '2-weeks', label: 'Every 2 weeks (Beginner)' },
                                { value: '4-weeks', label: 'Every 4 weeks (Intermediate)' },
                                { value: '6-weeks', label: 'Every 6 weeks (Advanced)' },
                                { value: '8-weeks', label: 'Every 8 weeks (Maintenance)' }
                            ].map(option => (
                                <div key={option.value} className={`radio-item ${monitoringData.assessmentSchedule === option.value ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="assessmentSchedule"
                                        value={option.value}
                                        checked={monitoringData.assessmentSchedule === option.value}
                                        onChange={(e) => handleInputChange('assessmentSchedule', e.target.value)}
                                    />
                                    <label>{option.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>📈 Progress Tracking Metrics</h4>
                    <div className="form-group">
                        <label className="form-label">Key Performance Indicators to Monitor</label>
                        <div className="checkbox-group">
                            {[
                                'Body composition changes',
                                'Strength improvements',
                                'Cardiovascular fitness',
                                'Movement quality scores',
                                'Postural improvements',
                                'Balance and stability',
                                'Flexibility/mobility',
                                'Pain levels',
                                'Energy and sleep quality',
                                'Client adherence rates',
                                'Subjective well-being',
                                'Functional capacity'
                            ].map(metric => (
                                <div key={metric} className={`checkbox-item ${monitoringData.progressMetrics.includes(metric) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={monitoringData.progressMetrics.includes(metric)}
                                        onChange={(e) => handleCheckboxChange('progressMetrics', metric, e.target.checked)}
                                    />
                                    <label>{metric}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>🔄 Reassessment Methods</h4>
                    <div className="form-group">
                        <label className="form-label">Assessment Tools to Repeat</label>
                        <div className="checkbox-group">
                            {[
                                'Static posture assessment',
                                'Dynamic movement screens',
                                'Performance tests',
                                'Body measurements',
                                'Cardiovascular assessments',
                                'Strength testing',
                                'Flexibility assessments',
                                'Client satisfaction surveys',
                                'Goal achievement review',
                                'Program adherence analysis'
                            ].map(method => (
                                <div key={method} className={`checkbox-item ${monitoringData.reassessmentMethods.includes(method) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={monitoringData.reassessmentMethods.includes(method)}
                                        onChange={(e) => handleCheckboxChange('reassessmentMethods', method, e.target.checked)}
                                    />
                                    <label>{method}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>🎯 Adaptation Indicators</h4>
                    <div className="form-group">
                        <label className="form-label">Signs That Program Needs Adjustment</label>
                        <div className="checkbox-group">
                            {[
                                'Plateau in performance',
                                'Decreased motivation',
                                'Increased fatigue/soreness',
                                'New injuries or pain',
                                'Schedule/lifestyle changes',
                                'Goal modifications',
                                'Boredom with routine',
                                'Regression in movement quality',
                                'Lack of adherence',
                                'Client feedback requests'
                            ].map(indicator => (
                                <div key={indicator} className={`checkbox-item ${monitoringData.adaptationIndicators.includes(indicator) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={monitoringData.adaptationIndicators.includes(indicator)}
                                        onChange={(e) => handleCheckboxChange('adaptationIndicators', indicator, e.target.checked)}
                                    />
                                    <label>{indicator}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>💬 Client Feedback Systems</h4>
                    <div className="form-group">
                        <label className="form-label">Feedback Collection Methods</label>
                        <div className="checkbox-group">
                            {[
                                'Weekly check-in calls',
                                'Monthly progress meetings',
                                'Digital workout logs',
                                'Mobile app tracking',
                                'Email progress reports',
                                'In-person consultations',
                                'Satisfaction surveys',
                                'Goal review sessions'
                            ].map(system => (
                                <div key={system} className={`checkbox-item ${monitoringData.clientFeedbackSystems.includes(system) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={monitoringData.clientFeedbackSystems.includes(system)}
                                        onChange={(e) => handleCheckboxChange('clientFeedbackSystems', system, e.target.checked)}
                                    />
                                    <label>{system}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h4>🔧 Program Adjustment Strategy</h4>
                    <div className="form-group">
                        <label className="form-label">When and How to Adjust Programs</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Define specific criteria and procedures for program modifications..."
                            value={monitoringData.programAdjustmentTriggers}
                            onChange={(e) => handleInputChange('programAdjustmentTriggers', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h4>🎯 Long-term Planning</h4>
                    <div className="form-group">
                        <label className="form-label">Long-term Goal Evolution</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Describe how goals may evolve and adapt over time..."
                            value={monitoringData.longTermGoals}
                            onChange={(e) => handleInputChange('longTermGoals', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Maintenance Strategy</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Plan for maintaining results and preventing regression..."
                            value={monitoringData.maintenanceStrategy}
                            onChange={(e) => handleInputChange('maintenanceStrategy', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h4>🔗 Referral Network</h4>
                    <div className="form-group">
                        <label className="form-label">Potential Referral Needs</label>
                        <div className="checkbox-group">
                            {[
                                'Physical therapy',
                                'Sports medicine physician',
                                'Registered dietitian',
                                'Sports psychologist',
                                'Massage therapy',
                                'Chiropractor',
                                'Specialist trainer (sport-specific)',
                                'Medical clearance'
                            ].map(referral => (
                                <div key={referral} className={`checkbox-item ${monitoringData.referralNeeds.includes(referral) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={monitoringData.referralNeeds.includes(referral)}
                                        onChange={(e) => handleCheckboxChange('referralNeeds', referral, e.target.checked)}
                                    />
                                    <label>{referral}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="completion-summary">
                    <h4>✅ NASM Program Design Complete!</h4>
                    <div className="summary-card success">
                        <h5>🎉 Comprehensive Program Designed</h5>
                        <p>You have successfully completed all 17 steps of the NASM OPT program design process:</p>

                        <div className="completion-stats">
                            <div className="phase-completion">
                                <h6>Foundation Phase ✅</h6>
                                <ul>
                                    <li>Intake & readiness assessment</li>
                                    <li>Baseline vitals & measurements</li>
                                </ul>
                            </div>

                            <div className="phase-completion">
                                <h6>Assessment Phase ✅</h6>
                                <ul>
                                    <li>Static posture analysis</li>
                                    <li>Dynamic movement screens</li>
                                    <li>Compensation mapping</li>
                                    <li>Performance testing</li>
                                </ul>
                            </div>

                            <div className="phase-completion">
                                <h6>Programming Phase ✅</h6>
                                <ul>
                                    <li>OPT phase selection</li>
                                    <li>Exercise program design</li>
                                    <li>Session planning</li>
                                </ul>
                            </div>

                            <div className="phase-completion">
                                <h6>Implementation Phase ✅</h6>
                                <ul>
                                    <li>Program delivery strategy</li>
                                    <li>Monitoring & reassessment protocols</li>
                                </ul>
                            </div>
                        </div>

                        <div className="next-actions">
                            <h6>🚀 Next Steps</h6>
                            <ul>
                                <li>Begin program implementation</li>
                                <li>Schedule first reassessment</li>
                                <li>Establish client feedback systems</li>
                                <li>Monitor progress and adapt as needed</li>
                            </ul>
                        </div>
                    </div>
                </div>
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
                    <option>Step 11: Resistance Training Block</option>
                    <option>Step 12: Cardiorespiratory Plan (FITTE)</option>
                    <option>Step 13: Session Template & Weekly Split</option>
                    <option>Step 14: Monthly Progression Rules</option>
                    <option>Step 15: Annual Plan (Macrocycle)</option>
                    <option>Step 16: Special Population/Constraint Mods</option>
                    <option selected>Step 17: Monitoring & Reassessment</option>
                </select>
                <button className="nav-button disabled">Complete! 🎉</button>
            </div>
        </div>
    );
};

export default NASMMonitoringStep;
