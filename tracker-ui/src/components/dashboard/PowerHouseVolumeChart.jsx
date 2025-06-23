import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function PowerHouseVolumeChart({ className = '' }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Sample data matching the legacy version structure
  const [volumeData, setVolumeData] = useState({
    muscles: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'],
    currentSets: [8, 12, 6, 10, 14, 8], // Current weekly sets
    volumeLandmarks: {
      Chest: { MEV: 6, MRV: 22 },
      Back: { MEV: 10, MRV: 25 },
      Shoulders: { MEV: 8, MRV: 20 },
      Arms: { MEV: 6, MRV: 20 },
      Legs: { MEV: 10, MRV: 20 },
      Core: { MEV: 6, MRV: 25 }
    }
  });

  // PowerHouse color scheme
  const getVolumeColor = (muscle, sets) => {
    const landmarks = volumeData.volumeLandmarks[muscle];
    if (!landmarks) return 'rgba(107, 114, 128, 0.6)'; // gray fallback
    
    if (sets < landmarks.MEV) return 'rgba(239, 68, 68, 0.6)'; // red - below MEV
    if (sets > landmarks.MRV) return 'rgba(239, 68, 68, 0.8)'; // darker red - above MRV
    return 'rgba(34, 197, 94, 0.6)'; // green - optimal range
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const backgroundColors = volumeData.muscles.map((muscle, index) => 
      getVolumeColor(muscle, volumeData.currentSets[index])
    );

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: volumeData.muscles,
        datasets: [
          {
            label: 'Current Sets',
            data: volumeData.currentSets,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
            borderWidth: 2,
          },
          {
            label: 'MEV',
            data: volumeData.muscles.map(muscle => volumeData.volumeLandmarks[muscle]?.MEV || 0),
            type: 'line',
            borderColor: 'rgba(255, 255, 0, 0.8)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(255, 255, 0, 1)',
            borderDash: [5, 5],
          },
          {
            label: 'MRV',
            data: volumeData.muscles.map(muscle => volumeData.volumeLandmarks[muscle]?.MRV || 0),
            type: 'line',
            borderColor: 'rgba(255, 0, 0, 0.8)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(255, 0, 0, 1)',
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
              color: '#fff',
            },
          },
          tooltip: {
            callbacks: {
              afterLabel: function (context) {
                const muscle = context.label;
                const sets = context.parsed.y;
                const landmarks = volumeData.volumeLandmarks[muscle];
                
                let status = 'Unknown';
                if (landmarks) {
                  if (sets < landmarks.MEV) status = 'Below MEV';
                  else if (sets > landmarks.MRV) status = 'Above MRV';
                  else status = 'Optimal Range';
                }
                
                return [
                  `Status: ${status}`,
                  `MEV: ${landmarks?.MEV || 0} | MRV: ${landmarks?.MRV || 0}`,
                  `Target RIR: 1-3`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: '#fff',
              stepSize: 1,
            },
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: '#fff',
            },
          },
        },
      },
    });

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [volumeData]);

  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          📊 Weekly Volume Tracking
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-300">Optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-px bg-yellow-500"></div>
            <span className="text-sm text-gray-300">MEV</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-px bg-red-500"></div>
            <span className="text-sm text-gray-300">MRV</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-64">
        <canvas ref={chartRef} />
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Green bars: Optimal training volume (between MEV and MRV)</p>
        <p>Red bars: Below MEV or above MRV - adjust volume accordingly</p>
      </div>
    </div>
  );
}
