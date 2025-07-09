import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../contexts/MacrocycleBuilderContext';
import { calculateMEV, calculateMRV, calculatePersonalizedVolume } from '../lib/algorithms/rpAlgorithms';
import { MEV_RANGES, MRV_RANGES } from '../constants/rpConstants';
import { StepProgress } from '../lib/designSystem.jsx';

const ProgramDetails: React.FC = () => {
    console.log('🟢 ProgramDetails component rendering...');

    const navigate = useNavigate();
    const { state, dispatch, validateCurrentStep, canProceedToNextStep } = useBuilder();
    const { programDetails } = state;

    // Handle input changes
    const updateField = (field: string, value: any) => {
        dispatch({
            type: 'UPDATE_PROGRAM_DETAILS',
            payload: { [field]: value },
        });
    };

    // Handle next button click
    const handleNext = () => {
        if (canProceedToNextStep()) {
            console.log('🔄 Proceeding to template selection...');
            dispatch({ type: 'SET_STEP', payload: 2 });

            // Use setTimeout to ensure navigation happens after state updates
            setTimeout(() => {
                console.log('🔄 Navigating to template...');
                navigate('/program-design/template');
            }, 0);
        }
    };

    // Form validation
    const isFormValid = validateCurrentStep();
    const nameError = programDetails.name.length > 0 && (programDetails.name.length < 3 || programDetails.name.length > 50);

    // RP Algorithm Integration
    const [rpRecommendations, setRpRecommendations] = useState<Array<{ muscle: string, mev: any, mrv: any }> | null>(null);

    // Calculate MEV/MRV when trainingExperience or dietPhase changes
    useEffect(() => {
        if (programDetails.trainingExperience && programDetails.dietPhase) {
            const muscleGroups = [
                'chest', 'back', 'shoulders',
                'biceps', 'triceps',
                'quads', 'hamstrings', 'glutes',
                'calves', 'abs', 'traps', 'forearms'
            ];

            const recommendations = muscleGroups.map(muscle => {
                const personalizedVolume = calculatePersonalizedVolume(
                    muscle,
                    programDetails.trainingExperience,
                    programDetails.dietPhase,
                    false // specialization flag - will be handled in later steps
                );
                return {
                    muscle,
                    mev: personalizedVolume.mev,
                    mrv: personalizedVolume.mrv
                };
            });
            setRpRecommendations(recommendations);
        } else {
            setRpRecommendations(null);
        }
    }, [programDetails.trainingExperience, programDetails.dietPhase]);

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Program Details</h1>
                    <p className="text-gray-400">Step 1 of 4 - Define your training parameters</p>

                    {/* Progress Steps - Desktop */}
                    <div className="hidden md:block mt-6">
                        <StepProgress
                            currentStep={1}
                            totalSteps={4}
                            steps={['Details', 'Template', 'Timeline', 'Review']}
                        />
                    </div>

                    {/* Mobile Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-4 md:hidden">
                        <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left Column */}
                        <div className="space-y-6">

                            {/* Program Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Program Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={programDetails.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="e.g., Summer Hypertrophy Program"
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${nameError
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-600 focus:ring-red-500 focus:border-transparent'
                                        }`}
                                />
                                {nameError && (
                                    <p className="text-red-400 text-sm mt-1">Name must be between 3-50 characters</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{programDetails.name.length}/50 characters</p>
                            </div>

                            {/* Training Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Training Experience <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'beginner', label: 'Beginner', desc: '< 1 year consistent training' },
                                        { value: 'intermediate', label: 'Intermediate', desc: '1-3 years consistent training' },
                                        { value: 'advanced', label: 'Advanced', desc: '3+ years consistent training' },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-start cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="trainingExperience"
                                                value={option.value}
                                                checked={programDetails.trainingExperience === option.value}
                                                onChange={(e) => updateField('trainingExperience', e.target.value)}
                                                className="mt-1 w-4 h-4 text-red-600 bg-gray-800 border-gray-600 focus:ring-red-500"
                                            />
                                            <div className="ml-3">
                                                <div className="text-white group-hover:text-red-400 transition-colors">{option.label}</div>
                                                <div className="text-gray-500 text-sm">{option.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Diet Phase */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Diet Phase <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    {[
                                        {
                                            value: 'bulk',
                                            label: 'Bulk',
                                            desc: 'Caloric surplus, muscle gain focus',
                                            impact: '+20% volume capacity',
                                            color: 'text-green-400'
                                        },
                                        {
                                            value: 'maintenance',
                                            label: 'Maintenance',
                                            desc: 'Caloric balance, strength focus',
                                            impact: 'Baseline capacity',
                                            color: 'text-blue-400'
                                        },
                                        {
                                            value: 'cut',
                                            label: 'Cut',
                                            desc: 'Caloric deficit, fat loss focus',
                                            impact: '-25% volume capacity',
                                            color: 'text-yellow-400'
                                        },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-start cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="dietPhase"
                                                value={option.value}
                                                checked={programDetails.dietPhase === option.value}
                                                onChange={(e) => updateField('dietPhase', e.target.value)}
                                                className="mt-1 w-4 h-4 text-red-600 bg-gray-800 border-gray-600 focus:ring-red-500"
                                            />
                                            <div className="ml-3">
                                                <div className="text-white group-hover:text-red-400 transition-colors">{option.label}</div>
                                                <div className="text-gray-500 text-sm">{option.desc}</div>
                                                <div className={`text-xs ${option.color} font-medium`}>RP Impact: {option.impact}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* RP Volume Targets - Enhanced Design */}
                            {rpRecommendations && (
                                <div className="bg-blue-900/10 border border-blue-600/20 rounded-lg p-6 mt-6">
                                    <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                                        💡 Volume Recommendations (Per Week)
                                    </h3>
                                    <p className="text-blue-300/70 text-sm mb-4">
                                        Based on: {programDetails.trainingExperience}, {programDetails.dietPhase}
                                        {programDetails.dietPhase === 'bulk' && ' (+20% volume capacity)'}
                                        {programDetails.dietPhase === 'cut' && ' (-25% volume capacity)'}
                                        {programDetails.dietPhase === 'maintenance' && ' (baseline capacity)'}
                                        , {programDetails.trainingDaysPerWeek} days/week
                                    </p>

                                    <div className="space-y-3">
                                        {rpRecommendations.map((rec) => (
                                            <div key={rec.muscle} className="bg-blue-800/10 rounded-lg p-4 border border-blue-600/20">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-blue-200 font-medium capitalize">
                                                        {rec.muscle}
                                                    </span>
                                                    <span className="text-blue-100 font-bold">
                                                        {rec.mev}-{rec.mrv} sets
                                                    </span>
                                                </div>

                                                {/* Volume Progress Bar */}
                                                <div className="relative">
                                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${(rec.mev / rec.mrv) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-blue-300/60 mt-1">
                                                        <span>MEV ↑</span>
                                                        <span>↑ MRV</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Duration (weeks) <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-semibold">{programDetails.duration} weeks</span>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => updateField('duration', Math.max(8, programDetails.duration - 1))}
                                                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                                            >
                                                −
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateField('duration', Math.min(24, programDetails.duration + 1))}
                                                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="8"
                                        max="24"
                                        value={programDetails.duration}
                                        onChange={(e) => updateField('duration', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>8 weeks</span>
                                        <span>16 weeks</span>
                                        <span>24 weeks</span>
                                    </div>
                                </div>
                            </div>

                            {/* Training Days Per Week */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Training Days Per Week
                                </label>
                                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-semibold">{programDetails.trainingDaysPerWeek} days</span>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => updateField('trainingDaysPerWeek', Math.max(3, programDetails.trainingDaysPerWeek - 1))}
                                                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                                            >
                                                −
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateField('trainingDaysPerWeek', Math.min(6, programDetails.trainingDaysPerWeek + 1))}
                                                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="3"
                                        max="6"
                                        value={programDetails.trainingDaysPerWeek}
                                        onChange={(e) => updateField('trainingDaysPerWeek', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>3 days</span>
                                        <span>4 days</span>
                                        <span>5 days</span>
                                        <span>6 days</span>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-2">💡 Recommended: 4-5 days for optimal recovery</p>
                                </div>
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Date (optional)
                                </label>
                                <input
                                    type="date"
                                    value={programDetails.startDate}
                                    onChange={(e) => updateField('startDate', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <p className="text-gray-500 text-xs mt-1">Leave blank to start immediately</p>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mt-6">
                                <h3 className="text-lg font-semibold text-white mb-3">Program Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-white">{programDetails.name || 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Experience:</span>
                                        <span className="text-white capitalize">{programDetails.trainingExperience || 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Diet Phase:</span>
                                        <span className="text-white capitalize">{programDetails.dietPhase || 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Duration:</span>
                                        <span className="text-white">{programDetails.duration} weeks</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Training Days:</span>
                                        <span className="text-white">{programDetails.trainingDaysPerWeek} days/week</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                        <button
                            onClick={() => navigate('/program-design')}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Back to Overview
                        </button>

                        <div className="flex items-center space-x-4">
                            {!isFormValid && (
                                <p className="text-yellow-400 text-sm">
                                    Please complete all required fields to continue
                                </p>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={!isFormValid}
                                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${isFormValid
                                    ? 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next: Template Selection →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Slider Styles */}
            <style>{`
        /* Slider Track */
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          background: #374151;
          outline: none;
          transition: background 0.3s ease;
        }
        
        .slider:hover {
          background: #4B5563;
        }
        
        /* Webkit Slider Thumb */
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FF0000;
          cursor: pointer;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 0, 0, 0.4);
        }
        
        /* Firefox Slider Thumb */
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FF0000;
          cursor: pointer;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 0, 0, 0.4);
        }
        
        /* Mobile Touch Optimization */
        @media (max-width: 640px) {
          .slider::-webkit-slider-thumb {
            width: 24px;
            height: 24px;
          }
          
          .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
        </div>
    );
};

export default ProgramDetails;
