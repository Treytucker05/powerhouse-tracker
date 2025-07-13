import React from 'react';
import Card from '../ui/Card';

const TrainingStatus = ({ data }) => {
  // Default data structure if none provided
  const defaultData = {
    weekNumber: 3,
    mesocycleLength: 5,
    blockNumber: 1,
    targetRIR: 2,
    phase: 'Hypertrophy',
    fatigueRating: 'Moderate'
  };

  const statusData = data || defaultData;

  const statusItems = [
    {
      value: statusData.weekNumber,
      label: 'Week #',
      key: 'weekNumber'
    },
    {
      value: `${statusData.mesocycleLength} weeks`,
      label: 'Mesocycle Length',
      key: 'mesocycleLength'
    },
    {
      value: statusData.blockNumber,
      label: 'Block #',
      key: 'blockNumber'
    },
    {
      value: statusData.targetRIR,
      label: 'Target RIR',
      key: 'targetRIR'
    },
    {
      value: statusData.phase,
      label: 'Training Phase',
      key: 'phase'
    },
    {
      value: statusData.fatigueRating,
      label: 'Fatigue Rating',
      key: 'fatigueRating'
    }
  ];
  return (
    <Card>
      <h2 className="text-xl font-semibold text-red-500 mb-6">🎯 Current Training Status</h2>
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {statusItems.map((item) => (
          <div key={item.key} className="rounded-lg bg-white/5 p-4 text-center">
            <div className="text-3xl font-bold text-red-500">{item.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TrainingStatus;
