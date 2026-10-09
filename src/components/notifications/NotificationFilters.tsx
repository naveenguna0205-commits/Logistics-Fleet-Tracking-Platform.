import React from 'react';
import {
  Search,
  X,
  RotateCcw,
  Clock,
  Wrench,
  Fuel,
  UserCheck,
  CheckCircle2,
  ArrowUpDown,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import {
  NotificationCategory,
  NotificationPriority,
  NotificationFilterState,
  NotificationCounts,
} from '../../types/notification';
import { DateRangeFilter, DateRangeValue } from '../common/filters/DateRangeFilter';

interface NotificationFiltersProps {
  filters: NotificationFilterState;
  onFilterChange: <K extends keyof NotificationFilterState>(
    key: K,
    value: NotificationFilterState[K]
  ) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  counts: NotificationCounts;
  selectedIds: string[];
  onBatchMarkRead: () => void;
  onBatchDelete: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  totalFilteredCount: number;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
  counts,
  selectedIds,
  onBatchMarkRead,
  onBatchDelete,
  onSelectAll,
  isAllSelected,
}) => {
  const categoryOptions: {
    id: NotificationCategory | 'All';
    label: string;
    count: number;
    icon?: React.ElementType;
  }[] = [
    { id: 'All', label: 'All Alerts', count: counts.total },
    {
      id: 'delayed_shipment',
      label: 'Delayed Shipments',
      count: counts.delayedShipments,
      icon: Clock,
    },
    {
      id: 'maintenance',
      label: 'Vehicle Maintenance',
      count: counts.maintenance,
      icon: Wrench,
    },
    {
      id: 'low_fuel',
      label: 'Low Fuel',
      count: counts.lowFuel,
      icon: Fuel,
    },
    {
      id: 'driver_status',
      label: 'Driver Status',
      count: counts.driverStatus,
      icon: UserCheck,
    },
    {
      id: 'delivery_update',
      label: 'Delivery Updates',
      count: counts.deliveryUpdates,
      icon: CheckCircle2,
    },
  ];

  const dateValue: DateRangeValue = {
    preset: filters.dateRange,
  };

  const handleDateChange = (newVal: DateRangeValue) => {
    onFilterChange('dateRange', newVal.preset);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Search Bar & Read/Unread Status Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            placeholder="Search alerts, shipments, vehicle numbers, drivers, keywords..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-xs"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Read / Unread Status Segmented Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => onFilterChange('status', 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.status === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({counts.total})
          </button>
          <button
            onClick={() => onFilterChange('status', 'unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.status === 'unread'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <span>Unread</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filters.status === 'unread' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {counts.unread}
            </span>
          </button>
          <button
            onClick={() => onFilterChange('status', 'read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.status === 'read'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Read ({counts.read})
          </button>
        </div>
      </div>

      {/* Middle Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categoryOptions.map((cat) => {
          const isSelected = filters.category === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange('category', cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/25'
                  : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Controls Row: Priority, Date, Sort & Reset */}
      <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Priority Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={filters.priority}
              onChange={(e) =>
                onFilterChange('priority', e.target.value as NotificationPriority | 'All')
              }
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-900 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <DateRangeFilter value={dateValue} onChange={handleDateChange} />

          {/* Sort Order Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange('sortBy', e.target.value as 'newest' | 'oldest' | 'priority')
              }
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-900 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Batch Actions Bar (when notifications are checked) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onSelectAll}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 bg-white focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-900">
              {selectedIds.length} alert{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBatchMarkRead}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark as Read</span>
            </button>
            <button
              onClick={onBatchDelete}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
