import { saveState } from "../core/trainingState.js";

/**
 * Check if running in browser environment
 */
const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

/**
 * Initialize the navigation system
 * Attaches click listeners to nav buttons and sets up initial state
 */
export function initNavigation() {
  if (!isBrowser()) {
    console.log("[Navigation] initNavigation() skipped (Node)");
    return;
  }

  console.log("Initializing navigation system");

  // Attach click listeners to navigation buttons
  const navButtons = ["navMacro", "navMeso", "navMicro", "navTrack"];

  navButtons.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener("click", () => {
        const sectionMap = {
          navMacro: "macrocycleSection",
          navMeso: "mesocycleSection",
          navMicro: "microcycleSection",
          navTrack: "trackingSection",
        };

        showSection(sectionMap[buttonId]);
        setActiveNavButton(buttonId);
      });
    }
  });

  // Show default section (macrocycle)
  showSection("macrocycleSection");
  setActiveNavButton("navMacro");
}

/**
 * Show a specific section and hide all others
 * @param {string} sectionId - The ID of the section to show
 */
export function showSection(sectionId) {
  if (!isBrowser()) {
    console.log(`[Navigation] showSection(${sectionId}) skipped (Node)`);
    return;
  }

  console.log(`Switching to section: ${sectionId}`);

  // Hide all sections
  const allSections = [
    "macrocycleSection",
    "mesocycleSection",
    "microcycleSection",
    "trackingSection",
  ];

  allSections.forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = "none";
    }
  });

  // Show the requested section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = "block";
  }

  // Save current section to training state
  window.trainingState = window.trainingState || {};
  window.trainingState.currentSection = sectionId;
  saveState?.();

  // Dispatch section change event for other components to listen
  window.dispatchEvent(
    new CustomEvent("section-change", {
      detail: { sectionId, timestamp: Date.now() }
    })
  );
}

/**
 * Set the active state for navigation buttons
 * @param {string} activeButtonId - The ID of the button to set as active
 */
function setActiveNavButton(activeButtonId) {
  if (!isBrowser()) {
    console.log(`[Navigation] setActiveNavButton(${activeButtonId}) skipped (Node)`);
    return;
  }

  const navButtons = ["navMacro", "navMeso", "navMicro", "navTrack"];

  navButtons.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (button) {
      if (buttonId === activeButtonId) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    }
  });
}

// Expose functions globally for testing and backwards compatibility
window.initNavigation = initNavigation;
window.showSection = showSection;
