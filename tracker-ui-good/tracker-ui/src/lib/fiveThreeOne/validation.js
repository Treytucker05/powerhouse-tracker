// src/lib/fiveThreeOne/validation.js

function isNum(x) {
    return typeof x === 'number' && isFinite(x) && x > 0;
}

export function validateFundamentals(state) {
    const errors = [];
    const tm = state?.trainingMaxes || {};

    // Check that we have TMs for enabled lifts
    if (!isNum(tm.squat)) errors.push('Enter training max for squat');
    if (!isNum(tm.bench)) errors.push('Enter training max for bench press');
    if (!isNum(tm.deadlift)) errors.push('Enter training max for deadlift');
    if (!isNum(tm.overhead_press)) errors.push('Enter training max for overhead press');

    // Check TM percentage is reasonable
    const tmPct = tm.tmPercent ?? 90;
    if (!(tmPct >= 80 && tmPct <= 95)) {
        errors.push(`TM percentage should be 80-95% (got ${tmPct}%)`);
    }

    // Check rounding increment
    const rounding = tm.rounding ?? 5;
    if (!isNum(rounding)) {
        errors.push('Set a weight rounding increment (e.g., 5 lb or 2.5 kg)');
    }

    return { isValid: errors.length === 0, errors };
}

export function validateTemplate(state) {
    const template = state?.templateChoice?.id;
    if (!template) {
        return { isValid: false, errors: ['Choose a template (BBB, Triumvirate, etc.)'] };
    }

    // Template-specific validation
    if (template === 'bbb') {
        const meta = state?.templateChoice?.meta || {};
        const pct = meta.percentage ?? 50;
        if (![50, 60, 70].includes(pct)) {
            return { isValid: false, errors: ['BBB percentage must be 50%, 60%, or 70%'] };
        }
    }

    return { isValid: true, errors: [] };
}

export function validateScheduleWarmup(state) {
    const errors = [];
    const schedule = state?.schedule || {};

    if (!schedule.frequency) {
        errors.push('Select training frequency (1-4 days per week)');
    }

    if (!schedule.liftOrder || schedule.liftOrder.length === 0) {
        errors.push('Set lift order for your training week');
    }

    // Warmup validation (optional but check if enabled)
    const warmup = state?.warmup || {};
    if (warmup.enabled && !warmup.scheme) {
        errors.push('Configure warmup scheme');
    }

    return { isValid: errors.length === 0, errors };
}

export function validateCycleLoading(state) {
    const errors = [];
    const cycle = state?.cycle || {};
    const progression = state?.progression || {};

    // Check loading option
    if (!cycle.loadingOption || ![1, 2, 3, 4].includes(cycle.loadingOption)) {
        errors.push('Select a loading option (1-4)');
    }

    // Check progression increments
    if (!isNum(progression.upperIncrement)) {
        errors.push('Set upper body training max increment');
    }

    if (!isNum(progression.lowerIncrement)) {
        errors.push('Set lower body training max increment');
    }

    // Check deload configuration
    if (!cycle.deload) {
        errors.push('Configure deload week parameters');
    }

    return { isValid: errors.length === 0, errors };
}

export function validateAssistance(state) {
    const errors = [];
    const template = state?.templateChoice?.id;
    const assistance = state?.assistance || {};

    // For templates that require assistance work
    if (template === 'bbb' || template === 'triumvirate') {
        if (!assistance.preset && (!assistance.exercises || assistance.exercises.length === 0)) {
            errors.push('Configure assistance work for your chosen template');
        }
    }

    // Jack Shit template should have minimal/no assistance
    if (template === 'jackShit' && assistance.exercises?.length > 0) {
        errors.push('Jack Shit template should have minimal assistance work');
    }

    return { isValid: errors.length === 0, errors };
}

export function validateConditioning(state) {
    const errors = [];
    const conditioning = state?.conditioning || {};

    // Basic validation - conditioning is somewhat optional but should be configured
    if (conditioning.sessionsPerWeek > 7) {
        errors.push('Conditioning sessions per week should not exceed 7');
    }

    if (conditioning.sessionsPerWeek > 0 && (!conditioning.methods || conditioning.methods.length === 0)) {
        errors.push('Select conditioning methods when scheduling sessions');
    }

    return { isValid: errors.length === 0, errors };
}

export function validateAdvanced(state) {
    const errors = [];
    const advanced = state?.advanced || {};

    // AMRAP RPE cutoff validation
    if (advanced.amrapRPECutoff && (advanced.amrapRPECutoff < 7 || advanced.amrapRPECutoff > 10)) {
        errors.push('AMRAP RPE cutoff should be between 7-10');
    }

    // Advanced settings are generally optional, so minimal validation
    return { isValid: errors.length === 0, errors };
}
