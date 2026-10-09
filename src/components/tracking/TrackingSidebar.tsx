import React, { useState } from 'react';
import {
  Truck,
  User,
  MapPin,
  Clock,
  Gauge,
  Fuel,
  BatteryCharging,
  Package,
  ChevronRight,
  AlertTriangle,
  Compass,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { TrackingVehicle, TrackingVehicleStatus } from '../../types/tracking';

interface TrackingSidebarProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string) => void;
  isLoading?: boolean;
  heightClass?: string;
}

export const TrackingSidebar: React.FC<TrackingSidebarProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  isLoading = false,
  heightClass = 'h-[880px] lg:h-[920px]',
}) => {
  const [activeTab, setActiveTab] = useState<TrackingVehicleStatus | 'All'>('All');

  const tabs: { key: TrackingVehicleStatus | 'All'; label: string; count: number }[] = [
    { key: 'All', label: 'All', count: vehicles.length },
    { key: 'In Transit', label: 'In Transit', count: vehicles.filter((v) => v.status === 'In Transit').length },
    { key: 'Active', label: 'Active', count: vehicles.filter((v) => v.status === 'Active').length },
    { key: 'Delayed', label: 'Delayed', count: vehicles.filter((v) => v.status === 'Delayed').length },
    { key: 'Idle', label: 'Idle', count: vehicles.filter((v) => v.status === 'Idle').length },
  ];

  const filteredVehicles =
    activeTab === 'All'
      ? vehicles
      : vehicles.filter((v) => v.status === activeTab);

  const getStatusBadge = (status: TrackingVehicleStatus) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            In Transit
          </span>
        );
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Active
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping opacity-75"></span>
            Delayed
          </span>
        );
      case 'Idle':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Idle
          </span>
        );
      case 'Offline':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Offline
          </span>
        );
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col ${heightClass} overflow-hidden text-slate-800`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Fleet Live List
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200">
            {vehicles.length} Units
          </span>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1 py-0.2 rounded-full font-bold ${
                  activeTab === tab.key
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles List Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500">Syncing telemetry...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <Truck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              No Vehicles Found
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              No fleet units match the current category or search criteria.
            </p>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => {
            const isSelected = vehicle.id === selectedVehicleId;
            const isMoving = vehicle.telemetry.speedMph > 0;

            return (
              <div
                key={vehicle.id}
                onClick={() => onSelectVehicle(vehicle.id)}
                className={`pt-2.5 first:pt-0 cursor-pointer group rounded-xl p-2.5 transition-all duration-150 relative ${
                  isSelected
                    ? 'bg-blue-50/60 border-2 border-blue-500 shadow-sm'
                    : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <span className="absolute left-0 top-3 bottom-3 w-1.5 bg-blue-600 rounded-r-full" />
                )}

                {/* Top Row: Vehicle No, Model & Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                        {vehicle.vehicleNumber}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {vehicle.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[170px]">
                      {vehicle.model}
                    </p>
                  </div>
                  {getStatusBadge(vehicle.status)}
                </div>

                {/* Driver Info */}
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={vehicle.driver.avatar}
                    alt={vehicle.driver.name}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {vehicle.driver.name}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto font-mono">
                    {vehicle.telemetry.lastPingTimestamp}
                  </span>
                </div>

                {/* Current Location */}
                <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="truncate font-medium">{vehicle.currentLocation.name}</span>
                </div>

                {/* Shipment & ETA Row */}
                {vehicle.shipment && vehicle.shipment.id && (
                  <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg mb-2">
                    <span className="flex items-center gap-1 font-bold text-blue-600 text-[11px]">
                      <Package className="w-3.5 h-3.5" />
                      {vehicle.shipment.id}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ETA: {vehicle.route.estimatedTimeRemaining}
                    </span>
                  </div>
                )}

                {/* Speed & Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Gauge className="w-3 h-3 text-slate-400" />
                      <strong className={isMoving ? 'text-emerald-600' : 'text-slate-700'}>
                        {vehicle.telemetry.speedMph} mph
                      </strong>
                    </span>

                    <span className="flex items-center gap-1">
                      {vehicle.telemetry.isElectric ? (
                        <>
                          <BatteryCharging className="w-3 h-3 text-emerald-600" />
                          <span>{vehicle.telemetry.batterySocPercent}% SoC</span>
                        </>
                      ) : (
                        <>
                          <Fuel className="w-3 h-3 text-amber-600" />
                          <span>{vehicle.telemetry.fuelLevelPercent}% Fuel</span>
                        </>
                      )}
                    </span>

                    {vehicle.route.totalDistanceKm > 0 && (
                      <span className="font-bold text-slate-800">
                        {vehicle.route.progressPercent}%
                      </span>
                    )}
                  </div>

                  {vehicle.route.totalDistanceKm > 0 && (
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${vehicle.route.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
