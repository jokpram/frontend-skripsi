import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import { describe, it, expect, vi } from 'vitest';

describe('Input Component', () => {
    it('renders with label', () => {
        render(<Input label="Username" placeholder="Enter username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('displays error message when error prop is provided', () => {
        render(<Input label="Email" error="Invalid email address" />);
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('handles change events', () => {
        const handleChange = vi.fn();
        render(<Input label="Name" onChange={handleChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John Doe' } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('renders as password type when specified', () => {
        render(<Input label="Password" type="password" />);
        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('type', 'password');
    });
});
