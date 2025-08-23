import fs from "fs";
import path from "path";
import process from "process";

/** Basic CSV splitter (handles quotes + escaped quotes) */
function splitCsvLine(line) {
    const out = []; let cur = ""; let q = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
            if (q && line[i + 1] === '"') { cur += '"'; i++; }
            else { q = !q; }
        } else if (c === "," && !q) { out.push(cur); cur = ""; }
        else { cur += c; }
    }
    out.push(cur);
    return out;
}

function readCsv(file) {
    if (!fs.existsSync(file)) return { headers: [], rows: [] };
    const text = fs.readFileSync(file, "utf8").replace(/\r/g, "").trim();
    if (!text) return { headers: [], rows: [] };
    const lines = text.split("\n").filter(Boolean);
    const headers = splitCsvLine(lines[0]).map(s => s.trim());
    const rows = lines.slice(1).map((ln, idx) => {
        const cells = splitCsvLine(ln);
        const o = {};
        headers.forEach((h, i) => (o[h] = (cells[i] ?? "").trim()));
        o.__line = idx + 2;
        return o;
    });
    return { headers, rows };
}

function slugifyId(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/--+/g, "-");
}

function pickDir() {
    const p1 = path.join(process.cwd(), "public", "methodology", "extraction");
    const p2 = path.join(process.cwd(), "data", "extraction");
    return fs.existsSync(p1) ? p1 : p2;
}

function reqFields(obj, fields) {
    const miss = [];
    for (const f of fields) {
        if (obj[f] === undefined || String(obj[f]).trim() === "") miss.push(f);
    }
    return miss;
}

function num(n) { return n === "" ? NaN : Number(n); }

function lintSupplemental(dir, errors, warnings) {
    const f = path.join(dir, "supplemental.csv");
    const { headers, rows } = readCsv(f);
    if (rows.length === 0) { warnings.push(`[supplemental.csv] empty or missing`); return; }

    const must = ["Template", "Phase", "MainPattern", "SupplementalScheme", "SupplementalSetsReps", "SupplementalPercentSchedule", "AssistancePerCategoryMin", "AssistancePerCategoryMax", "HardConditioningMax", "EasyConditioningMin", "JumpsThrowsDefault", "CycleMin", "CycleMax", "TMRecommendation"];
    const missingCols = must.filter(c => !headers.includes(c));
    if (missingCols.length) { errors.push(`[supplemental.csv] Missing columns: ${missingCols.join(", ")}`); return; }

    const keyset = new Set();
    for (const r of rows) {
        const miss = reqFields(r, must);
        if (miss.length) errors.push(`[supplemental.csv:${r.__line}] missing fields: ${miss.join(", ")}`);
        const key = `${(r.Template || "").toLowerCase()}__${(r.Phase || "").toLowerCase()}`;
        if (keyset.has(key)) errors.push(`[supplemental.csv:${r.__line}] duplicate Template+Phase: ${r.Template} / ${r.Phase}`);
        keyset.add(key);
        // Validate basic enums/ranges
        const phaseOk = ["Leader", "Anchor"].includes(r.Phase);
        if (!phaseOk) errors.push(`[supplemental.csv:${r.__line}] Phase must be Leader|Anchor`);
        const mpOk = ["5/3/1", "3/5/1", "5s PRO"].includes(r.MainPattern);
        if (!mpOk) warnings.push(`[supplemental.csv:${r.__line}] MainPattern is unusual: ${r.MainPattern}`);
        const nums = ["AssistancePerCategoryMin", "AssistancePerCategoryMax", "HardConditioningMax", "EasyConditioningMin", "JumpsThrowsDefault", "CycleMin", "CycleMax", "TMRecommendation"];
        for (const nfield of nums) {
            const v = num(r[nfield]);
            if (Number.isNaN(v)) errors.push(`[supplemental.csv:${r.__line}] ${nfield} must be a number`);
        }
    }
}

function lintSeventhWeek(dir, errors, warnings) {
    const f = path.join(dir, "seventh_week.csv");
    const { headers, rows } = readCsv(f);
    if (rows.length === 0) { warnings.push(`[seventh_week.csv] empty or missing`); return; }
    const must = ["ProtocolId", "Name", "Kind", "MainSets", "Percentages", "Criteria", "Notes"];
    const missingCols = must.filter(c => !headers.includes(c));
    if (missingCols.length) { errors.push(`[seventh_week.csv] Missing columns: ${missingCols.join(", ")}`); return; }
    const kinds = ["Deload", "TMTest", "PRTest"];
    for (const r of rows) {
        const miss = reqFields(r, ["ProtocolId", "Name", "Kind", "MainSets", "Percentages"]);
        if (miss.length) errors.push(`[seventh_week.csv:${r.__line}] missing fields: ${miss.join(", ")}`);
        if (!kinds.includes(r.Kind)) warnings.push(`[seventh_week.csv:${r.__line}] Kind should be one of ${kinds.join(", ")}`);
    }
}

