import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-earth-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-brown">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder-warm-brown/70 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25 ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error ? 'border-state-error bg-state-error/5' : 'border-soft-beige hover:border-sage'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warm-brown">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-state-error font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-warm-brown">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
