import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div
        className={`${sizeClasses[size]} border-teal border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-xs text-warm-brown font-medium animate-pulse">{text}</p>}
    </div>
  );
};
