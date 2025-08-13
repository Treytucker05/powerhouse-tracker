/**
 * Program Templates Data
 * Template definitions for macrocycle builder
 */

export interface Template {
    id: string;
    name: string;
    description: string;
    methodology: string;
    goals: string[];
    experienceLevel: string[];
    duration: number;
    phases: any[];
    compatibility: {
        requiredGoals?: string[];
        requiredExperience?: string[];
        minDuration?: number;
        maxDuration?: number;
    };
}

export const templates: Template[] = [
    {
        id: 'nasm-opt-beginner',
        name: 'NASM OPT - Beginner',
        description: 'NASM Optimum Performance Training for beginners',
        methodology: 'NASM',
        goals: ['general_fitness', 'corrective_exercise', 'movement_quality'],
        experienceLevel: ['beginner'],
        duration: 12,
        phases: [
            {
                name: 'Stabilization Endurance',
                duration: 4,
                focus: 'movement_quality'
            },
            {
                name: 'Strength Endurance',
                duration: 4,
                focus: 'strength_base'
            },
            {
                name: 'Hypertrophy',
                duration: 4,
                focus: 'muscle_growth'
            }
        ],
        compatibility: {
            requiredGoals: ['general_fitness', 'corrective_exercise', 'movement_quality'],
            requiredExperience: ['beginner'],
            minDuration: 8,
            maxDuration: 16
        }
    },
    {
        id: 'nasm-opt-intermediate',
        name: 'NASM OPT - Intermediate',
        description: 'NASM Optimum Performance Training for intermediate clients',
        methodology: 'NASM',
        goals: ['hypertrophy', 'strength', 'sports_performance'],
        experienceLevel: ['intermediate'],
        duration: 16,
        phases: [
            {
                name: 'Strength Endurance',
                duration: 4,
                focus: 'strength_base'
            },
            {
                name: 'Hypertrophy',
                duration: 6,
                focus: 'muscle_growth'
            },
            {
                name: 'Maximal Strength',
                duration: 3,
                focus: 'strength'
            },
            {
                name: 'Power',
                duration: 3,
                focus: 'power'
            }
        ],
        compatibility: {
            requiredGoals: ['hypertrophy', 'strength', 'sports_performance'],
            requiredExperience: ['intermediate'],
            minDuration: 12,
            maxDuration: 20
        }
    },
    {
        id: 'rp-hypertrophy',
        name: 'RP Hypertrophy Template',
        description: 'Renaissance Periodization hypertrophy-focused template',
        methodology: 'RP',
        goals: ['hypertrophy', 'muscle_growth'],
        experienceLevel: ['intermediate', 'advanced'],
        duration: 12,
        phases: [
            {
                name: 'Accumulation',
                duration: 4,
                focus: 'volume_buildup'
            },
            {
                name: 'Intensification',
                duration: 4,
                focus: 'intensity_increase'
            },
            {
                name: 'Realization',
                duration: 2,
                focus: 'peak'
            },
            {
                name: 'Deload',
                duration: 2,
                focus: 'recovery'
            }
        ],
        compatibility: {
            requiredGoals: ['hypertrophy', 'muscle_growth'],
            requiredExperience: ['intermediate', 'advanced'],
            minDuration: 8,
            maxDuration: 16
        }
    }
];

export interface CompatibilityResult {
    isCompatible: boolean;
    score: number;
    reasons: string[];
    missingRequirements: string[];
}

export const checkCompatibility = (
    template: Template,
    programDetails: any
): CompatibilityResult => {
    const result: CompatibilityResult = {
        isCompatible: true,
        score: 0,
        reasons: [],
        missingRequirements: []
    };

    if (!programDetails) {
        result.isCompatible = false;
        result.missingRequirements.push('Program details not provided');
        return result;
    }

    // Check goals compatibility
    if (template.compatibility.requiredGoals) {
        const hasMatchingGoal = template.compatibility.requiredGoals.some(
            goal => programDetails.goal === goal || programDetails.goals?.includes(goal)
        );
        if (hasMatchingGoal) {
            result.score += 30;
            result.reasons.push('Goals match template requirements');
        } else {
            result.isCompatible = false;
            result.missingRequirements.push('Goal does not match template requirements');
        }
    }

    // Check experience level compatibility
    if (template.compatibility.requiredExperience) {
        const hasMatchingExperience = template.compatibility.requiredExperience.includes(
            programDetails.experienceLevel
        );
        if (hasMatchingExperience) {
            result.score += 25;
            result.reasons.push('Experience level matches');
        } else {
            result.isCompatible = false;
            result.missingRequirements.push('Experience level does not match');
        }
    }

    // Check duration compatibility
    if (template.compatibility.minDuration && programDetails.duration < template.compatibility.minDuration) {
        result.isCompatible = false;
        result.missingRequirements.push(`Duration too short (minimum ${template.compatibility.minDuration} weeks)`);
    } else if (template.compatibility.maxDuration && programDetails.duration > template.compatibility.maxDuration) {
        result.isCompatible = false;
        result.missingRequirements.push(`Duration too long (maximum ${template.compatibility.maxDuration} weeks)`);
    } else if (programDetails.duration) {
        result.score += 15;
        result.reasons.push('Duration is compatible');
    }

    // Methodology match bonus
    if (programDetails.methodology === template.methodology) {
        result.score += 30;
        result.reasons.push('Methodology matches perfectly');
    }

    return result;
};

export default templates;
