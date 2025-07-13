/** Clear Vitest's global symbol so Playwright's expect can patch cleanly */
export default async () => {
  const key = Symbol.for('$$jest-matchers-object');
  if (globalThis[key]) {
    try {
      delete globalThis[key];          // will fail if non-configurable
    } catch { /* ignore, Playwright will reuse the same symbol */ }
  }
};
