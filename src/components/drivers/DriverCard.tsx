import React from 'react';
import {
  Phone,
  Mail,
  Truck,
  Star,
  Eye,
  Edit2,
  Trash2,
  CreditCard,
  Clock,
} from 'lucide-react';
import { Driver, DriverStatus } from '../../types/driver';

interface DriverCardProps {
  driver: Driver;
  onViewDetails: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        );
      case 'On Duty':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            On Duty
          </span>
        );
      case 'Off Duty':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Off Duty
          </span>
        );
      case 'On Leave':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            On Leave
          </span>
        );
    }
  };

  const isAssigned = driver.assignedVehicle && driver.assignedVehicle !== 'Unassigned';

  return (
    <div
      onClick={() => onViewDetails(driver)}
      className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group cursor-pointer text-slate-800"
    >
      <div>
        {/* Top Header: Avatar, Name, ID & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
                }}
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  driver.status === 'Available'
                    ? 'bg-emerald-500'
                    : driver.status === 'On Duty'
                    ? 'bg-blue-500'
                    : driver.status === 'On Leave'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {driver.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                  {driver.id}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {driver.experienceYears} yrs exp.
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">{getStatusBadge(driver.status)}</div>
        </div>

        {/* Assigned Vehicle Box */}
        <div
          className={`p-2.5 rounded-xl border mb-3 flex items-center gap-2 text-xs ${
            isAssigned
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <Truck
            className={`w-4 h-4 flex-shrink-0 ${isAssigned ? 'text-blue-600' : 'text-slate-400'}`}
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">
              Assigned Vehicle
            </span>
            <p className="font-bold truncate text-[11px]">
              {isAssigned ? driver.assignedVehicle : 'No Vehicle Assigned (Yard Pool)'}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-medium truncate text-slate-800">{driver.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate text-slate-500 text-[11px]">{driver.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-mono text-[11px] text-slate-600">
              {driver.licenseNumber} (Exp: {driver.licenseExpiry})
            </span>
          </div>
        </div>

        {/* Quick Performance Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-center mb-4">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Rating</span>
            <span className="text-xs font-black text-slate-900 font-mono flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              {driver.performance.rating}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">On-Time</span>
            <span className="text-xs font-black text-blue-600 font-mono">
              {driver.performance.onTimeRate}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Deliveries</span>
            <span className="text-xs font-black text-emerald-600 font-mono">
              {driver.performance.completedDeliveries}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div
        className="pt-3 border-t border-slate-200 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onViewDetails(driver)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 py-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(driver)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Edit Driver"
            aria-label="Edit Driver"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(driver)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Driver"
            aria-label="Delete Driver"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
