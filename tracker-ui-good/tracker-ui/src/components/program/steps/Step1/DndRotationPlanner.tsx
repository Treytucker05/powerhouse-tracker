import * as React from 'react';
import { useSchedule, type Weekday } from '@/store/scheduleStore';

type Lift = 'Squat' | 'Bench' | 'Deadlift' | 'Press';
const LIFTS: Lift[] = ['Squat', 'Bench', 'Deadlift', 'Press'];
const WD: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LS_KEY = 'ph531.step1.rotation.v1';

export type Assignments = Record<string, Lift>; // key: `${row}:${day}` maps to a single lift

const liftColor: Record<Lift, string> = {
    Squat: 'bg-emerald-700/80 border-emerald-400 text-emerald-50',
    Bench: 'bg-sky-700/80 border-sky-400 text-sky-50',
    Deadlift: 'bg-amber-700/80 border-amber-400 text-amber-50',
    Press: 'bg-fuchsia-700/80 border-fuchsia-400 text-fuchsia-50',
};

type Props = {
    value?: Assignments;
    onChange?: (a: Assignments) => void;
};

export default function DndRotationPlanner({ value, onChange }: Props) {
    const { daysPerWeek, days } = useSchedule();
    const rows = daysPerWeek === 4 ? 1 : 2;
    const controlled = value !== undefined;
    const dragFromRef = React.useRef<string | null>(null);
    const dropHandledRef = React.useRef(false);
    const [assignments, setAssignments] = React.useState<Assignments>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            // migrate from older array-based shape to single value per cell
            const migrated: Assignments = {};
            if (parsed && typeof parsed === 'object') {
                for (const [k, v] of Object.entries(parsed)) {
                    if (Array.isArray(v)) {
                        const first = (v as any[])[0];
                        if (LIFTS.includes(first)) migrated[k] = first as Lift;
                    } else if (typeof v === 'string' && LIFTS.includes(v as any)) {
                        migrated[k] = v as Lift;
                    }
                }
            }
            return migrated;
        } catch { return {}; }
    });

    // If parent provides a controlled value, sync internal state to it
    React.useEffect(() => {
        if (controlled && value && Object.keys(value).length > 0) {
            // shallow compare to avoid loops
            const a = JSON.stringify(assignments);
            const b = JSON.stringify(value);
            if (a !== b) setAssignments(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Persist to localStorage whenever grid changes (no-op if not permitted)
    React.useEffect(() => {
        try { localStorage.setItem(LS_KEY, JSON.stringify(assignments)); } catch { /* ignore */ }
    }, [assignments]);

    const onPaletteDragStart = (e: React.DragEvent, lift: Lift) => {
        e.dataTransfer.setData('text/plain', lift);
        e.dataTransfer.effectAllowed = 'copy';
        dragFromRef.current = null;
        dropHandledRef.current = false;
    };
    const onCellChipDragStart = (key: string, lift: Lift) => (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', lift);
        e.dataTransfer.effectAllowed = 'move';
        dragFromRef.current = key;
        dropHandledRef.current = false;
    };
    const allowDrop = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = dragFromRef.current ? 'move' : 'copy'; };
    const dropTo = (row: number, day: Weekday, e: React.DragEvent) => {
        e.preventDefault();
        const lift = e.dataTransfer.getData('text/plain') as Lift;
        if (!lift || !LIFTS.includes(lift)) return;
        const key = `${row}:${day}`;
        // Only one lift per cell: replace existing
        setAssignments(prev => {
            const next = { ...prev, [key]: lift } as Assignments;
            // If dragging from another cell, clear origin (move semantics)
            const from = dragFromRef.current;
            if (from && from !== key) {
                delete (next as any)[from];
            }
            // Emit change immediately in controlled mode to avoid effect-loop
            if (controlled) onChange?.(next);
            return next;
        });
        dropHandledRef.current = true;
    };
    const clearCell = (row: number, day: Weekday) => {
        const key = `${row}:${day}`;
        setAssignments(prev => {
            const next = { ...prev } as Assignments;
            delete next[key];
            if (controlled) onChange?.(next);
            return next;
        });
    };

    // Simple order warning for 4D: expect SQ -> BP -> DL -> PR across the single row on selected days
    const warnings = React.useMemo(() => {
        const msgs: string[] = [];
        // Build sequence across grid in reading order (rows top-down, days Mon..Sun) but only for selected training days
        const seq: { lift: Lift; where: string }[] = [];
        for (let r = 0; r < rows; r++) {
            for (const d of WD) {
                if (!days.includes(d)) continue;
                const key = `${r}:${d}`;
                const L = assignments[key];
                if (L) seq.push({ lift: L, where: `${d}${rows > 1 ? ` (row ${r + 1})` : ''}` });
            }
        }
        // 4D specific order suggestion when single row
        if (rows === 1) {
            const compact = seq.map(s => s.lift);
            const expected: Lift[] = ['Squat', 'Bench', 'Deadlift', 'Press'];
            if (compact.length >= 4) {
                const mismatch = expected.findIndex((l, i) => compact[i] !== l);
                if (mismatch !== -1) msgs.push('Recommended order for 4D is SQ → BP → DL → PR. Adjust the first four days to match.');
            }
        }
        // Alternation rule (Upper then Lower then Upper...)
        const isUpper = (l: Lift) => l === 'Bench' || l === 'Press';
        const isLower = (l: Lift) => l === 'Squat' || l === 'Deadlift';
        for (let i = 1; i < seq.length; i++) {
            const prev = seq[i - 1].lift, cur = seq[i].lift;
            if ((isUpper(prev) && isUpper(cur)) || (isLower(prev) && isLower(cur))) {
                const prevWhere = seq[i - 1].where; const curWhere = seq[i].where;
                msgs.push(`Prefer alternating Upper and Lower. Found ${isUpper(prev) ? 'Upper' : 'Lower'} then ${isUpper(cur) ? 'Upper' : 'Lower'} (${prevWhere} → ${curWhere}). Try moving a ${isUpper(prev) ? 'Lower' : 'Upper'} day between them.`);
            }
        }
        return msgs;
    }, [assignments, days, rows]);

    return (
        <section className="mt-4 border border-gray-700 rounded p-4 bg-[#0b1220] text-white">
            <h3 className="text-lg font-semibold text-[#ef4444] mb-3">Schedule & Rotation (Drag and Drop)</h3>
            {/* Palette */}
            <div className="mb-3 flex flex-wrap gap-2">
                {LIFTS.map(lift => (
                    <div key={lift}
                        draggable
                        onDragStart={(e) => onPaletteDragStart(e, lift)}
                        className={`px-3 py-1 text-xs rounded border cursor-grab active:cursor-grabbing select-none ${liftColor[lift]}`}
                        title="Drag to a day slot. You can place duplicates.">
                        {lift}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-2">
                {/* Header days as visual buttons (selected brighter) */}
                <div className="grid grid-cols-7 gap-2">
                    {WD.map(d => {
                        const selected = days.includes(d);
                        return (
                            <div key={d}
                                className={`text-center text-[11px] px-2 py-1 rounded border select-none ${selected ? 'bg-red-600/30 border-red-500 text-red-100 font-semibold' : 'bg-gray-900/40 border-gray-700 text-gray-400'}`}>
                                {d}
                            </div>
                        );
                    })}
                </div>
                {Array.from({ length: rows }).map((_, r) => (
                    <div key={r} className="grid grid-cols-7 gap-2">
                        {WD.map((d) => {
                            const key = `${r}:${d}`;
                            const cell = assignments[key];
                            const selected = days.includes(d);
                            return (
                                <div key={key}
                                    onDragOver={allowDrop}
                                    onDrop={(e) => selected && dropTo(r, d, e)}
                                    className={`min-h-[56px] rounded border p-1 flex flex-wrap gap-1 items-center justify-center ${selected ? 'border-gray-600 bg-gray-800/50' : 'border-gray-800 bg-gray-900/40 opacity-60'}`}
                                    title={selected ? 'Drop here' : 'Not a selected training day'}>
                                    {!cell && (
                                        <div className="text-[10px] text-gray-500">Drop here</div>
                                    )}
                                    {cell && (
                                        <div className="relative group">
                                            <div
                                                draggable
                                                title="Drag out to remove"
                                                aria-label="Drag out to remove"
                                                onDragStart={onCellChipDragStart(key, cell)}
                                                onDragEnd={() => {
                                                    // If a drag started from this cell and no valid drop happened, clear
                                                    if (dragFromRef.current === key && !dropHandledRef.current) {
                                                        clearCell(r, d);
                                                    }
                                                    dragFromRef.current = null;
                                                    dropHandledRef.current = false;
                                                }}
                                                className={`px-2 py-0.5 text-[11px] rounded border cursor-grab active:cursor-grabbing select-none ${liftColor[cell]}`}
                                            >
                                                {cell}
                                            </div>
                                            {/* hover hint */}
                                            <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-gray-900/90 text-gray-100 border border-gray-700 rounded px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Drag out to remove
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Guidance / warnings */}
            <div className="mt-2 text-xs text-gray-400">
                <div>Tip: Select {daysPerWeek} training day(s) above. Only one workout fits per day; duplicate lifts across the grid are allowed.</div>
                {warnings.length > 0 && (
                    <ul className="mt-1 space-y-1">
                        {warnings.map((w, i) => (
                            <li key={i} className="text-amber-300">⚠ {w}</li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
