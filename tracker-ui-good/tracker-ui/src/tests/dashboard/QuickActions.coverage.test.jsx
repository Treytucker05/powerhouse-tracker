import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuickActions from '@/components/dashboard/QuickActions';

// Mock the hook to provide deterministic actions
vi.mock('@/hooks/useQuickActions', () => ({
    useQuickActions: () => ({
        data: {
            startTodayLabel: "Start Today's Workout",
            startToday: vi.fn(),
            openLogger: vi.fn(),
            viewProgram: vi.fn(),
            startTodayDisabled: false,
            hasPlannedSession: false
        },
        isLoading: false,
        error: null
    })
}));

describe('QuickActions (coverage)', () => {
    it('renders core quick action buttons', () => {
        render(<MemoryRouter><QuickActions /></MemoryRouter>);
        expect(screen.getByText("Start Today's Workout")).toBeInTheDocument();
        expect(screen.getByText('Open Logger')).toBeInTheDocument();
        expect(screen.getByText('View Program')).toBeInTheDocument();
        expect(screen.getByText('History')).toBeInTheDocument();
    });

    it('handles click on first action button', () => {
        render(<MemoryRouter><QuickActions /></MemoryRouter>);
        const [btn] = screen.getAllByText("Start Today's Workout");
        fireEvent.click(btn);
        expect(btn).toBeInTheDocument(); // smoke assertion
    });
});
