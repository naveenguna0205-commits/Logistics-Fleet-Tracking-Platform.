import React, { useState, useEffect } from 'react';
import { X, Truck, AlertCircle, Save } from 'lucide-react';
import { Vehicle, VehicleFormData, VehicleStatus, VehicleType } from '../../types/vehicle';
import { AVAILABLE_DRIVERS, VEHICLE_TYPES } from '../../data/mockVehicles';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: VehicleFormData, vehicleId?: string) => void;
  initialVehicle?: Vehicle | null;
}

interface FormErrors {
  vehicleNumber?: string;
  model?: string;
  year?: string;
  type?: string;
  driver?: string;
  status?: string;
  fuelLevel?: string;
  lastServiceDate?: string;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialVehicle,
}) => {
  const isEditing = Boolean(initialVehicle);

  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleNumber: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Semi-Truck',
    driver: 'Unassigned',
    status: 'Active',
    fuelLevel: 80,
    lastServiceDate: new Date().toISOString().split('T')[0],
    mileage: 25000,
    licensePlate: '',
    vin: '',
    fuelCapacity: 150,
    currentLocation: 'Central Logistics Depot',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialVehicle) {
      setFormData({
        vehicleNumber: initialVehicle.vehicleNumber,
        model: initialVehicle.model,
        year: initialVehicle.year,
        type: initialVehicle.type,
        driver: initialVehicle.driver,
        status: initialVehicle.status,
        fuelLevel: initialVehicle.fuelLevel,
        lastServiceDate: initialVehicle.lastServiceDate,
        mileage: initialVehicle.mileage,
        licensePlate: initialVehicle.licensePlate,
        vin: initialVehicle.vin,
        fuelCapacity: initialVehicle.fuelCapacity,
        currentLocation: initialVehicle.currentLocation,
      });
    } else {
      setFormData({
        vehicleNumber: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'Semi-Truck',
        driver: 'Unassigned',
        status: 'Active',
        fuelLevel: 85,
        lastServiceDate: new Date().toISOString().split('T')[0],
        mileage: 15000,
        licensePlate: '',
        vin: '',
        fuelCapacity: 150,
        currentLocation: 'Central Fleet Depot',
      });
    }
    setErrors({});
  }, [initialVehicle, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required (e.g. FL-8829).';
    } else if (formData.vehicleNumber.trim().length < 3) {
      newErrors.vehicleNumber = 'Vehicle number must be at least 3 characters.';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Vehicle model is required (e.g. Volvo VNL 860).';
    }

    const currentYear = new Date().getFullYear();
    if (!formData.year || formData.year < 1990 || formData.year > currentYear + 2) {
      newErrors.year = `Year must be between 1990 and ${currentYear + 2}.`;
    }

    if (!formData.type) {
      newErrors.type = 'Vehicle type is required.';
    }

    if (!formData.driver) {
      newErrors.driver = 'Assigned driver is required.';
    }

    if (!formData.status) {
      newErrors.status = 'Vehicle status is required.';
    }

    if (formData.fuelLevel < 0 || formData.fuelLevel > 100 || isNaN(formData.fuelLevel)) {
      newErrors.fuelLevel = 'Fuel level must be between 0% and 100%.';
    }

    if (!formData.lastServiceDate) {
      newErrors.lastServiceDate = 'Last service date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData, initialVehicle?.id);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `Edit Vehicle: ${initialVehicle?.vehicleNumber}` : 'Add New Fleet Vehicle'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update vehicle parameters, driver assignment, and maintenance status.'
                  : 'Register a new commercial vehicle into the active fleet telemetry database.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Vehicle Number & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Vehicle Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })
                }
                placeholder="e.g. FL-8829"
                className={`w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border bg-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.vehicleNumber
                    ? 'border-rose-300 focus:ring-rose-500/20 text-rose-700'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900'
                }`}
              />
              {errors.vehicleNumber && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.vehicleNumber}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Model Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Freightliner Cascadia"
                className={`w-full px-3.5 py-2 text-xs font-semibold rounded-xl border bg-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.model
                    ? 'border-rose-300 focus:ring-rose-500/20 text-rose-700'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900'
                }`}
              />
              {errors.model && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.model}</span>
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Vehicle Type & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Vehicle Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as VehicleType })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 cursor-pointer"
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Manufacture Year <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
                min="1990"
                max={new Date().getFullYear() + 2}
                className={`w-full px-3.5 py-2 text-xs font-mono font-semibold rounded-xl border bg-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.year
                    ? 'border-rose-300 focus:ring-rose-500/20 text-rose-700'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900'
                }`}
              />
              {errors.year && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.year}</span>
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Assigned Driver & Operational Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Assigned Driver <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 cursor-pointer"
              >
                {AVAILABLE_DRIVERS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Operational Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as VehicleStatus })
                }
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 cursor-pointer"
              >
                <option value="Active">Active (In Service)</option>
                <option value="Idle">Idle (Available in Yard)</option>
                <option value="Maintenance">Maintenance (In Workshop)</option>
                <option value="Offline">Offline (Decommissioned / Repair)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Fuel Level & Last Service Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Fuel Tank Level ({formData.fuelLevel}%) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {Math.round((formData.fuelLevel / 100) * formData.fuelCapacity)} / {formData.fuelCapacity} gal
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.fuelLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, fuelLevel: parseInt(e.target.value) || 0 })
                  }
                  className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.fuelLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fuelLevel: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                    })
                  }
                  className="w-16 px-2 py-1 text-xs font-mono font-bold text-center border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Last Service Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.lastServiceDate}
                onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-mono font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
              />
              {errors.lastServiceDate && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.lastServiceDate}</span>
                </p>
              )}
            </div>
          </div>

          {/* Row 5: Additional Info (License Plate, Odometer, Location) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">License Plate</label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })
                }
                placeholder="e.g. IL-992-TX"
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Odometer (km)</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })
                }
                placeholder="e.g. 45000"
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Base Location</label>
              <input
                type="text"
                value={formData.currentLocation}
                onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                placeholder="e.g. Chicago Depot #2"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Add Vehicle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
