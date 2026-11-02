import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-6 w-full flex justify-center">
          <div className="w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};