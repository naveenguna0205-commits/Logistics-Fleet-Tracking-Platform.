export type NotificationCategory =
  | 'delayed_shipment'
  | 'maintenance'
  | 'low_fuel'
  | 'driver_status'
  | 'delivery_update';

export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';

export type NotificationStatus = 'unread' | 'read';

export interface NotificationMetadata {
  vehicleId?: string;
  vehicleNumber?: string;
  driverId?: string;
  driverName?: string;
  shipmentId?: string;
  trackingNumber?: string;
  location?: string;
  fuelLevel?: number;
  delayMinutes?: number;
  cost?: number;
  eta?: string;
  serviceType?: string;
}

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string; // e.g., '10m ago', '2h ago', 'Yesterday'
  date: string; // YYYY-MM-DD
  dateTimeISO: string;
  priority: NotificationPriority;
  isRead: boolean;
  metadata?: NotificationMetadata;
  actionLink?: string;
  actionLabel?: string;
}

export interface NotificationFilterState {
  searchQuery: string;
  category: NotificationCategory | 'All';
  status: 'all' | 'unread' | 'read';
  priority: NotificationPriority | 'All';
  dateRange: 'all' | 'today' | '24h' | '7d' | '30d' | 'custom';
  sortBy: 'newest' | 'oldest' | 'priority';
}

export interface NotificationCounts {
  total: number;
  unread: number;
  read: number;
  delayedShipments: number;
  maintenance: number;
  lowFuel: number;
  driverStatus: number;
  deliveryUpdates: number;
  critical: number;
}
