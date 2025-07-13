// Core assessment data types
export interface Assessment {
    id: string;
    userId: string;
    name: string;
    primaryGoal: 'hypertrophy' | 'strength' | 'power' | 'hybrid';
    trainingAge: number;
    trainingExperience?: 'Beginner <1 year' | 'Intermediate 1-3 years' | 'Advanced 3-5 years' | 'Elite 5+ years';
    timeline?: '8-12 weeks' | '12-16 weeks' | '16-20 weeks' | '20+ weeks';
    recommendedSystem?: 'Linear' | 'Block' | 'Conjugate';
    createdAt: string;
    updatedAt?: string;
}

// Program block parameter types
export interface BlockParameters {
    load: string;
    time: string;
    methods: string;
    volume?: {
        sets: number;
        repsMin: number;
        repsMax: number;
    };
    intensity?: {
        percentage: number;
        rir: number; // Reps in Reserve
    };
    frequency?: number;
}

// Program block types
export interface ProgramBlock {
    id: string;
    name: string;
    type: 'accumulation' | 'intensification' | 'realization';
    duration: number; // in weeks
    parameters: BlockParameters;
    order?: number;
    description?: string;
    exercises?: Exercise[];
}

// Exercise definition
export interface Exercise {
    id: string;
    name: string;
    category: 'compound' | 'isolation' | 'accessory';
    muscleGroups: MuscleGroup[];
    equipment?: Equipment;
    description?: string;
}

// Supporting types
export type MuscleGroup =
    | 'chest'
    | 'back'
    | 'shoulders'
    | 'biceps'
    | 'triceps'
    | 'legs'
    | 'glutes'
    | 'core'
    | 'calves';

export type Equipment =
    | 'barbell'
    | 'dumbbell'
    | 'machine'
    | 'cable'
    | 'bodyweight'
    | 'kettlebell'
    | 'resistance-band';

// Program types
export interface Program {
    id: string;
    userId: string;
    name: string;
    description?: string;
    type: 'macrocycle' | 'mesocycle' | 'microcycle';
    totalDuration: number; // in weeks
    blocks: ProgramBlock[];
    assessmentId: string;
    createdAt: string;
    updatedAt?: string;
    isActive?: boolean;
}

// Timeline and progress tracking
export interface TimelineEvent {
    id: string;
    type: 'assessment' | 'program-start' | 'block-change' | 'deload' | 'test' | 'milestone';
    title: string;
    description?: string;
    date: string;
    data?: Record<string, any>;
    programId?: string;
    blockId?: string;
}

// User profile
export interface User {
    id: string;
    email?: string;
    name?: string;
    createdAt: string;
    lastActiveAt?: string;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    units: 'metric' | 'imperial';
    defaultView: 'overview' | 'program' | 'assessment';
    notifications: {
        email: boolean;
        push: boolean;
        frequency: 'daily' | 'weekly' | 'monthly';
    };
}

// Training session and workout types
export interface WorkoutSession {
    id: string;
    programId: string;
    blockId: string;
    date: string;
    exercises: WorkoutExercise[];
    duration?: number; // in minutes
    notes?: string;
    rpe?: number; // Rate of Perceived Exertion (1-10)
    completed: boolean;
}

export interface WorkoutExercise {
    id: string;
    exerciseId: string;
    sets: WorkoutSet[];
    notes?: string;
    restPeriod?: number; // in seconds
}

export interface WorkoutSet {
    id: string;
    setNumber: number;
    weight?: number;
    reps: number;
    rir?: number; // Reps in Reserve
    rpe?: number; // Rate of Perceived Exertion
    completed: boolean;
    notes?: string;
}

// API response types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Loading and error states
export interface LoadingState {
    user: boolean;
    assessment: boolean;
    program: boolean;
    timeline: boolean;
    workout: boolean;
}

export interface ErrorState {
    user?: string;
    assessment?: string;
    program?: string;
    timeline?: string;
    workout?: string;
}

// App state types
export interface AppState {
    user: User | null;
    assessment: Assessment | null;
    currentProgram: Program | null;
    timeline: TimelineEvent[];
    loading: LoadingState;
    errors: ErrorState;
}

// Action types for reducers
export interface AppAction {
    type: string;
    payload?: any;
}

// Form types
export interface AssessmentFormData {
    name: string;
    primaryGoal: Assessment['primaryGoal'];
    trainingAge: number;
    trainingExperience: Assessment['trainingExperience'];
    timeline: Assessment['timeline'];
}

export interface ProgramFormData {
    name: string;
    description?: string;
    type: Program['type'];
    totalDuration: number;
    blocks: Omit<ProgramBlock, 'id'>[];
}

// Context types
export interface AppContextValue extends AppState {
    // Actions
    updateAssessment: (data: Partial<Assessment>) => Promise<Assessment>;
    saveProgram: (data: Partial<Program>) => Promise<Program>;
    updateTimeline: (events: TimelineEvent[]) => Promise<TimelineEvent[]>;
    clearUserData: () => void;

    // Utility actions
    setLoading: (key: keyof LoadingState, value: boolean) => void;
    clearLoading: (key: keyof LoadingState) => void;
    setError: (key: keyof ErrorState, error: string) => void;
    clearError: (key: keyof ErrorState) => void;

    // Direct dispatch for advanced usage
    dispatch: React.Dispatch<AppAction>;
}

// Supabase table mappings
export interface SupabaseAssessment {
    id: string;
    user_id: string;
    primary_goal: string;
    training_experience: string;
    timeline: string;
    recommended_system: string;
    created_at: string;
    updated_at?: string;
}

export interface SupabaseProgram {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    type: string;
    total_duration: number;
    blocks: any; // JSON field
    assessment_id: string;
    created_at: string;
    updated_at?: string;
    is_active?: boolean;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Export all types as a single namespace for easier imports
export * from './index';
