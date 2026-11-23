import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-sage/60 bg-cream/40 my-4">
      <div className="p-3 bg-white rounded-full text-forest mb-3 border border-soft-beige shadow-earth-sm">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-semibold text-charcoal">{title}</h4>
      <p className="text-sm text-warm-brown max-w-sm mt-1">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
