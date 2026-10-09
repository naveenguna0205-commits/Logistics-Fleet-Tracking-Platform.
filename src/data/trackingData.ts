import { TrackingVehicle, TrackingStats, GeoCoordinate } from '../types/tracking';

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates heading bearing angle in degrees between two coordinates
 */
export function calculateBearing(start: GeoCoordinate, end: GeoCoordinate): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;
  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

/**
 * Converts bearing angle to cardinal direction
 */
export function getHeadingDirection(brng: number): 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' {
  const directions: ('N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW')[] = [
    'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'
  ];
  const index = Math.round(brng / 45) % 8;
  return directions[index];
}

// Full US Corridor Route Paths
const ROUTE_CHI_CLE: GeoCoordinate[] = [
  { lat: 41.8781, lng: -87.6298 }, // Chicago, IL
  { lat: 41.7650, lng: -87.5620 },
  { lat: 41.5934, lng: -87.3464 }, // Gary, IN
  { lat: 41.6210, lng: -87.0500 },
  { lat: 41.6764, lng: -86.2520 }, // South Bend, IN (Current vicinity)
  { lat: 41.6820, lng: -85.9767 }, // Elkhart, IN
  { lat: 41.6500, lng: -85.0000 },
  { lat: 41.6528, lng: -83.5379 }, // Toledo, OH
  { lat: 41.4489, lng: -82.7080 }, // Sandusky, OH
  { lat: 41.3850, lng: -82.0120 }, // Elyria, OH
  { lat: 41.4993, lng: -81.6944 }, // Cleveland, OH
];

const ROUTE_DAL_AUS: GeoCoordinate[] = [
  { lat: 32.7555, lng: -97.3308 }, // Fort Worth, TX
  { lat: 32.4820, lng: -97.2100 }, // Alvarado, TX
  { lat: 32.0110, lng: -97.1300 }, // Hillsboro, TX
  { lat: 31.5493, lng: -97.1467 }, // Waco, TX (Current vicinity)
  { lat: 31.0982, lng: -97.3428 }, // Temple, TX
  { lat: 30.6333, lng: -97.6772 }, // Georgetown, TX
  { lat: 30.5083, lng: -97.6789 }, // Round Rock, TX
  { lat: 30.2672, lng: -97.7431 }, // Austin, TX
];

const ROUTE_DEN_SLC: GeoCoordinate[] = [
  { lat: 39.7392, lng: -104.9903 }, // Denver, CO
  { lat: 39.7000, lng: -105.5000 }, // Idaho Springs
  { lat: 39.6297, lng: -106.0742 }, // Silverthorne
  { lat: 39.6403, lng: -106.3742 }, // Vail
  { lat: 39.5505, lng: -107.3248 }, // Glenwood Springs
  { lat: 39.0639, lng: -108.5506 }, // Grand Junction, CO (Current vicinity)
  { lat: 38.9955, lng: -110.1596 }, // Green River, UT
  { lat: 39.5912, lng: -110.8107 }, // Price, UT
  { lat: 40.2338, lng: -111.6585 }, // Provo, UT
  { lat: 40.7608, lng: -111.8910 }, // Salt Lake City, UT
];

const ROUTE_ALB_MTL: GeoCoordinate[] = [
  { lat: 42.6526, lng: -73.7562 }, // Albany, NY
  { lat: 43.0831, lng: -73.7846 }, // Saratoga Springs
  { lat: 43.3095, lng: -73.6440 }, // Glens Falls
  { lat: 43.4262, lng: -73.7123 }, // Lake George, NY (Current vicinity - Delayed)
  { lat: 43.8500, lng: -73.7000 }, // Schroon Lake
  { lat: 44.2700, lng: -73.6000 }, // Elizabethtown
  { lat: 44.6995, lng: -73.4529 }, // Plattsburgh, NY
  { lat: 44.9875, lng: -73.4521 }, // Champlain Border
  { lat: 45.5017, lng: -73.5673 }, // Montreal, QC
];

const ROUTE_ATL_SAV: GeoCoordinate[] = [
  { lat: 33.7490, lng: -84.3880 }, // Atlanta, GA
  { lat: 33.4473, lng: -84.1469 }, // McDonough, GA
  { lat: 33.0500, lng: -83.9200 }, // Forsyth, GA
  { lat: 32.8407, lng: -83.6324 }, // Macon, GA (Current vicinity)
  { lat: 32.5404, lng: -82.9038 }, // Dublin, GA
  { lat: 32.3977, lng: -81.9793 }, // Metter, GA
  { lat: 32.1400, lng: -81.4500 }, // Pooler, GA
  { lat: 32.0809, lng: -81.0912 }, // Savannah Port, GA
];

const ROUTE_LA_SD: GeoCoordinate[] = [
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles, CA
  { lat: 33.8366, lng: -117.9143 }, // Anaheim, CA
  { lat: 33.6846, lng: -117.8265 }, // Irvine, CA
  { lat: 33.4270, lng: -117.6120 }, // San Clemente, CA (Current vicinity)
  { lat: 33.1959, lng: -117.3795 }, // Oceanside, CA
  { lat: 32.9600, lng: -117.2600 }, // Del Mar, CA
  { lat: 32.7157, lng: -117.1611 }, // San Diego, CA
];

const ROUTE_SEA_PDX: GeoCoordinate[] = [
  { lat: 47.6062, lng: -122.3321 }, // Seattle, WA
  { lat: 47.2529, lng: -122.4443 }, // Tacoma, WA
  { lat: 47.0379, lng: -122.9007 }, // Olympia, WA (Current vicinity)
  { lat: 46.7162, lng: -122.9543 }, // Centralia, WA
  { lat: 46.1382, lng: -122.9054 }, // Kelso, WA
  { lat: 45.6387, lng: -122.6615 }, // Vancouver, WA
  { lat: 45.5152, lng: -122.6784 }, // Portland, OR
];

