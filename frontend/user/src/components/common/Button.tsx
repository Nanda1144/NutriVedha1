import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:bg-none disabled:bg-soft-beige disabled:text-warm-brown disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100 disabled:brightness-100';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-br from-forest-dark via-forest to-teal text-white shadow-earth-sm hover:brightness-110 hover:shadow-glow-teal active:scale-[0.98]',
    secondary:
      'bg-gradient-to-br from-teal to-teal-light text-white shadow-earth-sm hover:brightness-110 active:scale-[0.98]',
    outline:
      'border-2 border-forest/70 text-forest bg-white hover:bg-cream hover:border-teal active:scale-[0.98]',
    ghost: 'text-charcoal hover:bg-cream hover:text-forest active:scale-[0.98]',
    danger:
      'bg-gradient-to-br from-state-error to-[#A9342D] text-white shadow-earth-sm hover:brightness-110 active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
