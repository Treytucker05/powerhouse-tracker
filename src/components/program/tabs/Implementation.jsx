import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, Download, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import FitnessFatigueTracker from '../../recovery/FitnessFatigueTracker';
import { useRecoveryMonitor } from '../../hooks/useRecoveryMonitor';

const Implementation = ({ onPrevious, canGoPrevious }) => {
    const { recoveryData, monitorRecovery } = useRecoveryMonitor();
    
    const [implementationPhase, setImplementationPhase] = useState('planning');
    const [programData, setProgramData] = useState({
        name: 'Periodized Training Program',
        duration: 16,
        currentWeek: 1,
        totalSessions: 64,
        completedSessions: 0
    });

    // Enhanced fatigue trac                </div>
            </div>

            {/* Enhanced Fitness-Fatigue Model Dashboard with Real Data */}
            <EnhancedFitnessFatigueTracker />

            {/* Optional: Original FitnessFatigueTracker for comparison */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                    Standard Fitness-Fatigue Tracker
                </h3>
                <FitnessFatigueTracker />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-600">
                <div className="flex items-center">
                    {canGoPrevious && (
                        <button
                            onClick={onPrevious}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Previousl data integration
    const [fatigueMetrics, setFatigueMetrics] = useState({
        // Data from fatigue.js algorithms
        sorenessRecoveryDays: 0,
        currentSessionGap: 0,
        frequencyOptimal: true,
        recoveryRatio: 1.0,
        // Bryant FF Model data
        fitnessScore: recoveryData.fitnessScore || 100,
        fatigueScore: recoveryData.fatigueScore || 0,
        netReadiness: recoveryData.netReadiness || 100,
        lastUpdated: new Date().toISOString()
    });

    // Training logs data for fitness score calculation
    const [trainingLogs, setTrainingLogs] = useState([
        {
            week: 1,
            sessions: 4,
            totalVolume: 120, // sets
            averageIntensity: 75, // % 1RM
            rpe: 7.2,
            compliance: 100
        },
        {
            week: 2, 
            sessions: 4,
            totalVolume: 130,
            averageIntensity: 78,
            rpe: 7.8,
            compliance: 95
        },
        {
            week: 3,
            sessions: 4,
            totalVolume: 140,
            averageIntensity: 80,
            rpe: 8.1,
            compliance: 90
        }
    ]);

    // Assessment data for fatigue score calculation
    const [fatigueAssessments, setFatigueAssessments] = useState([
        {
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            fuel: 4,
            nervous: 3,
            messengers: 3,
            tissues: 4,
            sleepQuality: 7,
            motivation: 6,
            overallFatigue: 4.0
        },
        {
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            fuel: 3,
            nervous: 4,
            messengers: 3,
            tissues: 3,
            sleepQuality: 8,
            motivation: 7,
            overallFatigue: 3.3
        }
    ]);

    const [tapering, setTapering] = useState({
        enabled: true,
        startWeek: 14,
        volumeReduction: 50,
        intensityMaintenance: 90
    });

    // Data integration functions for FF Model
    const calculateFitnessFromLogs = (logs) => {
        try {
            if (!logs || logs.length === 0) {
                console.warn('No training logs available for fitness calculation');
                return 100; // Default baseline
            }

            const recentLogs = logs.slice(-4); // Last 4 weeks
            const avgVolume = recentLogs.reduce((sum, log) => sum + log.totalVolume, 0) / recentLogs.length;
            const avgIntensity = recentLogs.reduce((sum, log) => sum + log.averageIntensity, 0) / recentLogs.length;
            const avgCompliance = recentLogs.reduce((sum, log) => sum + log.compliance, 0) / recentLogs.length;

            // Bryant FF Model: Fitness = f(Volume, Intensity, Consistency, Time)
            const volumeComponent = Math.min(100, (avgVolume / 100) * 40); // 40% weight
            const intensityComponent = Math.min(100, (avgIntensity / 85) * 30); // 30% weight
            const complianceComponent = (avgCompliance / 100) * 30; // 30% weight

            return Math.round(volumeComponent + intensityComponent + complianceComponent);
        } catch (error) {
            console.error('Error calculating fitness from logs:', error);
            return fatigueMetrics.fitnessScore; // Return current value on error
        }
    };

    const calculateFatigueFromAssessments = (assessments) => {
        try {
            if (!assessments || assessments.length === 0) {
                console.warn('No fatigue assessments available');
                return 0; // Default no fatigue
            }

            const recentAssessment = assessments[0]; // Most recent
            const { fuel, nervous, messengers, tissues, sleepQuality } = recentAssessment;

            // Bryant 4-category fatigue model
            const fatigueCategories = [fuel, nervous, messengers, tissues];
            const avgFatigue = fatigueCategories.reduce((sum, score) => sum + score, 0) / 4;

            // Sleep quality inverse relationship (poor sleep = more fatigue)
            const sleepFactor = Math.max(0, (10 - sleepQuality) / 10);

            // Convert to 0-100 scale (higher = more fatigued)
            const fatigueScore = ((avgFatigue / 10) * 70) + (sleepFactor * 30);
            
            return Math.round(Math.min(100, fatigueScore));
        } catch (error) {
            console.error('Error calculating fatigue from assessments:', error);
            return fatigueMetrics.fatigueScore; // Return current value on error
        }
    };

    // Integration with fatigue.js algorithms
    const integrateFrequencyAnalysis = async () => {
        try {
            // Simulate fatigue.js analyzeFrequency function
            const recentAssessment = fatigueAssessments[0];
            if (!recentAssessment) return;

            const sorenessLevel = (recentAssessment.tissues / 10) * 7; // Convert to days
            const currentGap = 2; // Assume every other day training

            const recoveryRatio = sorenessLevel / currentGap;
            
            setFatigueMetrics(prev => ({
                ...prev,
                sorenessRecoveryDays: Math.round(sorenessLevel),
                currentSessionGap: currentGap,
                recoveryRatio: Math.round(recoveryRatio * 100) / 100,
                frequencyOptimal: recoveryRatio >= 0.7 && recoveryRatio <= 1.3
            }));
        } catch (error) {
            console.error('Error integrating frequency analysis:', error);
        }
    };

    // Update FF Model with real data
    useEffect(() => {
        try {
            const calculatedFitness = calculateFitnessFromLogs(trainingLogs);
            const calculatedFatigue = calculateFatigueFromAssessments(fatigueAssessments);
            const netReadiness = Math.max(0, calculatedFitness - calculatedFatigue);

            setFatigueMetrics(prev => ({
                ...prev,
                fitnessScore: calculatedFitness,
                fatigueScore: calculatedFatigue,
                netReadiness,
                lastUpdated: new Date().toISOString()
            }));

            // Integrate frequency analysis
            integrateFrequencyAnalysis();
        } catch (error) {
            console.error('Error updating FF Model:', error);
            // Continue with current values - don't crash the component
        }
    }, [trainingLogs, fatigueAssessments]);

    // Enhanced FF Model component with supercompensation tracking
    const EnhancedFitnessFatigueTracker = () => {
        const [showDetails, setShowDetails] = useState(false);
        const [supercompensationPhase, setSupercompensationPhase] = useState('loading');

        // Determine supercompensation phase
        useEffect(() => {
            const { fitnessScore, fatigueScore, netReadiness } = fatigueMetrics;
            
            if (fatigueScore > fitnessScore) {
                setSupercompensationPhase('overreaching'); // Fatigue > Fitness
            } else if (netReadiness > 85) {
                setSupercompensationPhase('supercompensation'); // Peak readiness
            } else if (netReadiness < 60) {
                setSupercompensationPhase('fatigue_accumulation');
            } else {
                setSupercompensationPhase('adaptation'); // Normal training
            }
        }, [fatigueMetrics]);

        const getPhaseColor = (phase) => {
            switch (phase) {
                case 'supercompensation': return 'text-green-400 bg-green-900/20 border-green-500';
                case 'adaptation': return 'text-blue-400 bg-blue-900/20 border-blue-500';
                case 'overreaching': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
                case 'fatigue_accumulation': return 'text-red-400 bg-red-900/20 border-red-500';
                default: return 'text-gray-400 bg-gray-900/20 border-gray-500';
            }
        };

        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                        Fitness-Fatigue Model Dashboard
                    </h3>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>

                {/* Supercompensation Phase Indicator */}
                <div className={`rounded-lg p-4 mb-6 border ${getPhaseColor(supercompensationPhase)}`}>
                    <h4 className="font-semibold text-lg mb-2">
                        Current Phase: {supercompensationPhase.replace('_', ' ').toUpperCase()}
                    </h4>
                    <p className="text-sm opacity-90">
                        {(() => {
                            switch (supercompensationPhase) {
                                case 'supercompensation':
                                    return 'Optimal performance window - consider testing or competing';
                                case 'adaptation':
                                    return 'Normal training adaptations occurring';
                                case 'overreaching':
                                    return 'Functional overreaching - recovery needed soon';
                                case 'fatigue_accumulation':
                                    return 'High fatigue - deload recommended';
                                default:
                                    return 'Monitoring training response...';
                            }
                        })()}
                    </p>
                </div>

                {/* Main FF Model Display */}
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                    <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 text-center">
                        <h4 className="text-blue-400 font-medium mb-2">💪 FITNESS</h4>
                        <div className="text-3xl font-bold text-white mb-1">
                            {fatigueMetrics.fitnessScore}%
                        </div>
                        <p className="text-xs text-gray-400">
                            From training logs
                        </p>
                    </div>

                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
                        <h4 className="text-red-400 font-medium mb-2">😴 FATIGUE</h4>
                        <div className="text-3xl font-bold text-white mb-1">
                            {fatigueMetrics.fatigueScore}%
                        </div>
                        <p className="text-xs text-gray-400">
                            From assessments
                        </p>
                    </div>

                    <div className={`border rounded-lg p-4 text-center ${
                        fatigueMetrics.netReadiness >= 80 ? 'bg-green-900/20 border-green-500' :
                        fatigueMetrics.netReadiness >= 60 ? 'bg-yellow-900/20 border-yellow-500' :
                        'bg-red-900/20 border-red-500'
                    }`}>
                        <h4 className="font-medium mb-2">⚡ NET READINESS</h4>
                        <div className="text-3xl font-bold text-white mb-1">
                            {fatigueMetrics.netReadiness}%
                        </div>
                        <p className="text-xs text-gray-400">
                            Fitness - Fatigue
                        </p>
                    </div>
                </div>

                {/* Detailed metrics when expanded */}
                {showDetails && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Detailed Analysis</h4>
                        
                        {/* Frequency Analysis Integration */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-white mb-3">Frequency Analysis (from fatigue.js)</h5>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-300">
                                        <strong>Recovery Ratio:</strong> {fatigueMetrics.recoveryRatio}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        <strong>Soreness Recovery:</strong> {fatigueMetrics.sorenessRecoveryDays} days
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">
                                        <strong>Session Gap:</strong> {fatigueMetrics.currentSessionGap} days
                                    </p>
                                    <p className={`text-sm font-medium ${
                                        fatigueMetrics.frequencyOptimal ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        <strong>Frequency:</strong> {fatigueMetrics.frequencyOptimal ? 'Optimal' : 'Needs Adjustment'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Training Load Trends */}
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-white mb-3">Recent Training Data</h5>
                            {trainingLogs.slice(-2).map((log, index) => (
                                <div key={index} className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">Week {log.week}:</span>
                                    <span className="text-white">
                                        {log.totalVolume} sets, {log.averageIntensity}% intensity, RPE {log.rpe}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Latest Assessment */}
                        {fatigueAssessments[0] && (
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h5 className="font-medium text-white mb-3">Latest Fatigue Assessment</h5>
                                <div className="grid gap-2 md:grid-cols-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Fuel:</span>
                                        <span className="text-white ml-1">{fatigueAssessments[0].fuel}/10</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Nervous:</span>
                                        <span className="text-white ml-1">{fatigueAssessments[0].nervous}/10</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Hormonal:</span>
                                        <span className="text-white ml-1">{fatigueAssessments[0].messengers}/10</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Tissue:</span>
                                        <span className="text-white ml-1">{fatigueAssessments[0].tissues}/10</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-4 text-xs text-gray-500 text-center">
                    Last updated: {new Date(fatigueMetrics.lastUpdated).toLocaleString()}
                </div>
            </div>
        );
    };

    const [evaluationMetrics, setEvaluationMetrics] = useState([
        { metric: '1RM Squat', baseline: 315, current: 315, target: 350, unit: 'lbs' },
        { metric: '1RM Bench Press', baseline: 225, current: 225, target: 250, unit: 'lbs' },
        { metric: '1RM Deadlift', baseline: 405, current: 405, target: 450, unit: 'lbs' },
        { metric: 'Body Weight', baseline: 180, current: 180, target: 185, unit: 'lbs' }
    ]);

    const implementationPhases = [
        {
            phase: 'planning',
            name: 'Final Planning',
            description: 'Review and finalize program details',
            tasks: [
                'Review all program phases',
                'Confirm exercise selections',
                'Schedule testing dates',
                'Prepare monitoring tools'
            ]
        },
        {
            phase: 'execution',
            name: 'Program Execution',
            description: 'Active training phase',
            tasks: [
                'Follow prescribed training',
                'Monitor daily readiness',
                'Track performance metrics',
                'Adjust loads as needed'
            ]
        },
        {
            phase: 'evaluation',
            name: 'Evaluation & Refinement',
            description: 'Assess results and plan next cycle',
            tasks: [
                'Conduct final testing',
                'Analyze performance gains',
                'Identify areas for improvement',
                'Plan next macrocycle'
            ]
        }
    ];

    const progressTracking = {
        volumeLoad: [
            { week: 1, load: 12500 },
            { week: 2, load: 13000 },
            { week: 3, load: 13500 },
            { week: 4, load: 10000 }, // Deload
            { week: 5, load: 14000 },
            { week: 6, load: 14500 },
            { week: 7, load: 15000 },
            { week: 8, load: 11000 }  // Deload
        ],
        rpeAverage: [
            { week: 1, rpe: 7.2 },
            { week: 2, rpe: 7.8 },
            { week: 3, rpe: 8.1 },
            { week: 4, rpe: 6.5 },
            { week: 5, rpe: 7.9 },
            { week: 6, rpe: 8.3 },
            { week: 7, rpe: 8.6 },
            { week: 8, rpe: 6.8 }
        ]
    };

    const adjustmentGuidelines = [
        {
            scenario: 'Performance Decline',
            indicators: ['Decreased velocity', 'Higher RPE for same loads', 'Poor recovery'],
            action: 'Reduce volume 20-30%, maintain intensity, add recovery day'
        },
        {
            scenario: 'Excessive Fatigue',
            indicators: ['Elevated RHR', 'Poor sleep', 'Low motivation'],
            action: 'Implement deload week, focus on sleep/nutrition'
        },
        {
            scenario: 'Plateau in Progress',
            indicators: ['No strength gains 2+ weeks', 'Same velocity/RPE'],
            action: 'Increase intensity 2.5-5%, vary exercises, check technique'
        },
        {
            scenario: 'Injury/Pain',
            indicators: ['Joint pain', 'Movement dysfunction', 'Compensation patterns'],
            action: 'Modify exercises, reduce ROM, seek professional assessment'
        }
    ];

    const exportProgram = () => {
        const programSummary = {
            name: programData.name,
            duration: programData.duration,
            phases: implementationPhases,
            tapering: tapering,
            metrics: evaluationMetrics,
            created: new Date().toISOString()
        };

        const dataStr = JSON.stringify(programSummary, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `${programData.name.replace(/\s+/g, '_')}_Program.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const getProgressPercentage = () => {
        return ((programData.completedSessions / programData.totalSessions) * 100).toFixed(1);
    };

    const getCurrentPhaseColor = (phase) => {
        switch (phase) {
            case 'planning': return 'blue';
            case 'execution': return 'green';
            case 'evaluation': return 'purple';
            default: return 'gray';
        }
    };

    return (
        <div className="space-y-6">
            {/* Implementation Status */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <Play className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Implementation Status</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {implementationPhases.map((phase) => (
                        <div
                            key={phase.phase}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${implementationPhase === phase.phase
                                    ? `border-${getCurrentPhaseColor(phase.phase)}-500 bg-${getCurrentPhaseColor(phase.phase)}-900/30`
                                    : 'border-gray-500 hover:border-gray-400 bg-gray-600'
                                }`}
                            onClick={() => setImplementationPhase(phase.phase)}
                        >
                            <h4 className="font-semibold text-white mb-2">{phase.name}</h4>
                            <p className="text-sm text-gray-300 mb-3">{phase.description}</p>
                            <ul className="text-xs text-gray-400 space-y-1">
                                {phase.tasks.map((task, index) => (
                                    <li key={index}>• {task}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Program Overview */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Program Overview</h3>
                    </div>
                    <button
                        onClick={exportProgram}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Export Program
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-300">Program Name</h4>
                        <p className="text-lg font-semibold text-white">{programData.name}</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-300">Duration</h4>
                        <p className="text-lg font-semibold text-white">{programData.duration} weeks</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-300">Current Week</h4>
                        <p className="text-lg font-semibold text-white">{programData.currentWeek} of {programData.duration}</p>
                    </div>
                    <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-300">Progress</h4>
                        <p className="text-lg font-semibold text-white">{getProgressPercentage()}%</p>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Program Progress</span>
                        <span className="text-sm text-gray-400">
                            {programData.completedSessions} / {programData.totalSessions} sessions
                        </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage()}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Performance Tracking */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Performance Tracking</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Evaluation Metrics */}
                    <div>
                        <h4 className="font-semibold text-white mb-3">Key Performance Indicators</h4>
                        <div className="space-y-3">
                            {evaluationMetrics.map((metric, index) => {
                                const progress = ((metric.current - metric.baseline) / (metric.target - metric.baseline)) * 100;
                                const progressClamped = Math.max(0, Math.min(100, progress));

                                return (
                                    <div key={index} className="bg-gray-600 p-3 rounded border border-gray-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="text-sm font-medium text-white">{metric.metric}</h5>
                                            <span className="text-sm text-gray-300">
                                                {metric.current} / {metric.target} {metric.unit}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${progressClamped >= 100 ? 'bg-green-500' :
                                                        progressClamped >= 75 ? 'bg-blue-500' :
                                                            progressClamped >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${progressClamped}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Baseline: {metric.baseline} {metric.unit}</span>
                                            <span>{progressClamped.toFixed(1)}% to goal</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Weekly Trends */}
                    <div>
                        <h4 className="font-semibold text-white mb-3">Weekly Trends</h4>
                        <div className="space-y-4">
                            <div className="bg-gray-600 p-3 rounded border border-gray-500">
                                <h5 className="text-sm font-medium text-white mb-2">Volume Load Trend</h5>
                                <div className="text-xs text-gray-300">
                                    Last 4 weeks: {progressTracking.volumeLoad.slice(-4).map(w => w.load).join(' → ')} kg
                                </div>
                            </div>

                            <div className="bg-gray-600 p-3 rounded border border-gray-500">
                                <h5 className="text-sm font-medium text-white mb-2">Average RPE Trend</h5>
                                <div className="text-xs text-gray-300">
                                    Last 4 weeks: {progressTracking.rpeAverage.slice(-4).map(w => w.rpe).join(' → ')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tapering Protocol */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Tapering Protocol</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-white mb-2">
                            <input
                                type="checkbox"
                                checked={tapering.enabled}
                                onChange={(e) => setTapering(prev => ({ ...prev, enabled: e.target.checked }))}
                                className="rounded"
                            />
                            Enable Tapering
                        </label>
                    </div>

                    {tapering.enabled && (
                        <>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Start Week</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={programData.duration}
                                    className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={tapering.startWeek}
                                    onChange={(e) => setTapering(prev => ({ ...prev, startWeek: parseInt(e.target.value) }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Volume Reduction (%)</label>
                                <input
                                    type="number"
                                    min="20"
                                    max="80"
                                    className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={tapering.volumeReduction}
                                    onChange={(e) => setTapering(prev => ({ ...prev, volumeReduction: parseInt(e.target.value) }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Intensity Maintenance (%)</label>
                                <input
                                    type="number"
                                    min="70"
                                    max="100"
                                    className="w-full px-2 py-1 bg-red-600 border border-gray-500 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                                    value={tapering.intensityMaintenance}
                                    onChange={(e) => setTapering(prev => ({ ...prev, intensityMaintenance: parseInt(e.target.value) }))}
                                />
                            </div>
                        </>
                    )}
                </div>

                {tapering.enabled && (
                    <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-500 rounded">
                        <p className="text-yellow-200 text-sm">
                            <strong>Tapering Guidelines:</strong> Starting week {tapering.startWeek}, reduce training volume by {tapering.volumeReduction}%
                            while maintaining intensity at {tapering.intensityMaintenance}% to peak for competition.
                        </p>
                    </div>
                )}
            </div>

            {/* Adjustment Guidelines */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">Program Adjustments</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {adjustmentGuidelines.map((guideline, index) => (
                        <div key={index} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                            <h4 className="font-semibold text-white mb-2">{guideline.scenario}</h4>

                            <div className="mb-3">
                                <h5 className="text-sm text-orange-400 mb-1">Indicators:</h5>
                                <ul className="text-xs text-gray-300 space-y-0.5">
                                    {guideline.indicators.map((indicator, i) => (
                                        <li key={i}>• {indicator}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-sm text-green-400 mb-1">Recommended Action:</h5>
                                <p className="text-xs text-gray-300">{guideline.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Summary */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Implementation Checklist</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-green-400 mb-2">Before Starting</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>✓ Assessment completed</li>
                            <li>✓ Goals established</li>
                            <li>✓ Macrocycle planned</li>
                            <li>✓ Phases designed</li>
                            <li>✓ Mesocycles sequenced</li>
                            <li>✓ Microcycles structured</li>
                            <li>✓ Monitoring protocols set</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-blue-400 mb-2">During Execution</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Track daily readiness</li>
                            <li>• Monitor performance markers</li>
                            <li>• Adjust loads based on RPE/velocity</li>
                            <li>• Implement deloads as planned</li>
                            <li>• Address issues early</li>
                            <li>• Stay consistent with basics</li>
                            <li>• Prepare for competition taper</li>
                        </ul>
                    </div>
                </div>
            </div>

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
                        Step 7 of 7: Implementation Complete
                    </div>

                    <button
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        onClick={() => alert('Program design complete! Ready for implementation.')}
                    >
                        Start Program
                        <Play className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Implementation;

