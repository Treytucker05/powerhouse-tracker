import React from 'react';
import { useNASM } from '../../../contexts/methodology/NASMContext';
import { Activity, ArrowRight, CheckCircle, Target } from 'lucide-react';

// Import existing NASM assessment components
import NASMAssessmentDashboard from '../../assessment/nasm/NASMAssessmentDashboard';

const NASMMovementScreenIntegration = () => {
    const { state, actions } = useNASM();

    const handleAssessmentComplete = (assessmentData) => {
        // Save the movement screen data to NASM context
        actions.setMovementScreenData(assessmentData);

        // Complete the assessment phase and generate analysis
        const { analyzeCompleteNASMAssessment } = require('../../assessment/nasm/shared/nasmMuscleLookup');
        const analysis = analyzeCompleteNASMAssessment(assessmentData);

        // Extract compensation count and risk level
        const compensationCount = getCompensationCount(assessmentData);
        const riskLevel = compensationCount === 0 ? 'Low' : compensationCount <= 3 ? 'Moderate' : 'High';

        // Complete the assessment in NASM context
        actions.completeAssessment(analysis, assessmentData.compensations || [], riskLevel);

        // Move to next step (Injury Screening)
        actions.setCurrentStep(6, 'injury-screening');
    };

    const getCompensationCount = (data) => {
        if (!data) return 0;

        let total = 0;

        // Overhead Squat compensations
        if (data.overheadSquat?.frontView) {
            total += Object.values(data.overheadSquat.frontView).filter(v => v === true).length;
        }
        if (data.overheadSquat?.sideView) {
            total += Object.values(data.overheadSquat.sideView).filter(v => v === true).length;
        }

        // Single-Leg Squat compensations
        if (data.singleLegSquat?.rightLeg?.kneeValgus) total += 1;
        if (data.singleLegSquat?.leftLeg?.kneeValgus) total += 1;

        // Push/Pull compensations
        if (data.pushPull?.pushing) {
            total += Object.values(data.pushPull.pushing).reduce((acc, section) => {
                if (typeof section === 'object' && section !== null) {
                    return acc + Object.values(section).filter(v => v === true).length;
                }
                return acc;
            }, 0);
        }
        if (data.pushPull?.pulling) {
            total += Object.values(data.pushPull.pulling).reduce((acc, section) => {
                if (typeof section === 'object' && section !== null) {
                    return acc + Object.values(section).filter(v => v === true).length;
                }
                return acc;
            }, 0);
        }

        return total;
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">5</span>
                    </div>
                    <Activity className="h-8 w-8 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">NASM Movement Screen</h2>
                </div>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Comprehensive movement assessment to identify muscle imbalances and compensation patterns.
                </p>
            </div>

            {/* Context from Previous Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {state.goalFramework && (
                    <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                        <div className="text-blue-300 font-medium mb-1">Training Goal</div>
                        <div className="text-white">{state.goalFramework.name}</div>
                    </div>
                )}

                {state.assessmentData?.clientConsultation && (
                    <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                        <div className="text-green-300 font-medium mb-1">Consultation</div>
                        <div className="text-white">Completed</div>
                    </div>
                )}

                {state.assessmentData?.optQuestionnaire && (
                    <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
                        <div className="text-purple-300 font-medium mb-1">OPT Questionnaire</div>
                        <div className="text-white">Completed</div>
                    </div>
                )}
            </div>

            {/* Assessment Importance for NASM */}
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Target className="h-6 w-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-yellow-300">Why Movement Assessment Matters in NASM</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-yellow-200 font-medium mb-2">OPT Model Foundation</h4>
                        <ul className="text-yellow-100 text-sm space-y-1">
                            <li>• Identifies muscle imbalances before training</li>
                            <li>• Determines Phase 1 stabilization needs</li>
                            <li>• Guides corrective exercise selection</li>
                            <li>• Establishes movement baseline</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-yellow-200 font-medium mb-2">Program Design Impact</h4>
                        <ul className="text-yellow-100 text-sm space-y-1">
                            <li>• Determines starting OPT phase</li>
                            <li>• Identifies contraindicated exercises</li>
                            <li>• Prioritizes corrective strategies</li>
                            <li>• Guides exercise progression</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Existing NASM Assessment Integration */}
            <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="h-6 w-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Complete Movement Assessment</h3>
                </div>

                {/* Integration wrapper for existing NASM assessment */}
                <div className="methodology-assessment-wrapper">
                    <NASMAssessmentDashboard
                        onAssessmentComplete={handleAssessmentComplete}
                        showMethodologyContext={true}
                        goalContext={state.goalFramework}
                        clientContext={state.assessmentData?.clientConsultation}
                        optContext={state.assessmentData?.optQuestionnaire}
                    />
                </div>
            </div>

            {/* Assessment Progress */}
            {state.assessmentData?.movementScreen && (
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <h3 className="text-xl font-bold text-green-300">Movement Screen Complete</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-900/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                                {getCompensationCount(state.assessmentData.movementScreen)}
                            </div>
                            <div className="text-green-300 text-sm">Total Compensations</div>
                        </div>

                        <div className="bg-green-900/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                                {state.riskLevel || 'Analyzing...'}
                            </div>
                            <div className="text-green-300 text-sm">Risk Level</div>
                        </div>

                        <div className="bg-green-900/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                                {state.assessmentResults?.priority?.length || 0}
                            </div>
                            <div className="text-green-300 text-sm">Priority Areas</div>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => actions.setCurrentStep(6, 'injury-screening')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mx-auto"
                        >
                            Continue to Injury Screening
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Progress Indicator */}
            <div className="text-center text-sm text-gray-400">
                Step 5C of 8: NASM Movement Screen
            </div>
        </div>
    );
};

export default NASMMovementScreenIntegration;
