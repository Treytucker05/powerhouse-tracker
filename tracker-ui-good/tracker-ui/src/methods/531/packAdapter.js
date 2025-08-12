// Extract supplemental (BBB) configuration from a 5/3/1 method pack.
// Returns null if not found or malformed.
export function extractSupplementalFromPack(pack, templateId = "bbb60") {
  if (!pack || !Array.isArray(pack.templates)) return null;
  const tpl = pack.templates.find(t => t.id === templateId);
  const eff = tpl?.effects?.supplemental;
  if (!eff) return null;
  return {
    mode: eff.mode || "bbb",
    pairing: eff.pairing || "same",
    intensity: eff.intensity || { kind: "percent_of", value: 60, of: "TM" },
    sets: eff.sets ?? 5,
    reps: eff.reps ?? 10,
    _provenance: eff.provenance || { source: "template", note: "pack" }
  };
}
