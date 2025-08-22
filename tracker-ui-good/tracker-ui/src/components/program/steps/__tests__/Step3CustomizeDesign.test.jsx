import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Step3CustomizeDesign from '../Step3CustomizeDesign.jsx';

function setup(initial) {
    const updates = [];
    const updateData = (partial) => updates.push(partial);
    render(<Step3CustomizeDesign data={initial} updateData={updateData} />);
    return { updates };
}

// Minimal base data (merged with component DEFAULT_DESIGN). Unlock by default for interaction tests.
const baseData = { design: { locked: false } };

describe('Step3CustomizeDesign', () => {
    it('renders all required section test IDs', () => {
        setup();
        ['schedule-editor', 'warmup-chooser', 'deload-toggle', 'supplemental-picker', 'assistance-picker', 'conditioning-planner'].forEach(id => {
            expect(screen.getByTestId(id)).toBeInTheDocument();
        });
    });

    it('is locked by default and unlocks on toggle', () => {
        setup();
        const [unlockBtn] = screen.getAllByTestId('unlock-toggle');
        expect(unlockBtn.textContent).toMatch(/Unlock to Customize/i);
        fireEvent.click(unlockBtn);
        expect(unlockBtn.textContent).toMatch(/Lock \(Use Defaults\)/i);
    });

    it('accordion toggles open/closed (first instance)', () => {
        setup();
        const [toggleBtn] = screen.getAllByTestId('schedule-editor-toggle');
        expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
        fireEvent.click(toggleBtn);
        expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
        fireEvent.click(toggleBtn);
        expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    });

    it('allows switching warm-up policy when enabled', () => {
        const mutable = { ...baseData };
        const { getAllByTestId } = render(<Step3CustomizeDesign data={mutable} updateData={(u) => Object.assign(mutable, u)} />);
        const standardBtn = getAllByTestId('warmup-policy-standard')[0];
        const minimalBtn = getAllByTestId('warmup-policy-minimal')[0];
        expect(standardBtn).toHaveAttribute('aria-pressed', 'true');
        fireEvent.click(minimalBtn);
        expect(minimalBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('renders warm-up preview lines and updates when policy changes', () => {
        const mutable = { ...baseData };
        const { getAllByTestId } = render(<Step3CustomizeDesign data={mutable} updateData={(u) => Object.assign(mutable, u)} />);
        const previews = getAllByTestId('warmup-preview');
        const firstPreview = previews[0];
        let lines = firstPreview.querySelectorAll('[data-testid="warmup-set-line"]');
        const initialCount = lines.length; // expect 2-3 depending on duplicate artifacts
        expect(initialCount).toBeGreaterThanOrEqual(2);
        const jumpsBtn = getAllByTestId('warmup-policy-jumps')[0];
        fireEvent.click(jumpsBtn);
        lines = firstPreview.querySelectorAll('[data-testid="warmup-set-line"]');
        expect(lines.length).toBeGreaterThan(initialCount); // should increase due to jumps descriptor
    });

    it('disables warm-up policy buttons when warm-ups disabled', () => {
        const mutable = { ...baseData };
        const { getAllByRole, getAllByTestId } = render(<Step3CustomizeDesign data={mutable} updateData={(u) => Object.assign(mutable, u)} />);
        const [checkbox] = getAllByRole('checkbox');
        fireEvent.click(checkbox); // off
        const standardBtn = getAllByTestId('warmup-policy-standard')[0];
        expect(standardBtn).toBeDisabled();
    });

    it('adds, edits, and removes a custom warm-up row', () => {
        const mutable = { ...baseData };
        const { getAllByTestId, getAllByRole } = render(<Step3CustomizeDesign data={mutable} updateData={(u) => Object.assign(mutable, u)} />);
        // Ensure warm-ups enabled (pick a checkbox that is checked or click it)
        const checkboxes = getAllByRole('checkbox');
        const warmupCheckbox = checkboxes.find(cb => cb.checked) || checkboxes[0];
        if (!warmupCheckbox.checked) fireEvent.click(warmupCheckbox);
        // Click a non-disabled custom policy button
        const customButtons = getAllByTestId('warmup-policy-custom');
        const customBtn = customButtons.find(btn => !btn.disabled) || customButtons[0];
        fireEvent.click(customBtn);
        const addButtons = screen.getAllByTestId('warmup-add-row');
        const addBtn = addButtons.find(b => !b.disabled) || addButtons[0];
        fireEvent.click(addBtn);
        fireEvent.click(addBtn);
        // Expect at least 2 rows
        let rows = screen.getAllByTestId(/warmup-row-\d+$/);
        expect(rows.length).toBeGreaterThanOrEqual(2);
        // Edit first row
        const pctInput = screen.getAllByTestId('warmup-row-0-pct')[0];
        fireEvent.change(pctInput, { target: { value: '55' } });
        expect(pctInput).toHaveValue(55);
        // Remove second row
        const removeBtn = screen.getAllByTestId('warmup-row-1-remove')[0];
        fireEvent.click(removeBtn);
        rows = screen.getAllByTestId(/warmup-row-\d+$/);
        expect(rows.length).toBe(1);
    });

});
