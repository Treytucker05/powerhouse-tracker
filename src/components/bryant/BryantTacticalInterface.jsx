/**
 * Bryant Tactical Applications Interface
 * Specialized UI for operational readiness and tactical training integration
 * Combines strongman events with tactical scenarios and assessment protocols
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Target, Clock, Users, MapPin, Activity, AlertTriangle, CheckCircle, Star } from 'lucide-react';

const BryantTacticalInterface = ({
    onMissionUpdate,
    onAssessmentComplete,
    experienceLevel = 'intermediate',
    unit = 'individual',
    environment = 'urban'
}) => {
    // Tactical mission state
    const [selectedMission, setSelectedMission] = useState(null);
    const [missionConfig, setMissionConfig] = useState({
        duration: 30,
        personnel: 1,
        environment: environment,
        difficulty: 'moderate',
        objectives: []
    });
    const [performanceMetrics, setPerformanceMetrics] = useState({});
    const [readinessAssessment, setReadinessAssessment] = useState(null);
    const [trainingPhase, setTrainingPhase] = useState('preparation'); // preparation, execution, recovery

    // Bryant tactical mission library
    const tacticalMissions = {
        fire_team_movement: {
            name: 'Fire Team Movement',
            category: 'movement',
            difficulty: 'moderate',
            duration: 45,
            personnel: 4,
            environment: ['urban', 'rural', 'desert'],
            objectives: [
                'Bound and overwatch movement',
                'Load bearing endurance',
                'Communication under stress',
                'Tactical decision making'
            ],
            strongmanEvents: ['farmers_walk', 'sandbag_carry', 'sled_push'],
            fitnessRequirements: {
                cardiovascular: 'high',
                strength: 'high',
                endurance: 'high',
                agility: 'moderate'
            },
            bryantNotes: 'Emphasizes functional strength under tactical load',
            assessmentCriteria: {
                movement_speed: { min: 4.5, target: 6.0, unit: 'mph' },
                load_capacity: { min: 80, target: 120, unit: 'lbs' },
                endurance_time: { min: 30, target: 60, unit: 'minutes' }
            }
        },
        breach_and_clear: {
            name: 'Breach and Clear',
            category: 'explosive',
            difficulty: 'high',
            duration: 20,
            personnel: 6,
            environment: ['urban'],
            objectives: [
                'Explosive door breach',
                'Room clearing protocols',
                'Team coordination',
                'Equipment management'
            ],
            strongmanEvents: ['tire_flip', 'log_press', 'atlas_stones'],
            fitnessRequirements: {
                cardiovascular: 'moderate',
                strength: 'very_high',
                endurance: 'moderate',
                agility: 'high'
            },
            bryantNotes: 'Develops explosive power for dynamic entries',
            assessmentCriteria: {
                breach_time: { min: 15, target: 8, unit: 'seconds' },
                clear_time: { min: 45, target: 25, unit: 'seconds' },
                accuracy: { min: 70, target: 90, unit: 'percent' }
            }
        },
        casualty_evacuation: {
            name: 'Casualty Evacuation',
            category: 'carrying',
            difficulty: 'high',
            duration: 35,
            personnel: 2,
            environment: ['urban', 'rural', 'desert', 'mountain'],
            objectives: [
                'Casualty assessment',
                'Medical stabilization',
                'Evacuation carry',
                'Navigation under load'
            ],
            strongmanEvents: ['farmers_walk', 'yoke_walk', 'sandbag_carry'],
            fitnessRequirements: {
                cardiovascular: 'high',
                strength: 'very_high',
                endurance: 'very_high',
                agility: 'moderate'
            },
            bryantNotes: 'Ultimate test of functional strength and endurance',
            assessmentCriteria: {
                carry_distance: { min: 400, target: 800, unit: 'meters' },
                carry_speed: { min: 2.5, target: 4.0, unit: 'mph' },
                medical_accuracy: { min: 80, target: 95, unit: 'percent' }
            }
        },
        patrol_operations: {
            name: 'Patrol Operations',
            category: 'endurance',
            difficulty: 'moderate',
            duration: 120,
            personnel: 8,
            environment: ['rural', 'desert', 'mountain'],
            objectives: [
                'Long-range movement',
                'Load bearing march',
                'Observation protocols',
                'Stealth movement'
            ],
            strongmanEvents: ['farmers_walk', 'sled_pull', 'sandbag_carry'],
            fitnessRequirements: {
                cardiovascular: 'very_high',
                strength: 'high',
                endurance: 'very_high',
                agility: 'moderate'
            },
            bryantNotes: 'Builds endurance strength for extended operations',
            assessmentCriteria: {
                patrol_distance: { min: 8, target: 15, unit: 'km' },
                load_weight: { min: 60, target: 90, unit: 'lbs' },
                stealth_rating: { min: 6, target: 9, unit: 'out_of_10' }
            }
        },
        vehicle_recovery: {
            name: 'Vehicle Recovery',
            category: 'pulling',
            difficulty: 'high',
            duration: 25,
            personnel: 4,
            environment: ['desert', 'mountain', 'rural'],
            objectives: [
                'Vehicle assessment',
                'Recovery rigging',
                'Coordinated pulling',
                'Safety protocols'
            ],
            strongmanEvents: ['sled_pull', 'tire_flip', 'yoke_walk'],
            fitnessRequirements: {
                cardiovascular: 'moderate',
                strength: 'very_high',
                endurance: 'high',
                agility: 'low'
            },
            bryantNotes: 'Develops team pulling strength and coordination',
            assessmentCriteria: {
                pull_force: { min: 2000, target: 4000, unit: 'lbs' },
                setup_time: { min: 15, target: 8, unit: 'minutes' },
                team_coordination: { min: 7, target: 9, unit: 'out_of_10' }
            }
        },
        urban_assault: {
            name: 'Urban Assault',
            category: 'mixed',
            difficulty: 'very_high',
            duration: 60,
            personnel: 12,
            environment: ['urban'],
            objectives: [
                'Multi-story movement',
                'Obstacle negotiation',
                'Team coordination',
                'Equipment portage'
            ],
            strongmanEvents: ['atlas_stones', 'log_press', 'farmers_walk'],
            fitnessRequirements: {
                cardiovascular: 'high',
                strength: 'very_high',
                endurance: 'high',
                agility: 'very_high'
            },
            bryantNotes: 'Comprehensive test of all physical domains',
            assessmentCriteria: {
                building_clear_time: { min: 12, target: 6, unit: 'minutes' },
                obstacle_completion: { min: 80, target: 100, unit: 'percent' },
                team_efficiency: { min: 7, target: 9, unit: 'out_of_10' }
            }
        }
    };

    // Get mission recommendations based on experience and environment
    const getRecommendedMissions = useCallback(() => {
        return Object.entries(tacticalMissions).filter(([key, mission]) => {
            // Filter by environment
            const environmentMatch = mission.environment.includes(environment);

            // Filter by experience level
            const difficultyScore = {
                'easy': 1,
                'moderate': 2,
                'high': 3,
                'very_high': 4
            };

            const experienceScore = {
                'beginner': 2,
                'intermediate': 3,
                'advanced': 4
            };

            const difficultyMatch = difficultyScore[mission.difficulty] <= experienceScore[experienceLevel];

            return environmentMatch && difficultyMatch;
        }).sort((a, b) => {
            // Prioritize by difficulty match
            const diffOrder = ['easy', 'moderate', 'high', 'very_high'];
            return diffOrder.indexOf(a[1].difficulty) - diffOrder.indexOf(b[1].difficulty);
        });
    }, [environment, experienceLevel]);

    // Calculate readiness assessment
    const calculateReadinessAssessment = useCallback(async (missionType) => {
        const mission = tacticalMissions[missionType];
        if (!mission) return null;

        // Mock assessment - in real implementation, this would integrate with fitness data
        const assessment = {
            overall_readiness: 75,
            strength_readiness: 80,
            endurance_readiness: 70,
            agility_readiness: 85,
            experience_factor: experienceLevel === 'advanced' ? 95 :
                experienceLevel === 'intermediate' ? 75 : 55,
            mission_specific_training: 65,
            recommendations: []
        };

        // Generate specific recommendations
        if (assessment.strength_readiness < 80) {
            assessment.recommendations.push('Focus on ' + mission.strongmanEvents.join(', ') + ' training');
        }

        if (assessment.endurance_readiness < 70) {
            assessment.recommendations.push('Increase cardiovascular conditioning');
        }

        if (assessment.experience_factor < 70) {
            assessment.recommendations.push('Complete prerequisite tactical training');
        }

        return assessment;
    }, [experienceLevel]);

    // Select mission and calculate readiness
    const selectMission = async (missionType) => {
        const mission = tacticalMissions[missionType];
        setSelectedMission({ type: missionType, ...mission });

        // Update mission config with defaults
        setMissionConfig({
            duration: mission.duration,
            personnel: mission.personnel,
            environment: environment,
            difficulty: mission.difficulty,
            objectives: mission.objectives
        });

        // Calculate readiness assessment
        const assessment = await calculateReadinessAssessment(missionType);
        setReadinessAssessment(assessment);
    };

    // Update mission configuration
    const updateMissionConfig = (field, value) => {
        setMissionConfig(prev => ({ ...prev, [field]: value }));
    };

    // Get readiness color based on score
    const getReadinessColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 75) return 'text-blue-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    // Get readiness bar width
    const getReadinessBarWidth = (score) => {
        return Math.min(Math.max(score, 0), 100);
    };

    return (
        <div className="bryant-tactical-interface bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-400" />
                        Bryant Tactical Applications
                    </h2>
                    <p className="text-gray-400 text-sm">Operational readiness and tactical training integration</p>
                </div>
                {readinessAssessment && (
                    <div className="text-right">
                        <div className={`text-lg font-semibold ${getReadinessColor(readinessAssessment.overall_readiness)}`}>
                            {readinessAssessment.overall_readiness}% Ready
                        </div>
                        <div className="text-sm text-gray-400">Mission Readiness</div>
                    </div>
                )}
            </div>

            {/* Environment and Personnel Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Environment</label>
                    <select
                        value={environment}
                        onChange={(e) => updateMissionConfig('environment', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="urban">Urban</option>
                        <option value="rural">Rural</option>
                        <option value="desert">Desert</option>
                        <option value="mountain">Mountain</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Unit Type</label>
                    <select
                        value={unit}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="individual">Individual</option>
                        <option value="fire_team">Fire Team (4)</option>
                        <option value="squad">Squad (8)</option>
                        <option value="platoon">Platoon (32)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Experience Level</label>
                    <select
                        value={experienceLevel}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="beginner">Recruit</option>
                        <option value="intermediate">Experienced</option>
                        <option value="advanced">Elite</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Training Phase</label>
                    <select
                        value={trainingPhase}
                        onChange={(e) => setTrainingPhase(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="preparation">Preparation</option>
                        <option value="execution">Execution</option>
                        <option value="recovery">Recovery</option>
                    </select>
                </div>
            </div>

            {/* Mission Selection */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Available Missions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getRecommendedMissions().map(([missionType, mission]) => (
                        <div
                            key={missionType}
                            className={`bg-gray-700 border rounded-lg p-4 cursor-pointer transition-all ${selectedMission?.type === missionType
                                    ? 'border-blue-500 bg-blue-900/20'
                                    : 'border-gray-600 hover:border-gray-500'
                                }`}
                            onClick={() => selectMission(missionType)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-white">{mission.name}</h4>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-400">{mission.personnel}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-400">{mission.duration} min</span>
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-400">
                                    {mission.environment.join(', ')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded ${mission.difficulty === 'easy' ? 'bg-green-900 text-green-300' :
                                        mission.difficulty === 'moderate' ? 'bg-blue-900 text-blue-300' :
                                            mission.difficulty === 'high' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-red-900 text-red-300'
                                    }`}>
                                    {mission.difficulty.replace('_', ' ')}
                                </span>
                                <div className="flex gap-1">
                                    {mission.strongmanEvents.slice(0, 2).map((event, idx) => (
                                        <span key={idx} className="text-xs bg-gray-600 text-gray-300 px-1 py-0.5 rounded">
                                            {event.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Mission Details */}
            {selectedMission && (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Mission: {selectedMission.name}</h3>

                    {/* Mission Objectives */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Mission Objectives</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedMission.objectives.map((objective, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-400" />
                                    <span className="text-gray-300 text-sm">{objective}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fitness Requirements */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Fitness Requirements</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(selectedMission.fitnessRequirements).map(([category, level]) => (
                                <div key={category} className="text-center">
                                    <div className="text-sm text-gray-400 mb-1 capitalize">
                                        {category.replace('_', ' ')}
                                    </div>
                                    <div className={`text-lg font-semibold ${level === 'very_high' ? 'text-red-400' :
                                            level === 'high' ? 'text-orange-400' :
                                                level === 'moderate' ? 'text-yellow-400' :
                                                    'text-green-400'
                                        }`}>
                                        {level.replace('_', ' ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Strongman Events */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Recommended Training Events</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedMission.strongmanEvents.map((event, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-2 bg-blue-900 text-blue-300 rounded-lg text-sm font-medium"
                                >
                                    {event.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            ))}
                        </div>
                        <div className="mt-3 text-sm text-blue-300 bg-blue-900/20 p-2 rounded">
                            {selectedMission.bryantNotes}
                        </div>
                    </div>

                    {/* Assessment Criteria */}
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Assessment Criteria</h4>
                        <div className="space-y-3">
                            {Object.entries(selectedMission.assessmentCriteria).map(([metric, criteria]) => (
                                <div key={metric} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-white font-medium capitalize">
                                            {metric.replace('_', ' ')}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Min: {criteria.min} {criteria.unit} | Target: {criteria.target} {criteria.unit}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-600 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: '60%' }}
                                            ></div>
                                        </div>
                                        <span className="text-blue-400 text-sm w-12 text-right">60%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Readiness Assessment */}
            {readinessAssessment && (
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Mission Readiness Assessment
                    </h3>

                    {/* Overall Readiness */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Overall Readiness</span>
                            <span className={`font-bold ${getReadinessColor(readinessAssessment.overall_readiness)}`}>
                                {readinessAssessment.overall_readiness}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full ${readinessAssessment.overall_readiness >= 90 ? 'bg-green-500' :
                                        readinessAssessment.overall_readiness >= 75 ? 'bg-blue-500' :
                                            readinessAssessment.overall_readiness >= 60 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                    }`}
                                style={{ width: `${getReadinessBarWidth(readinessAssessment.overall_readiness)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {[
                            { key: 'strength_readiness', label: 'Strength' },
                            { key: 'endurance_readiness', label: 'Endurance' },
                            { key: 'agility_readiness', label: 'Agility' },
                            { key: 'experience_factor', label: 'Experience' }
                        ].map(({ key, label }) => (
                            <div key={key} className="text-center">
                                <div className="text-sm text-gray-400 mb-1">{label}</div>
                                <div className={`text-lg font-semibold ${getReadinessColor(readinessAssessment[key])}`}>
                                    {readinessAssessment[key]}%
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                                    <div
                                        className="bg-blue-500 h-1 rounded-full"
                                        style={{ width: `${getReadinessBarWidth(readinessAssessment[key])}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recommendations */}
                    {readinessAssessment.recommendations.length > 0 && (
                        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-3">
                            <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Training Recommendations
                            </h4>
                            <ul className="space-y-1">
                                {readinessAssessment.recommendations.map((rec, index) => (
                                    <li key={index} className="text-yellow-300 text-sm">• {rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                {selectedMission && (
                    <>
                        <button
                            onClick={() => calculateReadinessAssessment(selectedMission.type)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Activity className="h-4 w-4" />
                            Reassess Readiness
                        </button>
                        {readinessAssessment?.overall_readiness >= 75 && onMissionUpdate && (
                            <button
                                onClick={() => onMissionUpdate({
                                    mission: selectedMission,
                                    config: missionConfig,
                                    readiness: readinessAssessment
                                })}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Deploy Mission
                            </button>
                        )}
                        {readinessAssessment?.overall_readiness < 75 && (
                            <button
                                disabled
                                className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                Insufficient Readiness
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BryantTacticalInterface;
