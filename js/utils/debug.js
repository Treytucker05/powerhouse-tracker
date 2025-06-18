export const DEBUG =
  typeof window !== "undefined" &&
  window.location &&
  window.location.search.includes("debug");

export function debugLog(...args) {
  if (DEBUG) console.log(...args);
}
