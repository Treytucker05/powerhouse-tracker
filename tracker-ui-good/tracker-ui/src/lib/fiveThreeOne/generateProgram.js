// src/lib/fiveThreeOne/generateProgram.js
import { buildWarmups, buildMainSets } from './percentTables.js';
import { deriveLiftDayMap, DAYS } from './scheduleHelpers.js';

function liftLabel(key) {
    return ({
        overhead_press: 'Overhead Press',
        press: 'Overhead Press',
        bench: 'Bench Press',
        squat: 'Squat',
        deadlift: 'Deadlift'
    })[key] || key;
}

/**
 * Pull Training Max (TM) from wizard state for a given lift key
 */
function tmFromState(state, liftKey) {
    // Primary (current wizard shape)
    const lifts = state?.lifts || {};
    if (liftKey === 'overhead_press' || liftKey === 'press') {
        return Number(lifts?.press?.tm ?? lifts?.overhead_press?.tm ?? 0);
    }
    return Number(lifts?.[liftKey]?.tm ?? 0);
}

/**
 * Attempt to read the chosen assistance template key from state
 */
function templateKey(state) {
    // try several likely paths
    const t = state?.template || state?.templateChoice || {};
    return t?.id || t?.key || t || 'bbb';
}

/**
 * Pull per-lift assistance selections if present (pass-through).
 * If none exist, return empty; UI can fill later.
 */
function assistanceForLift(state, liftKey) {
    const byDay = state?.assistance?.perDay || state?.assistance?.byLift || {};
    const generic = state?.assistance?.selections || {};
    return byDay[liftKey] || generic[liftKey] || [];
}

/**
 * Build a single day entry with warm-ups + main sets for a week
 */
function buildDayEntry({ state, day, lift, week, includeWarmups, roundInc, loadingOption }) {
    const tm = tmFromState(state, lift === 'press' ? 'overhead_press' : lift);
    if (!tm) {
        return {
            day,
            lift,
            liftLabel: liftLabel(lift),
            tm: 0,
            warmups: [],
            mainSets: [],
            assistance: assistanceForLift(state, lift),
            notes: ''
        };
    }
    const warmups = buildWarmups(tm, includeWarmups, roundInc);
    const mainSets = buildMainSets(tm, loadingOption, week, roundInc);
    return {
        day,
        lift,
        liftLabel: liftLabel(lift),
        tm,
        warmups,
        mainSets,
        assistance: assistanceForLift(state, lift),
        notes: ''
    };
}

/**
 * Generate the full 4-week 5/3/1 program object from wizard state.
 * Non-destructive, no side effects.
 */
export function generateFiveThreeOneProgram(state = {}) {
    const createdAt = new Date().toISOString();

    const cfg = {
        version: '531-v1',
        tmPercentage: state?.tmPercent || state?.tmPercentage || 90,
        loadingOption: Number(state?.loading?.option ?? state?.loadingOption ?? 1),
        roundingIncrement: Number(state?.rounding?.increment ?? state?.roundingIncrement ?? 5),
        includeWarmups: true,
        schedule: {
            frequency: state?.schedule?.frequency || '4day',
            pattern: state?.schedule?.pattern || 'Mon/Tue/Thu/Fri',
            liftOrder: state?.schedule?.liftOrder || ['press', 'deadlift', 'bench', 'squat']
        },
        template: templateKey(state),
    };

    const dayMap = deriveLiftDayMap(state);
    const dayPlan = DAYS.map(d => ({ day: d, lift: dayMap[d] || null })).filter(x => !!x.lift);

    // Build 4 weeks
    const weeks = [1, 2, 3, 4].map(week => ({
        week,
        days: dayPlan.map(({ day, lift }) =>
            buildDayEntry({
                state,
                day,
                lift,
                week,
                includeWarmups: cfg.includeWarmups,
                roundInc: cfg.roundingIncrement,
                loadingOption: cfg.loadingOption
            })
        )
    }));

    return {
        meta: { createdAt, generator: 'powerhouse-tracker', programType: '5/3/1' },
        config: cfg,
        lifts: {
            overhead_press: tmFromState(state, 'overhead_press'),
            bench: tmFromState(state, 'bench'),
            squat: tmFromState(state, 'squat'),
            deadlift: tmFromState(state, 'deadlift')
        },
        advanced: {
            autoreg: state?.advanced?.autoreg || {},
            specialization: state?.advanced?.specialization || {},
        },
        conditioning: state?.conditioning || {},
        weeks
    };
}
