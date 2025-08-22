import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { HashRouter } from 'react-router-dom';
import DesignCustomize from '../DesignCustomize';
import { BuilderStateProvider } from '@/context/BuilderState';

function renderStep3() {
    return render(
        <HashRouter>
            <BuilderStateProvider>
                <DesignCustomize />
            </BuilderStateProvider>
        </HashRouter>
    );
}

describe('DesignCustomize rotation & auto-correct', () => {
    beforeEach(() => {
        // Ensure no persisted builder state bleeds between tests
        localStorage.clear();
    });
    it('normalizes to 2-day rotation and auto-correct restores canonical pattern', async () => {
        renderStep3();
        // Switch to 2-Day
        fireEvent.click(screen.getByTestId('schedule-btn-2'));
        const editors = await screen.findAllByTestId('lift-rotation-editor');
        const editor = editors[editors.length - 1];
        // Expect 2 weeks * 2 selects = 4 selects
        // Filter selects to only those with lift values (exclude any future non-lift selects)
        const selects = within(editor).getAllByRole('combobox').filter(sel => ['press', 'deadlift', 'bench', 'squat'].includes((sel as HTMLSelectElement).value));
        expect(selects.length).toBe(4);
        // Baseline canonical first week Press / Deadlift
        expect(selects[0]).toHaveValue('press');
        expect(selects[1]).toHaveValue('deadlift');
        // Introduce deviation: change second select to bench
        fireEvent.change(selects[1], { target: { value: 'bench' } });
        // Auto-correct button should appear
        const autoBtn = await screen.findByTestId('auto-correct-all');
        fireEvent.click(autoBtn);
        await waitFor(() => {
            const selectsAfter = within(editor).getAllByRole('combobox');
            expect(selectsAfter[0]).toHaveValue('press');
            expect(selectsAfter[1]).toHaveValue('deadlift');
        });
    });

    it('3-day rotation shows correct default week patterns', async () => {
        renderStep3();
        // Disambiguate potential duplicate 3-Day buttons by grabbing those with aria-label containing 'schedule'
        const threeButtons = screen.getAllByTestId('schedule-btn-3');
        fireEvent.click(threeButtons[0]);
        const editors2 = await screen.findAllByTestId('lift-rotation-editor');
        const editor = editors2[editors2.length - 1];
        // Wait for second week first slot to appear
        await screen.findByTestId('rotation-week-1-slot-0');
        // Wait until 6 rotation selects (2 weeks * 3 lifts) are rendered
        await waitFor(() => {
            const allSelects = within(editor).getAllByRole('combobox').filter(sel => ['press', 'deadlift', 'bench', 'squat'].includes((sel as HTMLSelectElement).value));
            expect(allSelects.length).toBe(6);
        });
        const selects = within(editor).getAllByRole('combobox').filter(sel => ['press', 'deadlift', 'bench', 'squat'].includes((sel as HTMLSelectElement).value));
        // Week1 pattern P D B
        expect(selects[0]).toHaveValue('press');
        expect(selects[1]).toHaveValue('deadlift');
        expect(selects[2]).toHaveValue('bench');
        // Week2 pattern S P D
        expect(selects[3]).toHaveValue('squat');
        expect(selects[4]).toHaveValue('press');
        expect(selects[5]).toHaveValue('deadlift');
    });
});
