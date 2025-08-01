/**
 * Linear Periodization with Bromley Wave Integration
 * Implements classic linear progression enhanced with Bromley's wave periodization
 * Specifically designed for Motor Control and General Fitness goals
 */

import { BromleyWaveProgression, BROMLEY_PHASES } from './bromleyProgression.js';

export class LinearPeriodizationBromley {

    constructor(goal = 'motor_control', experience_level = 'intermediate') {
        this.goal = goal;
        this.experience_level = experience_level;
        this.phase_duration = 12; // weeks
        this.wave_length = 3; // weeks per wave
    }

    /**
     * Motor Control Focus Linear Periodization
     * Emphasizes movement quality, stability, and coordination
     */
    static generateMotorControlProgram(starting1RM, duration_weeks = 12) {
        const phases = Math.floor(duration_weeks / 6);
        const program = [];

        for (let phase = 1; phase <= phases; phase++) {
            if (phase === 1) {
                // Phase 1: Movement Base (Weeks 1-6)
                program.push({
                    phase: 1,
                    name: 'Movement Base Building',
                    weeks: [1, 6],
                    focus: 'coordination_endurance',
                    intensity_range: [55, 65],
                    rep_ranges: [10, 15],
                    sets_range: [3, 4],
                    exercise_type: 'movement_quality',
                    wave_type: 'volumizing',
                    waves: LinearPeriodizationBromley.generateMovementBaseWaves(starting1RM)
                });
            } else {
                // Phase 2: Movement Strength (Weeks 7-12)
                program.push({
                    phase: 2,
                    name: 'Loaded Movement Quality',
                    weeks: [7, 12],
                    focus: 'loaded_movement_quality',
                    intensity_range: [70, 85],
                    rep_ranges: [5, 8],
                    sets_range: [3, 5],
                    exercise_type: 'strength_stability',
                    wave_type: 'intensifying',
                    waves: LinearPeriodizationBromley.generateMovementStrengthWaves(starting1RM)
                });
            }
        }

        return program;
    }

    /**
     * Movement Base Waves: Focus on coordination and endurance
     */
    static generateMovementBaseWaves(oneRepMax) {
        const waves = [];
        const basePercent = 55;

        for (let wave = 1; wave <= 2; wave++) {
            const waveStart = basePercent + ((wave - 1) * 5);
            const progression = BromleyWaveProgression.volumizingWave(3, 12, waveStart);

            waves.push({
                wave_number: wave,
                weeks: [(wave - 1) * 3 + 1, wave * 3],
                progression: BromleyWaveProgression.calculateWaveTonnage(oneRepMax, progression),
                focus: [
                    'Movement pattern establishment',
                    'Stability development',
                    'Coordination improvement',
                    'Work capacity building'
                ],
                exercises: [
                    'Goblet squats',
                    'Single-leg movements',
                    'Overhead carries',
                    'Core stability work',
                    'Unilateral pressing'
                ]
            });
        }

        return waves;
    }

    /**
     * Movement Strength Waves: Focus on loaded movement quality
     */
    static generateMovementStrengthWaves(oneRepMax) {
        const waves = [];
        const basePercent = 70;

        for (let wave = 1; wave <= 2; wave++) {
            const waveStart = basePercent + ((wave - 1) * 5);
            const progression = BromleyWaveProgression.intensifyingWave(4, 6, waveStart);

            waves.push({
                wave_number: wave,
                weeks: [((wave - 1) * 3 + 7), (wave * 3 + 6)],
                progression: BromleyWaveProgression.calculateWaveTonnage(oneRepMax, progression),
                focus: [
                    'Strength in good positions',
                    'Load tolerance',
                    'Movement efficiency',
                    'Power development'
                ],
                exercises: [
                    'Competition lifts',
                    'Pause variations',
                    'Tempo work',
                    'Unilateral loaded carries',
                    'Anti-rotation work'
                ]
            });
        }

        return waves;
    }

    /**
     * General Fitness Linear Program
     * Balanced approach using alternating base/peak phases
     */
    static generateGeneralFitnessProgram(starting1RM, duration_weeks = 16) {
        const program = [];
        const phases = Math.floor(duration_weeks / 8);

        for (let phase = 1; phase <= phases; phase++) {
            const isBaseFocus = phase % 2 === 1;

            if (isBaseFocus) {
                // Base Phase: General Preparedness
                program.push({
                    phase: phase,
                    name: 'General Preparedness Base',
                    weeks: [(phase - 1) * 8 + 1, phase * 8],
                    focus: 'work_capacity_health',
                    intensity_range: [60, 75],
                    rep_ranges: [8, 15],
                    sets_range: [3, 5],
                    exercise_type: 'general_fitness',
                    wave_type: 'volumizing',
                    waves: this.generateGeneralFitnessBaseWaves(starting1RM, phase)
                });
            } else {
                // Peak Phase: Strength Focus
                program.push({
                    phase: phase,
                    name: 'Strength Development Peak',
                    weeks: [(phase - 1) * 8 + 1, phase * 8],
                    focus: 'strength_power',
                    intensity_range: [75, 90],
                    rep_ranges: [3, 6],
                    sets_range: [3, 5],
                    exercise_type: 'strength_focus',
                    wave_type: 'intensifying',
                    waves: this.generateGeneralFitnessPeakWaves(starting1RM, phase)
                });
            }
        }

        return program;
    }

