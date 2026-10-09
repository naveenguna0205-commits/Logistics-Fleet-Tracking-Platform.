import L from 'leaflet';
import { TrackingVehicle, TrackingVehicleStatus } from '../../types/tracking';

/**
 * Get status color themes for Leaflet markers
 */
export const getStatusColors = (status: TrackingVehicleStatus) => {
  switch (status) {
    case 'In Transit':
      return {
        bg: '#2563eb', // Blue
        glow: 'rgba(37, 99, 235, 0.45)',
        border: '#ffffff',
        badgeBg: 'bg-blue-600 text-white',
      };
    case 'Active':
      return {
        bg: '#059669', // Emerald
        glow: 'rgba(5, 150, 105, 0.45)',
        border: '#ffffff',
        badgeBg: 'bg-emerald-600 text-white',
      };
    case 'Delayed':
      return {
        bg: '#e11d48', // Rose
        glow: 'rgba(225, 29, 72, 0.45)',
        border: '#ffffff',
        badgeBg: 'bg-rose-600 text-white',
      };
    case 'Idle':
      return {
        bg: '#d97706', // Amber
        glow: 'rgba(217, 119, 6, 0.4)',
        border: '#ffffff',
        badgeBg: 'bg-amber-600 text-white',
      };
    case 'Offline':
    default:
      return {
        bg: '#475569', // Slate
        glow: 'rgba(71, 85, 105, 0.3)',
        border: '#ffffff',
        badgeBg: 'bg-slate-600 text-white',
      };
  }
};

/**
 * Creates custom Leaflet HTML DivIcon for vehicles
 */
export const createVehicleDivIcon = (
  vehicle: TrackingVehicle,
  isSelected: boolean = false
): L.DivIcon => {
  const colors = getStatusColors(vehicle.status);
  const isMoving = vehicle.telemetry.speedMph > 0;
  const isDelayed = vehicle.status === 'Delayed';
  const heading = vehicle.telemetry.headingDegrees || 0;

  const pulseRingHtml = (isMoving || isDelayed || isSelected)
    ? `<div class="pulse-ring" style="background-color: ${colors.glow};"></div>`
    : '';

  const selectedRingHtml = isSelected
    ? `<div class="absolute -inset-2.5 rounded-2xl border-2 border-blue-500 animate-ping opacity-75 pointer-events-none"></div>`
    : '';

  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" class="text-white">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  `;

  const arrowSvg = isMoving
    ? `
      <div class="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200" style="transform: rotate(${heading}deg);">
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor" class="text-blue-600">
          <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
        </svg>
      </div>
    `
    : '';

  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-150 select-none" style="transform: translate(-50%, -50%);">
      ${selectedRingHtml}
      ${pulseRingHtml}
      
      <!-- Marker Body -->
      <div class="relative flex items-center justify-center w-9 h-9 rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-110 ${isSelected ? 'ring-3 ring-blue-500 ring-offset-2 scale-105' : ''}"
           style="background-color: ${colors.bg}; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px ${colors.glow};">
        ${iconSvg}
        ${arrowSvg}
      </div>

      <!-- Vehicle Tag Badge -->
      <div class="mt-1 px-1.5 py-0.5 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black rounded-md shadow-sm border border-slate-200/90 whitespace-nowrap tracking-tight pointer-events-none">
        ${vehicle.vehicleNumber}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-vehicle-marker-container',
    iconSize: [44, 52],
    iconAnchor: [22, 26],
    popupAnchor: [0, -28],
  });
};

/**
 * Creates Pickup Location Pin Leaflet Icon
 */
export const createPickupDivIcon = (name: string): L.DivIcon => {
  const shortName = (name || 'Origin').split(' ')[0];
  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer select-none" style="transform: translate(-50%, -100%);">
      <div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <div class="mt-0.5 px-2 py-0.5 bg-white/95 text-emerald-800 text-[10px] font-bold rounded-md shadow-sm border border-emerald-200 whitespace-nowrap">
        Origin: ${shortName}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pickup-marker',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46],
  });
};

