import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../../contexts/MacrocycleBuilderContext';
import { calculateMEV, calculateMRV, calculatePersonalizedVolume } from '../../lib/algorithms/rpAlgorithms';
import { StepProgress, PhaseCard, VolumeProgressBar } from '../../lib/designSystem.jsx';

interface VolumeRecommendation {
    muscle: string;
    mev: number;
    mrv: number;
    specialization: boolean;
}

const ReviewGenerate: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useBuilder();
    const { programDetails, blocks, selectedTemplate, specialization } = state;
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [volumeRecommendations, setVolumeRecommendations] = useState<VolumeRecommendation[]>([]);

    // Calculate volume recommendations
    useEffect(() => {
        if (programDetails.trainingExperience && programDetails.dietPhase) {
            const muscleGroups = [
                'chest', 'back', 'shoulders',
                'biceps', 'triceps',
                'quads', 'hamstrings', 'glutes',
                'calves', 'abs', 'traps', 'forearms'
            ];

            const recommendations = muscleGroups.map(muscle => {
                const isSpecialized = specialization !== 'None' &&
                    ((specialization === 'Chest' && muscle === 'chest') ||
                        (specialization === 'Back' && muscle === 'back') ||
                        (specialization === 'Shoulders' && muscle === 'shoulders') ||
                        (specialization === 'Arms' && (muscle === 'biceps' || muscle === 'triceps')) ||
                        (specialization === 'Legs' && (muscle === 'quads' || muscle === 'hamstrings' || muscle === 'glutes')));

                const personalizedVolume = calculatePersonalizedVolume(
                    muscle,
                    programDetails.trainingExperience,
                    programDetails.dietPhase,
                    isSpecialized
                );

                return {
                    muscle,
                    mev: personalizedVolume.mev,
                    mrv: personalizedVolume.mrv,
                    specialization: isSpecialized
                };
            });

            setVolumeRecommendations(recommendations);
        }
    }, [programDetails.trainingExperience, programDetails.dietPhase, specialization]);

    // Handle back navigation
    const handleBack = () => {
        dispatch({ type: 'SET_STEP', payload: 3.5 });
        navigate('/program-design/volume-distribution');
    };

    // Handle program generation
    const handleGenerateProgram = async () => {
        setIsGenerating(true);

        try {
            // Simulate program generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would typically:
            // 1. Generate detailed workout plans
            // 2. Calculate progressive overload schedules
            // 3. Create exercise selections
            // 4. Save to database/local storage
            // 5. Navigate to the program dashboard

            setShowSuccess(true);

            // Reset builder state after success
            setTimeout(() => {
                dispatch({ type: 'RESET_BUILDER' });
                setShowSuccess(false);
                navigate('/program');
            }, 3000);

        } catch (error) {
            console.error('Failed to generate program:', error);
            setIsGenerating(false);
        }
    };

    // Calculate phase breakdown
    const getPhaseBreakdown = () => {
        const phaseBreakdown = {
            accumulation: 0,
            intensification: 0,
            realization: 0,
            deload: 0
        };

        blocks.forEach(block => {
            if (block.type in phaseBreakdown) {
                phaseBreakdown[block.type] += block.weeks;
            }
        });

        return phaseBreakdown;
    };

    const phaseBreakdown = getPhaseBreakdown();

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Program Generated Successfully!</h1>
                    <p className="text-gray-400 mb-6">Your personalized training program is ready</p>
                    <div className="animate-pulse">
                        <p className="text-gray-500">Redirecting to your program dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Review & Generate</h1>
                    <p className="text-gray-400">Step 4 of 4 - Review your program and generate your plan</p>

                    {/* Progress Steps - Desktop */}
                    <div className="hidden md:block mt-6">
                        <StepProgress
                            currentStep={4}
                            totalSteps={4}
                            steps={['Details', 'Template', 'Timeline', 'Review']}
                        />
                    </div>

                    {/* Mobile Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-4 md:hidden">
                        <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Program Summary */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Program Summary</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Basic Details */}
                            <div className="space-y-6">
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Program Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Name:</span>
                                            <span className="text-white font-medium">{programDetails.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Duration:</span>
                                            <span className="text-white font-medium">{programDetails.duration} weeks</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Training Days:</span>
                                            <span className="text-white font-medium">{programDetails.trainingDaysPerWeek} days/week</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Experience:</span>
                                            <span className="text-white font-medium capitalize">{programDetails.trainingExperience}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Diet Phase:</span>
                                            <span className="text-white font-medium capitalize">{programDetails.dietPhase}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Template:</span>
                                            <span className="text-white font-medium capitalize">{selectedTemplate}</span>
                                        </div>
                                        {specialization && specialization !== 'None' && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Specialization:</span>
                                                <span className="text-red-400 font-medium">{specialization}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Phase Breakdown</h3>
                                    <div className="space-y-3">
                                        {phaseBreakdown.accumulation > 0 && (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                                    <span className="text-gray-400">Accumulation:</span>
                                                </div>
                                                <span className="text-white font-medium">{phaseBreakdown.accumulation} weeks</span>
                                            </div>
                                        )}
                                        {phaseBreakdown.intensification > 0 && (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                                    <span className="text-gray-400">Intensification:</span>
                                                </div>
                                                <span className="text-white font-medium">{phaseBreakdown.intensification} weeks</span>
                                            </div>
                                        )}
                                        {phaseBreakdown.realization > 0 && (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                                    <span className="text-gray-400">Realization:</span>
                                                </div>
                                                <span className="text-white font-medium">{phaseBreakdown.realization} weeks</span>
                                            </div>
                                        )}
                                        {phaseBreakdown.deload > 0 && (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                                                    <span className="text-gray-400">Deload/Recovery:</span>
                                                </div>
                                                <span className="text-white font-medium">{phaseBreakdown.deload} weeks</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Volume Recommendations */}
                            <div className="space-y-6">
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-100 mb-4">Volume Targets</h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        Weekly volume recommendations based on your experience level and goals
                                    </p>

                                    <div className="space-y-4">
                                        {volumeRecommendations.map((rec) => (
                                            <div key={rec.muscle} className="bg-gray-700 rounded-lg p-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-200 font-medium capitalize">
                                                            {rec.muscle}
                                                        </span>
                                                        {rec.specialization && (
                                                            <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">
                                                                +30%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-gray-100 font-bold">
                                                        {rec.mev}-{rec.mrv} sets
                                                    </span>
                                                </div>

                                                <div className="w-full bg-gray-600 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${(rec.mev / rec.mrv) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                    <span>MEV</span>
                                                    <span>MRV</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phase Timeline */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Phase Timeline</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blocks.map((block, index) => {
                                const startWeek = blocks.slice(0, index).reduce((acc, b) => acc + b.weeks, 0) + 1;
                                const endWeek = blocks.slice(0, index + 1).reduce((acc, b) => acc + b.weeks, 0);

                                return (
                                    <PhaseCard
                                        key={block.id}
                                        phase={block.name}
                                        weeks={`${startWeek}-${endWeek}`}
                                        current={0}
                                        total={block.weeks}
                                        description={
                                            block.type === 'accumulation' ? 'Build volume from MEV to MRV' :
                                                block.type === 'intensification' ? 'Maintain volume, increase intensity' :
                                                    block.type === 'realization' ? 'Taper volume, peak performance' :
                                                        'Reduce volume for recovery'
                                        }
                                        color={
                                            block.type === 'accumulation' ? 'blue' :
                                                block.type === 'intensification' ? 'yellow' :
                                                    block.type === 'realization' ? 'red' : 'gray'
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Your Program Includes</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">RP Volume Recommendations</h3>
                                        <p className="text-gray-400 text-sm">Science-based volume targets for each muscle group</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Periodized Training Phases</h3>
                                        <p className="text-gray-400 text-sm">Structured progression through accumulation, intensification, and realization</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Auto-Regulation</h3>
                                        <p className="text-gray-400 text-sm">RIR-based intensity prescription for optimal recovery</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Progressive Overload</h3>
                                        <p className="text-gray-400 text-sm">Systematic increases in volume and intensity over time</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Deload Weeks</h3>
                                        <p className="text-gray-400 text-sm">Planned recovery periods for supercompensation</p>
                                    </div>
                                </div>

                                {specialization && specialization !== 'None' && (
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{specialization} Specialization</h3>
                                            <p className="text-gray-400 text-sm">Enhanced volume for targeted muscle group development</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            ← Back to Volume Distribution
                        </button>

                        <button
                            onClick={handleGenerateProgram}
                            disabled={isGenerating}
                            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${isGenerating
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105'
                                }`}
                        >
                            {isGenerating ? (
                                <div className="flex items-center space-x-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Generating Program...</span>
                                </div>
                            ) : (
                                'Generate Program 🚀'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewGenerate;
