import React from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  RotateCcw,
  Truck,
  Star,
  Award,
} from 'lucide-react';
import { DriverStatus, DriverSortField, SortDirection } from '../../types/driver';
import { LocationFilter } from '../common/filters/LocationFilter';
import { DateRangeFilter, DateRangeValue } from '../common/filters/DateRangeFilter';

interface DriverCounts {
  all: number;
  available: number;
  onDuty: number;
  offDuty: number;
  onLeave: number;
}

export interface DriverFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: DriverStatus | 'All';
  onStatusChange: (status: DriverStatus | 'All') => void;
  vehicleFilter: string; // 'All' | 'Assigned' | 'Unassigned' | specific vehicle
  onVehicleChange: (vehicle: string) => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  experienceFilter: string; // 'All' | 'junior' | 'mid' | 'senior'
  onExperienceChange: (exp: string) => void;
  ratingFilter: string; // 'All' | '4.8' | '4.5' | '4.0'
  onRatingChange: (rat: string) => void;
  dateRange: DateRangeValue;
  onDateRangeChange: (val: DateRangeValue) => void;
  sortField: DriverSortField;
  sortDirection: SortDirection;
  onSortChange: (field: DriverSortField) => void;
  onToggleDirection: () => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  counts: DriverCounts;
  vehicleOptions: string[];
  locationsList?: string[];
}

export const DriverFilters: React.FC<DriverFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  vehicleFilter,
  onVehicleChange,
  locationFilter,
  onLocationChange,
  experienceFilter,
  onExperienceChange,
  ratingFilter,
  onRatingChange,
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
  vehicleOptions,
  locationsList,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Row: Search Input, Status Pill Filters & View Mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by driver name, ID, phone, license..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs font-bold">
          <button
            onClick={() => onStatusChange('All')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap border ${
              statusFilter === 'All'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => onStatusChange('Available')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'Available'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusFilter === 'Available' ? 'bg-white' : 'bg-emerald-500'
              }`}
            />
            Available ({counts.available})
          </button>
          <button
            onClick={() => onStatusChange('On Duty')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'On Duty'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:text-blue-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusFilter === 'On Duty' ? 'bg-white' : 'bg-blue-500'
              }`}
            />
            On Duty ({counts.onDuty})
          </button>
          <button
            onClick={() => onStatusChange('Off Duty')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'Off Duty'
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusFilter === 'Off Duty' ? 'bg-white' : 'bg-slate-400'
              }`}
            />
            Off Duty ({counts.offDuty})
          </button>
          <button
            onClick={() => onStatusChange('On Leave')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'On Leave'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/20'
                : 'bg-slate-100 text-slate-600 hover:text-amber-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusFilter === 'On Leave' ? 'bg-white' : 'bg-amber-500'
              }`}
            />
            On Leave ({counts.onLeave})
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start lg:self-auto">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
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
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Advanced Filters (Vehicle, Location, Experience, Rating, Date, Sort, Reset) */}
      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Vehicle Assignment Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800">
            <Truck className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={vehicleFilter}
              onChange={(e) => onVehicleChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-800 cursor-pointer max-w-[130px] truncate [&>option]:bg-white [&>option]:text-slate-800 [&>optgroup]:bg-white [&>optgroup]:text-slate-500"
            >
              <option value="All">All Vehicles</option>
              <option value="Assigned">Assigned Only</option>
              <option value="Unassigned">Unassigned Only</option>
              <optgroup label="Specific Vehicle">
                {vehicleOptions
                  .filter((v) => v !== 'Unassigned')
                  .map((veh) => (
                    <option key={veh} value={veh}>
                      {veh}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Location Filter */}
          <LocationFilter
            selectedLocation={locationFilter}
            onLocationChange={onLocationChange}
            locations={locationsList}
            label="Base Terminal"
          />

          {/* Experience Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800">
            <Award className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={experienceFilter}
              onChange={(e) => onExperienceChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-800 cursor-pointer [&>option]:bg-white [&>option]:text-slate-800"
            >
              <option value="All">All Experience</option>
              <option value="junior">Junior (1 - 3 yrs)</option>
              <option value="mid">Mid-Level (4 - 7 yrs)</option>
              <option value="senior">Senior (8+ yrs)</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <select
              value={ratingFilter}
              onChange={(e) => onRatingChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-800 cursor-pointer [&>option]:bg-white [&>option]:text-slate-800"
            >
              <option value="All">All Ratings</option>
              <option value="4.8">★ 4.8 & above</option>
              <option value="4.5">★ 4.5 & above</option>
              <option value="4.0">★ 4.0 & above</option>
            </select>
          </div>

          {/* Date Filter (Join Date) */}
          <DateRangeFilter
            value={dateRange}
            onChange={onDateRangeChange}
            label="Join Date"
          />

          {/* Sort By Field */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => onSortChange(e.target.value as DriverSortField)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-800 cursor-pointer [&>option]:bg-white [&>option]:text-slate-800"
            >
              <option value="name">Driver Name</option>
              <option value="id">Driver ID</option>
              <option value="status">Status</option>
              <option value="experienceYears">Experience</option>
              <option value="rating">Rating</option>
              <option value="completedDeliveries">Deliveries</option>
              <option value="licenseExpiry">License Expiry</option>
            </select>

            <button
              onClick={onToggleDirection}
              className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-500 hover:text-slate-800"
              title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-3 h-3" />
            </button>
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
    </div>
  );
};
