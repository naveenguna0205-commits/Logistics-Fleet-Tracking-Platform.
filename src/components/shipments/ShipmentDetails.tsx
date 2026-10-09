import React, { useState } from 'react';
import {
  X,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Truck,
  Weight,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
  ArrowRight,
  ShieldAlert,
  FileText,
  Activity,
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../../types/shipment';
import { DeliveryTimeline } from './DeliveryTimeline';

interface ShipmentDetailsProps {
  shipment: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
}

export const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({
  shipment,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'customer'>('timeline');

  if (!isOpen || !shipment) return null;

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Delivered & Received
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            In Transit (Live Highway Run)
          </span>
        );
      case 'Picked Up':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            Picked Up (Staged)
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Delayed On Route
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Dispatch Queue
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/75">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 font-mono tracking-tight">
                  {shipment.id}
                </h2>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono">
                  {shipment.trackingNumber}
                </span>
                {getStatusBadge(shipment.status)}
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
                <span>{shipment.customerName}</span>
                <span>•</span>
                <span>{shipment.packageType}</span>
                <span>•</span>
                <span>{shipment.packageWeight.toLocaleString()} kg</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(shipment);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Edit Shipment"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(shipment);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Delete Shipment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Delivery Timeline & Tracking
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cargo & Route Details
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'customer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer & Instructions
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-fade-in">
              {/* Route Summary Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Origin Pickup Point
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {shipment.pickupLocation}
                    </p>
                    {shipment.pickupAddress && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{shipment.pickupAddress}</p>
                    )}
                  </div>

                  <div className="hidden sm:flex items-center justify-center p-2 rounded-full bg-white border border-slate-200 text-blue-600 shadow-xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Destination Delivery Point
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {shipment.deliveryLocation}
                    </p>
                    {shipment.deliveryAddress && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{shipment.deliveryAddress}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                  <span>
                    <strong className="text-slate-800">Dispatched:</strong> {shipment.shipmentDate}
                  </span>
                  <span>
                    <strong className="text-slate-800">Expected Delivery:</strong> {shipment.expectedDelivery}
                  </span>
                  {shipment.distanceKm && (
                    <span>
                      <strong className="text-slate-800">Est. Distance:</strong> {shipment.distanceKm} km
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery Timeline Tracker */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Live Dispatch Milestone Status
                </h3>
                <DeliveryTimeline shipment={shipment} />
              </div>
            </div>
          )}

          {/* TAB 2: CARGO & ROUTE DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in">
              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Cargo Type
                  </span>
                  <p className="text-xs font-black text-slate-900 mt-0.5 truncate">
                    {shipment.packageType}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Gross Weight
                  </span>
                  <p className="text-xs font-black text-slate-900 font-mono mt-0.5">
                    {shipment.packageWeight.toLocaleString()} kg
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Freight Cost
                  </span>
                  <p className="text-xs font-black text-emerald-600 font-mono mt-0.5">
                    ${shipment.cost.toLocaleString()}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Service Priority
                  </span>
                  <p className="text-xs font-black text-blue-600 mt-0.5">
                    {shipment.priority}
                  </p>
                </div>
              </div>

              {/* Driver & Vehicle Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <User className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Assigned Commercial Driver
                    </h4>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">{shipment.assignedDriver}</p>
                  <p className="text-[11px] text-slate-500">
                    Certified Commercial Operator • Assigned to route {shipment.id}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Assigned Fleet Asset
                    </h4>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 font-mono">
                    {shipment.assignedVehicle}
                  </p>
                  <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                    <Activity className="w-3.5 h-3.5" /> GPS Telemetry Active
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER & SPECIAL INSTRUCTIONS */}
          {activeTab === 'customer' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Customer Profile & Contact
                  </h4>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Account Name:</span>
                    <span className="font-extrabold text-slate-900">{shipment.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Contact Phone:</span>
                    <a href={`tel:${shipment.customerPhone}`} className="font-bold text-blue-600 hover:underline">
                      {shipment.customerPhone}
                    </a>
                  </div>
                  {shipment.customerEmail && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Email Address:</span>
                      <a href={`mailto:${shipment.customerEmail}`} className="font-semibold text-slate-800 hover:underline">
                        {shipment.customerEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Special Handling & Instructions
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {shipment.specialInstructions || 'No special handling instructions recorded for this consignment.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Tracking ID: <strong className="text-blue-600">{shipment.trackingNumber}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 border border-slate-300 rounded-xl transition-colors shadow-xs"
          >
            Close Manifest
          </button>
        </div>
      </div>
    </div>
  );
};
