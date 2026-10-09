import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Clock,
  Wrench,
  Fuel,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';
import {
  getStoredNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  subscribeToNotifications,
} from '../../services/notificationStorage';
import { NotificationItem, NotificationCategory } from '../../types/notification';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

interface NavbarProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, pageTitle = 'Overview' }) => {
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Load and subscribe to notifications
  useEffect(() => {
    setNotifications(getStoredNotifications());

    const unsubscribe = subscribeToNotifications(({ items }) => {
      setNotifications(items);
    });

    return () => unsubscribe();
  }, []);

  // Global keyboard shortcut (Ctrl+K / Cmd+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    setShowNotifications(false);
    if (item.actionLink) {
      navigate(item.actionLink);
    } else {
      navigate('/notifications');
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'delayed_shipment':
        return Clock;
      case 'maintenance':
        return Wrench;
      case 'low_fuel':
        return Fuel;
      case 'driver_status':
        return UserCheck;
      case 'delivery_update':
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-8 flex items-center justify-between">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors flex-shrink-0"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Middle & Right: Search, Actions, Profile */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Mobile Search Icon Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            title="Search (Ctrl+K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-slate-600" />
          </button>

          {/* Desktop Global Search Trigger Bar */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden sm:flex group items-center justify-between sm:w-56 md:w-80 px-4 py-2 text-xs bg-slate-100 hover:bg-white hover:border-blue-300 hover:shadow-md border border-slate-200 rounded-full text-slate-500 hover:text-slate-700 transition-all duration-200 text-left btn-press"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
              <span className="truncate text-xs font-medium">Search for something</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-white group-hover:bg-blue-50 group-hover:text-blue-600 border border-slate-200 rounded-md transition-colors">
              Ctrl+K
            </kbd>
          </button>

          {/* Notifications Bell with Interactive Popover */}
          <div className="relative" ref={notifDropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 btn-press ${
                showNotifications ? 'bg-slate-200 text-slate-900 border-slate-300 shadow-inner' : ''
              }`}
              aria-label="Notifications"
            >
              <Bell className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600 transition-transform ${unreadCount > 0 ? 'animate-bell-ring text-blue-600' : 'group-hover:scale-110'}`} />

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[1.1rem] h-4 px-1 text-[9px] sm:text-[10px] font-black text-white bg-rose-500 rounded-full ring-2 ring-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 sm:p-4 z-50 animate-modal-pop text-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">Notifications</span>
                    {unreadCount > 0 ? (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {unreadCount} New
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">All caught up</span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Notifications Preview List */}
                <div className="py-2.5 space-y-2 max-h-80 overflow-y-auto">
                  {unreadNotifications.length > 0 ? (
                    unreadNotifications.slice(0, 4).map((n) => {
                      const Icon = getCategoryIcon(n.category);
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 cursor-pointer transition-all flex items-start gap-3 group"
                        >
                          <div
                            className={`p-2 rounded-xl flex-shrink-0 ${
                              n.priority === 'critical'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : n.priority === 'high'
                                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                : 'bg-blue-50 text-blue-600 border border-blue-200'
                            }`}
                          >
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                                {n.title}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {n.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-slate-400">
                      <Bell className="w-7 h-7 mx-auto mb-1.5 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">No unread alerts</p>
                      <p className="text-[11px] text-slate-400">All fleet systems operating normally</p>
                    </div>
                  )}
                </div>

                {/* Footer link */}
                <div className="pt-2.5 border-t border-slate-100">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="flex items-center justify-center gap-2 py-2.5 w-full text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20"
                  >
                    <span>View All Notifications ({notifications.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80"
                alt="Profile Avatar"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-blue-500/20 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Online"></span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Command Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
