import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Package,
  Navigation,
  Bell,
  X,
  Layers,
} from 'lucide-react';
import {
  getStoredNotifications,
  subscribeToNotifications,
} from '../../services/notificationStorage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const notifs = getStoredNotifications();
    setUnreadCount(notifs.filter((n) => !n.isRead).length);

    const unsubscribe = subscribeToNotifications(({ unreadCount }) => {
      setUnreadCount(unreadCount);
    });

    return () => unsubscribe();
  }, []);

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/vehicles', icon: Truck },
    { name: 'Drivers', path: '/drivers', icon: Users },
    { name: 'Shipments', path: '/shipments', icon: Package },
    { name: 'Tracking', path: '/tracking', icon: Navigation },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Modern Clean Enterprise Light Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 text-slate-700 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Logo Icon Box */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Layers className="w-5 h-5 stroke-[2.4] group-hover:rotate-12 transition-transform duration-300" />
            </div>

            {/* Brand Name */}
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">LogiTrack</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 animate-pulse-slow">
                PRO
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden transition-colors btn-press"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 group btn-press ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-bold sidebar-active-highlight'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3.5">
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110 ${
                          isActive ? 'text-white stroke-[2.4]' : 'text-slate-500 group-hover:text-slate-900 stroke-[2]'
                        }`}
                      />
                      <span className="leading-none">{item.name}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-transform group-hover:scale-105 ${
                          isActive
                            ? 'bg-white text-blue-700'
                            : 'bg-rose-500 text-white shadow-xs animate-pulse'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
