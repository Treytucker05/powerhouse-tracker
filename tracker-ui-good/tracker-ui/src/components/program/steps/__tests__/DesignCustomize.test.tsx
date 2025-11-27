import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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

describe('DesignCustomize (Step 3)', () => {
    it('renders key section test IDs', () => {
        renderStep3();
        expect(screen.getByTestId('schedule-editor')).toBeInTheDocument();
        expect(screen.getByTestId('warmup-chooser')).toBeInTheDocument();
        expect(screen.getByTestId('deload-toggle')).toBeInTheDocument();
        expect(screen.getByTestId('supplemental-picker')).toBeInTheDocument();
        expect(screen.getByTestId('assistance-picker')).toBeInTheDocument();
        expect(screen.getByTestId('conditioning-planner')).toBeInTheDocument();
    });
});
