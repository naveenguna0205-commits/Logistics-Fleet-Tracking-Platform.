export type ShipmentStatus =
  | 'Pending'
  | 'Picked Up'
  | 'In Transit'
  | 'Delivered'
  | 'Delayed'
  | 'Cancelled';

export type PackageType =
  | 'Palletized Freight'
  | 'Fragile Parcel'
  | 'Cold-Chain Container'
  | 'Heavy Machinery'
  | 'Hazardous Material'
  | 'Dry Goods'
  | 'Standard Carton'
  | 'Bulk Liquid'
  | 'Electronic Equipment';

export type ShipmentPriority = 'Standard' | 'Express' | 'Urgent';

export interface TimelineEvent {
  id: string;
  step: 'Created' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception';
  title: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
  notes?: string;
}

export interface Shipment {
  id: string; // e.g. SHP-8921
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  shipmentDate: string; // YYYY-MM-DD
  expectedDelivery: string; // YYYY-MM-DD
  actualDelivery?: string;
  assignedDriver: string;
  assignedVehicle: string;
  packageType: PackageType;
  packageWeight: number; // in kg
  status: ShipmentStatus;
  priority: ShipmentPriority;
  cost: number;
  specialInstructions?: string;
  timeline: TimelineEvent[];
  distanceKm?: number;
}

export interface ShipmentFormData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  shipmentDate: string;
  expectedDelivery: string;
  assignedDriver: string;
  assignedVehicle: string;
  packageType: PackageType;
  packageWeight: number;
  status: ShipmentStatus;
  priority?: ShipmentPriority;
  cost?: number;
  specialInstructions?: string;
}

export type ShipmentSortField =
  | 'id'
  | 'customerName'
  | 'shipmentDate'
  | 'expectedDelivery'
  | 'packageWeight'
  | 'status'
  | 'cost';

export type SortDirection = 'asc' | 'desc';
