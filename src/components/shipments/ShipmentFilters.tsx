import React from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  RotateCcw,
  User,
  Truck,
  Zap,
} from 'lucide-react';
import {
  ShipmentStatus,
  ShipmentPriority,
  ShipmentSortField,
  SortDirection,
} from '../../types/shipment';
import { LocationFilter } from '../common/filters/LocationFilter';
import { DateRangeFilter, DateRangeValue } from '../common/filters/DateRangeFilter';

interface ShipmentCounts {
  all: number;
  pending: number;
  pickedUp: number;
  inTransit: number;
  delivered: number;
  delayed: number;
  cancelled: number;
}

export interface ShipmentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ShipmentStatus | 'All';
  onStatusChange: (status: ShipmentStatus | 'All') => void;
  priorityFilter: ShipmentPriority | 'All';
  onPriorityChange: (priority: ShipmentPriority | 'All') => void;
  dateRange: DateRangeValue;
  onDateRangeChange: (val: DateRangeValue) => void;
  driverFilter: string;
  onDriverChange: (driver: string) => void;
  vehicleFilter: string;
  onVehicleChange: (vehicle: string) => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  sortField: ShipmentSortField;
  sortDirection: SortDirection;
  onSortChange: (field: ShipmentSortField) => void;
  onToggleDirection: () => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  counts: ShipmentCounts;
  driversList: string[];
  vehiclesList: string[];
  locationsList: string[];
}

export const ShipmentFilters: React.FC<ShipmentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  dateRange,
  onDateRangeChange,
  driverFilter,
  onDriverChange,
  vehicleFilter,
  onVehicleChange,
  locationFilter,
  onLocationChange,
  sortField,
  sortDirection,
  onSortChange,
  onToggleDirection,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters,
  counts,
  driversList,
  vehiclesList,
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
            placeholder="Search by ID (e.g. SHP-8921), customer, route..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => onStatusChange('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              statusFilter === 'All'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => onStatusChange('In Transit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'In Transit'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:text-blue-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusFilter === 'In Transit' ? 'bg-white' : 'bg-blue-500'
              }`}
            />
            In Transit ({counts.inTransit})
          </button>
          <button
            onClick={() => onStatusChange('Delivered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'Delivered'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusFilter === 'Delivered' ? 'bg-white' : 'bg-emerald-500'
              }`}
            />
            Delivered ({counts.delivered})
          </button>
          <button
            onClick={() => onStatusChange('Delayed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'Delayed'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/20'
                : 'bg-slate-100 text-slate-600 hover:text-rose-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusFilter === 'Delayed' ? 'bg-white' : 'bg-rose-500'
              }`}
            />
            Delayed ({counts.delayed})
          </button>
          <button
            onClick={() => onStatusChange('Pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              statusFilter === 'Pending'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/20'
                : 'bg-slate-100 text-slate-600 hover:text-amber-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusFilter === 'Pending' ? 'bg-white' : 'bg-amber-500'
              }`}
            />
            Pending ({counts.pending})
          </button>
        </div>

        {/* View Mode Switcher */}
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

      {/* Second Row: Filters Bar (Priority, Location, Date, Driver, Vehicle, Sort) */}
      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800">
            <Zap className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as ShipmentPriority | 'All')}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-800 cursor-pointer [&>option]:bg-white [&>option]:text-slate-800"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Priority</option>
              <option value="Express">Express</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          {/* Location Filter */}
          <LocationFilter
            selectedLocation={locationFilter}
            onLocationChange={onLocationChange}
            locations={locationsList}
            label="Route Terminal"
          />

          {/* Date Filter */}
          <DateRangeFilter
            value={dateRange}
            onChange={onDateRangeChange}
            label="Shipment Date"
          />

          {/* Driver Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={driverFilter}
              onChange={(e) => onDriverChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-800 cursor-pointer max-w-[130px] truncate [&>option]:bg-white [&>option]:text-slate-800"
            >
              <option value="All">All Drivers</option>
              {driversList.map((drv) => (
                <option key={drv} value={drv}>
                  {drv}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800">
            <Truck className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={vehicleFilter}
              onChange={(e) => onVehicleChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-800 cursor-pointer max-w-[130px] truncate [&>option]:bg-white [&>option]:text-slate-800"
            >
              <option value="All">All Vehicles</option>
              {vehiclesList.map((veh) => (
                <option key={veh} value={veh}>
                  {veh}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Field */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => onSortChange(e.target.value as ShipmentSortField)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-800 cursor-pointer [&>option]:bg-white [&>option]:text-slate-800"
            >
              <option value="shipmentDate">Shipment Date</option>
              <option value="id">Shipment ID</option>
              <option value="customerName">Customer Name</option>
              <option value="expectedDelivery">Expected Delivery</option>
              <option value="packageWeight">Weight (kg)</option>
              <option value="status">Status</option>
              <option value="cost">Freight Cost</option>
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
