import * as React from 'react';
import moment from 'moment';
// Custom month grid (no react-big-calendar) so we can anchor to start date week
import '@/styles/calendar.css';
import { useSchedule, type Weekday } from '@/store/scheduleStore';
import { useBuilderOptional } from '@/context/BuilderState';
import { liftColors } from '@/lib/calendar/mapRotation';

// Force US-style weeks (Sunday start) to match UI expectations
try {
    moment.updateLocale('en', { week: { dow: 0 } });
    moment.locale('en');
} catch { }

type Lift = 'Squat' | 'Bench' | 'Deadlift' | 'Press';
const LIFTS: Lift[] = ['Squat', 'Bench', 'Deadlift', 'Press'];
const LS_KEY = 'ph531.step1.dateAssignments.v1';
type Category = 'upper' | 'lower';
const LIFT_TYPE: Record<Lift, Category> = {
    Squat: 'lower',
    Deadlift: 'lower',
    Bench: 'upper',
    Press: 'upper',
};
const CATEGORY_LABEL: Record<Category, 'Upper' | 'Lower'> = { upper: 'Upper', lower: 'Lower' };
const categoryColors: Record<Category, string> = { upper: '#2563EB', lower: '#16A34A' }; // bright, high contrast

type DateAssignments = Record<string, Lift>; // YYYY-MM-DD -> Lift

