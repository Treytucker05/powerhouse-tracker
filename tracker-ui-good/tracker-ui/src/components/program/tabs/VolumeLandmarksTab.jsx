import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { useApp } from '../../../context';
import { TrendingUp, AlertTriangle, CheckCircle, Target, BarChart3, Calendar } from 'lucide-react';

const VolumeLandmarksTab = () => {
    const {
        calculateMEV,
        calculateMRV,
        calculateMAV,
        assessVolumeLandmarks,
        assessCurrentVolume,
        generateDeloadProtocol,
        saveVolumeLandmarks
    } = useAssessment();

    const { state } = useApp();

    // Individual factors assessment
    const [individualFactors, setIndividualFactors] = useState({
        general: {
            fiberType: 'mixed',
            trainingAge: 'intermediate',
            recoveryScore: 7,
            stressLevel: 5,
            sleepQuality: 7,
            nutritionQuality: 7
        }
    });

    // Selected muscle groups for assessment
    const [selectedMuscles, setSelectedMuscles] = useState([
        'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes'
    ]);

    // Current training volume input
    const [currentVolume, setCurrentVolume] = useState({
        chest: 12,
        back: 14,
        shoulders: 10,
        biceps: 8,
        triceps: 8,
        quads: 16,
        hamstrings: 10,
        glutes: 12
    });

    // Training goals
    const [trainingGoals, setTrainingGoals] = useState(['hypertrophy']);

    // Current mesocycle week
    const [currentWeek, setCurrentWeek] = useState(1);

    // Assessment results
    const [assessment, setAssessment] = useState(null);
    const [volumeStatus, setVolumeStatus] = useState(null);
    const [showDeloadWarning, setShowDeloadWarning] = useState(false);

    useEffect(() => {
        // Generate volume landmark assessment
        const result = assessVolumeLandmarks(selectedMuscles, individualFactors, trainingGoals);
        setAssessment(result);

        // Assess current volume status
        if (result.landmarks) {
            const status = assessCurrentVolume(currentVolume, result.landmarks, currentWeek);
            setVolumeStatus(status);

            // Check for overreaching indicators
            const overreachingMuscles = Object.values(status).filter(s => s.status === 'above_mrv');
            setShowDeloadWarning(overreachingMuscles.length > 0);
        }
    }, [individualFactors, selectedMuscles, currentVolume, trainingGoals, currentWeek]);

    const handleFactorChange = (category, field, value) => {
        setIndividualFactors(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleVolumeChange = (muscle, value) => {
        setCurrentVolume(prev => ({
            ...prev,
            [muscle]: parseInt(value)
        }));
    };

    const handleMuscleSelection = (muscle) => {
        setSelectedMuscles(prev =>
            prev.includes(muscle)
                ? prev.filter(m => m !== muscle)
                : [...prev, muscle]
        );
    };

    const handleSaveAssessment = async () => {
        if (assessment) {
            const result = await saveVolumeLandmarks({
                landmarks: assessment.landmarks,
                currentVolume,
                weeklyProgression: assessment.summary.weeklyProgression,
                individualFactors,
                timestamp: new Date().toISOString()
            });

            if (result.success) {
                alert('Volume landmarks saved successfully!');
            } else {
                alert('Error saving assessment: ' + result.error);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'below_mev': return 'bg-red-100 text-red-800 border-red-200';
            case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
            case 'above_mav': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'above_mrv': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'below_mev': return <AlertTriangle className="h-4 w-4" />;
            case 'optimal': return <CheckCircle className="h-4 w-4" />;
            case 'above_mav': return <TrendingUp className="h-4 w-4" />;
            case 'above_mrv': return <AlertTriangle className="h-4 w-4" />;
            default: return <Target className="h-4 w-4" />;
        }
    };

    const muscleGroupOptions = [
        'chest', 'back', 'shoulders', 'biceps', 'triceps',
        'quads', 'hamstrings', 'glutes', 'calves'
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-2">Volume Landmarks Assessment</h2>
                <p className="text-gray-300 mb-4">
                    "MEV is the minimum volume needed for gains. MRV is the maximum you can recover from.
                    MAV is the sweet spot for optimal progress." - How Much Should I Train?, p.7
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-900/50 p-3 rounded border border-blue-600">
                        <div className="text-blue-400 font-semibold">MEV</div>
                        <div className="text-blue-200">Minimum Effective Volume</div>
                    </div>
                    <div className="bg-green-900/50 p-3 rounded border border-green-600">
                        <div className="text-green-400 font-semibold">MAV</div>
                        <div className="text-green-200">Maximum Adaptive Volume</div>
                    </div>
                    <div className="bg-red-900/50 p-3 rounded border border-red-600">
                        <div className="text-red-400 font-semibold">MRV</div>
                        <div className="text-red-200">Maximum Recoverable Volume</div>
                    </div>
                </div>
            </div>

            {/* Deload Warning */}
            {showDeloadWarning && (
                <div className="bg-red-900/50 border border-red-600 rounded-lg p-4">
                    <div className="flex items-start">
                        <AlertTriangle className="text-red-400 mr-3 mt-1" />
                        <div>
                            <h4 className="text-red-400 font-semibold mb-2">VOLUME ABOVE MRV DETECTED</h4>
                            <p className="text-red-300 text-sm mb-2">
                                One or more muscle groups are training above Maximum Recoverable Volume.
                                This increases overreaching risk.
                            </p>
                            <p className="text-red-300 text-sm font-medium">
                                Recommended Action: Implement deload protocol immediately
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Individual Factors Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Individual Factors</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Muscle Fiber Type
                            </label>
                            <select
                                value={individualFactors.general.fiberType}
                                onChange={(e) => handleFactorChange('general', 'fiberType', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-styled"
                            >
                                <option value="fast">Fast-Twitch Dominant (Lower volume tolerance)</option>
                                <option value="mixed">Mixed Fiber Type (Average tolerance)</option>
                                <option value="slow">Slow-Twitch Dominant (Higher volume tolerance)</option>
                            </select>
                            <div className="text-xs text-gray-400 mt-1">
                                "Fast-twitch muscles need less volume to grow" - p.8
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Training Age
                            </label>
                            <select
                                value={individualFactors.general.trainingAge}
                                onChange={(e) => handleFactorChange('general', 'trainingAge', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent custom-styled"
                            >
                                <option value="beginner">Beginner (1-2 years)</option>
                                <option value="intermediate">Intermediate (2-5 years)</option>
                                <option value="advanced">Advanced (5+ years)</option>
                            </select>
                            <div className="text-xs text-gray-400 mt-1">
                                "Beginners need less volume to grow" - p.10
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recovery Score: {individualFactors.general.recoveryScore}/10
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={individualFactors.general.recoveryScore}
                                onChange={(e) => handleFactorChange('general', 'recoveryScore', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                Overall recovery capacity from training
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Lifestyle Factors</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Stress Level: {individualFactors.general.stressLevel}/10
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={individualFactors.general.stressLevel}
                                onChange={(e) => handleFactorChange('general', 'stressLevel', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                1 = Very low stress, 10 = Extremely high stress
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sleep Quality: {individualFactors.general.sleepQuality}/10
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={individualFactors.general.sleepQuality}
                                onChange={(e) => handleFactorChange('general', 'sleepQuality', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                "Sleep, stress, nutrition all affect MRV" - p.15
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nutrition Quality: {individualFactors.general.nutritionQuality}/10
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={individualFactors.general.nutritionQuality}
                                onChange={(e) => handleFactorChange('general', 'nutritionQuality', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                                Overall nutrition consistency and quality
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Muscle Group Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Muscle Groups to Assess</h3>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                    {muscleGroupOptions.map(muscle => (
                        <button
                            key={muscle}
                            onClick={() => handleMuscleSelection(muscle)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedMuscles.includes(muscle)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Week Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Mesocycle Progress
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(week => (
                        <button
                            key={week}
                            onClick={() => setCurrentWeek(week)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentWeek === week
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Week {week}
                            {week === 4 && <div className="text-xs">Deload</div>}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                    "Start conservative near MEV, progress towards MRV" - p.19
                </div>
            </div>

            {/* Current Volume Input */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Current Training Volume (Sets/Week)</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedMuscles.map(muscle => (
                        <div key={muscle}>
                            <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                                {muscle}: {currentVolume[muscle]} sets
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="40"
                                value={currentVolume[muscle]}
                                onChange={(e) => handleVolumeChange(muscle, e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Volume Assessment Results */}
            {assessment && volumeStatus && (
                <div className="space-y-4">
                    {/* Individual Muscle Assessment */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Volume Assessment Results</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {Object.entries(volumeStatus).map(([muscle, status]) => (
                                <div key={muscle} className={`rounded-lg p-4 border ${getStatusColor(status.status)}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold capitalize flex items-center">
                                            {getStatusIcon(status.status)}
                                            <span className="ml-2">{muscle}</span>
                                        </h4>
                                        <span className="text-sm font-medium">
                                            {status.currentVolume} sets
                                        </span>
                                    </div>

                                    <div className="text-sm mb-2">
                                        <div>MEV: {status.mev} | MAV: {status.targetMAV} | MRV: {status.mrv}</div>
                                    </div>

                                    <div className="text-sm mb-2">
                                        <strong>Status:</strong> {status.status.replace(/_/g, ' ').toUpperCase()}
                                    </div>

                                    <div className="text-sm mb-2">
                                        <strong>Recommendation:</strong> {status.recommendation}
                                    </div>

                                    <div className="text-xs">
                                        <strong>Next Week:</strong> {status.progressionSuggestion}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Progression Preview */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Mesocycle Progression Preview
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left text-gray-300 py-2">Week</th>
                                        {selectedMuscles.map(muscle => (
                                            <th key={muscle} className="text-center text-gray-300 py-2 capitalize">
                                                {muscle}
                                            </th>
                                        ))}
                                        <th className="text-center text-gray-300 py-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assessment.summary.weeklyProgression.map((week, index) => (
                                        <tr key={week.week} className={`border-b border-gray-700 ${currentWeek === week.week ? 'bg-blue-900/30' : ''
                                            }`}>
                                            <td className="py-2 text-white font-medium">
                                                Week {week.week}
                                                {week.deloadWeek && <span className="text-yellow-400 ml-1">(Deload)</span>}
                                            </td>
                                            {selectedMuscles.map(muscle => {
                                                const target = week.muscleTargets[muscle];
                                                return (
                                                    <td key={muscle} className="text-center py-2 text-gray-300">
                                                        {target?.targetMAV || 0}
                                                    </td>
                                                );
                                            })}
                                            <td className="text-center py-2 text-white font-medium">
                                                {week.totalVolume}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                            "MAV progression: Start near MEV, increase micro-to-micro to MRV" - p.17
                        </div>
                    </div>

                    {/* Training Insights */}
                    <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-3">Training Insights</h4>
                        <div className="space-y-2">
                            <div className="text-blue-200 text-sm">
                                <strong>Total Weekly Volume:</strong> {assessment.summary.averageMAV} sets
                            </div>
                            <div className="text-blue-200 text-sm">
                                <strong>Estimated Training Time:</strong> {assessment.summary.weeklyTimeEstimate} minutes/week
                            </div>
                            <div className="text-blue-200 text-sm">
                                <strong>Volume Range:</strong> {assessment.summary.totalMEV} - {assessment.summary.totalMRV} sets/week
                            </div>
                        </div>

                        {assessment.summary.insights.map((insight, index) => (
                            <div key={index} className="mt-3 p-3 bg-blue-800/50 rounded border border-blue-500">
                                <div className="text-blue-300 font-medium">{insight.type.replace(/_/g, ' ').toUpperCase()}</div>
                                <div className="text-blue-200 text-sm">{insight.message}</div>
                                <div className="text-blue-400 text-xs mt-1">{insight.reference}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveAssessment}
                    disabled={!assessment}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Save Volume Landmarks
                </button>
            </div>
        </div>
    );
};

export default VolumeLandmarksTab;
