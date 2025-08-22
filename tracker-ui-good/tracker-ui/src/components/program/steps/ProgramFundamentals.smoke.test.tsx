import { render } from '@testing-library/react';
import { BuilderStateProvider } from '@/context/BuilderState';
import { describe, it, expect } from 'vitest';
import ProgramFundamentals from './ProgramFundamentals';
import { HashRouter } from 'react-router-dom';

describe('ProgramFundamentals smoke test', () => {
    it('renders without crashing', () => {
        expect(() => {
            render(<HashRouter><BuilderStateProvider><ProgramFundamentals /></BuilderStateProvider></HashRouter>);
        }).not.toThrow();
    });
});
