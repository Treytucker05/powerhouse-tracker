/*
 * exerciseDatabase.js
 * Lightweight CSV-driven exercise data loader & organizer.
 *
 * Usage:
 * 1. Place exercise_database.csv under project root /data (../data/exercise_database.csv relative to this file via process.cwd()).
 * 2. Import { loadExerciseDatabase, getExercises, getExercisesByCategory } where needed.
 * 3. Call loadExerciseDatabase() once during app bootstrap (or lazily) to populate in-memory cache.
 *
 * CSV Required Columns (header row):
 * exercise,category,equipment,default_sets,default_reps,progression_rule,notes,source
 */

// NOTE: This module avoids external CSV deps; parsing is minimal & robust for simple comma-separated files.
import { assetUrl } from '../lib/assetUrl.js';
// If fields can contain commas, consider migrating to a real CSV parser (e.g. papaparse) later.

const EXERCISE_DB_STATE = {
    loaded: false,
    rawRows: [], // raw object rows
    byName: {},  // name -> row
    byCategory: {}, // category (normalized) -> array of rows
    categories: []
};

// Basic CSV line splitter that respects quoted fields (double quotes) for commas.
function splitCSVLine(line) {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            // Toggle quotes OR escape double quote inside quotes
            if (inQuotes && line[i + 1] === '"') { // escaped quote
                cur += '"';
                i++; // skip next
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            out.push(cur.trim());
            cur = '';
        } else {
            cur += ch;
        }
    }
    out.push(cur.trim());
    return out;
}

function normalizeCategory(cat) {
    if (!cat) return 'Uncategorized';
    const c = cat.trim().toLowerCase();
    if (/pull/.test(c)) return 'Pull';
    if (/push|press|dip/.test(c)) return 'Push';
    if (/core|ab|plank|carry/.test(c)) return 'Core';
    if (/single|lunge|split|step|pistol/.test(c)) return 'Single-Leg';
    if (/posterior|hinge|ham|glute|back ext|rdl|good|hip/.test(c)) return 'Posterior';
    if (/arms|curl|triceps|bicep/.test(c)) return 'Arms';
    if (/condition|sled|prowler|sprint|rower|bike/.test(c)) return 'Conditioning';
    if (/carry/.test(c)) return 'Carry';
    return cat.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function coerceRepValue(repStr) {
    if (!repStr) return null;
    const raw = repStr.trim();
    if (/amrap/i.test(raw)) return 10; // heuristic default
    // Range like 8-12
    const rangeMatch = raw.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (rangeMatch) {
        const a = Number(rangeMatch[1]);
        const b = Number(rangeMatch[2]);
        if (Number.isFinite(a) && Number.isFinite(b) && b >= a) {
            return b; // use max value per updated spec
        }
    }
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

function parseCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length);
    if (!lines.length) return [];
    // Normalize & alias headers
    const rawHeader = splitCSVLine(lines[0]);
    const normalizeHeader = h => (h || '')
        .replace(/\ufeff/g, '') // strip BOM
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
    const ALIASES = { sets: 'default_sets', reps: 'default_reps', progression: 'progression_rule', equipment_needed: 'equipment' };
    const header = rawHeader.map(h => {
        const norm = normalizeHeader(h);
        return ALIASES[norm] || norm;
    });
    const req = ['exercise', 'category', 'equipment', 'default_sets', 'default_reps', 'progression_rule', 'notes', 'source'];
    const missing = req.filter(r => !header.includes(r));
    if (missing.length) {
        console.error('[exerciseDatabase] Missing columns:', missing.join(', '), 'present=', header);
    }
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = splitCSVLine(lines[i]);
        if (!cols.length) continue;
        const row = {};
        header.forEach((h, idx) => { row[h] = (cols[idx] || '').trim(); });
        // Ensure all required keys exist even if missing in header
        ['exercise', 'category', 'equipment', 'default_sets', 'default_reps', 'progression_rule', 'notes', 'source'].forEach(k => { if (row[k] == null) row[k] = ''; });
        if (!row.exercise) continue;
        row.category_normalized = normalizeCategory(row.category);
        row.equipment_list = row.equipment ? row.equipment.split(/\s*,\s*/).filter(Boolean) : [];
        row.numeric_reps = coerceRepValue(row.default_reps);
        rows.push(row);
    }
    return rows;
}

