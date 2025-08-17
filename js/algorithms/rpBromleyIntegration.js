/**
 * RP System Enhanced with Bromley Concepts
 * Customizes Renaissance Periodization for Hypertrophy and Weight Loss goals
 * Integrates Bromley Base/Peak phases and wave periodization
 */

import { BromleyWaveProgression, BROMLEY_PHASES, SRN_FRAMEWORK } from './bromleyProgression.js';

export class RPBromleyIntegration {

    constructor(goal = 'hypertrophy', experience_level = 'intermediate') {
        this.goal = goal;
        this.experience_level = experience_level;
        this.base_phase = BROMLEY_PHASES.BASE_PHASE;
        this.peak_phase = BROMLEY_PHASES.PEAK_PHASE;
    }

    /**
     * RP Hypertrophy Customization using Bromley Base Phase
     * Emphasizes volume, exercise variety, and muscle building
     */
    static generateRPHypertrophyProgram(currentMEV, bodyweight, experience_level = 'intermediate') {
        const config = {
            phase_structure: 'base_focused',
            primary_phase: BROMLEY_PHASES.BASE_PHASE,
            duration_weeks: 8, // Extended base phase for hypertrophy
            wave_structure: 'volumizing_emphasis',

            // Bromley Base Phase integration
            intensity_range: [65, 75], // Hypertrophy sweet spot from Bromley
            rep_ranges: [8, 12],        // Base phase rep ranges
            exercise_selection: 'non_specific_variations', // Variety for mass

            // RP Volume Landmarks (Enhanced)
            volume_landmarks: RPBromleyIntegration.calculateBromleyRPVolume(currentMEV, 'hypertrophy'),

            // Progressive overload via Bromley waves
            progression_model: 'bromley_volumizing_waves',

            // Deload integration
            deload_frequency: 'every_3_weeks', // Bromley wave structure
            deload_type: 'volume_reduction'
        };

        return RPBromleyIntegration.generateHypertrophyWaves(config);
    }

    /**
     * RP Weight Loss Customization using Bromley High-Frequency
     * Emphasizes metabolic stress, higher frequency, circuit integration
     */
    static generateRPWeightLossProgram(currentMEV, bodyweight, experience_level = 'intermediate') {
        const config = {
            phase_structure: 'metabolic_base',
            primary_phase: BROMLEY_PHASES.BASE_PHASE,
            duration_weeks: 6, // Shorter phases for weight loss
            wave_structure: 'high_frequency_waves',

            // Modified intensity for weight loss
            intensity_range: [60, 70], // Lower intensity for higher frequency
            rep_ranges: [10, 15],       // Higher reps for metabolic stress
            exercise_selection: 'metabolic_focus', // Circuits and supersets

            // Enhanced volume for weight loss
            volume_landmarks: RPBromleyIntegration.calculateBromleyRPVolume(currentMEV, 'weight_loss'),

            // High-frequency progression
            progression_model: 'bromley_metabolic_waves',
            frequency: '4-6x_per_week', // Higher frequency than traditional RP

            // Shorter deload cycles
            deload_frequency: 'every_2_weeks',
            deload_type: 'intensity_reduction'
        };

        return RPBromleyIntegration.generateWeightLossWaves(config);
    }

    /**
     * Calculate Bromley-Enhanced RP Volume Landmarks
     * Integrates RP MEV/MAV/MRV with Bromley progression principles
     */
    static calculateBromleyRPVolume(baseMEV, goal) {
        const multipliers = {
            hypertrophy: {
                MEV: 1.0,   // Baseline minimum
                MAV: 1.8,   // Bromley base phase allows higher volume
                MRV: 2.5    // Extended maximum for mass building
            },
            weight_loss: {
                MEV: 1.2,   // Higher baseline for metabolic demand
                MAV: 2.2,   // Higher volume tolerance with lower intensity
                MRV: 3.0    // Maximum volume for fat loss
            }
        };

        const goalMultipliers = multipliers[goal] || multipliers.hypertrophy;

        return {
            MEV: Math.round(baseMEV * goalMultipliers.MEV),
            MAV: Math.round(baseMEV * goalMultipliers.MAV),
            MRV: Math.round(baseMEV * goalMultipliers.MRV),

            // Bromley wave integration
            wave_progression: {
                week_1: Math.round(baseMEV * goalMultipliers.MEV * 1.0), // Start at MEV
                week_2: Math.round(baseMEV * goalMultipliers.MEV * 1.4), // Build toward MAV
                week_3: Math.round(baseMEV * goalMultipliers.MEV * 1.8)  // Peak at MAV
            },

            // Recovery week
            deload_volume: Math.round(baseMEV * goalMultipliers.MEV * 0.7)
        };
    }

