// 5/3/1 assistance normalization for template review/export
import { TEMPLATE_KEYS } from '../../lib/templates/531.presets.v2.js';

// Simple catalog (could be unified later with global assistance catalog)
const CATALOG = {
    dips: { id: 'dips', name: 'Dips', sets: 5, reps: 10 },
    chinups: { id: 'chin_ups', name: 'Chin-Ups', sets: 5, reps: 8 },
    chins: { id: 'chin_ups', name: 'Chin-Ups', sets: 5, reps: 8 },
    facepull: { id: 'face_pull', name: 'Face Pull', sets: 3, reps: 15 },
    row: { id: 'db_row', name: 'DB Row', sets: 5, reps: 10 },
    legcurl: { id: 'leg_curl', name: 'Leg Curl', sets: 4, reps: 12 },
    legpress: { id: 'leg_press', name: 'Leg Press', sets: 5, reps: 12 },
    gm: { id: 'good_morning', name: 'Good Morning', sets: 4, reps: 10 },
    rdl: { id: 'rdl', name: 'RDL', sets: 4, reps: 8 },
    backext: { id: 'back_extension', name: 'Back Extension', sets: 3, reps: 15 },
    hlr: { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', sets: 3, reps: 12 },
    abwheel: { id: 'ab_wheel', name: 'Ab Wheel', sets: 3, reps: 10 },
    pushups: { id: 'push_ups', name: 'Push-Ups', sets: 3, reps: 15 },
    lunges: { id: 'lunges', name: 'Lunges', sets: 3, reps: 12 },
    sls: { id: 'single_leg_squat', name: 'Single-Leg Squat', sets: 3, reps: 8 },
    plank: { id: 'plank', name: 'Plank', sets: 3, reps: 45 }, // seconds
};

function clone(item) { return { ...item }; }

function safe(item) { return item ? clone(item) : { id: 'push_ups', name: 'Push-Ups', sets: 3, reps: 'AMRAP' }; }

// Template-specific assistance normalization
// Deprecated: normalizeAssistance moved to assistance/index.js
export { normalizeAssistance } from './assistance/index.js';

// NOTE: Legacy adapter removed (previously exported assistanceFor wrapping normalizeAssistance).
// The equipment-aware assistanceFor implementation below is the canonical export consumed
// by computeAssistance in calc.js. If a simple template normalization is needed elsewhere,
// import and call normalizeAssistance directly.
import { AssistanceCatalog as C } from "./assistanceCatalog.js";

const byLift = {
    squat: ["posterior", "core", "singleLeg"],
    bench: ["pull", "core", "push"],
    deadlift: ["posterior", "core", "singleLeg"],
    press: ["pull", "core", "push"],
};

function firstAvailable(list, equipSet) {
    const pref = ["bw", "db", "bb", "cable", "band", "machine", "kb", "landmine", "plate", "dip", "rings", "box", "bench", "abwheel"]; // priority order
    const score = (item) => Math.min(...(item.equip || []).map(t => {
        const idx = pref.indexOf(t);
        return idx === -1 ? 99 : idx;
    }));
    const filtered = list.filter(it => (it.equip || []).some(t => equipSet.has(t)));
    const pool = filtered.length ? filtered : list; // fallback if none match equipment
    return pool.slice().sort((a, b) => score(a) - score(b))[0];
}

export function assistanceFor(pack, lift, state = {}) {
    const equipSet = new Set(state?.equipment ?? ["bw", "db", "bb", "machine", "cable", "band", "kb", "bar", "bench", "box", "rings"]);
    const cats = [];
    if (pack === "jack_shit") return [];

    if (pack === "bbb") {
        // Book-aligned BBB: exactly one assistance category (opposite / complimentary)
        const pickCat = lift === "squat" ? "posterior" :
            lift === "deadlift" ? "core" :
                "pull"; // bench/press
        cats.push(pickCat);
    } else if (pack === "triumvirate") {
        cats.push(...byLift[lift].slice(0, 2));
    } else if (pack === "periodization_bible") {
        cats.push(...(lift === "squat" || lift === "deadlift"
            ? ["posterior", "singleLeg", "core"]
            : ["push", "pull", "core"]));
    } else if (pack === "bodyweight") {
        equipSet.clear(); equipSet.add("bw");
        cats.push(...(lift === "squat" || lift === "deadlift"
            ? ["singleLeg", "core", "posterior"]
            : ["pull", "push", "core"]));
    } else if (pack === "bbb60" || pack === "bbb50") {
        // Legacy BBB variants now constrained to one assistance slot
        const pickCat = lift === "squat" ? "posterior" :
            lift === "deadlift" ? "core" :
                "pull"; // bench/press
        cats.push(pickCat);
    } else {
        cats.push(...byLift[lift].slice(0, 2));
    }
    return cats.map(cat => firstAvailable(C[cat], equipSet)).filter(Boolean);
}

export function expectedAssistanceCount(pack) {
    return {
        triumvirate: 2,
        periodization_bible: 3,
        bodyweight: 3,
        jack_shit: 0,
        bbb60: v => v === 1,
        bbb50: v => v === 1,
        bbb: v => v === 1,
    }[pack];
}
