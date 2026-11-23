import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:bg-soft-beige disabled:text-warm-brown disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-forest hover:bg-forest-hover text-white shadow-earth-sm active:scale-[0.98]',
    secondary: 'bg-teal hover:bg-teal-hover text-white shadow-earth-sm active:scale-[0.98]',
    outline: 'border border-forest/50 text-forest bg-white hover:bg-cream active:scale-[0.98]',
    danger: 'bg-state-error hover:opacity-90 text-white shadow-earth-sm active:scale-[0.98]',
    ghost: 'text-charcoal hover:bg-cream active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
