import React from 'react';
import { clsx, type ClassValue } from 'clsx';

// Utility for class merging
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    children,
    style,
    ...props
}) => {
    const baseStyles: React.CSSProperties = {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: 600,
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        border: 'none',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: 'white',
        },
        outline: {
            border: '2px solid var(--color-primary)',
            color: 'var(--color-primary)',
            backgroundColor: 'transparent',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-text-muted)',
        }
    };

    return (
        <button
            className={clsx(className)}
            style={{ ...baseStyles, ...variants[variant], ...style }}
            {...props}
        >
            {children}
        </button>
    );
};
