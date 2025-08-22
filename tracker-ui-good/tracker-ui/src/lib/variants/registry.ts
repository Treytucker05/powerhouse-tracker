// Central registry for primary lift variants
// Each variant maps to a base lift family used for percentage calculations.

export interface LiftVariantMeta {
    code: string;          // persistent code
    label: string;         // human readable
    base: 'press' | 'bench' | 'squat' | 'deadlift'; // base family
    isBase?: boolean;      // marks canonical base movement
}

type VariantMap = Record<string, LiftVariantMeta>;

export const VARIANT_REGISTRY: VariantMap = {
    // Press family
    overhead_press: { code: 'overhead_press', label: 'Overhead Press', base: 'press', isBase: true },
    push_press: { code: 'push_press', label: 'Push Press', base: 'press' },
    log_press: { code: 'log_press', label: 'Log Press', base: 'press' },
    // Bench family
    bench_press: { code: 'bench_press', label: 'Flat Bench', base: 'bench', isBase: true },
    close_grip_bench: { code: 'close_grip_bench', label: 'Close Grip Bench', base: 'bench' },
    incline_bench: { code: 'incline_bench', label: 'Incline Bench', base: 'bench' },
    // Squat family
    back_squat: { code: 'back_squat', label: 'Back Squat', base: 'squat', isBase: true },
    front_squat: { code: 'front_squat', label: 'Front Squat', base: 'squat' },
    safety_bar_squat: { code: 'safety_bar_squat', label: 'Safety Bar Squat', base: 'squat' },
    // Deadlift family
    conventional_deadlift: { code: 'conventional_deadlift', label: 'Conventional Deadlift', base: 'deadlift', isBase: true },
    sumo_deadlift: { code: 'sumo_deadlift', label: 'Sumo Deadlift', base: 'deadlift' },
    trap_bar_deadlift: { code: 'trap_bar_deadlift', label: 'Trap Bar Deadlift', base: 'deadlift' }
};

export function variantLabel(code?: string) {
    if (!code) return undefined;
    return VARIANT_REGISTRY[code]?.label || code.replace(/_/g, ' ');
}

export function variantBaseLift(code?: string) {
    if (!code) return undefined;
    return VARIANT_REGISTRY[code]?.base;
}
