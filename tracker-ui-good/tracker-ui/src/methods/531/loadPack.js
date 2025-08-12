// Minimal JSONC strip (handles // and /* */ comments)
const stripJsonc = (s) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/(^|[^:])\/\/.*$/gm, "$1"); // line comments (naive)

export async function loadPack531BBB() {
  const url = "/methodology/packs/531.bbb.v1.jsonc";
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const raw = await res.text();
    const json = JSON.parse(stripJsonc(raw));
    return json;
  } catch (e) {
    console.warn("Pack load failed:", e);
    return null;
  }
}

export { stripJsonc };
