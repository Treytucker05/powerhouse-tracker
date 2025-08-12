// assistanceMapper.js
// Derives concrete assistance item placeholders from a template assistance effects object.

export function mapTemplateAssistance(effectsAssistance) {
  if (!effectsAssistance) return [];
  const { slots = [] } = effectsAssistance;
  // Each slot may have id or category plus sets/reps (which can be ranges or AMRAP strings).
  return slots.map((slot, idx) => {
    const baseName = slot.category || slot.id || `Assistance ${idx + 1}`;
    return {
      name: normalizeAssistanceName(baseName),
      sets: slot.sets ?? null,
      reps: slot.reps ?? null
    };
  });
}

function normalizeAssistanceName(raw) {
  if (!raw) return 'Assistance';
  const map = {
    upper_pull_bw: 'Bodyweight Pull (Pull-up/Chin)',
    pushup_or_dip: 'Push-up / Dip',
    core_bw: 'Core (BW)',
    single_leg_or_core: 'Single Leg / Core'
  };
  if (map[raw]) return map[raw];
  // Humanize underscores
  return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Basic volume validation: ensure each numeric-set*minReps within broad heuristic range.
export function validateAssistanceVolume(items) {
  const issues = [];
  items.forEach(it => {
    if (!it.sets || !it.reps) return; // skip incomplete
    if (typeof it.reps === 'string') {
      if (/amrap/i.test(it.reps)) return; // skip AMRAP
      const rangeMatch = it.reps.match(/^(\d+)\s*[-–]\s*(\d+)$/);
      if (rangeMatch) {
        const min = Number(rangeMatch[1]);
        const totalMin = it.sets * min;
        if (totalMin < 20 || totalMin > 80) {
          issues.push(`${it.name}: sets x minReps (${it.sets}x${min}) out of 20-80 heuristic`);
        }
        return;
      }
    }
    if (Number.isFinite(it.reps)) {
      const total = it.sets * it.reps;
      if (total < 20 || total > 80) {
        issues.push(`${it.name}: volume ${total} outside 20-80 heuristic`);
      }
    }
  });
  return issues;
}

export default { mapTemplateAssistance, validateAssistanceVolume };
