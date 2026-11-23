import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`earth-card ${hoverable ? 'earth-card-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
