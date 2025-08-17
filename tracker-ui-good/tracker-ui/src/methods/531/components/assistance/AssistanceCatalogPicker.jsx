import React, { useMemo, useState } from "react";
import { ASSISTANCE_CATALOG, EXERCISE_NOTES } from "../../assistance/index.js";

// Helper: flatten category object -> annotated array
function useFlatCatalog() {
    return useMemo(() => {
        if (!ASSISTANCE_CATALOG) return [];
        // If already an array (future proof), just return
        if (Array.isArray(ASSISTANCE_CATALOG)) return ASSISTANCE_CATALOG;
        // Otherwise treat as object keyed by category (push, pull, ...)
        return Object.entries(ASSISTANCE_CATALOG).flatMap(([cat, arr]) => (
            (arr || []).map(item => ({
                ...item,
                block: item.block || (cat === 'singleLeg' ? 'Single-Leg' : cat.charAt(0).toUpperCase() + cat.slice(1)),
                equipment: item.equipment || item.equip || []
            }))
        ));
    }, []);
}

export default function AssistanceCatalogPicker({ block, equipment = [], onPick, onClose, limitIds = null, keepOpen = false }) {
    const [q, setQ] = useState("");
    const [categoryFilter, setCategoryFilter] = useState('All');
    const flat = useFlatCatalog();

    // Category mappings for book-accurate BBB assistance
    const categories = {
        'All': 'All Exercises',
        'Push': 'Push Pattern',
        'Pull': 'Pull Pattern',
        'Core': 'Core/Abs',
        'Single-Leg': 'Single-Leg/Unilateral'
    };

    const filtered = useMemo(() => {
        return flat.filter(x => {
            if (limitIds && !limitIds.includes(x.id)) return false;
            const byBlock = block && block !== 'All' ? (x.block === block) : true;

            // Category filter logic (book-accurate BBB patterns)
            const byCategory = categoryFilter === 'All' ? true : (() => {
                const exerciseBlock = (x.block || '').toLowerCase();
                const exerciseName = (x.name || '').toLowerCase();

                switch (categoryFilter) {
                    case 'Push':
                        return exerciseBlock.includes('push') || exerciseName.includes('dip') || exerciseName.includes('press') || exerciseName.includes('tricep');
                    case 'Pull':
                        return exerciseBlock.includes('pull') || exerciseName.includes('chin') || exerciseName.includes('pullup') || exerciseName.includes('row') || exerciseName.includes('curl');
                    case 'Core':
                        return exerciseBlock.includes('core') || exerciseName.includes('leg raise') || exerciseName.includes('hang') || exerciseName.includes('abs') || exerciseName.includes('plank');
                    case 'Single-Leg':
                        return exerciseBlock.includes('single') || exerciseName.includes('lunge') || exerciseName.includes('leg curl') || exerciseName.includes('step') || exerciseName.includes('unilateral');
                    default:
                        return true;
                }
            })();

            // Exercise is allowed if all its required equipment are contained in user equipment selection
            const req = x.equipment || [];
            const byEquip = req.every(tag => equipment.includes(tag));
            const byQuery = q ? (x.name.toLowerCase().includes(q.toLowerCase())) : true;
            return byBlock && byEquip && byQuery && byCategory;
        });
    }, [q, block, equipment, flat, limitIds, categoryFilter]);

    return (
        <div
            className="p-3 border border-gray-600 rounded bg-gray-900 shadow-xl space-y-2 text-xs max-w-md"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex gap-2">
                <input
                    className="flex-1 border border-gray-600 bg-gray-800 rounded px-2 py-1 text-xs text-gray-100"
                    placeholder="Search exercises…"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                />
                <button
                    className="border border-gray-600 hover:border-gray-400 rounded px-2 py-1 text-gray-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    type="button"
                >Close</button>
            </div>

            {keepOpen && (
                <div className="text-[10px] text-blue-300 bg-blue-900/20 border border-blue-500/40 rounded px-2 py-1">
                    💡 Modal stays open - browse and select multiple exercises
                </div>
            )}

            {/* Category Filter Radio Buttons - Book-accurate BBB assistance patterns */}
            <div className="space-y-1">
                <div className="text-[10px] text-gray-400 font-medium">Filter by Movement Pattern:</div>
                <div className="flex flex-wrap gap-1">
                    {Object.entries(categories).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-1 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="radio"
                                name="categoryFilter"
                                value={key}
                                checked={categoryFilter === key}
                                onChange={e => setCategoryFilter(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-3 h-3 text-indigo-600 bg-gray-800 border-gray-600 focus:ring-indigo-500"
                            />
                            <span className={`text-[10px] px-1 py-0.5 rounded ${categoryFilter === key ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="max-h-64 overflow-auto divide-y divide-gray-700">
                {filtered.map(x => {
                    const note = EXERCISE_NOTES[x.id];
                    return (
                        <div key={x.id} className="flex items-center justify-between py-1" title={note || ''}>
                            <div className="pr-3">
                                <div className="font-medium text-gray-200 leading-tight flex items-center gap-1">
                                    {x.block && <span className="text-[9px] px-1 py-0.5 rounded bg-gray-700/60 border border-gray-600 text-gray-300">{x.block}</span>}
                                    <span>{x.name}</span>
                                </div>
                                <div className="text-[10px] text-gray-500">{(x.equipment || []).join(', ') || 'Any'}{note && <span className="text-gray-600"> — {note}</span>}</div>
                            </div>
                            <button
                                className="border border-indigo-600/60 hover:border-indigo-400 rounded px-2 py-1 text-[10px] text-indigo-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPick(x);
                                    // Only close modal if keepOpen is false (default behavior)
                                    if (!keepOpen) {
                                        onClose();
                                    }
                                }}
                                type="button"
                            >Select</button>
                        </div>
                    );
                })}
                {!filtered.length && <div className="py-2 text-gray-500">No matches for "{categoryFilter}" category.</div>}
            </div>
        </div>
    );
}
