import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/navigation/PublicNavbar';
import { PublicFooter } from '../components/navigation/PublicFooter';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
