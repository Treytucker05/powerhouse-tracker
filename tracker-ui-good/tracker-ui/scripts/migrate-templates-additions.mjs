import fs from "fs";
import path from "path";

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

function toCsvRow(arr) {
  return arr.map(v => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }).join(",");
}

const file = path.resolve("data/extraction/templates_additions.csv");
if (!fs.existsSync(file)) {
  console.error("templates_additions.csv not found at", file);
  process.exit(1);
}

const text = fs.readFileSync(file, "utf8").replace(/\r/g, "").trim();
const lines = text.split("\n");
const header = splitCsvLine(lines[0]).map(s => s.trim());

const unified = [
  "id","display_name","category","goal","days_per_week","scheme","supplemental","assistance_mode","assistance_targets","conditioning_mode","time_per_session_min","time_per_week_min","leader_anchor_fit","pr_sets_allowed","jokers_allowed","amrap_style","deload_policy","seventh_week_default","tm_default_pct","tm_prog_upper_lb","tm_prog_lower_lb","equipment","population","seasonality","constraints","experience","book","pages","notes","tags"
];

if (header.join("|") !== unified.join("|")) {
  console.error("Header does not match unified schema. Aborting migration.");
  process.exit(1);
}

let migrated = 0; let unchanged = 0; let out = [toCsvRow(unified)];
for (let i = 1; i < lines.length; i++) {
  const raw = lines[i];
  if (!raw.trim()) continue;
  const cells = splitCsvLine(raw).map(s => s.trim());
  if (cells.length === unified.length) {
    out.push(toCsvRow(cells));
    unchanged++;
    continue;
  }

  // Legacy mapping heuristic
  // Expected legacy order (approx):
  // 0 id, 1 display_name, 2 category, 3 goal, 4 days_per_week,
  // 5 scheme(desc), 6 jokers/info, 7 assistance_mode, 8 conditioning_mode,
  // 9 leader_anchor_fit, 10 notes, 11 book, 12 pages
  const g = (idx) => (idx < cells.length ? cells[idx] : "");
  const jokersInfo = g(6).toLowerCase();
  const jokersAllowed = jokersInfo.includes("joker") ? "yes" : "";

  const mapped = [
    g(0),                 // id
    g(1),                 // display_name
    g(2),                 // category
    g(3),                 // goal
    g(4),                 // days_per_week
    g(5),                 // scheme
    "",                  // supplemental (unknown)
    g(7),                 // assistance_mode
    "",                  // assistance_targets
    g(8),                 // conditioning_mode
    "",                  // time_per_session_min
    "",                  // time_per_week_min
    g(9),                 // leader_anchor_fit
    "",                  // pr_sets_allowed
    jokersAllowed,        // jokers_allowed
    "",                  // amrap_style
    "",                  // deload_policy
    "",                  // seventh_week_default
    "",                  // tm_default_pct
    "",                  // tm_prog_upper_lb
    "",                  // tm_prog_lower_lb
    "",                  // equipment
    "",                  // population
    "",                  // seasonality
    "",                  // constraints
    "",                  // experience
    g(11),                // book
    g(12),                // pages
    g(10),                // notes
    ""                   // tags
  ];

  out.push(toCsvRow(mapped));
  migrated++;
}

const backup = file.replace(/\.csv$/, `.legacy.${Date.now()}.bak`);
fs.writeFileSync(backup, text, "utf8");
fs.writeFileSync(file, out.join("\n") + "\n", "utf8");
console.log(`Migration complete. Migrated ${migrated} rows; unchanged ${unchanged}. Backup saved to ${backup}`);
