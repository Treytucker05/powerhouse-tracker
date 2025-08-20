import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import ProgramPreview531 from './ProgramPreview531.jsx';

// Shared mocks we can tweak per test via implementation changes
vi.mock('../../../lib/fiveThreeOne/compute531.js', () => ({
    buildProgram: vi.fn(),
    calcMainSets: vi.fn()
}));
vi.mock('../../../lib/fiveThreeOne/warmup.js', () => ({
    getWarmupsByPolicy: vi.fn()
}));
vi.mock('./_registry/stepRegistry.js', () => ({
    getAllStepStatuses: vi.fn()
}));
vi.mock('../../../lib/fiveThreeOne/math.js', () => ({
    percentOfTM: (tm, pct) => (tm * pct) / 100,
    toDisplayWeight: (w) => w
}));
vi.mock('../../../lib/tm.ts', () => ({
    getTmPct: () => 0.9
}));

import { buildProgram, calcMainSets } from '../../../lib/fiveThreeOne/compute531.js';
import { getWarmupsByPolicy } from '../../../lib/fiveThreeOne/warmup.js';
import { getAllStepStatuses } from './_registry/stepRegistry.js';

const baseData = {
    schedule: { days: [{ lift: 'press' }, { lift: 'deadlift' }] },
    trainingMaxes: { press: 150, deadlift: 300 },
    rounding: { increment: 5, mode: 'nearest' },
    warmup: { policy: 'standard', custom: [], deadliftRepStyle: 'deadstop' },
    loading: { previewWeek: 1, option: 1 },
    assistance: { perDay: { press: [{ name: 'DB Press', sets: 3, reps: 10 }], deadlift: [{ name: 'Rows', sets: 3, reps: 8, load: { type: 'percentTM', value: 50, liftRef: 'deadlift' } }] } },
    lifts: { deadlift: { tm: 300 } },
    templateChoice: { id: 'standard' },
    cycle: { loadingOption: 1 },
    conditioning: { weeklyPlan: [] }
};

function mockProgram() {
    buildProgram.mockReturnValue({
        weeks: [{ days: [{ focus: 'Press', conditioning: null }, { focus: 'Deadlift', conditioning: { type: 'Prowler', description: '10 trips' } }] }],
        deloadWeek: null
    });
    calcMainSets.mockReturnValue([{ pct: 65, reps: 5, weight: 100 }, { pct: 75, reps: 5, weight: 115 }]);
    getWarmupsByPolicy.mockReturnValue([{ weight: 45, reps: 5, pct: 30 }]);
}

describe('ProgramPreview531 statuses & exports', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockProgram();
    });

    it('shows in progress status when not all steps complete and no errors', () => {
        getAllStepStatuses.mockReturnValue({ step1: 'complete', step2: 'incomplete' });
        render(<ProgramPreview531 data={baseData} />);
        expect(screen.getByText('In progress...')).toBeInTheDocument();
    });

    it('shows ready to export when all steps complete', () => {
        getAllStepStatuses.mockReturnValue({ step1: 'complete', step2: 'complete' });
        render(<ProgramPreview531 data={baseData} />);
        expect(screen.getAllByText('Ready to export').length).toBeGreaterThan(0);
        // warm-up + main sets render (may appear multiple times)
        expect(screen.getAllByText(/Warm‑Up/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Main Sets/).length).toBeGreaterThan(0);
        // assistance percent TM path (→ weight) triggered
        expect(screen.getAllByText(/Rows:/).length).toBeGreaterThan(0);
    });

    it('shows validation errors when any step has error', () => {
        getAllStepStatuses.mockReturnValue({ step1: 'complete', step2: 'error' });
        render(<ProgramPreview531 data={baseData} />);
        expect(screen.getByText('Validation errors')).toBeInTheDocument();
    });

    it('renders program generation error UI when buildProgram throws', () => {
        getAllStepStatuses.mockReturnValue({ step1: 'complete' });
        buildProgram.mockImplementation(() => { throw new Error('boom'); });
        render(<ProgramPreview531 data={baseData} />);
        expect(screen.getByText('Program Generation Error')).toBeInTheDocument();
    });

    it('handles export actions (json + print)', () => {
        getAllStepStatuses.mockReturnValue({ step1: 'complete', step2: 'complete' });
        if (!URL.createObjectURL) {
            // @ts-ignore
            URL.createObjectURL = vi.fn(() => 'blob:fake');
        }
        const createUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
        if (!URL.revokeObjectURL) {
            // @ts-ignore
            URL.revokeObjectURL = vi.fn();
        }
        const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => { });
        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { });
        const printSpy = vi.spyOn(window, 'print').mockImplementation(() => { });
        render(<ProgramPreview531 data={baseData} />);

        fireEvent.click(screen.getAllByText('Download JSON')[0]);
        expect(createUrlSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();

        fireEvent.click(screen.getAllByText('Print Program')[0]);
        expect(printSpy).toHaveBeenCalled();

        revokeSpy.mockRestore();
    });
});