// Organize rows into state caches
function indexRows(rows) {
    EXERCISE_DB_STATE.rawRows = rows;
    EXERCISE_DB_STATE.byName = {};
    EXERCISE_DB_STATE.byCategory = {};
    rows.forEach(r => {
        EXERCISE_DB_STATE.byName[r.exercise.toLowerCase()] = r;
        const cat = r.category_normalized;
        if (!EXERCISE_DB_STATE.byCategory[cat]) EXERCISE_DB_STATE.byCategory[cat] = [];
        EXERCISE_DB_STATE.byCategory[cat].push(r);
    });
    EXERCISE_DB_STATE.categories = Object.keys(EXERCISE_DB_STATE.byCategory).sort();
    EXERCISE_DB_STATE.loaded = true;
}

// Public API
export async function loadExerciseDatabase({ fetchImpl } = {}) {
    if (EXERCISE_DB_STATE.loaded) return EXERCISE_DB_STATE;
    // Attempt to fetch CSV from /data path relative to app root (adjust path if bundled differently)
    const pathGuess = assetUrl('data/exercise_database.csv');
    let text = '';
    try {
        const fetchFn = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
        if (!fetchFn) throw new Error('No fetch available in this environment');
    const res = await fetchFn(pathGuess, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        text = await res.text();
        // HTML guard (wrong path or dev server fallback)
        if (text.trim().startsWith('<')) {
            throw new Error('Received HTML instead of CSV at ' + pathGuess);
        }
    } catch (err) {
        console.warn('[exerciseDatabase] Could not load CSV at', pathGuess, err.message);
        // Provide empty placeholder
        indexRows([]);
        return EXERCISE_DB_STATE;
    }
    const rows = parseCSV(text);
    indexRows(rows);
    return EXERCISE_DB_STATE;
}

export function getExercises() {
    return EXERCISE_DB_STATE.rawRows.slice();
}

export function getExercisesByCategory() {
    return EXERCISE_DB_STATE.byCategory;
}

export function getExercisesByEquipment(equipmentSubstring) {
    if (!equipmentSubstring) return getExercises();
    const q = equipmentSubstring.toLowerCase();
    return EXERCISE_DB_STATE.rawRows.filter(r => (r.equipment || '').toLowerCase().includes(q));
}

export function getExercise(name) {
    if (!name) return null;
    return EXERCISE_DB_STATE.byName[name.toLowerCase()] || null;
}

export function isLoaded() {
    return EXERCISE_DB_STATE.loaded;
}

// Placeholder export demonstrating expected structure if CSV absent
export const EXERCISE_DB_PLACEHOLDER = {
    categories: ['Pull', 'Push', 'Core', 'Posterior', 'Single-Leg', 'Arms'],
    byCategory: {
        Pull: [{ exercise: 'Chin-ups', default_sets: '5', default_reps: 'AMRAP', notes: 'Full stretch; chest to bar intent.' }],
        Push: [{ exercise: 'Dips', default_sets: '5', default_reps: '8-12', notes: 'Stay shy of painful depth.' }],
        Core: [{ exercise: 'Ab Wheel', default_sets: '3', default_reps: '8-12', notes: 'No lumbar sag.' }],
        Posterior: [{ exercise: 'Back Extension', default_sets: '3', default_reps: '10-15', notes: 'Smooth hinge.' }],
        'Single-Leg': [{ exercise: 'DB Split Squat', default_sets: '3', default_reps: '8-12', notes: 'Stay tall; knee tracks toes.' }],
        Arms: [{ exercise: 'Hammer Curl', default_sets: '3', default_reps: '10-12', notes: 'Neutral wrist; no swing.' }]
    }
};

export default {
    loadExerciseDatabase,
    getExercises,
    getExercisesByCategory,
    getExercisesByEquipment,
    getExercise,
    isLoaded,
    EXERCISE_DB_PLACEHOLDER
};
