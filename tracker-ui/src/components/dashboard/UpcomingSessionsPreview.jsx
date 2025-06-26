export default function UpcomingSessionsPreview({ sessions = [] }) {
  if (!sessions.length) return null;
  return (
    <div className="border rounded-lg p-3 text-gray-100">
      <h3 className="font-semibold mb-2 text-sm">Next workouts</h3>
      <ul className="space-y-1 text-sm">
        {sessions.slice(0, 3).map((s) => (
          <li key={s.id} className="flex justify-between">
            <span>{s.dateStr}</span>
            <span className="text-gray-400">{s.focus}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
