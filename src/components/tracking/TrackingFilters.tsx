import React from 'react';
import {
  Search,
  RotateCcw,
  User,
  Package,
  Activity,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { TrackingFilterState, TrackingVehicleStatus } from '../../types/tracking';

interface TrackingFiltersProps {
  filters: TrackingFilterState;
  onFilterChange: (key: keyof TrackingFilterState, value: string) => void;
  onResetFilters: () => void;
  driversList: string[];
  shipmentsList: { id: string; label: string }[];
  totalResults: number;
  totalFleet: number;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const TrackingFilters: React.FC<TrackingFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  driversList,
  shipmentsList,
  totalResults,
  totalFleet,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}) => {
  const statusOptions: { value: TrackingVehicleStatus | 'All'; label: string; color: string }[] = [
    { value: 'All', label: 'All Statuses', color: 'bg-slate-100 text-slate-700' },
    { value: 'In Transit', label: 'In Transit', color: 'bg-blue-50 text-blue-700' },
    { value: 'Active', label: 'Active', color: 'bg-emerald-50 text-emerald-700' },
    { value: 'Idle', label: 'Idle / Staged', color: 'bg-amber-50 text-amber-700' },
    { value: 'Delayed', label: 'Delayed / Hold', color: 'bg-rose-50 text-rose-700' },
    { value: 'Offline', label: 'Offline / Workshop', color: 'bg-slate-100 text-slate-600' },
  ];

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.status !== 'All' ||
    filters.driver !== 'All' ||
    filters.shipment !== 'All';

  const filterContent = (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by vehicle #, driver, or shipment..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange('searchQuery', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Status Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Vehicle Status
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Driver Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            Driver
          </label>
          <div className="relative">
            <select
              value={filters.driver}
              onChange={(e) => onFilterChange('driver', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Drivers</option>
              {driversList.map((driverName) => (
                <option key={driverName} value={driverName}>
                  {driverName}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Shipment Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            Shipment
          </label>
          <div className="relative">
            <select
              value={filters.shipment}
              onChange={(e) => onFilterChange('shipment', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer truncate pr-7"
            >
              <option value="All">All Active Shipments</option>
              {shipmentsList.map((shp) => (
                <option key={shp.id} value={shp.id}>
                  {shp.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Filter Status Summary & Reset Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{totalResults}</strong> of{' '}
            <strong className="text-slate-900">{totalFleet}</strong> vehicles
          </span>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Filtered
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        {filterContent}
      </div>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 text-slate-800">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Filter Live Vehicles
                </h3>
              </div>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={onCloseMobileDrawer}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm shadow-blue-500/25 transition-colors"
              >
                Apply Filters & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
