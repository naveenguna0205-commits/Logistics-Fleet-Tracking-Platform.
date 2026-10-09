import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Scroll to top immediately whenever navigating between modules
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'Overview';
      case '/vehicles':
        return 'Vehicles';
      case '/drivers':
        return 'Drivers';
      case '/shipments':
        return 'Shipments';
      case '/tracking':
        return 'Live Tracking';
      case '/notifications':
        return 'Notifications';
      default:
        return 'Overview';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300 overflow-x-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} pageTitle={getPageTitle(location.pathname)} />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