/**
 * Creates Destination Delivery Pin Leaflet Icon
 */
export const createDestinationDivIcon = (name: string): L.DivIcon => {
  const shortName = (name || 'Dest').split(' ')[0];
  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer select-none" style="transform: translate(-50%, -100%);">
      <div class="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
          <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
      </div>
      <div class="mt-0.5 px-2 py-0.5 bg-white/95 text-indigo-800 text-[10px] font-bold rounded-md shadow-sm border border-indigo-200 whitespace-nowrap">
        Dest: ${shortName}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-destination-marker',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46],
  });
};

/**
 * Generates popup HTML markup for a vehicle
 */
export const generateVehiclePopupHtml = (vehicle: TrackingVehicle): string => {
  const isMoving = vehicle.telemetry.speedMph > 0;
  const statusColorClass =
    vehicle.status === 'In Transit'
      ? 'background: #2563eb; color: #ffffff;'
      : vehicle.status === 'Active'
      ? 'background: #059669; color: #ffffff;'
      : vehicle.status === 'Delayed'
      ? 'background: #e11d48; color: #ffffff;'
      : vehicle.status === 'Idle'
      ? 'background: #d97706; color: #ffffff;'
      : 'background: #475569; color: #ffffff;';

  return `
    <div style="min-width: 230px; font-family: system-ui, -apple-system, sans-serif; color: #1e293b; padding: 2px;">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 8px;">
        <div>
          <div style="font-weight: 800; font-size: 15px; color: #0f172a; line-height: 1.2;">${vehicle.vehicleNumber}</div>
          <div style="font-size: 11px; color: #64748b; font-weight: 500;">${vehicle.model}</div>
        </div>
        <span style="display: inline-block; padding: 2.5px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em; ${statusColorClass}">
          ${vehicle.status}
        </span>
      </div>

      <!-- Driver & Shipment Info Grid -->
      <div style="font-size: 11.5px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 4.5px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="color: #64748b; font-weight: 500;">Driver:</span>
          <span style="font-weight: 700; color: #0f172a;">${vehicle.driver.name}</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="color: #64748b; font-weight: 500;">Shipment:</span>
          <span style="font-weight: 700; color: #2563eb;">${vehicle.shipment.id}</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="color: #64748b; font-weight: 500;">Live Speed:</span>
          <span style="font-weight: 700; color: ${isMoving ? '#059669' : '#64748b'};">${vehicle.telemetry.speedMph} mph</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="color: #64748b; font-weight: 500;">Estimated ETA:</span>
          <span style="font-weight: 700; color: #4f46e5;">${vehicle.route.estimatedTimeRemaining}</span>
        </div>
      </div>

      <!-- Route Progress Bar -->
      ${
        vehicle.route.totalDistanceKm > 0
          ? `
        <div style="margin-bottom: 10px; background: #f8fafc; padding: 6px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b; margin-bottom: 3px; font-weight: 600;">
            <span>Route Progress</span>
            <span style="font-weight: 800; color: #0f172a;">${vehicle.route.progressPercent}%</span>
          </div>
          <div style="width: 100%; height: 5px; background-color: #e2e8f0; border-radius: 9999px; overflow: hidden;">
            <div style="width: ${vehicle.route.progressPercent}%; height: 100%; background: linear-gradient(90deg, #2563eb, #4f46e5); border-radius: 9999px;"></div>
          </div>
        </div>
      `
          : ''
      }

      <!-- Action Button -->
      <button 
        id="popup-btn-${vehicle.id}" 
        style="width: 100%; padding: 7px 12px; background: #2563eb; color: #ffffff; font-size: 11px; font-weight: 700; border-radius: 9px; border: none; cursor: pointer; text-align: center; transition: all 0.15s; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);"
        onmouseover="this.style.background='#1d4ed8'"
        onmouseout="this.style.background='#2563eb'"
      >
        Track Vehicle & Telemetry →
      </button>
    </div>
  `;
};
