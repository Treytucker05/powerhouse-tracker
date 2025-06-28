// src/components/ui/StatTile.jsx
import { Dumbbell, BarChart3, Layers3 } from 'lucide-react';

export default function StatTile({ icon, label, value, unit }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-surface rounded-xl shadow-insetCard">
      <div className="text-brand">{icon}</div>
      <div>
        <p className="text-sm text-textMed">{label}</p>
        <p className="text-xl font-semibold text-textHigh">
          {value} <span className="text-sm font-normal">{unit}</span>
        </p>
      </div>
    </div>
  );
}
