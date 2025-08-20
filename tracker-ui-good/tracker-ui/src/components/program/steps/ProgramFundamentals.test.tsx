import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgramFundamentals from './ProgramFundamentals';
import { BuilderStateProvider } from '@/context/BuilderState';

describe('ProgramFundamentals', () => {
    it('renders headings and empty TM table initially', () => {
        render(<BuilderStateProvider><ProgramFundamentals /></BuilderStateProvider>);
        expect(screen.getByText(/Program Fundamentals/i)).toBeInTheDocument();
        // Two occurrences: label strong + helper hint
        expect(screen.getAllByText(/Training Max/i).length).toBeGreaterThan(0);
        // Table shows warnings for zeros (no '—' because zeros render then warning)
        expect(screen.getAllByText(/TM must be/).length).toBe(4);
    });

    it('computes TM after entering tested 1RM', () => {
        render(<BuilderStateProvider><ProgramFundamentals /></BuilderStateProvider>);
        const inputs = screen.getAllByRole('spinbutton');
        // assume first input corresponds to press 1RM tested
        fireEvent.change(inputs[0], { target: { value: '150' } });
        // TM = 150 * 0.9 = 135 (can appear in table & side rail)
        expect(screen.getAllByText('135').length).toBeGreaterThan(0);
    });

    it('switching units adjusts rounding microplate toggle meaning', () => {
        render(<BuilderStateProvider><ProgramFundamentals /></BuilderStateProvider>);
        // toggle units to kg
        const kgPills = screen.getAllByText('KG');
        fireEvent.click(kgPills[0]);
        // enter value and expect kg rounding with default 2.5 increment (since we converted increment when switching)
        const inputs = screen.getAllByRole('spinbutton');
        fireEvent.change(inputs[0], { target: { value: '100' } });
        // TM 90% = 90 -> nearest 2.5 = 90 (can appear multiple places)
        expect(screen.getAllByText('90').length).toBeGreaterThan(0);
    });
});
