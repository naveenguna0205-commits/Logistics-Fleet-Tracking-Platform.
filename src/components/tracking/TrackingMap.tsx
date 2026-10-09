import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Navigation,
  Route as RouteIcon,
  Play,
  Pause,
  Zap,
  Info,
  Compass,
} from 'lucide-react';
import { TrackingVehicle, MapTileLayer } from '../../types/tracking';
import {
  createVehicleDivIcon,
  createPickupDivIcon,
  createDestinationDivIcon,
  generateVehiclePopupHtml,
} from './VehicleMarker';
import { createRoutePolylineLayers, createWaypointMarkers } from './RouteLine';

interface TrackingMapProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simulationSpeed: number;
  onChangeSimulationSpeed: (speed: number) => void;
  onManualPing?: () => void;
  heightClass?: string;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  isSimulating,
  onToggleSimulation,
  simulationSpeed,
  onChangeSimulationSpeed,
  onManualPing,
  heightClass = 'h-[440px] lg:h-[460px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLayersRef = useRef<L.LayerGroup>(L.layerGroup());
  const waypointsGroupRef = useRef<L.LayerGroup>(L.layerGroup());

  // Local UI states - default to light map for clean modern enterprise theme
  const [currentTileLayer, setCurrentTileLayer] = useState<MapTileLayer>('light');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showAllRoutes, setShowAllRoutes] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Selected vehicle object
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || null;

  // Tile layer URLs
  const getTileUrl = (type: MapTileLayer): { url: string; attribution: string } => {
    switch (type) {
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; CartoDB &copy; OpenStreetMap',
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping',
        };
      case 'streets':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors',
        };
      case 'light':
      default:
        return {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          attribution: '&copy; CartoDB &copy; OpenStreetMap',
        };
    }
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [38.5, -96.5],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
    });

    // Add Initial Tile Layer (light default)
    const tileInfo = getTileUrl('light');
    const tileLayer = L.tileLayer(tileInfo.url, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Add Layer Groups
    routeLayersRef.current.addTo(map);
    waypointsGroupRef.current.addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size on load & resize
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Tile Layer Change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileInfo = getTileUrl(currentTileLayer);
    tileLayerRef.current.setUrl(tileInfo.url);
  }, [currentTileLayer]);

  // 3. Render / Update Vehicle Markers & Popups
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentMarkers = vehicleMarkersRef.current;
    const activeIds = new Set(vehicles.map((v) => v.id));

    // Remove markers that are no longer present
    currentMarkers.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Add or update markers
    vehicles.forEach((vehicle) => {
      const isSelected = vehicle.id === selectedVehicleId;
      const coord: L.LatLngTuple = [
        vehicle.currentLocation.coordinate.lat,
        vehicle.currentLocation.coordinate.lng,
      ];
      const icon = createVehicleDivIcon(vehicle, isSelected);

      let marker = currentMarkers.get(vehicle.id);

      if (!marker) {
        // Create new marker
        marker = L.marker(coord, { icon, zIndexOffset: isSelected ? 1000 : 100 }).addTo(map);

        // Click handler
        marker.on('click', () => {
          onSelectVehicle(vehicle.id);
        });

        // Popup setup
        const popupHtml = generateVehiclePopupHtml(vehicle);
        marker.bindPopup(popupHtml, {
          closeButton: false,
          className: 'custom-leaflet-popup',
          offset: [0, -20],
        });

        // Attach popup button listener on open
        marker.on('popupopen', () => {
          const btn = document.getElementById(`popup-btn-${vehicle.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectVehicle(vehicle.id);
              marker?.closePopup();
            };
          }
        });

        currentMarkers.set(vehicle.id, marker);
      } else {
        // Update existing marker position & icon smoothly
        marker.setLatLng(coord);
        marker.setIcon(icon);
        marker.setZIndexOffset(isSelected ? 1000 : 100);

        // Update popup content if popup is open
        if (marker.isPopupOpen()) {
          marker.setPopupContent(generateVehiclePopupHtml(vehicle));
          setTimeout(() => {
            const btn = document.getElementById(`popup-btn-${vehicle.id}`);
            if (btn) {
              btn.onclick = () => {
                onSelectVehicle(vehicle.id);
                marker?.closePopup();
              };
            }
          }, 50);
        }
      }
    });
  }, [vehicles, selectedVehicleId, onSelectVehicle]);

  // 4. Render Route Polylines & Waypoint Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    routeLayersRef.current.clearLayers();
    waypointsGroupRef.current.clearLayers();

    // If "Show All Routes" is enabled, draw faint route lines for all vehicles
    if (showAllRoutes) {
      vehicles.forEach((v) => {
        if (v.route.routePath.length > 1 && v.id !== selectedVehicleId) {
          const latLngs = v.route.routePath.map((p) => [p.lat, p.lng] as L.LatLngTuple);
          L.polyline(latLngs, {
            color: '#3b82f6',
            weight: 2,
            opacity: 0.45,
            dashArray: '4, 6',
          }).addTo(routeLayersRef.current);
        }
      });
    }

    // If a vehicle is selected, draw its full route with Pickup and Delivery pins
    if (selectedVehicle && selectedVehicle.route.routePath.length > 0) {
      const { completedLayer, remainingLayer, fullPathLayer } =
        createRoutePolylineLayers(selectedVehicle);

      if (completedLayer && remainingLayer) {
        routeLayersRef.current.addLayer(completedLayer);
        routeLayersRef.current.addLayer(remainingLayer);
      } else {
        routeLayersRef.current.addLayer(fullPathLayer);
      }

      // Add pickup marker
      const pickup = selectedVehicle.route.pickup;
      if (pickup && pickup.coordinate) {
        const pickupIcon = createPickupDivIcon(pickup.city || pickup.name);
        const pickupMarker = L.marker([pickup.coordinate.lat, pickup.coordinate.lng], {
          icon: pickupIcon,
          zIndexOffset: 500,
        }).addTo(routeLayersRef.current);

        pickupMarker.bindPopup(`
          <div style="font-size: 12px; font-family: system-ui; color: #1e293b;">
            <strong style="color: #059669;">Pickup Origin</strong><br/>
            <strong>${pickup.name}</strong><br/>
            <span style="color: #64748b;">${pickup.address}</span><br/>
            <span style="color: #059669; font-weight: 600;">Departed: ${pickup.departureTime}</span>
          </div>
        `);
      }

      // Add destination marker
      const dest = selectedVehicle.route.destination;
      if (dest && dest.coordinate) {
        const destIcon = createDestinationDivIcon(dest.city || dest.name);
        const destMarker = L.marker([dest.coordinate.lat, dest.coordinate.lng], {
          icon: destIcon,
          zIndexOffset: 500,
        }).addTo(routeLayersRef.current);

        destMarker.bindPopup(`
          <div style="font-size: 12px; font-family: system-ui; color: #1e293b;">
            <strong style="color: #4f46e5;">Destination Terminal</strong><br/>
            <strong>${dest.name}</strong><br/>
            <span style="color: #64748b;">${dest.address}</span><br/>
            <span style="color: #4f46e5; font-weight: 600;">Est. Arrival: ${dest.estimatedArrival}</span>
          </div>
        `);
      }

      // Waypoint circle dots
      if (selectedVehicle.route.waypoints && selectedVehicle.route.waypoints.length > 0) {
        const wpMarkers = createWaypointMarkers(selectedVehicle.route.waypoints);
        wpMarkers.forEach((m) => waypointsGroupRef.current.addLayer(m));
      }
    }
  }, [selectedVehicle, showAllRoutes, vehicles, selectedVehicleId]);

  // 5. Fit bounds or center when selected vehicle changes
  const handleCenterOnSelected = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVehicle) return;

    const coord = selectedVehicle.currentLocation.coordinate;
    if (selectedVehicle.route.routePath.length > 2) {
      const { allBounds } = createRoutePolylineLayers(selectedVehicle);
      map.fitBounds(allBounds, {
        padding: [60, 60],
        maxZoom: 9,
      });
    } else {
      map.flyTo([coord.lat, coord.lng], 9, { duration: 1 });
    }
  }, [selectedVehicle]);

  // Trigger auto-focus when selection changes
  useEffect(() => {
    if (selectedVehicleId) {
      handleCenterOnSelected();
    }
  }, [selectedVehicleId, handleCenterOnSelected]);

  // Fit all fleet in view
  const handleFitFleet = () => {
    const map = mapInstanceRef.current;
    if (!map || vehicles.length === 0) return;

    const points = vehicles.map((v) =>
      L.latLng(v.currentLocation.coordinate.lat, v.currentLocation.coordinate.lng)
    );
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 });
  };

  // Zoom helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={`relative w-full overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-100 h-screen w-screen'
          : `${heightClass} rounded-2xl border border-slate-200/80 shadow-xs`
      }`}
    >
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100" />

      {/* Top Left: Live Status Pulse & Simulation Controls */}
      <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-[calc(100%-140px)] sm:max-w-none">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-md text-slate-900">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500"></span>
            {isSimulating && (
              <span className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
            )}
          </div>
          <span className="text-[10px] sm:text-xs font-bold tracking-wide">
            {isSimulating ? 'LIVE GPS' : 'PAUSED'}
          </span>
        </div>

        {/* Simulation Play/Pause + Speed Select */}
        <div className="flex items-center bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-md p-0.5 sm:p-1 gap-1">
          <button
            onClick={onToggleSimulation}
            className={`p-1 sm:p-1.5 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-colors ${
              isSimulating
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title={isSimulating ? 'Pause Live Movement' : 'Resume Live Movement'}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isSimulating ? 'Pause' : 'Play'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-0.5 px-0.5 sm:px-1 border-l border-slate-200">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSimulationSpeed(speed)}
                className={`px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-colors ${
                  simulationSpeed === speed
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {onManualPing && (
            <button
              onClick={onManualPing}
              className="p-1 sm:p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Manual Ping: Advance Telemetry by 1 Step"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Top Right: Layer Switcher & Fullscreen Actions */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 flex items-center gap-1 sm:gap-2">
        {/* Layer Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="p-2 sm:p-2.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-md text-slate-700 hover:text-blue-600 transition-colors"
            title="Change Map Style"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 space-y-1 z-30 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Map Tiles Layer
              </div>
              {(['light', 'dark', 'satellite', 'streets'] as MapTileLayer[]).map((layer) => (
                <button
                  key={layer}
                  onClick={() => {
                    setCurrentTileLayer(layer);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold capitalize flex items-center justify-between transition-colors ${
                    currentTileLayer === layer
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{layer} View</span>
                  {currentTileLayer === layer && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toggle All Routes Lines */}
        <button
          onClick={() => setShowAllRoutes(!showAllRoutes)}
          className={`p-2.5 backdrop-blur-md border rounded-xl shadow-md transition-colors ${
            showAllRoutes
              ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/25'
              : 'bg-white/95 border-slate-200/80 text-slate-700 hover:text-blue-600'
          }`}
          title={showAllRoutes ? 'Hide Fleet Routes' : 'Show All Fleet Routes'}
        >
          <RouteIcon className="w-4 h-4" />
        </button>

        {/* Legend Button */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`p-2.5 backdrop-blur-md border rounded-xl shadow-md transition-colors ${
            showLegend
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-500/25'
              : 'bg-white/95 border-slate-200/80 text-slate-700 hover:text-indigo-600'
          }`}
          title="Map Legend"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-md text-slate-700 hover:text-blue-600 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Right: Zoom & Center Controls */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleFitFleet}
          className="p-2.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-md text-slate-700 hover:text-blue-600 transition-colors"
          title="Fit All Fleet in View"
        >
          <Compass className="w-4 h-4" />
        </button>

        {selectedVehicle && (
          <button
            onClick={handleCenterOnSelected}
            className="p-2.5 bg-blue-600 border border-blue-500 rounded-xl shadow-sm shadow-blue-500/25 text-white hover:bg-blue-700 transition-colors animate-pulse"
            title="Focus on Selected Vehicle Route"
          >
            <Navigation className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-col bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors border-b border-slate-200"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend Overlay Card */}
      {showLegend && (
        <div className="absolute bottom-6 left-4 z-20 w-72 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-2xl text-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fleet Map Legend
            </span>
            <button
              onClick={() => setShowLegend(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-blue-600 flex-shrink-0 shadow-xs"></span>
              <span className="font-semibold text-slate-800">In Transit (Active Route & Pulse)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-emerald-500 flex-shrink-0 shadow-xs"></span>
              <span className="font-semibold text-slate-800">Active (Dispatched & Ready)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-amber-500 flex-shrink-0 shadow-xs"></span>
              <span className="font-semibold text-slate-800">Idle / Depot Staged</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-rose-500 flex-shrink-0 shadow-xs"></span>
              <span className="font-semibold text-slate-800">Delayed / Transit Alert</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-slate-400 flex-shrink-0 shadow-xs"></span>
              <span className="font-semibold text-slate-800">Offline / Workshop Bay</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Origin Pin
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Destination Pin
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
