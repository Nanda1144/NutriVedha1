import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-cream/30 rounded-xl border border-dashed border-sage/60 my-4">
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-forest mb-3 border border-soft-beige shadow-earth-sm">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-charcoal mb-1">{title}</h3>
      <p className="text-xs text-warm-brown max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
