import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ActivityFeed } from '@/features/activity/ActivityFeed';
import { cn } from '@/utils/cn';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} toggleActivity={() => setActivityOpen(!activityOpen)} />
        <main className="flex-1 overflow-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
      
      {/* Activity Panel */}
      <div className={cn("hidden w-80 border-l border-border bg-card transition-all duration-300 xl:block", !activityOpen && "xl:hidden")}>
        <ActivityFeed />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-64 flex-col bg-card h-full shadow-lg transition-transform">
             <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
