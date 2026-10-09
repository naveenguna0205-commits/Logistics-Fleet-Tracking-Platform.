import {
  KPICardData,
  DeliveryPerformanceData,
  FleetStatusData,
  RecentActivity,
  DashboardAlert,
} from '../types/dashboard';

export const DASHBOARD_KPIS: KPICardData[] = [
  {
    id: 'total-vehicles',
    title: 'Total Vehicles',
    value: 48,
    trend: { value: 8.3, isPositive: true, label: 'vs last month' },
    iconName: 'truck',
    color: 'blue',
  },
  {
    id: 'total-drivers',
    title: 'Total Drivers',
    value: 36,
    trend: { value: 4.5, isPositive: true, label: 'vs last month' },
    iconName: 'users',
    color: 'indigo',
  },
  {
    id: 'active-shipments',
    title: 'Active Shipments',
    value: 128,
    trend: { value: 12.0, isPositive: true, label: 'vs last week' },
    iconName: 'package',
    color: 'purple',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    value: 86,
    trend: { value: 15.2, isPositive: true, label: 'today' },
    iconName: 'checkCircle',
    color: 'emerald',
  },
  {
    id: 'in-transit',
    title: 'In Transit',
    value: 28,
    trend: { value: 3.8, isPositive: true, label: 'active on route' },
    iconName: 'navigation',
    color: 'blue',
  },
  {
    id: 'delayed',
    title: 'Delayed',
    value: 14,
    trend: { value: 2.1, isPositive: false, label: 'requires attention' },
    iconName: 'alertTriangle',
    color: 'rose',
  },
];

export const WEEKLY_DELIVERY_PERFORMANCE: DeliveryPerformanceData[] = [
  { day: 'Mon', delivered: 68, inTransit: 24, delayed: 4 },
  { day: 'Tue', delivered: 82, inTransit: 28, delayed: 6 },
  { day: 'Wed', delivered: 94, inTransit: 32, delayed: 5 },
  { day: 'Thu', delivered: 88, inTransit: 30, delayed: 8 },
  { day: 'Fri', delivered: 104, inTransit: 35, delayed: 7 },
  { day: 'Sat', delivered: 76, inTransit: 22, delayed: 3 },
  { day: 'Sun', delivered: 54, inTransit: 18, delayed: 2 },
];

export const FLEET_STATUS_DATA: FleetStatusData[] = [
  { name: 'Active', value: 32, color: '#3b82f6', percentage: 66.7 },
  { name: 'Idle', value: 8, color: '#64748b', percentage: 16.7 },
  { name: 'Maintenance', value: 5, color: '#f59e0b', percentage: 10.4 },
  { name: 'Offline', value: 3, color: '#ef4444', percentage: 6.2 },
];

export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-1',
    type: 'delivery_completed',
    title: 'Shipment #SHP-9842 Delivered',
    description: 'Delivered to Metro Logistics Hub, Chicago, IL. Signed by Robert Vance.',
    timestamp: '8 mins ago',
    statusText: 'Delivered',
    statusVariant: 'success',
  },
  {
    id: 'act-2',
    type: 'vehicle_assigned',
    title: 'Vehicle FL-8829 Assigned',
    description: 'Freightliner Cascadia paired with driver Marcus Sterling for route #RT-402.',
    timestamp: '25 mins ago',
    statusText: 'Assigned',
    statusVariant: 'info',
  },
  {
    id: 'act-3',
    type: 'shipment_created',
    title: 'New Shipment #SHP-9850 Created',
    description: 'Priority freight dispatch from Philadelphia, PA to New York, NY (14,500 kg).',
    timestamp: '1 hour ago',
    statusText: 'Created',
    statusVariant: 'neutral',
  },
  {
    id: 'act-4',
    type: 'maintenance_completed',
    title: 'Vehicle Maintenance Completed',
    description: 'Semi-Truck TX-9021 completed 60,000 km brake overhaul & inspection.',
    timestamp: '2.5 hours ago',
    statusText: 'Completed',
    statusVariant: 'success',
  },
  {
    id: 'act-5',
    type: 'driver_status_changed',
    title: 'Driver Status Changed',
    description: 'Elena Rostova checked in: Status changed from Off Duty to On Duty.',
    timestamp: '4 hours ago',
    statusText: 'On Duty',
    statusVariant: 'info',
  },
];

export const DASHBOARD_ALERTS: DashboardAlert[] = [
  {
    id: 'alt-1',
    title: 'Delayed Shipment #SHP-9812',
    description: 'Cargo on I-95 North delayed by 45 mins due to severe highway traffic near Baltimore.',
    category: 'delayed_shipment',
    severity: 'warning',
    timestamp: '12 mins ago',
    tag: 'Delay +45m',
  },
  {
    id: 'alt-2',
    title: 'Vehicle Maintenance Due',
    description: 'Truck IL-4491 reached 120,000 km. Scheduled transmission fluid replacement is required.',
    category: 'maintenance_due',
    severity: 'critical',
    timestamp: '40 mins ago',
    tag: 'Service Due',
  },
  {
    id: 'alt-3',
    title: 'Low Fuel Warning',
    description: 'Vehicle OH-8833 fuel level dropped to 12%. Nearest approved fueling station: 3.4 miles.',
    category: 'low_fuel',
    severity: 'critical',
    timestamp: '1.2 hours ago',
    tag: '12% Fuel',
  },
  {
    id: 'alt-4',
    title: 'Driver Availability Issue',
    description: 'Driver Tariq Mansoor exceeded daily driving hour regulation (10.5 hrs). Rest break mandatory.',
    category: 'driver_issue',
    severity: 'warning',
    timestamp: '2 hours ago',
    tag: 'Rest Required',
  },
];