const ROUTE_MIA_ORL: GeoCoordinate[] = [
  { lat: 25.7617, lng: -80.1918 }, // Miami, FL
  { lat: 26.1224, lng: -80.1373 }, // Fort Lauderdale, FL
  { lat: 26.7153, lng: -80.0534 }, // West Palm Beach, FL (Current vicinity)
  { lat: 27.2730, lng: -80.3582 }, // Port St. Lucie, FL
  { lat: 27.6400, lng: -80.4000 }, // Vero Beach, FL
  { lat: 28.2919, lng: -81.4076 }, // Kissimmee, FL
  { lat: 28.5383, lng: -81.3792 }, // Orlando, FL
];

export const INITIAL_TRACKING_VEHICLES: TrackingVehicle[] = [
  {
    id: 'veh-001',
    vehicleNumber: 'FL-8829',
    model: 'Freightliner Cascadia 126',
    type: 'Semi-Truck',
    licensePlate: 'IL-992-TX',
    status: 'In Transit',
    currentLocation: {
      name: 'I-90 East (Mile 78)',
      address: 'Near South Bend Interchange, IN',
      state: 'Indiana',
      coordinate: { lat: 41.6764, lng: -86.2520 },
    },
    driver: {
      id: 'DRV-1001',
      name: 'Marcus Sterling',
      phone: '+1 (555) 234-8901',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      rating: 4.9,
      experienceYears: 9,
    },
    shipment: {
      id: 'SHP-8921',
      trackingNumber: 'TRK-8921-CHI-CLE',
      customerName: 'AeroDynamics Aerospace Corp',
      packageType: 'Heavy Machinery (Turbine Parts)',
      weightKg: 18500,
      priority: 'Urgent',
    },
    route: {
      pickup: {
        name: 'Chicago Central Depot #2',
        address: '4200 Logistics Blvd, Chicago, IL 60638',
        city: 'Chicago, IL',
        coordinate: { lat: 41.8781, lng: -87.6298 },
        departureTime: 'Today 08:30 AM',
      },
      destination: {
        name: 'Cleveland Aerospace Terminal',
        address: '8800 Aerospace Parkway, Cleveland, OH 44135',
        city: 'Cleveland, OH',
        coordinate: { lat: 41.4993, lng: -81.6944 },
        estimatedArrival: 'Today 04:45 PM',
      },
      waypoints: [
        { lat: 41.5934, lng: -87.3464 },
        { lat: 41.6764, lng: -86.2520 },
        { lat: 41.6528, lng: -83.5379 },
      ],
      routePath: ROUTE_CHI_CLE,
      totalDistanceKm: 550,
      distanceTraveledKm: 345,
      remainingDistanceKm: 205,
      progressPercent: 63,
      estimatedTimeRemaining: '2h 45m',
    },
    telemetry: {
      speedMph: 64,
      speedKmh: 103,
      headingDegrees: 85,
      headingDirection: 'E',
      fuelLevelPercent: 82,
      fuelCapacityGallons: 150,
      engineTempC: 89,
      tirePressurePsi: 105,
      driverDutyHours: 4.2,
      maxDutyHours: 11,
      signalStrength: 'Excellent',
      signalPercent: 98,
      lastPingTimestamp: '10 seconds ago',
      odometerKm: 48250,
      weatherCondition: 'Partly Cloudy, 66°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Pickup Location',
        subtitle: 'Loaded & Manifest Signed',
        location: 'Chicago Depot #2, Bay 4',
        time: '08:30 AM (Departed)',
        status: 'completed',
        notes: 'Air-ride suspension inspected & turbine parts locked.',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        subtitle: 'Freightliner Cascadia #FL-8829',
        location: 'Dispatched with Driver Marcus Sterling',
        time: '08:45 AM',
        status: 'completed',
        notes: 'Safety inspection passed 100%.',
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        subtitle: 'Cruising via I-90 East Corridor',
        location: 'Mile Marker 78, South Bend, IN',
        time: 'Active Telemetry',
        status: 'completed',
        notes: 'Maintaining 64 mph average speed.',
      },
      {
        key: 'current_location',
        title: 'Current Live GPS',
        subtitle: 'South Bend Waypoint Sector',
        location: 'Lat: 41.6764, Lng: -86.2520',
        time: 'Realtime Pulse',
        status: 'current',
        notes: 'On track for scheduled Cleveland arrival.',
      },
      {
        key: 'destination',
        title: 'Destination Terminal',
        subtitle: 'Cleveland Aerospace Terminal',
        location: '8800 Aerospace Pkwy, Cleveland, OH',
        time: 'ETA: 04:45 PM',
        status: 'upcoming',
        notes: 'Dock Bay #6 reserved for offload.',
      },
    ],
  },
  {
    id: 'veh-002',
    vehicleNumber: 'TX-9021',
    model: 'Volvo VNL 860',
    type: 'Semi-Truck',
    licensePlate: 'TX-441-VB',
    status: 'In Transit',
    currentLocation: {
      name: 'I-35 South (Near Waco)',
      address: 'Mile 335, McLennan County, TX',
      state: 'Texas',
      coordinate: { lat: 31.5493, lng: -97.1467 },
    },
    driver: {
      id: 'DRV-1002',
      name: 'Elena Rostova',
      phone: '+1 (555) 345-6712',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      rating: 4.8,
      experienceYears: 7,
    },
    shipment: {
      id: 'SHP-8922',
      trackingNumber: 'TRK-8922-DAL-AUS',
      customerName: 'BioHealth Pharma Logistics',
      packageType: 'Cold-Chain Container (Pharma Vaccines)',
      weightKg: 4200,
      priority: 'Urgent',
    },
    route: {
      pickup: {
        name: 'Fort Worth Pharmaceutical Park',
        address: '1500 Heritage Pkwy, Fort Worth, TX 76177',
        city: 'Fort Worth, TX',
        coordinate: { lat: 32.7555, lng: -97.3308 },
        departureTime: 'Today 09:15 AM',
      },
      destination: {
        name: 'Austin Medical Research Facility',
        address: '3200 Research Blvd, Austin, TX 78759',
        city: 'Austin, TX',
        coordinate: { lat: 30.2672, lng: -97.7431 },
        estimatedArrival: 'Today 02:15 PM',
      },
      waypoints: [
        { lat: 32.0110, lng: -97.1300 },
        { lat: 31.5493, lng: -97.1467 },
        { lat: 30.6333, lng: -97.6772 },
      ],
      routePath: ROUTE_DAL_AUS,
      totalDistanceKm: 315,
      distanceTraveledKm: 180,
      remainingDistanceKm: 135,
      progressPercent: 57,
      estimatedTimeRemaining: '1h 30m',
    },
    telemetry: {
      speedMph: 68,
      speedKmh: 109,
      headingDegrees: 185,
      headingDirection: 'S',
      fuelLevelPercent: 68,
      fuelCapacityGallons: 150,
      engineTempC: 87,
      tirePressurePsi: 108,
      driverDutyHours: 3.5,
      maxDutyHours: 11,
      signalStrength: 'Excellent',
      signalPercent: 96,
      lastPingTimestamp: '15 seconds ago',
      odometerKm: 82400,
      weatherCondition: 'Sunny, 82°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Pickup Location',
        subtitle: 'Loaded & Cold-Chain Calibrated',
        location: 'Fort Worth Bio Park, TX',
        time: '09:15 AM (Departed)',
        status: 'completed',
        notes: 'Temperature sensors verified at 4.2°C.',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        subtitle: 'Volvo VNL 860 #TX-9021',
        location: 'Elena Rostova Dispatched',
        time: '09:20 AM',
        status: 'completed',
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        subtitle: 'Cruising via I-35 South',
        location: 'Waco Bypass Gateway',
        time: 'Active Telemetry',
        status: 'completed',
      },
      {
        key: 'current_location',
        title: 'Current Live GPS',
        subtitle: 'Waco Transit Waypoint',
        location: 'Lat: 31.5493, Lng: -97.1467',
        time: 'Realtime Pulse',
        status: 'current',
        notes: 'Reefer container running steady at 3.9°C.',
      },
      {
        key: 'destination',
        title: 'Destination Terminal',
        subtitle: 'Austin Medical Research Facility',
        location: 'Austin, TX',
        time: 'ETA: 02:15 PM',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-003',
    vehicleNumber: 'CO-6612',
    model: 'Kenworth T680 Reefer',
    type: 'Refrigerated Truck',
    licensePlate: 'CO-883-KP',
    status: 'In Transit',
    currentLocation: {
      name: 'I-70 West (Grand Junction)',
      address: 'Mesa County Corridor, CO',
      state: 'Colorado',
      coordinate: { lat: 39.0639, lng: -108.5506 },
    },
    driver: {
      id: 'DRV-1003',
      name: 'David Kim',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      rating: 4.9,
      experienceYears: 12,
    },
    shipment: {
      id: 'SHP-8923',
      trackingNumber: 'TRK-8923-DEN-SLC',
      customerName: 'Alpine Harvest ColdChain',
      packageType: 'Perishable Produce & Dairy',
      weightKg: 14600,
      priority: 'Standard',
    },
    route: {
      pickup: {
        name: 'Denver Bio-Storage Hub',
        address: '5400 Stapleton Dr, Denver, CO 80216',
        city: 'Denver, CO',
        coordinate: { lat: 39.7392, lng: -104.9903 },
        departureTime: 'Today 06:00 AM',
      },
      destination: {
        name: 'Salt Lake Intermodal Logistics',
        address: '1800 California Ave, Salt Lake City, UT 84104',
        city: 'Salt Lake City, UT',
        coordinate: { lat: 40.7608, lng: -111.8910 },
        estimatedArrival: 'Today 06:30 PM',
      },
      waypoints: [
        { lat: 39.6403, lng: -106.3742 },
        { lat: 39.0639, lng: -108.5506 },
        { lat: 38.9955, lng: -110.1596 },
      ],
      routePath: ROUTE_DEN_SLC,
      totalDistanceKm: 850,
      distanceTraveledKm: 420,
      remainingDistanceKm: 430,
      progressPercent: 49,
      estimatedTimeRemaining: '4h 45m',
    },
    telemetry: {
      speedMph: 59,
      speedKmh: 95,
      headingDegrees: 280,
      headingDirection: 'W',
      fuelLevelPercent: 91,
      fuelCapacityGallons: 160,
      engineTempC: 92,
      tirePressurePsi: 104,
      driverDutyHours: 5.8,
      maxDutyHours: 11,
      signalStrength: 'Good',
      signalPercent: 88,
      lastPingTimestamp: '25 seconds ago',
      odometerKm: 34100,
      weatherCondition: 'Clear Mountain, 58°F',
      trafficCondition: 'Moderate',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Pickup Location',
        subtitle: 'Denver Bio Hub',
        location: 'Denver, CO',
        time: '06:00 AM',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        subtitle: 'Kenworth T680 #CO-6612',
        location: 'David Kim',
        time: '06:15 AM',
        status: 'completed',
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        subtitle: 'I-70 West Rocky Mountain Traverse',
        location: 'Passed Vail Pass Elevation 10,662 ft',
        time: 'Active Telemetry',
        status: 'completed',
      },
      {
        key: 'current_location',
        title: 'Current Live GPS',
        subtitle: 'Grand Junction Gateway',
        location: 'Lat: 39.0639, Lng: -108.5506',
        time: 'Realtime Pulse',
        status: 'current',
      },
      {
        key: 'destination',
        title: 'Destination Terminal',
        subtitle: 'Salt Lake Intermodal Logistics',
        location: 'Salt Lake City, UT',
        time: 'ETA: 06:30 PM',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-006',
    vehicleNumber: 'NY-4421',
    model: 'International LT625',
    type: 'Semi-Truck',
    licensePlate: 'NY-883-WW',
    status: 'Delayed',
    alertMessage: 'Adverse weather & heavy rain near Adirondack pass + Customs pre-clearance queue hold.',
    currentLocation: {
      name: 'I-87 North (Lake George)',
      address: 'Warren County Express Corridor, NY',
      state: 'New York',
      coordinate: { lat: 43.4262, lng: -73.7123 },
    },
    driver: {
      id: 'DRV-1006',
      name: 'Tariq Mansoor',
      phone: '+1 (555) 901-2345',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      rating: 4.7,
      experienceYears: 8,
    },
    shipment: {
      id: 'SHP-8924',
      trackingNumber: 'TRK-8924-ALB-MTL',
      customerName: 'TransCan Cross-Border Freight',
      packageType: 'Dry Goods & Industrial Machinery',
      weightKg: 16200,
      priority: 'Express',
    },
    route: {
      pickup: {
        name: 'Albany Port Hub',
        address: '100 Port Rd, Albany, NY 12202',
        city: 'Albany, NY',
        coordinate: { lat: 42.6526, lng: -73.7562 },
        departureTime: 'Today 07:45 AM',
      },
      destination: {
        name: 'Montreal Cross-Border Terminal',
        address: '7000 Rue Saint-Jacques, Montreal, QC H4B 1V9',
        city: 'Montreal, QC',
        coordinate: { lat: 45.5017, lng: -73.5673 },
        estimatedArrival: 'Today 05:15 PM (Delayed +45m)',
      },
      waypoints: [
        { lat: 43.0831, lng: -73.7846 },
        { lat: 43.4262, lng: -73.7123 },
        { lat: 44.6995, lng: -73.4529 },
      ],
      routePath: ROUTE_ALB_MTL,
      totalDistanceKm: 360,
      distanceTraveledKm: 110,
      remainingDistanceKm: 250,
      progressPercent: 31,
      estimatedTimeRemaining: '3h 50m (Delayed)',
    },
    telemetry: {
      speedMph: 24, // Slowed down due to delay
      speedKmh: 38,
      headingDegrees: 12,
      headingDirection: 'N',
      fuelLevelPercent: 74,
      fuelCapacityGallons: 150,
      engineTempC: 86,
      tirePressurePsi: 102,
      driverDutyHours: 4.5,
      maxDutyHours: 11,
      signalStrength: 'Fair',
      signalPercent: 72,
      lastPingTimestamp: '18 seconds ago',
      odometerKm: 28900,
      weatherCondition: 'Heavy Rain / Mist, 48°F',
      trafficCondition: 'Incident Delay',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Pickup Location',
        subtitle: 'Albany Port Hub',
        location: 'Albany, NY',
        time: '07:45 AM',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        subtitle: 'International LT625 #NY-4421',
        location: 'Tariq Mansoor Dispatched',
        time: '08:00 AM',
        status: 'completed',
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        subtitle: 'Adirondack Northway I-87',
        location: 'Weather Slowdown Zone',
        time: 'Traffic Alert Logged',
        status: 'completed',
      },
      {
        key: 'current_location',
        title: 'Current Live GPS',
        subtitle: 'Lake George Sector (Delayed)',
        location: 'Lat: 43.4262, Lng: -73.7123',
        time: 'Warning Triggered',
        status: 'current',
        notes: 'Driver reducing speed to 24 mph for safety. ETA pushed by 45 mins.',
      },
      {
        key: 'destination',
        title: 'Destination Terminal',
        subtitle: 'Montreal Cross-Border Terminal',
        location: 'Montreal, Canada',
        time: 'Revised ETA: 05:15 PM',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-010',
    vehicleNumber: 'GA-3320',
    model: 'Kenworth T880 Flatbed',
    type: 'Flatbed Truck',
    licensePlate: 'GA-554-KK',
    status: 'In Transit',
    currentLocation: {
      name: 'I-16 East (Near Macon)',
      address: 'Twiggs County Gateway, GA',
      state: 'Georgia',
      coordinate: { lat: 32.8407, lng: -83.6324 },
    },
    driver: {
      id: 'DRV-1010',
      name: 'James Wilson',
      phone: '+1 (555) 321-6549',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      rating: 4.8,
      experienceYears: 11,
    },
    shipment: {
      id: 'SHP-8925',
      trackingNumber: 'TRK-8925-ATL-SAV',
      customerName: 'Southern Steel & Infrastructure',
      packageType: 'Heavy Machinery (Steel Girders)',
      weightKg: 22000,
      priority: 'Standard',
    },
    route: {
      pickup: {
        name: 'Atlanta Central Freight Yard',
        address: '2200 Fulton Industrial Blvd, Atlanta, GA 30336',
        city: 'Atlanta, GA',
        coordinate: { lat: 33.7490, lng: -84.3880 },
        departureTime: 'Today 09:30 AM',
      },
      destination: {
        name: 'Savannah Port Ocean Terminal',
        address: '200 Ocean Terminal Dr, Savannah, GA 31415',
        city: 'Savannah, GA',
        coordinate: { lat: 32.0809, lng: -81.0912 },
        estimatedArrival: 'Today 03:30 PM',
      },
      waypoints: [
        { lat: 33.4473, lng: -84.1469 },
        { lat: 32.8407, lng: -83.6324 },
        { lat: 32.5404, lng: -82.9038 },
      ],
      routePath: ROUTE_ATL_SAV,
      totalDistanceKm: 395,
      distanceTraveledKm: 140,
      remainingDistanceKm: 255,
      progressPercent: 35,
      estimatedTimeRemaining: '2h 55m',
    },
    telemetry: {
      speedMph: 61,
      speedKmh: 98,
      headingDegrees: 125,
      headingDirection: 'SE',
      fuelLevelPercent: 62,
      fuelCapacityGallons: 130,
      engineTempC: 88,
      tirePressurePsi: 112,
      driverDutyHours: 3.1,
      maxDutyHours: 11,
      signalStrength: 'Excellent',
      signalPercent: 95,
      lastPingTimestamp: '12 seconds ago',
      odometerKm: 39500,
      weatherCondition: 'Sunny & Warm, 79°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Pickup Location',
        subtitle: 'Atlanta Steel Yard',
        location: 'Atlanta, GA',
        time: '09:30 AM',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        subtitle: 'Kenworth T880 #GA-3320',
        location: 'James Wilson Dispatched',
        time: '09:40 AM',
        status: 'completed',
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        subtitle: 'I-16 East Coastal Corridor',
        location: 'Macon Interchange Sector',
        time: 'Active Telemetry',
        status: 'completed',
      },
      {
        key: 'current_location',
        title: 'Current Live GPS',
        subtitle: 'Macon East Waypoint',
        location: 'Lat: 32.8407, Lng: -83.6324',
        time: 'Realtime Pulse',
        status: 'current',
      },
      {
        key: 'destination',
        title: 'Destination Terminal',
        subtitle: 'Savannah Port Ocean Terminal',
        location: 'Savannah, GA',
        time: 'ETA: 03:30 PM',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-007',
    vehicleNumber: 'CA-7719',
    model: 'Isuzu NPR-HD Commercial',
    type: 'Box Truck',
    licensePlate: 'CA-772-TY',
    status: 'Active',
    currentLocation: {
      name: 'I-5 South (San Clemente)',
      address: 'Orange County Coastal Expressway, CA',
      state: 'California',
      coordinate: { lat: 33.4270, lng: -117.6120 },
    },
    driver: {
      id: 'DRV-1007',
      name: 'Rachel Adams',
      phone: '+1 (555) 012-3456',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      rating: 4.9,
      experienceYears: 6,
    },
    shipment: {
      id: 'SHP-8926',
      trackingNumber: 'TRK-8926-LA-SD',
      customerName: 'Pacific Coast Retail Logistics',
      packageType: 'Standard Carton & Retail Goods',
      weightKg: 3800,
      priority: 'Standard',
    },
    route: {
      pickup: {
        name: 'Los Angeles Metro Terminal',
        address: '1400 E Washington Blvd, Los Angeles, CA 90021',
        city: 'Los Angeles, CA',
        coordinate: { lat: 34.0522, lng: -118.2437 },
        departureTime: 'Today 10:15 AM',
      },
      destination: {
        name: 'San Diego Hub & Depot',
        address: '4500 Pacific Hwy, San Diego, CA 92110',
        city: 'San Diego, CA',
        coordinate: { lat: 32.7157, lng: -117.1611 },
        estimatedArrival: 'Today 01:45 PM',
      },
      waypoints: [
        { lat: 33.8366, lng: -117.9143 },
        { lat: 33.4270, lng: -117.6120 },
        { lat: 33.1959, lng: -117.3795 },
      ],
      routePath: ROUTE_LA_SD,
      totalDistanceKm: 195,
      distanceTraveledKm: 115,
      remainingDistanceKm: 80,
      progressPercent: 59,
      estimatedTimeRemaining: '1h 05m',
    },
    telemetry: {
      speedMph: 60,
      speedKmh: 96,
      headingDegrees: 155,
      headingDirection: 'SE',
      fuelLevelPercent: 58,
      fuelCapacityGallons: 40,
      engineTempC: 84,
      tirePressurePsi: 95,
      driverDutyHours: 2.8,
      maxDutyHours: 11,
      signalStrength: 'Excellent',
      signalPercent: 99,
      lastPingTimestamp: '8 seconds ago',
      odometerKm: 52300,
      weatherCondition: 'Sunny Coastal, 72°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Pickup Location',
        subtitle: 'LA Metro Terminal',
        location: 'Los Angeles, CA',
        time: '10:15 AM',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        subtitle: 'Isuzu NPR-HD #CA-7719',
        location: 'Rachel Adams Dispatched',
        time: '10:20 AM',
        status: 'completed',
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        subtitle: 'I-5 South Corridor',
        location: 'Passing Irvine / Mission Viejo',
        time: 'Active Telemetry',
        status: 'completed',
      },
      {
        key: 'current_location',
        title: 'Current Live GPS',
        subtitle: 'San Clemente Coast Waypoint',
        location: 'Lat: 33.4270, Lng: -117.6120',
        time: 'Realtime Pulse',
        status: 'current',
      },
      {
        key: 'destination',
        title: 'Destination Terminal',
        subtitle: 'San Diego Hub & Depot',
        location: 'San Diego, CA',
        time: 'ETA: 01:45 PM',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-011',
    vehicleNumber: 'WA-9912',
    model: 'Volvo VNR Electric',
    type: 'Box Truck (EV)',
    licensePlate: 'WA-702-EV',
    status: 'Active',
    currentLocation: {
      name: 'I-5 South (Olympia)',
      address: 'Thurston County Corridor, WA',
      state: 'Washington',
      coordinate: { lat: 47.0379, lng: -122.9007 },
    },
    driver: {
      id: 'DRV-1011',
      name: 'Maya Lin',
      phone: '+1 (555) 654-9870',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      rating: 4.9,
      experienceYears: 5,
    },
    shipment: {
      id: 'SHP-8927',
      trackingNumber: 'TRK-8927-SEA-PDX',
      customerName: 'Cascadia CleanTech Logistics',
      packageType: 'Electronic Equipment & CleanTech',
      weightKg: 5400,
      priority: 'Express',
    },
    route: {
      pickup: {
        name: 'Harbor Island Port Terminal',
        address: '1000 Klickitat Way, Seattle, WA 98134',
        city: 'Seattle, WA',
        coordinate: { lat: 47.6062, lng: -122.3321 },
        departureTime: 'Today 08:00 AM',
      },
      destination: {
        name: 'Portland Eco Logistics Terminal',
        address: '5000 N Marine Dr, Portland, OR 97203',
        city: 'Portland, OR',
        coordinate: { lat: 45.5152, lng: -122.6784 },
        estimatedArrival: 'Today 12:30 PM',
      },
      waypoints: [
        { lat: 47.2529, lng: -122.4443 },
        { lat: 47.0379, lng: -122.9007 },
        { lat: 46.1382, lng: -122.9054 },
      ],
      routePath: ROUTE_SEA_PDX,
      totalDistanceKm: 280,
      distanceTraveledKm: 105,
      remainingDistanceKm: 175,
      progressPercent: 38,
      estimatedTimeRemaining: '2h 10m',
    },
    telemetry: {
      speedMph: 58,
      speedKmh: 93,
      headingDegrees: 195,
      headingDirection: 'S',
      fuelLevelPercent: 78,
      isElectric: true,
      batterySocPercent: 78,
      fuelCapacityGallons: 0,
      engineTempC: 42,
      tirePressurePsi: 100,
      driverDutyHours: 2.2,
      maxDutyHours: 11,
      signalStrength: 'Excellent',
      signalPercent: 97,
      lastPingTimestamp: '5 seconds ago',
      odometerKm: 19800,
      weatherCondition: 'Overcast & Cool, 55°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Pickup Location',
        subtitle: 'Harbor Island Terminal',
        location: 'Seattle, WA',
        time: '08:00 AM',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        subtitle: 'Volvo VNR Electric #WA-9912',
        location: 'Maya Lin Dispatched',
        time: '08:15 AM',
        status: 'completed',
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        subtitle: 'I-5 South Pacific Highway',
        location: 'Passed Tacoma Dome Sector',
        time: 'Active Telemetry',
        status: 'completed',
      },
      {
        key: 'current_location',
        title: 'Current Live GPS',
        subtitle: 'Olympia Waypoint',
        location: 'Lat: 47.0379, Lng: -122.9007',
        time: 'Realtime Pulse',
        status: 'current',
        notes: 'Battery efficiency optimal at 1.4 kWh/mile.',
      },
      {
        key: 'destination',
        title: 'Destination Terminal',
        subtitle: 'Portland Eco Logistics Terminal',
        location: 'Portland, OR',
        time: 'ETA: 12:30 PM',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-012',
    vehicleNumber: 'FL-5541',
    model: 'Freightliner Cascadia EVO',
    type: 'Semi-Truck',
    licensePlate: 'FL-881-ZZ',
    status: 'In Transit',
    currentLocation: {
      name: 'Florida Turnpike (West Palm Beach)',
      address: 'Mile 98, Palm Beach County, FL',
      state: 'Florida',
      coordinate: { lat: 26.7153, lng: -80.0534 },
    },
    driver: {
      id: 'DRV-1012',
      name: 'Derrick Vance',
      phone: '+1 (555) 890-4321',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      rating: 4.8,
      experienceYears: 10,
    },
    shipment: {
      id: 'SHP-8928',
      trackingNumber: 'TRK-8928-MIA-ORL',
      customerName: 'Sunshine Distribution Logistics',
      packageType: 'Beverage & Consumer Packaged Goods',
      weightKg: 19800,
      priority: 'Standard',
    },
    route: {
      pickup: {
        name: 'PortMiami Logistics Park',
        address: '1015 N America Way, Miami, FL 33132',
        city: 'Miami, FL',
        coordinate: { lat: 25.7617, lng: -80.1918 },
        departureTime: 'Today 09:00 AM',
      },
      destination: {
        name: 'Orlando Central Distribution Hub',
        address: '7500 Tradeport Dr, Orlando, FL 32827',
        city: 'Orlando, FL',
        coordinate: { lat: 28.5383, lng: -81.3792 },
        estimatedArrival: 'Today 02:00 PM',
      },
      waypoints: [
        { lat: 26.1224, lng: -80.1373 },
        { lat: 26.7153, lng: -80.0534 },
        { lat: 27.2730, lng: -80.3582 },
      ],
      routePath: ROUTE_MIA_ORL,
      totalDistanceKm: 375,
      distanceTraveledKm: 120,
      remainingDistanceKm: 255,
      progressPercent: 32,
      estimatedTimeRemaining: '3h 15m',
    },
    telemetry: {
      speedMph: 66,
      speedKmh: 106,
      headingDegrees: 345,
      headingDirection: 'N',
      fuelLevelPercent: 75,
      fuelCapacityGallons: 150,
      engineTempC: 88,
      tirePressurePsi: 106,
      driverDutyHours: 2.5,
      maxDutyHours: 11,
      signalStrength: 'Excellent',
      signalPercent: 96,
      lastPingTimestamp: '14 seconds ago',
      odometerKm: 41200,
      weatherCondition: 'Sunny Tropical, 85°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Pickup Location',
        subtitle: 'PortMiami Terminal',
        location: 'Miami, FL',
        time: '09:00 AM',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Assigned',
        subtitle: 'Freightliner #FL-5541',
        location: 'Derrick Vance Dispatched',
        time: '09:15 AM',
        status: 'completed',
      },
      {
        key: 'in_transit',
        title: 'In Transit',
        subtitle: 'Florida Turnpike North',
        location: 'Fort Lauderdale Gateway',
        time: 'Active Telemetry',
        status: 'completed',
      },
      {
        key: 'current_location',
        title: 'Current Live GPS',
        subtitle: 'West Palm Beach Waypoint',
        location: 'Lat: 26.7153, Lng: -80.0534',
        time: 'Realtime Pulse',
        status: 'current',
      },
      {
        key: 'destination',
        title: 'Destination Terminal',
        subtitle: 'Orlando Central Distribution Hub',
        location: 'Orlando, FL',
        time: 'ETA: 02:00 PM',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-004',
    vehicleNumber: 'OH-8833',
    model: 'Ford Transit 350 HD',
    type: 'Cargo Van',
    licensePlate: 'OH-219-MM',
    status: 'Idle',
    currentLocation: {
      name: 'Depot Yard #4, Columbus',
      address: '2800 Airport Dr, Columbus, OH 43219',
      state: 'Ohio',
      coordinate: { lat: 39.9612, lng: -82.9988 },
    },
    driver: {
      id: 'DRV-1004',
      name: 'Carlos Mendez',
      phone: '+1 (555) 789-0123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      rating: 4.6,
      experienceYears: 4,
    },
    shipment: {
      id: 'SHP-STAGED',
      trackingNumber: 'TRK-STG-COLUMBUS',
      customerName: 'Awaiting Dispatch Assignment',
      packageType: 'Local Courier & Staged Parcels',
      weightKg: 0,
      priority: 'Standard',
    },
    route: {
      pickup: {
        name: 'Columbus Staging Yard #4',
        address: '2800 Airport Dr, Columbus, OH 43219',
        city: 'Columbus, OH',
        coordinate: { lat: 39.9612, lng: -82.9988 },
        departureTime: 'Standby / Available',
      },
      destination: {
        name: 'Regional Delivery Route',
        address: 'Pending Dispatch Schedule',
        city: 'Columbus Metro, OH',
        coordinate: { lat: 39.9612, lng: -82.9988 },
        estimatedArrival: 'Standby',
      },
      waypoints: [],
      routePath: [{ lat: 39.9612, lng: -82.9988 }],
      totalDistanceKm: 0,
      distanceTraveledKm: 0,
      remainingDistanceKm: 0,
      progressPercent: 0,
      estimatedTimeRemaining: 'Available for Dispatch',
    },
    telemetry: {
      speedMph: 0,
      speedKmh: 0,
      headingDegrees: 0,
      headingDirection: 'N',
      fuelLevelPercent: 88,
      fuelCapacityGallons: 35,
      engineTempC: 30,
      tirePressurePsi: 70,
      driverDutyHours: 0,
      maxDutyHours: 11,
      signalStrength: 'Excellent',
      signalPercent: 99,
      lastPingTimestamp: '1 min ago',
      odometerKm: 61400,
      weatherCondition: 'Clear, 64°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Staging Depot',
        subtitle: 'Columbus Depot Yard',
        location: 'Columbus, OH',
        time: 'Ready',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Vehicle Available',
        subtitle: 'Ford Transit #OH-8833',
        location: 'Driver Carlos Mendez Available',
        time: 'Standby',
        status: 'current',
      },
      {
        key: 'in_transit',
        title: 'Awaiting Route',
        subtitle: 'Pending manifest dispatch',
        location: 'Depot Yard',
        time: 'Pending',
        status: 'upcoming',
      },
      {
        key: 'current_location',
        title: 'Parked in Bay #4',
        subtitle: 'Columbus Yard',
        location: 'Lat: 39.9612, Lng: -82.9988',
        time: 'Stationary',
        status: 'upcoming',
      },
      {
        key: 'destination',
        title: 'Route Destination',
        subtitle: 'Pending assignment',
        location: 'Regional Hub',
        time: 'TBD',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-008',
    vehicleNumber: 'PA-2210',
    model: 'Mack Anthem 64T Tanker',
    type: 'Tanker',
    licensePlate: 'PA-301-ZZ',
    status: 'Idle',
    currentLocation: {
      name: 'Allentown Terminal Staging Yard',
      address: 'Lehigh Valley Logistics Hub, Allentown, PA',
      state: 'Pennsylvania',
      coordinate: { lat: 40.6084, lng: -75.4902 },
    },
    driver: {
      id: 'DRV-UNASSIGNED',
      name: 'Pool Driver (Available)',
      phone: '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      rating: 5.0,
      experienceYears: 10,
    },
    shipment: {
      id: 'SHP-IDLE-TANKER',
      trackingNumber: 'TRK-TNK-ALLENTOWN',
      customerName: 'Chemical & Liquid Bulk Staging',
      packageType: 'Bulk Liquid (Pressurized & Sanitized)',
      weightKg: 0,
      priority: 'Standard',
    },
    route: {
      pickup: {
        name: 'Allentown Chemical Yard',
        address: 'Allentown, PA',
        city: 'Allentown, PA',
        coordinate: { lat: 40.6084, lng: -75.4902 },
        departureTime: 'Standby / Ready for Chemical Dispatch',
      },
      destination: {
        name: 'Northeast Chemical Corridors',
        address: 'Pending Route',
        city: 'Northeast Region',
        coordinate: { lat: 40.6084, lng: -75.4902 },
        estimatedArrival: 'Standby',
      },
      waypoints: [],
      routePath: [{ lat: 40.6084, lng: -75.4902 }],
      totalDistanceKm: 0,
      distanceTraveledKm: 0,
      remainingDistanceKm: 0,
      progressPercent: 0,
      estimatedTimeRemaining: 'Available for Dispatch',
    },
    telemetry: {
      speedMph: 0,
      speedKmh: 0,
      headingDegrees: 0,
      headingDirection: 'N',
      fuelLevelPercent: 95,
      fuelCapacityGallons: 200,
      engineTempC: 22,
      tirePressurePsi: 110,
      driverDutyHours: 0,
      maxDutyHours: 11,
      signalStrength: 'Excellent',
      signalPercent: 98,
      lastPingTimestamp: '2 mins ago',
      odometerKm: 71200,
      weatherCondition: 'Fair, 61°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Terminal Staging',
        subtitle: 'Sanitized & Certified',
        location: 'Allentown, PA',
        time: 'Ready',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Fleet Ready',
        subtitle: 'Mack Anthem Tanker #PA-2210',
        location: 'Allentown Staging',
        time: 'Ready',
        status: 'current',
      },
      {
        key: 'in_transit',
        title: 'Pending Dispatch',
        subtitle: 'Awaiting manifest',
        location: 'Allentown Yard',
        time: 'Pending',
        status: 'upcoming',
      },
      {
        key: 'current_location',
        title: 'Stationary in Staging Bay',
        subtitle: 'Allentown Yard',
        location: 'Lat: 40.6084, Lng: -75.4902',
        time: 'Standby',
        status: 'upcoming',
      },
      {
        key: 'destination',
        title: 'Scheduled Destination',
        subtitle: 'TBD',
        location: 'Northeast Corridor',
        time: 'Pending',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 'veh-009',
    vehicleNumber: 'MI-1102',
    model: 'Freightliner M2 106',
    type: 'Box Truck',
    licensePlate: 'MI-910-XX',
    status: 'Offline',
    alertMessage: 'Engine telemetry offline. Vehicle stationed in Detroit maintenance bay awaiting ECM parts.',
    currentLocation: {
      name: 'Detroit Storage Yard B',
      address: '6000 E McNichols Rd, Detroit, MI 48212',
      state: 'Michigan',
      coordinate: { lat: 42.3314, lng: -83.0458 },
    },
    driver: {
      id: 'DRV-UNASSIGNED',
      name: 'Unassigned',
      phone: '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      rating: 4.5,
      experienceYears: 0,
    },
    shipment: {
      id: 'SHP-OFFLINE',
      trackingNumber: 'TRK-OFFLINE-DETROIT',
      customerName: 'Maintenance Outage',
      packageType: 'None (Out of Service)',
      weightKg: 0,
      priority: 'Standard',
    },
    route: {
      pickup: {
        name: 'Detroit Maintenance Hub',
        address: 'Detroit, MI',
        city: 'Detroit, MI',
        coordinate: { lat: 42.3314, lng: -83.0458 },
        departureTime: 'Offline',
      },
      destination: {
        name: 'Detroit Repair Center',
        address: 'Detroit, MI',
        city: 'Detroit, MI',
        coordinate: { lat: 42.3314, lng: -83.0458 },
        estimatedArrival: 'Offline',
      },
      waypoints: [],
      routePath: [{ lat: 42.3314, lng: -83.0458 }],
      totalDistanceKm: 0,
      distanceTraveledKm: 0,
      remainingDistanceKm: 0,
      progressPercent: 0,
      estimatedTimeRemaining: 'Out of Service',
    },
    telemetry: {
      speedMph: 0,
      speedKmh: 0,
      headingDegrees: 0,
      headingDirection: 'N',
      fuelLevelPercent: 8,
      fuelCapacityGallons: 50,
      engineTempC: 18,
      tirePressurePsi: 90,
      driverDutyHours: 0,
      maxDutyHours: 11,
      signalStrength: 'Lost',
      signalPercent: 0,
      lastPingTimestamp: '2 days ago',
      odometerKm: 165000,
      weatherCondition: 'Rain, 50°F',
      trafficCondition: 'Clear',
    },
    stages: [
      {
        key: 'pickup',
        title: 'Maintenance Yard',
        subtitle: 'Detroit Maintenance Bay',
        location: 'Detroit, MI',
        time: 'Offline',
        status: 'completed',
      },
      {
        key: 'vehicle_assigned',
        title: 'Status: Offline',
        subtitle: 'Freightliner M2 #MI-1102',
        location: 'Diagnostic Hold',
        time: 'Awaiting parts',
        status: 'current',
      },
      {
        key: 'in_transit',
        title: 'Not In Transit',
        subtitle: 'Engine components disabled',
        location: 'Workshop',
        time: 'N/A',
        status: 'upcoming',
      },
      {
        key: 'current_location',
        title: 'Bay #3 Offline',
        subtitle: 'Detroit, MI',
        location: 'Lat: 42.3314, Lng: -83.0458',
        time: 'No GPS Ping',
        status: 'upcoming',
      },
      {
        key: 'destination',
        title: 'Return to Service',
        subtitle: 'Estimated post repair',
        location: 'Detroit Fleet',
        time: 'Next Week',
        status: 'upcoming',
      },
    ],
  },
];

/**
 * Calculates tracking KPIs and statistics from fleet
 */
export function calculateTrackingStats(vehicles: TrackingVehicle[]): TrackingStats {
  const totalFleet = vehicles.length;
  const inTransit = vehicles.filter((v) => v.status === 'In Transit').length;
  const active = vehicles.filter((v) => v.status === 'Active' || v.status === 'In Transit').length;
  const delayed = vehicles.filter((v) => v.status === 'Delayed').length;
  const available = vehicles.filter((v) => v.status === 'Idle' || v.status === 'Active').length;

  const movingVehicles = vehicles.filter((v) => v.telemetry.speedMph > 0);
  const averageSpeedMph =
    movingVehicles.length > 0
      ? Math.round(movingVehicles.reduce((acc, v) => acc + v.telemetry.speedMph, 0) / movingVehicles.length)
      : 0;

  return {
    totalActive: active,
    inTransit,
    delayed,
    available,
    totalFleet,
    averageSpeedMph,
  };
}

/**
 * Simulates real-time telemetry step:
 * Advances vehicles along their route coordinates smoothly.
 */
export function advanceVehicleSimulation(vehicle: TrackingVehicle, speedMultiplier: number = 1): TrackingVehicle {
  // Only advance active, in-transit, or delayed vehicles with routes
  if (vehicle.status === 'Idle' || vehicle.status === 'Offline' || vehicle.route.routePath.length <= 1) {
    return vehicle;
  }

  const path = vehicle.route.routePath;
  // Advance progress slightly
  const baseStep = 0.8 * speedMultiplier;
  let newProgress = vehicle.route.progressPercent + baseStep;

  if (newProgress >= 99) {
    newProgress = 25; // Loop back for continuous pleasant simulation
  }

  // Calculate interpolated coordinate index
  const exactIndex = ((newProgress / 100) * (path.length - 1));
  const floorIndex = Math.min(Math.floor(exactIndex), path.length - 2);
  const ceilIndex = floorIndex + 1;
  const fraction = exactIndex - floorIndex;

  const p1 = path[floorIndex];
  const p2 = path[ceilIndex];

  const interpolatedCoord: GeoCoordinate = {
    lat: Number((p1.lat + (p2.lat - p1.lat) * fraction).toFixed(5)),
    lng: Number((p1.lng + (p2.lng - p1.lng) * fraction).toFixed(5)),
  };

  const newBearing = calculateBearing(p1, p2);
  const newHeading = getHeadingDirection(newBearing);

  // Speed jitter for realism
  const jitter = (Math.random() * 4 - 2);
  const baseSpeed = vehicle.status === 'Delayed' ? 24 : 63;
  const currentSpeed = Math.max(15, Math.min(75, Math.round(baseSpeed + jitter)));

  const traveledKm = Math.round((newProgress / 100) * vehicle.route.totalDistanceKm);
  const remainingKm = Math.max(0, vehicle.route.totalDistanceKm - traveledKm);

  // Remaining time calculation
  const hoursLeft = remainingKm / (currentSpeed * 1.609);
  const h = Math.floor(hoursLeft);
  const m = Math.round((hoursLeft - h) * 60);
  const newEta = h > 0 ? `${h}h ${m}m` : `${m}m`;

  return {
    ...vehicle,
    currentLocation: {
      ...vehicle.currentLocation,
      coordinate: interpolatedCoord,
    },
    route: {
      ...vehicle.route,
      distanceTraveledKm: traveledKm,
      remainingDistanceKm: remainingKm,
      progressPercent: Math.round(newProgress),
      estimatedTimeRemaining: newEta,
    },
    telemetry: {
      ...vehicle.telemetry,
      speedMph: currentSpeed,
      speedKmh: Math.round(currentSpeed * 1.60934),
      headingDegrees: newBearing,
      headingDirection: newHeading,
      lastPingTimestamp: 'Just now',
    },
  };
}
