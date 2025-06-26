export default function TrainingSplitOverview({ split = [] }) {
  if (!split.length) return null;
  return (
    <div className="border rounded-lg p-3 text-gray-100">
      <h3 className="font-semibold mb-2 text-sm">Training Split</h3>
      <div className="flex gap-2 flex-wrap text-sm">
        {split.map((d) => (
          <span
            key={d}
            className="bg-gray-800 px-2 py-1 rounded text-gray-200 border border-gray-700 text-xs"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
