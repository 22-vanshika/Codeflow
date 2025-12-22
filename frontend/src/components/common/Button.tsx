import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
}

export default function Button({ children, className = '', isActive, ...props }: ButtonProps) {
    return (
        <button
            className={`
                p-2 rounded border border-border-subtle bg-bg-panel hover:bg-border-subtle/50 hover:text-white transition-all
                disabled:opacity-30 disabled:cursor-not-allowed text-text-muted
                ${isActive ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/50' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}
