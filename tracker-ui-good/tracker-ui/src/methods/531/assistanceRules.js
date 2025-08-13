import { AssistanceCatalog } from './assistanceCatalog.js';

const byLift = {
    squat: ["singleLeg", "core", "posterior"],
    bench: ["push", "pull", "core"],
    deadlift: ["posterior", "core", "singleLeg"],
    press: ["push", "pull", "core"],
};

export function pickFrom(catArr) {
    return catArr && catArr.length ? { ...catArr[0] } : null; // MVP: first entry clone
}

export function assistanceFor(packId, lift) {
    const wants = {
        triumvirate: () => byLift[lift].slice(0, 2), // exactly 2
        periodization_bible: () => byLift[lift].slice(0, 3), // 3
        bodyweight: () => ["pull", "core", "singleLeg"], // 3 (bodyweight bias)
        jack_shit: () => [], // none
        bbb60: () => ["pull", "core"], // light after supplemental
        bbb: () => ["pull", "core"],
    }[packId] || (() => byLift[lift].slice(0, 2));

    return wants()
        .map((cat) => pickFrom(AssistanceCatalog[cat]))
        .filter(Boolean)
        .map(it => ({ ...it, _cat: it._cat || undefined }));
}

export function expectedAssistanceCount(packId) {
    return {
        triumvirate: 2,
        periodization_bible: 3,
        bodyweight: 3, // allow 2-3 later
        jack_shit: 0,
        bbb60: 1, // allow 1-2; we pick 2 categories but catalog may supply 1 each; using >=1 check
        bbb: 1,
    }[packId];
}
