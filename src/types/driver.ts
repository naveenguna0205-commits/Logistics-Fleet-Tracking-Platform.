export type DriverStatus = 'Available' | 'On Duty' | 'Off Duty' | 'On Leave';

export interface DriverEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface DriverDeliveryRecord {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Delayed' | 'Cancelled';
  vehicle: string;
  cargo: string;
  onTime: boolean;
  distanceKm: number;
}

export interface DriverPerformanceMetrics {
  totalDeliveries: number;
  completedDeliveries: number;
  onTimeRate: number; // e.g. 98.5
  rating: number; // e.g. 4.9 out of 5
  totalDistance: number; // in km / miles
  safetyScore: number; // e.g. 97%
  fuelEfficiencyScore: number; // e.g. 94%
  weeklyDeliveries?: { day: string; completed: number; target: number }[];
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseState: string;
  experienceYears: number;
  assignedVehicle: string; // e.g. 'FL-8829 (Freightliner Cascadia)' or 'Unassigned'
  assignedVehicleId?: string;
  status: DriverStatus;
  address?: string;
  joinDate: string;
  bloodGroup?: string;
  certifications: string[];
  emergencyContact?: DriverEmergencyContact;
  performance: DriverPerformanceMetrics;
  deliveryHistory: DriverDeliveryRecord[];
}

export interface DriverFormData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseState?: string;
  experienceYears: number;
  assignedVehicle: string;
  status: DriverStatus;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  certifications?: string[];
}

export type DriverSortField =
  | 'name'
  | 'id'
  | 'status'
  | 'experienceYears'
  | 'rating'
  | 'completedDeliveries'
  | 'licenseExpiry';

export type SortDirection = 'asc' | 'desc';
