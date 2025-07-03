import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders, createTestQueryClient } from './test-utils';

// Simple smoke test that should run in under 1 second
describe('Test Infrastructure', () => {
    it('should have working test environment', () => {
        const div = document.createElement('div');
        div.textContent = 'Hello Test';
        expect(div.textContent).toBe('Hello Test');
    });

    it('should have renderWithProviders available', () => {
        expect(typeof renderWithProviders).toBe('function');
        expect(typeof createTestQueryClient).toBe('function');
    });

    it('should render a simple React component', () => {
        const TestComponent = () => <div>Test Component</div>;

        const { container } = renderWithProviders(<TestComponent />);

        expect(container.textContent).toContain('Test Component');
    });
});
