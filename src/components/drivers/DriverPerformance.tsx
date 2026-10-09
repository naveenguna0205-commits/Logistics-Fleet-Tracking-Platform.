import React from 'react';
import {
  PackageCheck,
  TrendingUp,
  Star,
  Gauge,
  ShieldCheck,
  Fuel,
  Award,
  CalendarCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DriverPerformanceMetrics } from '../../types/driver';

interface DriverPerformanceProps {
  performance: DriverPerformanceMetrics;
  driverName: string;
}

export const DriverPerformance: React.FC<DriverPerformanceProps> = ({
  performance,
  driverName,
}) => {
  const weeklyData = performance.weeklyDeliveries || [
    { day: 'Mon', completed: 4, target: 4 },
    { day: 'Tue', completed: 3, target: 4 },
    { day: 'Wed', completed: 5, target: 4 },
    { day: 'Thu', completed: 4, target: 4 },
    { day: 'Fri', completed: 4, target: 4 },
    { day: 'Sat', completed: 2, target: 2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Core KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Deliveries */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total</span>
            <PackageCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900 font-mono">
            {performance.totalDeliveries}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Lifetime Dispatches</span>
        </div>

        {/* Completed Deliveries */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-600 font-mono">
            {performance.completedDeliveries}
          </p>
          <span className="text-[10px] text-emerald-600/80 font-medium">
            {Math.round((performance.completedDeliveries / (performance.totalDeliveries || 1)) * 100)}% Success Rate
          </span>
        </div>

        {/* On-Time Delivery Rate */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">On-Time</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-indigo-600 font-mono">
            {performance.onTimeRate}%
          </p>
          <span className="text-[10px] text-indigo-600/80 font-medium">Schedule Accuracy</span>
        </div>

        {/* Average Rating */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-black text-slate-900 font-mono">{performance.rating}</p>
            <span className="text-[11px] text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Customer Feedback</span>
        </div>

        {/* Total Distance */}
        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Distance</span>
            <Gauge className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-black text-slate-900 font-mono">
            {performance.totalDistance.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Kilometers Logged</span>
        </div>
      </div>

      {/* 2. Progress Meters & Safety Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* On-Time Rate Gauge Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">On-Time Reliability</span>
            </div>
            <span className="text-xs font-black text-blue-600 font-mono">{performance.onTimeRate}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, performance.onTimeRate)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Target: 95.0%</span>
            <span className="text-emerald-600 font-bold">+{(performance.onTimeRate - 95).toFixed(1)}% above goal</span>
          </div>
        </div>

        {/* Safety Score */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Safety Index</span>
            </div>
            <span className="text-xs font-black text-emerald-600 font-mono">{performance.safetyScore}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${performance.safetyScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Zero At-Fault Incidents</span>
            <span className="text-emerald-600 font-bold">Top 5% Fleet Tier</span>
          </div>
        </div>

        {/* Fuel Efficiency */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Fuel className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Eco-Driving & Fuel</span>
            </div>
            <span className="text-xs font-black text-indigo-600 font-mono">{performance.fuelEfficiencyScore}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${performance.fuelEfficiencyScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Low Idling & Smooth Braking</span>
            <span className="text-indigo-600 font-bold">Optimal MPG</span>
          </div>
        </div>
      </div>

      {/* 3. Weekly Delivery Chart */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Weekly Delivery Volume
            </h4>
            <p className="text-[11px] text-slate-500">
              Completed dispatches vs scheduled targets for {driverName}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Completed
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded bg-slate-200" /> Target
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  padding: '8px 12px',
                }}
              />
              <Bar dataKey="completed" name="Completed" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={22} />
              <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
