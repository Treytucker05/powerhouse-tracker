export default function UpcomingSessionsPreview({ sessions = [] }) {
  if (!sessions.length) return null;
  return (
    <div className="premium-card h-full flex flex-col p-6">
      <h3 className="text-xl font-semibold text-white mb-4 text-left">Next Workouts</h3>
      <ul className="space-y-3 flex-1">
        {sessions.slice(0, 3).map((s, index) => (
          <li 
            key={s.id} 
            className={`
              flex justify-between items-center p-3 rounded-lg
              border border-gray-600 bg-gray-800/50
              hover:bg-gray-700/50 hover:border-gray-500
              transition-all duration-200
            `}
          >
            <span className="text-white font-medium">{s.dateStr}</span>
            <span className="text-gray-300 text-sm px-2 py-1 bg-gray-700 rounded">
              {s.focus}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
