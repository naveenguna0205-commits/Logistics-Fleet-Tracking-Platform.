import React from 'react';
import {
  Truck,
  Users,
  Package,
  CheckCircle2,
  Navigation,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { KPICardData } from '../../types/dashboard';

interface KPICardsProps {
  data: KPICardData[];
}

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const getIcon = (iconName: KPICardData['iconName']) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'package':
        return <Package className="w-5 h-5" />;
      case 'checkCircle':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'navigation':
        return <Navigation className="w-5 h-5" />;
      case 'alertTriangle':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getColorClasses = (color: KPICardData['color']) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 text-blue-600 border-blue-200',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 text-purple-600 border-purple-200',
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 text-rose-600 border-rose-200',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 text-amber-600 border-amber-200',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
        };
    }
  };

  const staggerClasses = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {data.map((kpi, idx) => {
        const colors = getColorClasses(kpi.color);
        const staggerClass = staggerClasses[idx % staggerClasses.length];

        return (
          <div
            key={kpi.id}
            className={`bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-lg hover:border-slate-300 card-interactive animate-fade-in-up ${staggerClass} flex flex-col justify-between group transition-all duration-300`}
          >
            {/* Header: Title & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
              <div className={`p-2 rounded-xl border ${colors.bg} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200`}>
                {getIcon(kpi.iconName)}
              </div>
            </div>

            {/* Value */}
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-sans transition-colors group-hover:text-blue-600">
                {kpi.value}
              </span>
            </div>

            {/* Trend Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span
                className={`inline-flex items-center font-bold transition-transform group-hover:translate-x-0.5 ${
                  kpi.trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {kpi.trend.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5 animate-pulse-slow" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                )}
                {kpi.trend.value > 0 ? `+${kpi.trend.value}%` : `${kpi.trend.value}%`}
              </span>
              <span className="text-slate-400 font-medium truncate max-w-[85px]">{kpi.trend.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
