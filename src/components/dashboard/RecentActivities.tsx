import React from 'react';
import {
  CheckCircle2,
  UserCheck,
  PackagePlus,
  Wrench,
  UserCog,
  Clock,
} from 'lucide-react';
import { RecentActivity } from '../../types/dashboard';

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'delivery_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'vehicle_assigned':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'shipment_created':
        return <PackagePlus className="w-4 h-4 text-purple-600" />;
      case 'maintenance_completed':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'driver_status_changed':
        return <UserCog className="w-4 h-4 text-indigo-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getIconBg = (type: RecentActivity['type']) => {
    switch (type) {
      case 'delivery_completed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'vehicle_assigned':
        return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'shipment_created':
        return 'bg-purple-50 border-purple-200 text-purple-600';
      case 'maintenance_completed':
        return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'driver_status_changed':
        return 'bg-indigo-50 border-indigo-200 text-indigo-600';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  const getStatusBadgeClass = (variant: RecentActivity['statusVariant']) => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time log of fleet operations and status updates</p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          Live Feed
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-slate-100 my-2 flex-1">
        {activities.map((activity, idx) => (
          <div
            key={activity.id}
            className={`py-3.5 flex items-start gap-3.5 hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-all duration-200 group hover:translate-x-1 animate-fade-in-up stagger-${(idx % 6) + 1}`}
          >
            {/* Icon */}
            <div
              className={`p-2 rounded-xl border ${getIconBg(
                activity.type
              )} mt-0.5 flex-shrink-0 group-hover:scale-110 group-hover:shadow-xs transition-transform duration-200`}
            >
              {getActivityIcon(activity.type)}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {activity.title}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 transition-transform group-hover:scale-105 ${getStatusBadgeClass(
                    activity.statusVariant
                  )}`}
                >
                  {activity.statusText}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {activity.description}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-medium">
                <Clock className="w-3 h-3" />
                <span>{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