function lintTM(dir, errors, warnings) {
    const f = path.join(dir, "tm_rules.csv");
    const { headers, rows } = readCsv(f);
    if (rows.length === 0) { warnings.push(`[tm_rules.csv] empty or missing`); return; }
    const must = ["PolicyId", "Name", "StartTMPercent", "UpperBumpPerCycle", "LowerBumpPerCycle", "FiveForwardThreeBack", "ConservativeOption", "Notes"];
    const missingCols = must.filter(c => !headers.includes(c));
    if (missingCols.length) { errors.push(`[tm_rules.csv] Missing columns: ${missingCols.join(", ")}`); return; }
    for (const r of rows) {
        const miss = reqFields(r, ["PolicyId", "Name", "StartTMPercent", "UpperBumpPerCycle", "LowerBumpPerCycle"]);
        if (miss.length) errors.push(`[tm_rules.csv:${r.__line}] missing fields: ${miss.join(", ")}`);
    }
}

function lintJokers(dir, errors, warnings) {
    const f = path.join(dir, "joker_rules.csv");
    const { headers, rows } = readCsv(f);
    if (rows.length === 0) { warnings.push(`[joker_rules.csv] empty or missing`); return; }
    const must = ["RuleId", "AllowedPattern", "AllowedWeeks", "MaxJokers", "IncrementHint", "StopCondition", "Notes"];
    const missingCols = must.filter(c => !headers.includes(c));
    if (missingCols.length) { errors.push(`[joker_rules.csv] Missing columns: ${missingCols.join(", ")}`); return; }
    for (const r of rows) {
        const miss = reqFields(r, ["RuleId", "AllowedPattern", "AllowedWeeks", "MaxJokers"]);
        if (miss.length) errors.push(`[joker_rules.csv:${r.__line}] missing fields: ${miss.join(", ")}`);
    }
}

function lintGeneric(file, cols, label, errors, warnings) {
    const { headers, rows } = readCsv(file);
    if (rows.length === 0) { warnings.push(`[${path.basename(file)}] empty or missing`); return; }
    const missing = cols.filter(c => !headers.includes(c));
    if (missing.length) { errors.push(`[${path.basename(file)}] Missing columns: ${missing.join(", ")}`); return; }
}

