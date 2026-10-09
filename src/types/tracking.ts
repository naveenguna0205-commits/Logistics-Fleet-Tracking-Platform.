export type TrackingVehicleStatus = 'Active' | 'In Transit' | 'Idle' | 'Delayed' | 'Offline';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface RouteWaypoint {
  id: string;
  name: string;
  coordinate: GeoCoordinate;
  passed: boolean;
  estimatedTime?: string;
  actualTime?: string;
}

export interface TrackingRoute {
  pickup: {
    name: string;
    address: string;
    city: string;
    coordinate: GeoCoordinate;
    departureTime: string;
  };
  destination: {
    name: string;
    address: string;
    city: string;
    coordinate: GeoCoordinate;
    estimatedArrival: string;
  };
  waypoints: GeoCoordinate[];
  routePath: GeoCoordinate[];
  totalDistanceKm: number;
  distanceTraveledKm: number;
  remainingDistanceKm: number;
  progressPercent: number;
  estimatedTimeRemaining: string;
}

export type ShipmentStageKey = 'pickup' | 'vehicle_assigned' | 'in_transit' | 'current_location' | 'destination';

export interface ShipmentStageInfo {
  key: ShipmentStageKey;
  title: string;
  subtitle: string;
  location: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  notes?: string;
}

export interface VehicleTelemetry {
  speedMph: number;
  speedKmh: number;
  headingDegrees: number;
  headingDirection: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  fuelLevelPercent: number;
  fuelCapacityGallons?: number;
  isElectric?: boolean;
  batterySocPercent?: number;
  engineTempC: number;
  tirePressurePsi: number;
  driverDutyHours: number;
  maxDutyHours: number;
  signalStrength: 'Excellent' | 'Good' | 'Fair' | 'Weak' | 'Lost';
  signalPercent: number;
  lastPingTimestamp: string;
  odometerKm: number;
  weatherCondition?: string;
  trafficCondition?: 'Clear' | 'Moderate' | 'Heavy' | 'Incident Delay';
}

export interface TrackingVehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  type: string;
  licensePlate: string;
  status: TrackingVehicleStatus;
  currentLocation: {
    name: string;
    address: string;
    coordinate: GeoCoordinate;
    state: string;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    rating: number;
    experienceYears: number;
  };
  shipment: {
    id: string;
    trackingNumber: string;
    customerName: string;
    packageType: string;
    weightKg: number;
    priority: 'Standard' | 'Express' | 'Urgent';
  };
  route: TrackingRoute;
  telemetry: VehicleTelemetry;
  stages: ShipmentStageInfo[];
  alertMessage?: string;
}

export interface TrackingFilterState {
  searchQuery: string;
  status: TrackingVehicleStatus | 'All';
  driver: string;
  shipment: string;
}

export interface TrackingStats {
  totalActive: number;
  inTransit: number;
  delayed: number;
  available: number;
  totalFleet: number;
  averageSpeedMph: number;
}

export type MapTileLayer = 'streets' | 'light' | 'dark' | 'satellite';
