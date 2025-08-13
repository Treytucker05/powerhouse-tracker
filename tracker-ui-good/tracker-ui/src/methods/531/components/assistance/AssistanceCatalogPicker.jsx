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

export default function AssistanceCatalogPicker({ block, equipment = [], onPick, onClose, limitIds = null }) {
    const [q, setQ] = useState("");
    const flat = useFlatCatalog();
    const filtered = useMemo(() => {
        return flat.filter(x => {
            if (limitIds && !limitIds.includes(x.id)) return false;
            const byBlock = block && block !== 'All' ? (x.block === block) : true;
            // Exercise is allowed if all its required equipment are contained in user equipment selection
            const req = x.equipment || [];
            const byEquip = req.every(tag => equipment.includes(tag));
            const byQuery = q ? (x.name.toLowerCase().includes(q.toLowerCase())) : true;
            return byBlock && byEquip && byQuery;
        });
    }, [q, block, equipment, flat, limitIds]);

    return (
        <div className="p-3 border border-gray-600 rounded bg-gray-900 shadow-xl space-y-2 text-xs max-w-md">
            <div className="flex gap-2">
                <input
                    className="flex-1 border border-gray-600 bg-gray-800 rounded px-2 py-1 text-xs text-gray-100"
                    placeholder="Search exercises…"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                />
                <button className="border border-gray-600 hover:border-gray-400 rounded px-2 py-1 text-gray-300" onClick={onClose} type="button">Close</button>
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
                                onClick={() => onPick(x)}
                                type="button"
                            >Select</button>
                        </div>
                    );
                })}
                {!filtered.length && <div className="py-2 text-gray-500">No matches.</div>}
            </div>
        </div>
    );
}
