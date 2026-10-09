import { NotificationItem, NotificationCounts } from '../types/notification';
import { INITIAL_MOCK_NOTIFICATIONS } from '../data/mockNotifications';

const STORAGE_KEY = 'logitrack_notifications_v1';
const LEGACY_STORAGE_KEY = 'fleetflow_notifications_v1';
const EVENT_NAME = 'logitrack_notifications_updated';

/**
 * Dispatch custom event across window to update badges in Navbar and Sidebar instantly
 */
const notifyChange = (items: NotificationItem[]) => {
  if (typeof window !== 'undefined') {
    const unread = items.filter((n) => !n.isRead).length;
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: {
          items,
          unreadCount: unread,
        },
      })
    );
  }
};

/**
 * Retrieve all notifications from localStorage (or populate default)
 */
export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      saveStoredNotifications(INITIAL_MOCK_NOTIFICATIONS);
      return INITIAL_MOCK_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MOCK_NOTIFICATIONS;
  } catch (err) {
    console.error('Failed to load notifications from storage:', err);
    return INITIAL_MOCK_NOTIFICATIONS;
  }
};

/**
 * Persist notifications to storage
 */
export const saveStoredNotifications = (items: NotificationItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    notifyChange(items);
  } catch (err) {
    console.error('Failed to save notifications to storage:', err);
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = (id: string): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.map((item) =>
    item.id === id ? { ...item, isRead: true } : item
  );
  saveStoredNotifications(updated);
  return updated;
};

/**
 * Mark a single notification as unread
 */
export const markNotificationAsUnread = (id: string): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.map((item) =>
    item.id === id ? { ...item, isRead: false } : item
  );
  saveStoredNotifications(updated);
  return updated;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = (): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.map((item) => ({ ...item, isRead: true }));
  saveStoredNotifications(updated);
  return updated;
};

/**
 * Mark multiple selected notifications as read
 */
export const markSelectedAsRead = (ids: string[]): NotificationItem[] => {
  const idSet = new Set(ids);
  const current = getStoredNotifications();
  const updated = current.map((item) =>
    idSet.has(item.id) ? { ...item, isRead: true } : item
  );
  saveStoredNotifications(updated);
  return updated;
};

/**
 * Delete a notification by ID
 */
export const deleteStoredNotification = (id: string): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.filter((item) => item.id !== id);
  saveStoredNotifications(updated);
  return updated;
};

/**
 * Delete multiple notifications by ID
 */
export const deleteSelectedNotifications = (ids: string[]): NotificationItem[] => {
  const idSet = new Set(ids);
  const current = getStoredNotifications();
  const updated = current.filter((item) => !idSet.has(item.id));
  saveStoredNotifications(updated);
  return updated;
};

/**
 * Clear all read notifications
 */
export const clearReadNotifications = (): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.filter((item) => !item.isRead);
  saveStoredNotifications(updated);
  return updated;
};

/**
 * Add a new notification (e.g. simulated live alert)
 */
export const addStoredNotification = (
  item: Omit<NotificationItem, 'id' | 'timestamp' | 'date' | 'dateTimeISO'>
): NotificationItem[] => {
  const current = getStoredNotifications();
  const now = new Date();
  const newItem: NotificationItem = {
    ...item,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: 'Just now',
    date: now.toISOString().split('T')[0],
    dateTimeISO: now.toISOString(),
  };
  const updated = [newItem, ...current];
  saveStoredNotifications(updated);
  return updated;
};

/**
 * Reset storage to default initial mock data
 */
export const resetStoredNotifications = (): NotificationItem[] => {
  saveStoredNotifications(INITIAL_MOCK_NOTIFICATIONS);
  return INITIAL_MOCK_NOTIFICATIONS;
};

/**
 * Calculate summary counts across categories and status
 */
export const calculateNotificationCounts = (
  items: NotificationItem[]
): NotificationCounts => {
  return {
    total: items.length,
    unread: items.filter((n) => !n.isRead).length,
    read: items.filter((n) => n.isRead).length,
    delayedShipments: items.filter((n) => n.category === 'delayed_shipment').length,
    maintenance: items.filter((n) => n.category === 'maintenance').length,
    lowFuel: items.filter((n) => n.category === 'low_fuel').length,
    driverStatus: items.filter((n) => n.category === 'driver_status').length,
    deliveryUpdates: items.filter((n) => n.category === 'delivery_update').length,
    critical: items.filter((n) => n.priority === 'critical').length,
  };
};

/**
 * Subscribe to live notification updates across components
 */
export const subscribeToNotifications = (
  callback: (data: { items: NotificationItem[]; unreadCount: number }) => void
): (() => void) => {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{
      items: NotificationItem[];
      unreadCount: number;
    }>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
};