(function main() {
    // Simple argv parser supporting --check=templates-ui (and --check templates-ui)
    const argv = process.argv.slice(2);
    let check = null;
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith("--check=")) check = a.split("=")[1];
        else if (a === "--check") check = argv[i + 1];
    }

    async function validateTemplatesUi() {
        const repoRoot = process.cwd();
        const dataDir = fs.existsSync(path.join(repoRoot, "data", "extraction"))
            ? path.join(repoRoot, "data", "extraction")
            : path.join(repoRoot, "public", "methodology", "extraction");

        const masterFile = path.join(dataDir, "templates_master.csv");
        const addFile = path.join(dataDir, "templates_additions.csv");
        const { headers: mh, rows: mrows } = readCsv(masterFile);
        const { headers: ah, rows: arows } = readCsv(addFile);

        // Build additions map (prefer additions on id collisions)
        const aIdxId = ah.indexOf("id");
        const aIdxName = ah.indexOf("display_name");
        const addById = new Map();
        for (const r of arows) {
            const id = (r.id ?? r["id"]) || slugifyId(r.display_name || r["display_name"]);
            if (!id) continue;
            addById.set(id, r);
        }

        // Map master rows by derived id from Template Name
        const mIdxName = mh.indexOf("Template Name");
        const merged = new Map();
        for (const r of mrows) {
            const name = r["Template Name"] || r.Template || r.Name;
            const id = slugifyId(name);
            if (!id) continue;
            // Seed with a normalized skeleton so downstream field access works
            merged.set(id, {
                id,
                display_name: name,
                notes: r.Notes || "",
                book: r.Book || "",
                pages: r.Page || r.Pages || "",
            });
        }

        // Apply additions (override or insert)
        for (const [id, row] of addById.entries()) {
            const cur = merged.get(id) || { id };
            merged.set(id, { ...cur, ...row });
        }

        const required = [
            "goal",
            "experience",
            "time_per_session_min",
            "notes",
            "tags",
        ];
        const niceToHave = [
            "time_per_week_min",
            "assistance_mode",
            "assistance_targets",
        ];

        const warnings = [];
        const missingAny = [];
        const rowsForReport = [];
        for (const r of merged.values()) {
            // Access across both schemas
            const id = r.id || slugifyId(r.display_name || r["display_name"]);
            const display = r.display_name || r["display_name"] || r["Template Name"] || id;
            const goal = r.goal || "";
            const experience = r.experience || "";
            const tps = r.time_per_session_min || "";
            const notes = r.notes || r.Notes || "";
            const tags = r.tags || "";

            const miss = [];
            if (!goal) miss.push("goal");
            if (!experience) miss.push("experience");
            if (!tps) miss.push("time_per_session_min");
            if (!notes) miss.push("notes");
            if (!tags) miss.push("tags");

            const tpsNum = Number(tps);
            let badge = "-";
            if (!Number.isNaN(tpsNum) && tps !== "") {
                if (tpsNum <= 44) badge = "≤45m";
                else if (tpsNum <= 60) badge = "45–60m";
                else if (tpsNum <= 75) badge = "60–75m";
                else badge = "75–90m+";
            }

            // Tag validations (warn-only)
            let tagCount = 0;
            if (tags) {
                const parts = String(tags).split("|").map(s => s.trim()).filter(Boolean);
                tagCount = parts.length;
                if (tagCount > 12) warnings.push(`[${id}] has ${tagCount} tags (>12)`);
                for (const tg of parts) {
                    if (/\s/.test(tg)) warnings.push(`[${id}] tag contains spaces: "${tg}" (prefer key:value, no spaces)`);
                }
            }

            // Nice-to-have warnings
            for (const f of niceToHave) {
                if (!r[f]) warnings.push(`[${id}] optional field empty: ${f}`);
            }

            if (miss.length) missingAny.push(id);
            rowsForReport.push({ id, display, miss, tagCount, badge });
        }

        // Write Markdown report
        const reportsDir = path.join(process.cwd(), "reports");
        fs.mkdirSync(reportsDir, { recursive: true });
        const outPath = path.join(reportsDir, "templates_ui_readiness.md");
        const lines = [];
        lines.push(`# Templates UI Readiness Report`);
        lines.push("");
        lines.push(`Generated: ${new Date().toISOString()}`);
        lines.push("");
        lines.push(`| id | display_name | missing_fields | tag_count | session_badge |`);
        lines.push(`|---|---|---|---:|---|`);
        for (const row of rowsForReport.sort((a, b) => a.display.localeCompare(b.display))) {
            const missTxt = row.miss.length ? row.miss.join(", ") : "—";
            lines.push(`| ${row.id} | ${row.display} | ${missTxt} | ${row.tagCount} | ${row.badge} |`);
        }
        fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");

        const banner = (txt, char, color) => {
            const line = char.repeat(Math.max(16, txt.length + 4));
            console.log(`\x1b[${color}m${line}\n  ${txt}\n${line}\x1b[0m`);
        };
        if (warnings.length) { banner("Templates UI Readiness — Warnings", "-", "33"); warnings.forEach(w => console.log("•", w)); }
        if (missingAny.length) {
            banner(`Templates UI Readiness — Missing required on ${missingAny.length} rows`, "-", "31");
            process.exitCode = 1;
        } else {
            banner("Templates UI Readiness — OK", "=", "32");
        }
    }

    if (check === "templates-ui") {
        // Run specialized check only
        Promise.resolve(validateTemplatesUi());
        return;
    }

    const dir = pickDir();
    const errors = [], warnings = [];
    lintSupplemental(dir, errors, warnings);
    lintSeventhWeek(dir, errors, warnings);
    lintTM(dir, errors, warnings);
    lintJokers(dir, errors, warnings);
    lintGeneric(path.join(dir, "assistance_exercises.csv"), ["Category", "Exercise", "Equipment", "Difficulty", "BackStressFlag", "Notes"], "assistance", errors, warnings);
    lintGeneric(path.join(dir, "warmups.csv"), ["Type", "Name", "DefaultDose", "ExampleProtocol", "Notes"], "warmups", errors, warnings);
    lintGeneric(path.join(dir, "conditioning.csv"), ["Activity", "Intensity", "ModalityGroup", "SuggestedDuration", "DefaultFreqPerWeek", "Notes"], "conditioning", errors, warnings);
    lintGeneric(path.join(dir, "special_rules.csv"), ["Rule", "AppliesTo", "Notes"], "special_rules", errors, warnings);

    const banner = (txt, char, color) => {
        const line = char.repeat(Math.max(16, txt.length + 4));
        console.log(`\x1b[${color}m${line}\n  ${txt}\n${line}\x1b[0m`);
    };

    if (warnings.length) { banner("CSV Lint Warnings", "-", "33"); warnings.forEach(w => console.log("•", w)); }
    if (errors.length) { banner("CSV Lint Errors", "-", "31"); errors.forEach(e => console.log("×", e)); process.exitCode = 1; }
    if (!warnings.length && !errors.length) { banner("CSV Lint OK — no issues found", "=", "32"); }
})();
