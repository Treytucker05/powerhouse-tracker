/* eslint-disable no-console */
import fs from "fs";
import path from "path";

const root = process.cwd();

// Feature keywords to scan for
const FEATURES = {
  "MEV/MRV Tracking": ["mev", "mrv", "landmarks"],
  "Set Progression": ["soreness", "performance", "autoregulation"],
  "RIR Management": ["rir", "rpe"],
  "Deload Logic": ["deload", "fatigue"],
  "Volume Chart": ["volume", "chart"],
  "Exercise Selection": ["sfr", "exerciseSelector"]
};

// Recursively walk directory
function walk(dir) {
  try {
    return fs.readdirSync(dir).flatMap((file) => {
      const p = path.join(dir, file);
      try {
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
          // Skip node_modules and other large directories
          if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'coverage') {
            return [];
          }
          return walk(p);
        }
        return [p];
      } catch (err) {
        // Skip files/directories that can't be accessed (broken symlinks, etc.)
        return [];
      }
    });
  } catch (err) {
    // Skip directories that can't be read
    return [];
  }
}

// Search codebase for keywords
function searchKeywords(words) {
  const files = walk(root).filter((f) => f.match(/\.(js|jsx|ts|tsx)$/));
  return files.filter((file) => {
    try {
      const text = fs.readFileSync(file, "utf8").toLowerCase();
      return words.some((w) => text.includes(w));
    } catch (err) {
      // Skip files that can't be read
      return false;
    }
  });
}

// Build report object
const report = {};
for (const [feature, words] of Object.entries(FEATURES)) {
  const hits = searchKeywords(words);
  report[feature] = { implemented: hits.length > 0, files: hits };
}

// Write report JSON
fs.writeFileSync(
  "REPO_ANALYSIS_REPORT.json",
  JSON.stringify(report, null, 2)
);
console.log("✅  REPO_ANALYSIS_REPORT.json generated");
