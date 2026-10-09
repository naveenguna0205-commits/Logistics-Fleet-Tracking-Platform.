import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Package } from 'lucide-react';
import { Shipment } from '../../types/shipment';

interface DeleteShipmentModalProps {
  shipment: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (shipment: Shipment) => void;
}

export const DeleteShipmentModal: React.FC<DeleteShipmentModalProps> = ({
  shipment,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !shipment) return null;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onConfirm(shipment);
      setIsDeleting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200/80 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 text-slate-800">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold text-slate-900">Delete Shipment Manifest</h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Are you sure you want to remove shipment order{' '}
            <strong className="text-slate-900 font-mono">{shipment.id}</strong> (
            <span>{shipment.customerName}</span>)? This will purge all associated waypoints and tracking records.
          </p>

          <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                <Package className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{shipment.id} • {shipment.packageType}</p>
                <p className="text-[11px] text-slate-500 truncate">{shipment.pickupLocation.split(',')[0]} → {shipment.deliveryLocation.split(',')[0]}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px]">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-slate-900">{shipment.status}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Assigned Driver:</span>
              <span className="font-semibold text-slate-900">{shipment.assignedDriver}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-500/25 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Removing...' : 'Delete Shipment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
