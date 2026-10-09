export type VehicleStatus = 'Active' | 'Idle' | 'Maintenance' | 'Offline';

export type VehicleType =
  | 'Semi-Truck'
  | 'Box Truck'
  | 'Cargo Van'
  | 'Flatbed Truck'
  | 'Refrigerated Truck'
  | 'Tanker';

export interface VehicleServiceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  technician: string;
  odometer: number;
}

export interface VehicleActivityRecord {
  id: string;
  timestamp: string;
  type: 'route_started' | 'delivery_complete' | 'maintenance' | 'fuel_stop' | 'status_change';
  description: string;
  location: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  year: number;
  type: VehicleType;
  driver: string;
  driverPhone?: string;
  status: VehicleStatus;
  fuelLevel: number; // 0 - 100
  fuelCapacity: number; // in gallons/liters
  mileage: number; // in km/miles
  licensePlate: string;
  vin: string;
  lastServiceDate: string;
  nextServiceDate?: string;
  currentLocation: string;
  serviceHistory: VehicleServiceRecord[];
  recentActivities: VehicleActivityRecord[];
}

export interface VehicleFormData {
  vehicleNumber: string;
  model: string;
  year: number;
  type: VehicleType;
  driver: string;
  status: VehicleStatus;
  fuelLevel: number;
  lastServiceDate: string;
  mileage: number;
  licensePlate: string;
  vin: string;
  fuelCapacity: number;
  currentLocation: string;
}

export type VehicleSortField = 'vehicleNumber' | 'model' | 'driver' | 'status' | 'fuelLevel' | 'mileage' | 'lastServiceDate';
export type SortDirection = 'asc' | 'desc';
