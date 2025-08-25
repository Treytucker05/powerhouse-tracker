// src/lib/fiveThreeOne/validation.js

function isNum(x) {
    return typeof x === 'number' && isFinite(x) && x > 0;
}

function liftReady(l) {
    if (!l || typeof l !== 'object') return false;
    return isNum(l.tm) || isNum(l.oneRM) || (isNum(l.testWeight) && isNum(l.testReps) && l.testReps >= 1);
}

export function validateFundamentals(state) {
    const errors = [];

    // Support both legacy top-level shape and new Step 1 condensed shape under state.step1
    const lifts = state?.lifts || {};
    const step1 = state?.step1 || {};
    const enabled = state?.coreLiftsEnabled || step1?.enabledLifts || { squat: true, bench: true, deadlift: true, press: true };

    const label = { squat: 'squat', bench: 'bench press', deadlift: 'deadlift', press: 'overhead press' };
    // Helper to evaluate readiness from new step1.inputs shape
    const liftReadyFromStep1 = (inp) => {
        if (!inp || typeof inp !== 'object') return false;
        return isNum(inp.manualTm) || isNum(inp.oneRm) || (isNum(inp.repCalcWeight) && isNum(inp.repCalcReps) && Number(inp.repCalcReps) >= 1);
    };

    for (const k of ['press', 'deadlift', 'bench', 'squat']) {
        if (enabled[k] === false) continue;
        let ok = false;
        // Prefer tmTable presence if available
        if (step1?.tmTable && isNum(step1.tmTable[k])) ok = true;
        // Else check new inputs bag
        else if (step1?.inputs && liftReadyFromStep1(step1.inputs[k])) ok = true;
        // Else fallback to legacy top-level lifts
        else if (liftReady(lifts[k])) ok = true;

        if (!ok) {
            errors.push(`Enter 1RM or rep test (or set TM) for ${label[k]}`);
        }
    }

    // TM percent (global) should be reasonable
    // Canonical: tmPct decimal (0.85-0.95). Accept legacy integer fallback for migration.
    const tmPctCandidate = (typeof step1?.tmPct === 'number') ? step1.tmPct : state?.tmPct;
    const rawPct = (typeof tmPctCandidate === 'number' && tmPctCandidate > 0 && tmPctCandidate <= 1) ? tmPctCandidate : 0.90;
    if (!(rawPct >= 0.80 && rawPct <= 0.95)) {
        errors.push(`TM percentage should be 80-95% (got ${Math.round(rawPct * 100)}%)`);
    }

    // Rounding increment
    const units = state?.units || step1?.units;
    const roundingInc = state?.rounding?.increment ?? (units === 'kg' ? 2.5 : 5);
    if (!isNum(roundingInc)) {
        errors.push('Set a weight rounding increment (e.g., 5 lb or 2.5 kg)');
    }

    return { isValid: errors.length === 0, errors };
}

export function validateTemplate(state) {
    const template = state?.templateChoice?.id || state?.template?.id || state?.template;
    if (!template) {
        return { isValid: false, errors: ['Choose a template (BBB, Triumvirate, etc.)'] };
    }

    // Template-specific: BBB percent must be 50/60/70 if provided
    if (template === 'bbb') {
        const pct = state?.templateChoice?.meta?.percentage
            ?? state?.templateConfig?.bbbPercent
            ?? state?.assistance?.options?.bbb?.percent
            ?? 50;
        if (![50, 60, 70].includes(Number(pct))) {
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

    const days = Array.isArray(schedule.days) ? schedule.days : [];
    if (days.length < 1) {
        errors.push('Define at least one training day');
    }
    const bad = days.find(d => !d?.lift);
    if (bad) errors.push('Each day must have a main lift');

    // Warmup policy
    const warmup = state?.warmup || {};
    const pol = warmup.policy;
    if (!pol) errors.push('Choose a warm-up policy');
    if (pol === 'custom') {
        const arr = Array.isArray(warmup.custom) ? warmup.custom : [];
        if (!arr.length) errors.push('Custom warm-up must have at least one row');
        const invalid = arr.find(r => !(isNum(Number(r?.pct)) && isNum(Number(r?.reps))));
        if (invalid) errors.push('Custom warm-up rows need positive % and reps');
    }

    // Programming approach (Section C) foundation
    const approach = state?.programmingApproach;
    if (!approach) {
        errors.push('Select a Programming Approach (Basic, Leader/Anchor, etc.)');
    }
    if (approach === 'leaderAnchor') {
        const pattern = state?.leaderAnchorPattern || state?.programmingPattern; // backward compatibility
        if (!pattern) errors.push('Choose a Leader/Anchor pattern (2+1 or 3+1)');
        else if (!['2+1', '3+1'].includes(pattern)) errors.push('Invalid Leader/Anchor pattern');
    }

    return { isValid: errors.length === 0, errors };
}

export function validateCycleLoading(state) {
    const errors = [];

    // Loading option 1 or 2 and preview week 1-4
    const opt = Number(state?.loading?.option);
    if (![1, 2].includes(opt)) errors.push('Choose a loading option (1 or 2)');

    const pw = Number(state?.loading?.previewWeek);
    if (!(pw >= 1 && pw <= 4)) errors.push('Pick a preview week 1–4');

    // Rounding/increments
    const inc = Number(state?.rounding?.increment);
    if (!(inc > 0)) errors.push('Rounding increment must be > 0');

    const up = Number(state?.increments?.upper), lo = Number(state?.increments?.lower);
    if (!(up > 0 && lo > 0)) errors.push('Set valid TM increments for upper/lower lifts');

    return { isValid: errors.length === 0, errors };
}

export function validateAssistance(state) {
    const template = state?.templateChoice?.id || state?.template?.id || state?.template;
    if (!template) {
        return { isValid: false, errors: ['Choose a template in Step 2'] };
    }
    // Assistance specifics are configured in Step 5; Jack Shit allows none.
    return { isValid: true, errors: [] };
}

export function validateConditioning(state) {
    const errors = [];
    const conditioning = state?.conditioning || {};

    // Keep light-touch validation to avoid blocking users unnecessarily
    if (isNum(conditioning?.sessionsPerWeek) && conditioning.sessionsPerWeek > 7) {
        errors.push('Conditioning sessions per week should not exceed 7');
    }
    if (isNum(conditioning?.sessionsPerWeek) && conditioning.sessionsPerWeek > 0) {
        if (!Array.isArray(conditioning.methods) || conditioning.methods.length === 0) {
            errors.push('Select conditioning methods when scheduling sessions');
        }
    }

    return { isValid: errors.length === 0, errors };
}

export function validateAdvanced(state) {
    const errors = [];
    const advanced = state?.advanced || {};

    // AMRAP RPE cutoff validation (optional)
    if (isNum(advanced?.amrapRPECutoff) && (advanced.amrapRPECutoff < 7 || advanced.amrapRPECutoff > 10)) {
        errors.push('AMRAP RPE cutoff should be between 7-10');
    }

    return { isValid: errors.length === 0, errors };
}
