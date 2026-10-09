import React from 'react';
import {
  Users,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Truck,
  Star,
  CreditCard,
  Clock,
} from 'lucide-react';
import { Driver, DriverStatus } from '../../types/driver';

interface DriverTableProps {
  drivers: Driver[];
  onViewDetails: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        );
      case 'On Duty':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            On Duty
          </span>
        );
      case 'Off Duty':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Off Duty
          </span>
        );
      case 'On Leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            On Leave
          </span>
        );
    }
  };

  if (drivers.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No drivers match your criteria</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search query, changing status filters, or adding a new driver to your fleet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Driver</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">License</th>
              <th className="py-3.5 px-4">Assigned Vehicle</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Experience</th>
              <th className="py-3.5 px-4">Performance</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {drivers.map((drv) => {
              const isAssigned = drv.assignedVehicle && drv.assignedVehicle !== 'Unassigned';
              return (
                <tr
                  key={drv.id}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => onViewDetails(drv)}
                >
                  {/* Driver Profile Photo & Name & ID */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={drv.avatar}
                          alt={drv.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            drv.status === 'Available'
                              ? 'bg-emerald-500'
                              : drv.status === 'On Duty'
                              ? 'bg-blue-500'
                              : drv.status === 'On Leave'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {drv.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                            {drv.id}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {drv.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{drv.phone}</span>
                    </div>
                  </td>

                  {/* License Number & Expiry */}
                  <td className="py-3.5 px-4">
                    <div>
                      <div className="flex items-center gap-1 font-mono font-semibold text-slate-800 text-[11px]">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{drv.licenseNumber}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Exp: {drv.licenseExpiry}
                      </span>
                    </div>
                  </td>

                  {/* Assigned Vehicle */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg border ${
                          isAssigned
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`font-semibold max-w-[170px] truncate text-[11px] ${
                          isAssigned ? 'text-slate-900' : 'text-slate-400 italic'
                        }`}
                      >
                        {isAssigned ? drv.assignedVehicle : 'Unassigned'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">{getStatusBadge(drv.status)}</td>

                  {/* Experience */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 font-mono">
                        {drv.experienceYears}
                      </span>
                      <span className="text-slate-500 text-[11px]">years</span>
                    </div>
                  </td>

                  {/* Performance Mini Rating */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-700 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{drv.performance.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {drv.performance.onTimeRate}% on-time
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 sm:px-6 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(drv)}
                        title="View Driver Details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        aria-label="View Driver Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(drv)}
                        title="Edit Driver"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        aria-label="Edit Driver"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(drv)}
                        title="Delete Driver"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        aria-label="Delete Driver"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span>
          Displaying <strong className="text-slate-800">{drivers.length}</strong> driver records
        </span>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Click any row for complete driver dossier & telemetry
        </span>
      </div>
    </div>
  );
};
