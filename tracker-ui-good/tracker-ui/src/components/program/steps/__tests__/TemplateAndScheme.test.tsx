import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HashRouter } from 'react-router-dom';
import TemplateAndScheme from '../TemplateAndScheme';
import { BuilderStateProvider } from '@/context/BuilderState';
import * as supabaseModule from '@/lib/supabaseClient';

// Mock Supabase
vi.mock('@/lib/supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    eq: vi.fn(() => ({
                        single: vi.fn().mockResolvedValue({ data: null, error: null })
                    }))
                }))
            }))
        }))
    },
    getCurrentUserId: vi.fn().mockResolvedValue('test-user-id')
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

function renderStep2() {
    return render(
        <HashRouter>
            <BuilderStateProvider>
                <TemplateAndScheme />
            </BuilderStateProvider>
        </HashRouter>
    );
}

describe('TemplateAndScheme (Step 2)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Clear any existing elements
        document.body.innerHTML = '';
    });

    const renderStep2Isolated = () => {
        const result = render(
            <BuilderStateProvider>
                <HashRouter>
                    <TemplateAndScheme />
                </HashRouter>
            </BuilderStateProvider>
        );
        container = result.container;
        return result;
    };

    describe('Basic Functionality', () => {
        it('renders the Step 2 page correctly', () => {
            renderStep2Isolated();
            expect(within(container).getByText(/Select Template/i)).toBeInTheDocument();
            expect(within(container).getByTestId('step2-container')).toBeInTheDocument();
        });

        it('renders all available templates', () => {
            renderStep2Isolated();
            expect(within(container).getByTestId('template-bbb')).toBeInTheDocument();
            expect(within(container).getByTestId('template-triumvirate')).toBeInTheDocument();
            expect(within(container).getByTestId('template-periodization_bible')).toBeInTheDocument();
            expect(within(container).getByTestId('template-bodyweight')).toBeInTheDocument();
            expect(within(container).getByTestId('template-jackshit')).toBeInTheDocument();
        });

        it('Next button disabled until template selected', async () => {
            renderStep2Isolated();
            const nextBtn = within(container).getByTestId('step2-next');
            expect(nextBtn).toBeDisabled();

            // Expand template
            fireEvent.click(within(container).getByTestId('template-bbb'));

            // Select template via details panel
            await waitFor(() => {
                const useButton = within(container).getByText('Use This Template');
                fireEvent.click(useButton);
            });

            // Now Next button should be enabled
            await waitFor(() => expect(nextBtn).not.toBeDisabled());
        });

        it('displays template metadata', () => {
            renderStep2Isolated();
            // Check that BBB template shows time and difficulty metadata
            const bbbTemplate = within(container).getByTestId('template-bbb');
            expect(within(bbbTemplate).getByText(/60–75m sessions/)).toBeInTheDocument(); // BBB time
            expect(within(bbbTemplate).getByText(/Diff: Intermediate/)).toBeInTheDocument(); // BBB difficulty
        });
    });

    describe('Template Selection', () => {
        it('allows template expansion and shows visual feedback', async () => {
            renderStep2Isolated();

            const bbbTemplate = within(container).getByTestId('template-bbb');
            expect(bbbTemplate).not.toHaveClass('border-indigo-500');

            // Click to expand (not select)
            fireEvent.click(bbbTemplate);

            await waitFor(() => {
                expect(bbbTemplate).toHaveClass('border-indigo-500');
                expect(within(container).getByText('Viewing')).toBeInTheDocument();
            });
        });

        it('allows template selection via details panel', async () => {
            renderStep2Isolated();

            // Initially shows no template selected
            const summary = within(container).getByTestId('selection-summary');
            expect(summary).toHaveTextContent('Template: —');

            // Expand template first
            fireEvent.click(within(container).getByTestId('template-bbb'));

            // Then select it via the details panel button
            await waitFor(() => {
                const useButton = within(container).getByText('Use This Template');
                fireEvent.click(useButton);
            });

            // Check template is selected and summary updates 
            await waitFor(() => {
                const bbbTemplate = within(container).getByTestId('template-bbb');
                expect(bbbTemplate).toHaveClass('border-red-500');
                // Check for "Selected" within the template card specifically
                expect(within(bbbTemplate).getByText('Selected')).toBeInTheDocument();
                expect(summary).toHaveTextContent('Template: bbb');
            });
        });
    });

    describe('Template Details', () => {
        it('shows template details panel when clicked', async () => {
            renderStep2Isolated();

            const triumvirateTemplate = within(container).getByTestId('template-triumvirate');
            fireEvent.click(triumvirateTemplate);

            await waitFor(() => {
                const detailsPanel = within(container).getByTestId('template-details-panel');
                expect(detailsPanel).toHaveTextContent('Triumvirate');
            });
        });

        it('shows Close button in details panel', async () => {
            renderStep2Isolated();

            // Click to expand template details
            fireEvent.click(within(container).getByTestId('template-triumvirate'));

            await waitFor(() => {
                expect(within(container).getByText('Close')).toBeInTheDocument();
            });
        });
    });

    describe('State Persistence', () => {
        it('template selection updates component state', async () => {
            renderStep2Isolated();

            // Expand template
            fireEvent.click(within(container).getByTestId('template-bbb'));

            // Select template via details panel
            await waitFor(() => {
                const useButton = within(container).getByText('Use This Template');
                fireEvent.click(useButton);
            });

            // Verify the state change is reflected in the UI
            await waitFor(() => {
                const summary = within(container).getByTestId('selection-summary');
                expect(summary).toHaveTextContent('Template: bbb');
                const bbbTemplate = within(container).getByTestId('template-bbb');
                expect(bbbTemplate).toHaveClass('border-red-500');
            });
        });
    });

    describe('Navigation', () => {
        it('has navigation buttons', () => {
            renderStep2Isolated();
            expect(within(container).getAllByText('Back')).toHaveLength(1);
            expect(within(container).getByTestId('step2-next')).toBeInTheDocument();
        });

        it('shows correct selection summary format', () => {
            renderStep2Isolated();
            const summary = within(container).getByTestId('selection-summary');
            expect(summary).toHaveTextContent('Scheme: (choose next step)');
        });
    });

    describe('Template Filtering & Search', () => {
        it('renders search and filter controls', () => {
            renderStep2Isolated();
            expect(within(container).getByTestId('template-search')).toBeInTheDocument();
            expect(within(container).getByTestId('difficulty-filter')).toBeInTheDocument();
            expect(within(container).getByTestId('focus-filter')).toBeInTheDocument();
        });

        it('shows all templates initially', () => {
            renderStep2Isolated();
            expect(within(container).getByText('Showing 5 of 5 templates')).toBeInTheDocument();
            expect(within(container).getByTestId('template-bbb')).toBeInTheDocument();
            expect(within(container).getByTestId('template-triumvirate')).toBeInTheDocument();
            expect(within(container).getByTestId('template-periodization_bible')).toBeInTheDocument();
            expect(within(container).getByTestId('template-bodyweight')).toBeInTheDocument();
            expect(within(container).getByTestId('template-jackshit')).toBeInTheDocument();
        });

        it('filters templates by search query', async () => {
            renderStep2Isolated();

            const searchInput = within(container).getByTestId('template-search');
            fireEvent.change(searchInput, { target: { value: 'boring' } });

            await waitFor(() => {
                expect(within(container).getByText('Showing 1 of 5 templates')).toBeInTheDocument();
                expect(within(container).getByTestId('template-bbb')).toBeInTheDocument();
                expect(within(container).queryByTestId('template-triumvirate')).not.toBeInTheDocument();
            });
        });

        it('filters templates by difficulty', async () => {
            renderStep2Isolated();

            const difficultyFilter = within(container).getByTestId('difficulty-filter');
            fireEvent.change(difficultyFilter, { target: { value: 'Beginner' } });

            await waitFor(() => {
                expect(within(container).getByText('Showing 1 of 5 templates')).toBeInTheDocument();
                expect(within(container).getByTestId('template-triumvirate')).toBeInTheDocument();
                expect(within(container).queryByTestId('template-bbb')).not.toBeInTheDocument();
            });
        });

        it('filters templates by focus area', async () => {
            renderStep2Isolated();

            const focusFilter = within(container).getByTestId('focus-filter');
            fireEvent.change(focusFilter, { target: { value: 'Strength' } });

            await waitFor(() => {
                expect(within(container).getByText(/Showing .+ of 5 templates/)).toBeInTheDocument();
                expect(within(container).getByTestId('template-triumvirate')).toBeInTheDocument();
                // BBB might not be visible since it focuses on 'Hypertrophy Volume'
            });
        });

        it('shows clear filters button when filters are active', async () => {
            renderStep2Isolated();

            const searchInput = within(container).getByTestId('template-search');
            fireEvent.change(searchInput, { target: { value: 'test' } });

            await waitFor(() => {
                expect(within(container).getByTestId('clear-filters')).toBeInTheDocument();
            });
        });

        it('clears all filters when clear button clicked', async () => {
            renderStep2Isolated();

            // Set multiple filters
            const searchInput = within(container).getByTestId('template-search');
            const difficultyFilter = within(container).getByTestId('difficulty-filter');

            fireEvent.change(searchInput, { target: { value: 'test' } });
            fireEvent.change(difficultyFilter, { target: { value: 'Beginner' } });

            await waitFor(() => {
                expect(within(container).getByTestId('clear-filters')).toBeInTheDocument();
            });

            // Clear filters
            fireEvent.click(within(container).getByTestId('clear-filters'));

            await waitFor(() => {
                expect(searchInput).toHaveValue('');
                expect(difficultyFilter).toHaveValue('');
                expect(within(container).getByText('Showing 5 of 5 templates')).toBeInTheDocument();
                expect(within(container).queryByTestId('clear-filters')).not.toBeInTheDocument();
            });
        });

        it('shows no templates found message when no matches', async () => {
            renderStep2Isolated();

            const searchInput = within(container).getByTestId('template-search');
            fireEvent.change(searchInput, { target: { value: 'nonexistent template' } });

            await waitFor(() => {
                expect(within(container).getByTestId('no-templates-found')).toBeInTheDocument();
                expect(within(container).getByText('🔍 No templates found')).toBeInTheDocument();
                expect(within(container).getByText('Showing 0 of 5 templates')).toBeInTheDocument();
            });
        });

        it('shows filter criteria in results summary', async () => {
            renderStep2Isolated();

            const searchInput = within(container).getByTestId('template-search');
            fireEvent.change(searchInput, { target: { value: 'boring' } });

            await waitFor(() => {
                expect(within(container).getByText(/Search: "boring"/)).toBeInTheDocument();
            });
        });
    });

    describe('Template Comparison', () => {
        it('renders compare mode toggle button', () => {
            renderStep2Isolated();
            expect(within(container).getByTestId('compare-mode-toggle')).toBeInTheDocument();
            expect(within(container).getByText('📊 Compare Templates')).toBeInTheDocument();
        });

        it('toggles compare mode when button clicked', async () => {
            renderStep2Isolated();

            const toggleButton = within(container).getByTestId('compare-mode-toggle');
            fireEvent.click(toggleButton);

            await waitFor(() => {
                expect(within(container).getByTestId('compare-mode-info')).toBeInTheDocument();
                expect(within(container).getByText('📊 Exit Compare')).toBeInTheDocument();
                expect(within(container).getByText('Compare Mode Active')).toBeInTheDocument();
            });
        });

        it('shows comparison counter in compare mode', async () => {
            renderStep2Isolated();

            // Enter compare mode
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));

            await waitFor(() => {
                expect(within(container).getByText(/\(0\/3 selected\)/)).toBeInTheDocument();
            });
        });

        it('adds templates to comparison when clicked in compare mode', async () => {
            renderStep2Isolated();

            // Enter compare mode
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));

            // Add template to comparison
            fireEvent.click(within(container).getByTestId('template-bbb'));

            await waitFor(() => {
                const bbbTemplate = within(container).getByTestId('template-bbb');
                expect(bbbTemplate).toHaveClass('border-blue-500');
                expect(within(bbbTemplate).getByText('Compare')).toBeInTheDocument();
                expect(within(container).getByText(/\(1\/3 selected\)/)).toBeInTheDocument();
            });
        });

        it('removes templates from comparison when clicked again', async () => {
            renderStep2Isolated();

            // Enter compare mode and add template
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));
            fireEvent.click(within(container).getByTestId('template-bbb'));

            await waitFor(() => {
                expect(within(container).getByText(/\(1\/3 selected\)/)).toBeInTheDocument();
            });

            // Remove template
            fireEvent.click(within(container).getByTestId('template-bbb'));

            await waitFor(() => {
                const bbbTemplate = within(container).getByTestId('template-bbb');
                expect(bbbTemplate).not.toHaveClass('border-blue-500');
                expect(within(container).getByText(/\(0\/3 selected\)/)).toBeInTheDocument();
            });
        });

        it('limits comparison to 3 templates maximum', async () => {
            renderStep2Isolated();

            // Enter compare mode
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));

            // Add 3 templates
            fireEvent.click(within(container).getByTestId('template-bbb'));
            fireEvent.click(within(container).getByTestId('template-triumvirate'));
            fireEvent.click(within(container).getByTestId('template-bodyweight'));

            await waitFor(() => {
                expect(within(container).getByText(/\(3\/3 selected\)/)).toBeInTheDocument();
                // 4th template should be disabled
                const jackshitTemplate = within(container).getByTestId('template-jackshit');
                expect(jackshitTemplate).toBeDisabled();
                expect(jackshitTemplate).toHaveClass('opacity-50');
            });
        });

        it('shows comparison table when templates are selected', async () => {
            renderStep2Isolated();

            // Enter compare mode and add templates
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));
            fireEvent.click(within(container).getByTestId('template-bbb'));
            fireEvent.click(within(container).getByTestId('template-triumvirate'));

            await waitFor(() => {
                expect(within(container).getByTestId('comparison-table')).toBeInTheDocument();
                expect(within(container).getByText('Template Comparison')).toBeInTheDocument();
            });
        });

        it('shows empty state when no templates are compared', async () => {
            renderStep2Isolated();

            // Enter compare mode
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));

            await waitFor(() => {
                expect(within(container).getByTestId('comparison-empty')).toBeInTheDocument();
                expect(within(container).getByText('📊 Template Comparison')).toBeInTheDocument();
                expect(within(container).getByText('Click on template cards to add them to comparison (max 3)')).toBeInTheDocument();
            });
        });

        it('allows template selection from comparison table', async () => {
            renderStep2Isolated();

            // Enter compare mode and add template
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));
            fireEvent.click(within(container).getByTestId('template-bbb'));

            // Find and click Select button in comparison table
            await waitFor(() => {
                const selectButtons = within(container).getAllByText('Select');
                fireEvent.click(selectButtons[0]); // First Select button
            });

            // Check that template is selected (summary should update)
            await waitFor(() => {
                const summary = within(container).getByTestId('selection-summary');
                expect(summary).toHaveTextContent('Template: bbb');
            });
        });

        it('clears comparison when exiting compare mode', async () => {
            renderStep2Isolated();

            // Enter compare mode and add templates
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));
            fireEvent.click(within(container).getByTestId('template-bbb'));

            await waitFor(() => {
                expect(within(container).getByText(/\(1\/3 selected\)/)).toBeInTheDocument();
            });

            // Exit compare mode
            fireEvent.click(within(container).getByTestId('compare-mode-toggle'));

            await waitFor(() => {
                expect(within(container).queryByTestId('compare-mode-info')).not.toBeInTheDocument();
                expect(within(container).getByText('📊 Compare Templates')).toBeInTheDocument();
                // Template should not have compare border anymore
                const bbbTemplate = within(container).getByTestId('template-bbb');
                expect(bbbTemplate).not.toHaveClass('border-blue-500');
            });
        });
    });
});
