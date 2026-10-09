import React, { useState } from 'react';
import {
  DASHBOARD_KPIS,
  WEEKLY_DELIVERY_PERFORMANCE,
  FLEET_STATUS_DATA,
  RECENT_ACTIVITIES,
  DASHBOARD_ALERTS,
} from '../data/mockDashboardData';
import { KPICards } from '../components/dashboard/KPICards';
import { DeliveryPerformanceChart } from '../components/dashboard/DeliveryPerformanceChart';
import { FleetStatusChart } from '../components/dashboard/FleetStatusChart';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { AlertsSection } from '../components/dashboard/AlertsSection';
import { Calendar, RefreshCw, Activity } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome / Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-blue-600 animate-pulse" />
              Fleet Overview
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Live Operations Data
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Logistics & Fleet Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry, shipment pipeline monitoring, and vehicle health metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all btn-press shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'transition-transform group-hover:rotate-45'}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Cards Grid (6 KPI Metrics) */}
      <KPICards data={DASHBOARD_KPIS} />

      {/* 2. Charts Grid (Delivery Performance & Fleet Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-2">
        <div className="lg:col-span-2">
          <DeliveryPerformanceChart data={WEEKLY_DELIVERY_PERFORMANCE} />
        </div>
        <div className="lg:col-span-1">
          <FleetStatusChart data={FLEET_STATUS_DATA} />
        </div>
      </div>

      {/* 3. Operational Sections Grid (Recent Activities & Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up stagger-3">
        <RecentActivities activities={RECENT_ACTIVITIES} />
        <AlertsSection alerts={DASHBOARD_ALERTS} />
      </div>
    </div>
  );
};
export default DashboardPage;
