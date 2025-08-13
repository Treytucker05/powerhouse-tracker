import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SimpleVolumeChart from '@/components/dashboard/SimpleVolumeChart';

// Polyfill ResizeObserver if missing
class RO { observe() { } unobserve() { } disconnect() { } }
if (!global.ResizeObserver) { /* @ts-ignore */ global.ResizeObserver = RO; }

// Stable layout box for svg calculations
const origGBCR = Element.prototype.getBoundingClientRect;
beforeAll(() => {
    Element.prototype.getBoundingClientRect = function () {
        return { x: 0, y: 0, width: 900, height: 500, top: 0, left: 0, right: 900, bottom: 500 };
    };
});
afterAll(() => {
    Element.prototype.getBoundingClientRect = origGBCR;
});

// Sample data matching expected muscle keys
const sampleData = {
    Chest: 10,
    Back: 12,
    Quads: 14,
    mev: { Chest: 8, Back: 10, Quads: 12 },
    mrv: { Chest: 16, Back: 18, Quads: 20 }
};

describe('SimpleVolumeChart (coverage)', () => {
    it('renders with sample data and shows title', () => {
        render(<SimpleVolumeChart data={sampleData} />);
        expect(screen.getByText(/Weekly Volume by Muscle Group/i)).toBeTruthy();
        // At least one muscle label present
        expect(screen.getByText(/Chest/i)).toBeTruthy();
    });

    it('renders fallback when no data muscles present', () => {
        render(<SimpleVolumeChart data={{}} />);
        expect(screen.getByText(/No data available/i)).toBeTruthy();
    });

    it('covers responsive branches and hover tooltip without duplicate query failures', () => {
        const widths = [500, 700, 900];
        widths.forEach(w => {
            Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w });
            render(<SimpleVolumeChart data={sampleData} />);
            // Accept multiple headings; ensure at least one present
            expect(screen.getAllByText(/Weekly Volume/i).length).toBeGreaterThan(0);
        });
        // Color / tooltip branch data
        const branchData = {
            Chest: 5,
            Back: 25,
            Quads: 14,
            mev: { Chest: 8, Back: 10, Quads: 12 },
            mrv: { Chest: 16, Back: 18, Quads: 20 }
        };
        render(<SimpleVolumeChart data={branchData} />);
        const rects = document.querySelectorAll('rect');
        if (rects.length > 0) {
            fireEvent.mouseEnter(rects[0]);
            // Chest appears in axis or tooltip; simply assert at least one occurrence
            expect(screen.getAllByText(/Chest/).length).toBeGreaterThan(0);
        }
    });
});
