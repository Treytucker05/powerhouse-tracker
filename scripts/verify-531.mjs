import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadJsonc } from "./jsonc.js";

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

    const warmups = (pack.progressions?.warmups || []).map(fmtSet);
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

    if (errs.length) {
        console.error(`\u274c 5/3/1 verifier FAILED (${errs.length} issue${errs.length > 1 ? "s" : ""})`);
        for (const e of errs) console.error(" - " + e.replace(/\n/g, "\n   "));
        process.exit(1);
    } else {
    console.log("\u2705 5/3/1 verifier passed (warm-ups, main %, assistance expectations).");
    }
} catch (e) {
    console.error("\u274c Verifier crashed:", e);
    process.exit(1);
}
