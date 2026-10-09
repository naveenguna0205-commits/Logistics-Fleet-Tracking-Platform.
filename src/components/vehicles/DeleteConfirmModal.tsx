import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';

interface DeleteConfirmModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (vehicle: Vehicle) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onConfirm(vehicle);
      setIsDeleting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 text-slate-800">
        {/* Top Warning Icon & Close */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          <h3 className="text-base font-bold text-slate-900">Delete Fleet Vehicle</h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Are you sure you want to remove vehicle{' '}
            <strong className="text-slate-900 font-mono">{vehicle.vehicleNumber}</strong> ({vehicle.model}) from
            the active registry? This action will remove all associated service logs and telemetry records.
          </p>

          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Assigned Driver:</span>
              <span className="font-semibold text-slate-800">{vehicle.driver}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-semibold text-slate-800">{vehicle.status}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
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
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Vehicle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