    /**
     * Classic Linear Progression with Wave Enhancement
     * Traditional model enhanced with Bromley wave structure
     */
    static generateClassicLinearProgram(starting1RM, duration_weeks = 12, goal_lift) {
        const waves = [];
        const startPercent = 65;
        const endPercent = 90;
        const percentIncrease = (endPercent - startPercent) / (duration_weeks / 3);

        for (let wave = 1; wave <= Math.floor(duration_weeks / 3); wave++) {
            const waveStartPercent = startPercent + ((wave - 1) * percentIncrease);

            // Alternate between volumizing and intensifying waves
            const waveType = wave <= 2 ? 'volumizing' : 'intensifying';
            const startReps = waveType === 'volumizing' ? 10 : 6;

            const progression = waveType === 'volumizing'
                ? BromleyWaveProgression.volumizingWave(3, startReps, waveStartPercent)
                : BromleyWaveProgression.intensifyingWave(4, startReps, waveStartPercent);

            waves.push({
                wave_number: wave,
                weeks: [(wave - 1) * 3 + 1, wave * 3],
                type: waveType,
                goal_lift: goal_lift,
                progression: BromleyWaveProgression.calculateWaveTonnage(starting1RM, progression),
                deload_week: wave * 3 + 1,
                testing_week: wave === Math.floor(duration_weeks / 3) ? wave * 3 + 2 : null
            });
        }

        return {
            program_type: 'Classic Linear with Waves',
            duration_weeks: duration_weeks,
            starting_1rm: starting1RM,
            goal_lift: goal_lift,
            waves: waves,
            expected_gain: LinearPeriodizationBromley.calculateExpectedGains(starting1RM, duration_weeks),
            deload_protocol: 'wave_integrated',
            testing_protocol: 'end_of_program'
        };
    }

    /**
     * Assessment Integration for Linear Programs
     */
    static generateLinearAssessments() {
        return {
            baseline_tests: [
                {
                    name: 'Movement Screen',
                    tests: ['overhead_squat', 'single_leg_balance', 'shoulder_mobility'],
                    frequency: 'pre_program'
                },
                {
                    name: 'Strength Baseline',
                    tests: ['AMRAP_at_65_percent', 'bodyweight_movement_test'],
                    frequency: 'week_1'
                },
                {
                    name: 'Work Capacity',
                    tests: ['timed_bodyweight_circuit', 'loaded_carry_distance'],
                    frequency: 'week_1'
                }
            ],

            progress_monitoring: [
                {
                    name: 'Wave Performance',
                    metrics: ['reps_completed', 'RPE_tracking', 'weight_progression'],
                    frequency: 'weekly'
                },
                {
                    name: 'Movement Quality',
                    metrics: ['form_assessment', 'stability_tests', 'mobility_checks'],
                    frequency: 'bi_weekly'
                },
                {
                    name: 'Recovery Status',
                    metrics: ['DOMS_levels', 'energy_ratings', 'motivation_scores'],
                    frequency: 'daily'
                }
            ],

            milestone_testing: [
                {
                    name: 'Mid-Program Assessment',
                    tests: ['rep_max_retest', 'movement_quality_recheck'],
                    timing: 'week_6'
                },
                {
                    name: 'Program Completion',
                    tests: ['new_1RM_test', 'full_movement_screen', 'body_composition'],
                    timing: 'final_week'
                }
            ]
        };
    }

    /**
     * Expected gains calculation based on experience level
     */
    static calculateExpectedGains(starting1RM, durationWeeks) {
        const gainRates = {
            novice: 0.025,      // 2.5% per month
            intermediate: 0.015, // 1.5% per month  
            advanced: 0.008     // 0.8% per month
        };

        const months = durationWeeks / 4.33;

        return Object.keys(gainRates).reduce((acc, level) => {
            acc[level] = {
                total_gain_percent: (gainRates[level] * months * 100).toFixed(1),
                expected_new_1rm: Math.round(starting1RM * (1 + (gainRates[level] * months))),
                monthly_gain: (gainRates[level] * 100).toFixed(1)
            };
            return acc;
        }, {});
    }

    /**
     * Integration with PowerHouse system
     */
    static integratewithPowerHouse(goal, experience_level, current_1rms) {
        const integrationConfig = {
            motor_control: {
                primary_program: this.generateMotorControlProgram,
                assessment_focus: 'movement_quality',
                progression_priority: 'technique_over_load'
            },
            general_fitness: {
                primary_program: this.generateGeneralFitnessProgram,
                assessment_focus: 'balanced_development',
                progression_priority: 'consistent_improvement'
            },
            strength: {
                primary_program: this.generateClassicLinearProgram,
                assessment_focus: 'strength_development',
                progression_priority: 'load_progression'
            }
        };

        return {
            recommended_program: integrationConfig[goal],
            assessments: LinearPeriodizationBromley.generateLinearAssessments(),
            expected_outcomes: LinearPeriodizationBromley.calculateExpectedGains(current_1rms.squat, 12),
            integration_points: [
                'Step 1: Goal selection → Linear system recommendation',
                'Step 5: System selection → Linear program generation',
                'Steps 6-8: Program architecture → Wave periodization'
            ]
        };
    }
}

// Export specific program generators for easy use
export const MotorControlLinear = LinearPeriodizationBromley.generateMotorControlProgram;
export const GeneralFitnessLinear = LinearPeriodizationBromley.generateGeneralFitnessProgram;
export const ClassicLinearWithWaves = LinearPeriodizationBromley.generateClassicLinearProgram;

export default LinearPeriodizationBromley;
