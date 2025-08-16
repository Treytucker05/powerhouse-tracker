// Extract supplemental (BBB) configuration from a 5/3/1 method pack.
// Returns null if not found or malformed.
export function extractSupplementalFromPack(pack, templateId = "bbb50") {
    if (!pack || !Array.isArray(pack.templates)) return null;
    const tpl = pack.templates.find(t => t.id === templateId);
    const eff = tpl?.effects?.supplemental;
    if (!eff) return null;
    return {
        mode: eff.mode || "bbb",
        pairing: eff.pairing || "same",
        intensity: eff.intensity || { kind: "percent_of", value: 50, of: "TM" },
        sets: eff.sets ?? 5,
        reps: eff.reps ?? 10,
        _provenance: eff.provenance || { source: "template", note: "pack" }
    };
}

export function extractWarmups(pack) {
    return Array.isArray(pack?.progressions?.warmups) ? pack.progressions.warmups : null;
}

export function extractWeekByLabel(pack, label) {
    if (!Array.isArray(pack?.progressions?.weeks)) return null;
    const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, "");
    const target = norm(label);
    return pack.progressions.weeks.find(w => norm(w.label) === target) || null;
}
