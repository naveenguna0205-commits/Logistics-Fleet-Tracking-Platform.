import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  RefreshCw,
  CheckCheck,
  Zap,
} from 'lucide-react';
import {
  NotificationItem,
  NotificationFilterState,
  NotificationCategory,
} from '../../types/notification';
import {
  getStoredNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  markSelectedAsRead,
  deleteStoredNotification,
  deleteSelectedNotifications,
  clearReadNotifications,
  resetStoredNotifications,
  addStoredNotification,
  calculateNotificationCounts,
  subscribeToNotifications,
} from '../../services/notificationStorage';
import { NotificationStats } from '../../components/notifications/NotificationStats';
import { NotificationFilters } from '../../components/notifications/NotificationFilters';
import { NotificationItemCard } from '../../components/notifications/NotificationItemCard';
import { Pagination } from '../../components/common/filters/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { NotificationLoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { ToastContainer, ToastMessage } from '../../components/common/Toast';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasSimulatedError, setHasSimulatedError] = useState<boolean>(false);

  // Filters State
  const [filters, setFilters] = useState<NotificationFilterState>({
    searchQuery: '',
    category: 'All',
    status: 'all',
    priority: 'All',
    dateRange: 'all',
    sortBy: 'newest',
  });

  // Batch Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load notifications from storage
  const loadData = (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    const data = getStoredNotifications();
    setNotifications(data);
    if (showLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    loadData(true);

    // Subscribe to cross-tab/cross-component updates
    const unsubscribe = subscribeToNotifications(({ items }) => {
      setNotifications(items);
    });

    return () => unsubscribe();
  }, []);

  // Filter & Sort Pipeline
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((item) => {
        // 1. Search Query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchMsg = item.message.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchShp = item.metadata?.shipmentId?.toLowerCase().includes(q) || false;
          const matchVeh = item.metadata?.vehicleNumber?.toLowerCase().includes(q) || false;
          const matchDrv = item.metadata?.driverName?.toLowerCase().includes(q) || false;

          if (!matchTitle && !matchMsg && !matchCat && !matchShp && !matchVeh && !matchDrv) {
            return false;
          }
        }

        // 2. Category Filter
        if (filters.category !== 'All' && item.category !== filters.category) {
          return false;
        }

        // 3. Status Filter (all, unread, read)
        if (filters.status === 'unread' && item.isRead) return false;
        if (filters.status === 'read' && !item.isRead) return false;

        // 4. Priority Filter
        if (filters.priority !== 'All' && item.priority !== filters.priority) {
          return false;
        }

        // 5. Date Range Filter
        if (filters.dateRange !== 'all') {
          const today = '2026-10-08';
          if (filters.dateRange === 'today' && item.date !== today) return false;
          if (filters.dateRange === '24h' && !item.timestamp.includes('min') && !item.timestamp.includes('hour') && !item.timestamp.includes('Just now')) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'oldest') {
          return a.id.localeCompare(b.id);
        }
        if (filters.sortBy === 'priority') {
          const priorityWeight: Record<string, number> = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1,
          };
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        }
        // Default: Newest first (unread on top, higher ID / ISO)
        return (b.dateTimeISO || '').localeCompare(a.dateTimeISO || '');
      });
  }, [notifications, filters]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(startIndex, startIndex + pageSize);
  }, [filteredNotifications, currentPage, pageSize]);

  // Summary counts
  const counts = useMemo(() => calculateNotificationCounts(notifications), [notifications]);

  const hasActiveFilters = Boolean(
    filters.searchQuery.trim() ||
      filters.category !== 'All' ||
      filters.status !== 'all' ||
      filters.priority !== 'All' ||
      filters.dateRange !== 'all' ||
      filters.sortBy !== 'newest'
  );

  const handleFilterChange = <K extends keyof NotificationFilterState>(
    key: K,
    value: NotificationFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      status: 'all',
      priority: 'All',
      dateRange: 'all',
      sortBy: 'newest',
    });
    addToast('info', 'Filters Cleared', 'Displaying all system alerts & notifications.');
  };

  // Actions
  const handleToggleRead = (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (!target) return;

    if (target.isRead) {
      const updated = markNotificationAsUnread(id);
      setNotifications(updated);
      addToast('info', 'Marked Unread', 'Notification status updated.');
    } else {
      const updated = markNotificationAsRead(id);
      setNotifications(updated);
      addToast('success', 'Marked Read', 'Notification marked as acknowledged.');
    }
  };

  const handleDelete = (id: string) => {
    const updated = deleteStoredNotification(id);
    setNotifications(updated);
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    addToast('error', 'Notification Deleted', 'Alert removed from registry.');
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
    addToast('success', 'All Marked Read', 'All alerts marked as acknowledged.');
  };

  const handleResetAll = () => {
    const reset = resetStoredNotifications();
    setNotifications(reset);
    handleResetFilters();
    addToast('success', 'Registry Reset', 'Default mock notifications restored.');
  };

  // Batch Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedNotifications.map((n) => n.id));
    }
  };

  const handleBatchMarkRead = () => {
    const updated = markSelectedAsRead(selectedIds);
    setNotifications(updated);
    addToast(
      'success',
      'Batch Read Complete',
      `${selectedIds.length} notifications marked as read.`
    );
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    const updated = deleteSelectedNotifications(selectedIds);
    setNotifications(updated);
    addToast(
      'error',
      'Batch Delete Complete',
      `${selectedIds.length} notifications removed.`
    );
    setSelectedIds([]);
  };

  // Simulate Live Alert Generation
  const handleSimulateAlert = () => {
    const sampleAlerts = [
      {
        category: 'low_fuel' as NotificationCategory,
        title: 'Live Telemetry: Vehicle NY-7822 Low Fuel (13%)',
        message: 'Reefer Truck NY-7822 reported critical low fuel level approaching Dallas staging area. Driver dispatched to nearest pilot depot.',
        priority: 'high' as const,
        isRead: false,
        metadata: {
          vehicleId: 'veh-009',
          vehicleNumber: 'NY-7822',
          fuelLevel: 13,
          location: 'Dallas North Tollway, TX',
        },
        actionLink: '/tracking?vehicle=NY-7822',
        actionLabel: 'Track Vehicle',
      },
      {
        category: 'delayed_shipment' as NotificationCategory,
        title: 'Live Dispatch: Shipment SHP-4491 Highway Closure (+50m)',
        message: 'Shipment SHP-4491 facing 50-minute detour due to unexpected bridge closure on Interstate 80.',
        priority: 'critical' as const,
        isRead: false,
        metadata: {
          shipmentId: 'SHP-4491',
          trackingNumber: 'TRK-4491-NV',
          delayMinutes: 50,
          driverName: 'Elena Rostova',
        },
        actionLink: '/shipments',
        actionLabel: 'Inspect Route',
      },
      {
        category: 'maintenance' as NotificationCategory,
        title: 'Diagnostic Alert: Box Truck GA-2201 Tire Pressure Alert',
        message: 'Tire pressure sensor detected 28 PSI (recommended 36 PSI) on rear passenger axle.',
        priority: 'medium' as const,
        isRead: false,
        metadata: {
          vehicleId: 'veh-010',
          vehicleNumber: 'GA-2201',
          serviceType: 'Tire Pressure & Inflation',
        },
        actionLink: '/vehicles',
        actionLabel: 'View Vehicle',
      },
    ];

    const randomAlert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    const updated = addStoredNotification(randomAlert);
    setNotifications(updated);
    addToast('warning', 'New Telemetry Alert Triggered', randomAlert.title);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Notifications & Alerts</span>
          </nav>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Notifications & Fleet Alerts
            </h1>
            {counts.unread > 0 && (
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                {counts.unread} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time operational alerts: delayed shipments, vehicle health, low fuel, and driver updates.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {counts.unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={handleSimulateAlert}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors shadow-xs"
            title="Generate a realistic live notification to test telemetry updates"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Alert</span>
          </button>

          <button
            onClick={() => loadData(true)}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors shadow-xs"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Stats */}
      <NotificationStats
        counts={counts}
        activeCategory={filters.category}
        onSelectCategory={(cat) => handleFilterChange('category', cat)}
        onSelectStatus={(st) => handleFilterChange('status', st)}
      />

      {/* 3. Advanced Filtering Toolbar */}
      <NotificationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        counts={counts}
        selectedIds={selectedIds}
        onBatchMarkRead={handleBatchMarkRead}
        onBatchDelete={handleBatchDelete}
        onSelectAll={handleSelectAll}
        isAllSelected={
          paginatedNotifications.length > 0 &&
          selectedIds.length === paginatedNotifications.length
        }
        totalFilteredCount={filteredNotifications.length}
      />

      {/* 4. Notification Items Feed / States */}
      {isLoading ? (
        <NotificationLoadingSkeleton count={6} />
      ) : hasSimulatedError ? (
        <ErrorState
          title="Telemetry Stream Disconnected"
          message="Could not synchronize alert records with fleet command center."
          onRetry={() => {
            setHasSimulatedError(false);
            loadData(true);
          }}
          actionText="Reconnect Telemetry"
        />
      ) : paginatedNotifications.length > 0 ? (
        <div className="space-y-3">
          {paginatedNotifications.map((notification) => (
            <NotificationItemCard
              key={notification.id}
              notification={notification}
              isSelected={selectedIds.includes(notification.id)}
              onToggleSelect={handleToggleSelect}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
            />
          ))}

          {/* 5. Pagination */}
          <div className="pt-2 bg-white rounded-2xl border border-slate-200/80 px-4 mt-4 shadow-xs">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredNotifications.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              itemName="alerts"
            />
          </div>
        </div>
      ) : (
        <EmptyState
          title="No notifications match your filters"
          description={
            hasActiveFilters
              ? 'Try relaxing your filter parameters, searching with different terms, or resetting all filters.'
              : 'All caught up! There are no alerts currently in your notifications queue.'
          }
          actionText={hasActiveFilters ? 'Clear All Filters' : 'Restore Default Alerts'}
          onAction={hasActiveFilters ? handleResetFilters : handleResetAll}
          secondaryActionText={hasActiveFilters ? undefined : 'Simulate New Alert'}
          onSecondaryAction={hasActiveFilters ? undefined : handleSimulateAlert}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default NotificationsPage;
