import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { HashRouter } from 'react-router-dom';
import ProgramPreview from '../ProgramPreview';
import { BuilderStateProvider } from '@/context/BuilderState';

function renderStep4() {
    return render(
        <HashRouter>
            <BuilderStateProvider>
                <ProgramPreview />
            </BuilderStateProvider>
        </HashRouter>
    );
}

describe('ProgramPreview (Step 4)', () => {
    beforeEach(() => {
        cleanup();
        localStorage.clear();
    });
    it('renders week tabs and day cards (placeholder when no TMs)', () => {
        renderStep4();
        expect(screen.getByTestId('week-tabs')).toBeInTheDocument();
        expect(screen.getByTestId('day-card-1-1')).toBeInTheDocument();
        // Multiple occurrences (header + day cards); ensure at least one present
        expect(screen.getAllByText(/Enter TMs in Step 1/i).length).toBeGreaterThan(0);
    });

    it('switches active week when tab clicked', () => {
        renderStep4();
        const week2Buttons = screen.getAllByTestId('week-tab-2');
        fireEvent.click(week2Buttons[0]);
        expect(screen.getByTestId('day-card-2-1')).toBeInTheDocument();
    });

    it('export button disabled when no program, enabled when TMs present and performs local export', async () => {
        // Initial render without TMs
        renderStep4();
        const exportBtnDisabled = screen.getByTestId('export-json');
        expect(exportBtnDisabled).toBeDisabled();

        // Prepare builder state with TMs via localStorage before new render
        localStorage.setItem('ph531.builder.ui.state', JSON.stringify({
            step1: {
                units: 'lb', tmPct: 0.9, microplates: false, rounding: 5,
                inputs: { press: {}, deadlift: {}, bench: {}, squat: {} },
                tmTable: { press: 100, deadlift: 300, bench: 200, squat: 250 }
            },
            step2: {},
            step3: { scheduleFrequency: 4, deload: true }
        }));

        cleanup();
        renderStep4();
        const exportBtn = screen.getByTestId('export-json');
        expect(exportBtn).not.toBeDisabled();
        fireEvent.click(exportBtn);
        // Wait for last export time to appear (indicates export completed) - be more flexible with timeout
        await waitFor(() => {
            expect(screen.getByText(/Last Export:/i)).toBeInTheDocument();
        }, { timeout: 5000 });
    });
});
