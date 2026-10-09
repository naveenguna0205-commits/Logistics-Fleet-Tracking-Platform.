import React, { useState } from 'react';
import {
  X,
  Truck,
  User,
  Fuel,
  Gauge,
  Calendar,
  Wrench,
  Activity,
  MapPin,
  Shield,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../../types/vehicle';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'activity'>('overview');

  if (!isOpen || !vehicle) return null;

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Active (In Service)
          </span>
        );
      case 'Idle':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Idle (Yard Staged)
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
            Under Maintenance
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Offline / Out of Service
          </span>
        );
    }
  };

  const getFuelColor = (level: number) => {
    if (level <= 20) return 'bg-rose-500';
    if (level <= 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-slate-900 font-mono tracking-tight">
                  {vehicle.vehicleNumber}
                </h2>
                {getStatusBadge(vehicle.status)}
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {vehicle.model} • {vehicle.year} • {vehicle.type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(vehicle);
              }}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Edit Vehicle"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(vehicle);
              }}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Delete Vehicle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-100 flex gap-6 bg-slate-50/50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Vehicle Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'maintenance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Maintenance & Service ({vehicle.serviceHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Recent Activity ({vehicle.recentActivities.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top 4 Quick Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-semibold">
                    <Fuel className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fuel Level</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 font-mono">
                    {vehicle.fuelLevel}%
                  </p>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getFuelColor(vehicle.fuelLevel)}`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-semibold">
                    <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Odometer</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 font-mono">
                    {vehicle.mileage.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">km recorded</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Last Service</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 font-mono mt-1">
                    {vehicle.lastServiceDate}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold">Passed Inspection</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Location</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate mt-1">
                    {vehicle.currentLocation || 'Central Yard'}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">GPS Telemetry On</span>
                </div>
              </div>

              {/* Driver & Technical Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Assigned Driver Box */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Assigned Driver</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-sm">
                      {vehicle.driver.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{vehicle.driver}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {vehicle.driverPhone || 'No contact phone listed'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span>CDL License Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Valid & Compliant
                    </span>
                  </div>
                </div>

                {/* Technical Specs Box */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Technical & Registration</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">License Plate:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {vehicle.licensePlate || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">VIN Number:</span>
                      <span className="font-mono text-slate-600 text-[11px]">
                        {vehicle.vin || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Fuel Tank Capacity:</span>
                      <span className="font-semibold text-slate-800">
                        {vehicle.fuelCapacity} Gallons / {Math.round(vehicle.fuelCapacity * 3.785)} L
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MAINTENANCE HISTORY */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Service Logs & Maintenance Records
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Total Cost: $
                  {vehicle.serviceHistory
                    .reduce((acc, curr) => acc + curr.cost, 0)
                    .toLocaleString()}
                </span>
              </div>

              {vehicle.serviceHistory.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">
                  No service records logged yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {vehicle.serviceHistory.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-amber-600" />
                          <h4 className="text-xs font-bold text-slate-900">{srv.type}</h4>
                        </div>
                        <span className="text-xs font-mono font-extrabold text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-xs">
                          ${srv.cost}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{srv.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Date: {srv.date}</span>
                        </div>
                        <div>
                          <span>Technician: <strong className="text-slate-700">{srv.technician}</strong></span>
                        </div>
                        <div className="font-mono">
                          <span>Odometer: {srv.odometer.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECENT ACTIVITIES */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                Live Telemetry & Trip Activity Logs
              </h3>

              {vehicle.recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">
                  No recent activities recorded for this vehicle.
                </p>
              ) : (
                <div className="space-y-3">
                  {vehicle.recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mt-0.5 flex-shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {act.description}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                            {act.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{act.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">VIN: {vehicle.vin}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
