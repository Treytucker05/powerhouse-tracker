import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import ProgramFundamentals from '../ProgramFundamentals';
import { BuilderStateProvider } from '@/context/BuilderState';

describe('ProgramFundamentals', () => {
    it('renders headings and inputs', () => {
        render(<BuilderStateProvider><ProgramFundamentals /></BuilderStateProvider>);
        expect(screen.getByText(/Program Fundamentals/i)).toBeInTheDocument();
        // Use getAllByText to avoid multiple match error and assert at least one appears
        expect(screen.getAllByText(/Training Max/i).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0);
    });
});
