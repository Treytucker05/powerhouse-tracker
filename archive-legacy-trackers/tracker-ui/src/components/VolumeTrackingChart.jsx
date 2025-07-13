import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

function getBarColor(current, mev, mrv) {
  if (current < mev) return '#10b981'; // green
  if (current < mrv) return '#f59e0b'; // yellow
  return '#ef4444'; // red
}

export default function VolumeTrackingChart({ muscleVolumes }) {
  const data = Object.entries(muscleVolumes).map(([muscle, v]) => ({
    muscle,
    current: v.current,
    mev: v.mev,
    mrv: v.mrv,
  }));
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4">
      <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Weekly Volume</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
          <XAxis dataKey="muscle" stroke="#888" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <ReferenceLine y={data[0]?.mev} label="MEV" stroke="#10b981" strokeDasharray="3 3" />
          <ReferenceLine y={data[0]?.mrv} label="MRV" stroke="#ef4444" strokeDasharray="3 3" />
          <Bar dataKey="current" isAnimationActive={false}>
            {data.map((entry, idx) => (
              <cell key={`cell-${idx}`} fill={getBarColor(entry.current, entry.mev, entry.mrv)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
