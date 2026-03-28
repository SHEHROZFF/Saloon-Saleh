import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '../components/ui/Button';

describe('Button Component', () => {
    it('renders with text', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(<Button loading>Submit</Button>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('applies variant styles', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole('button')).toHaveClass('border');
    });
});