export default function Step1CalendarPlanner({ embedded = false }: { embedded?: boolean }) {
    const builder = useBuilderOptional();
    const startDateISOFromBuilder: string = (builder?.state as any)?.step1?.startDate || moment().format('YYYY-MM-DD');
    const [startDateISO, setStartDateISO] = React.useState<string>(startDateISOFromBuilder);
    // Keep in sync if outer builder changes
    React.useEffect(() => {
        if (startDateISOFromBuilder && startDateISOFromBuilder !== startDateISO) setStartDateISO(startDateISOFromBuilder);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDateISOFromBuilder]);

    const monthStart = React.useMemo(() => moment(startDateISO, 'YYYY-MM-DD').startOf('month').toDate(), [startDateISO]);
    const monthEnd = React.useMemo(() => moment(monthStart).endOf('month').toDate(), [monthStart]);

    const { daysPerWeek, days } = useSchedule();

    const [assignments, setAssignments] = React.useState<DateAssignments>(() => {
        // Prefer builder state if present, else restore from LS
        const fromBuilder: DateAssignments | undefined = (builder?.state as any)?.step1?.dateAssignments;
        if (fromBuilder && typeof fromBuilder === 'object') return fromBuilder;
        try {
            const raw = localStorage.getItem(LS_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch { return {}; }
    });

    // Persist to builder and LS on change
    const persist = React.useCallback((next: DateAssignments) => {
        if (builder?.setState) {
            builder.setState({ step1: { ...((builder.state as any)?.step1 || {}), dateAssignments: next } });
        }
        try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    }, [builder]);

    // Persist start date to builder and LS
    const persistStartDate = React.useCallback((iso: string) => {
        if (builder?.setState) {
            builder.setState({ step1: { ...((builder.state as any)?.step1 || {}), startDate: iso } });
        } else {
            try {
                const key = 'ph531.builder.ui.state';
                const raw = localStorage.getItem(key);
                const obj = raw ? JSON.parse(raw) : {};
                const step1 = { ...(obj?.step1 || {}), startDate: iso };
                localStorage.setItem(key, JSON.stringify({ ...obj, step1 }));
            } catch { /* ignore */ }
        }
    }, [builder]);

    const updateDate = React.useCallback((date: Date, lift: Lift | null) => {
        const key = moment(date).format('YYYY-MM-DD');
        setAssignments(prev => {
            const next = { ...prev } as DateAssignments;
            if (lift) next[key] = lift; else delete next[key];
            persist(next);
            return next;
        });
    }, [persist]);

    // Drag sources: palette chips and events are draggable
    const dragFromRef = React.useRef<string | null>(null); // for events, key = date ISO

    const onPaletteDragStart = (e: React.DragEvent, lift: Lift) => {
        e.dataTransfer.setData('text/plain', lift);
        e.dataTransfer.effectAllowed = 'copy';
        dragFromRef.current = null;
    };

    // Event component: show lift with color; click to clear; draggable to move
    const EventChip = ({ event }: any) => {
        const lift: Lift = (event?.resource?.lift) as Lift;
        const d: Date = event.start as Date;
        const dateKey = moment(d).format('YYYY-MM-DD');
        return (
            <div
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', lift); e.dataTransfer.effectAllowed = 'move'; dragFromRef.current = dateKey; }}
                onDoubleClick={() => updateDate(d, null)}
                className="px-1 py-0.5 rounded text-[10px] font-semibold cursor-grab active:cursor-grabbing"
                style={{ background: liftColors[lift] || '#3B82F6' }}
                title="Double-click to remove; drag to move to another day"
            >
                {event.title}
            </div>
        );
    };

    // Build 6x7 grid anchored to the start date's week
    const gridStart = React.useMemo(() => moment(startDateISO, 'YYYY-MM-DD').startOf('week'), [startDateISO]);
    const gridDays = React.useMemo(() => Array.from({ length: 42 }, (_, i) => gridStart.clone().add(i, 'days')), [gridStart]);

    // Active training days within the grid (selected weekdays and on/after start)
    const activeDays = React.useMemo(() => {
        const start = moment(startDateISO, 'YYYY-MM-DD');
        return gridDays.filter(d => (days as Weekday[]).includes(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.day()] as Weekday) && !d.isBefore(start, 'day'));
    }, [gridDays, startDateISO, days]);
    const activeKeys = React.useMemo(() => activeDays.map(d => d.format('YYYY-MM-DD')), [activeDays]);
    const patternLen = 4; // Always require four unique anchors before repeating
    const anchorKeys = React.useMemo(() => activeKeys.slice(0, patternLen), [activeKeys]);
    const anchorKeySet = React.useMemo(() => new Set(anchorKeys), [anchorKeys]);

    // Validate anchors left-to-right: start anywhere, must alternate and be unique; returns accepted prefix
    function computeAcceptedAnchors(): { accepted: Array<{ key: string; lift: Lift }>; complete: boolean } {
        const accepted: Array<{ key: string; lift: Lift }> = [];
        const seen = new Set<Lift>();
        for (let i = 0; i < anchorKeys.length; i++) {
            const k = anchorKeys[i];
            const lift = assignments[k] as Lift | undefined;
            if (!lift) break; // stop at first empty
            const cat = LIFT_TYPE[lift];
            const prev = accepted[accepted.length - 1];
            if (prev) {
                const prevCat = LIFT_TYPE[prev.lift];
                if (prevCat === cat) break; // must alternate
            }
            if (seen.has(lift)) break; // must be unique so far
            accepted.push({ key: k, lift });
            seen.add(lift);
        }
        return { accepted, complete: accepted.length === 4 };
    }

    // Highlight selected weekdays; dim non-selected
    const DOW: Weekday[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const isSelected = (date: Date) => (days as Weekday[]).includes(DOW[date.getDay()] as Weekday);
    const dayPropGetter = (date: Date) => {
        const selected = isSelected(date);
        return {
            className: selected ? 'bg-red-600/10 ring-1 ring-red-500/30' : 'opacity-50',
        };
    };

    const WD_LABELS: Weekday[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const onCellDragOver = (allow: boolean) => (e: React.DragEvent) => {
        if (allow) { e.preventDefault(); e.dataTransfer.dropEffect = dragFromRef.current ? 'move' : 'copy'; }
    };
    const onCellDrop = (date: moment.Moment, allow: boolean) => (e: React.DragEvent) => {
        if (!allow) return;
        e.preventDefault();
        const lift = e.dataTransfer.getData('text/plain') as Lift;
        if (!LIFTS.includes(lift)) return;
        const dateKey = date.format('YYYY-MM-DD');
        const fromKey = dragFromRef.current;
        // Enforce: can start anywhere; must alternate with nearest assigned neighbor(s); anchors must be unique within the first 4
        const idx = anchorKeys.indexOf(dateKey);
        if (idx >= 0) {
            // Allow edits within the accepted prefix and placement on the next open anchor; block future anchors
            const { accepted } = computeAcceptedAnchors();
            const nextIdx = accepted.length;
            if (idx > nextIdx) return;
            // Find nearest assigned previous and next anchor
            let prevLift: Lift | undefined;
            for (let j = idx - 1; j >= 0; j--) { const k = anchorKeys[j]; if (assignments[k] && k !== fromKey) { prevLift = assignments[k] as Lift; break; } }
            let nextLift: Lift | undefined;
            for (let j = idx + 1; j < anchorKeys.length; j++) { const k = anchorKeys[j]; if (assignments[k] && k !== fromKey) { nextLift = assignments[k] as Lift; break; } }
            const cat = LIFT_TYPE[lift];
            if (prevLift && LIFT_TYPE[prevLift] === cat) return; // must alternate with prev
            if (nextLift && LIFT_TYPE[nextLift] === cat) return; // must alternate with next
            // Uniqueness across anchors (except self)
            const usedElsewhere = anchorKeys
                .filter(k => k !== dateKey && k !== fromKey)
                .map(k => assignments[k])
                .filter(Boolean) as Lift[];
            if (usedElsewhere.includes(lift)) return; // must be unique within first four
        }
        updateDate(date.toDate(), lift);
        if (fromKey && fromKey !== date.format('YYYY-MM-DD')) {
            setAssignments(prev => { const next = { ...prev }; delete next[fromKey]; persist(next); return next; });
        }
        dragFromRef.current = null;
    };

    // Auto-repeat: once the first four anchor dates are assigned, repeat them over remaining active days
    React.useEffect(() => {
        if (anchorKeys.length < patternLen) {
            // Not enough anchors: keep only whatever the user placed on anchors; clear others to avoid stale auto-fill
            const trimmed: DateAssignments = {};
            for (const k of anchorKeys) {
                if (assignments[k]) trimmed[k] = assignments[k];
            }
            const changed = JSON.stringify(trimmed) !== JSON.stringify(assignments);
            if (changed) { setAssignments(trimmed); persist(trimmed); }
            return;
        }
        // Validate anchors strictly and keep only the valid alternating unique prefix
        const { accepted, complete } = computeAcceptedAnchors();
        if (!complete) {
            const trimmed: DateAssignments = {};
            for (const { key, lift } of accepted) trimmed[key] = lift;
            const changed = JSON.stringify(trimmed) !== JSON.stringify(assignments);
            if (changed) { setAssignments(trimmed); persist(trimmed); }
            return;
        }
        // Valid seed pattern; repeat across remaining active days
        const patternStrict = anchorKeys.map(k => assignments[k] as Lift);
        const next: DateAssignments = {};
        for (let i = 0; i < activeKeys.length; i++) {
            const key = activeKeys[i];
            if (i < patternLen) next[key] = patternStrict[i];
            else next[key] = patternStrict[i % patternLen];
        }
        // Only update if different to avoid loops
        const changed = JSON.stringify(next) !== JSON.stringify(assignments);
        if (changed) { setAssignments(next); persist(next); }
        // include only stable deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(anchorKeys), JSON.stringify(activeKeys), JSON.stringify(anchorKeys.map(k => assignments[k] || ''))]);

    const Wrapper: React.ElementType = embedded ? 'div' : 'section';
    return (
        <Wrapper className={embedded ? '' : 'mt-4 border border-gray-700 rounded p-4 bg-[#0b1220] text-white'}>
            {!embedded && <h3 className="text-lg font-semibold text-[#ef4444] mb-3">Schedule & Calendar (Drag onto dates)</h3>}
            {/* Palette */}
            <div className="mb-3 flex flex-wrap gap-2">
                {LIFTS.map(lift => (
                    <div key={lift}
                        draggable
                        onDragStart={(e) => onPaletteDragStart(e, lift)}
                        className="px-3 py-1 text-xs rounded border cursor-grab active:cursor-grabbing select-none"
                        style={{ background: liftColors[lift], borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
                        title="Drag to a date. Only one per day; duplicates across the month are allowed."
                    >
                        {lift}
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div className="flex items-baseline gap-3">
                    <h4 className="text-sm font-semibold text-gray-200">This Month</h4>
                    <div className="text-xs text-gray-400">{moment(monthStart).format('MMMM YYYY')}</div>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-xs md:text-sm text-gray-300">Start date
                        <input
                            type="date"
                            value={startDateISO}
                            onChange={(e) => { setStartDateISO(e.target.value); persistStartDate(e.target.value); }}
                            className="ml-2 rounded border border-gray-700 bg-gray-800/60 px-2 py-1 text-xs md:text-sm text-gray-100"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => { setAssignments({}); persist({}); }}
                        className="text-xs md:text-sm px-2 py-1 rounded border border-red-500 text-red-200 hover:bg-red-500/10"
                        title="Clear all lifts from this calendar"
                    >
                        Clear all
                    </button>
                </div>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {WD_LABELS.map((label, idx) => {
                    // Use start of grid week for header date mapping
                    const headerDate = gridStart.clone().add(idx, 'days').toDate();
                    const selected = isSelected(headerDate);
                    return (
                        <div key={label} className={selected ? 'text-center text-[11px] px-2 py-1 rounded border bg-red-600/30 border-red-500 text-red-100 font-semibold' : 'text-center text-[11px] px-2 py-1 rounded border bg-gray-900/40 border-gray-700 text-gray-400'}>
                            {label}
                        </div>
                    );
                })}
            </div>

            {/* 6x7 grid */}
            <div className="grid grid-cols-7 gap-2">
                {gridDays.map((day, idx) => {
                    const jsDate = day.toDate();
                    const selected = isSelected(jsDate);
                    const beforeStart = day.isBefore(moment(startDateISO, 'YYYY-MM-DD'), 'day');
                    const dateKey = day.format('YYYY-MM-DD');
                    const lift = assignments[dateKey] as Lift | undefined;
                    const isAnchor = anchorKeySet.has(dateKey);
                    const anchorIdx = isAnchor ? anchorKeys.indexOf(dateKey) : -1;
                    // Determine expected category based on nearest assigned neighbors; for guidance only
                    let expectedLabel = '';
                    if (anchorIdx >= 0) {
                        let prevLift: Lift | undefined;
                        for (let j = anchorIdx - 1; j >= 0; j--) { const k = anchorKeys[j]; if (assignments[k]) { prevLift = assignments[k] as Lift; break; } }
                        let nextLift: Lift | undefined;
                        for (let j = anchorIdx + 1; j < anchorKeys.length; j++) { const k = anchorKeys[j]; if (assignments[k]) { nextLift = assignments[k] as Lift; break; } }
                        if (!prevLift && !nextLift) expectedLabel = 'Any';
                        else if (prevLift) expectedLabel = CATEGORY_LABEL[LIFT_TYPE[prevLift] === 'upper' ? 'lower' : 'upper'];
                        else if (nextLift) expectedLabel = CATEGORY_LABEL[LIFT_TYPE[nextLift] === 'upper' ? 'lower' : 'upper'];
                    }
                    const allow = selected && !beforeStart && isAnchor; // only the first four are manually editable
                    const isAuto = selected && !beforeStart && !!lift && !isAnchor;
                    const { accepted } = computeAcceptedAnchors();
                    const nextIdx = accepted.length;
                    const reason = isAnchor && anchorIdx !== nextIdx ? 'Fill anchors left-to-right' : beforeStart ? 'Before start date' : (!isAnchor && selected ? 'Auto-filled from first four' : 'Not a selected training day');
                    return (
                        <div
                            key={idx}
                            onDragOver={onCellDragOver(allow)}
                            onDrop={onCellDrop(day, allow)}
                            className={`min-h-[56px] rounded border p-1 ${allow ? 'border-gray-600 bg-gray-800/50' : 'border-gray-800 bg-gray-900/40 opacity-60'} relative`}
                            title={allow ? `Drop here • Expected: ${expectedLabel}` : reason}
                        >
                            {/* date label */}
                            <div className="absolute top-1 left-1 text-[11px] font-semibold px-1 py-0.5 rounded bg-[#ef4444] text-white">
                                {!beforeStart ? day.format('DD') : ''}
                            </div>
                            {/* subtle dot on active days to hint droppable */}
                            {selected && !lift && !beforeStart && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-600/70"></div>
                            )}
                            {/* actual category badge when a lift is present */}
                            {lift && !beforeStart && (
                                <div className={`absolute top-1 right-1 text-[10px] font-semibold px-1 py-0.5 rounded ${LIFT_TYPE[lift] === 'upper' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'} shadow`}
                                >
                                    {CATEGORY_LABEL[LIFT_TYPE[lift]]}
                                </div>
                            )}
                            {/* event chip */}
                            {lift && !beforeStart && (
                                <div
                                    draggable={isAnchor}
                                    onDragStart={isAnchor ? (e) => { e.dataTransfer.setData('text/plain', lift); e.dataTransfer.effectAllowed = 'move'; dragFromRef.current = dateKey; } : undefined}
                                    onDoubleClick={isAnchor ? () => updateDate(jsDate, null) : undefined}
                                    className={`mt-5 mx-auto w-fit px-2 py-0.5 rounded text-[12px] font-semibold text-white drop-shadow ${isAnchor ? 'cursor-grab active:cursor-grabbing ring-1 ring-white/20' : 'cursor-default opacity-95 ring-1 ring-white/10'}`}
                                    style={{ background: liftColors[lift] || '#3B82F6' }}
                                    title="Double-click to remove; drag to move"
                                >
                                    {lift}
                                </div>
                            )}
                            {!lift && allow && (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-500">Drop here</div>
                            )}
                            {/* non-anchor active days auto-fill silently; no extra label */}
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 text-xs text-gray-400">
                <div>Tip: Start with any movement. The first four active training days must alternate Upper ↔ Lower and use all four lifts once, then the order repeats on your active days.</div>
                <div>The chip shows the lift name; the top-right badge shows the day’s category. Auto days are read-only.</div>
            </div>
        </Wrapper>
    );
}
