import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';

// Helper to get link element by partial label (exact text node may include icon spacing)
function getLink(label) {
    return screen.getAllByText(new RegExp(label, 'i'))
        .map(n => n.closest('a'))
        .find(a => a);
}

describe('TopNav', () => {
    it('renders key navigation links', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <TopNav />
            </MemoryRouter>
        );
        expect(getLink('Dashboard')).toBeTruthy();
        expect(getLink('Program Design')).toBeTruthy();
        expect(getLink('Tracking')).toBeTruthy();
    });

    it('marks dashboard link active on root route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <TopNav />
            </MemoryRouter>
        );
        const dash = getLink('Dashboard');
        expect(dash).toBeTruthy();
        expect(dash.className).toMatch(/bg-red-600/);
    });
});
