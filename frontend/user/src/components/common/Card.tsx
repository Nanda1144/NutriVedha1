import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div
      className={`earth-card ${hoverable ? 'earth-card-hover' : ''} p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
