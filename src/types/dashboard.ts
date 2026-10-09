export interface KPICardData {
  id: string;
  title: string;
  value: number | string;
  trend: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  iconName: 'truck' | 'users' | 'package' | 'checkCircle' | 'navigation' | 'alertTriangle';
  color: 'blue' | 'emerald' | 'indigo' | 'amber' | 'purple' | 'rose';
}

export interface DeliveryPerformanceData {
  day: string;
  delivered: number;
  inTransit: number;
  delayed: number;
}

export interface FleetStatusData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export type ActivityType =
  | 'delivery_completed'
  | 'vehicle_assigned'
  | 'shipment_created'
  | 'maintenance_completed'
  | 'driver_status_changed';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  statusText: string;
  statusVariant: 'success' | 'info' | 'warning' | 'neutral';
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface DashboardAlert {
  id: string;
  title: string;
  description: string;
  category: 'delayed_shipment' | 'maintenance_due' | 'low_fuel' | 'driver_issue';
  severity: AlertSeverity;
  timestamp: string;
  tag: string;
}
