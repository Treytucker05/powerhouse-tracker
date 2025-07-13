import React from 'react';

const RecommendationStep = ({ assessmentData }) => {
    return (
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Step 4: Recommendation</h3>
            <p className="text-gray-400 mb-6">Based on your selections, here's our recommendation:</p>

            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 mb-6">
                <div className="text-center">
                    <div className="text-3xl mb-3">🎯</div>
                    <h4 className="text-blue-400 font-semibold text-lg mb-2">
                        Recommended: {assessmentData.recommendedSystem}
                    </h4>
                    <p className="text-gray-300 text-sm">
                        This system is optimal for your goals, experience level, and timeline.
                    </p>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-700 p-4 rounded-lg">
                <h5 className="text-white font-medium mb-3">Your Assessment Summary:</h5>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Goal:</span>
                        <span className="text-white">{assessmentData.primaryGoal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Experience:</span>
                        <span className="text-white">{assessmentData.trainingExperience}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Timeline:</span>
                        <span className="text-white">{assessmentData.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">System:</span>
                        <span className="text-blue-400 font-medium">{assessmentData.recommendedSystem}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationStep;
