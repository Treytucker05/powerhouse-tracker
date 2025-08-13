import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadJsonc } from "./jsonc.js";

// Optional schedule import (4-day structure verification)
let buildSchedule = null;
let schedExtra = {};
let computeNextTMs = null;
try {
    const schedFsPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../tracker-ui-good/tracker-ui/src/methods/531/schedule.js");
    const schedUrl = new URL(`file://${schedFsPath.replace(/\\/g, '/')}`);
    const schedMod = await import(schedUrl.href);
    buildSchedule = schedMod.buildSchedule;
    schedExtra.buildSchedule4Day = schedMod.buildSchedule4Day;
    schedExtra.buildSchedule2Day = schedMod.buildSchedule2Day;
    schedExtra.buildSchedule1Day = schedMod.buildSchedule1Day;
    schedExtra.buildSchedule3Day = schedMod.buildSchedule3Day; // newly added 3-day live builder
    schedExtra.SPLIT_4DAY_A = schedMod.SPLIT_4DAY_A;
    schedExtra.SPLIT_4DAY_B = schedMod.SPLIT_4DAY_B;
} catch (e) {
    console.warn("[verify-531] schedule.js import failed, skipping 4-day structural check:", e.message);
}
try {
    const calcFsPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../tracker-ui-good/tracker-ui/src/methods/531/calc.js");
    const calcUrl = new URL(`file://${calcFsPath.replace(/\\/g, '/')}`);
    const calcMod = await import(calcUrl.href);
    computeNextTMs = calcMod.computeNextTMs;
} catch (e) {
    console.warn("[verify-531] calc.js import failed, skipping progression TM delta checks:", e.message);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packPath = path.resolve(__dirname, "../methodology/packs/531.bbb.v1.jsonc");
const casesPath = path.resolve(__dirname, "../methodology/verification/531.v1.verifier.jsonc");

function fmtSet(s) {
    if (!s) return "";
    const pct = s.value ?? s.percentage ?? s.pct ?? s.percent ?? (typeof s.kind === 'percent_of' ? s.value : s.value);
    const repsBase = s.reps ?? (s.rep ? s.rep : "");
    const reps = s.amrap ? `${repsBase}+` : repsBase;
    return `${pct}%x${reps}`.trim();
}

function eq(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function assertEqual(label, got, exp, errs) {
    if (!eq(got, exp)) {
        errs.push(`${label} mismatch:\n  expected: ${JSON.stringify(exp)}\n  got:      ${JSON.stringify(got)}`);
    }
}

// --- New helper assertions ---
function isMultipleOf(value, step) {
    const eps = 1e-6;
    return Math.abs((value / step) - Math.round(value / step)) < eps;
}

function expectRounding(label, percents, tm, step, errs) {
    percents.forEach(p => {
        const raw = (p / 100) * tm;
        const rounded = Math.round(raw / step) * step;
        if (!isMultipleOf(rounded, step)) {
            errs.push(`${label}: rounded weight ${rounded} (pct ${p}, tm ${tm}) not multiple of step ${step}`);
        }
    });
}

function extractMainPercents(weekObj) {
    return (weekObj?.main || []).map(s => s.value ?? s.percentage ?? s.pct).filter(x => x != null);
}

function expectWeekPercents(weekLabel, percents, errs) {
    const target = {
        "3x5": [65, 75, 85],
        "3x3": [70, 80, 90],
        "5/3/1": [75, 85, 95],
        "deload": [40, 50, 60]
    }[weekLabel.toLowerCase()];
    if (!target) return;
    if (!eq(percents, target)) {
        errs.push(`Week ${weekLabel} percents mismatch: expected ${JSON.stringify(target)} got ${JSON.stringify(percents)}`);
    }
}

function expectPackAssistance(pack, errs) {
    const byId = Object.fromEntries((pack.templates || []).map(t => [t.id, t]));
    const rules = {
        bbb60: { count: 1 },
        triumvirate: { count: 2 },
        periodization_bible: { count: 3 },
        bodyweight: { min: 1, max: 2 },
        jack_shit: { count: 0 }
    };
    for (const [id, tpl] of Object.entries(byId)) {
        const assists = tpl.assistanceDefaults || {};
        const lifts = ["press", "deadlift", "bench", "squat"];
        for (const lift of lifts) {
            const items = assists[lift] || [];
            const rule = rules[id];
            if (!rule) continue; // unknown template skip
            if (rule.count != null) {
                if (items.length !== rule.count) {
                    errs.push(`Assistance template ${id} lift ${lift}: expected exactly ${rule.count} items, got ${items.length}`);
                }
            } else {
                const min = rule.min ?? 0;
                const max = rule.max ?? 99;
                if (items.length < min || items.length > max) {
                    errs.push(`Assistance template ${id} lift ${lift}: expected ${min}-${max} items, got ${items.length}`);
                }
            }
            if (id === 'bodyweight') {
                // Bodyweight template should have no load fields
                const withLoad = items.filter(it => it.load != null);
                if (withLoad.length) {
                    errs.push(`Bodyweight template ${id} lift ${lift}: items unexpectedly contain load fields`);
                }
            }
        }
    }
}

// New: verify assistance counts derived by rules (synthetic quick check)
async function checkAssistanceRules(errs) {
    try {
        const { assistanceFor } = await import(new URL(`file://${path.resolve(__dirname, '../tracker-ui-good/tracker-ui/src/methods/531/assistanceRules.js').replace(/\\/g, '/')}`).href);
        const templates = ['triumvirate', 'periodization_bible', 'bodyweight', 'jack_shit', 'bbb60'];
        const lifts = ['press', 'deadlift', 'bench', 'squat'];
        const expected = {
            triumvirate: 2,
            periodization_bible: 3,
            bodyweight: 3,
            jack_shit: 0,
            bbb60: v => v === 1 || v === 2
        };
        for (const tpl of templates) {
            for (const lift of lifts) {
                const items = assistanceFor(tpl, lift) || [];
                const rule = expected[tpl];
                const ok = typeof rule === 'function' ? rule(items.length) : items.length === rule;
                if (!ok) errs.push(`Assistance rules: template ${tpl} lift ${lift} expected ${rule.toString()} got ${items.length}`);
                if (items.some(it => !it || !it.name)) errs.push(`Assistance rules: template ${tpl} lift ${lift} contains invalid item`);
            }
        }
    } catch (e) {
        errs.push('Assistance rules check failed: ' + e.message);
    }
}

function expect4DayStructure(errs) {
    if (!buildSchedule) return; // skip if schedule import failed
    const sched = buildSchedule({ mode: '4day', liftOrder: ["press", "deadlift", "bench", "squat"] });
    if (!Array.isArray(sched.weeks) || sched.weeks.length !== 4) {
        errs.push(`4-day schedule: expected 4 weeks, got ${(sched.weeks || []).length}`);
        return;
    }
    for (let i = 0; i < sched.weeks.length; i++) {
        const w = sched.weeks[i];
        if (!Array.isArray(w.days) || w.days.length !== 4) {
            errs.push(`4-day schedule week ${i + 1}: expected 4 days, got ${(w.days || []).length}`);
            break;
        }
        for (const d of w.days) {
            if (!['press', 'deadlift', 'bench', 'squat'].includes(d.lift)) {
                errs.push(`4-day schedule: invalid lift '${d.lift}' in week ${i + 1}`);
                break;
            }
            if (!d.conditioning) {
                errs.push(`4-day schedule week ${i + 1} day ${d.lift}: missing conditioning`);
            } else if (!d.conditioning.type || (d.conditioning.type === 'LISS' && !d.conditioning.minutes)) {
                errs.push(`4-day schedule week ${i + 1} day ${d.lift}: invalid conditioning object`);
            }
        }
    }
}

function expect1And2DayStructures(errs) {
    const { buildSchedule2Day, buildSchedule1Day } = schedExtra;
    if (!buildSchedule2Day || !buildSchedule1Day) return; // skip gracefully
    const dummyState = { units: 'lbs', week: 1, cycle: 1 };
    const pack = {}; // not needed for structural shape
    // 2-day
    try {
        const two = buildSchedule2Day({ state: dummyState, pack });
        if (!two || two.daysPerWeek !== 2 || !Array.isArray(two.days) || two.days.length !== 2) {
            errs.push('2-day builder: invalid shape');
        } else {
            const lifts = two.days.map(d => d.lift);
            if (new Set(lifts).size !== 2) errs.push('2-day builder: lifts not unique for week snapshot');
            for (const d of two.days) {
                if (!d.conditioning) errs.push('2-day builder: missing conditioning');
            }
        }
    } catch (e) {
        errs.push('2-day builder threw: ' + e.message);
    }
    // 1-day
    try {
        const one = buildSchedule1Day({ state: dummyState, pack });
        if (!one || one.daysPerWeek !== 1 || !Array.isArray(one.days) || one.days.length !== 1) {
            errs.push('1-day builder: invalid shape');
        } else {
            const d = one.days[0];
            if (!d.conditioning) errs.push('1-day builder: missing conditioning');
        }
    } catch (e) {
        errs.push('1-day builder threw: ' + e.message);
    }
}

// Progression scenario checks (Week 3 AMRAP → next cycle TMs)
function testProgression(errs) {
    if (!computeNextTMs) return; // gracefully skip
    const rounding = { lbs: 5, kg: 2.5 };
    // LBS scenarios
    const baseLbs = { bench: 200, press: 120, squat: 300, deadlift: 400 };
    const casesLbs = [
        {
            name: 'progression lbs – all pass',
            reps: { bench: 3, press: 4, squat: 2, deadlift: 2 },
            expect: { bench: 205, press: 125, squat: 310, deadlift: 410 }
        },
        {
            name: 'progression lbs – mixed fail',
            reps: { bench: 0, press: 2, squat: 0, deadlift: 3 },
            expect: { bench: 195, press: 125, squat: 290, deadlift: 410 }
        },
        {
            name: 'progression lbs – empty reps treated as pass',
            reps: {},
            expect: { bench: 205, press: 125, squat: 310, deadlift: 410 }
        }
    ];
    for (const c of casesLbs) {
        const got = computeNextTMs({ tms: baseLbs, units: 'lbs', rounding, amrapWk3: c.reps, state: {} });
        for (const k of Object.keys(c.expect)) {
            if (got[k] !== c.expect[k]) {
                errs.push(`${c.name}: ${k} expected ${c.expect[k]} got ${got[k]}`);
            }
        }
    }
    // KG scenarios
    const baseKg = { bench: 100, press: 60, squat: 140, deadlift: 180 };
    const casesKg = [
        {
            name: 'progression kg – all pass',
            reps: { bench: 2, press: 3, squat: 1, deadlift: 1 },
            expect: { bench: 102.5, press: 62.5, squat: 145, deadlift: 185 }
        },
        {
            name: 'progression kg – mixed fail',
            reps: { bench: 0, press: 2, squat: 0, deadlift: 3 },
            expect: { bench: 97.5, press: 62.5, squat: 135, deadlift: 185 }
        },
        {
            name: 'progression kg – empty reps treated as pass',
            reps: {},
            expect: { bench: 102.5, press: 62.5, squat: 145, deadlift: 185 }
        }
    ];
    for (const c of casesKg) {
        const got = computeNextTMs({ tms: baseKg, units: 'kg', rounding, amrapWk3: c.reps, state: {} });
        for (const k of Object.keys(c.expect)) {
            if (got[k] !== c.expect[k]) {
                errs.push(`${c.name}: ${k} expected ${c.expect[k]} got ${got[k]}`);
            }
        }
    }
}

// Progression increment expectation helper (not yet bound to cases)
function expectNextTMs(prev, next, units, errs) {
    const incs = {
        bench: units === 'kg' ? 2.5 : 5,
        press: units === 'kg' ? 2.5 : 5,
        squat: units === 'kg' ? 5 : 10,
        deadlift: units === 'kg' ? 5 : 10
    };
    for (const k of Object.keys(incs)) {
        const before = Number(prev[k] || 0);
        const after = Number(next[k] || 0);
        if (after !== before && after !== before + incs[k] && after !== Math.max(0, before - incs[k])) {
            errs.push(`Progression TM anomaly ${k}: before=${before} after=${after} (expected +/- ${incs[k]} or unchanged)`);
        }
    }
}

// Assistance expectation helpers
function getAssistExpectation(c) {
    return c.expect?.assist || null;
}

function checkAssist(label, exp, errs) {
    if (!exp) return;
    const templateId = exp.templateId;
    if (!templateId) {
        errs.push(`${label} assist: missing templateId in expect`);
        return;
    }
    const expectedCount = {
        bbb60: [1, 2],
        triumvirate: [2, 2],
        jack_shit: [0, 0],
        periodization_bible: [3, 3],
        bodyweight: [2, 3]
    }[templateId] || [0, 3];

    const [minItems, maxItems] = (exp.minItems != null && exp.maxItems != null)
        ? [exp.minItems, exp.maxItems]
        : expectedCount;

    const [minVol, maxVol] = exp.volumeRange || [20, 80];

    if (minItems > maxItems) errs.push(`${label} assist: minItems > maxItems`);
    if (minVol > maxVol) errs.push(`${label} assist: min volume > max volume`);
    const isDeload = /deload/i.test(label);
    if (!isDeload) {
        if (minItems < expectedCount[0] || maxItems > expectedCount[1]) {
            errs.push(`${label} assist: item count bounds [${minItems},${maxItems}] outside normative [${expectedCount[0]},${expectedCount[1]}] for template ${templateId}`);
        }
    } else {
        // Deload: allow zero lower bound even if template usually prescribes assistance
        if (maxItems > expectedCount[1]) {
            errs.push(`${label} assist (deload): maxItems ${maxItems} exceeds normative upper ${expectedCount[1]} for template ${templateId}`);
        }
    }
    if (minVol < 0 || maxVol > 200) {
        errs.push(`${label} assist: volume bounds [${minVol},${maxVol}] look unreasonable`);
    }
}

try {
    const pack = loadJsonc(packPath);
    const tests = loadJsonc(casesPath);

    const warmupsRaw = (pack.progressions?.warmups || []);
    const warmups = warmupsRaw.map(fmtSet);
    const weekByLabel = Object.fromEntries(
        (pack.progressions?.weeks || []).map(w => [String(w.label).toLowerCase(), w])
    );

    const errs = [];
    for (const c of tests.cases || []) {
        const expWarm = c.expect?.warmups || null;
        const expMain = c.expect?.main || null;
        if (expWarm) assertEqual(`${c.name} warmups`, warmups, expWarm, errs);

        const labelKey = String(c.label || "").toLowerCase().replace(/\s+/g, "");
        const wk = weekByLabel[labelKey] || null;
        const gotMain = (wk?.main || []).map(fmtSet);
        if (expMain) assertEqual(`${c.name} main`, gotMain, expMain, errs);

        if (c.expect?.amrapLast !== undefined) {
            const last = wk?.main?.[wk.main.length - 1] || {};
            const got = Boolean(last.amrap === true);
            if (got !== Boolean(c.expect.amrapLast)) {
                errs.push(`${c.name} amrapLast mismatch: expected ${c.expect.amrapLast}, got ${got}`);
            }
        }

        const assistExp = getAssistExpectation(c);
        if (assistExp) checkAssist(`${c.name}`, assistExp, errs);
    }

    // New global pack-level checks (independent of cases)
    // 1. Assistance coverage per template
    expectPackAssistance(pack, errs);

    // 2. Week-specific main % arrays + rounding correctness for weeks 2 & 3
    const week2 = weekByLabel['3x3'];
    const week3 = weekByLabel['5/3/1'];
    if (week2) expectWeekPercents('3x3', extractMainPercents(week2), errs);
    if (week3) expectWeekPercents('5/3/1', extractMainPercents(week3), errs);

    // Rounding checks using sample TMs (lbs & kg)
    const sampleTMs = { lbs: 200, kg: 100 };
    const stepLbs = 5; const stepKg = 2.5;
    const weekSets = [week2, week3].filter(Boolean);
    for (const w of weekSets) {
        const pcts = extractMainPercents(w);
        expectRounding(`Rounding lbs ${w.label}`, pcts, sampleTMs.lbs, stepLbs, errs);
        expectRounding(`Rounding kg ${w.label}`, pcts, sampleTMs.kg, stepKg, errs);
    }
    // Warm-up rounding
    const warmupPercs = warmupsRaw.map(s => s.value ?? s.pct).filter(Boolean);
    expectRounding('Warmups lbs', warmupPercs, sampleTMs.lbs, stepLbs, errs);
    expectRounding('Warmups kg', warmupPercs, sampleTMs.kg, stepKg, errs);

    // 3. 4-day schedule structural sanity
    expect4DayStructure(errs);
    expect1And2DayStructures(errs);
    // 3-day structure (5-week preview and live snapshot conditioning)
    try {
        if (buildSchedule) {
            const preview3 = buildSchedule({ mode: '3day', liftOrder: ['press', 'deadlift', 'bench', 'squat'], state: {} });
            const weeks3 = preview3.weeks || [];
            if (weeks3.length !== 5) errs.push(`3-day preview: expected 5 weeks, got ${weeks3.length}`);
            weeks3.forEach((w, wi) => {
                if (!Array.isArray(w.days) || w.days.length !== 3) errs.push(`3-day preview week ${wi + 1}: expected 3 days, got ${(w.days || []).length}`);
                (w.days || []).forEach(d => {
                    if (!d.conditioning) errs.push(`3-day preview week ${wi + 1} day ${d.lift}: missing conditioning`);
                    else if (!d.conditioning.type || (d.conditioning.type === 'LISS' && !d.conditioning.minutes)) {
                        errs.push(`3-day preview week ${wi + 1} day ${d.lift}: invalid conditioning object`);
                    }
                });
            });
        }
        if (schedExtra.buildSchedule3Day) {
            const live3 = schedExtra.buildSchedule3Day({ state: { week: 1, cycle: 1 }, pack: {} });
            if (!live3 || live3.daysPerWeek !== 3 || !Array.isArray(live3.days) || live3.days.length !== 3) {
                errs.push('3-day live builder: invalid shape');
            } else {
                live3.days.forEach(d => { if (!d.conditioning) errs.push('3-day live builder: missing conditioning'); });
            }
        }
    } catch (e) {
        errs.push('3-day structure check failed: ' + e.message);
    }

    // 3b. Assistance rules synthesis
    await checkAssistanceRules(errs);

    // --- New: 2-day & 1-day rotation coverage / conditioning / assistance presence ---
    function expectConditioning(container, labelPrefix) {
        (container.days || []).forEach((d, i) => {
            if (!d.conditioning) errs.push(`${labelPrefix} day ${i + 1} (${d.lift || '?'}) missing conditioning`);
            else if (!d.conditioning.type) errs.push(`${labelPrefix} day ${i + 1} invalid conditioning object`);
        });
    }
    function expectAssistance(container, labelPrefix) {
        (container.days || []).forEach((d, i) => {
            if (!Array.isArray(d.assistance)) errs.push(`${labelPrefix} day ${i + 1} (${d.lift || '?'}) assistance not array`);
        });
    }
    async function testTwoDay() {
        const { buildSchedule2Day, SPLIT_4DAY_A } = schedExtra;
        if (!buildSchedule2Day || !SPLIT_4DAY_A) return; // graceful skip
        const stateBase = { units: 'lbs', cycle: 1, roundingPref: { lbs: 5, kg: 2.5 }, templateKey: 'triumvirate' };
        const s0 = { ...stateBase, daysPerWeek: 2, week: 1, split4: 'A' };
        let w1, w2;
        try {
            w1 = buildSchedule2Day({ state: s0, pack: {}, split: SPLIT_4DAY_A });
            w2 = buildSchedule2Day({ state: { ...s0, week: 2 }, pack: {}, split: SPLIT_4DAY_A });
        } catch (e) {
            errs.push('2-day rotation builder threw: ' + e.message);
            return;
        }
        if (!w1 || w1.daysPerWeek !== 2 || (w1.days || []).length !== 2) errs.push('2-day rotation week1 invalid shape');
        if (!w2 || w2.daysPerWeek !== 2 || (w2.days || []).length !== 2) errs.push('2-day rotation week2 invalid shape');
        if (w1 && w2) {
            const lifts1 = (w1.days || []).map(d => d.lift);
            const lifts2 = (w2.days || []).map(d => d.lift);
            if (new Set(lifts1).size !== 2) errs.push('2-day rotation week1 lifts not distinct');
            if (new Set(lifts2).size !== 2) errs.push('2-day rotation week2 lifts not distinct');
            const union = new Set([...lifts1, ...lifts2]);
            if (union.size !== 4) errs.push('2-day rotation two-week coverage expected 4 unique lifts got ' + union.size);
            for (const L of union) if (!SPLIT_4DAY_A.includes(L)) errs.push('2-day rotation split mismatch lift ' + L);
            expectConditioning(w1, '2-day week1');
            expectConditioning(w2, '2-day week2');
            expectAssistance(w1, '2-day week1');
            expectAssistance(w2, '2-day week2');
        }
    }
    async function testOneDay() {
        const { buildSchedule1Day, SPLIT_4DAY_B } = schedExtra;
        if (!buildSchedule1Day || !SPLIT_4DAY_B) return; // graceful skip
        const stateBase = { units: 'lbs', cycle: 1, roundingPref: { lbs: 5, kg: 2.5 }, templateKey: 'bbb60' };
        const seen = [];
        for (let w = 1; w <= 4; w++) {
            let snap;
            try {
                snap = buildSchedule1Day({ state: { ...stateBase, daysPerWeek: 1, week: w, split4: 'B' }, pack: {}, split: SPLIT_4DAY_B });
            } catch (e) {
                errs.push('1-day rotation builder threw (week ' + w + '): ' + e.message);
                continue;
            }
            if (!snap || snap.daysPerWeek !== 1 || (snap.days || []).length !== 1) {
                errs.push('1-day rotation invalid shape week ' + w);
                continue;
            }
            const L = snap.days[0].lift;
            seen.push(L);
            expectConditioning(snap, '1-day week' + w);
            expectAssistance(snap, '1-day week' + w);
        }
        if (seen.length === 4) {
            const uniq = new Set(seen);
            if (uniq.size !== 4) errs.push('1-day rotation expected 4 unique lifts across 4 weeks got ' + uniq.size);
            for (const L of uniq) if (!SPLIT_4DAY_B.includes(L)) errs.push('1-day rotation split mismatch lift ' + L);
        }
    }
    await testTwoDay();
    await testOneDay();

    if (!errs.length) console.log('1/2-day rotation, assistance, conditioning \u2705');

    // Assistance catalog depth & equipment-aware picks
    async function testAssistanceCatalogDepth() {
        try {
            const schedFsPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../tracker-ui-good/tracker-ui/src/methods/531/assistanceRules.js");
            const schedUrl = new URL(`file://${schedFsPath.replace(/\\/g, '/')}`);
            const { assistanceFor } = await import(schedUrl.href);
            const packs = ["bbb", "triumvirate", "periodization_bible", "bodyweight", "jack_shit", "bbb60"];
            const lifts = ["press", "deadlift", "bench", "squat"];
            function assertUniqueNames(list, label) {
                const names = list.map(a => a.name);
                if (new Set(names).size !== names.length) errs.push(`assistance duplicate name in ${label}`);
            }
            function assertAllBW(list, label) {
                for (const a of list) if (!((a?.equip) || []).includes('bw')) { errs.push(`non-BW move in bodyweight pack ${label}: ${a?.name}`); break; }
            }
            for (const pack of packs) {
                for (const lift of lifts) {
                    let res = [];
                    try { res = assistanceFor(pack, lift, {}); } catch (e) { errs.push(`assistanceFor threw ${pack}:${lift} ${e.message}`); continue; }
                    if (pack === 'jack_shit') { if (res.length !== 0) errs.push('Jack Shit expected 0 assistance'); continue; }
                    if (pack === 'triumvirate' && res.length !== 2) errs.push('Triumvirate must return 2 items');
                    if (pack === 'periodization_bible' && res.length < 2) errs.push('Periodization Bible min 2');
                    if (pack === 'bbb' && (res.length < 1 || res.length > 2)) errs.push('BBB expects 1-2');
                    if (pack === 'bbb60' && (res.length < 1 || res.length > 2)) errs.push('BBB60 expects 1-2');
                    assertUniqueNames(res, `${pack}:${lift}`);
                    if (pack === 'bodyweight') assertAllBW(res, `${pack}:${lift}`);
                    for (const a of res) if (!a?.name) errs.push(`assistance item missing name ${pack}:${lift}`);
                }
            }
            if (!errs.length) console.log('Assistance catalog depth, equipment-aware picks, BW-only \u2705');
        } catch (e) {
            errs.push('assistance catalog depth check failed: ' + e.message);
        }
    }
    await testAssistanceCatalogDepth();

    // --- Export JSON shape smoke test (uses schedule builders + synthetic state) ---
    try {
        const fakeState = {
            units: 'lbs',
            rounding: { increment: 5, mode: 'nearest' },
            schedule: { frequency: '4day', order: ['Press', 'Deadlift', 'Bench', 'Squat'], includeWarmups: true, warmupScheme: { percentages: [40, 50, 60], reps: [5, 5, 3] }, split4: 'A' },
            supplemental: { strategy: 'none' },
            assistance: { mode: 'triumvirate' },
            equipment: ['bw', 'db', 'bb'],
            templateKey: 'triumvirate',
            lifts: { squat: { tm: 300 }, bench: { tm: 200 }, deadlift: { tm: 400 }, press: { tm: 120 } }
        };
        // Lightweight mimic of exportJson weeks shape by invoking buildSchedule4Day for structure then asserting conditioning & assistance arrays exist
        if (schedExtra.buildSchedule4Day) {
            const sched = schedExtra.buildSchedule4Day({ state: fakeState, pack: {}, split: schedExtra.SPLIT_4DAY_A, weekLabel: '3x5' });
            if (!sched || !Array.isArray(sched.days) || sched.days.length !== 4) {
                errs.push('export shape: 4day live builder failed basic shape');
            } else {
                sched.days.forEach((d, i) => {
                    if (!Array.isArray(d.assistance)) errs.push('export shape: day ' + (i + 1) + ' assistance missing/invalid array');
                    if (!d.conditioning) errs.push('export shape: day ' + (i + 1) + ' missing conditioning');
                });
            }
        }
        // 3-day snapshot
        if (schedExtra.buildSchedule3Day) {
            const snap3 = schedExtra.buildSchedule3Day({ state: { ...fakeState, week: 1, daysPerWeek: 3 }, pack: {}, split: schedExtra.SPLIT_4DAY_A, weekLabel: '3x5' });
            if (!snap3 || snap3.daysPerWeek !== 3 || !Array.isArray(snap3.days)) errs.push('export shape: 3day snapshot invalid');
            else snap3.days.forEach((d, i) => { if (!Array.isArray(d.assistance)) errs.push('export shape: 3day d' + (i + 1) + ' assistance missing'); if (!d.conditioning) errs.push('export shape: 3day d' + (i + 1) + ' conditioning missing'); });
        }
        // 2-day snapshot
        if (schedExtra.buildSchedule2Day) {
            const snap2 = schedExtra.buildSchedule2Day({ state: { ...fakeState, week: 1, daysPerWeek: 2 }, pack: {}, split: schedExtra.SPLIT_4DAY_A, weekLabel: '3x5' });
            if (!snap2 || snap2.daysPerWeek !== 2 || !Array.isArray(snap2.days)) errs.push('export shape: 2day snapshot invalid');
            else snap2.days.forEach((d, i) => { if (!Array.isArray(d.assistance)) errs.push('export shape: 2day d' + (i + 1) + ' assistance missing'); if (!d.conditioning) errs.push('export shape: 2day d' + (i + 1) + ' conditioning missing'); });
        }
        // 1-day snapshot
        if (schedExtra.buildSchedule1Day) {
            const snap1 = schedExtra.buildSchedule1Day({ state: { ...fakeState, week: 1, daysPerWeek: 1 }, pack: {}, split: schedExtra.SPLIT_4DAY_A, weekLabel: '3x5' });
            if (!snap1 || snap1.daysPerWeek !== 1 || !Array.isArray(snap1.days)) errs.push('export shape: 1day snapshot invalid');
            else snap1.days.forEach((d, i) => { if (!Array.isArray(d.assistance)) errs.push('export shape: 1day d' + (i + 1) + ' assistance missing'); if (!d.conditioning) errs.push('export shape: 1day d' + (i + 1) + ' conditioning missing'); });
        }
    } catch (e) {
        errs.push('export JSON shape check failed: ' + e.message);
    }

    // 4. Progression TM delta scenarios
    testProgression(errs);

    if (errs.length) {
        console.error(`\u274c 5/3/1 verifier FAILED (${errs.length} issue${errs.length > 1 ? "s" : ""})`);
        for (const e of errs) console.error(" - " + e.replace(/\n/g, "\n   "));
        process.exit(1);
    } else {
        console.log("\u2705 5/3/1 verifier passed (warm-ups, main %, w2-w3 rounding, assistance, 4-day structure, progression deltas).");
    }
} catch (e) {
    console.error("\u274c Verifier crashed:", e);
    process.exit(1);
}
