import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Truck,
  Star,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  PackageCheck,
  Activity,
  Droplet,
} from 'lucide-react';
import { Driver, DriverStatus } from '../../types/driver';
import { DriverPerformance } from './DriverPerformance';

interface DriverDetailsProps {
  driver: Driver | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}

export const DriverDetails: React.FC<DriverDetailsProps> = ({
  driver,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'history'>('overview');

  if (!isOpen || !driver) return null;

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Available (Ready for Dispatch)
          </span>
        );
      case 'On Duty':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            On Duty (Active Route)
          </span>
        );
      case 'Off Duty':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Off Duty (Standby / Rest)
          </span>
        );
      case 'On Leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            On Leave (Time Off)
          </span>
        );
    }
  };

  const isAssigned = driver.assignedVehicle && driver.assignedVehicle !== 'Unassigned';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800">
        {/* Modal Header Banner */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/75">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
                }}
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
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
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{driver.name}</h2>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  {driver.id}
                </span>
                {getStatusBadge(driver.status)}
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
                <span>{driver.experienceYears} Years Commercial Driving Experience</span>
                <span>•</span>
                <span>Joined {driver.joinDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(driver);
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Edit Driver"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(driver);
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Delete Driver"
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
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Driver Dossier & License
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'performance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Performance Metrics & KPIs
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Delivery History ({driver.deliveryHistory?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Rating Score
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span className="text-base font-black text-slate-900">
                      {driver.performance.rating}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">/ 5.0</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Completed Trips
                  </span>
                  <p className="text-base font-black text-slate-900 font-mono mt-0.5">
                    {driver.performance.completedDeliveries}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    On-Time Rate
                  </span>
                  <p className="text-base font-black text-blue-600 font-mono mt-0.5">
                    {driver.performance.onTimeRate}%
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Safety Score
                  </span>
                  <p className="text-base font-black text-emerald-600 font-mono mt-0.5">
                    {driver.performance.safetyScore}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Contact Information
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone:
                      </span>
                      <a
                        href={`tel:${driver.phone}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {driver.phone}
                      </a>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email:
                      </span>
                      <a
                        href={`mailto:${driver.email}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {driver.email}
                      </a>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Address:
                      </span>
                      <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                        {driver.address || 'Chicago Central Hub Quarters'}
                      </span>
                    </div>

                    {driver.bloodGroup && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Droplet className="w-3.5 h-3.5 text-rose-500" /> Blood Group:
                        </span>
                        <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                          {driver.bloodGroup}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Commercial License (CDL)
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">License Number:</span>
                      <span className="font-mono font-black text-slate-900">
                        {driver.licenseNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Issuing State:</span>
                      <span className="font-bold text-slate-900">{driver.licenseState || 'Illinois'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Expiration Date:</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {driver.licenseExpiry}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Valid & Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-600 text-white">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">
                        Assigned Vehicle Telemetry
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Currently paired fleet asset for transport dispatches
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      isAssigned
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {isAssigned ? 'Active Assignment' : 'Unassigned'}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Vehicle Asset
                    </span>
                    <p className="font-extrabold text-slate-900 text-xs mt-0.5">
                      {isAssigned ? driver.assignedVehicle : 'No vehicle currently assigned'}
                    </p>
                  </div>
                  {isAssigned && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> Telemetry Connected
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <HeartHandshake className="w-4 h-4 text-rose-500" />
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Emergency Contact
                    </h3>
                  </div>
                  {driver.emergencyContact ? (
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-900">{driver.emergencyContact.name}</p>
                      <p className="text-slate-500 text-[11px]">
                        Relationship: {driver.emergencyContact.relationship}
                      </p>
                      <p className="text-blue-600 font-mono font-semibold">
                        {driver.emergencyContact.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-xs">No emergency contact recorded.</p>
                  )}
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Endorsements & Certifications
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {driver.certifications && driver.certifications.length > 0 ? (
                      driver.certifications.map((cert, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200"
                        >
                          {cert}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-xs">Standard Class-A CDL</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <DriverPerformance performance={driver.performance} driverName={driver.name} />
          )}

          {activeTab === 'history' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Dispatched Shipment Records
                </h3>
                <span className="text-[11px] text-slate-500">
                  {driver.deliveryHistory?.length || 0} recent shipments logged
                </span>
              </div>

              {(!driver.deliveryHistory || driver.deliveryHistory.length === 0) && (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                  <PackageCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-900">No delivery records available</p>
                </div>
              )}

              {driver.deliveryHistory && driver.deliveryHistory.length > 0 && (
                <div className="space-y-3">
                  {driver.deliveryHistory.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {rec.trackingNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              rec.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : rec.status === 'In Transit'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {rec.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <span>{rec.origin}</span>
                        <span className="text-slate-400">→</span>
                        <span>{rec.destination}</span>
                        <span className="text-slate-500 text-[11px]">({rec.distanceKm} km)</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                        <span>
                          <strong className="text-slate-800">Cargo:</strong> {rec.cargo}
                        </span>
                        <span>
                          <strong className="text-slate-800">Vehicle:</strong> {rec.vehicle}
                        </span>
                        {rec.onTime && (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> On-Time Delivery
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Driver ID: <strong className="font-mono text-slate-900">{driver.id}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 border border-slate-300 rounded-xl transition-colors shadow-xs"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