    /**
     * Generate Hypertrophy-Focused Wave Progression
     */
    static generateHypertrophyWaves(config) {
        const waves = [];
        const numWaves = Math.floor(config.duration_weeks / 3);

        for (let wave = 1; wave <= numWaves; wave++) {
            // Volumizing wave structure for hypertrophy
            const baseProgression = BromleyWaveProgression.volumizingWave(3, 10, 65 + (wave - 1) * 2.5);

            waves.push({
                wave_number: wave,
                weeks: [(wave - 1) * 3 + 1, wave * 3],
                focus: 'muscle_hypertrophy',
                progression: baseProgression.map(week => ({
                    ...week,
                    // RP-specific enhancements
                    stimulus_targets: {
                        mmc: [2, 3],      // High mind-muscle connection
                        pump: [2, 3],     // Strong pump feeling
                        disruption: [1, 2] // Moderate disruption (sustainable)
                    },
                    rp_volume: config.volume_landmarks.wave_progression[`week_${week.week}`],
                    exercise_variety: RPBromleyIntegration.getHypertrophyExercises(week.week),
                    rest_periods: '60-90_seconds' // Hypertrophy-specific rest
                })),

                // Deload week
                deload_week: {
                    week: wave * 3 + 1,
                    volume: config.volume_landmarks.deload_volume,
                    intensity: 60,
                    focus: 'recovery_and_technique'
                }
            });
        }

        return {
            program_type: 'RP Hypertrophy with Bromley Waves',
            goal: 'muscle_hypertrophy',
            duration_weeks: config.duration_weeks,
            waves: waves,
            volume_landmarks: config.volume_landmarks,
            assessment_protocol: RPBromleyIntegration.generateRPHypertrophyAssessments()
        };
    }

    /**
     * Generate Weight Loss-Focused Wave Progression
     */
    static generateWeightLossWaves(config) {
        const waves = [];
        const numWaves = Math.floor(config.duration_weeks / 2); // Shorter 2-week waves

        for (let wave = 1; wave <= numWaves; wave++) {
            waves.push({
                wave_number: wave,
                weeks: [(wave - 1) * 2 + 1, wave * 2],
                focus: 'fat_loss_muscle_preservation',
                progression: [
                    {
                        week: 1,
                        sets: 4,
                        reps: 12,
                        percent: 60,
                        frequency: '5x_per_week',
                        circuit_integration: true,
                        rest_periods: '45-60_seconds'
                    },
                    {
                        week: 2,
                        sets: 5,
                        reps: 15,
                        percent: 62.5,
                        frequency: '6x_per_week',
                        circuit_integration: true,
                        rest_periods: '30-45_seconds'
                    }
                ].map(week => ({
                    ...week,
                    // Weight loss specific targets
                    stimulus_targets: {
                        mmc: [1, 2],      // Moderate mind-muscle connection
                        pump: [2, 3],     // Strong pump (metabolic stress)
                        disruption: [2, 3] // Higher disruption acceptable
                    },
                    metabolic_emphasis: true,
                    exercise_variety: RPBromleyIntegration.getWeightLossExercises(),
                    cardio_integration: '15-20_minutes_post_workout'
                })),

                // More frequent deloads for recovery
                deload_week: {
                    week: wave * 2 + 1,
                    volume_reduction: 40,
                    frequency_reduction: '4x_per_week',
                    focus: 'active_recovery'
                }
            });
        }

        return {
            program_type: 'RP Weight Loss with Bromley High-Frequency',
            goal: 'fat_loss',
            duration_weeks: config.duration_weeks,
            waves: waves,
            volume_landmarks: config.volume_landmarks,
            assessment_protocol: RPBromleyIntegration.generateRPWeightLossAssessments()
        };
    }

