import React from 'react';
import { clsx } from 'clsx';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, style, ...props }) => {
    return (
        <div style={{ marginBottom: '1rem', width: '100%' }}>
            <label
                htmlFor={props.id || label}
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-main)' }}
            >
                {label}
            </label>
            <input
                id={props.id || label}
                className={clsx(className)}
                style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '0.75rem',
                    border: `1.5px solid ${error ? '#EF4444' : '#E5E7EB'}`,
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontSize: '0.95rem',
                    backgroundColor: '#F9FAFB',
                    color: '#1F2937',
                    ...style as React.CSSProperties // Merge parent styles here
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.backgroundColor = '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 4px var(--color-primary-light)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error ? '#EF4444' : '#E5E7EB';
                    e.target.style.backgroundColor = '#F9FAFB';
                    e.target.style.boxShadow = 'none';
                }}
                {...props}
            />
            {error && <span style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
        </div>
    );
};
