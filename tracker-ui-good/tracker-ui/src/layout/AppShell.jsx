import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../components/navigation/TopNav';
import { useApp } from '@/context/AppContext';

const AppShell = memo(function AppShell() {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-black">
      <TopNav user={user} />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Outlet />
      </main>
    </div>
  );
});

export default AppShell;
