#!/usr/bin/env node
/**
 * apply-research-json.mjs
 *
 * Reads research.json (at repo root or config/research.json), verifies keys
 * against ProgramContextV2 allowed IDs (known dot-paths), writes a defaulted
 * config file at config/research-defaults.json, and warns about unknown IDs.
 *
 * - Non-destructive: does not modify CSV or other assets.
 * - Tolerates both array-of-keys and nested-object input. Nested objects are
 *   flattened to dot paths for verification.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'config');
const OUT_FILE = path.join(OUT_DIR, 'research-defaults.json');

// Allowed keys derived from ProgramContextV2 shape and enums.
// Keep this in sync with ProgramContextV2 initial state where possible.
const allowedKeys = new Set([
    'tmPctChoice',
    'roundingIncrement',
    'frequencyDays',
    'splitStyle',
    'phasePlan.pattern',
    'phasePlan.leader.mainSet',
    'phasePlan.anchor.mainSet',
    'supplemental.schemeId',
    'assistance.targets.push',
    'assistance.targets.pull',
    'assistance.targets.core',
    'seventhWeek.mode',
    'seventhWeek.criteria',
    'progression.increments.upper',
    'progression.increments.lower',
    'progression.rule',
    'progression.criteria.minReps',
    'logging.trackAmrap',
    'logging.est1rmFormula',
    'logging.prFlags',
    'automation.autoPercentCalc',
    'automation.autoFsl',
    'automation.autoDeload',
    'automation.autoTmUpdate',
    'includeWarmups',
    // Lift IDs (useful if research maps per-lift overrides)
    'lifts.squat',
    'lifts.bench',
    'lifts.deadlift',
    'lifts.press'
]);

// Enumerations/constraints mirroring ProgramContextV2
const enums = {
    supplementalSchemes: new Set(['fsl', 'bbb', 'bbs', 'ssl']),
    seventhWeekModes: new Set(['deload', 'tm_test']),
    seventhWeekCriteria: new Set(['afterLeader', 'every7th']),
    splitStyles: new Set(['one_lift', 'full_body']),
    phasePatterns: new Set(['2+1', '3+1']),
    est1rmFormula: new Set(['wendler', 'epley', 'brzycki'])
};

// Defaults sourced from ProgramContextV2.initialProgramV2
const defaultsByKey = {
    'tmPctChoice': 85,
    'roundingIncrement': 5,
    'frequencyDays': 4,
    'splitStyle': 'one_lift',
    'phasePlan.pattern': '2+1',
    'phasePlan.leader.mainSet': '5s_pro',
    'phasePlan.anchor.mainSet': 'pr_sets',
    'supplemental.schemeId': 'fsl',
    'assistance.targets.push': 75,
    'assistance.targets.pull': 75,
    'assistance.targets.core': 75,
    'seventhWeek.mode': 'deload',
    'seventhWeek.criteria': 'afterLeader',
    'progression.increments.upper': 5,
    'progression.increments.lower': 10,
    'progression.rule': 'pass_hold_reset',
    'progression.criteria.minReps': 5,
    'logging.trackAmrap': true,
    'logging.est1rmFormula': 'wendler',
    'logging.prFlags': true,
    'automation.autoPercentCalc': true,
    'automation.autoFsl': true,
    'automation.autoDeload': true,
    'automation.autoTmUpdate': true,
    'includeWarmups': true,
    // Lift placeholders
    'lifts.squat': { name: 'squat', oneRM: null, tm: null },
    'lifts.bench': { name: 'bench', oneRM: null, tm: null },
    'lifts.deadlift': { name: 'deadlift', oneRM: null, tm: null },
    'lifts.press': { name: 'press', oneRM: null, tm: null }
};

function readJSONOrNull(filePath) {
    try {
        if (!fs.existsSync(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`ERROR: Failed to read ${filePath}: ${e.message}`);
        return null;
    }
}

function findResearchFile() {
    const candidates = [
        path.join(ROOT, 'research.json'),
        path.join(ROOT, 'config', 'research.json'),
        path.join(ROOT, 'scripts', 'research.json')
    ];
    for (const c of candidates) {
        if (fs.existsSync(c)) return c;
    }
    return null;
}

function flattenKeys(obj, prefix = '') {
    const out = [];
    if (obj == null) return out;
    if (Array.isArray(obj)) {
        // Treat array of strings as direct keys
        for (const v of obj) {
            if (typeof v === 'string') out.push(v);
        }
        return out;
    }
    if (typeof obj !== 'object') return out;
    for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
            out.push(...flattenKeys(v, key));
        } else {
            out.push(key);
        }
    }
    return out;
}

function validateEnumerations(defaults, keysToValidate = null) {
    // Ensure defaults align to enum domains; if not, coerce (warn only when provided and invalid)
    const patched = { ...defaults };
    const warn = (msg) => console.warn(`WARN: ${msg}`);
    const shouldCheck = (k) => (keysToValidate ? keysToValidate.has(k) : Object.prototype.hasOwnProperty.call(patched, k));

    if (shouldCheck('supplemental.schemeId')) {
        const v = patched['supplemental.schemeId'];
        if (v == null) patched['supplemental.schemeId'] = 'fsl';
        else if (!enums.supplementalSchemes.has(String(v).toLowerCase())) {
            warn(`supplemental.schemeId '${v}' not in allowed set; using 'fsl'.`);
            patched['supplemental.schemeId'] = 'fsl';
        }
    }
    if (shouldCheck('seventhWeek.mode')) {
        const v = patched['seventhWeek.mode'];
        if (v == null) patched['seventhWeek.mode'] = 'deload';
        else if (!enums.seventhWeekModes.has(String(v).toLowerCase())) {
            warn(`seventhWeek.mode '${v}' not in allowed set; using 'deload'.`);
            patched['seventhWeek.mode'] = 'deload';
        }
    }
    if (shouldCheck('seventhWeek.criteria')) {
        const v = patched['seventhWeek.criteria'];
        if (v == null) patched['seventhWeek.criteria'] = 'afterLeader';
        else if (!enums.seventhWeekCriteria.has(String(v).toLowerCase())) {
            warn(`seventhWeek.criteria '${v}' not in allowed set; using 'afterLeader'.`);
            patched['seventhWeek.criteria'] = 'afterLeader';
        }
    }
    if (shouldCheck('splitStyle')) {
        const v = patched['splitStyle'];
        if (v == null) patched['splitStyle'] = 'one_lift';
        else if (!enums.splitStyles.has(String(v).toLowerCase())) {
            warn(`splitStyle '${v}' not in allowed set; using 'one_lift'.`);
            patched['splitStyle'] = 'one_lift';
        }
    }
    if (shouldCheck('phasePlan.pattern')) {
        const v = patched['phasePlan.pattern'];
        if (v == null) patched['phasePlan.pattern'] = '2+1';
        else if (!enums.phasePatterns.has(String(v).toLowerCase())) {
            warn(`phasePlan.pattern '${v}' not in allowed set; using '2+1'.`);
            patched['phasePlan.pattern'] = '2+1';
        }
    }
    if (shouldCheck('logging.est1rmFormula')) {
        const v = patched['logging.est1rmFormula'];
        if (v == null) patched['logging.est1rmFormula'] = 'wendler';
        else if (!enums.est1rmFormula.has(String(v).toLowerCase())) {
            warn(`logging.est1rmFormula '${v}' not in allowed set; using 'wendler'.`);
            patched['logging.est1rmFormula'] = 'wendler';
        }
    }
    return patched;
}

function buildDefaultsFor(keys) {
    const out = {};
    for (const k of keys) {
        if (k in defaultsByKey) out[k] = defaultsByKey[k];
        else out[k] = null; // known key but no specific default captured
    }
    return validateEnumerations(out);
}

function writeJSON(filePath, data) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
    const researchPath = findResearchFile();
    const research = researchPath ? readJSONOrNull(researchPath) : null;

    let inputKeys = [];
    if (Array.isArray(research)) inputKeys = flattenKeys(research);
    else if (research && typeof research === 'object') inputKeys = flattenKeys(research);

    const recognized = [];
    const unknown = [];
    for (const key of inputKeys) {
        if (allowedKeys.has(key)) recognized.push(key);
        else unknown.push(key);
    }

    const uniqueRecognized = Array.from(new Set(recognized)).sort();
    const uniqueUnknown = Array.from(new Set(unknown)).sort();

    const defaults = buildDefaultsFor(uniqueRecognized);

    const output = {
        source: 'scripts/apply-research-json.mjs',
        researchFile: researchPath ? path.relative(ROOT, researchPath) : null,
        timestamp: new Date().toISOString(),
        recognized: uniqueRecognized,
        unknown: uniqueUnknown,
        defaults
    };

    writeJSON(OUT_FILE, output);

    if (uniqueUnknown.length) {
        for (const k of uniqueUnknown) {
            console.warn(`WARN: Unknown research key '${k}' (not in ProgramContextV2 allowed IDs).`);
        }
    }

    console.log(`Research defaults written to ${path.relative(ROOT, OUT_FILE)}.`);
    if (!researchPath) {
        console.log('No research.json found. Wrote baseline defaults with empty recognized/unknown sets.');
    }
}

main();
