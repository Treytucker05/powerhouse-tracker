// Exercise Selection Data based on SFR (Stimulus-to-Fatigue Ratio) Rankings

export const HIGH_SFR_EXERCISES = {
    chest: [
        { name: 'Machine Chest Press', sfr: 9, notes: 'Excellent isolation, consistent tension' },
        { name: 'Cable Flyes', sfr: 9, notes: 'Perfect stretch and contraction' },
        { name: 'Dumbbell Press (Incline)', sfr: 8, notes: 'Good range of motion' },
        { name: 'Dumbbell Press (Flat)', sfr: 8, notes: 'Unilateral loading benefits' },
        { name: 'Dumbbell Press (Decline)', sfr: 8, notes: 'Lower chest emphasis' }
    ],
    back: [
        { name: 'Chest-Supported Row', sfr: 10, notes: 'Eliminates momentum, pure lat work' },
        { name: 'Cable Rows (Seated)', sfr: 9, notes: 'Consistent tension curve' },
        { name: 'Lat Pulldowns', sfr: 9, notes: 'Excellent lat isolation' },
        { name: 'Cable Pulldowns (Various)', sfr: 9, notes: 'Angle variation benefits' },
        { name: 'Machine Rows', sfr: 8, notes: 'Stable platform' }
    ],
    shoulders: [
        { name: 'Machine Lateral Raise', sfr: 10, notes: 'Perfect isolation, no momentum' },
        { name: 'Cable Lateral Raise', sfr: 9, notes: 'Consistent tension' },
        { name: 'Rear Delt Fly (Machine)', sfr: 9, notes: 'Excellent rear delt isolation' },
        { name: 'Cable Rear Delt Fly', sfr: 9, notes: 'Adjustable angle' },
        { name: 'Dumbbell Lateral Raise', sfr: 8, notes: 'Unilateral loading' }
    ],
    biceps: [
        { name: 'Cable Curls', sfr: 10, notes: 'Consistent tension throughout ROM' },
        { name: 'Machine Curls', sfr: 9, notes: 'Stable, isolated movement' },
        { name: 'Spider Curls', sfr: 9, notes: 'Eliminates momentum' },
        { name: 'Preacher Curls', sfr: 8, notes: 'Stretch position emphasis' },
        { name: 'Hammer Curls', sfr: 8, notes: 'Brachialis emphasis' }
    ],
    triceps: [
        { name: 'Cable Pushdowns', sfr: 10, notes: 'Optimal resistance curve' },
        { name: 'Overhead Cable Extension', sfr: 9, notes: 'Long head emphasis' },
        { name: 'Machine Dips', sfr: 9, notes: 'Consistent loading' },
        { name: 'Cable Kickbacks', sfr: 8, notes: 'Peak contraction' },
        { name: 'Close-Grip Bench Press', sfr: 7, notes: 'Compound movement' }
    ],
    quads: [
        { name: 'Leg Press', sfr: 9, notes: 'High load capacity, safe' },
        { name: 'Hack Squat', sfr: 9, notes: 'Guided movement pattern' },
        { name: 'Leg Extension', sfr: 8, notes: 'Pure quadriceps isolation' },
        { name: 'Split Squats', sfr: 8, notes: 'Unilateral benefits' },
        { name: 'Goblet Squats', sfr: 7, notes: 'Good for beginners' }
    ],
    hamstrings: [
        { name: 'Lying Leg Curl', sfr: 10, notes: 'Perfect isolation, stretch position' },
        { name: 'Seated Leg Curl', sfr: 9, notes: 'Different strength curve' },
        { name: 'Romanian Deadlift', sfr: 8, notes: 'Excellent stretch' },
        { name: 'Stiff Leg Deadlift', sfr: 8, notes: 'Hamstring emphasis' },
        { name: 'Nordic Curls', sfr: 9, notes: 'Eccentric emphasis' }
    ],
    glutes: [
        { name: 'Hip Thrust', sfr: 10, notes: 'Perfect glute isolation' },
        { name: 'Cable Pull-Through', sfr: 9, notes: 'Hip hinge pattern' },
        { name: 'Bulgarian Split Squat', sfr: 9, notes: 'Unilateral glute work' },
        { name: 'Glute Bridge', sfr: 8, notes: 'Bodyweight progression' },
        { name: 'Lateral Lunges', sfr: 8, notes: 'Frontal plane movement' }
    ],
    calves: [
        { name: 'Calf Raise (Machine)', sfr: 9, notes: 'Consistent loading' },
        { name: 'Seated Calf Raise', sfr: 8, notes: 'Soleus emphasis' },
        { name: 'Standing Calf Raise', sfr: 8, notes: 'Gastrocnemius emphasis' },
        { name: 'Calf Press (Leg Press)', sfr: 8, notes: 'High load capacity' }
    ],
    abs: [
        { name: 'Cable Crunches', sfr: 9, notes: 'Consistent tension' },
        { name: 'Machine Crunches', sfr: 8, notes: 'Stable resistance' },
        { name: 'Hanging Leg Raises', sfr: 8, notes: 'Lower ab emphasis' },
        { name: 'Planks', sfr: 7, notes: 'Isometric strength' }
    ]
};

export const LOW_SFR_EXERCISES = {
    general: [
        { name: 'Barbell Squat', sfr: 6, notes: 'High skill requirement, fatigue cost' },
        { name: 'Conventional Deadlift', sfr: 5, notes: 'Extremely fatiguing, technical' },
        { name: 'Standing Overhead Press', sfr: 6, notes: 'Stability requirements' },
        { name: 'Bench Press', sfr: 7, notes: 'Good for strength, moderate for hypertrophy' }
    ],
    usage: 'Important for strength development but use sparingly in volume accumulation phases'
};

export const WARMUP_PROTOCOL = {
    set1: { load: '30% working', reps: 12, rest: '1 min' },
    set2: { load: '50% working', reps: 8, rest: '1 min' },
    set3: { load: '70% working', reps: 4, rest: '2 min' },
    workingSets: 'Begin after 2-3 min rest'
};

export const EXERCISE_SELECTION_PRIORITY = {
    accumulation: 'Prioritize high SFR exercises (8-10/10) for volume accumulation',
    intensification: 'Mix of high SFR and compound movements for strength',
    realization: 'Focus on competition/test exercises with supporting high SFR work',
    deload: 'Light variations of high SFR exercises'
};

export default {
    HIGH_SFR_EXERCISES,
    LOW_SFR_EXERCISES,
    WARMUP_PROTOCOL,
    EXERCISE_SELECTION_PRIORITY
};
