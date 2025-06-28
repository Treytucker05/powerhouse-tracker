import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const VolumeTrackerChart = () => {
  // Exact muscle order from legacy
  const muscles = ['Chest', 'Back', 'Quads', 'Glutes', 'Hamstrings', 'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs', 'Forearms', 'Neck', 'Traps'];
  
  // Current volume data (green if between MEV-MRV, red otherwise)
  const currentSets = [12, 16, 20, 14, 12, 10, 14, 10, 8, 6, 4, 3, 4];
  const mevValues = [8, 10, 10, 8, 8, 6, 6, 6, 6, 4, 4, 2, 4];
  const mrvValues = [22, 25, 25, 16, 20, 20, 16, 18, 16, 16, 12, 8, 12];

  const data = {
    labels: muscles,
    datasets: [
      {
        type: 'bar',
        label: 'Current Sets',
        data: currentSets,
        backgroundColor: currentSets.map((sets, i) => 
          (sets >= mevValues[i] && sets <= mrvValues[i]) ? '#00ff00' : '#ff0000'
        ),
        borderColor: '#000',
        borderWidth: 1,
        order: 2
      },
      {
        type: 'line',
        label: 'MEV',
        data: mevValues,
        borderColor: '#ffff00',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        order: 1
      },
      {
        type: 'line',
        label: 'MRV',
        data: mrvValues,
        borderColor: '#ff0000',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        order: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Weekly Volume by Muscle Group',
        color: '#ffffff',
        font: { size: 20, weight: 'bold' }
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: { size: 12 },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            if (context.datasetIndex === 0) {
              const i = context.dataIndex;
              return `MEV: ${mevValues[i]} | MRV: ${mrvValues[i]}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { 
          color: '#ffffff',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        min: 0,
        max: 26,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { 
          color: '#ffffff',
          stepSize: 2
        },
        title: {
          display: true,
          text: 'Sets',
          color: '#ffffff'
        }
      }
    }
  };
  return (
    <div className="" style={{ height: '500px' }}>
      <Chart type='bar' data={data} options={options} />
    </div>
  );
};

export default VolumeTrackerChart;
