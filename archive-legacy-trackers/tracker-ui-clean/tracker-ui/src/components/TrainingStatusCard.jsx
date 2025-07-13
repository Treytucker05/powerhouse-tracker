import React from 'react';

export default function TrainingStatusCard({ currentWeek, phase }) {
  // Placeholder: days to deload = 7 - (currentWeek % 4)
  const daysToDeload = 7 - ((currentWeek - 1) % 4);
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col">
      <div className="text-sm text-gray-500 dark:text-gray-400">Current Week</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Week {currentWeek}</div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Phase</div>
      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{phase}</div>
      <div className="mt-4 text-xs text-gray-400">Days to Deload: <span className="font-bold text-green-600 dark:text-green-400">{daysToDeload}</span></div>
    </div>
  );
}
