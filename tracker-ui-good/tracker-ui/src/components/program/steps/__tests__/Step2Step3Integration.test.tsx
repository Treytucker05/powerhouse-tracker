import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import React from 'react';
import { BuilderStateProvider } from '@/context/BuilderState';
import DesignCustomize from '../DesignCustomize';

// Mock the supabase client
vi.mock('@/lib/supabaseClient', () => ({
    supabase: {
        from: () => ({
            select: () => ({
                eq: () => ({
                    eq: () => ({
                        single: () => Promise.resolve({ data: null })
                    })
                })
            }),
            upsert: () => Promise.resolve()
        })
    },
    getCurrentUserId: () => Promise.resolve('test-user-id')
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

const renderStep3 = () => {
    return render(
        <HashRouter>
            <BuilderStateProvider>
                <DesignCustomize />
            </BuilderStateProvider>
        </HashRouter>
    );
};

describe('Step 3 Template Integration UI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        document.body.innerHTML = '';
    });

    it('should render Step 3 page correctly', async () => {
        renderStep3();

        await waitFor(() => {
            expect(screen.getByTestId('step3-container')).toBeInTheDocument();
        });

        // Should show main heading (allow prefix like "Step 3 ·")
        expect(screen.getByRole('heading', { level: 1, name: /Step 3 · Customize/i })).toBeInTheDocument();

        // Should show main controls
        expect(screen.getByText('Use Template Defaults (lock)')).toBeInTheDocument();
        expect(screen.getByText('Apply Now')).toBeInTheDocument();
    });

    it('should show schedule editor', async () => {
        renderStep3();

        await waitFor(() => {
            expect(screen.getByTestId('step3-container')).toBeInTheDocument();
        });

        // Should show schedule section
        expect(screen.getByTestId('schedule-editor')).toBeInTheDocument();
        expect(screen.getByText('Schedule')).toBeInTheDocument();

        // Should show schedule frequency buttons
        expect(screen.getByTestId('schedule-btn-2')).toBeInTheDocument();
        expect(screen.getByTestId('schedule-btn-3')).toBeInTheDocument();
        expect(screen.getByTestId('schedule-btn-4')).toBeInTheDocument();
    });

    it('should show warmup controls', async () => {
        renderStep3();

        await waitFor(() => {
            expect(screen.getByTestId('step3-container')).toBeInTheDocument();
        });

        // Should show warmup section
        expect(screen.getByTestId('warmup-chooser')).toBeInTheDocument();
        expect(screen.getByText('Warm-ups')).toBeInTheDocument();
        expect(screen.getByText('Enable Warm-ups')).toBeInTheDocument();
    });

    it('should show supplemental and assistance sections', async () => {
        renderStep3();

        await waitFor(() => {
            expect(screen.getByTestId('step3-container')).toBeInTheDocument();
        });

        // Should show supplemental section
        expect(screen.getByTestId('supplemental-picker')).toBeInTheDocument();
        expect(screen.getByText('Supplemental')).toBeInTheDocument();

        // Should show assistance section
        expect(screen.getByTestId('assistance-picker')).toBeInTheDocument();
        expect(screen.getByText('Assistance')).toBeInTheDocument();
    });

    it('should allow schedule frequency changes', async () => {
        renderStep3();

        await waitFor(() => {
            expect(screen.getByTestId('step3-container')).toBeInTheDocument();
        });

        // Should be able to click schedule buttons
        const schedule3Button = screen.getByTestId('schedule-btn-3');
        fireEvent.click(schedule3Button);

        // Should still be on the page (basic click functionality test)
        expect(screen.getByTestId('step3-container')).toBeInTheDocument();
    });

    it('should handle Apply Now button when no template selected', async () => {
        renderStep3();

        await waitFor(() => {
            expect(screen.getByTestId('step3-container')).toBeInTheDocument();
        });

        // Apply Now button should be disabled when no template
        const applyButton = screen.getByText('Apply Now');
        expect(applyButton).toBeDisabled();
    });
});
