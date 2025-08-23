import React from 'react';

export default function NOVPresetPanel() {
    return (
        <div className="mt-2 border border-indigo-700/40 rounded bg-indigo-900/20 p-2 text-indigo-200 space-y-1" data-testid="nov-preset-panel">
            <div className="text-xs">Full-body prep before main lift:</div>
            <ul className="list-disc list-inside text-[11px] space-y-1">
                <li>5–8 min easy cardio or fast walk</li>
                <li>Mobility circuit: hips, t-spine, shoulders (2–3 drills)</li>
                <li>Core activation: dead bug, bird dog, or plank (1–2 sets)</li>
                <li>3–5 explosive reps (jumps or med ball) before bar work</li>
            </ul>
        </div>
    );
}
