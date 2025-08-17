import fs from "node:fs";

// Simple JSONC loader: strips /* */ and // comments (naive) then parses.
export function loadJsonc(path) {
    const raw = fs.readFileSync(path, "utf8");
    const noBlock = raw.replace(/\/\*[\s\S]*?\*\//g, "");
    const noLine = noBlock.replace(/(^|[^:])\/\/.*$/gm, "$1");
    return JSON.parse(noLine);
}

export default loadJsonc;
