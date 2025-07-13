/* eslint-env node */
export const DEBUG =
  (typeof process !== "undefined" && process.env.NODE_ENV === "development") ||
  (typeof window !== "undefined" &&
    window.location &&
    window.location.search.includes("debug"));

export function debugLog(...args) {
  if (DEBUG) console.debug(...args);
}

if (typeof console !== "undefined" && !DEBUG) {
  console.log = () => {};
}
