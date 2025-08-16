import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton from '@/components/ui/Skeleton';

describe('Skeleton (coverage)', () => {
    it('renders and passes className through', () => {
        const { container } = render(<Skeleton className="test-marker" />);
        expect(container.firstChild).toBeTruthy();
        expect(container.firstChild).toHaveClass('test-marker');
    });

    it('renders multiple lines with appropriate spacing', () => {
        const { container } = render(<Skeleton lines={3} />);
        const children = container.firstChild.querySelectorAll('div');
        expect(children.length).toBe(3);
    });
});
