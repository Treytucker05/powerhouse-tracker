import { render } from '@testing-library/react';
import { BuilderStateProvider } from '@/context/BuilderState';
import { describe, it, expect } from 'vitest';
import ProgramFundamentals from './ProgramFundamentals';

describe('ProgramFundamentals smoke test', () => {
    it('renders without crashing', () => {
        expect(() => {
            render(<BuilderStateProvider><ProgramFundamentals /></BuilderStateProvider>);
        }).not.toThrow();
    });
});
