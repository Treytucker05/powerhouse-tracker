import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function FatigueRecoveryIndicator({ systemicFatigue, muscleVolumes }) {
  const data = [
    { name: 'Fatigue', value: Math.round(systemicFatigue * 100), fill: '#f59e0b' },
  ];
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col items-center">
      <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Systemic Fatigue</div>
      <ResponsiveContainer width={120} height={120}>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar minAngle={15} background clockWise dataKey="value" />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-lg font-bold text-yellow-500">{Math.round(systemicFatigue * 100)}%</div>
      <div className="mt-4 w-full">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Per-Muscle Recovery</div>
        <ul className="text-xs text-gray-600 dark:text-gray-300">
          {Object.entries(muscleVolumes).map(([muscle, v]) => (
            <li key={muscle}>{muscle}: {v.current < v.mev ? 'Recovered' : v.current < v.mrv ? 'Working' : 'Overreached'}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
