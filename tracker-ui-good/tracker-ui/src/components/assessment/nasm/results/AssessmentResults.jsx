import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Target, FileText, ArrowRight } from 'lucide-react';
import { analyzeCompleteNASMAssessment } from '../shared/nasmMuscleLookup';

const AssessmentResults = ({ data, assessmentData, onSaveAssessment }) => {
    // Use data prop if available, fallback to assessmentData for backward compatibility
    const currentData = data || assessmentData;

    // Safety check: ensure assessment data exists
    if (!currentData) {
        return (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <span className="text-yellow-300">No assessment data available</span>
                </div>
            </div>
        );
    }

    // Generate comprehensive NASM analysis using our lookup functions
    const analysis = analyzeCompleteNASMAssessment(currentData);

    const getCompensationCount = () => {
        if (!currentData) return 0;

        let total = 0;

        // Overhead Squat compensations
        if (currentData.overheadSquat?.frontView) {
            total += Object.values(currentData.overheadSquat.frontView).filter(v => v === true).length;
        }
        if (currentData.overheadSquat?.sideView) {
            total += Object.values(currentData.overheadSquat.sideView).filter(v => v === true).length;
        }

        // Single-Leg Squat compensations
        if (currentData.singleLegSquat?.rightLeg?.kneeValgus) total += 1;
        if (currentData.singleLegSquat?.leftLeg?.kneeValgus) total += 1;

        // NEW: Enhanced single-leg squat compensation counting
        if (currentData.singleLegSquat?.rightLeg?.hipHike) total += 1;
        if (currentData.singleLegSquat?.leftLeg?.hipHike) total += 1;
        if (currentData.singleLegSquat?.rightLeg?.hipDrop) total += 1;
        if (currentData.singleLegSquat?.leftLeg?.hipDrop) total += 1;

        // Push/Pull compensations
        if (currentData.pushPull?.pushing) {
            total += Object.values(currentData.pushPull.pushing).reduce((acc, section) => {
                if (typeof section === 'object' && section !== null) {
                    return acc + Object.values(section).filter(v => v === true).length;
                }
                return acc;
            }, 0);

            // NEW: Enhanced pushing compensation counting
            if (currentData.pushPull.pushing.shoulders?.scapularWinging) total += 1;
        }
        if (currentData.pushPull?.pulling) {
            total += Object.values(currentData.pushPull.pulling).reduce((acc, section) => {
                if (typeof section === 'object' && section !== null) {
                    return acc + Object.values(section).filter(v => v === true).length;
                }
                return acc;
            }, 0);
        }

        return total;
    };

    const compensationCount = getCompensationCount();
    const riskLevel = compensationCount === 0 ? 'Low' : compensationCount <= 3 ? 'Moderate' : 'High';
    const riskColor = riskLevel === 'Low' ? 'text-green-400' : riskLevel === 'Moderate' ? 'text-yellow-400' : 'text-red-400';

    const handleSaveAssessment = () => {
        const assessmentResults = {
            timestamp: new Date().toISOString(),
            compensationCount,
            riskLevel,
            analysis,
            rawData: currentData
        };
        onSaveAssessment(assessmentResults);
    };

    return (
        <div className="space-y-6">
            {/* Overall Assessment Summary */}
            <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Target className="h-6 w-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">NASM Movement Assessment Results</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white mb-1">{compensationCount}</div>
                        <div className="text-gray-300 text-sm">Total Compensations</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className={`text-2xl font-bold mb-1 ${riskColor}`}>{riskLevel}</div>
                        <div className="text-gray-300 text-sm">Risk Level</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">{analysis.priority.length}</div>
                        <div className="text-gray-300 text-sm">Priority Areas</div>
                    </div>
                </div>

                {riskLevel !== 'Low' && (
                    <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            <span className="font-semibold text-yellow-300">Assessment Recommendations</span>
                        </div>
                        <p className="text-yellow-200 text-sm">
                            {riskLevel === 'High'
                                ? 'Multiple movement compensations detected. Consider addressing muscle imbalances before progressing to higher intensity training.'
                                : 'Some movement compensations present. Focus on corrective exercises during warm-up and flexibility training.'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Detailed Analysis by Body Region */}
            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    Muscle Imbalance Analysis
                </h4>

                {/* Overactive Muscles */}
                {analysis.overactive.length > 0 && (
                    <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                        <h5 className="font-semibold text-red-300 mb-3">Overactive Muscles (Need Inhibition/Lengthening)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {analysis.overactive.map((muscle, index) => (
                                <div key={index} className="bg-red-900/30 rounded p-3">
                                    <div className="font-medium text-red-200">{muscle.muscle}</div>
                                    <div className="text-red-300 text-sm mt-1">{muscle.reason}</div>
                                    <div className="text-red-400 text-xs mt-2">
                                        <span className="font-medium">Corrective Focus:</span> Foam rolling, static stretching
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Underactive Muscles */}
                {analysis.underactive.length > 0 && (
                    <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-300 mb-3">Underactive Muscles (Need Activation/Strengthening)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {analysis.underactive.map((muscle, index) => (
                                <div key={index} className="bg-blue-900/30 rounded p-3">
                                    <div className="font-medium text-blue-200">{muscle.muscle}</div>
                                    <div className="text-blue-300 text-sm mt-1">{muscle.reason}</div>
                                    <div className="text-blue-400 text-xs mt-2">
                                        <span className="font-medium">Corrective Focus:</span> Activation exercises, strengthening
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Priority Recommendations */}
                {analysis.priority.length > 0 && (
                    <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-300 mb-3">Priority Corrective Areas</h5>
                        <div className="space-y-3">
                            {analysis.priority.map((item, index) => (
                                <div key={index} className="bg-yellow-900/30 rounded p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-4 w-4 text-yellow-400" />
                                        <span className="font-medium text-yellow-200">{item.area}</span>
                                    </div>
                                    <div className="text-yellow-300 text-sm mb-2">{item.issue}</div>
                                    <div className="text-yellow-400 text-xs">
                                        <span className="font-medium">Action:</span> {item.action}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Assessment Breakdown */}
            <div className="bg-gray-700 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-white mb-4">Assessment Breakdown</h4>

                <div className="space-y-4">
                    {/* Overhead Squat Results */}
                    <div className="border-l-4 border-green-500 pl-4">
                        <h5 className="font-medium text-green-300">Overhead Squat Assessment</h5>
                        <div className="text-sm text-gray-300 mt-1">
                            Front View: {currentData.overheadSquat?.frontView ?
                                Object.values(currentData.overheadSquat.frontView).filter(v => v === true).length : 0} compensations
                        </div>
                        <div className="text-sm text-gray-300">
                            Side View: {currentData.overheadSquat?.sideView ?
                                Object.values(currentData.overheadSquat.sideView).filter(v => v === true).length : 0} compensations
                        </div>
                    </div>

                    {/* Single-Leg Squat Results */}
                    <div className="border-l-4 border-orange-500 pl-4">
                        <h5 className="font-medium text-orange-300">Single-Leg Squat Assessment</h5>
                        <div className="text-sm text-gray-300 mt-1">
                            Right Leg: {currentData.singleLegSquat?.rightLeg?.kneeValgus ? 'Knee valgus present' : 'Normal movement'}
                            {currentData.singleLegSquat?.rightLeg?.hipHike && ' • Hip hike detected'}
                            {currentData.singleLegSquat?.rightLeg?.hipDrop && ' • Hip drop detected'}
                        </div>
                        <div className="text-sm text-gray-300">
                            Left Leg: {currentData.singleLegSquat?.leftLeg?.kneeValgus ? 'Knee valgus present' : 'Normal movement'}
                            {currentData.singleLegSquat?.leftLeg?.hipHike && ' • Hip hike detected'}
                            {currentData.singleLegSquat?.leftLeg?.hipDrop && ' • Hip drop detected'}
                        </div>
                    </div>

                    {/* Push/Pull Results */}
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h5 className="font-medium text-purple-300">Push/Pull Assessment</h5>
                        <div className="text-sm text-gray-300 mt-1">
                            Pushing: {currentData.pushPull?.pushing ?
                                Object.values(currentData.pushPull.pushing).reduce((acc, section) => {
                                    if (typeof section === 'object' && section !== null) {
                                        return acc + Object.values(section).filter(v => v === true).length;
                                    }
                                    return acc;
                                }, 0) : 0} compensations
                            {currentData.pushPull?.pushing?.shoulders?.scapularWinging && ' • Scapular winging detected'}
                        </div>
                        <div className="text-sm text-gray-300">
                            Pulling: {currentData.pushPull?.pulling ?
                                Object.values(currentData.pushPull.pulling).reduce((acc, section) => {
                                    if (typeof section === 'object' && section !== null) {
                                        return acc + Object.values(section).filter(v => v === true).length;
                                    }
                                    return acc;
                                }, 0) : 0} compensations
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-700 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-white mb-4">Recommended Next Steps</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                        <ArrowRight className="h-4 w-4 text-blue-400" />
                        <span>Implement corrective exercise program focusing on identified muscle imbalances</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <ArrowRight className="h-4 w-4 text-blue-400" />
                        <span>Re-assess movement patterns after 4-6 weeks of corrective training</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <ArrowRight className="h-4 w-4 text-blue-400" />
                        <span>Progress to higher intensity training once compensations are addressed</span>
                    </div>
                    {riskLevel === 'High' && (
                        <div className="flex items-center gap-3 text-yellow-300">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <span>Consider working with a qualified professional for corrective exercise prescription</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Assessment Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleSaveAssessment}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                    <CheckCircle className="h-5 w-5" />
                    Save Assessment Results
                </button>
            </div>
        </div>
    );
};

export default AssessmentResults;
