import React from "react";

export default function AssistanceRow({ item, onChange, onSwap, onDelete }) {
    const onSets = (e) => onChange({ ...item, sets: e.target.value });
    const onReps = (e) => onChange({ ...item, reps: e.target.value });

    return (
        <div className="flex items-center gap-2 py-1">
            <span className="text-xs shrink-0 rounded px-1.5 py-0.5 bg-gray-700/30 border border-gray-600 text-gray-300 font-mono min-w-[1.5rem] text-center">
                {item.block ?? "—"}
            </span>
            <span className="flex-1 truncate text-[11px] text-gray-200">{item.name}</span>
            <input
                className="w-14 border border-gray-600 bg-gray-800 rounded px-2 py-1 text-xs text-gray-100"
                value={item.sets}
                onChange={onSets}
                aria-label="sets"
            />
            <span className="text-gray-500 text-xs">×</span>
            <input
                className="w-14 border border-gray-600 bg-gray-800 rounded px-2 py-1 text-xs text-gray-100"
                value={item.reps}
                onChange={onReps}
                aria-label="reps"
            />
            <button
                className="border border-indigo-600/60 hover:border-indigo-400 rounded px-2 py-1 text-[10px] text-indigo-300"
                onClick={onSwap}
                type="button"
            >
                Swap
            </button>
            <button
                className="border border-red-600/60 hover:border-red-400 rounded px-2 py-1 text-[10px] text-red-300"
                onClick={onDelete}
                type="button"
            >
                Delete
            </button>
        </div>
    );
}
