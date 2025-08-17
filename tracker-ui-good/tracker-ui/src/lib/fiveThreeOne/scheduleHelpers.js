// src/lib/fiveThreeOne/scheduleHelpers.js

// 3-letter day keys for compact UI & printable sheets
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Derive a mapping of training days -> lift keys.
 * Priority:
 * 1) state.schedule.daysMapping (explicit)
 * 2) state.schedule.pattern (string like "Mon/Tue/Thu/Fri") + state.schedule.liftOrder
 * 3) fallback 4-day default: Mon/Tue/Thu/Fri with Press/Deadlift/Bench/Squat
 */
export function deriveLiftDayMap(state = {}) {
    const explicit = state?.schedule?.daysMapping;
    if (explicit && typeof explicit === 'object') return explicit;

    const order = state?.schedule?.liftOrder || ['press', 'deadlift', 'bench', 'squat'];
    const pattern = state?.schedule?.pattern || 'Mon/Tue/Thu/Fri';
    const dayList = pattern.split('/').map(s => s.trim()).filter(Boolean);

    // sanitize day tokens into known keys (Mon..Sun)
    const normalize = (d) => {
        const m = d.toLowerCase();
        if (m.startsWith('mon')) return 'Mon';
        if (m.startsWith('tue') || m.startsWith('tues')) return 'Tue';
        if (m.startsWith('wed')) return 'Wed';
        if (m.startsWith('thu') || m.startsWith('thur') || m.startsWith('thurs')) return 'Thu';
        if (m.startsWith('fri')) return 'Fri';
        if (m.startsWith('sat')) return 'Sat';
        if (m.startsWith('sun')) return 'Sun';
        return null;
    };

    const dayKeys = dayList.map(normalize).filter(Boolean);
    const map = {};
    for (let i = 0; i < Math.min(dayKeys.length, order.length); i++) {
        map[dayKeys[i]] = order[i];
    }

    // If nothing usable, fallback to classic 4-day split
    if (!Object.keys(map).length) {
        return { Mon: 'press', Tue: 'deadlift', Thu: 'bench', Fri: 'squat' };
    }
    return map;
}
