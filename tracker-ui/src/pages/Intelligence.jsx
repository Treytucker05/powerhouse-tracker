import React from 'react';
import useAdaptiveRIR from "../lib/useAdaptiveRIR";
import DashboardCard from '../components/ui/DashboardCard';

export default function Intelligence() {
  const recs = useAdaptiveRIR();
  return (
    <>
      <DashboardCard className="col-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Adaptive RIR Recommendations</h2>
        {recs.length === 0 && <p className="text-gray-300">No recommendations found.</p>}
      </DashboardCard>
      {recs.map(r => (
        <DashboardCard key={r.muscle}>
          <h3 className="text-lg font-semibold mb-2 text-white">{r.muscle}</h3>
          <p className="text-3xl font-bold text-accent">{r.recommended_rir}</p>
          {r.confidence != null && (
            <p className="text-sm text-gray-400">Confidence: {(r.confidence * 100).toFixed(0)}%</p>
          )}
        </DashboardCard>
      ))}
    </>
  );
}
