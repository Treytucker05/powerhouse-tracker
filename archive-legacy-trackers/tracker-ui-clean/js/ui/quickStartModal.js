/**
 * First-time user quick-start modal
 * Explains the basic workflow for new users
 */

const MODAL_STORAGE_KEY = "rpQuickStartCompleted";

/**
 * Initialize the quick-start modal functionality
 */
function initQuickStartModal() {
  const modal = document.getElementById("quickStartModal");
  const closeBtn = document.getElementById("qsClose");
  const gotItBtn = document.getElementById("qsGotIt");
  const dontShowCheckbox = document.getElementById("qsDontShow");

  if (!modal || !closeBtn || !gotItBtn || !dontShowCheckbox) {
    console.warn("Quick-start modal elements not found");
    return;
  }

  // Check if user has completed quick-start
  const hasCompletedQuickStart =
    localStorage.getItem(MODAL_STORAGE_KEY) === "true";

  // Show modal for first-time users
  if (!hasCompletedQuickStart) {
    setTimeout(() => {
      showQuickStartModal();
    }, 1000); // Delay to let page load
  }

  // Event listeners
  closeBtn.addEventListener("click", hideQuickStartModal);
  gotItBtn.addEventListener("click", handleGotIt);

  // Close on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideQuickStartModal();
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      hideQuickStartModal();
    }
  });
}

/**
 * Show the quick-start modal
 */
function showQuickStartModal() {
  const modal = document.getElementById("quickStartModal");
  if (modal) {
    modal.style.display = "flex";
    // Add animation class if desired
    setTimeout(() => {
      modal.classList.add("modal-show");
    }, 10);
  }
}

/**
 * Hide the quick-start modal
 */
function hideQuickStartModal() {
  const modal = document.getElementById("quickStartModal");
  if (modal) {
    modal.classList.remove("modal-show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}

/**
 * Handle "Got it!" button click
 */
function handleGotIt() {
  const dontShowCheckbox = document.getElementById("qsDontShow");

  // Save preference if checkbox is checked
  if (dontShowCheckbox && dontShowCheckbox.checked) {
    localStorage.setItem(MODAL_STORAGE_KEY, "true");
  }

  hideQuickStartModal();
}

/**
 * Reset quick-start status (for testing)
 */
function resetQuickStart() {
  localStorage.removeItem(MODAL_STORAGE_KEY);
}

/**
 * Manually show quick-start modal
 */
function showQuickStart() {
  showQuickStartModal();
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initQuickStartModal);
} else {
  initQuickStartModal();
}

// Export functions for potential external use
export { initQuickStartModal, showQuickStart, resetQuickStart };
