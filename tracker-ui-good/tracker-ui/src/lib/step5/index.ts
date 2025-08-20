// src/lib/step5/index.ts
import type {
    Step5State, Step5Result, Lift, Unit, ProgressIncrements, Phase, SeventhWeekMode
} from './types';

// deterministic base increments (non-negotiable)
const BASE_INCREMENTS: ProgressIncrements = {
    upperLb: 5, lowerLb: 10, upperKg: 2.5, lowerKg: 5,
};

function isUpper(lift: Lift) {
    return lift === 'bench' || lift === 'press';
}
function deltaFor(unit: Unit, lift: Lift, inc: ProgressIncrements) {
    if (unit === 'lb') return isUpper(lift) ? inc.upperLb : inc.lowerLb;
    return isUpper(lift) ? inc.upperKg : inc.lowerKg;
}

function applyResets(tm: Record<Lift, number>, resets?: Partial<Record<Lift, boolean>>) {
    if (!resets) return tm;
    const out = { ...tm };
    (Object.keys(resets) as Lift[]).forEach(l => {
        if (resets[l]) out[l] = Math.max(0, out[l] * 0.9); // ~10% down
    });
    return out;
}

function maybeProgress(
    unit: Unit,
    tm: Record<Lift, number>,
    inc: ProgressIncrements,
    hold?: boolean
): { next: Record<Lift, number>; events: Step5Result['events'] } {
    const events: Step5Result['events'] = {};
    if (hold) {
        (Object.keys(tm) as Lift[]).forEach(l => (events[l] = { type: 'held', note: 'progression held this boundary' }));
        return { next: { ...tm }, events };
    }
    const next: Record<Lift, number> = { ...tm };
    (Object.keys(tm) as Lift[]).forEach(l => {
        const d = deltaFor(unit, l, inc);
        next[l] = tm[l] + d;
        events[l] = { type: 'standard' };
    });
    return { next, events };
}

function laShouldProgress(la: Step5State['la'], phase: Phase, cycleIndex: number): boolean {
    if (!la.enabled) return true;
    if (la.progressAt === 'eachCycle') return true;
    // endOfBlock: progress at block boundaries only
    if (phase === 'leader' && cycleIndex + 1 < la.leaderCycles) return false;
    if (phase === 'anchor' && cycleIndex + 1 < la.anchorCycles) return false;
    return true;
}

function nextPhaseAndCycle(
    la: Step5State['la'],
    phase: Phase,
    cycleIndex: number
): { nextPhase: Phase; nextCycleIndex: number; seventhWeek?: SeventhWeekMode } {
    if (!la.enabled || phase === 'none') {
        return { nextPhase: 'none', nextCycleIndex: 0 };
    }
    // Leader block
    if (phase === 'leader') {
        const lastLeader = cycleIndex + 1 >= la.leaderCycles;
        if (!lastLeader) return { nextPhase: 'leader', nextCycleIndex: cycleIndex + 1 };
        // boundary: leader -> anchor (maybe 7th week)
        if (la.seventhWeekBetween !== 'off') {
            return { nextPhase: 'anchor', nextCycleIndex: 0, seventhWeek: la.seventhWeekBetween };
        }
        return { nextPhase: 'anchor', nextCycleIndex: 0 };
    }
    // Anchor block
    if (phase === 'anchor') {
        const lastAnchor = cycleIndex + 1 >= la.anchorCycles;
        if (!lastAnchor) return { nextPhase: 'anchor', nextCycleIndex: cycleIndex + 1 };
        // boundary: anchor -> (wrap to leader) with optional 7th week
        if (la.seventhWeekAfterAnchor !== 'off') {
            return { nextPhase: 'leader', nextCycleIndex: 0, seventhWeek: la.seventhWeekAfterAnchor };
        }
        return { nextPhase: 'leader', nextCycleIndex: 0 };
    }
    // none (shouldn't hit if la.enabled)
    return { nextPhase: 'none', nextCycleIndex: 0 };
}

export function step5_progression(state: Step5State): Step5Result {
    const inc: ProgressIncrements = { ...BASE_INCREMENTS, ...state.increments };
    // 1) optional resets (-10%) per stalled lift
    const tmAfterResets = applyResets(state.tm, state.resetLifts);

    // 2) leader/anchor boundary logic & seventh week insertion
    const la = state.la ?? {
        enabled: false,
        leaderCycles: 2,
        anchorCycles: 1,
        progressAt: 'eachCycle',
        seventhWeekBetween: 'off' as SeventhWeekMode,
        seventhWeekAfterAnchor: 'off' as SeventhWeekMode,
    };

    const allowProgress = laShouldProgress(la, state.phase, state.cycleIndex);

    // 3) apply +5/+10 (or hold)
    const { next, events } = maybeProgress(state.unit, tmAfterResets, inc, state.holdProgression || !allowProgress);

    // 4) compute next phase/cycle, possibly inserting 7th week marker
    const { nextPhase, nextCycleIndex, seventhWeek } = nextPhaseAndCycle(la, state.phase, state.cycleIndex);

    // If a 7th week is inserted, we still deliver progressed TMs; annotate events for UI.
    if (seventhWeek && seventhWeek !== 'off') {
        (Object.keys(next) as Lift[]).forEach(l => {
            events[l] = { type: 'seventhWeek', note: `insert ${seventhWeek} before next phase` };
        });
    }

    return {
        nextTm: next,
        nextCycleIndex,
        nextPhase,
        events,
        insertedSeventhWeek: seventhWeek,
    };
}
