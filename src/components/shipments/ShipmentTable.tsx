import React from 'react';
import {
  Package,
  Eye,
  Edit2,
  Trash2,
  Phone,
  User,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../../types/shipment';

interface ShipmentTableProps {
  shipments: Shipment[];
  onViewDetails: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            In Transit
          </span>
        );
      case 'Picked Up':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3 h-3 text-indigo-600" />
            Picked Up
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Delayed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <XCircle className="w-3 h-3 text-slate-500" />
            Cancelled
          </span>
        );
    }
  };

  if (shipments.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Package className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No shipments match your criteria</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search terms, status filters, or create a new shipment manifest.
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
              <th className="py-3.5 px-4 sm:px-6">Shipment ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Origin / Destination Route</th>
              <th className="py-3.5 px-4">Driver</th>
              <th className="py-3.5 px-4">Vehicle</th>
              <th className="py-3.5 px-4">Shipment Date</th>
              <th className="py-3.5 px-4">Expected Delivery</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {shipments.map((shp) => (
              <tr
                key={shp.id}
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onViewDetails(shp)}
              >
                {/* Shipment ID & Package Type */}
                <td className="py-3.5 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 font-mono text-xs">
                          {shp.id}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[130px]">
                        {shp.packageType}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="py-3.5 px-4">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate max-w-[160px]">
                      {shp.customerName}
                    </p>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {shp.customerPhone}
                    </span>
                  </div>
                </td>

                {/* Origin -> Destination */}
                <td className="py-3.5 px-4">
                  <div className="min-w-0 max-w-[210px]">
                    <div className="flex items-center gap-1 text-[11px] text-slate-800 font-semibold truncate">
                      <span className="truncate">{shp.pickupLocation.split(',')[0]}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{shp.deliveryLocation.split(',')[0]}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {shp.packageWeight.toLocaleString()} kg • ${shp.cost}
                    </span>
                  </div>
                </td>

                {/* Assigned Driver */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span
                      className={`font-semibold truncate max-w-[130px] ${
                        shp.assignedDriver === 'Unassigned'
                          ? 'text-slate-400 italic'
                          : 'text-slate-900'
                      }`}
                    >
                      {shp.assignedDriver}
                    </span>
                  </div>
                </td>

                {/* Assigned Vehicle */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span
                      className={`font-semibold truncate max-w-[140px] text-[11px] ${
                        shp.assignedVehicle === 'Unassigned'
                          ? 'text-slate-400 italic'
                          : 'text-slate-900'
                      }`}
                    >
                      {shp.assignedVehicle.split(' ')[0]}
                    </span>
                  </div>
                </td>

                {/* Shipment Date */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-slate-700 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shp.shipmentDate}</span>
                  </div>
                </td>

                {/* Expected Delivery */}
                <td className="py-3.5 px-4">
                  <div className="text-[11px]">
                    <span className="font-semibold text-slate-900">{shp.expectedDelivery}</span>
                    {shp.actualDelivery && (
                      <span className="text-[10px] text-emerald-600 block">Delivered on-time</span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">{getStatusBadge(shp.status)}</td>

                {/* Actions */}
                <td
                  className="py-3.5 px-4 sm:px-6 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onViewDetails(shp)}
                      title="View Shipment Details"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      aria-label="View Shipment Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(shp)}
                      title="Edit Shipment"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      aria-label="Edit Shipment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(shp)}
                      title="Delete Shipment"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label="Delete Shipment"
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

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{shipments.length}</strong> shipment dispatches
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Click any row to open full manifest, route history, and timeline
        </span>
      </div>
    </div>
  );
};
