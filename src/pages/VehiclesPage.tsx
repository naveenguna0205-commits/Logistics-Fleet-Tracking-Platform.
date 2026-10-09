import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Plus,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { Vehicle, VehicleFormData, VehicleStatus, VehicleType, VehicleSortField, SortDirection } from '../types/vehicle';
import { getStoredVehicles, saveStoredVehicles } from '../services/vehicleStorage';
import { VehicleFilters } from '../components/vehicles/VehicleFilters';
import { VehicleTable } from '../components/vehicles/VehicleTable';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleFormModal } from '../components/vehicles/VehicleFormModal';
import { VehicleDetailsModal } from '../components/vehicles/VehicleDetailsModal';
import { DeleteConfirmModal } from '../components/vehicles/DeleteConfirmModal';
import { ToastContainer, ToastMessage } from '../components/common/Toast';
import { Pagination } from '../components/common/filters/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { TableLoadingSkeleton, CardGridLoadingSkeleton } from '../components/common/LoadingSkeleton';
import { DateRangeValue } from '../components/common/filters/DateRangeFilter';

export const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<VehicleType | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [fuelFilter, setFuelFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<DateRangeValue>({ preset: 'all' });
  const [sortField, setSortField] = useState<VehicleSortField>('vehicleNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [selectedDetailsVehicle, setSelectedDetailsVehicle] = useState<Vehicle | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Load with slight delay for skeleton demonstration
  const loadVehicles = (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    const data = getStoredVehicles();
    setVehicles(data);
    if (showLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    loadVehicles(true);
  }, []);

  // Summary counts for KPIs
  const counts = useMemo(() => {
    return {
      all: vehicles.length,
      active: vehicles.filter((v) => v.status === 'Active').length,
      idle: vehicles.filter((v) => v.status === 'Idle').length,
      maintenance: vehicles.filter((v) => v.status === 'Maintenance').length,
      offline: vehicles.filter((v) => v.status === 'Offline').length,
    };
  }, [vehicles]);

  // Unique location list
  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.currentLocation) set.add(v.currentLocation);
    });
    return ['All Hubs & Depots', ...Array.from(set)];
  }, [vehicles]);

  // Filter and Sort Pipeline
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Status filter
        if (statusFilter !== 'All' && v.status !== statusFilter) {
          return false;
        }

        // Type filter
        if (typeFilter !== 'All' && v.type !== typeFilter) {
          return false;
        }

        // Location filter
        if (
          locationFilter !== 'All' &&
          locationFilter !== 'All Hubs & Depots' &&
          locationFilter &&
          v.currentLocation !== locationFilter
        ) {
          return false;
        }

        // Fuel filter
        if (fuelFilter === 'critical' && v.fuelLevel >= 20) return false;
        if (fuelFilter === 'low' && (v.fuelLevel < 20 || v.fuelLevel > 50)) return false;
        if (fuelFilter === 'normal' && v.fuelLevel <= 50) return false;

        // Date range filter on lastServiceDate
        if (dateRange.preset !== 'all') {
          if (dateRange.preset === 'today' && v.lastServiceDate !== '2026-10-08') return false;
          if (dateRange.preset === 'custom') {
            if (dateRange.startDate && v.lastServiceDate < dateRange.startDate) return false;
            if (dateRange.endDate && v.lastServiceDate > dateRange.endDate) return false;
          }
        }

        // Search Query (matches number, model, driver, VIN, plate, location)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchNumber = v.vehicleNumber.toLowerCase().includes(q);
          const matchId = v.id.toLowerCase().includes(q);
          const matchModel = v.model.toLowerCase().includes(q);
          const matchDriver = v.driver.toLowerCase().includes(q);
          const matchVin = v.vin.toLowerCase().includes(q);
          const matchPlate = v.licensePlate.toLowerCase().includes(q);
          const matchLocation = (v.currentLocation || '').toLowerCase().includes(q);

          return (
            matchNumber ||
            matchId ||
            matchModel ||
            matchDriver ||
            matchVin ||
            matchPlate ||
            matchLocation
          );
        }

        return true;
      })
      .sort((a, b) => {
        let compareValue = 0;

        switch (sortField) {
          case 'vehicleNumber':
            compareValue = a.vehicleNumber.localeCompare(b.vehicleNumber);
            break;
          case 'model':
            compareValue = a.model.localeCompare(b.model);
            break;
          case 'driver':
            compareValue = a.driver.localeCompare(b.driver);
            break;
          case 'status':
            compareValue = a.status.localeCompare(b.status);
            break;
          case 'fuelLevel':
            compareValue = a.fuelLevel - b.fuelLevel;
            break;
          case 'mileage':
            compareValue = a.mileage - b.mileage;
            break;
          case 'lastServiceDate':
            compareValue = a.lastServiceDate.localeCompare(b.lastServiceDate);
            break;
          default:
            compareValue = 0;
        }

        return sortDirection === 'asc' ? compareValue : -compareValue;
      });
  }, [
    vehicles,
    searchQuery,
    statusFilter,
    typeFilter,
    locationFilter,
    fuelFilter,
    dateRange,
    sortField,
    sortDirection,
  ]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, locationFilter, fuelFilter, dateRange]);

  // Paginated vehicles slice
  const totalPages = Math.ceil(filteredVehicles.length / pageSize) || 1;
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(startIndex, startIndex + pageSize);
  }, [filteredVehicles, currentPage, pageSize]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      statusFilter !== 'All' ||
      typeFilter !== 'All' ||
      (locationFilter !== 'All' && locationFilter !== 'All Hubs & Depots' && locationFilter) ||
      fuelFilter !== 'All' ||
      dateRange.preset !== 'all'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTypeFilter('All');
    setLocationFilter('All');
    setFuelFilter('All');
    setDateRange({ preset: 'all' });
    setSortField('vehicleNumber');
    setSortDirection('asc');
    addToast('info', 'Filters Reset', 'Displaying all fleet vehicles.');
  };

  // Add / Edit Handlers
  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormModalOpen(true);
  };

  const handleSaveVehicle = (formData: VehicleFormData, vehicleId?: string) => {
    if (vehicleId) {
      // Editing existing vehicle
      const updated = vehicles.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            ...formData,
          };
        }
        return v;
      });
      setVehicles(updated);
      saveStoredVehicles(updated);
      addToast(
        'success',
        'Vehicle Updated',
        `Vehicle ${formData.vehicleNumber} details have been saved.`
      );
    } else {
      // Creating new vehicle
      const newId = `veh-${String(vehicles.length + 1).padStart(3, '0')}`;
      const newVehicle: Vehicle = {
        id: newId,
        ...formData,
        serviceHistory: [
          {
            id: `srv-${Date.now()}`,
            date: formData.lastServiceDate,
            type: 'Initial Fleet Onboarding Inspection',
            description: 'Standard 24-point commercial vehicle inspection and intake validation.',
            cost: 250,
            technician: 'Dave Miller',
            odometer: formData.mileage,
          },
        ],
        recentActivities: [
          {
            id: `act-${Date.now()}`,
            timestamp: 'Just now',
            type: 'status_change',
            description: 'Vehicle registered into LogiTrack Pro command database.',
            location: formData.currentLocation || 'Central Depot',
          },
        ],
      };
      const updated = [newVehicle, ...vehicles];
      setVehicles(updated);
      saveStoredVehicles(updated);
      addToast(
        'success',
        'Vehicle Registered',
        `New vehicle ${formData.vehicleNumber} successfully added to fleet.`
      );
    }
  };

  // Details View Handler
  const handleOpenDetails = (vehicle: Vehicle) => {
    setSelectedDetailsVehicle(vehicle);
    setIsDetailsModalOpen(true);
  };

  // Delete Handlers
  const handleOpenDeleteModal = (vehicle: Vehicle) => {
    setDeletingVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (vehicle: Vehicle) => {
    const updated = vehicles.filter((v) => v.id !== vehicle.id);
    setVehicles(updated);
    saveStoredVehicles(updated);
    addToast(
      'error',
      'Vehicle Removed',
      `Vehicle ${vehicle.vehicleNumber} has been removed from the registry.`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Page Breadcrumb & Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-700 font-bold">Vehicles Management</span>
          </nav>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Fleet Vehicles Management
            </h1>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 animate-pulse-slow">
              {vehicles.length} Units Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor vehicle telemetry, assigned drivers, fuel levels, and maintenance schedules.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadVehicles(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all btn-press"
            title="Refresh vehicles registry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* 2. Fleet Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Active Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Active' ? 'All' : 'Active')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-1 ${
            statusFilter === 'Active' ? 'ring-2 ring-blue-500 border-blue-300' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active In Service
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{counts.active}</span>
            <span className="text-[11px] text-slate-500 font-medium">
              ({Math.round((counts.active / (counts.all || 1)) * 100)}% of fleet)
            </span>
          </div>
        </div>

        {/* Idle Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Idle' ? 'All' : 'Idle')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-2 ${
            statusFilter === 'Idle' ? 'ring-2 ring-slate-400 border-slate-300' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Idle in Yard
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{counts.idle}</span>
            <span className="text-[11px] text-slate-500 font-medium">Ready for dispatch</span>
          </div>
        </div>

        {/* Maintenance Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Maintenance' ? 'All' : 'Maintenance')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-3 ${
            statusFilter === 'Maintenance'
              ? 'ring-2 ring-amber-500 border-amber-300'
              : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              In Maintenance
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 font-mono">
              {counts.maintenance}
            </span>
            <span className="text-[11px] text-amber-600 font-medium">In Workshop Bays</span>
          </div>
        </div>

        {/* Offline Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Offline' ? 'All' : 'Offline')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-4 ${
            statusFilter === 'Offline' ? 'ring-2 ring-rose-500 border-rose-300' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Offline / Repair
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 font-mono">{counts.offline}</span>
            <span className="text-[11px] text-rose-600 font-medium">Out of Service</span>
          </div>
        </div>
      </div>

      {/* 3. Search, Filter, Sort, & Mode Toolbar */}
      <VehicleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        fuelFilter={fuelFilter}
        onFuelChange={setFuelFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={setSortField}
        onToggleDirection={() =>
          setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        counts={counts}
        locationsList={uniqueLocations}
      />

      {/* 4. Vehicle Content: Loading Skeleton vs Table vs Card Grid */}
      {isLoading ? (
        viewMode === 'table' ? (
          <TableLoadingSkeleton rows={6} cols={7} />
        ) : (
          <CardGridLoadingSkeleton cards={6} />
        )
      ) : paginatedVehicles.length > 0 ? (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <div>
              {/* Show Table on md+ screens */}
              <div className="hidden md:block">
                <VehicleTable
                  vehicles={paginatedVehicles}
                  onViewDetails={handleOpenDetails}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paginatedVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onViewDetails={handleOpenDetails}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Card Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onViewDetails={handleOpenDetails}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </div>
          )}

          {/* 5. Pagination */}
          <div className="bg-white rounded-2xl border border-slate-200/80 px-4 py-1 shadow-xs">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredVehicles.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              itemName="vehicles"
            />
          </div>
        </div>
      ) : (
        <EmptyState
          title="No vehicles found"
          description={
            hasActiveFilters
              ? 'No fleet vehicles match your current filter and search criteria. Try adjusting your parameters.'
              : 'No vehicles are registered in the fleet database.'
          }
          actionText="Clear All Filters"
          onAction={handleResetFilters}
          secondaryActionText="Add New Vehicle"
          onSecondaryAction={handleOpenAddModal}
        />
      )}

      {/* Modals */}
      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveVehicle}
        initialVehicle={editingVehicle}
      />

      <VehicleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vehicle={selectedDetailsVehicle}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        vehicle={deletingVehicle}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default VehiclesPage;
