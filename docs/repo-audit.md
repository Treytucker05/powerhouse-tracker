# Repository Audit

## Pack‑Derived Load Tables & Warmups (JSONC extraction)

### 1) progressions.weeks

#### Week 1 (3x5)
source: methodology/packs/531.bbb.v1.jsonc
```
[
    { "kind": "percent_of", "of": "TM", "value": 65, "reps": 5 },
    { "kind": "percent_of", "of": "TM", "value": 75, "reps": 5 },
    { "kind": "percent_of", "of": "TM", "value": 85, "reps": 5, "amrap": true }
]
```

#### Week 2 (3x3)
source: methodology/packs/531.bbb.v1.jsonc
```
[
    { "kind": "percent_of", "of": "TM", "value": 70, "reps": 3 },
    { "kind": "percent_of", "of": "TM", "value": 80, "reps": 3 },
    { "kind": "percent_of", "of": "TM", "value": 90, "reps": 3, "amrap": true }
]
```

#### Week 3 (5/3/1)
source: methodology/packs/531.bbb.v1.jsonc
```
[
    { "kind": "percent_of", "of": "TM", "value": 75, "reps": 5 },
    { "kind": "percent_of", "of": "TM", "value": 85, "reps": 3 },
    { "kind": "percent_of", "of": "TM", "value": 95, "reps": 1, "amrap": true }
]
```

#### Week 4 (Deload)
source: methodology/packs/531.bbb.v1.jsonc
```
[
    { "kind": "percent_of", "of": "TM", "value": 40, "reps": 5 },
    { "kind": "percent_of", "of": "TM", "value": 50, "reps": 5 },
    { "kind": "percent_of", "of": "TM", "value": 60, "reps": 5 }
]
```

### 2) progressions.warmups

source: methodology/packs/531.bbb.v1.jsonc
```
[
    { "kind": "percent_of", "of": "TM", "value": 40, "reps": 5 },
    { "kind": "percent_of", "of": "TM", "value": 50, "reps": 5 },
    { "kind": "percent_of", "of": "TM", "value": 60, "reps": 3 }
]
```

### 3) defaults & knobs

source: methodology/packs/531.bbb.v1.jsonc
- `defaults.tmPercent`: not present
- `defaults.rounding.lbs`: 5
- `defaults.rounding.kg`: 2.5
- `templates[0].effects.supplemental` (bbb50): intensity kind: "percent_of", value: 50, of: "TM", sets: 5, reps: 10, pairing: "same"
- `templates[1].effects.supplemental` (bbb60): intensity kind: "percent_of", value: 60, of: "TM", sets: 5, reps: 10, pairing: "same"

### 4) Cross-check vs public copy

#### progressions.weeks
- No differences: identical structure and values across all weeks

#### progressions.warmups  
- No differences: identical structure and values

#### defaults.tmPercent
- Both copies: not present

#### Notable structural differences
- Public copy: additional header comments about repair after corruption
- Private copy: 6 templates with full assistanceDefaults structure  
- Public copy: 5 templates with streamlined assistance.slots structure
- Both have identical supplemental configurations for bbb50/bbb60 templates

### 5) Fallback scan

#### scripts/verify-531.mjs
source: scripts/verify-531.mjs
```
// Default percent tables used in verifier:
const expectedPercents = {
    "3x5": [65, 75, 85],
    "3x3": [70, 80, 90], 
    "5/3/1": [75, 85, 95],
    "deload": [40, 50, 60]
}

// Warmup percentages from WARMUP_SET_PCTS:
const warmupPercs = [40, 50, 60] // with reps [5, 5, 3]
```

#### tracker-ui-good/tracker-ui/src/lib/templates/531.presets.v2.js
source: tracker-ui-good/tracker-ui/src/lib/templates/531.presets.v2.js
```
// Default warmup scheme:
warmupScheme: {
    percentages: [40, 50, 60],
    reps: [5, 5, 3]
}

// Assistance load rules with percent calculations:
ASSISTANCE_LOAD_RULES: {
    GOOD_MORNINGS: { method: 'percentOfTM', sourceLift: 'squat', percent: 0.35 },
    RDL: { method: 'percentOfTM', sourceLift: 'deadlift', percent: 0.45 },
    CLOSE_GRIP_BENCH: { method: 'percentOfTM', sourceLift: 'bench', percent: 0.60 }
}
```