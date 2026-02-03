import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
    return (
        <div className="mb-4 w-full">
            <label
                htmlFor={props.id || label}
                className="block mb-2 font-medium text-slate-700"
            >
                {label}
            </label>
            <input
                id={props.id || label}
                className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none flex-1',
                    'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400',
                    'focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                    className
                )}
                {...props}
            />
            {error && <span className="text-red-500 text-sm mt-1.5 block animate-in fade-in slide-in-from-top-1">{error}</span>}
        </div>
    );
};
