// Template definitions for macrocycle builder
export interface Template {
    id: string;
    name: string;
    description: string;
    duration: number; // weeks
    goal: 'strength' | 'hypertrophy' | 'powerlifting' | 'general';
    experience: ('beginner' | 'intermediate' | 'advanced')[];
    dietPhases: ('bulk' | 'maintenance' | 'cut')[];
    trainingDaysRange: [number, number]; // [min, max] days per week
    blocks: {
        name: string;
        type: 'accumulation' | 'intensification' | 'realization' | 'deload';
        weeks: number;
        rirRange: [number, number];
        volumeProgression: 'linear' | 'undulating' | 'block';
    }[];
}

export const templates: Template[] = [
    {
        id: 'beginner-hypertrophy',
        name: 'Beginner Hypertrophy Foundation',
        description: 'Perfect for new lifters focusing on muscle growth and movement patterns',
        duration: 12,
        goal: 'hypertrophy',
        experience: ['beginner'],
        dietPhases: ['bulk', 'maintenance'],
        trainingDaysRange: [3, 4],
        blocks: [
            {
                name: 'Foundation Phase',
                type: 'accumulation',
                weeks: 4,
                rirRange: [3, 4],
                volumeProgression: 'linear'
            },
            {
                name: 'Growth Phase',
                type: 'accumulation',
                weeks: 4,
                rirRange: [2, 3],
                volumeProgression: 'linear'
            },
            {
                name: 'Intensity Phase',
                type: 'intensification',
                weeks: 3,
                rirRange: [1, 2],
                volumeProgression: 'undulating'
            },
            {
                name: 'Deload',
                type: 'deload',
                weeks: 1,
                rirRange: [4, 5],
                volumeProgression: 'linear'
            }
        ]
    },
    {
        id: 'intermediate-strength',
        name: 'Intermediate Strength Builder',
        description: 'Balanced approach combining strength and size for experienced lifters',
        duration: 16,
        goal: 'strength',
        experience: ['intermediate', 'advanced'],
        dietPhases: ['bulk', 'maintenance', 'cut'],
        trainingDaysRange: [4, 5],
        blocks: [
            {
                name: 'Volume Accumulation',
                type: 'accumulation',
                weeks: 5,
                rirRange: [2, 4],
                volumeProgression: 'block'
            },
            {
                name: 'Intensity Build',
                type: 'intensification',
                weeks: 4,
                rirRange: [1, 3],
                volumeProgression: 'undulating'
            },
            {
                name: 'Peak & Realize',
                type: 'realization',
                weeks: 3,
                rirRange: [0, 2],
                volumeProgression: 'linear'
            },
            {
                name: 'Recovery',
                type: 'deload',
                weeks: 2,
                rirRange: [3, 5],
                volumeProgression: 'linear'
            },
            {
                name: 'Second Wave',
                type: 'accumulation',
                weeks: 2,
                rirRange: [2, 3],
                volumeProgression: 'linear'
            }
        ]
    },
    {
        id: 'advanced-powerlifting',
        name: 'Advanced Powerlifting Cycle',
        description: 'Competition-focused program for advanced powerlifters',
        duration: 20,
        goal: 'powerlifting',
        experience: ['advanced'],
        dietPhases: ['maintenance', 'cut'],
        trainingDaysRange: [4, 6],
        blocks: [
            {
                name: 'Base Building',
                type: 'accumulation',
                weeks: 6,
                rirRange: [2, 4],
                volumeProgression: 'block'
            },
            {
                name: 'Strength Focus',
                type: 'intensification',
                weeks: 5,
                rirRange: [1, 3],
                volumeProgression: 'undulating'
            },
            {
                name: 'Peak Power',
                type: 'intensification',
                weeks: 4,
                rirRange: [0, 2],
                volumeProgression: 'linear'
            },
            {
                name: 'Competition Prep',
                type: 'realization',
                weeks: 3,
                rirRange: [0, 1],
                volumeProgression: 'linear'
            },
            {
                name: 'Recovery',
                type: 'deload',
                weeks: 2,
                rirRange: [4, 5],
                volumeProgression: 'linear'
            }
        ]
    },
    {
        id: 'cut-maintenance',
        name: 'Cutting Phase Maintenance',
        description: 'Maintain muscle and strength while in a caloric deficit',
        duration: 12,
        goal: 'general',
        experience: ['intermediate', 'advanced'],
        dietPhases: ['cut'],
        trainingDaysRange: [3, 5],
        blocks: [
            {
                name: 'Maintenance Phase 1',
                type: 'accumulation',
                weeks: 4,
                rirRange: [2, 3],
                volumeProgression: 'linear'
            },
            {
                name: 'Maintenance Phase 2',
                type: 'accumulation',
                weeks: 4,
                rirRange: [2, 3],
                volumeProgression: 'linear'
            },
            {
                name: 'Final Push',
                type: 'intensification',
                weeks: 3,
                rirRange: [1, 2],
                volumeProgression: 'undulating'
            },
            {
                name: 'Recovery',
                type: 'deload',
                weeks: 1,
                rirRange: [4, 5],
                volumeProgression: 'linear'
            }
        ]
    },
    {
        id: 'general-fitness',
        name: 'General Fitness & Health',
        description: 'Well-rounded program for overall fitness and health',
        duration: 8,
        goal: 'general',
        experience: ['beginner', 'intermediate'],
        dietPhases: ['bulk', 'maintenance', 'cut'],
        trainingDaysRange: [3, 4],
        blocks: [
            {
                name: 'Foundation',
                type: 'accumulation',
                weeks: 3,
                rirRange: [3, 4],
                volumeProgression: 'linear'
            },
            {
                name: 'Progressive Overload',
                type: 'accumulation',
                weeks: 3,
                rirRange: [2, 3],
                volumeProgression: 'linear'
            },
            {
                name: 'Challenge Week',
                type: 'intensification',
                weeks: 1,
                rirRange: [1, 2],
                volumeProgression: 'linear'
            },
            {
                name: 'Recovery',
                type: 'deload',
                weeks: 1,
                rirRange: [4, 5],
                volumeProgression: 'linear'
            }
        ]
    }
];

// Compatibility checking function
export const checkCompatibility = (template: Template, programDetails: any) => {
    const issues: string[] = [];

    // Check experience level
    if (!template.experience.includes(programDetails.trainingExperience)) {
        const experienceMap = {
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced'
        };
        issues.push(`${experienceMap[programDetails.trainingExperience]} experience level`);
    }

    // Check diet phase
    if (!template.dietPhases.includes(programDetails.dietPhase)) {
        const dietMap = {
            bulk: 'Bulking',
            maintenance: 'Maintenance',
            cut: 'Cutting'
        };
        issues.push(`${dietMap[programDetails.dietPhase]} diet phase`);
    }

    // Check training days
    const [minDays, maxDays] = template.trainingDaysRange;
    if (programDetails.trainingDaysPerWeek < minDays || programDetails.trainingDaysPerWeek > maxDays) {
        issues.push(`${programDetails.trainingDaysPerWeek} training days per week (requires ${minDays}-${maxDays})`);
    }

    // Check duration
    if (Math.abs(template.duration - programDetails.duration) > 4) {
        issues.push(`${programDetails.duration} week duration (template is ${template.duration} weeks)`);
    }

    return {
        isCompatible: issues.length === 0,
        issues
    };
};
