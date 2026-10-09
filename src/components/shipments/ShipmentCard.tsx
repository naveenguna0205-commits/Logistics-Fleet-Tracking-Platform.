import React from 'react';
import {
  Package,
  MapPin,
  Calendar,
  User,
  Truck,
  Eye,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  DollarSign,
  Weight,
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../../types/shipment';

interface ShipmentCardProps {
  shipment: Shipment;
  onViewDetails: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({
  shipment,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            In Transit
          </span>
        );
      case 'Picked Up':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3 h-3 text-indigo-600" />
            Picked Up
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Delayed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <XCircle className="w-3 h-3 text-slate-500" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onViewDetails(shipment)}
      className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group cursor-pointer text-slate-800"
    >
      <div>
        {/* Top Header: ID & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 font-mono text-xs">
                  {shipment.id}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {shipment.priority}
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-800 line-clamp-1 mt-0.5">
                {shipment.customerName}
              </h3>
            </div>
          </div>

          <div className="shrink-0">{getStatusBadge(shipment.status)}</div>
        </div>

        {/* Route Origin -> Destination */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="truncate max-w-[110px] text-[11px]">{shipment.pickupLocation}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mx-1" />
            <div className="flex items-center gap-1.5 min-w-0 justify-end">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate max-w-[110px] text-[11px]">{shipment.deliveryLocation}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {shipment.shipmentDate}
            </span>
            <span className="font-semibold text-slate-700">
              Exp: {shipment.expectedDelivery}
            </span>
          </div>
        </div>

        {/* Driver & Vehicle pills */}
        <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 min-w-0">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              {shipment.assignedDriver}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 min-w-0">
            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              {shipment.assignedVehicle}
            </span>
          </div>
        </div>

        {/* Package Specs & Cost */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-1">
          <span className="flex items-center gap-1 font-medium">
            <Weight className="w-3.5 h-3.5 text-slate-400" />
            {shipment.packageWeight.toLocaleString()} kg • {shipment.packageType}
          </span>
          <span className="font-mono font-bold text-slate-900 text-xs">
            ${shipment.cost.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div
        className="pt-3 border-t border-slate-200 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onViewDetails(shipment)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 py-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(shipment)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Edit Shipment"
            aria-label="Edit Shipment"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(shipment)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Shipment"
            aria-label="Delete Shipment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
