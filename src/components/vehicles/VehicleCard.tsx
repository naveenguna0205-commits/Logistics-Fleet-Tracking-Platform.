import React from 'react';
import {
  Truck,
  Eye,
  Edit2,
  Trash2,
  Fuel,
  Calendar,
  User,
  Gauge,
  MapPin,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../../types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Active
          </span>
        );
      case 'Idle':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Idle
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Wrench className="w-2.5 h-2.5 text-amber-600" />
            Maintenance
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
            Offline
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
    <div
      onClick={() => onViewDetails(vehicle)}
      className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group"
    >
      {/* Card Header: Icon + Number + Status */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-extrabold text-slate-900 text-sm">
                  {vehicle.vehicleNumber}
                </h3>
                <span className="text-[10px] font-mono text-slate-400">#{vehicle.id}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {vehicle.model} ({vehicle.year})
              </p>
            </div>
          </div>
          {getStatusBadge(vehicle.status)}
        </div>

        {/* Type & Driver Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-500 font-medium">Type:</span>
            <span className="font-semibold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 text-[11px]">
              {vehicle.type}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>Driver:</span>
            </span>
            <span
              className={`font-semibold truncate max-w-[150px] ${
                vehicle.driver === 'Unassigned' ? 'text-slate-400 italic' : 'text-slate-800'
              }`}
            >
              {vehicle.driver}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location:</span>
            </span>
            <span className="text-slate-800 font-medium truncate max-w-[150px] text-[11px]">
              {vehicle.currentLocation || 'In Transit'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              <span>Mileage:</span>
            </span>
            <span className="font-mono font-semibold text-slate-800 text-[11px]">
              {vehicle.mileage.toLocaleString()} km
            </span>
          </div>
        </div>

        {/* Fuel Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>Fuel Tank</span>
            </span>
            <span className="font-mono font-bold text-slate-900">{vehicle.fuelLevel}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getFuelColor(
                vehicle.fuelLevel
              )}`}
              style={{ width: `${vehicle.fuelLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer: Last Service & Quick Action Buttons */}
      <div
        className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Serviced: {vehicle.lastServiceDate}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(vehicle)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(vehicle)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Edit Vehicle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(vehicle)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
