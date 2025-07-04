import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../contexts/MacrocycleBuilderContext';

const ProgramDetails: React.FC = () => {
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

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Program Details</h1>
                    <p className="text-gray-400">Step 1 of 4 - Define your training parameters</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-6">
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
                                        { value: 'bulk', label: 'Bulk', desc: 'Caloric surplus, muscle gain focus' },
                                        { value: 'maintenance', label: 'Maintenance', desc: 'Caloric balance, strength focus' },
                                        { value: 'cut', label: 'Cut', desc: 'Caloric deficit, fat loss focus' },
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
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Duration (weeks) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="8"
                                    max="24"
                                    value={programDetails.duration}
                                    onChange={(e) => updateField('duration', parseInt(e.target.value) || 8)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <p className="text-gray-500 text-xs mt-1">Range: 8-24 weeks</p>
                            </div>

                            {/* Training Days Per Week */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Training Days Per Week: <span className="text-red-400 font-semibold">{programDetails.trainingDaysPerWeek}</span>
                                </label>
                                <div className="px-3">
                                    <input
                                        type="range"
                                        min="3"
                                        max="6"
                                        value={programDetails.trainingDaysPerWeek}
                                        onChange={(e) => updateField('trainingDaysPerWeek', parseInt(e.target.value))}
                                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>3 days</span>
                                        <span>4 days</span>
                                        <span>5 days</span>
                                        <span>6 days</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Recommended: 4-5 days for optimal recovery</p>
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

            {/* Custom Slider Styles */}
            <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
        </div>
    );
};

export default ProgramDetails;
