import useAdaptiveRIR from "../lib/useAdaptiveRIR";

export default function Intelligence() {
  const recs = useAdaptiveRIR();
  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4">Adaptive RIR Recommendations</h2>
      {recs.length === 0 && <p>No recommendations found.</p>}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {recs.map(r => (
          <div key={r.muscle} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{r.muscle}</h3>
            <p className="text-3xl font-bold text-emerald-600">{r.recommended_rir}</p>
            {r.confidence != null && (
              <p className="text-sm text-gray-500">Confidence: {(r.confidence * 100).toFixed(0)}%</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
