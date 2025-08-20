import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HashRouter } from 'react-router-dom';
import ProgramFundamentals from '../ProgramFundamentals';
import { BuilderStateProvider } from '@/context/BuilderState';

function renderStep1() {
    return render(
        <HashRouter>
            <BuilderStateProvider>
                <ProgramFundamentals />
            </BuilderStateProvider>
        </HashRouter>
    );
}

describe('ProgramFundamentals (Step 1)', () => {
    it('renders inputs and TM table', () => {
        renderStep1();
        // Header expectation
        expect(screen.getByText(/Program Fundamentals/i)).toBeInTheDocument();
        // Lift cards placeholder fields
        ['press', 'bench', 'squat', 'deadlift'].forEach(lift => {
            // pick first occurrence matching lift token
            const matches = screen.getAllByText(new RegExp(lift, 'i'));
            expect(matches.length).toBeGreaterThan(0);
        });
        // Verify TM percent column header present
        expect(screen.getByText(/TM 90%/i)).toBeInTheDocument();
    });

    it('Next button disabled initially', () => {
        renderStep1();
        const nextButtons = screen.getAllByTestId('step1-next');
        expect(nextButtons[0]).toBeDisabled();
    });
});
