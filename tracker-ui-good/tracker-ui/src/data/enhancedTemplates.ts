// Enhanced Macrocycle Template System
// Complete RP-based program templates with advanced periodization

export interface BlockTemplate {
    id: string;
    name: string;
    type: 'accumulation' | 'intensification' | 'realization' | 'deload' | 'maintenance';
    weeks: number;
    volumeProgression: 'linear' | 'undulating' | 'block' | 'wave';
    intensityRange: [number, number];
    rirRange: [number, number];
    primaryFocus: string;
    description: string;
    color: string;
    icon: string;
}

export interface MacrocycleTemplate {
    id: string;
    name: string;
    goal: 'hypertrophy' | 'strength' | 'powerbuilding' | 'endurance';
    duration: number;
    experience: string[];
    trainingDaysRange: [number, number];
    description: string;
    blocks: BlockTemplate[];
    specializations: string[];
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedResults: {
        hypertrophy: number;
        strength: number;
        endurance: number;
        fatLoss: number;
    };
}

// Enhanced Block Templates
export const BLOCK_TEMPLATES: Record<string, Omit<BlockTemplate, 'id' | 'weeks'>> = {
    accumulation: {
        name: 'Accumulation',
        type: 'accumulation',
        volumeProgression: 'linear',
        intensityRange: [65, 75],
        rirRange: [1, 4],
        primaryFocus: 'Volume & Work Capacity',
        description: 'Progressive volume overload from MEV to MRV',
        color: 'bg-blue-500',
        icon: '📈'
    },
    intensification: {
        name: 'Intensification',
        type: 'intensification',
        volumeProgression: 'undulating',
        intensityRange: [75, 85],
        rirRange: [1, 3],
        primaryFocus: 'Strength & Power',
        description: 'Maintain volume while increasing intensity',
        color: 'bg-yellow-500',
        icon: '⚡'
    },
    realization: {
        name: 'Realization',
        type: 'realization',
        volumeProgression: 'block',
        intensityRange: [85, 95],
        rirRange: [0, 2],
        primaryFocus: 'Peak Performance',
        description: 'Taper volume and peak intensity',
        color: 'bg-red-500',
        icon: '🎯'
    },
    deload: {
        name: 'Deload',
        type: 'deload',
        volumeProgression: 'linear',
        intensityRange: [50, 65],
        rirRange: [3, 4],
        primaryFocus: 'Recovery & Restoration',
        description: 'Active recovery and adaptation',
        color: 'bg-gray-500',
        icon: '🔄'
    },
    maintenance: {
        name: 'Maintenance',
        type: 'maintenance',
        volumeProgression: 'linear',
        intensityRange: [65, 75],
        rirRange: [2, 3],
        primaryFocus: 'Maintain Adaptations',
        description: 'Sustain gains with minimal volume',
        color: 'bg-green-500',
        icon: '⚖️'
    }
};

