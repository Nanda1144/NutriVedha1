import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'vata' | 'pitta' | 'kapha' | 'forest' | 'olive' | 'sand' | 'neutral' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    vata: 'bg-chart-blue/10 text-[#4E7396] border border-chart-blue/25',
    pitta: 'bg-state-warning/12 text-[#A9761F] border border-state-warning/30',
    kapha: 'bg-state-success/12 text-[#2F7A4D] border border-state-success/30',
    forest: 'bg-forest/10 text-forest border border-forest/20',
    olive: 'bg-teal/10 text-teal border border-teal/25',
    sand: 'bg-mint/20 text-forest border border-mint/40',
    neutral: 'bg-cream text-charcoal border border-soft-beige',
    success: 'bg-state-success/12 text-[#2F7A4D] border border-state-success/30',
    warning: 'bg-state-warning/12 text-[#A9761F] border border-state-warning/30',
    danger: 'bg-state-error/12 text-[#A9443D] border border-state-error/30',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
