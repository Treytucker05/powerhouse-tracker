// Assistance catalog (MVP) - minimal representative movements per category
export const AssistanceCatalog = {
    push: [
        { id: "db_press", name: "DB Press", sets: 3, reps: "8-12", load: "RPE7-8", tags: ['dumbbell', 'horizontal'] },
        { id: "incline_db_press", name: "Incline DB Press", sets: 3, reps: "8-10", load: "RPE8", tags: ['dumbbell', 'incline'] },
        { id: "dips", name: "Dips", sets: 3, reps: "AMRAP", load: "bw/+", tags: ['bodyweight', 'vertical'] },
        { id: "pushups", name: "Push-ups", sets: 3, reps: "AMRAP", load: "bw", tags: ['bodyweight', 'horizontal'] },
        { id: "oh_db_press", name: "DB Overhead Press", sets: 3, reps: "8-12", load: "RPE8", tags: ['dumbbell', 'vertical'] },
        { id: "machine_press", name: "Machine Chest Press", sets: 3, reps: "10-12", load: "RPE8", tags: ['machine'] },
    ],
    pull: [
        { id: "chinups", name: "Chin-ups", sets: 3, reps: "AMRAP", load: "bw", tags: ['bodyweight', 'vertical'] },
        { id: "pullups", name: "Pull-ups", sets: 3, reps: "AMRAP", load: "bw", tags: ['bodyweight', 'vertical'] },
        { id: "lat_pulldown", name: "Lat Pulldown", sets: 3, reps: "8-12", load: "RPE8", tags: ['cable', 'vertical'] },
        { id: "seated_row", name: "Seated Cable Row", sets: 3, reps: "8-12", load: "RPE8", tags: ['cable', 'horizontal'] },
        { id: "db_row", name: "1-Arm DB Row", sets: 3, reps: "8-12", load: "RPE8", tags: ['dumbbell', 'horizontal'] },
        { id: "face_pull", name: "Face Pull", sets: 3, reps: "12-15", load: "RPE7", tags: ['cable', 'rear_delt'] },
    ],
    singleLeg: [
        { id: "split_squat", name: "DB Split Squat", sets: 3, reps: "10-12", load: "RPE7", tags: ['dumbbell'] },
        { id: "walking_lunge", name: "Walking Lunge", sets: 3, reps: "12-16 steps", load: "RPE7", tags: ['dumbbell'] },
        { id: "reverse_lunge", name: "Reverse Lunge", sets: 3, reps: "8-12", load: "RPE8", tags: ['dumbbell'] },
        { id: "leg_press", name: "Single-Leg Press", sets: 3, reps: "10-12", load: "RPE8", tags: ['machine'] },
        { id: "step_up", name: "DB Step-up", sets: 3, reps: "8-10", load: "RPE8", tags: ['dumbbell'] },
        { id: "pistol_squat", name: "Assisted Pistol Squat", sets: 3, reps: "6-8", load: "bw", tags: ['bodyweight'] },
    ],
    posterior: [
        { id: "back_ext", name: "Back Extension", sets: 3, reps: "10-15", load: "body+plate", tags: ['bodyweight'] },
        { id: "rdl", name: "DB RDL", sets: 3, reps: "8-12", load: "RPE8", tags: ['dumbbell', 'hip_hinge'] },
        { id: "glute_ham_raise", name: "Glute-Ham Raise", sets: 3, reps: "6-10", load: "bw", tags: ['bodyweight', 'knee_flexion'] },
        { id: "leg_curl", name: "Seated Leg Curl", sets: 3, reps: "10-12", load: "RPE8", tags: ['machine', 'knee_flexion'] },
        { id: "good_morning", name: "Good Morning (light)", sets: 3, reps: "8-10", load: "RPE7", tags: ['barbell', 'hip_hinge'] },
        { id: "hip_thrust", name: "Hip Thrust", sets: 3, reps: "8-12", load: "RPE8", tags: ['barbell', 'glute'] },
    ],
    core: [
        { id: "hanging_knee_raise", name: "Hanging Knee Raise", sets: 3, reps: "10-15", load: "bw", tags: ['bodyweight', 'anterior_core'] },
        { id: "plank", name: "Plank", sets: 3, reps: "45-60s", load: "bw", tags: ['bodyweight', 'isometric'] },
        { id: "ab_wheel", name: "Ab Wheel Rollout", sets: 3, reps: "8-12", load: "bw", tags: ['bodyweight', 'anterior_core'] },
        { id: "cable_crunch", name: "Cable Crunch", sets: 3, reps: "10-15", load: "RPE8", tags: ['cable', 'anterior_core'] },
        { id: "pallof_press", name: "Pallof Press", sets: 3, reps: "10-12", load: "RPE7", tags: ['cable', 'anti_rotation'] },
        { id: "side_plank", name: "Side Plank", sets: 3, reps: "30-45s", load: "bw", tags: ['bodyweight', 'lateral_core'] },
    ],
};

export default AssistanceCatalog;