    /**
     * Hypertrophy Exercise Selection by Week
     */
    static getHypertrophyExercises(week) {
        const exercises = {
            1: { // Week 1 - Foundation
                primary: ['barbell_bench', 'barbell_squat', 'barbell_row'],
                variations: ['incline_dumbbell', 'front_squat', 'cable_row'],
                accessories: ['lateral_raises', 'leg_extensions', 'tricep_work']
            },
            2: { // Week 2 - Volume
                primary: ['dumbbell_bench', 'leg_press', 'lat_pulldown'],
                variations: ['machine_press', 'hack_squat', 'seated_row'],
                accessories: ['rear_delts', 'leg_curls', 'bicep_work']
            },
            3: { // Week 3 - Peak Volume
                primary: ['machine_bench', 'smith_squat', 'machine_row'],
                variations: ['cable_press', 'bulgarian_split', 'high_row'],
                accessories: ['shoulder_circuit', 'unilateral_legs', 'arm_superset']
            }
        };

        return exercises[week] || exercises[1];
    }

    /**
     * Weight Loss Exercise Selection
     */
    static getWeightLossExercises() {
        return {
            circuit_1: ['squat_press', 'mountain_climbers', 'burpee_pullup'],
            circuit_2: ['deadlift_row', 'jump_squats', 'pushup_variations'],
            circuit_3: ['lunge_press', 'battle_ropes', 'plank_variations'],
            supersets: ['upper_lower_pairs', 'push_pull_pairs', 'compound_isolation']
        };
    }

    /**
     * RP Hypertrophy Assessment Protocol
     */
    static generateRPHypertrophyAssessments() {
        return {
            baseline: [
                { test: 'body_composition_scan', timing: 'week_0' },
                { test: 'circumference_measurements', timing: 'week_0' },
                { test: 'rep_max_testing', timing: 'week_1' },
                { test: 'MEV_establishment', timing: 'week_1' }
            ],
            weekly_monitoring: [
                { metric: 'stimulus_scores', method: 'RP_table_2.2' },
                { metric: 'volume_progression', method: 'set_counting' },
                { metric: 'body_weight', method: 'daily_weigh_ins' },
                { metric: 'recovery_markers', method: 'subjective_scales' }
            ],
            milestone_testing: [
                { test: 'body_composition_recheck', timing: 'week_4' },
                { test: 'circumference_remeasure', timing: 'week_4' },
                { test: 'strength_retest', timing: 'week_8' }
            ]
        };
    }

    /**
     * RP Weight Loss Assessment Protocol
     */
    static generateRPWeightLossAssessments() {
        return {
            baseline: [
                { test: 'body_composition_detailed', timing: 'week_0' },
                { test: 'metabolic_baseline', timing: 'week_0' },
                { test: 'work_capacity_test', timing: 'week_1' }
            ],
            frequent_monitoring: [
                { metric: 'body_weight', method: 'daily_weigh_ins' },
                { metric: 'body_fat_percentage', method: 'weekly_scans' },
                { metric: 'workout_density', method: 'time_tracking' },
                { metric: 'energy_levels', method: 'daily_ratings' }
            ],
            milestone_testing: [
                { test: 'body_composition_scan', timing: 'every_2_weeks' },
                { test: 'work_capacity_retest', timing: 'week_4' },
                { test: 'strength_maintenance_check', timing: 'week_6' }
            ]
        };
    }

    /**
     * Integration with PowerHouse Goal Selector
     */
    static integratewithGoalSelector(selectedGoal, userProfile) {
        const rpConfigs = {
            hypertrophy: {
                program_generator: this.generateRPHypertrophyProgram,
                assessment_focus: 'muscle_development',
                success_metrics: ['muscle_mass', 'strength_endurance', 'body_composition']
            },
            weight_loss: {
                program_generator: this.generateRPWeightLossProgram,
                assessment_focus: 'fat_loss',
                success_metrics: ['body_fat_reduction', 'lean_mass_retention', 'work_capacity']
            }
        };

        return {
            recommended_config: rpConfigs[selectedGoal],
            bromley_integration: true,
            wave_periodization: true,
            goal_specific_modifications: true,
            assessment_protocol: selectedGoal === 'hypertrophy'
                ? RPBromleyIntegration.generateRPHypertrophyAssessments()
                : RPBromleyIntegration.generateRPWeightLossAssessments()
        };
    }
}

export const RPHypertrophy = RPBromleyIntegration.generateRPHypertrophyProgram;
export const RPWeightLoss = RPBromleyIntegration.generateRPWeightLossProgram;

export default RPBromleyIntegration;
