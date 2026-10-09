import React from 'react';
import {
  Bell,
  Clock,
  Wrench,
  Fuel,
  CheckCircle2,
} from 'lucide-react';
import { NotificationCounts, NotificationCategory } from '../../types/notification';

interface NotificationStatsProps {
  counts: NotificationCounts;
  activeCategory: NotificationCategory | 'All';
  onSelectCategory: (category: NotificationCategory | 'All') => void;
  onSelectStatus?: (status: 'all' | 'unread' | 'read') => void;
}

export const NotificationStats: React.FC<NotificationStatsProps> = ({
  counts,
  activeCategory,
  onSelectCategory,
  onSelectStatus,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {/* 1. Total Unread Alerts */}
      <div
        onClick={() => onSelectStatus && onSelectStatus('unread')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md ${
          counts.unread > 0 ? 'border-blue-500/60 ring-1 ring-blue-500/30' : 'border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Unread Alerts
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Bell className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 font-mono">{counts.unread}</span>
          <span className="text-[11px] text-blue-600 font-semibold">
            of {counts.total} total
          </span>
        </div>
      </div>

      {/* 2. Delayed Shipments */}
      <div
        onClick={() => onSelectCategory('delayed_shipment')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md ${
          activeCategory === 'delayed_shipment'
            ? 'ring-2 ring-rose-500 border-rose-500'
            : 'border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Delayed Freight
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 font-mono">
            {counts.delayedShipments}
          </span>
          <span className="text-[11px] text-rose-600 font-semibold">Action needed</span>
        </div>
      </div>

      {/* 3. Vehicle Maintenance Alerts */}
      <div
        onClick={() => onSelectCategory('maintenance')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md ${
          activeCategory === 'maintenance'
            ? 'ring-2 ring-amber-500 border-amber-500'
            : 'border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Maintenance
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Wrench className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 font-mono">
            {counts.maintenance}
          </span>
          <span className="text-[11px] text-amber-600 font-semibold">Service flags</span>
        </div>
      </div>

      {/* 4. Low Fuel Alerts */}
      <div
        onClick={() => onSelectCategory('low_fuel')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md ${
          activeCategory === 'low_fuel'
            ? 'ring-2 ring-orange-500 border-orange-500'
            : 'border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Fuel Alerts
          </span>
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
            <Fuel className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 font-mono">
            {counts.lowFuel}
          </span>
          <span className="text-[11px] text-orange-600 font-semibold">&lt; 20% level</span>
        </div>
      </div>

      {/* 5. Delivery Updates */}
      <div
        onClick={() => onSelectCategory('delivery_update')}
        className={`col-span-2 sm:col-span-2 lg:col-span-1 p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md ${
          activeCategory === 'delivery_update'
            ? 'ring-2 ring-emerald-500 border-emerald-500'
            : 'border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Delivery Updates
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 font-mono">
            {counts.deliveryUpdates}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">Dispatches & PoD</span>
        </div>
      </div>
    </div>
  );
};
