// Prevent @vitest/expect from patching globals when Playwright runs.
// Injected via NODE_OPTIONS=-r ... so it executes *before* any module loads.
const Module = require("module");
const orig = Module._load;
Module._load = function (id, parent, isMain) {
  if (id === "@vitest/expect" || id.startsWith("@vitest/expect/"))
    return {};            // return harmless stub
  return orig(id, parent, isMain);
};
