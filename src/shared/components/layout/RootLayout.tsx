import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-base text-text-primary">
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-6 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
};
