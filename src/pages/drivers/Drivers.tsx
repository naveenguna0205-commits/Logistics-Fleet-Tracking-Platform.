import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  Driver,
  DriverFormData,
  DriverStatus,
  DriverSortField,
  SortDirection,
} from '../../types/driver';
import {
  getStoredDrivers,
  saveStoredDrivers,
} from '../../services/driverStorage';
import { AVAILABLE_FLEET_VEHICLES } from '../../data/driverData';
import { DriverFilters } from '../../components/drivers/DriverFilters';
import { DriverTable } from '../../components/drivers/DriverTable';
import { DriverCard } from '../../components/drivers/DriverCard';
import { DriverForm } from '../../components/drivers/DriverForm';
import { DriverDetails } from '../../components/drivers/DriverDetails';
import { DeleteDriverModal } from '../../components/drivers/DeleteDriverModal';
import { ToastContainer, ToastMessage } from '../../components/common/Toast';
import { Pagination } from '../../components/common/filters/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { TableLoadingSkeleton, CardGridLoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { DateRangeValue } from '../../components/common/filters/DateRangeFilter';

export const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<DriverStatus | 'All'>('All');
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [experienceFilter, setExperienceFilter] = useState<string>('All');
  const [ratingFilter, setRatingFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<DateRangeValue>({ preset: 'all' });
  const [sortField, setSortField] = useState<DriverSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [selectedDetailsDriver, setSelectedDetailsDriver] = useState<Driver | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);
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

  // Initial Load
  const loadDrivers = (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    const data = getStoredDrivers();
    setDrivers(data);
    if (showLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    loadDrivers(true);
  }, []);

  // Summary counts for KPIs
  const counts = useMemo(() => {
    return {
      all: drivers.length,
      available: drivers.filter((d) => d.status === 'Available').length,
      onDuty: drivers.filter((d) => d.status === 'On Duty').length,
      offDuty: drivers.filter((d) => d.status === 'Off Duty').length,
      onLeave: drivers.filter((d) => d.status === 'On Leave').length,
    };
  }, [drivers]);

  // Unique base locations extracted from driver addresses/states
  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    drivers.forEach((d) => {
      if (d.address) {
        const parts = d.address.split(',');
        if (parts.length >= 2) {
          set.add(parts[parts.length - 2].trim() + ' Depot');
        }
      }
    });
    return ['All Base Terminals', ...Array.from(set)];
  }, [drivers]);

  // Filter and Sort Pipeline
  const filteredDrivers = useMemo(() => {
    return drivers
      .filter((d) => {
        // Status filter
        if (statusFilter !== 'All' && d.status !== statusFilter) {
          return false;
        }

        // Vehicle filter
        if (vehicleFilter === 'Assigned') {
          if (!d.assignedVehicle || d.assignedVehicle === 'Unassigned') return false;
        } else if (vehicleFilter === 'Unassigned') {
          if (d.assignedVehicle && d.assignedVehicle !== 'Unassigned') return false;
        } else if (vehicleFilter !== 'All') {
          if (d.assignedVehicle !== vehicleFilter) return false;
        }

        // Experience filter
        if (experienceFilter === 'junior' && (d.experienceYears < 1 || d.experienceYears > 3)) return false;
        if (experienceFilter === 'mid' && (d.experienceYears < 4 || d.experienceYears > 7)) return false;
        if (experienceFilter === 'senior' && d.experienceYears < 8) return false;

        // Rating filter
        if (ratingFilter !== 'All') {
          const minRating = parseFloat(ratingFilter);
          if (d.performance.rating < minRating) return false;
        }

        // Location filter
        if (
          locationFilter !== 'All' &&
          locationFilter !== 'All Base Terminals' &&
          locationFilter
        ) {
          const locName = locationFilter.replace(' Depot', '').toLowerCase();
          if (!d.address?.toLowerCase().includes(locName)) return false;
        }

        // Date range on joinDate
        if (dateRange.preset !== 'all') {
          if (dateRange.preset === 'today' && d.joinDate !== '2026-10-08') return false;
          if (dateRange.preset === 'custom') {
            if (dateRange.startDate && d.joinDate < dateRange.startDate) return false;
            if (dateRange.endDate && d.joinDate > dateRange.endDate) return false;
          }
        }

        // Search Query (matches name, ID, phone, email, license, vehicle)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = d.name.toLowerCase().includes(q);
          const matchId = d.id.toLowerCase().includes(q);
          const matchPhone = d.phone.toLowerCase().includes(q);
          const matchEmail = d.email.toLowerCase().includes(q);
          const matchLicense = d.licenseNumber.toLowerCase().includes(q);
          const matchVehicle = (d.assignedVehicle || '').toLowerCase().includes(q);
          const matchAddress = (d.address || '').toLowerCase().includes(q);

          return (
            matchName ||
            matchId ||
            matchPhone ||
            matchEmail ||
            matchLicense ||
            matchVehicle ||
            matchAddress
          );
        }

        return true;
      })
      .sort((a, b) => {
        let compareValue = 0;

        switch (sortField) {
          case 'name':
            compareValue = a.name.localeCompare(b.name);
            break;
          case 'id':
            compareValue = a.id.localeCompare(b.id);
            break;
          case 'status':
            compareValue = a.status.localeCompare(b.status);
            break;
          case 'experienceYears':
            compareValue = a.experienceYears - b.experienceYears;
            break;
          case 'rating':
            compareValue = a.performance.rating - b.performance.rating;
            break;
          case 'completedDeliveries':
            compareValue =
              a.performance.completedDeliveries - b.performance.completedDeliveries;
            break;
          case 'licenseExpiry':
            compareValue = a.licenseExpiry.localeCompare(b.licenseExpiry);
            break;
          default:
            compareValue = 0;
        }

        return sortDirection === 'asc' ? compareValue : -compareValue;
      });
  }, [
    drivers,
    searchQuery,
    statusFilter,
    vehicleFilter,
    locationFilter,
    experienceFilter,
    ratingFilter,
    dateRange,
    sortField,
    sortDirection,
  ]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    vehicleFilter,
    locationFilter,
    experienceFilter,
    ratingFilter,
    dateRange,
  ]);

  // Paginated drivers slice
  const totalPages = Math.ceil(filteredDrivers.length / pageSize) || 1;
  const paginatedDrivers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDrivers.slice(startIndex, startIndex + pageSize);
  }, [filteredDrivers, currentPage, pageSize]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      statusFilter !== 'All' ||
      vehicleFilter !== 'All' ||
      (locationFilter !== 'All' && locationFilter !== 'All Base Terminals' && locationFilter) ||
      experienceFilter !== 'All' ||
      ratingFilter !== 'All' ||
      dateRange.preset !== 'all'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setVehicleFilter('All');
    setLocationFilter('All');
    setExperienceFilter('All');
    setRatingFilter('All');
    setDateRange({ preset: 'all' });
    setSortField('name');
    setSortDirection('asc');
    addToast('info', 'Filters Reset', 'Displaying all driver records.');
  };

  // Add / Edit Handlers
  const handleOpenAddModal = () => {
    setEditingDriver(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setIsFormModalOpen(true);
  };

  const handleSaveDriver = (formData: DriverFormData, driverId?: string) => {
    if (driverId) {
      // Edit
      const updated = drivers.map((d) => {
        if (d.id === driverId) {
          return {
            ...d,
            ...formData,
            emergencyContact: {
              name: formData.emergencyContactName || d.emergencyContact?.name || '',
              phone: formData.emergencyContactPhone || d.emergencyContact?.phone || '',
              relationship:
                formData.emergencyContactRelation || d.emergencyContact?.relationship || '',
            },
          };
        }
        return d;
      });
      setDrivers(updated);
      saveStoredDrivers(updated);
      addToast(
        'success',
        'Driver Profile Updated',
        `Details for ${formData.name} saved successfully.`
      );
    } else {
      // Create
      const newId = `drv-${String(drivers.length + 1).padStart(3, '0')}`;
      const newDriver: Driver = {
        id: newId,
        ...formData,
        licenseState: formData.licenseState || 'IL',
        joinDate: new Date().toISOString().split('T')[0],
        certifications: formData.certifications || ['CDL Class A'],
        emergencyContact: {
          name: formData.emergencyContactName || 'Family Contact',
          phone: formData.emergencyContactPhone || '(555) 000-0000',
          relationship: formData.emergencyContactRelation || 'Spouse',
        },
        performance: {
          totalDeliveries: 0,
          completedDeliveries: 0,
          onTimeRate: 100,
          rating: 5.0,
          totalDistance: 0,
          safetyScore: 100,
          fuelEfficiencyScore: 95,
        },
        deliveryHistory: [],
      };
      const updated = [newDriver, ...drivers];
      setDrivers(updated);
      saveStoredDrivers(updated);
      addToast(
        'success',
        'Driver Registered',
        `${formData.name} has been enrolled into the fleet driver roster.`
      );
    }
  };

  // Details
  const handleOpenDetails = (driver: Driver) => {
    setSelectedDetailsDriver(driver);
    setIsDetailsModalOpen(true);
  };

  // Delete
  const handleOpenDeleteModal = (driver: Driver) => {
    setDeletingDriver(driver);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (driver: Driver) => {
    const updated = drivers.filter((d) => d.id !== driver.id);
    setDrivers(updated);
    saveStoredDrivers(updated);
    addToast(
      'error',
      'Driver Removed',
      `Driver ${driver.name} (${driver.id}) removed from roster.`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <Link to="/dashboard" className="hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Driver Management</span>
          </nav>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Driver Roster & Telemetry
            </h1>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 animate-pulse-slow">
              {drivers.length} Enrolled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage commercial driver assignments, duty shifts, safety ratings, and licensing.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadDrivers(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all btn-press"
            title="Refresh driver records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* 2. Driver Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Available Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Available' ? 'All' : 'Available')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-1 ${
            statusFilter === 'Available'
              ? 'ring-2 ring-emerald-500 border-emerald-500'
              : 'border-slate-200/80 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Available For Dispatch
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 font-mono">{counts.available}</span>
            <span className="text-[11px] text-slate-500 font-medium">Ready for dispatch</span>
          </div>
        </div>

        {/* On Duty Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'On Duty' ? 'All' : 'On Duty')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-2 ${
            statusFilter === 'On Duty'
              ? 'ring-2 ring-blue-500 border-blue-500'
              : 'border-slate-200/80 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              On Active Duty
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 font-mono">{counts.onDuty}</span>
            <span className="text-[11px] text-slate-500 font-medium">En route with cargo</span>
          </div>
        </div>

        {/* Off Duty Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Off Duty' ? 'All' : 'Off Duty')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-3 ${
            statusFilter === 'Off Duty' ? 'ring-2 ring-slate-500 border-slate-500' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Off Duty
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{counts.offDuty}</span>
            <span className="text-[11px] text-slate-500 font-medium">Shift completed</span>
          </div>
        </div>

        {/* On Leave Card */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'On Leave' ? 'All' : 'On Leave')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-4 ${
            statusFilter === 'On Leave'
              ? 'ring-2 ring-amber-500 border-amber-500'
              : 'border-slate-200/80 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              On Scheduled Leave
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 font-mono">{counts.onLeave}</span>
            <span className="text-[11px] text-amber-600 font-medium">Vacation / Medical</span>
          </div>
        </div>
      </div>

      {/* 3. Driver Filtering Toolbar */}
      <DriverFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        vehicleFilter={vehicleFilter}
        onVehicleChange={setVehicleFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        experienceFilter={experienceFilter}
        onExperienceChange={setExperienceFilter}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
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
        vehicleOptions={AVAILABLE_FLEET_VEHICLES}
        locationsList={uniqueLocations}
      />

      {/* 4. Drivers Content Feed: Loading Skeleton vs Table vs Card Grid */}
      {isLoading ? (
        viewMode === 'table' ? (
          <TableLoadingSkeleton rows={6} cols={6} />
        ) : (
          <CardGridLoadingSkeleton cards={6} />
        )
      ) : paginatedDrivers.length > 0 ? (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <div>
              {/* Show Table on md+ screens */}
              <div className="hidden md:block">
                <DriverTable
                  drivers={paginatedDrivers}
                  onViewDetails={handleOpenDetails}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paginatedDrivers.map((driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
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
              {paginatedDrivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
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
              totalItems={filteredDrivers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              itemName="drivers"
            />
          </div>
        </div>
      ) : (
        <EmptyState
          title="No drivers found"
          description={
            hasActiveFilters
              ? 'No driver profiles match your active search and filter criteria. Try adjusting your parameters.'
              : 'No commercial drivers are registered in the roster.'
          }
          actionText="Clear All Filters"
          onAction={handleResetFilters}
          secondaryActionText="Enroll New Driver"
          onSecondaryAction={handleOpenAddModal}
        />
      )}

      {/* Modals */}
      <DriverForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveDriver}
        initialDriver={editingDriver}
      />

      <DriverDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        driver={selectedDetailsDriver}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      <DeleteDriverModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        driver={deletingDriver}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default Drivers;
