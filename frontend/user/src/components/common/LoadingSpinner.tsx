import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading natural intelligence...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="w-8 h-8 text-teal animate-spin" />
      <p className="text-sm text-warm-brown font-medium animate-pulse">{message}</p>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="earth-card p-5 animate-pulse space-y-3">
      <div className="h-4 bg-soft-beige rounded w-1/3"></div>
      <div className="h-8 bg-soft-beige/80 rounded w-3/4"></div>
      <div className="h-4 bg-soft-beige/60 rounded w-full"></div>
      <div className="h-4 bg-soft-beige/60 rounded w-2/3"></div>
    </div>
  );
};
