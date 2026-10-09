import L from 'leaflet';
import { TrackingVehicle, GeoCoordinate } from '../../types/tracking';

/**
 * Creates polyline layers for a vehicle's route:
 * - Solid vibrant polyline for completed distance
 * - Dashed animated polyline for remaining distance
 */
export const createRoutePolylineLayers = (
  vehicle: TrackingVehicle
): {
  completedLayer: L.Polyline | null;
  remainingLayer: L.Polyline | null;
  fullPathLayer: L.Polyline;
  allBounds: L.LatLngBounds;
} => {
  const path = vehicle.route.routePath;
  const currentCoord = vehicle.currentLocation.coordinate;

  // Convert to Leaflet LatLng objects
  const latLngs = path.map((pt) => L.latLng(pt.lat, pt.lng));
  const allBounds = L.latLngBounds(latLngs);

  // If path is trivial (e.g. stationary single-point), return basic layer
  if (path.length <= 1) {
    const fullPathLayer = L.polyline([L.latLng(currentCoord.lat, currentCoord.lng)], {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.8,
    });
    return {
      completedLayer: null,
      remainingLayer: null,
      fullPathLayer,
      allBounds: L.latLngBounds([L.latLng(currentCoord.lat, currentCoord.lng)]),
    };
  }

  // Find the segment index closest to current location
  const progressFraction = vehicle.route.progressPercent / 100;
  const splitIndex = Math.max(1, Math.min(Math.round(progressFraction * (path.length - 1)), path.length - 1));

  const completedPoints: L.LatLng[] = [];
  for (let i = 0; i <= splitIndex; i++) {
    completedPoints.push(L.latLng(path[i].lat, path[i].lng));
  }
  // Include exact current position
  completedPoints.push(L.latLng(currentCoord.lat, currentCoord.lng));

  const remainingPoints: L.LatLng[] = [L.latLng(currentCoord.lat, currentCoord.lng)];
  for (let i = splitIndex; i < path.length; i++) {
    remainingPoints.push(L.latLng(path[i].lat, path[i].lng));
  }

  const completedLayer = L.polyline(completedPoints, {
    color: '#2563eb', // Solid Blue
    weight: 5,
    opacity: 0.85,
    lineCap: 'round',
    lineJoin: 'round',
  });

  const remainingLayer = L.polyline(remainingPoints, {
    color: '#93c5fd', // Lighter Blue with dashes
    weight: 4,
    dashArray: '8, 8',
    opacity: 0.75,
    lineCap: 'round',
    lineJoin: 'round',
  });

  const fullPathLayer = L.polyline(latLngs, {
    color: '#3b82f6',
    weight: 4,
    opacity: 0.6,
  });

  return {
    completedLayer,
    remainingLayer,
    fullPathLayer,
    allBounds,
  };
};

/**
 * Creates subtle waypoint markers along the route
 */
export const createWaypointMarkers = (waypoints: GeoCoordinate[]): L.CircleMarker[] => {
  return waypoints.map((pt) =>
    L.circleMarker([pt.lat, pt.lng], {
      radius: 4,
      color: '#ffffff',
      weight: 2,
      fillColor: '#3b82f6',
      fillOpacity: 0.9,
    })
  );
};
