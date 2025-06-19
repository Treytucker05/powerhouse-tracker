// single entry point so Parcel can bundle everything
import "./js/core/db.js";
import "./js/ui/buttonHandlers.js"; // ensure button handlers load early for audit
import "./js/ui/globals.js";
import "./js/core/trainingState.js";
import { initChart } from "./js/ui/chartManager.js";
import "./js/app.js";
import "./js/ui/experienceToggle.js";

// App initialization
console.log("RP Toolkit initialized");

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChart);
} else {
  initChart();
}
