import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutPreview } from '../WorkoutPreview';

describe('WorkoutPreview Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Clear any existing DOM content
        document.body.innerHTML = '';
    });

    it('should not render when expanded is false', () => {
        const { container } = render(<WorkoutPreview templateId="bbb" expanded={false} />);
        expect(container.firstChild).toBeNull();
    });

    it('should not render when templateId is invalid', () => {
        const { container } = render(<WorkoutPreview templateId="invalid" expanded={true} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render template preview when expanded is true', () => {
        render(<WorkoutPreview templateId="bbb" expanded={true} />);

        expect(screen.getByText('Template Preview')).toBeInTheDocument();
        expect(screen.getByText(/Sample TMs:/)).toBeInTheDocument();
        expect(screen.getByText('Quick Overview')).toBeInTheDocument();
    });

    it('should show quick overview by default without detailed guide', () => {
        render(<WorkoutPreview templateId="bbb" expanded={true} />);

        expect(screen.getByText('Quick Overview')).toBeInTheDocument();
        expect(screen.getByText('Training Days')).toBeInTheDocument();
        expect(screen.getByText('Focus')).toBeInTheDocument();
        expect(screen.getByText('Show Detailed Guide')).toBeInTheDocument();

        // Should NOT show detailed content initially
        expect(screen.queryByText('Template Overview')).not.toBeInTheDocument();
        expect(screen.queryByText('Workout Breakdown')).not.toBeInTheDocument();
    });

    it('should show detailed guide when button is clicked', () => {
        render(<WorkoutPreview templateId="bbb" expanded={true} />);

        // Should show "Show Detailed Guide" button initially
        const toggleButton = screen.getByText('Show Detailed Guide');
        expect(toggleButton).toBeInTheDocument();

        // Click to show detailed guide
        fireEvent.click(toggleButton);

        // Should now show detailed tabs and content
        expect(screen.getByText('Template Overview')).toBeInTheDocument();
        expect(screen.getByText('Workout Breakdown')).toBeInTheDocument();
        expect(screen.getByText('4-Week Progression')).toBeInTheDocument();
        expect(screen.getByText('Weekly Schedule')).toBeInTheDocument();

        // Button text should change
        expect(screen.getByText('Hide Detailed Guide')).toBeInTheDocument();
        expect(screen.queryByText('Show Detailed Guide')).not.toBeInTheDocument();
    });

    it('should render different templates correctly', () => {
        // Test triumvirate template
        const { unmount } = render(<WorkoutPreview templateId="triumvirate" expanded={true} />);
        expect(screen.getByText('Template Preview')).toBeInTheDocument();
        unmount();

        // Test BBB template
        render(<WorkoutPreview templateId="bbb" expanded={true} />);
        expect(screen.getByText('Template Preview')).toBeInTheDocument();
    });

    it('should show template-specific content when detailed guide is opened', () => {
        render(<WorkoutPreview templateId="bbb" expanded={true} />);

        // Click to show detailed guide
        const toggleButton = screen.getByText('Show Detailed Guide');
        fireEvent.click(toggleButton);

        // Should show BBB-specific content (Template Overview is selected by default)
        expect(screen.getByText('Boring But Big (BBB)')).toBeInTheDocument();
        expect(screen.getByText('Philosophy:')).toBeInTheDocument();
        expect(screen.getByText(/building muscle mass through high-volume/)).toBeInTheDocument();
    });

    it('should render important note for BBB template', () => {
        render(<WorkoutPreview templateId="bbb" expanded={true} />);

        // BBB template has an important note at the bottom (always visible)
        expect(screen.getByText('Important Note:')).toBeInTheDocument();
        expect(screen.getByText(/High volume/)).toBeInTheDocument();
    });

    it('should switch between tabs when clicked', () => {
        render(<WorkoutPreview templateId="bbb" expanded={true} />);

        // Show detailed guide first
        const toggleButton = screen.getByText('Show Detailed Guide');
        fireEvent.click(toggleButton);

        // Click on Workout Breakdown tab
        const workoutTab = screen.getByText('Workout Breakdown');
        fireEvent.click(workoutTab);

        // Should show workout breakdown content
        expect(workoutTab).toHaveClass('border-blue-500');
        expect(screen.getByText(/Detailed Workout Breakdown/)).toBeInTheDocument();

        // Click on 4-Week Progression tab
        const progressionTab = screen.getByText('4-Week Progression');
        fireEvent.click(progressionTab);

        // Should show progression content
        expect(progressionTab).toHaveClass('border-blue-500');
        expect(screen.getByText('4-Week Cycle Progression')).toBeInTheDocument();
    });

    it('should show quick overview stats', () => {
        render(<WorkoutPreview templateId="bbb" expanded={true} />);

        // Should show quick overview cards
        expect(screen.getByText('Training Days')).toBeInTheDocument();
        expect(screen.getByText('4 days/week')).toBeInTheDocument();
        expect(screen.getByText('Focus')).toBeInTheDocument();
        expect(screen.getByText('Hypertrophy Volume')).toBeInTheDocument();
    });
});
