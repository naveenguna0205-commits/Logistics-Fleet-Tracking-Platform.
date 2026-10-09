import React from 'react';
import {
  Truck,
  Eye,
  Edit2,
  Trash2,
  Fuel,
  Calendar,
  User,
  AlertCircle,
  Wrench,
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../../types/vehicle';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onViewDetails: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Active
          </span>
        );
      case 'Idle':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Idle
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Wrench className="w-3 h-3 text-amber-600" />
            Maintenance
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
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

  const getFuelTextColor = (level: number) => {
    if (level <= 20) return 'text-rose-600 font-bold';
    if (level <= 50) return 'text-amber-600 font-bold';
    return 'text-emerald-600 font-bold';
  };

  if (vehicles.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Truck className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No vehicles match your criteria</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search query, changing status filters, or adding a new vehicle to your fleet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Vehicle</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Driver</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Fuel Level</th>
              <th className="py-3.5 px-4">Last Service</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {vehicles.map((v) => (
              <tr
                key={v.id}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onViewDetails(v)}
              >
                {/* Vehicle ID / Number & Model */}
                <td className="py-3.5 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 font-mono text-xs">
                          {v.vehicleNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({v.id})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[180px]">
                        {v.model} ({v.year})
                      </span>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold">
                    {v.type}
                  </span>
                </td>

                {/* Driver */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span
                      className={`font-semibold truncate max-w-[140px] ${
                        v.driver === 'Unassigned' ? 'text-slate-400 italic' : 'text-slate-800'
                      }`}
                    >
                      {v.driver}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">{getStatusBadge(v.status)}</td>

                {/* Fuel Level */}
                <td className="py-3.5 px-4">
                  <div className="w-28">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Fuel className="w-3 h-3 text-slate-400" />
                        <span className={getFuelTextColor(v.fuelLevel)}>{v.fuelLevel}%</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {Math.round((v.fuelLevel / 100) * v.fuelCapacity)}/{v.fuelCapacity} gal
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getFuelColor(
                          v.fuelLevel
                        )}`}
                        style={{ width: `${v.fuelLevel}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Last Service */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{v.lastServiceDate}</span>
                  </div>
                </td>

                {/* Actions */}
                <td
                  className="py-3.5 px-4 sm:px-6 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onViewDetails(v)}
                      title="View Details"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(v)}
                      title="Edit Vehicle"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      aria-label="Edit Vehicle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(v)}
                      title="Delete Vehicle"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label="Delete Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-900">{vehicles.length}</strong> vehicles in fleet registry
        </span>
        <span className="text-[11px] text-slate-400">Click any row to view full details</span>
      </div>
    </div>
  );
};
