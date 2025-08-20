import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import QuickActions from '../QuickActions.jsx';
import { useQuickActions } from '@/hooks/useQuickActions';

// Mock hook & icons
vi.mock('@/hooks/useQuickActions', () => ({ useQuickActions: vi.fn() }));
vi.mock('lucide-react', () => ({ History: (props) => <svg data-testid="hist-icon" {...props} /> }));
// Mock router navigate hook once so we can inspect calls without redefining
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock, MemoryRouter: actual.MemoryRouter };
});

describe('QuickActions additional branches', () => {
    const baseActions = () => ({
        startTodayLabel: 'Start Custom',
        startTodayDisabled: false,
        openLoggerDisabled: false,
        viewProgramDisabled: true,
        hasPlannedSession: true,
        todaySession: { name: 'Bench Focus' },
        sessionCompleted: false,
        startToday: vi.fn(),
        openLogger: vi.fn(),
        viewProgram: vi.fn()
    });

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    function mockActions(overrides = {}) {
        const actions = { ...baseActions(), ...overrides };
        vi.mocked(useQuickActions).mockReturnValue({ data: actions, isLoading: false, error: null });
        return actions;
    }

    it('renders planned session banner and primary button enabled', () => {
        mockActions();
        const { getByText } = render(<QuickActions />);
        expect(getByText("Today's Session: Bench Focus")).toBeTruthy();
        expect(getByText('Start Custom')).toBeTruthy();
    });

    it('disables primary button when startTodayDisabled', () => {
        mockActions({ startTodayDisabled: true });
        const { getAllByText } = render(<QuickActions />);
        const btn = getAllByText('Start Custom')[0].closest('button');
        expect(btn.disabled).toBe(true);
    });

    it('shows completed session state', () => {
        mockActions({ sessionCompleted: true });
        const { getByText } = render(<QuickActions />);
        expect(getByText('Completed ✓')).toBeTruthy();
    });

    it('navigates when History clicked', () => {
        mockActions();
        const { getByText } = render(<QuickActions />);
        fireEvent.click(getByText('History'));
        expect(navigateMock).toHaveBeenCalledWith('/history');
    });
});
