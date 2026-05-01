import fs from 'node:fs';
import path from 'node:path';

const csvPath = path.resolve('data/extraction/templates_additions.csv');

function parseCsv(text) {
    const [head, ...rows] = text.trim().split(/\r?\n/);
    const header = head.split(',').map(s => s.trim());
    const data = rows.filter(Boolean).map(line => {
        const cols = [];
        let cur = '', inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQ = !inQ; continue; }
            if (ch === ',' && !inQ) { cols.push(cur); cur = ''; continue; }
            cur += ch;
        }
        cols.push(cur);
        const obj = {};
        header.forEach((h, i) => obj[h] = (cols[i] ?? '').trim());
        return obj;
    });
    return { header, data };
}
function toCsv(header, rows) {
    const esc = v => {
        const s = v == null ? '' : String(v);
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const head = header.join(',');
    const body = rows.map(r => header.map(h => esc(r[h])).join(',')).join('\n');
    return head + '\n' + body + '\n';
}

// Canonical seed records (book-accurate). Only keys present in header will be written.
const records = [
    // ===== Beyond 5/3/1 (2013) – BBB family =====
    {
        id: 'bbb-standard-6wk',
        display_name: 'Boring But Big — 6‑Week',
        category: 'Hypertrophy',
        weekly_frequency: '4',
        main_scheme: '5/3/1 (PR on main sets)',
        supplemental: 'BBB 5x10 @ 50/50/60/60/70/70 (TM)',
        assistance_targets: 'Push/Pull/Core: 50–100 total reps',
        conditioning_guideline: '2–3 easy; optional 1 hard',
        leader_anchor: 'Leader',
        training_max: 'Start 90% TM (standard 5/3/1); BBB % from TM',
        cycles_recommended: '1',
        goal: 'Size with base strength',
        tags: 'BBB,Hypertrophy,Leader',
        source: 'Beyond (2013)',
        pages: '36',
        notes: 'Map weeks exactly: W1 50, W2 50, W3 60, W4 60, W5 70, W6 70.',
    },
    {
        id: 'bbb-variation-1',
        display_name: 'Boring But Big — Variation I',
        category: 'Hypertrophy',
        weekly_frequency: '4',
        main_scheme: '5/3/1 (PR on main sets)',
        supplemental: 'BBB 5x10 using First Work Set weight (65/70/75%)',
        assistance_targets: 'Push/Pull/Core: 50–100 reps',
        conditioning_guideline: '2–3 easy',
        leader_anchor: 'Leader',
        training_max: '90% TM basis; down sets @ 65/70/75% TM',
        cycles_recommended: '1',
        goal: 'Size with higher barbell volume',
        tags: 'BBB,Hypertrophy,Leader',
        source: 'Beyond (2013)',
        pages: '32–34',
        notes: '6-week progression; do required reps on main, then 5x10 @ first-set percent.',
    },
    {
        id: 'bbb-variation-2',
        display_name: 'Boring But Big — Variation II (10/8/5)',
        category: 'Hypertrophy',
        weekly_frequency: '4',
        main_scheme: '5/3/1 (PR on main sets)',
        supplemental: '5x10@65% / 5x8@70% / 5x5@75% (TM)',
        assistance_targets: 'Push/Pull/Core: 50–100 reps',
        conditioning_guideline: '2–3 easy',
        leader_anchor: 'Leader',
        training_max: '90% TM basis',
        cycles_recommended: '1',
        goal: 'Hypertrophy with rising intensity',
        tags: 'BBB,Hypertrophy,Leader',
        source: 'Beyond (2013)',
        pages: '35–36',
        notes: 'Week-to-week set/rep change for BBB work.',
    },
    {
        id: 'bbb-5x5',
        display_name: 'Boring But Big — 5x5 @ 80%',
        category: 'Hypertrophy → Strength bridge',
        weekly_frequency: '4',
        main_scheme: '5/3/1 (PR on main sets in prior block)',
        supplemental: 'BBB 5x5 @ 80% TM (after a 6‑wk BBB 5x10 block)',
        assistance_targets: 'Push/Pull/Core: 50–100 reps',
        conditioning_guideline: '2–3 easy',
        leader_anchor: 'Leader',
        training_max: '90% TM for main; 80% TM for 5x5',
        cycles_recommended: '1',
        goal: 'Hypertrophy → Strength ramp',
        tags: 'BBB,5x5,Leader',
        source: 'Beyond (2013)',
        pages: '37',
        notes: 'Often follows BBB 5x10 block.',
    },
    {
        id: 'bbb-5x3',
        display_name: 'Boring But Big — 5x3 @ 90%',
        category: 'Intensification',
        weekly_frequency: '4',
        main_scheme: '5/3/1',
        supplemental: 'BBB 5x3 @ 90% TM',
        assistance_targets: 'Push/Pull/Core: 50–100 reps',
        conditioning_guideline: '2 easy; 0–1 hard',
        leader_anchor: 'Leader',
        training_max: '90% TM for main; 90% TM for 5x3',
        cycles_recommended: '1',
        goal: 'Intensity exposure after 5x5 phase',
        tags: 'BBB,5x3,Leader',
        source: 'Beyond (2013)',
        pages: '38',
        notes: 'Typically run after 5x5 variation.',
    },
    {
        id: 'bbb-13wk',
        display_name: 'Boring But Big — 13‑Week Challenge',
        category: 'Hypertrophy (extended)',
        weekly_frequency: '4',
        main_scheme: '5/3/1 (PR on main sets per book guidance)',
        supplemental: 'BBB escalates across 13 weeks (50→70→TM singles)',
        assistance_targets: 'Push/Pull/Core: 50–100 reps',
        conditioning_guideline: '2–3 easy; manage fatigue',
        leader_anchor: 'Leader',
        training_max: '90% TM',
        cycles_recommended: '2–3 (spans 13 weeks)',
        goal: 'Large hypertrophy block with planning baked-in',
        tags: 'BBB,Hypertrophy,Challenge',
        source: 'Beyond (2013)',
        pages: '39–41',
        notes: 'Spans 27 weeks if you chain 5x5→5x3→5x1; see book mapping.',
    },
    // ===== Beyond 5/3/1 – Full Body family =====
    {
        id: 'full-body-v2',
        display_name: 'Full Body (v2)',
        category: 'Full Body (3 days)',
        weekly_frequency: '3',
        main_scheme: 'Day 1 Squat 5/3/1+; Day 2 Bench 5/3/1+; Day 3 Press 5/3/1 + Deadlift 5/3/1',
        supplemental: 'Second lift each day: 65/75/85x5 (or 70/80/90x3; 75/85/95; 80/90/100x1)',
        assistance_targets: 'Chins/Dips/Rows/Back raises: minimal',
        conditioning_guideline: 'Keep light to support recovery',
        leader_anchor: 'Both',
        training_max: '90% TM standard',
        cycles_recommended: '2+',
        goal: 'General strength with high weekly exposure',
        tags: 'FullBody,Beginner‑friendly',
        source: 'Beyond (2013)',
        pages: '71–72',
        notes: 'Classic v2 update to the 2E full body; simple assistance.',
    },
    // ===== Forever (2017) – Spinal Tap + Systems =====
    {
        id: 'spinal-tap-5spro-leader',
        display_name: 'Spinal Tap — 5’s PRO (Leader)',
        category: 'Volume/Skill',
        weekly_frequency: '3–4',
        main_scheme: 'Work‑set ladder (e.g., 70/80/90; 75/85/95; 65/75/85 — all x5, no PRs)',
        supplemental: '5x5 FSL commonly paired; superset assistance between all sets',
        assistance_targets: 'Superset bodyweight + single‑leg + rows per day (see notes)',
        conditioning_guideline: '2–3 hard; 3–5 easy',
        leader_anchor: 'Leader',
        training_max: '≈85% TM',
        cycles_recommended: '2–3',
        goal: 'High set exposure; bar speed; work capacity',
        tags: 'SpinalTap,5sPro,Leader',
        source: 'Forever (2017)',
        pages: '118–121',
        notes: 'Exact 9 work sets ladder; pair assistance each set. No extra reps on work sets.',
    },
    {
        id: 'spinal-tap-anchor-black-army',
        display_name: 'Spinal Tap — Anchor (Black Army Jacket)',
        category: 'Anchor (peaking lite)',
        weekly_frequency: '3–4',
        main_scheme: 'As SPINAL TAP days but allow PRs/Jokers at 90/95/85 as warranted',
        supplemental: '5x5 FSL for non‑pushed lifts',
        assistance_targets: 'Push/Pull/Core: 50–100 total reps',
        conditioning_guideline: '3–4 hard; 3–5 easy',
        leader_anchor: 'Anchor',
        training_max: '≈85% TM',
        cycles_recommended: '1–2',
        goal: 'Consolidate strength after ST Leader',
        tags: 'SpinalTap,Anchor,JokersOptional',
        source: 'Forever (2017)',
        pages: '117–121',
        notes: 'Use bar speed to decide Jokers; don’t force PRs.',
    },
    // ===== Forever – Named systems =====
    {
        id: 'god-is-a-beast-leader',
        display_name: 'God Is A Beast (Leader)',
        category: 'Specialty (size+strength)',
        weekly_frequency: '4',
        main_scheme: 'Spinal Tap (var. 1–3) as strength portion',
        supplemental: 'SST‑style supplemental as prescribed in template',
        assistance_targets: 'Push/Pull/Core typically 50–100 reps',
        conditioning_guideline: '3 hard; 3–5 easy',
        leader_anchor: 'Leader',
        training_max: '85% TM',
        cycles_recommended: '2',
        goal: 'High volume + strength; advanced recovery',
        tags: 'Leader,SST,HighVolume',
        source: 'Forever (2017)',
        pages: '107–109',
        notes: 'Pieces of BBS + Spinal Tap; longer full cycle; patience required.',
    },
    {
        id: 'fives-pro-forever',
        display_name: '5’s PRO Forever',
        category: 'System',
        weekly_frequency: '3–4',
        main_scheme: 'All lifts 5’s PRO (or 5x5/3/1)',
        supplemental: 'Choose per lift: BBB/BBS/FSL/SSL/Widowmaker',
        assistance_targets: 'Adjust per chosen supplemental',
        conditioning_guideline: '2–3 hard; 3–5 easy',
        leader_anchor: 'Leader',
        training_max: 'Variable per lift; conservative bias',
        cycles_recommended: '2–3',
        goal: 'Fatigue control; volume individualized per lift',
        tags: 'System,5sPro,Menu',
        source: 'Forever (2017)',
        pages: '218',
        notes: 'PR sets limited; per‑lift supplemental volume is the lever.',
    },
    {
        id: 'leviathan-system',
        display_name: 'Leviathan',
        category: 'System (intensity focus)',
        weekly_frequency: '3–4',
        main_scheme: 'Work to TM single every week in Leader and Anchor',
        supplemental: 'After single choose: 10x5 FSL (BBS), 5x5 FSL, or 5x10 FSL (BBB)',
        assistance_targets: 'Minimal; quality > quantity',
        conditioning_guideline: 'Keep supportive; avoid new stressors',
        leader_anchor: 'Both',
        training_max: '85–90% TM (lower if very explosive)',
        cycles_recommended: '1+1 (Leader→Anchor)',
        goal: 'Practice heavy singles without testing',
        tags: 'Leviathan,TMsingles',
        source: 'Forever (2017)',
        pages: '198–199, 211',
        notes: 'Singles, doubles or triples leading to TM; then supplemental selection.',
    },
    {
        id: 'strength-circuits',
        display_name: '5/3/1 Strength Circuits',
        category: 'Circuit (advanced)',
        weekly_frequency: '3–4',
        main_scheme: '5x5/3/1 as Leader; Anchor allows PR/Widowmaker options',
        supplemental: 'None (circuit is the work)',
        assistance_targets: 'None beyond circuit pairing',
        conditioning_guideline: 'Do easy conditioning on off‑days; advanced lifters only',
        leader_anchor: 'Leader→Anchor',
        training_max: '≤80% TM per lift',
        cycles_recommended: '1–2 + 1–2',
        goal: 'Density + bar speed; high skill',
        tags: 'Circuits,Advanced',
        source: 'Forever (2017)',
        pages: '211, 230',
        notes: 'Perfect form; never more than 80% TM; not for beginners.',
    },
    // ===== Bridge – Assistance/Anchor guidance from Forever =====
    {
        id: 'anchor-5x5-3-1-guidelines',
        display_name: 'Anchor — 5×5/3/1 Guidelines',
        category: 'Anchor guidance',
        weekly_frequency: '',
        main_scheme: 'Anchor companion rules',
        supplemental: '—',
        assistance_targets: 'Push 50–100; Pull 50–100; Single‑Leg/Core 50–100 per workout',
        conditioning_guideline: '3–4 hard; 3–5 easy (max)',
        leader_anchor: 'Anchor',
        training_max: '',
        cycles_recommended: '',
        goal: 'Assistance targets for 5×5/3/1 Anchor phase',
        tags: 'Guideline,Anchor',
        source: 'Forever (2017)',
        pages: '96–109',
        notes: 'Used by multiple Anchor templates.',
    },
    // ===== Beyond – Strength Challenge and scaffolding =====
    {
        id: 'strength-challenge',
        display_name: 'Strength Challenge (Beyond)',
        category: 'Strength block',
        weekly_frequency: '4',
        main_scheme: '5/3/1 with TM singles block progression',
        supplemental: 'Pressing/leg/back assistance 5x10 (phase 1) → 3x10 (phase 2)',
        assistance_targets: 'As per template tables',
        conditioning_guideline: '3x/week (prowler, Airdyne, walks, vest)',
        leader_anchor: 'Both (mapped across phases)',
        training_max: '90% TM; singles use TM (2–5 reps not to failure in phase 2)',
        cycles_recommended: '2 phases',
        goal: 'Drive top‑end strength while maintaining base conditioning',
        tags: 'Challenge,Strength',
        source: 'Beyond (2013)',
        pages: '166–181',
        notes: 'Clear deload and conditioning rules included.',
    },
    // ===== Beyond – Cycle structure (meta) =====
    {
        id: 'six-week-cycle-scaffold',
        display_name: '6‑Week Cycle Scaffold',
        category: 'Meta',
        weekly_frequency: '',
        main_scheme: '3x5 → 3x3 → 5/3/1; repeat; deload after two cycles',
        supplemental: 'Use any variation per cycle',
        assistance_targets: 'Template‑dependent',
        conditioning_guideline: 'Template‑dependent',
        leader_anchor: 'Both',
        training_max: '90% TM standard',
        cycles_recommended: '2 then deload',
        goal: 'Baseline planning rhythm',
        tags: 'Scaffold,Planning',
        source: 'Beyond (2013)',
        pages: '11–12',
        notes: 'Also includes 3/5/1 order option.',
    },
];

// Read current CSV, merge, de-dupe by id (prefer new).
const text = fs.readFileSync(csvPath, 'utf8');
const { header, data } = parseCsv(text);

// map seed keys to observed header
const headerSet = new Set(header);
const keyMap = {
    // normalize alternative keys to our CSV header keys when possible
    weekly_frequency: 'days_per_week',
    main_scheme: 'core_scheme',
    assistance_targets: 'assistance_guideline',
    source: 'source_book',
    pages: 'source_pages',
};

// keep only keys that exist in header
const normalize = (r) => {
    const mapped = Object.fromEntries(Object.entries(r).map(([k, v]) => [keyMap[k] ?? k, v]));
    const out = {};
    for (const h of header) out[h] = mapped[h] ?? '';
    return out;
};

const index = new Map(data.map(r => [r.id || r.ID || r.Id, r]));
for (const r of records) {
    const rid = r.id;
    if (!rid) continue;
    index.set(rid, normalize({ ...index.get(rid), ...r }));
}
const merged = Array.from(index.values());

// stable sort: category → display_name
merged.sort((a, b) => {
    const A = (a.category || '').localeCompare(b.category || '');
    if (A !== 0) return A;
    return (a.display_name || '').localeCompare(b.display_name || '');
});

fs.writeFileSync(csvPath, toCsv(header, merged), 'utf8');
console.log(`Seeded ${records.length} templates into templates_additions.csv`);
