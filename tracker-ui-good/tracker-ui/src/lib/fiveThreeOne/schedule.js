// src/lib/fiveThreeOne/schedule.js

// Canonical 4-day order per manual: Press, Deadlift, Bench, Squat
export const CANONICAL_ORDER = ['press', 'deadlift', 'bench', 'squat'];

/**
 * Build a schedule days array from a frequency.
 * For now, one main lift per day (2-lift days will be added later).
 */
export function buildDaysByFrequency(freq = '4day') {
    if (freq === '3day') {
        // 3 training days per week; 4th lift rolls to the following week in the calendar.
        // For the editor we present the first week's order; the calendar handles rolling.
        return [{ id: 'D1', lift: 'press' }, { id: 'D2', lift: 'deadlift' }, { id: 'D3', lift: 'bench' }];
    }
    if (freq === '2day') {
        // Minimal template: 2 training days; remaining lifts roll forward.
        // Present first two in recommended recovery-friendly order.
        return [{ id: 'D1', lift: 'press' }, { id: 'D2', lift: 'squat' }];
    }
    if (freq === '4day') {
        return CANONICAL_ORDER.map((lift, idx) => ({ id: `D${idx + 1}`, lift }));
    }
    // Fallback: 4-day
    return CANONICAL_ORDER.map((lift, idx) => ({ id: `D${idx + 1}`, lift }));
}

export function resetToCanonical(days) {
    return CANONICAL_ORDER.map((lift, idx) => ({ id: `D${idx + 1}`, lift }));
}

export function liftOptions() {
    return [
        { value: 'press', label: 'Overhead Press' },
        { value: 'deadlift', label: 'Deadlift' },
        { value: 'bench', label: 'Bench Press' },
        { value: 'squat', label: 'Squat' },
    ];
}
