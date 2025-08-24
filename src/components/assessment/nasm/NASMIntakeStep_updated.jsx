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
                <div className="progress-pill completed">
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

                {/* Training Goals Section */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Training Goals</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Primary Training Goal</label>
                            <select
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-600"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Secondary Goals (Select all that apply)</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Improved posture', 'Better flexibility', 'Stress relief', 'Better sleep', 'Increased energy', 'Improved confidence'].map(goal => (
                                    <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="accent-red-600"
                                            checked={formData.secondaryGoals.includes(goal)}
                                            onChange={(e) => handleCheckboxChange('secondaryGoals', goal, e.target.checked)}
                                        />
                                        <span className="text-sm text-gray-200">{goal}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline & Availability Section */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Timeline & Availability</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Desired Timeline</label>
                            <select
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-600"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Session Availability (days per week)</label>
                            <div className="space-y-2">
                                {[
                                    { value: '2-days', label: '2 days per week' },
                                    { value: '3-days', label: '3 days per week' },
                                    { value: '4-days', label: '4 days per week' },
                                    { value: '5-days', label: '5+ days per week' }
                                ].map(option => (
                                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sessionAvailability"
                                            value={option.value}
                                            className="accent-red-600"
                                            checked={formData.sessionAvailability === option.value}
                                            onChange={(e) => handleInputChange('sessionAvailability', e.target.value)}
                                        />
                                        <span className="text-sm text-gray-200">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Training History & Health Section */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Training History & Health</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Previous Training Experience</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-600"
                                placeholder="Describe your training background, previous programs, sports participation..."
                                rows="4"
                                value={formData.trainingHistory}
                                onChange={(e) => handleInputChange('trainingHistory', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Current Injuries or Limitations</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-600"
                                placeholder="List any current injuries, pain, or movement limitations..."
                                rows="3"
                                value={formData.injuries}
                                onChange={(e) => handleInputChange('injuries', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Current Medications</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-600"
                                placeholder="List any medications that might affect exercise (optional)..."
                                rows="3"
                                value={formData.medications}
                                onChange={(e) => handleInputChange('medications', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Equipment & Constraints Section */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Equipment & Constraints</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Available Equipment</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Home gym', 'Commercial gym', 'Dumbbells', 'Resistance bands', 'Bodyweight only', 'Cardio equipment', 'Functional trainer'].map(equipment => (
                                    <label key={equipment} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="accent-red-600"
                                            checked={formData.equipmentAccess.includes(equipment)}
                                            onChange={(e) => handleCheckboxChange('equipmentAccess', equipment, e.target.checked)}
                                        />
                                        <span className="text-sm text-gray-200">{equipment}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Preference Constraints</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-red-600"
                                placeholder="Any specific preferences, dislikes, or constraints we should consider..."
                                rows="3"
                                value={formData.constraints}
                                onChange={(e) => handleInputChange('constraints', e.target.value)}
                            />
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
                    <option>Step 17: Monitoring & Reassessment</option>
                </select>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded">Next Step →</button>
            </div>
        </div>
    );
};

export default NASMIntakeStep;
