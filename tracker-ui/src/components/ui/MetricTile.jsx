// src/components/ui/MetricTile.jsx
export default function MetricTile({ label, value, unit }) {
  return (
    <div className="flex flex-col items-center justify-center bg-surface
                    rounded-xl shadow-insetCard px-4 py-3 min-w-[90px]">
      <span className="text-xs text-textMed">{label}</span>
      <span className="text-lg font-semibold text-textHigh">
        {value}<span className="text-sm font-normal">{unit}</span>
      </span>
    </div>
  );
}
