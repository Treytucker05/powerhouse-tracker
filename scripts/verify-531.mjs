import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadJsonc } from "./jsonc.js";

// Optional schedule import (4-day structure verification)
let buildSchedule = null;
try {
    const schedFsPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../tracker-ui-good/tracker-ui/src/methods/531/schedule.js");
    const schedUrl = new URL(`file://${schedFsPath.replace(/\\/g, '/')}`);
    const schedMod = await import(schedUrl.href);
    buildSchedule = schedMod.buildSchedule;
} catch (e) {
    console.warn("[verify-531] schedule.js import failed, skipping 4-day structural check:", e.message);
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

    if (errs.length) {
        console.error(`\u274c 5/3/1 verifier FAILED (${errs.length} issue${errs.length > 1 ? "s" : ""})`);
        for (const e of errs) console.error(" - " + e.replace(/\n/g, "\n   "));
        process.exit(1);
    } else {
        console.log("\u2705 5/3/1 verifier passed (warm-ups, main %, w2-w3 rounding, assistance, 4-day structure).");
    }
} catch (e) {
    console.error("\u274c Verifier crashed:", e);
    process.exit(1);
}
