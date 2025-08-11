import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';
import '../../../styles/GlobalNASMStyles.css';

/**
 * NASMIntakeStep - Step 1: Intake & Readiness
 * 
 * Complete client consultation covering:
 * - Goals (primary/secondary)
 * - Timeline and availability
 * - Training history and experience
 * - Injuries, medications, and health status
 * - Equipment access and constraints
 * - Preferences and limitations
 */

const NASMIntakeStep = () => {
    const { state, actions } = useProgramContext();

    // Validation state
    const [errors, setErrors] = useState({});

    const [intakeData, setIntakeData] = useState({
        // Goals
        primaryGoal: '',
        secondaryGoals: [],
        specificObjectives: '',

        // Timeline & Availability
        programDuration: '',
        sessionsPerWeek: '',
        sessionLength: '',
        timeConstraints: '',

        // Training History
        trainingExperience: '',
        previousPrograms: [],
        currentActivity: '',
        fitnessLevel: '',

        // PAR-Q+ 2023 - General Health Questions (7 initial questions)
        parq: {
            q1_heart_condition: null, // Heart condition OR high blood pressure
            q2_chest_pain: null, // Chest pain at rest, daily activities, or physical activity
            q3_dizziness: null, // Lose balance due to dizziness OR lost consciousness
            q4_chronic_condition: null, // Diagnosed with chronic medical condition
            q4_conditions_listed: '', // List of conditions
            q5_medications: null, // Taking prescribed medications for chronic condition
            q5_conditions_medications: '', // List of conditions and medications
            q6_bone_joint: null, // Bone, joint, or soft tissue problem
            q6_conditions_listed: '', // List of conditions
            q7_medical_supervision: null, // Should only do medically supervised activity

            // Follow-up sections (shown if any YES answers)
            followup_needed: false,
            followup_arthritis: {},
            followup_cancer: {},
            followup_heart: {},
            followup_blood_pressure: {},
            followup_metabolic: {},
            followup_mental_health: {},
            followup_respiratory: {},
            followup_spinal_cord: {},
            followup_stroke: {},
            followup_other: {},

            // Clearance status
            clearance_status: 'pending', // 'cleared', 'needs_medical', 'conditional'
            medical_clearance_obtained: false
        },

        // Participant Declaration
        declaration: {
            participant_name: '',
            date_signed: '',
            signature: '',
            witness: '',
            parent_guardian: '' // if under 18
        },

        // Equipment & Environment
        equipmentAccess: [],
        trainingLocation: '',
        budget: '',

        // Preferences & Constraints
        exercisePreferences: [],
        exerciseDislikes: [],
        specialRequests: '',
        motivationalFactors: []
    });

    const [showFollowUp, setShowFollowUp] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    const goalOptions = [
        'Reduce body fat',
        'Increase lean body mass',
        'Improve general performance',
        'Athletic Performance',
        'Injury Prevention/Rehabilitation',
        'Postural Improvement',
        'Cardiovascular Health',
        'Functional Movement',
        'Sport-Specific Training'
    ];

    const experienceLevels = [
        'Beginning/Novice (0-6 months)',
        'Advanced (6+ months continuous training)'
    ];

    const equipmentOptions = [
        'Full Commercial Gym',
        'Home Gym (Full Equipment)',
        'Home Gym (Basic Equipment)',
        'Bodyweight Only',
        'Dumbbells',
        'Resistance Bands',
        'Kettlebells',
        'Barbells',
        'Cable Machine',
        'Cardio Equipment'
    ];

    const handleInputChange = (field, value) => {
        setIntakeData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Real-time validation
        validateField(field, value);
    };

    // Validation functions
    const validateField = (field, value) => {
        let error = '';

        switch (field) {
            case 'primaryGoal':
                if (!value.trim()) {
                    error = 'Primary goal is required';
                }
                break;
            case 'programDuration':
                if (!value.trim()) {
                    error = 'Program duration is required';
                }
                break;
            case 'sessionsPerWeek':
                if (!value.trim()) {
                    error = 'Sessions per week is required';
                }
                break;
            case 'trainingExperience':
                if (!value.trim()) {
                    error = 'Training experience is required';
                }
                break;
            case 'equipmentAccess':
                if (!Array.isArray(value) || value.length === 0) {
                    error = 'At least one equipment option is required';
                }
                break;
            default:
                break;
        }

        if (error) {
            setErrors(prev => ({
                ...prev,
                [field]: error
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!intakeData.primaryGoal.trim()) {
            newErrors.primaryGoal = 'Primary goal is required';
        }
        if (!intakeData.programDuration.trim()) {
            newErrors.programDuration = 'Program duration is required';
        }
        if (!intakeData.sessionsPerWeek.trim()) {
            newErrors.sessionsPerWeek = 'Sessions per week is required';
        }
        if (!intakeData.trainingExperience.trim()) {
            newErrors.trainingExperience = 'Training experience is required';
        }
        if (!intakeData.equipmentAccess || intakeData.equipmentAccess.length === 0) {
            newErrors.equipmentAccess = 'At least one equipment option is required';
        }

        // PAR-Q validation
        const parqAnswers = [
            intakeData.parq.q1_heart_condition,
            intakeData.parq.q2_chest_pain,
            intakeData.parq.q3_dizziness,
            intakeData.parq.q4_chronic_condition,
            intakeData.parq.q5_medications,
            intakeData.parq.q6_bone_joint,
            intakeData.parq.q7_medical_supervision
        ];

        if (parqAnswers.some(answer => answer === null)) {
            newErrors.parq = 'Please complete all PAR-Q+ health screening questions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePARQChange = (question, value) => {
        const newIntakeData = {
            ...intakeData,
            parq: {
                ...intakeData.parq,
                [question]: value
            }
        };
        setIntakeData(newIntakeData);

        // Check if follow-up is needed after state update
        setTimeout(() => {
            const parqAnswers = [
                newIntakeData.parq.q1_heart_condition,
                newIntakeData.parq.q2_chest_pain,
                newIntakeData.parq.q3_dizziness,
                newIntakeData.parq.q4_chronic_condition,
                newIntakeData.parq.q5_medications,
                newIntakeData.parq.q6_bone_joint,
                newIntakeData.parq.q7_medical_supervision
            ];

            const hasYesAnswer = parqAnswers.some(answer => answer === 'yes');

            setIntakeData(prev => ({
                ...prev,
                parq: {
                    ...prev.parq,
                    followup_needed: hasYesAnswer,
                    clearance_status: hasYesAnswer ? 'needs_medical' : 'cleared'
                }
            }));

            setShowFollowUp(hasYesAnswer);
        }, 0);
    };

    const handlePARQTextChange = (field, value) => {
        setIntakeData(prev => ({
            ...prev,
            parq: {
                ...prev.parq,
                [field]: value
            }
        }));
    };

    const handleDeclarationChange = (field, value) => {
        setIntakeData(prev => ({
            ...prev,
            declaration: {
                ...prev.declaration,
                [field]: value
            }
        }));
    };

    const handlePARQFollowupChange = (section, question, value) => {
        setIntakeData(prev => ({
            ...prev,
            parq: {
                ...prev.parq,
                [`followup_${section}`]: {
                    ...prev.parq[`followup_${section}`],
                    [question]: value
                }
            }
        }));
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleArrayToggle = (field, item) => {
        setIntakeData(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter(i => i !== item)
                : [...prev[field], item]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Validate PAR-Q+ completion
        if (!isPARQComplete()) {
            setErrors(prev => ({
                ...prev,
                parq: 'Please complete the PAR-Q+ health screening questions before continuing.'
            }));
            return;
        }

        // Check clearance status
        const clearanceStatus = determinePARQClearanceStatus();
        if (clearanceStatus === 'needs_medical' && !intakeData.parq.medical_clearance_obtained) {
            setErrors(prev => ({
                ...prev,
                medical_clearance: 'Medical clearance is required before proceeding. Please obtain clearance from your physician or check the medical clearance box if already obtained.'
            }));
            return;
        }

        // Calculate goal hierarchy and risk assessment
        const goalHierarchy = {
            primary: intakeData.primaryGoal,
            secondary: intakeData.secondaryGoals,
            timeline: intakeData.programDuration
        };

        const constraints = {
            time: intakeData.timeConstraints,
            equipment: intakeData.equipmentAccess,
            parq_clearance: clearanceStatus,
            preferences: {
                likes: intakeData.exercisePreferences,
                dislikes: intakeData.exerciseDislikes
            }
        };

        const baselineSchedule = {
            frequency: intakeData.sessionsPerWeek,
            duration: intakeData.sessionLength,
            location: intakeData.trainingLocation
        };

        // Save intake results
        actions.setAssessmentData({
            step: 1,
            intakeData,
            goalHierarchy,
            constraints,
            clearanceStatus,
            baselineSchedule,
            timestamp: new Date().toISOString()
        });

        // Move to next step
        actions.setCurrentStep(2);
    };

    const isPARQComplete = () => {
        const requiredAnswers = [
            intakeData.parq.q1_heart_condition,
            intakeData.parq.q2_chest_pain,
            intakeData.parq.q3_dizziness,
            intakeData.parq.q4_chronic_condition,
            intakeData.parq.q5_medications,
            intakeData.parq.q6_bone_joint,
            intakeData.parq.q7_medical_supervision
        ];

        return requiredAnswers.every(answer => answer !== null);
    };

    const determinePARQClearanceStatus = () => {
        const parqAnswers = [
            intakeData.parq.q1_heart_condition,
            intakeData.parq.q2_chest_pain,
            intakeData.parq.q3_dizziness,
            intakeData.parq.q4_chronic_condition,
            intakeData.parq.q5_medications,
            intakeData.parq.q6_bone_joint,
            intakeData.parq.q7_medical_supervision
        ];

        const hasYesAnswer = parqAnswers.some(answer => answer === 'yes');

        if (!hasYesAnswer) {
            return 'cleared';
        } else {
            return 'needs_medical';
        }
    };

    const isFormComplete = () => {
        const basicInfoComplete = intakeData.primaryGoal &&
            intakeData.programDuration &&
            intakeData.sessionsPerWeek &&
            intakeData.trainingExperience &&
            intakeData.equipmentAccess.length > 0;

        const parqComplete = isPARQComplete();
        const declarationComplete = intakeData.declaration.participant_name &&
            intakeData.declaration.date_signed;

        return basicInfoComplete && parqComplete && declarationComplete;
    };

    return (
        <div className="step-content" style={{ fontFamily: "'Roboto', sans-serif" }}>
            <div className="step-header-container">
                <h1 className="text-3xl font-bold text-white !important" style={{ fontFamily: "'Roboto', sans-serif" }}>Step 1: Intake & Readiness</h1>
                <p className="text-lg text-gray-300 !important" style={{ fontFamily: "'Roboto', sans-serif" }}>Complete client consultation to establish training foundation</p>
                <span className="step-progress">Step 1 of 17</span>
            </div>

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

            <div className="content-wrapper">
                {/* Goals Section */}
                <div className="content-card">
                    <h3 className="text-xl font-bold text-white !important mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>Training Goals & Objectives</h3>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Primary Goal *</label>
                        <select
                            value={intakeData.primaryGoal}
                            onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                            required
                            className={`w-full border rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.primaryGoal ? 'border-red-500' : 'border-gray-600'
                                }`}
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                            <option value="">Select Primary Goal</option>
                            {goalOptions.map(goal => (
                                <option key={goal} value={goal}>{goal}</option>
                            ))}
                        </select>
                        {errors.primaryGoal && (
                            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                {errors.primaryGoal}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Secondary Goals (Select all that apply)</label>
                        <div className="checkbox-group space-y-2">
                            {goalOptions.filter(g => g !== intakeData.primaryGoal).map(goal => (
                                <label key={goal} className="flex items-center space-x-2 font-medium text-white !important cursor-pointer" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                    <input
                                        type="checkbox"
                                        checked={intakeData.secondaryGoals.includes(goal)}
                                        onChange={() => handleArrayToggle('secondaryGoals', goal)}
                                        className="accent-red-600 h-4 w-4 rounded border-gray-600 bg-gray-800 text-red-600 focus:ring-red-500"
                                    />
                                    <span>{goal}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Specific Objectives</label>
                        <textarea
                            value={intakeData.specificObjectives}
                            onChange={(e) => handleInputChange('specificObjectives', e.target.value)}
                            placeholder="Describe specific, measurable objectives..."
                            rows="3"
                            className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors placeholder-gray-400"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                    </div>
                </div>

                {/* Timeline & Availability */}
                <div className="content-card">
                    <h3 className="text-xl font-bold text-white !important mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>Timeline & Availability</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Program Duration *</label>
                            <select
                                value={intakeData.programDuration}
                                onChange={(e) => handleInputChange('programDuration', e.target.value)}
                                required
                                className={`w-full border rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.programDuration ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                                <option value="">Select Duration</option>
                                <option value="4-weeks">4 Weeks</option>
                                <option value="8-weeks">8 Weeks</option>
                                <option value="12-weeks">12 Weeks</option>
                                <option value="16-weeks">16 Weeks</option>
                                <option value="6-months">6 Months</option>
                                <option value="1-year">1 Year</option>
                                <option value="ongoing">Ongoing</option>
                            </select>
                            {errors.programDuration && (
                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                    {errors.programDuration}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Sessions Per Week *</label>
                            <select
                                value={intakeData.sessionsPerWeek}
                                onChange={(e) => handleInputChange('sessionsPerWeek', e.target.value)}
                                required
                                className={`w-full border rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.sessionsPerWeek ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                                <option value="">Select Frequency</option>
                                <option value="2">2 Sessions</option>
                                <option value="3">3 Sessions</option>
                                <option value="4">4 Sessions</option>
                                <option value="5">5 Sessions</option>
                                <option value="6">6 Sessions</option>
                            </select>
                            {errors.sessionsPerWeek && (
                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                    {errors.sessionsPerWeek}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Session Length</label>
                        <select
                            value={intakeData.sessionLength}
                            onChange={(e) => handleInputChange('sessionLength', e.target.value)}
                            className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                            <option value="">Select Length</option>
                            <option value="30-min">30 Minutes</option>
                            <option value="45-min">45 Minutes</option>
                            <option value="60-min">60 Minutes</option>
                            <option value="75-min">75 Minutes</option>
                            <option value="90-min">90 Minutes</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Time Constraints</label>
                        <textarea
                            value={intakeData.timeConstraints}
                            onChange={(e) => handleInputChange('timeConstraints', e.target.value)}
                            placeholder="Any scheduling limitations, busy periods, travel, etc..."
                            rows="2"
                            className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors placeholder-gray-400"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                    </div>
                </div>

                {/* Training History */}
                <div className="content-card">
                    <h3 className="text-xl font-bold text-white !important mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>Training History & Experience</h3>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Training Experience Level *</label>
                        <select
                            value={intakeData.trainingExperience}
                            onChange={(e) => handleInputChange('trainingExperience', e.target.value)}
                            required
                            className={`w-full border rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.trainingExperience ? 'border-red-500' : 'border-gray-600'
                                }`}
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                            <option value="">Select Experience</option>
                            {experienceLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        {errors.trainingExperience && (
                            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                {errors.trainingExperience}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Current Physical Activity</label>
                        <textarea
                            value={intakeData.currentActivity}
                            onChange={(e) => handleInputChange('currentActivity', e.target.value)}
                            placeholder="Describe current exercise routine, sports, daily activities..."
                            rows="3"
                            className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors placeholder-gray-400"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                    </div>
                </div>

                {/* PAR-Q+ 2023 Health Screening */}
                <div className="content-card">
                    <h3 className="text-xl font-bold text-white !important mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>PAR-Q+ 2023 - Physical Activity Readiness Questionnaire</h3>
                    <p className="text-base leading-6 text-gray-300 !important mb-6" style={{ fontFamily: "'Roboto', sans-serif" }}>
                        The health benefits of regular physical activity are clear; however, more vigorous activity increases the risk of adverse events. This questionnaire will tell you whether it is necessary for you to seek further advice from your doctor OR a qualified exercise professional before becoming more physically active.
                    </p>

                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white !important" style={{ fontFamily: "'Roboto', sans-serif" }}>GENERAL HEALTH QUESTIONS</h4>
                        <p className="text-sm text-gray-300 !important mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>Please read the 7 questions below carefully and answer each one honestly: check YES or NO.</p>

                        {/* Question 1 */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                            <label className="block text-white !important font-medium mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                1. Has your doctor ever said that you have a heart condition OR high blood pressure?
                            </label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q1"
                                        value="yes"
                                        checked={intakeData.parq.q1_heart_condition === 'yes'}
                                        onChange={(e) => handlePARQChange('q1_heart_condition', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>YES</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q1"
                                        value="no"
                                        checked={intakeData.parq.q1_heart_condition === 'no'}
                                        onChange={(e) => handlePARQChange('q1_heart_condition', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>NO</span>
                                </label>
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                            <label className="block text-white !important font-medium mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                2. Do you feel pain in your chest at rest, during your daily activities of living, OR when you do physical activity?
                            </label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q2"
                                        value="yes"
                                        checked={intakeData.parq.q2_chest_pain === 'yes'}
                                        onChange={(e) => handlePARQChange('q2_chest_pain', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>YES</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q2"
                                        value="no"
                                        checked={intakeData.parq.q2_chest_pain === 'no'}
                                        onChange={(e) => handlePARQChange('q2_chest_pain', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>NO</span>
                                </label>
                            </div>
                        </div>

                        {/* Question 3 */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                            <label className="block text-white !important font-medium mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                3. Do you lose balance because of dizziness OR have you lost consciousness in the last 12 months?
                            </label>
                            <p className="text-sm text-gray-400 !important mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>(Note: if dizziness was associated with over-breathing including during vigorous exercise, answer NO)</p>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q3"
                                        value="yes"
                                        checked={intakeData.parq.q3_dizziness === 'yes'}
                                        onChange={(e) => handlePARQChange('q3_dizziness', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>YES</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q3"
                                        value="no"
                                        checked={intakeData.parq.q3_dizziness === 'no'}
                                        onChange={(e) => handlePARQChange('q3_dizziness', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>NO</span>
                                </label>
                            </div>
                        </div>

                        {/* Question 4 */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                            <label className="block text-white !important font-medium mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                4. Have you ever been diagnosed with another chronic medical condition (other than heart disease or high blood pressure)?
                            </label>
                            <div className="flex space-x-6 mb-3">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q4"
                                        value="yes"
                                        checked={intakeData.parq.q4_chronic_condition === 'yes'}
                                        onChange={(e) => handlePARQChange('q4_chronic_condition', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>YES</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q4"
                                        value="no"
                                        checked={intakeData.parq.q4_chronic_condition === 'no'}
                                        onChange={(e) => handlePARQChange('q4_chronic_condition', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>NO</span>
                                </label>
                            </div>
                            {intakeData.parq.q4_chronic_condition === 'yes' && (
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-red-400 !important mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>PLEASE LIST CONDITION(S) HERE:</label>
                                    <textarea
                                        value={intakeData.parq.q4_conditions_listed}
                                        onChange={(e) => handlePARQTextChange('q4_conditions_listed', e.target.value)}
                                        placeholder="List your chronic medical conditions..."
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white !important focus:ring-red-500 focus:border-red-500"
                                        style={{ fontFamily: "'Roboto', sans-serif" }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Question 5 */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                            <label className="block text-white !important font-medium mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                5. Are you currently taking prescribed medications for a chronic medical condition?
                            </label>
                            <div className="flex space-x-6 mb-3">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q5"
                                        value="yes"
                                        checked={intakeData.parq.q5_medications === 'yes'}
                                        onChange={(e) => handlePARQChange('q5_medications', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>YES</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q5"
                                        value="no"
                                        checked={intakeData.parq.q5_medications === 'no'}
                                        onChange={(e) => handlePARQChange('q5_medications', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>NO</span>
                                </label>
                            </div>
                            {intakeData.parq.q5_medications === 'yes' && (
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-red-400 !important mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>PLEASE LIST CONDITION(S) AND MEDICATIONS HERE:</label>
                                    <textarea
                                        value={intakeData.parq.q5_conditions_medications}
                                        onChange={(e) => handlePARQTextChange('q5_conditions_medications', e.target.value)}
                                        placeholder="List conditions and medications..."
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white !important focus:ring-red-500 focus:border-red-500"
                                        style={{ fontFamily: "'Roboto', sans-serif" }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Question 6 */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                            <label className="block text-white !important font-medium mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                6. Do you currently have (or have had within the past 12 months) a bone, joint, or soft tissue problem that could be made worse by becoming more physically active?
                            </label>
                            <p className="text-sm text-gray-400 !important mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>(Note: does not limit current ability to be physically active)</p>
                            <div className="flex space-x-6 mb-3">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q6"
                                        value="yes"
                                        checked={intakeData.parq.q6_bone_joint === 'yes'}
                                        onChange={(e) => handlePARQChange('q6_bone_joint', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>YES</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q6"
                                        value="no"
                                        checked={intakeData.parq.q6_bone_joint === 'no'}
                                        onChange={(e) => handlePARQChange('q6_bone_joint', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>NO</span>
                                </label>
                            </div>
                            {intakeData.parq.q6_bone_joint === 'yes' && (
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-red-400 !important mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>PLEASE LIST CONDITION(S) HERE:</label>
                                    <textarea
                                        value={intakeData.parq.q6_conditions_listed}
                                        onChange={(e) => handlePARQTextChange('q6_conditions_listed', e.target.value)}
                                        placeholder="List bone, joint, or soft tissue problems..."
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white !important focus:ring-red-500 focus:border-red-500"
                                        style={{ fontFamily: "'Roboto', sans-serif" }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Question 7 */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                            <label className="block text-white !important font-medium mb-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                7. Has your doctor ever said that you should only do medically supervised physical activity?
                            </label>
                            <div className="flex space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q7"
                                        value="yes"
                                        checked={intakeData.parq.q7_medical_supervision === 'yes'}
                                        onChange={(e) => handlePARQChange('q7_medical_supervision', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>YES</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q7"
                                        value="no"
                                        checked={intakeData.parq.q7_medical_supervision === 'no'}
                                        onChange={(e) => handlePARQChange('q7_medical_supervision', e.target.value)}
                                        className="accent-red-600 h-4 w-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-white !important font-medium" style={{ fontFamily: "'Roboto', sans-serif" }}>NO</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* PAR-Q+ Results */}
                    {isPARQComplete() && (
                        <div className="parq-results">
                            {determinePARQClearanceStatus() === 'cleared' ? (
                                <div className="clearance-box cleared">
                                    <h4>✅ You are cleared for physical activity</h4>
                                    <p>All of your answers were NO. You can proceed with the program design.</p>
                                </div>
                            ) : (
                                <div className="clearance-box needs-clearance">
                                    <h4>⚠️ COMPLETE PAGES 2 AND 3</h4>
                                    <p>You answered YES to one or more questions. You should seek further information before becoming more physically active.</p>
                                    <p><strong>Complete the ePARmed-X+ at www.eparmedx.com</strong></p>

                                    <div className="medical-clearance-option">
                                        <label className="medical-clearance-label">
                                            <input
                                                type="checkbox"
                                                checked={intakeData.parq.medical_clearance_obtained}
                                                onChange={(e) => handlePARQChange('medical_clearance_obtained', e.target.checked)}
                                            />
                                            I have obtained medical clearance from my physician to participate in physical activity
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Follow-up sections - Complete PAR-Q+ Pages 2 & 3 */}
                    {showFollowUp && (
                        <div className="parq-followup-sections">
                            <h4>FOLLOW-UP QUESTIONNAIRE SECTIONS</h4>
                            <p className="followup-note">
                                You answered YES to one or more questions. Complete the relevant sections below based on your conditions.
                            </p>

                            {/* Arthritis, Osteoporosis, or Back Problems */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('arthritis')}>
                                    <h5>Arthritis, Osteoporosis, or Back Problems</h5>
                                    <span className="toggle-icon">{expandedSections.arthritis ? '−' : '+'}</span>
                                </div>
                                {expandedSections.arthritis && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Do you have difficulty controlling your condition with medications or other physician-prescribed therapies?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input
                                                        type="radio"
                                                        name="arthritis_control"
                                                        value="yes"
                                                        onChange={(e) => handlePARQFollowupChange('arthritis', 'control', e.target.value)}
                                                    />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input
                                                        type="radio"
                                                        name="arthritis_control"
                                                        value="no"
                                                        onChange={(e) => handlePARQFollowupChange('arthritis', 'control', e.target.value)}
                                                    />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you have joint problems causing pain, a recent fracture or fracture still healing, or a recent joint injury?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="arthritis_joint" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="arthritis_joint" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cancer of any kind */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('cancer')}>
                                    <h5>Cancer of any kind</h5>
                                    <span className="toggle-icon">{expandedSections.cancer ? '−' : '+'}</span>
                                </div>
                                {expandedSections.cancer && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Does your cancer diagnosis include any of the following types: lung/bronchogenic, multiple myeloma, head/neck?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="cancer_type" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="cancer_type" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Are you currently receiving cancer therapy (such as radiation or chemotherapy)?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="cancer_therapy" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="cancer_therapy" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Heart or Cardiovascular Condition */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('heart')}>
                                    <h5>Heart or Cardiovascular Condition</h5>
                                    <span className="toggle-icon">{expandedSections.heart ? '−' : '+'}</span>
                                </div>
                                {expandedSections.heart && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Do you have difficulty controlling your condition with medications or other physician-prescribed therapies?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="heart_control" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="heart_control" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you have an irregular heart beat that requires medical management?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="heart_irregular" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="heart_irregular" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you have chronic heart failure?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="heart_failure" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="heart_failure" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* High Blood Pressure */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('blood_pressure')}>
                                    <h5>High Blood Pressure</h5>
                                    <span className="toggle-icon">{expandedSections.blood_pressure ? '−' : '+'}</span>
                                </div>
                                {expandedSections.blood_pressure && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Do you have difficulty controlling your condition with medications or other physician-prescribed therapies?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="bp_control" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="bp_control" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you have a resting blood pressure equal to or greater than 160/90 mmHg with or without medication?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="bp_elevated" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="bp_elevated" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Metabolic Conditions */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('metabolic')}>
                                    <h5>Metabolic Conditions (Diabetes types)</h5>
                                    <span className="toggle-icon">{expandedSections.metabolic ? '−' : '+'}</span>
                                </div>
                                {expandedSections.metabolic && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Do you often have difficulty controlling your blood sugar levels with foods, medications, or other physician-prescribed therapies?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="diabetes_control" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="diabetes_control" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you often suffer from signs and symptoms of low blood sugar (hypoglycemia) following exercise and/or during activities of daily living?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="diabetes_hypoglycemia" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="diabetes_hypoglycemia" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mental Health Problems or Learning Difficulties */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('mental_health')}>
                                    <h5>Mental Health Problems or Learning Difficulties</h5>
                                    <span className="toggle-icon">{expandedSections.mental_health ? '−' : '+'}</span>
                                </div>
                                {expandedSections.mental_health && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Do you have difficulty controlling your condition with medications or other physician-prescribed therapies?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="mental_control" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="mental_control" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you have Down Syndrome AND back problems affecting nerves or muscles?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="mental_downs" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="mental_downs" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Respiratory Disease */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('respiratory')}>
                                    <h5>Respiratory Disease</h5>
                                    <span className="toggle-icon">{expandedSections.respiratory ? '−' : '+'}</span>
                                </div>
                                {expandedSections.respiratory && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Do you have difficulty controlling your condition with medications or other physician-prescribed therapies?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="respiratory_control" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="respiratory_control" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Has your doctor ever said your blood oxygen level is low at rest or during exercise and/or that you require supplemental oxygen therapy?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="respiratory_oxygen" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="respiratory_oxygen" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Spinal Cord Injury */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('spinal_cord')}>
                                    <h5>Spinal Cord Injury</h5>
                                    <span className="toggle-icon">{expandedSections.spinal_cord ? '−' : '+'}</span>
                                </div>
                                {expandedSections.spinal_cord && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Do you have difficulty controlling your condition with medications or other physician-prescribed therapies?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="spinal_control" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="spinal_control" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you commonly exhibit low resting blood pressure significant enough to cause dizziness, light-headedness, and/or fainting?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="spinal_hypotension" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="spinal_hypotension" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stroke */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('stroke')}>
                                    <h5>Stroke</h5>
                                    <span className="toggle-icon">{expandedSections.stroke ? '−' : '+'}</span>
                                </div>
                                {expandedSections.stroke && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Do you have difficulty controlling your condition with medications or other physician-prescribed therapies?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="stroke_control" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="stroke_control" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you have any impairment in walking or mobility?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="stroke_mobility" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="stroke_mobility" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Any other medical condition */}
                            <div className="followup-section">
                                <div className="followup-header" onClick={() => toggleSection('other')}>
                                    <h5>Any other medical condition</h5>
                                    <span className="toggle-icon">{expandedSections.other ? '−' : '+'}</span>
                                </div>
                                {expandedSections.other && (
                                    <div className="followup-content">
                                        <div className="followup-question">
                                            <label>Have you had a blackout, fainted, or lost consciousness as a result of a head injury within the last 12 months OR have you had a diagnosed concussion within the last 12 months?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="other_concussion" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="other_concussion" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                        <div className="followup-question">
                                            <label>Do you have a medical condition that is not listed (such as epilepsy, neurological conditions, kidney problems)?</label>
                                            <div className="parq-answers">
                                                <label className="parq-answer">
                                                    <input type="radio" name="other_unlisted" value="yes" />
                                                    YES
                                                </label>
                                                <label className="parq-answer">
                                                    <input type="radio" name="other_unlisted" value="no" />
                                                    NO
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Final medical clearance recommendation */}
                            <div className="final-recommendation">
                                <div className="recommendation-box needs-medical">
                                    <h4>⚠️ RECOMMENDATION</h4>
                                    <p>You should seek further information before becoming more physically active. Complete the <strong>ePARmed-X+</strong> at <a href="http://www.eparmedx.com" target="_blank" rel="noopener noreferrer">www.eparmedx.com</a></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Participant Declaration */}
                <div className="content-card">
                    <h3>Participant Declaration</h3>
                    <p className="declaration-text">
                        I acknowledge that I have read and completed this questionnaire. Any false or incomplete information may affect my ability to participate safely in physical activity.
                    </p>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Participant Name *</label>
                            <input
                                type="text"
                                value={intakeData.declaration.participant_name}
                                onChange={(e) => handleDeclarationChange('participant_name', e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Date *</label>
                            <input
                                type="date"
                                value={intakeData.declaration.date_signed}
                                onChange={(e) => handleDeclarationChange('date_signed', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Signature (Type your name)</label>
                            <input
                                type="text"
                                value={intakeData.declaration.signature}
                                onChange={(e) => handleDeclarationChange('signature', e.target.value)}
                                placeholder="Type your name as signature"
                            />
                        </div>

                        <div className="form-group">
                            <label>Witness (if applicable)</label>
                            <input
                                type="text"
                                value={intakeData.declaration.witness}
                                onChange={(e) => handleDeclarationChange('witness', e.target.value)}
                                placeholder="Witness name (if required)"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Parent/Guardian Signature (if under 18)</label>
                        <input
                            type="text"
                            value={intakeData.declaration.parent_guardian}
                            onChange={(e) => handleDeclarationChange('parent_guardian', e.target.value)}
                            placeholder="Parent/Guardian signature (if applicable)"
                        />
                    </div>
                </div>

                {/* Equipment & Environment */}
                <div className="content-card">
                    <h3 className="text-xl font-bold text-white !important mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>Equipment & Training Environment</h3>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-3 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Equipment Access * (Select all available)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {equipmentOptions.map(equipment => (
                                <label key={equipment} className="flex items-center space-x-2 font-medium text-white !important cursor-pointer p-2 hover:bg-gray-800 rounded" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                    <input
                                        type="checkbox"
                                        checked={intakeData.equipmentAccess.includes(equipment)}
                                        onChange={() => handleArrayToggle('equipmentAccess', equipment)}
                                        className="accent-red-600 h-4 w-4 rounded border-gray-600 bg-gray-800 text-red-600 focus:ring-red-500"
                                    />
                                    <span>{equipment}</span>
                                </label>
                            ))}
                        </div>
                        {errors.equipmentAccess && (
                            <p className="text-red-500 text-sm mt-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                {errors.equipmentAccess}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="font-medium text-white !important mb-2 block" style={{ fontFamily: "'Roboto', sans-serif" }}>Primary Training Location</label>
                        <select
                            value={intakeData.trainingLocation}
                            onChange={(e) => handleInputChange('trainingLocation', e.target.value)}
                            className="w-full border border-gray-600 rounded-md p-2 bg-gray-800 text-white !important text-base leading-6 focus:ring-red-500 focus:border-red-500 transition-colors"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                            <option value="">Select Location</option>
                            <option value="commercial-gym">Commercial Gym</option>
                            <option value="home-gym">Home Gym</option>
                            <option value="outdoor">Outdoor</option>
                            <option value="mixed">Mixed/Various</option>
                        </select>
                    </div>
                </div>

                {/* Form-wide Error Display */}
                {(errors.parq || errors.medical_clearance) && (
                    <div className="bg-red-900 border border-red-600 rounded-lg p-4 mb-6">
                        {errors.parq && (
                            <p className="text-red-200 text-sm mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                {errors.parq}
                            </p>
                        )}
                        {errors.medical_clearance && (
                            <p className="text-red-200 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                {errors.medical_clearance}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-center mt-8">
                <form onSubmit={handleSubmit}>
                    <button
                        type="submit"
                        className={`px-8 py-3 rounded-lg font-medium text-base transition-colors ${!isFormComplete() || (determinePARQClearanceStatus() === 'needs_medical' && !intakeData.parq.medical_clearance_obtained)
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white !important'
                            }`}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                        disabled={!isFormComplete() || (determinePARQClearanceStatus() === 'needs_medical' && !intakeData.parq.medical_clearance_obtained)}
                    >
                        {!isFormComplete()
                            ? 'Complete Required Fields'
                            : determinePARQClearanceStatus() === 'needs_medical' && !intakeData.parq.medical_clearance_obtained
                                ? 'Medical Clearance Required'
                                : 'Complete Intake → Step 2: Vitals & Body Measures'
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NASMIntakeStep;
