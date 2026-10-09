import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  Truck,
  Weight,
  Save,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';
import {
  Shipment,
  ShipmentFormData,
  ShipmentStatus,
  PackageType,
  ShipmentPriority,
} from '../../types/shipment';
import {
  AVAILABLE_PACKAGE_TYPES,
  LOCATION_PRESETS,
  AVAILABLE_DRIVERS_LIST,
  AVAILABLE_VEHICLES_LIST,
} from '../../data/shipmentData';

interface ShipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: ShipmentFormData, shipmentId?: string) => void;
  initialShipment?: Shipment | null;
}

interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  shipmentDate?: string;
  expectedDelivery?: string;
  packageWeight?: string;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialShipment,
}) => {
  const isEditing = Boolean(initialShipment);

  const [formData, setFormData] = useState<ShipmentFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickupLocation: LOCATION_PRESETS[0],
    deliveryLocation: LOCATION_PRESETS[1],
    pickupAddress: '',
    deliveryAddress: '',
    shipmentDate: new Date().toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    assignedDriver: AVAILABLE_DRIVERS_LIST[1],
    assignedVehicle: AVAILABLE_VEHICLES_LIST[1],
    packageType: 'Standard Carton',
    packageWeight: 1200,
    status: 'In Transit',
    priority: 'Standard',
    cost: 1500,
    specialInstructions: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialShipment) {
      setFormData({
        customerName: initialShipment.customerName,
        customerPhone: initialShipment.customerPhone,
        customerEmail: initialShipment.customerEmail || '',
        pickupLocation: initialShipment.pickupLocation,
        deliveryLocation: initialShipment.deliveryLocation,
        pickupAddress: initialShipment.pickupAddress || '',
        deliveryAddress: initialShipment.deliveryAddress || '',
        shipmentDate: initialShipment.shipmentDate,
        expectedDelivery: initialShipment.expectedDelivery,
        assignedDriver: initialShipment.assignedDriver,
        assignedVehicle: initialShipment.assignedVehicle,
        packageType: initialShipment.packageType,
        packageWeight: initialShipment.packageWeight,
        status: initialShipment.status,
        priority: initialShipment.priority || 'Standard',
        cost: initialShipment.cost || 1200,
        specialInstructions: initialShipment.specialInstructions || '',
      });
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        pickupLocation: LOCATION_PRESETS[0],
        deliveryLocation: LOCATION_PRESETS[1],
        pickupAddress: '',
        deliveryAddress: '',
        shipmentDate: new Date().toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        assignedDriver: AVAILABLE_DRIVERS_LIST[1],
        assignedVehicle: AVAILABLE_VEHICLES_LIST[1],
        packageType: 'Palletized Freight',
        packageWeight: 2500,
        status: 'In Transit',
        priority: 'Standard',
        cost: 1650,
        specialInstructions: '',
      });
    }
    setErrors({});
  }, [initialShipment, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer or company name is required.';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters.';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Customer contact phone is required.';
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup origin location is required.';
    }

    if (!formData.deliveryLocation.trim()) {
      newErrors.deliveryLocation = 'Destination delivery location is required.';
    } else if (formData.pickupLocation === formData.deliveryLocation) {
      newErrors.deliveryLocation = 'Pickup and delivery locations must be different.';
    }

    if (!formData.shipmentDate) {
      newErrors.shipmentDate = 'Shipment date is required.';
    }

    if (!formData.expectedDelivery) {
      newErrors.expectedDelivery = 'Expected delivery date is required.';
    }

    if (!formData.packageWeight || formData.packageWeight <= 0) {
      newErrors.packageWeight = 'Package weight must be greater than 0 kg.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData, initialShipment?.id);
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {isEditing ? `Edit Shipment: ${initialShipment?.id}` : 'Create New Shipment Manifest'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update route points, assigned fleet driver, vehicle asset, or delivery status.'
                  : 'Register a new freight dispatch into the active logistics pipeline.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* 1. Customer Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer & Recipient Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer / Company Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. AeroDynamics Aerospace Corp"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.customerName
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="e.g. +1 (555) 432-8819"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.customerPhone
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Route & Locations */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Route & Dispatch Waypoints
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pickup Origin Hub <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    list="locations-list"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    placeholder="e.g. Chicago Central Depot, IL"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Destination Hub <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    list="locations-list"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    placeholder="e.g. Cleveland Aerospace Hub, OH"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.deliveryLocation
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.deliveryLocation && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.deliveryLocation}
                  </p>
                )}
              </div>
            </div>

            <datalist id="locations-list">
              {LOCATION_PRESETS.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shipment Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={formData.shipmentDate}
                    onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected Delivery Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={formData.expectedDelivery}
                    onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Driver & Vehicle Pairing */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fleet Resource Assignment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Driver
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.assignedDriver}
                    onChange={(e) => setFormData({ ...formData, assignedDriver: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {AVAILABLE_DRIVERS_LIST.map((drv) => (
                      <option key={drv} value={drv}>
                        {drv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Vehicle Asset
                </label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.assignedVehicle}
                    onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {AVAILABLE_VEHICLES_LIST.map((veh) => (
                      <option key={veh} value={veh}>
                        {veh}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Package Specifications & Status */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cargo Specifications & Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Package Type</label>
                <select
                  value={formData.packageType}
                  onChange={(e) =>
                    setFormData({ ...formData, packageType: e.target.value as PackageType })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {AVAILABLE_PACKAGE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Weight (kg) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.packageWeight}
                    onChange={(e) =>
                      setFormData({ ...formData, packageWeight: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shipment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as ShipmentStatus })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="In Transit">In Transit</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="Pending">Pending Dispatch</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Handling Instructions
              </label>
              <textarea
                rows={2}
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                placeholder="e.g. Temperature control required, fragile glassware, liftgate dock..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Shipment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
