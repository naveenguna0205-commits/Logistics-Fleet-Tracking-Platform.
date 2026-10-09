import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Award,
  Truck,
  Save,
  AlertCircle,
} from 'lucide-react';
import { Driver, DriverFormData, DriverStatus } from '../../types/driver';
import {
  AVAILABLE_FLEET_VEHICLES,
  PRESET_AVATARS,
  AVAILABLE_CERTIFICATIONS,
} from '../../data/driverData';

interface DriverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: DriverFormData, driverId?: string) => void;
  initialDriver?: Driver | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  experienceYears?: string;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDriver,
}) => {
  const isEditing = Boolean(initialDriver);

  const [formData, setFormData] = useState<DriverFormData>({
    name: '',
    email: '',
    phone: '',
    avatar: PRESET_AVATARS[0].url,
    licenseNumber: '',
    licenseExpiry: '',
    licenseState: 'Illinois',
    experienceYears: 5,
    assignedVehicle: 'Unassigned',
    status: 'Available',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: 'Spouse',
    certifications: ['Class-A CDL'],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialDriver) {
      setFormData({
        name: initialDriver.name,
        email: initialDriver.email,
        phone: initialDriver.phone,
        avatar: initialDriver.avatar || PRESET_AVATARS[0].url,
        licenseNumber: initialDriver.licenseNumber,
        licenseExpiry: initialDriver.licenseExpiry,
        licenseState: initialDriver.licenseState || 'Illinois',
        experienceYears: initialDriver.experienceYears,
        assignedVehicle: initialDriver.assignedVehicle || 'Unassigned',
        status: initialDriver.status,
        address: initialDriver.address || '',
        emergencyContactName: initialDriver.emergencyContact?.name || '',
        emergencyContactPhone: initialDriver.emergencyContact?.phone || '',
        emergencyContactRelation: initialDriver.emergencyContact?.relationship || 'Spouse',
        certifications: initialDriver.certifications || ['Class-A CDL'],
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].url,
        licenseNumber: '',
        licenseExpiry: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        licenseState: 'Illinois',
        experienceYears: 4,
        assignedVehicle: 'Unassigned',
        status: 'Available',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: 'Spouse',
        certifications: ['Class-A CDL', 'Defensive Driving Gold'],
      });
    }
    setErrors({});
  }, [initialDriver, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Driver full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must have at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required.';
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Please provide a valid phone number.';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Commercial Driver License (CDL) number is required.';
    }

    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = 'License expiration date is required.';
    }

    if (formData.experienceYears < 0 || isNaN(formData.experienceYears)) {
      newErrors.experienceYears = 'Experience must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData, initialDriver?.id);
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  const toggleCertification = (cert: string) => {
    const current = formData.certifications || [];
    if (current.includes(cert)) {
      setFormData({
        ...formData,
        certifications: current.filter((c) => c !== cert),
      });
    } else {
      setFormData({
        ...formData,
        certifications: [...current, cert],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {isEditing ? `Edit Driver: ${initialDriver?.name}` : 'Register New Fleet Driver'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update driver credentials, contact details, status, and vehicle assignment.'
                  : 'Onboard a certified commercial driver to the active fleet network.'}
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Profile Photo & Basic Identity */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Profile & Identity
            </h3>

            {/* Profile Avatar Selection */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={formData.avatar}
                  alt="Selected avatar"
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Preset Quick Avatars */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Or pick a preset avatar:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {PRESET_AVATARS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: p.url })}
                      className={`relative shrink-0 w-8 h-8 rounded-xl overflow-hidden border-2 transition-transform hover:scale-110 ${
                        formData.avatar === p.url
                          ? 'border-blue-600 ring-2 ring-blue-400/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marcus Sterling"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. marcus@logitrack.io"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 (555) 234-8901"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Experience (Years) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceYears: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.experienceYears
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.experienceYears && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.experienceYears}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: License & Certifications */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              License & Qualifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  License Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="e.g. CDL-IL-9821445"
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.licenseNumber
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.licenseNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  License Expiry Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errors.licenseExpiry
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.licenseExpiry && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.licenseExpiry}
                  </p>
                )}
              </div>
            </div>

            {/* Certifications Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Driver Certifications & Endorsements
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_CERTIFICATIONS.map((cert) => {
                  const isSelected = (formData.certifications || []).includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCertification(cert)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Fleet Status & Assigned Vehicle */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fleet Status & Assignment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driver Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as DriverStatus })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Available">Available (Ready for Dispatch)</option>
                  <option value="On Duty">On Duty (Active On Route)</option>
                  <option value="Off Duty">Off Duty (Rest / Standby)</option>
                  <option value="On Leave">On Leave (Vacation / Sick)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Vehicle <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.assignedVehicle}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedVehicle: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {AVAILABLE_FLEET_VEHICLES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Residential / Home Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 4120 N Michigan Ave, Chicago, IL 60611"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 border border-slate-300 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Driver'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
