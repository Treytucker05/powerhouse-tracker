export default function UpcomingSessionsPreview({ sessions = [] }) {
  if (!sessions.length) return null;
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <h3 className="text-xl font-semibold text-white">Next Workouts</h3>
      <ul className="space-y-3 flex-1">
        {sessions.slice(0, 3).map((session, index) => (
          <li 
            key={session.id} 
            className="flex justify-between items-center p-3 rounded-lg border border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200"
          >
            <span className="text-white font-medium text-sm">{session.dateStr}</span>
            <span className="text-accent text-xs px-2 py-1 bg-gray-700 rounded font-semibold">
              {session.focus}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}