import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgramPreview531 from './ProgramPreview531.jsx';

function makeData(tmPct = 0.85) {
    return {
        tmPct,
        schedule: { frequency: 4, days: [{ lift: 'press' }, { lift: 'deadlift' }, { lift: 'bench' }, { lift: 'squat' }] },
        trainingMaxes: { press: 100, deadlift: 300, bench: 200, squat: 275 },
        rounding: { increment: 5, mode: 'nearest' },
        loading: { previewWeek: 1, option: 1 },
        assistance: { perDay: {} },
        conditioning: { weeklyPlan: [] }
    };
}

describe('ProgramPreview531 TM percent display', () => {
    function findTmLine() {
        return screen.getByText((_, el) => !!el && /Training Max %:\s*\d+%/.test(el.textContent));
    }

    it('shows 85 when tmPct=0.85', () => {
        render(<ProgramPreview531 data={makeData(0.85)} updateData={() => { }} />);
        const el = findTmLine();
        expect(el.textContent).toMatch(/85%/);
    });
    it('shows 90 when tmPct=0.90', () => {
        render(<ProgramPreview531 data={makeData(0.90)} updateData={() => { }} />);
        const el = findTmLine();
        expect(el.textContent).toMatch(/90%/);
    });
});
