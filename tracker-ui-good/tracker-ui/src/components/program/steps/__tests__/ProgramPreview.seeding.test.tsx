import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProgramPreview from '../ProgramPreview';
import { BuilderStateProvider } from '@/context/BuilderState';

function seedBuilderLS() {
    const state = {
        step1: {
            units: 'lb', tmPct: 0.9, microplates: false, rounding: 5,
            inputs: { press: {}, deadlift: {}, bench: {}, squat: {} },
            tmTable: { press: 150, deadlift: 315, bench: 225, squat: 275 },
            variants: { press: 'overhead_press', bench: 'bench_press', squat: 'back_squat', deadlift: 'conventional_deadlift' }
        },
        step2: { templateId: 'triumvirate', schemeId: 'scheme_531' },
        step3: { scheduleFrequency: 4, warmupsEnabled: true, warmupScheme: 'standard', supplemental: 'bbb', mainSetOption: 1, deload: true }
    };
    window.localStorage.setItem('ph531.builder.ui.state', JSON.stringify(state));
}

describe('ProgramPreview seeds ProgramV2 snapshot', () => {
    beforeEach(() => {
        window.localStorage.clear();
        seedBuilderLS();
    });

    it('writes ph_program_v2 to localStorage on mount', () => {
        render(
            <MemoryRouter initialEntries={["/build/step4"]}>
                <BuilderStateProvider>
                    <ProgramPreview />
                </BuilderStateProvider>
            </MemoryRouter>
        );
        // Smoke-select the root to ensure render occurred
        expect(screen.getByTestId('step4-preview-root')).toBeInTheDocument();
        const raw = window.localStorage.getItem('ph_program_v2');
        expect(raw).toBeTruthy();
        const parsed = JSON.parse(raw!);
        expect(parsed?.trainingMaxes?.press).toBe(150);
        expect(parsed?.schedule?.schemeId).toBe('scheme_531');
        expect(parsed?.template).toBe('triumvirate');
    });
});
