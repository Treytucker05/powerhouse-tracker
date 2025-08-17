import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Activity,
    Heart,
    Clock,
    AlertCircle,
    CheckCircle,
    RotateCcw,
    Battery,
    Moon,
    Zap,
    BarChart3,
    Target
} from 'lucide-react';
import { useAssessment } from '../../../../hooks/useAssessment';

/**
 * VolumeRecoveryManagement.jsx - Consolidated Tab
 * 
 * Combines VolumeLandmarksTab + MonitoringTab functionality:
 * - Volume Landmark Calculations (MEV, MAV, MRV)
 * - RPE-based Load Management
 * - Recovery Monitoring & Fatigue Assessment
 * - Autoregulation Protocols
 */

const VolumeRecoveryManagement = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const { calculateVolumeLandmarks, assessRecovery } = useAssessment();

    // State for Volume Landmarks (from VolumeLandmarksTab)
    const [volumeLandmarks, setVolumeLandmarks] = useState({
        muscleGroups: {
            chest: { mev: 8, mav: 14, mrv: 20 },
            shoulders: { mev: 8, mav: 16, mrv: 24 },
            triceps: { mev: 6, mav: 10, mrv: 16 },
            biceps: { mev: 6, mav: 10, mrv: 16 },
            back: { mev: 10, mav: 18, mrv: 26 },
            quads: { mev: 8, mav: 16, mrv: 24 },
            hamstrings: { mev: 6, mav: 12, mrv: 18 },
            glutes: { mev: 8, mav: 16, mrv: 24 },
            calves: { mev: 8, mav: 16, mrv: 28 }
        },
        currentVolume: {},
        targetVolume: {},
        deloadThreshold: 0.75
    });

    // State for Recovery Monitoring (from MonitoringTab)
    const [recoveryMetrics, setRecoveryMetrics] = useState({
        rpe: {
            current: 6,
            target: 7,
            trend: [],
            autoregulation: true
        },
        sleep: {
            hours: 7.5,
            quality: 7,
            consistency: 8
        },
        stress: {
            life: 5,
            training: 6,
            recovery: 7
        },
        readiness: {
            subjective: 7,
            hrv: null,
            restingHr: null
        }
    });

    // Assessment results
    const [volumeAssessment, setVolumeAssessment] = useState(null);
    const [recoveryAssessment, setRecoveryAssessment] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState('volume-landmarks');

    // Recovery zones and interpretations
    const rpeZones = [
        { range: '1-3', label: 'Very Easy', description: 'Light movement, active recovery', color: 'green' },
        { range: '4-6', label: 'Easy to Moderate', description: 'Base building, technique work', color: 'blue' },
        { range: '7-8', label: 'Hard', description: 'Productive training intensity', color: 'yellow' },
        { range: '9-10', label: 'Very Hard to Max', description: 'Peak/competition intensity', color: 'red' }
    ];

    const recoveryCategories = [
        { key: 'excellent', label: 'Excellent', range: '9-10', color: 'green', action: 'Increase volume/intensity' },
        { key: 'good', label: 'Good', range: '7-8', color: 'blue', action: 'Maintain current load' },
        { key: 'adequate', label: 'Adequate', range: '5-6', color: 'yellow', action: 'Monitor closely' },
        { key: 'poor', label: 'Poor', range: '3-4', color: 'orange', action: 'Reduce volume' },
        { key: 'very-poor', label: 'Very Poor', range: '1-2', color: 'red', action: 'Rest day or deload' }
    ];

    // Effect calculations
    useEffect(() => {
        calculateVolumeAssessment();
        calculateRecoveryAssessment();
    }, [volumeLandmarks, recoveryMetrics]);

    const calculateVolumeAssessment = () => {
        const muscleGroups = Object.keys(volumeLandmarks.muscleGroups);
        const assessments = {};

        muscleGroups.forEach(muscle => {
            const landmarks = volumeLandmarks.muscleGroups[muscle];
            const current = volumeLandmarks.currentVolume[muscle] || 0;

            let status;
            if (current < landmarks.mev) status = 'Below MEV';
            else if (current >= landmarks.mev && current <= landmarks.mav) status = 'Optimal';
            else if (current > landmarks.mav && current <= landmarks.mrv) status = 'High Volume';
            else status = 'Exceeds MRV';

            assessments[muscle] = {
                current,
                status,
                landmarks,
                recommendation: getVolumeRecommendation(status, current, landmarks)
            };
        });

        setVolumeAssessment({
            muscleAssessments: assessments,
            overallStatus: calculateOverallVolumeStatus(assessments),
            totalWeeklyVolume: Object.values(volumeLandmarks.currentVolume).reduce((sum, vol) => sum + (vol || 0), 0)
        });
    };

    const getVolumeRecommendation = (status, current, landmarks) => {
        switch (status) {
            case 'Below MEV':
                return `Increase volume to at least ${landmarks.mev} sets for minimal effective dose`;
            case 'Optimal':
                return 'Volume in optimal range for growth/strength';
            case 'High Volume':
                return 'Monitor fatigue closely, consider deload if recovery suffers';
            case 'Exceeds MRV':
                return `Reduce volume below ${landmarks.mrv} sets to prevent overreaching`;
            default:
                return 'Maintain current approach';
        }
    };

    const calculateOverallVolumeStatus = (assessments) => {
        const statuses = Object.values(assessments).map(a => a.status);
        const exceedsMRV = statuses.filter(s => s === 'Exceeds MRV').length;
        const belowMEV = statuses.filter(s => s === 'Below MEV').length;
        const optimal = statuses.filter(s => s === 'Optimal').length;

        if (exceedsMRV > 2) return 'High Risk - Multiple MRV Exceeded';
        if (belowMEV > 3) return 'Suboptimal - Insufficient Volume';
        if (optimal >= 5) return 'Well Balanced';
        return 'Mixed - Needs Attention';
    };

    const calculateRecoveryAssessment = () => {
        const rpeScore = 10 - (recoveryMetrics.rpe.current - 1); // Invert RPE for recovery score
        const sleepScore = (recoveryMetrics.sleep.hours * 0.4) + (recoveryMetrics.sleep.quality * 0.6);
        const stressScore = 10 - ((recoveryMetrics.stress.life + recoveryMetrics.stress.training) / 2);
        const readinessScore = recoveryMetrics.readiness.subjective;

        const overallRecovery = (rpeScore + sleepScore + stressScore + readinessScore) / 4;

        let category;
        if (overallRecovery >= 8.5) category = 'excellent';
        else if (overallRecovery >= 7) category = 'good';
        else if (overallRecovery >= 5.5) category = 'adequate';
        else if (overallRecovery >= 4) category = 'poor';
        else category = 'very-poor';

        setRecoveryAssessment({
            overallScore: overallRecovery,
            category,
            breakdown: {
                rpe: rpeScore,
                sleep: sleepScore,
                stress: stressScore,
                readiness: readinessScore
            },
            recommendation: getRecoveryRecommendation(category, overallRecovery),
            trainingAdjustments: getTrainingAdjustments(category)
        });
    };

    const getRecoveryRecommendation = (category, score) => {
        const categoryInfo = recoveryCategories.find(c => c.key === category);
        return `Recovery Status: ${categoryInfo.label} (${score.toFixed(1)}/10) - ${categoryInfo.action}`;
    };

    const getTrainingAdjustments = (category) => {
        const adjustments = {
            'excellent': ['Consider increasing intensity', 'Add volume if progressing', 'Maintain current recovery protocols'],
            'good': ['Maintain current training load', 'Monitor for accumulating fatigue', 'Continue good practices'],
            'adequate': ['Monitor RPE closely', 'Prioritize sleep quality', 'Consider stress management'],
            'poor': ['Reduce training volume by 20-30%', 'Focus on recovery methods', 'Address sleep/stress issues'],
            'very-poor': ['Take rest day or light active recovery', 'Implement immediate recovery protocols', 'Consider deload week']
        };

        return adjustments[category] || [];
    };

    const handleVolumeChange = (muscle, value) => {
        setVolumeLandmarks(prev => ({
            ...prev,
            currentVolume: {
                ...prev.currentVolume,
                [muscle]: parseInt(value)
            }
        }));
    };

    const handleRecoveryMetricChange = (category, metric, value) => {
        setRecoveryMetrics(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [metric]: parseFloat(value)
            }
        }));
    };

    const renderVolumeLandmarks = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Volume Landmarks & Programming
                </h3>

                <div className="mb-6 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                    <h4 className="font-medium text-blue-300 mb-2">Volume Landmark Reference</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <strong className="text-green-300">MEV</strong>
                            <p className="text-gray-300">Minimum Effective Volume - Lowest dose for adaptation</p>
                        </div>
                        <div>
                            <strong className="text-blue-300">MAV</strong>
                            <p className="text-gray-300">Maximum Adaptive Volume - Optimal growth stimulus</p>
                        </div>
                        <div>
                            <strong className="text-red-300">MRV</strong>
                            <p className="text-gray-300">Maximum Recoverable Volume - Upper limit before overreaching</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.entries(volumeLandmarks.muscleGroups).map(([muscle, landmarks]) => {
                        const assessment = volumeAssessment?.muscleAssessments?.[muscle];
                        const current = volumeLandmarks.currentVolume[muscle] || 0;

                        return (
                            <div key={muscle} className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-white capitalize">{muscle}</h4>
                                    {assessment && (
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${assessment.status === 'Optimal' ? 'bg-green-900 text-green-300' :
                                                assessment.status === 'Below MEV' ? 'bg-red-900 text-red-300' :
                                                    assessment.status === 'High Volume' ? 'bg-yellow-900 text-yellow-300' :
                                                        'bg-red-900 text-red-300'
                                            }`}>
                                            {assessment.status}
                                        </span>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Current Weekly Sets: {current}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max={landmarks.mrv + 5}
                                            step="1"
                                            value={current}
                                            onChange={(e) => handleVolumeChange(muscle, e.target.value)}
                                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>0</span>
                                            <span className="text-green-400">MEV: {landmarks.mev}</span>
                                            <span className="text-blue-400">MAV: {landmarks.mav}</span>
                                            <span className="text-red-400">MRV: {landmarks.mrv}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="bg-gray-600 rounded-lg p-3 w-full">
                                            <div className="text-sm text-gray-300 mb-1">Recommendation:</div>
                                            <div className="text-xs text-gray-400">
                                                {assessment?.recommendation || 'Set your current volume to see recommendations'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Overall Assessment */}
                {volumeAssessment && (
                    <div className="mt-6 bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Volume Assessment Summary</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-300">Overall Status:</div>
                                <div className={`font-medium ${volumeAssessment.overallStatus.includes('Well Balanced') ? 'text-green-300' :
                                        volumeAssessment.overallStatus.includes('High Risk') ? 'text-red-300' :
                                            'text-yellow-300'
                                    }`}>
                                    {volumeAssessment.overallStatus}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-300">Total Weekly Volume:</div>
                                <div className="font-medium text-white">{volumeAssessment.totalWeeklyVolume} sets</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderRecoveryMonitoring = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    Recovery Monitoring & Load Management
                </h3>

                {/* RPE Tracking */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        RPE & Session Load
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Current Session RPE: {recoveryMetrics.rpe.current}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.5"
                                value={recoveryMetrics.rpe.current}
                                onChange={(e) => handleRecoveryMetricChange('rpe', 'current', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Very Easy (1)</span>
                                <span>Moderate (5)</span>
                                <span>Maximal (10)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Target RPE: {recoveryMetrics.rpe.target}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.5"
                                value={recoveryMetrics.rpe.target}
                                onChange={(e) => handleRecoveryMetricChange('rpe', 'target', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* RPE Zones Reference */}
                    <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {rpeZones.map((zone, index) => (
                            <div key={index} className={`bg-${zone.color}-900/20 border border-${zone.color}-500 rounded-lg p-3`}>
                                <div className={`font-medium text-${zone.color}-300`}>RPE {zone.range}</div>
                                <div className={`text-sm text-${zone.color}-200`}>{zone.label}</div>
                                <div className="text-xs text-gray-400">{zone.description}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={recoveryMetrics.rpe.autoregulation}
                                onChange={(e) => handleRecoveryMetricChange('rpe', 'autoregulation', e.target.checked)}
                                className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-300">Enable RPE-based autoregulation</span>
                        </label>
                    </div>
                </div>

                {/* Sleep Tracking */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Sleep Quality
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sleep Hours: {recoveryMetrics.sleep.hours}
                            </label>
                            <input
                                type="range"
                                min="4"
                                max="12"
                                step="0.5"
                                value={recoveryMetrics.sleep.hours}
                                onChange={(e) => handleRecoveryMetricChange('sleep', 'hours', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sleep Quality (1-10): {recoveryMetrics.sleep.quality}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={recoveryMetrics.sleep.quality}
                                onChange={(e) => handleRecoveryMetricChange('sleep', 'quality', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sleep Consistency (1-10): {recoveryMetrics.sleep.consistency}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={recoveryMetrics.sleep.consistency}
                                onChange={(e) => handleRecoveryMetricChange('sleep', 'consistency', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Stress Assessment */}
                <div className="mb-6">
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Stress Levels
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Life Stress (1-10): {recoveryMetrics.stress.life}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={recoveryMetrics.stress.life}
                                onChange={(e) => handleRecoveryMetricChange('stress', 'life', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Training Stress (1-10): {recoveryMetrics.stress.training}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={recoveryMetrics.stress.training}
                                onChange={(e) => handleRecoveryMetricChange('stress', 'training', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recovery Capacity (1-10): {recoveryMetrics.stress.recovery}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={recoveryMetrics.stress.recovery}
                                onChange={(e) => handleRecoveryMetricChange('stress', 'recovery', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Readiness Assessment */}
                <div>
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Battery className="h-4 w-4" />
                        Training Readiness
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Subjective Readiness (1-10): {recoveryMetrics.readiness.subjective}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={recoveryMetrics.readiness.subjective}
                                onChange={(e) => handleRecoveryMetricChange('readiness', 'subjective', e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                HRV (optional)
                            </label>
                            <input
                                type="number"
                                placeholder="HRV score"
                                value={recoveryMetrics.readiness.hrv || ''}
                                onChange={(e) => handleRecoveryMetricChange('readiness', 'hrv', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Resting HR (optional)
                            </label>
                            <input
                                type="number"
                                placeholder="BPM"
                                value={recoveryMetrics.readiness.restingHr || ''}
                                onChange={(e) => handleRecoveryMetricChange('readiness', 'restingHr', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderIntegratedAssessment = () => (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Integrated Volume & Recovery Assessment
                </h3>

                {/* Recovery Status Dashboard */}
                {recoveryAssessment && (
                    <div className="mb-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className={`text-2xl font-bold ${recoveryAssessment.category === 'excellent' ? 'text-green-400' :
                                        recoveryAssessment.category === 'good' ? 'text-blue-400' :
                                            recoveryAssessment.category === 'adequate' ? 'text-yellow-400' :
                                                'text-red-400'
                                    }`}>
                                    {recoveryAssessment.overallScore.toFixed(1)}
                                </div>
                                <div className="text-sm text-gray-400">Recovery Score</div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">{recoveryMetrics.rpe.current}</div>
                                <div className="text-sm text-gray-400">Current RPE</div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">{recoveryMetrics.sleep.hours}h</div>
                                <div className="text-sm text-gray-400">Sleep Duration</div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">{recoveryMetrics.stress.life + recoveryMetrics.stress.training}/20</div>
                                <div className="text-sm text-gray-400">Total Stress</div>
                            </div>
                            <div className="bg-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-white">{volumeAssessment?.totalWeeklyVolume || 0}</div>
                                <div className="text-sm text-gray-400">Weekly Sets</div>
                            </div>
                        </div>

                        <div className={`bg-${recoveryCategories.find(c => c.key === recoveryAssessment.category)?.color || 'gray'}-900/20 border border-${recoveryCategories.find(c => c.key === recoveryAssessment.category)?.color || 'gray'}-500 rounded-lg p-4 mb-4`}>
                            <h4 className="font-medium text-white mb-2">Current Recommendation</h4>
                            <p className="text-gray-300 text-sm mb-3">{recoveryAssessment.recommendation}</p>

                            {recoveryAssessment.trainingAdjustments.length > 0 && (
                                <div>
                                    <h5 className="font-medium text-gray-300 mb-2">Immediate Actions:</h5>
                                    <ul className="space-y-1">
                                        {recoveryAssessment.trainingAdjustments.map((adjustment, index) => (
                                            <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                                                <span className="text-blue-400 mt-1">•</span>
                                                {adjustment}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Volume-Recovery Integration */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Volume-Recovery Integration</h4>

                    {volumeAssessment && recoveryAssessment && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Volume Status</h5>
                                <div className={`text-sm p-2 rounded ${volumeAssessment.overallStatus.includes('Well Balanced') ? 'bg-green-900/20 text-green-300' :
                                        volumeAssessment.overallStatus.includes('High Risk') ? 'bg-red-900/20 text-red-300' :
                                            'bg-yellow-900/20 text-yellow-300'
                                    }`}>
                                    {volumeAssessment.overallStatus}
                                </div>
                            </div>

                            <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Recovery Status</h5>
                                <div className={`text-sm p-2 rounded ${recoveryAssessment.category === 'excellent' || recoveryAssessment.category === 'good' ? 'bg-green-900/20 text-green-300' :
                                        recoveryAssessment.category === 'adequate' ? 'bg-yellow-900/20 text-yellow-300' :
                                            'bg-red-900/20 text-red-300'
                                    }`}>
                                    {recoveryCategories.find(c => c.key === recoveryAssessment.category)?.label || 'Unknown'}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500 rounded">
                        <h5 className="text-sm font-medium text-blue-300 mb-2">Smart Autoregulation</h5>
                        <p className="text-xs text-blue-200">
                            Based on your current recovery status and volume distribution, the system will automatically suggest training adjustments to optimize adaptation while preventing overreaching.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Volume & Recovery Management</h2>
                    <p className="text-gray-400">Optimize training volume using scientific landmarks and monitor recovery for intelligent autoregulation</p>
                </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
                {[
                    { id: 'volume-landmarks', label: 'Volume Landmarks', icon: TrendingUp },
                    { id: 'recovery-monitoring', label: 'Recovery Monitoring', icon: Heart },
                    { id: 'integration', label: 'Integrated Assessment', icon: BarChart3 }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSubTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-600'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sub-tab Content */}
            {activeSubTab === 'volume-landmarks' && renderVolumeLandmarks()}
            {activeSubTab === 'recovery-monitoring' && renderRecoveryMonitoring()}
            {activeSubTab === 'integration' && renderIntegratedAssessment()}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center">
                    {canGoPrevious && (
                        <button
                            onClick={onPrevious}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Previous
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                        Volume & recovery optimization configured
                    </div>

                    {canGoNext && (
                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Next: Periodization Planning
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VolumeRecoveryManagement;
