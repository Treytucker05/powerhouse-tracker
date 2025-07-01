import React from 'react';

const stubSessions = [
  { date: '2025-06-27', name: 'Upper Body Power' },
  { date: '2025-06-29', name: 'Lower Body Hypertrophy' },
  { date: '2025-07-01', name: 'Full Body Recovery' },
];

export default function UpcomingSessionsPreview() {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4">
      <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Upcoming Sessions</div>
      <ul className="text-sm text-gray-700 dark:text-gray-200">
        {stubSessions.map(s => (
          <li key={s.date} className="mb-1 flex justify-between">
            <span>{s.name}</span>
            <span className="text-xs text-gray-400">{s.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
