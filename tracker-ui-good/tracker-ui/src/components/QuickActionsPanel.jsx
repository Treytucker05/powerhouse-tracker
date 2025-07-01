import React from 'react';

export default function QuickActionsPanel({ onRefresh }) {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-4 flex flex-col gap-3">
      <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => {}}>Start Today’s Workout</button>
      <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => {}}>Log Quick Feedback</button>
      <button className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600" onClick={() => {}}>Adjust This Week</button>
      <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600" onClick={onRefresh}>Refresh</button>
    </div>
  );
}
