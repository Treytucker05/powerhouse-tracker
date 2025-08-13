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
        const pickCats = lift === "squat" ? ["posterior", "core"] :
            lift === "deadlift" ? ["core", "singleLeg"] :
                ["pull", "core"]; // bench/press
        cats.push(...pickCats);
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
    } else if (pack === "bbb60") {
        cats.push("pull", "core");
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
        bbb60: v => v === 1 || v === 2,
        bbb: v => v === 1 || v === 2,
    }[pack];
}
