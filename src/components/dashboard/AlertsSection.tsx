import React from 'react';
import {
  AlertTriangle,
  Clock,
  Wrench,
  Fuel,
  UserX,
  ChevronRight,
} from 'lucide-react';
import { DashboardAlert } from '../../types/dashboard';

interface AlertsSectionProps {
  alerts: DashboardAlert[];
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts }) => {
  const getCategoryIcon = (category: DashboardAlert['category']) => {
    switch (category) {
      case 'delayed_shipment':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'maintenance_due':
        return <Wrench className="w-4 h-4 text-rose-600" />;
      case 'low_fuel':
        return <Fuel className="w-4 h-4 text-rose-600" />;
      case 'driver_issue':
        return <UserX className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getAlertStyles = (severity: DashboardAlert['severity']) => {
    if (severity === 'critical') {
      return {
        cardBg: 'bg-rose-50/50 hover:bg-rose-50 border-rose-200',
        iconBg: 'bg-rose-100 text-rose-600 border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-200 font-bold',
        indicator: 'bg-rose-600',
      };
    }
    return {
      cardBg: 'bg-amber-50/50 hover:bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-600 border-amber-200',
      badge: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
      indicator: 'bg-amber-500',
    };
  };

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Operational Alerts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active exceptions requiring dispatcher intervention
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
            {criticalCount} Critical
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
            {warningCount} Warning
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 my-3 flex-1">
        {alerts.map((alert, idx) => {
          const styles = getAlertStyles(alert.severity);

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer group hover:translate-x-1 hover:shadow-md animate-fade-in-up stagger-${(idx % 6) + 1} ${styles.cardBg}`}
            >
              {/* Icon Container */}
              <div
                className={`p-2.5 rounded-xl border flex-shrink-0 ${styles.iconBg} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200`}
              >
                {getCategoryIcon(alert.category)}
              </div>

              {/* Alert Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.indicator}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.indicator}`}></span>
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {alert.title}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 transition-transform group-hover:scale-105 ${styles.badge}`}
                  >
                    {alert.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {alert.description}
                </p>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span className="font-medium">{alert.timestamp}</span>
                  <span className="font-semibold text-blue-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform duration-150">
                    <span>Review Alert</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
