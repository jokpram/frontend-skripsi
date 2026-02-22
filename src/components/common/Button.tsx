import React from 'react';
import { cn } from '../../utils/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
}

export const Button = ({
    className,
    variant = 'primary',
    children,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm border-transparent',
        outline: 'bg-transparent border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50',
        ghost: 'bg-transparent text-slate-500 hover:bg-slate-50',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
