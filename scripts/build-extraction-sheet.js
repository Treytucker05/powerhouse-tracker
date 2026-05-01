/*
  Plain Node.js fallback for extraction builder.
  - Reads scripts/extraction.config.json
  - Builds an Excel workbook at data/extraction/extraction.xlsx
  - Exports CSVs per sheet to public/methodology/extraction/<sheetName>.csv
  - CommonJS only (require), no TypeScript types.
*/

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

function ensureDirSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
}

function coerceSheetFromConfigEntry(entry, idx) {
    // Flexible handling for different config shapes.
    // Supported shapes:
    // - { name, columns: string[], rows: Array<object|Array> }
    // - { name, data: Array<object> }  // columns derived from keys
    // - { name, aoa: Array<Array<any>> } // first row is header
    // - { sheetName, columns, rows }
    const name = entry.name || entry.sheetName || `Sheet${idx + 1}`;

    if (Array.isArray(entry.aoa)) {
        const header = Array.isArray(entry.aoa[0]) ? entry.aoa[0] : [];
        const rows = entry.aoa.slice(1);
        return { name, header, rows, from: "aoa" };
    }

    const columns = Array.isArray(entry.columns) ? entry.columns : undefined;
    const rows = Array.isArray(entry.rows) ? entry.rows : undefined;
    const data = Array.isArray(entry.data) ? entry.data : undefined;

    if (columns && rows) {
        // rows can be objects or arrays; normalize to arrays by columns if objects
        const header = columns;
        const body = rows.map((r) => {
            if (Array.isArray(r)) return r;
            if (r && typeof r === "object") return columns.map((c) => r[c]);
            return [r];
        });
        return { name, header, rows: body, from: "columns+rows" };
    }

    if (data) {
        const header = columns || (data[0] ? Object.keys(data[0]) : []);
        const body = data.map((r) => header.map((c) => (r ? r[c] : undefined)));
        return { name, header, rows: body, from: "data" };
    }

    // Fallback: treat entry itself as data row
    const fallbackHeader = Object.keys(entry);
    const fallbackRows = [fallbackHeader.map((c) => entry[c])];
    return { name, header: fallbackHeader, rows: fallbackRows, from: "fallback" };
}

function buildWorkbookFromConfig(config) {
    // Try different places for sheets array
    const sheetDefs = Array.isArray(config?.workbook?.sheets)
        ? config.workbook.sheets
        : Array.isArray(config?.sheets)
            ? config.sheets
            : Array.isArray(config?.tables)
                ? config.tables
                : Array.isArray(config?.data)
                    ? config.data
                    : [];

    if (config && config.REPLACE_WITH_ONE_SHOT_PROMPT_JSON) {
        throw new Error(
            "extraction.config.json is a placeholder. Replace with the real config to build artifacts."
        );
    }

    if (sheetDefs.length === 0) {
        // Create a tiny placeholder sheet to avoid failing CI in an unconfigured repo
        return {
            workbook: XLSX.utils.book_new(),
            sheetsWritten: [
                {
                    name: "Summary",
                    header: ["status", "message"],
                    rows: [["placeholder", "No sheets defined in config"]],
                },
            ],
        };
    }

    const sheets = sheetDefs.map(coerceSheetFromConfigEntry);
    const wb = XLSX.utils.book_new();

    for (const s of sheets) {
        const aoa = [s.header, ...s.rows];
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(wb, ws, s.name.substring(0, 31));
    }

    return { workbook: wb, sheetsWritten: sheets };
}

function writeOutputs(wb, sheets, options = {}) {
    const root = process.cwd();
    const xlsxDir = path.join(root, "data", "extraction");
    const csvDir = path.join(root, "public", "methodology", "extraction");
    ensureDirSync(xlsxDir);
    ensureDirSync(csvDir);

    const xlsxName = options.xlsxName || "extraction.xlsx";
    const xlsxPath = path.join(xlsxDir, xlsxName);
    XLSX.writeFile(wb, xlsxPath);

    for (const s of sheets) {
        const sheet = wb.Sheets[s.name.substring(0, 31)];
        if (!sheet) continue;
        const csv = XLSX.utils.sheet_to_csv(sheet);
        const safe = s.name.replace(/[^A-Za-z0-9_-]+/g, "_");
        const csvPath = path.join(csvDir, `${safe}.csv`);
        fs.writeFileSync(csvPath, csv, "utf8");
    }

    return { xlsxPath, csvDir };
}

function main() {
    const configPath = path.join(process.cwd(), "scripts", "extraction.config.json");
    const config = readJson(configPath);

    const { workbook, sheetsWritten } = buildWorkbookFromConfig(config);
    const { xlsxPath, csvDir } = writeOutputs(workbook, sheetsWritten, config.output || {});

    console.log("Extraction build complete.");
    console.log("Workbook:", path.relative(process.cwd(), xlsxPath));
    console.log(
        "CSVs:",
        sheetsWritten.map((s) => path.join("public/methodology/extraction", `${s.name.replace(/[^A-Za-z0-9_-]+/g, "_")}.csv`))
    );
}

if (require.main === module) {
    try {
        main();
    } catch (err) {
        console.error("Extraction build failed:", err && err.message ? err.message : err);
        process.exit(1);
    }
}
