import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HashRouter } from 'react-router-dom';
import TemplateAndScheme from '../TemplateAndScheme';
import { BuilderStateProvider } from '@/context/BuilderState';

function renderStep2() {
    return render(
        <HashRouter>
            <BuilderStateProvider>
                <TemplateAndScheme />
            </BuilderStateProvider>
        </HashRouter>
    );
}

describe('TemplateAndScheme (Step 2)', () => {
    it('renders template and scheme cards', () => {
        renderStep2();
        expect(screen.getByText(/Template & Core Scheme/i)).toBeInTheDocument();
        expect(screen.getByTestId('template-bbb')).toBeInTheDocument();
        expect(screen.getByTestId('scheme-scheme_531')).toBeInTheDocument();
    });

    it('Next disabled until both selected', () => {
        renderStep2();
        const nextButtons = screen.getAllByTestId('step2-next');
        expect(nextButtons[0]).toBeDisabled();
        const template = screen.getAllByTestId('template-bbb')[0];
        fireEvent.click(template);
        expect(nextButtons[0]).toBeDisabled();
        const scheme = screen.getAllByTestId('scheme-scheme_531')[0];
        fireEvent.click(scheme);
        expect(nextButtons[0]).not.toBeDisabled();
    });
});
