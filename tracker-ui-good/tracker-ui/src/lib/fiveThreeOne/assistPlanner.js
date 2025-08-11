// src/lib/fiveThreeOne/assistPlanner.js
import { TEMPLATE_IDS, OPPOSITES, TRIUMVIRATE_DEFAULTS, BODYWEIGHT_POOL } from './assistanceLibrary.js';

/**
 * Assistance item shape:
 * { name: string, ref?: string, sets: number, reps: number, load?: { type:'percentTM'|'bw'|'fixed', value?: number, liftRef?: string }, notes?: string }
 */

/** Build BBB items for a given day */
function buildBBB(dayKey, tms, percent = 50, pairMode = 'same') {
    const mainLift = dayKey;
    const pairLift = pairMode === 'opposite' ? (OPPOSITES[dayKey] || dayKey) : dayKey;
    const refName = pairMode === 'opposite' ? `${pairLift.toUpperCase()} (BBB)` : `${mainLift.toUpperCase()} (BBB)`;

    const liftRef = pairLift;
    const item = {
        name: refName,
        sets: 5,
        reps: 10,
        load: { type: 'percentTM', value: percent, liftRef }
    };
    return [item];
}

/** Build Triumvirate items (2 assistance) */
function buildTriumvirate(dayKey) {
    const defs = TRIUMVIRATE_DEFAULTS[dayKey] || [];
    return defs.map(d => ({
        name: d.ref.toUpperCase(),
        ref: d.ref,
        sets: d.sets,
        reps: d.reps,
        load: { type: 'bw' }
    }));
}

/** Periodization Bible builder: 3 categories, 5x10-20 default */
function buildPeriodizationBible(dayKey) {
    // Keep simple defaults; user can edit in UI
    const picks = {
        press: [
            { name: 'DB Press', sets: 5, reps: 12 },
            { name: 'Chin-Ups', sets: 5, reps: 10, load: { type: 'bw' } },
            { name: 'Pushdowns', sets: 5, reps: 15 }
        ],
        bench: [
            { name: 'DB Incline Press', sets: 5, reps: 12 },
            { name: 'Rows', sets: 5, reps: 10 },
            { name: 'Dips', sets: 5, reps: 12, load: { type: 'bw' } }
        ],
        deadlift: [
            { name: 'RDL', sets: 5, reps: 10 },
            { name: 'Leg Press', sets: 5, reps: 15 },
            { name: 'Abs', sets: 5, reps: 15, load: { type: 'bw' } }
        ],
        squat: [
            { name: 'Back Extensions', sets: 5, reps: 12 },
            { name: 'Leg Curls', sets: 5, reps: 15 },
            { name: 'Abs', sets: 5, reps: 15, load: { type: 'bw' } }
        ]
    };
    return picks[dayKey] || [];
}

/** Bodyweight builder: 2-4 movements to 75+ reps each */
function buildBodyweight(dayKey) {
    const pool = BODYWEIGHT_POOL[dayKey] || [];
    const select = pool.slice(0, 3); // default 3
    return select.map(ref => ({
        name: ref.toUpperCase(),
        ref,
        sets: 5,
        reps: 15,
        load: { type: 'bw' }
    }));
}

/** Jack Shit builder: none */
function buildJackShit() {
    return [];
}

/**
 * Generate plan per day from template + options
 * @param {string} templateId
 * @param {{bbb?:{percent:number,pairMode:'same'|'opposite'}}} options
 * @param {{press?:{tm:number}, bench?:{tm:number}, squat?:{tm:number}, deadlift?:{tm:number}}} tms
 * @returns {{press:object[], deadlift:object[], bench:object[], squat:object[]}}
 */
export function buildAssistancePlan(templateId, options, tms) {
    // Normalize template ID to our canonical constants; accept camelCase variants from older UI
    const tpl = (templateId === 'periodizationBible') ? TEMPLATE_IDS.PERIODIZATION_BIBLE
        : (templateId === 'jackShit') ? TEMPLATE_IDS.JACK_SHIT
            : templateId;
    const res = { press: [], deadlift: [], bench: [], squat: [] };
    switch (tpl) {
        case TEMPLATE_IDS.BBB: {
            const percent = Number(options?.bbb?.percent ?? 50);
            const pairMode = options?.bbb?.pairMode === 'opposite' ? 'opposite' : 'same';
            ['press', 'deadlift', 'bench', 'squat'].forEach(day => {
                res[day] = buildBBB(day, tms, percent, pairMode);
            });
            return res;
        }
        case TEMPLATE_IDS.TRIUMVIRATE: {
            ['press', 'deadlift', 'bench', 'squat'].forEach(day => { res[day] = buildTriumvirate(day); });
            return res;
        }
        case TEMPLATE_IDS.PERIODIZATION_BIBLE: {
            ['press', 'deadlift', 'bench', 'squat'].forEach(day => { res[day] = buildPeriodizationBible(day); });
            return res;
        }
        case TEMPLATE_IDS.BODYWEIGHT: {
            ['press', 'deadlift', 'bench', 'squat'].forEach(day => { res[day] = buildBodyweight(day); });
            return res;
        }
        case TEMPLATE_IDS.JACK_SHIT:
        default:
            ['press', 'deadlift', 'bench', 'squat'].forEach(day => { res[day] = buildJackShit(); });
            return res;
    }
}
