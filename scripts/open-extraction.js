// scripts/open-extraction.js
const { exec } = require("child_process");
const path = require("path");

const excelFile = path.resolve("data/extraction/531_extraction_template.xlsx");
const csvDir = path.resolve("public/methodology/extraction");

// Windows command to open files/folders
function openWin(target) {
    exec(`start "" "${target}"`);
}

console.log("Opening Excel workbook and CSV folder...");
openWin(excelFile);
openWin(csvDir);
