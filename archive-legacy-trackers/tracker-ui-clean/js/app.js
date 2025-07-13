import { phaseSections } from "./ui/phaseSections.js";
import "./ui/additionalHandlers.js";

// Map IDs to handlers available on window
function getHandler(buttonId) {
  return window[buttonId] || window[buttonId.replace(/^btn/, "")];
}

export function initDelegation(root = document) {
  root.addEventListener("click", async (e) => {
    const btn = e.target.closest(".phase-button");
    if (!btn) return;
    const handler = getHandler(btn.id);
    console.log(`click -> ${btn.id}`);
    if (typeof handler !== "function") {
      console.warn("No handler for", btn.id);
      return;
    }
    btn.classList.add("loading");
    try {
      await handler();
    } catch (err) {
      console.error(`handler failed for ${btn.id}`, err);
      alert(`Error running ${btn.id}: ${err.message}`);
    } finally {
      btn.classList.remove("loading");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDelegation(document);
  phaseSections.initialize();
});
