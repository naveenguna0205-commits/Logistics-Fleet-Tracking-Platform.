import React from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  RotateCcw,
  Fuel,
} from 'lucide-react';
import { VehicleStatus, VehicleType, VehicleSortField, SortDirection } from '../../types/vehicle';
import { VEHICLE_TYPES } from '../../data/mockVehicles';
import { LocationFilter } from '../common/filters/LocationFilter';
import { DateRangeFilter, DateRangeValue } from '../common/filters/DateRangeFilter';

export interface VehicleFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: VehicleStatus | 'All';
  onStatusChange: (status: VehicleStatus | 'All') => void;
  typeFilter: VehicleType | 'All';
  onTypeChange: (type: VehicleType | 'All') => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  fuelFilter: string; // 'All' | 'critical' | 'low' | 'normal'
  onFuelChange: (fuel: string) => void;
  dateRange: DateRangeValue;
  onDateRangeChange: (val: DateRangeValue) => void;
  sortField: VehicleSortField;
  sortDirection: SortDirection;
  onSortChange: (field: VehicleSortField) => void;
  onToggleDirection: () => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  counts: {
    all: number;
    active: number;
    idle: number;
    maintenance: number;
    offline: number;
  };
  locationsList?: string[];
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  locationFilter,
  onLocationChange,
  fuelFilter,
  onFuelChange,
  dateRange,
  onDateRangeChange,
  sortField,
  sortDirection,
  onSortChange,
  onToggleDirection,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters,
  counts,
  locationsList,
}) => {
  const statusOptions: { label: string; value: VehicleStatus | 'All'; count: number }[] = [
    { label: 'All Vehicles', value: 'All', count: counts.all },
    { label: 'Active', value: 'Active', count: counts.active },
    { label: 'Idle', value: 'Idle', count: counts.idle },
    { label: 'Maintenance', value: 'Maintenance', count: counts.maintenance },
    { label: 'Offline', value: 'Offline', count: counts.offline },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Controls Row: Search + Status Selector + View Mode */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by vehicle ID, number, model, driver, VIN, plate..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start lg:self-auto">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => onViewModeChange('card')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'card'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Middle Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {statusOptions.map((opt) => {
          const isSelected = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Advanced Filters (Type, Location, Fuel, Date, Sort, Reset) */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Vehicle Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value as VehicleType | 'All')}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Vehicle Types</option>
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <LocationFilter
            selectedLocation={locationFilter}
            onLocationChange={onLocationChange}
            locations={locationsList}
            label="All Depots / Hubs"
          />

          {/* Fuel Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <Fuel className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={fuelFilter}
              onChange={(e) => onFuelChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Fuel Levels</option>
              <option value="critical">Critical (&lt; 20%)</option>
              <option value="low">Low (20% - 50%)</option>
              <option value="normal">Normal (&gt; 50%)</option>
            </select>
          </div>

          {/* Service Date Range Filter */}
          <DateRangeFilter
            value={dateRange}
            onChange={onDateRangeChange}
            label="Service Date"
          />

          {/* Sort By Field */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <span className="text-slate-400 font-medium">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => onSortChange(e.target.value as VehicleSortField)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="vehicleNumber">Vehicle Number</option>
              <option value="model">Model Name</option>
              <option value="driver">Assigned Driver</option>
              <option value="status">Status</option>
              <option value="fuelLevel">Fuel Level</option>
              <option value="mileage">Mileage</option>
              <option value="lastServiceDate">Last Service</option>
            </select>
            <button
              onClick={onToggleDirection}
              title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
              className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-500"
            >
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Reset Filters */}
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
    </div>
  );
};
