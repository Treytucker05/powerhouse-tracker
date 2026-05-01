/**
 * Chart Management UI
 * Handles all chart rendering and interactions
 */

import Chart from "chart.js/auto";
import trainingState from "../core/trainingState.js";

// Conditionally import advanced visualizations
let dataVisualizer = null;

let weeklyChart = null;
const muscles = Object.keys(trainingState.volumeLandmarks);

/**
 * Initialize the weekly volume chart
 */
function initChart() {
  const canvas = document.getElementById("weeklyChart");
  if (!canvas) {
    console.error("Chart canvas not found");
    return null;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Cannot get canvas context");
    return null;
  }

  if (typeof Chart === "undefined") {
    console.error("Chart.js not loaded");
    return null;
  }
  const chartData = muscles.map(
    (muscle) => trainingState.currentWeekSets[muscle] || 0,
  );
  const backgroundColors = muscles.map((muscle) =>
    trainingState.getVolumeColor(muscle),
  );

  // Initialize advanced visualizations if enabled
  if (trainingState.settings?.enableAdvancedDashboard) {
    import("../algorithms/dataVisualization.js")
      .then((module) => {
        dataVisualizer = new module.AdvancedDataVisualizer();
        console.log("Advanced chart visualization initialized");
      })
      .catch((err) => {
        console.error(
          "Failed to initialize advanced chart visualization:",
          err,
        );
      });
  }
  weeklyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: muscles,
      datasets: [
        {
          label: "Current Sets",
          data: chartData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map((color) =>
            color.replace("0.6", "1"),
          ),
          borderWidth: 2,
        },
        {
          label: "MEV",
          data: muscles.map(
            (muscle) => trainingState.volumeLandmarks[muscle].MEV,
          ),
          type: "line",
          borderColor: "rgba(255, 255, 0, 0.8)",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "rgba(255, 255, 0, 1)",
          borderDash: [5, 5],
        },
        {
          label: "MRV",
          data: muscles.map(
            (muscle) => trainingState.volumeLandmarks[muscle].MRV,
          ),
          type: "line",
          borderColor: "rgba(255, 0, 0, 0.8)",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          borderDash: [10, 5],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#fff",
          },
        },
        tooltip: {
          callbacks: {
            afterLabel: function (context) {
              const muscle = context.label;
              const sets = context.parsed.y;
              const landmarks = trainingState.volumeLandmarks[muscle];
              const status = trainingState.getVolumeStatus(muscle, sets);
              return [
                `Status: ${status}`,
                `MEV: ${landmarks.MEV} | MRV: ${landmarks.MRV}`,
                `Target RIR: ${trainingState.getTargetRIR()}`,
              ];
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#fff",
            stepSize: 1, // Show every 1 set on Y-axis
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#fff",
          },
        },
      },
    },
  });

  return weeklyChart;
}

/**
 * Update chart with current data
 */
function updateChart() {
  if (!weeklyChart) return;

  const newData = muscles.map(
    (muscle) => trainingState.currentWeekSets[muscle] || 0,
  );
  const newColors = muscles.map((muscle) =>
    trainingState.getVolumeColor(muscle),
  );

  // Update current sets data
  weeklyChart.data.datasets[0].data = newData;
  weeklyChart.data.datasets[0].backgroundColor = newColors;
  weeklyChart.data.datasets[0].borderColor = newColors.map((color) =>
    color.replace("0.6", "1"),
  );

  // Update landmark lines
  weeklyChart.data.datasets[1].data = muscles.map(
    (muscle) => trainingState.volumeLandmarks[muscle].MEV,
  );
  weeklyChart.data.datasets[2].data = muscles.map(
    (muscle) => trainingState.volumeLandmarks[muscle].MRV,
  );

  weeklyChart.update();
}

/**
 * Reset chart data
 */
function resetChart() {
  muscles.forEach((muscle) => {
    trainingState.updateWeeklySets(
      muscle,
      trainingState.volumeLandmarks[muscle].MEV,
    );
  });
  updateChart();
}

/**
 * Show deload visualization
 */
function showDeloadVisualization() {
  if (!weeklyChart) return;

  // Temporarily show 50% volume
  const deloadData = muscles.map((muscle) =>
    Math.round(trainingState.volumeLandmarks[muscle].MEV * 0.5),
  );

  weeklyChart.data.datasets[0].data = deloadData;
  weeklyChart.data.datasets[0].backgroundColor = muscles.map(
    () => "rgba(100, 100, 100, 0.6)",
  );
  weeklyChart.update();

  // Reset after 3 seconds
  setTimeout(() => {
    updateChart();
  }, 3000);
}

/**
 * Add volume landmarks overlay to chart
 */
function addVolumeLandmarks() {
  if (!weeklyChart) return;

  // Landmarks are already built into the chart
  // This function maintains compatibility with existing code
  console.log("Volume landmarks are permanently displayed on chart");
}

/**
 * Export chart as image for reports
 */
function exportChartImage() {
  if (!weeklyChart) {
    console.warn("No chart available for export");
    return null;
  }

  try {
    // Get chart as base64 image
    const base64Image = weeklyChart.toBase64Image("image/png", 1);

    // Create download link
    const link = document.createElement("a");
    link.download = `workout-volume-chart-week-${trainingState.weekNo}.png`;
    link.href = base64Image;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
    `;
    notification.textContent = "Chart exported successfully!";
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);

    return base64Image;
  } catch (e) {
    console.error("Chart export failed:", e);

    // Show error message
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
    `;
    notification.textContent = "Export failed. Please try again.";
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);

    return null;
  }
}

// --- consolidated exports ---
export {
  initChart,
  updateChart,
  resetChart,
  addVolumeLandmarks,
  exportChartImage,
  showDeloadVisualization,
  weeklyChart,
};
