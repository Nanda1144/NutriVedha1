import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-brown/70">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-charcoal placeholder-warm-brown/60 transition-colors focus:border-teal focus:ring-2 focus:ring-teal/25 focus:outline-none ${
              icon ? 'pl-9' : ''
            } ${error ? 'border-state-error bg-state-error/5' : 'border-soft-beige hover:border-sage'} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-state-error font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-warm-brown/80">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
