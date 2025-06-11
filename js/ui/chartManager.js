/**
 * Chart Management UI
 * Handles all chart rendering and interactions
 */

import trainingState from '../core/trainingState.js';

let weeklyChart = null;
const muscles = Object.keys(trainingState.volumeLandmarks);

/**
 * Initialize the weekly volume chart
 */
export function initChart() {
  const canvas = document.getElementById('weeklyChart');
  if (!canvas) {
    console.error('Chart canvas not found');
    return null;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Cannot get canvas context');
    return null;
  }
  
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return null;
  }

  const chartData = muscles.map(muscle => trainingState.currentWeekSets[muscle] || 0);
  const backgroundColors = muscles.map(muscle => trainingState.getVolumeColor(muscle));
  
  weeklyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: muscles,
      datasets: [{
        label: 'Current Sets',
        data: chartData,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const muscle = context.label;
              const sets = context.parsed.y;
              const landmarks = trainingState.volumeLandmarks[muscle];
              const status = trainingState.getVolumeStatus(muscle, sets);
              
              return [
                `Status: ${status}`,
                `MEV: ${landmarks.MEV} | MRV: ${landmarks.MRV}`,
                `Target RIR: ${trainingState.getTargetRIR()}`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#fff'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#fff'
          }
        }
      }
    }
  });
  
  return weeklyChart;
}

/**
 * Update chart with current data
 */
export function updateChart() {
  if (!weeklyChart) return;
  
  const newData = muscles.map(muscle => trainingState.currentWeekSets[muscle] || 0);
  const newColors = muscles.map(muscle => trainingState.getVolumeColor(muscle));
  
  weeklyChart.data.datasets[0].data = newData;
  weeklyChart.data.datasets[0].backgroundColor = newColors;
  weeklyChart.data.datasets[0].borderColor = newColors.map(color => color.replace('0.6', '1'));
  
  weeklyChart.update();
}

/**
 * Add volume landmarks overlay to chart
 */
export function addVolumeLandmarks() {
  if (!weeklyChart) return;
  
  // Add MEV line
  weeklyChart.data.datasets.push({
    label: 'MEV',
    data: muscles.map(muscle => trainingState.volumeLandmarks[muscle].MEV),
    type: 'line',
    borderColor: 'rgba(255, 255, 0, 0.8)',
    backgroundColor: 'transparent',
    borderWidth: 2,
    pointRadius: 0,
    borderDash: [5, 5]
  });
  
  // Add MRV line
  weeklyChart.data.datasets.push({
    label: 'MRV',
    data: muscles.map(muscle => trainingState.volumeLandmarks[muscle].MRV),
    type: 'line',
    borderColor: 'rgba(255, 0, 0, 0.8)',
    backgroundColor: 'transparent',
    borderWidth: 2,
    pointRadius: 0,
    borderDash: [10, 5]
  });
  
  weeklyChart.update();
}

/**
 * Export chart as image for reports
 */
export function exportChartImage() {
  if (!weeklyChart) return null;
  
  try {
    return weeklyChart.toBase64Image();
  } catch (e) {
    console.warn('Chart image export failed:', e);
    return null;
  }
}

/**
 * Reset chart data
 */
export function resetChart() {
  muscles.forEach(muscle => {
    trainingState.updateWeeklySets(muscle, trainingState.volumeLandmarks[muscle].MEV);
  });
  updateChart();
}

/**
 * Show deload visualization
 */
export function showDeloadVisualization() {
  if (!weeklyChart) return;
  
  // Temporarily show 50% volume
  const deloadData = muscles.map(muscle => 
    Math.round(trainingState.volumeLandmarks[muscle].MEV * 0.5)
  );
  
  weeklyChart.data.datasets[0].data = deloadData;
  weeklyChart.data.datasets[0].backgroundColor = muscles.map(() => 'rgba(100, 100, 100, 0.6)');
  weeklyChart.update();
  
  // Reset after 3 seconds
  setTimeout(() => {
    updateChart();
  }, 3000);
}

export { weeklyChart };
