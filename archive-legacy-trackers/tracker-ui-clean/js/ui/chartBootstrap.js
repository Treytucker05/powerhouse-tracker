/**
 * Chart.js Bootstrap
 * Imports Chart.js to ensure it's bundled by Parcel and available globally
 */

import Chart from "chart.js/auto";

// Make Chart available globally for any scripts that expect it
window.Chart = Chart;

console.log("Chart.js loaded and available globally");