// Enhanced Macrocycle Templates
export const ENHANCED_MACROCYCLE_TEMPLATES: MacrocycleTemplate[] = [
    {
        id: 'hypertrophy_beginner_12',
        name: 'Beginner Hypertrophy Foundation',
        goal: 'hypertrophy',
        duration: 12,
        experience: ['beginner'],
        trainingDaysRange: [3, 4],
        description: 'Perfect first program focusing on muscle building fundamentals',
        difficulty: 'beginner',
        specializations: ['upper', 'lower'],
        tags: ['beginner-friendly', 'muscle-building', 'foundation'],
        estimatedResults: {
            hypertrophy: 85,
            strength: 65,
            endurance: 45,
            fatLoss: 30
        },
        blocks: [
            {
                id: 'acc-1',
                weeks: 4,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'acc-2',
                weeks: 4,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-2',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'maint-1',
                weeks: 2,
                ...BLOCK_TEMPLATES.maintenance
            }
        ]
    },
    {
        id: 'hypertrophy_intermediate_16',
        name: 'Intermediate Hypertrophy Specialization',
        goal: 'hypertrophy',
        duration: 16,
        experience: ['intermediate'],
        trainingDaysRange: [4, 5],
        description: 'Advanced hypertrophy with specialization phases',
        difficulty: 'intermediate',
        specializations: ['chest', 'back', 'arms', 'legs'],
        tags: ['specialization', 'advanced-hypertrophy', 'volume-focused'],
        estimatedResults: {
            hypertrophy: 90,
            strength: 70,
            endurance: 50,
            fatLoss: 35
        },
        blocks: [
            {
                id: 'acc-1',
                weeks: 6,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'acc-2',
                weeks: 6,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-2',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'maint-1',
                weeks: 2,
                ...BLOCK_TEMPLATES.maintenance
            }
        ]
    },
    {
        id: 'strength_powerlifting_20',
        name: 'Powerlifting Strength Cycle',
        goal: 'strength',
        duration: 20,
        experience: ['intermediate', 'advanced'],
        trainingDaysRange: [4, 6],
        description: 'Complete powerlifting peaking cycle for competition',
        difficulty: 'advanced',
        specializations: ['squat', 'bench', 'deadlift'],
        tags: ['powerlifting', 'strength-focused', 'competition-prep'],
        estimatedResults: {
            hypertrophy: 40,
            strength: 95,
            endurance: 30,
            fatLoss: 20
        },
        blocks: [
            {
                id: 'acc-1',
                weeks: 8,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'int-1',
                weeks: 6,
                ...BLOCK_TEMPLATES.intensification
            },
            {
                id: 'deload-2',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'real-1',
                weeks: 3,
                ...BLOCK_TEMPLATES.realization
            },
            {
                id: 'deload-3',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            }
        ]
    },
    {
        id: 'powerbuilding_balanced_16',
        name: 'Balanced Powerbuilding',
        goal: 'powerbuilding',
        duration: 16,
        experience: ['intermediate', 'advanced'],
        trainingDaysRange: [4, 5],
        description: 'Perfect balance of strength and size gains',
        difficulty: 'intermediate',
        specializations: ['compound-lifts', 'upper-body', 'lower-body'],
        tags: ['powerbuilding', 'balanced', 'strength-size'],
        estimatedResults: {
            hypertrophy: 75,
            strength: 80,
            endurance: 40,
            fatLoss: 30
        },
        blocks: [
            {
                id: 'acc-1',
                weeks: 5,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'int-1',
                weeks: 4,
                ...BLOCK_TEMPLATES.intensification
            },
            {
                id: 'deload-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'acc-2',
                weeks: 4,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-2',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'maint-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.maintenance
            }
        ]
    },
    {
        id: 'cutting_preservation_12',
        name: 'Cutting Muscle Preservation',
        goal: 'hypertrophy',
        duration: 12,
        experience: ['intermediate', 'advanced'],
        trainingDaysRange: [3, 4],
        description: 'Maintain muscle mass during fat loss phase',
        difficulty: 'intermediate',
        specializations: ['maintenance', 'preservation'],
        tags: ['cutting', 'fat-loss', 'muscle-preservation'],
        estimatedResults: {
            hypertrophy: 20,
            strength: 40,
            endurance: 60,
            fatLoss: 85
        },
        blocks: [
            {
                id: 'acc-1',
                weeks: 4,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'maint-1',
                weeks: 4,
                ...BLOCK_TEMPLATES.maintenance
            },
            {
                id: 'deload-2',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'maint-2',
                weeks: 2,
                ...BLOCK_TEMPLATES.maintenance
            }
        ]
    },
    {
        id: 'arm_specialization_8',
        name: 'Arm Specialization Block',
        goal: 'hypertrophy',
        duration: 8,
        experience: ['intermediate', 'advanced'],
        trainingDaysRange: [4, 5],
        description: 'Intensive arm specialization with volume redistribution',
        difficulty: 'intermediate',
        specializations: ['biceps', 'triceps', 'forearms'],
        tags: ['specialization', 'arms', 'short-cycle'],
        estimatedResults: {
            hypertrophy: 80,
            strength: 50,
            endurance: 35,
            fatLoss: 25
        },
        blocks: [
            {
                id: 'acc-1',
                weeks: 3,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'acc-2',
                weeks: 3,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'maint-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.maintenance
            }
        ]
    },
    {
        id: 'back_specialization_10',
        name: 'Back Width & Thickness',
        goal: 'hypertrophy',
        duration: 10,
        experience: ['intermediate', 'advanced'],
        trainingDaysRange: [4, 5],
        description: 'Comprehensive back development specialization',
        difficulty: 'intermediate',
        specializations: ['back', 'lats', 'rhomboids', 'traps'],
        tags: ['specialization', 'back', 'width-thickness'],
        estimatedResults: {
            hypertrophy: 85,
            strength: 70,
            endurance: 45,
            fatLoss: 30
        },
        blocks: [
            {
                id: 'acc-1',
                weeks: 4,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'acc-2',
                weeks: 4,
                ...BLOCK_TEMPLATES.accumulation
            },
            {
                id: 'deload-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.deload
            },
            {
                id: 'maint-1',
                weeks: 1,
                ...BLOCK_TEMPLATES.maintenance
            }
        ]
    }
];

// Template filtering and selection utilities
export const filterTemplatesByCompatibility = (templates: MacrocycleTemplate[], programDetails: any) => {
    return templates.filter(template => {
        // Check experience compatibility
        const experienceMatch = template.experience.includes(programDetails.trainingExperience);

        // Check training days compatibility
        const trainingDaysMatch = programDetails.trainingDaysPerWeek >= template.trainingDaysRange[0] &&
            programDetails.trainingDaysPerWeek <= template.trainingDaysRange[1];

        // Check duration compatibility (within 25% of target)
        const durationMatch = Math.abs(template.duration - programDetails.duration) <= programDetails.duration * 0.25;

        return experienceMatch && trainingDaysMatch && durationMatch;
    });
};

export const getTemplateRecommendations = (templates: MacrocycleTemplate[], programDetails: any) => {
    const compatible = filterTemplatesByCompatibility(templates, programDetails);

    // Score templates based on compatibility
    const scoredTemplates = compatible.map(template => {
        let score = 0;

        // Experience match bonus
        if (template.experience.includes(programDetails.trainingExperience)) score += 30;

        // Duration match bonus
        const durationDiff = Math.abs(template.duration - programDetails.duration);
        score += Math.max(0, 20 - durationDiff);

        // Training days match bonus
        const trainingDaysDiff = Math.abs(
            ((template.trainingDaysRange[0] + template.trainingDaysRange[1]) / 2) -
            programDetails.trainingDaysPerWeek
        );
        score += Math.max(0, 15 - trainingDaysDiff * 5);

        // Diet phase alignment
        if (programDetails.dietPhase === 'cut' && template.tags.includes('fat-loss')) score += 20;
        if (programDetails.dietPhase === 'bulk' && template.goal === 'hypertrophy') score += 15;

        return { ...template, compatibilityScore: score };
    });

    return scoredTemplates.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

// Export everything
export { ENHANCED_MACROCYCLE_TEMPLATES as templates };
export default ENHANCED_MACROCYCLE_TEMPLATES;
