import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Phone,
  Radio,
  Thermometer,
  ShieldCheck,
  Share2,
  X,
  CloudSun,
  Gauge,
  Fuel,
  BatteryCharging,
} from 'lucide-react';
import { TrackingVehicle, ShipmentStageInfo } from '../../types/tracking';

interface TrackingDetailsProps {
  vehicle: TrackingVehicle | null;
  onClose: () => void;
  onFocusMap?: () => void;
  onSelectShipment?: (shipmentId: string) => void;
}

export const TrackingDetails: React.FC<TrackingDetailsProps> = ({
  vehicle,
  onClose,
  onFocusMap,
}) => {
  const [activeTab, setActiveTab] = useState<'route' | 'shipment' | 'telemetry'>('route');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleShare = () => {
    if (!vehicle) return;
    navigator.clipboard?.writeText(
      `${window.location.origin}/tracking?vehicle=${vehicle.vehicleNumber}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // If no vehicle is selected, render friendly overview & prompt
  if (!vehicle) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 text-center h-full flex flex-col justify-center items-center text-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
          <Navigation className="w-8 h-8 stroke-[1.8] animate-bounce" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          No Vehicle Selected
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
          Select any vehicle marker on the interactive map or click from the fleet sidebar to inspect live telemetry, highway waypoints, driver data, and 5-stage shipment routing.
        </p>

        <div className="w-full max-w-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Live Fleet Quick Tips:
          </div>
          <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
            <li>Click markers for vehicle popups</li>
            <li>Zoom and pan across nationwide routes</li>
            <li>Use the simulation controls to watch vehicles move</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full overflow-hidden text-slate-800">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/70">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 flex-shrink-0">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {vehicle.vehicleNumber}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {vehicle.status}
                </span>
                {vehicle.alertMessage && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Alert
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {vehicle.model} • License: {vehicle.licensePlate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Share / Copy Live Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="Close Details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Driver Quick Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={vehicle.driver.avatar}
              alt={vehicle.driver.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {vehicle.driver.name}
              </p>
              <p className="text-[11px] text-slate-500">
                Driver • Rating: ⭐ {vehicle.driver.rating} ({vehicle.driver.experienceYears} yrs exp)
              </p>
            </div>
          </div>

          <a
            href={`tel:${vehicle.driver.phone}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Call</span>
          </a>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/80">
          <button
            onClick={() => setActiveTab('route')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'route'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Route Details
          </button>
          <button
            onClick={() => setActiveTab('shipment')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'shipment'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Shipment Flow
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'telemetry'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Live Telemetry
          </button>
        </div>
      </div>

      {/* Copy Alert Notification */}
      {copiedLink && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-1 px-3 text-center animate-in fade-in">
          ✓ Direct Live Tracking link copied to clipboard!
        </div>
      )}

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* ================= TAB 1: ROUTE DETAILS ================= */}
        {activeTab === 'route' && (
          <div className="space-y-4">
            {/* Visual Route Progress Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">
                  Corridor Progress
                </span>
                <span className="text-blue-600 font-extrabold text-sm">
                  {vehicle.route.progressPercent}% Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 rounded-full transition-all duration-300 shadow-xs"
                  style={{ width: `${vehicle.route.progressPercent}%` }}
                />
              </div>

              {/* Distance Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Traveled</span>
                  <strong className="text-xs text-slate-900">
                    {vehicle.route.distanceTraveledKm} km
                  </strong>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Remaining</span>
                  <strong className="text-xs text-blue-600">
                    {vehicle.route.remainingDistanceKm} km
                  </strong>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Est. Arrival</span>
                  <strong className="text-xs text-emerald-600">
                    {vehicle.route.estimatedTimeRemaining}
                  </strong>
                </div>
              </div>
            </div>

            {/* Locations Route Stepper */}
            <div className="space-y-3 relative pl-3 border-l-2 border-blue-200 ml-2">
              {/* Pickup */}
              <div className="relative pl-4">
                <span className="absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-600 uppercase tracking-wider text-[10px]">
                    Pickup Location
                  </span>
                  <h4 className="font-bold text-slate-900">
                    {vehicle.route.pickup.name}
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    {vehicle.route.pickup.address}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5 font-medium">
                    Departed: {vehicle.route.pickup.departureTime}
                  </p>
                </div>
              </div>

              {/* Current Location */}
              <div className="relative pl-4 pt-2">
                <span className="absolute -left-[19px] top-3 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-100 animate-pulse" />
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
                  <span className="font-bold text-blue-700 uppercase tracking-wider text-[10px]">
                    Current Telemetry GPS
                  </span>
                  <h4 className="font-bold text-slate-900">
                    {vehicle.currentLocation.name}
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    {vehicle.currentLocation.address}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-slate-700 font-mono">
                    <span>Speed: {vehicle.telemetry.speedMph} mph</span>
                    <span>•</span>
                    <span>Heading: {vehicle.telemetry.headingDegrees}° ({vehicle.telemetry.headingDirection})</span>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="relative pl-4 pt-2">
                <span className="absolute -left-[19px] top-3 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                <div className="text-xs">
                  <span className="font-bold text-indigo-600 uppercase tracking-wider text-[10px]">
                    Destination Terminal
                  </span>
                  <h4 className="font-bold text-slate-900">
                    {vehicle.route.destination.name}
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    {vehicle.route.destination.address}
                  </p>
                  <p className="text-indigo-600 font-bold text-[11px] mt-0.5">
                    Target ETA: {vehicle.route.destination.estimatedArrival}
                  </p>
                </div>
              </div>
            </div>

            {/* Weather & Road Condition Banner */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="font-bold text-slate-900">
                    {vehicle.telemetry.weatherCondition || 'Clear'}
                  </p>
                  <p className="text-[10px] text-slate-500">Road Corridor Weather</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    vehicle.telemetry.trafficCondition === 'Clear'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {vehicle.telemetry.trafficCondition} Traffic
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SHIPMENT TRACKING STAGES ================= */}
        {activeTab === 'shipment' && (
          <div className="space-y-4">
            {/* Shipment Overview Header */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  Shipment: {vehicle.shipment.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                  {vehicle.shipment.priority}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-900">
                Customer: {vehicle.shipment.customerName}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>Cargo: {vehicle.shipment.packageType}</span>
                {vehicle.shipment.weightKg > 0 && <span>Weight: {vehicle.shipment.weightKg.toLocaleString()} kg</span>}
              </div>
            </div>

            {/* 5-Stage Visual Workflow */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                5-Stage Journey Progress
              </h4>

              <div className="space-y-2">
                {vehicle.stages.map((stage: ShipmentStageInfo, index: number) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div key={stage.key} className="relative">
                      {/* Step Item Box */}
                      <div
                        className={`p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-blue-50/70 border-2 border-blue-500 shadow-sm'
                            : isCompleted
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-50/60 border-dashed border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Stage Status Icon */}
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                              </div>
                            ) : isCurrent ? (
                              <div className="relative flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                  {index + 1}
                                </div>
                                <span className="absolute -inset-1 rounded-full border-2 border-blue-500 animate-ping opacity-60 pointer-events-none" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                                {index + 1}
                              </div>
                            )}
                          </div>

                          {/* Stage Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h5
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-blue-700'
                                    : isCompleted
                                    ? 'text-slate-900'
                                    : 'text-slate-500'
                                }`}
                              >
                                {stage.title}
                              </h5>
                              <span className="text-[10px] font-semibold text-slate-500 font-mono">
                                {stage.time}
                              </span>
                            </div>

                            <p className="text-[11px] font-medium text-slate-700">
                              {stage.subtitle}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {stage.location}
                            </p>

                            {stage.notes && (
                              <p className="text-[10px] text-blue-600 mt-1 italic">
                                Note: {stage.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Downward Connector Arrow */}
                      {index < vehicle.stages.length - 1 && (
                        <div className="flex justify-center my-0.5">
                          <div className="w-0.5 h-3 bg-slate-200 rounded" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LIVE TELEMETRY ================= */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Speed Gauge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  Speed Telemetry
                </span>
                <p className="text-lg font-black text-slate-900">
                  {vehicle.telemetry.speedMph}{' '}
                  <span className="text-xs font-normal text-slate-500">mph</span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {vehicle.telemetry.speedKmh} km/h • Heading {vehicle.telemetry.headingDirection}
                </p>
              </div>

              {/* Fuel / Battery Gauge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  {vehicle.telemetry.isElectric ? (
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {vehicle.telemetry.isElectric ? 'Battery Level' : 'Fuel Level'}
                </span>
                <p className="text-lg font-black text-slate-900">
                  {vehicle.telemetry.isElectric
                    ? `${vehicle.telemetry.batterySocPercent}%`
                    : `${vehicle.telemetry.fuelLevelPercent}%`}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {vehicle.telemetry.isElectric
                    ? 'EV Powertrain Active'
                    : `${vehicle.telemetry.fuelCapacityGallons || 150} Gallon Tank`}
                </p>
              </div>

              {/* Engine Temp */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                  Engine Temp
                </span>
                <p className="text-lg font-black text-slate-900">
                  {vehicle.telemetry.engineTempC}°C
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">
                  Normal Operating Range
                </p>
              </div>

              {/* Tire Pressure */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Tire Pressure
                </span>
                <p className="text-lg font-black text-slate-900">
                  {vehicle.telemetry.tirePressurePsi}{' '}
                  <span className="text-xs font-normal text-slate-500">PSI</span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  All 10 Sensors In Spec
                </p>
              </div>
            </div>

            {/* Driver Duty Hours Progress */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  DOT HOS Duty Clock: {vehicle.telemetry.driverDutyHours} / {vehicle.telemetry.maxDutyHours} hrs
                </span>
                <span className="text-[10px] font-semibold text-emerald-600">
                  Compliant
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (vehicle.telemetry.driverDutyHours / vehicle.telemetry.maxDutyHours) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* GPS Signal & Odometer Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  GPS Signal Strength:
                </span>
                <span className="font-bold text-emerald-600">
                  {vehicle.telemetry.signalStrength} ({vehicle.telemetry.signalPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span>Odometer: {vehicle.telemetry.odometerKm.toLocaleString()} km</span>
                <span>Ping: {vehicle.telemetry.lastPingTimestamp}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Bottom Actions */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-2">
        {onFocusMap && (
          <button
            onClick={onFocusMap}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/25 flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            Focus Map Route
          </button>
        )}
        <button
          onClick={onClose}
          className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs transition-colors"
        >
          Deselect
        </button>
      </div>
    </div>
  );
};
