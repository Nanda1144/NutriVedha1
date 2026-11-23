import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
}) => {
  const variantStyles = {
    success: 'bg-state-success/12 text-[#047857] border-state-success/30',
    warning: 'bg-state-warning/12 text-[#B45309] border-state-warning/30',
    danger: 'bg-state-error/12 text-[#B91C1C] border-state-error/30',
    info: 'bg-teal/10 text-teal border-teal/25',
    neutral: 'bg-cream text-warm-brown border-soft-beige',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
};
