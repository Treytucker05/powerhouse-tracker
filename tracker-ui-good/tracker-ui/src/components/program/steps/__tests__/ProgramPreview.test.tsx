import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
    it('renders week tabs and day cards', () => {
        renderStep4();
        expect(screen.getByTestId('week-tabs')).toBeInTheDocument();
        // Default active week 1 day 1 card
        expect(screen.getByTestId('day-card-1-1')).toBeInTheDocument();
    });

    it('switches active week when tab clicked', () => {
        renderStep4();
        const week2Buttons = screen.getAllByTestId('week-tab-2');
        fireEvent.click(week2Buttons[0]);
        expect(screen.getByTestId('day-card-2-1')).toBeInTheDocument();
    });
});
