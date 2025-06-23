import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const VolumeTrackerChart = ({ volumeData = {} }) => {
  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes'];
  const currentVolume = [12, 16, 10, 14, 10, 20, 12, 14];
  const mevValues = [8, 10, 6, 6, 6, 10, 8, 8];
  const mrvValues = [22, 25, 20, 16, 18, 25, 20, 16];
  
  const data = {
    labels: muscleGroups,
    datasets: [
      {
        type: 'bar',
        label: 'Current Volume',
        data: currentVolume,
        backgroundColor: muscleGroups.map((muscle, idx) => {
          const volume = currentVolume[idx];
          const mev = mevValues[idx];
          const mrv = mrvValues[idx];
          return volume < mev || volume > mrv ? '#ef4444' : '#22c55e';
        }),
        borderColor: muscleGroups.map((muscle, idx) => {
          const volume = currentVolume[idx];
          const mev = mevValues[idx];
          const mrv = mrvValues[idx];
          return volume < mev || volume > mrv ? '#dc2626' : '#16a34a';
        }),
        borderWidth: 2
      },
      {
        type: 'line',
        label: 'MEV',
        data: mevValues,
        borderColor: '#facc15',
        borderDash: [5, 5],
        fill: false,
        pointBackgroundColor: '#facc15',
        pointBorderColor: '#facc15',
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'MRV',
        data: mrvValues,
        borderColor: '#ef4444',
        borderDash: [8, 4],
        fill: false,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ef4444',
        yAxisID: 'y'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { 
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: '📊 Weekly Volume Tracker',
        color: '#ff1a1a',
        font: {
          size: 20,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        grid: { 
          color: 'rgba(255,255,255,0.1)' 
        }
      },
      y: {
        ticks: { 
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        grid: { 
          color: 'rgba(255,255,255,0.1)' 
        },
        title: {
          display: true,
          text: 'Sets per Week',
          color: '#ffffff'
        }
      }
    }
  };

  return (
    <div className="h-96 powerhouse-card">
      <Bar data={data} options={options} />
    </div>
  );
};

export default VolumeTrackerChart;
