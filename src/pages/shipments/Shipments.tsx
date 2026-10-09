import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  Shipment,
  ShipmentFormData,
  ShipmentStatus,
  ShipmentPriority,
  ShipmentSortField,
  SortDirection,
} from '../../types/shipment';
import {
  getStoredShipments,
  saveStoredShipments,
} from '../../services/shipmentStorage';
import {
  AVAILABLE_DRIVERS_LIST,
  AVAILABLE_VEHICLES_LIST,
  LOCATION_PRESETS,
} from '../../data/shipmentData';
import { ShipmentFilters } from '../../components/shipments/ShipmentFilters';
import { ShipmentTable } from '../../components/shipments/ShipmentTable';
import { ShipmentCard } from '../../components/shipments/ShipmentCard';
import { ShipmentForm } from '../../components/shipments/ShipmentForm';
import { ShipmentDetails } from '../../components/shipments/ShipmentDetails';
import { DeleteShipmentModal } from '../../components/shipments/DeleteShipmentModal';
import { ToastContainer, ToastMessage } from '../../components/common/Toast';
import { Pagination } from '../../components/common/filters/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { TableLoadingSkeleton, CardGridLoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { DateRangeValue } from '../../components/common/filters/DateRangeFilter';

export const Shipments: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<ShipmentPriority | 'All'>('All');
  const [dateRange, setDateRange] = useState<DateRangeValue>({ preset: 'all' });
  const [driverFilter, setDriverFilter] = useState<string>('All');
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<ShipmentSortField>('shipmentDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Modals State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const [selectedDetailsShipment, setSelectedDetailsShipment] = useState<Shipment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const [deletingShipment, setDeletingShipment] = useState<Shipment | null>(null);
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

  // Initial Load with simulated loading delay
  const loadShipments = (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    const data = getStoredShipments();
    setShipments(data);
    if (showLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    loadShipments(true);
  }, []);

  // Summary counts for KPIs
  const counts = useMemo(() => {
    return {
      all: shipments.length,
      inTransit: shipments.filter((s) => s.status === 'In Transit').length,
      delivered: shipments.filter((s) => s.status === 'Delivered').length,
      delayed: shipments.filter((s) => s.status === 'Delayed').length,
      pending: shipments.filter((s) => s.status === 'Pending').length,
      pickedUp: shipments.filter((s) => s.status === 'Picked Up').length,
      cancelled: shipments.filter((s) => s.status === 'Cancelled').length,
    };
  }, [shipments]);

  // Extract unique locations from pickup & delivery endpoints
  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    shipments.forEach((s) => {
      if (s.pickupLocation) set.add(s.pickupLocation);
      if (s.deliveryLocation) set.add(s.deliveryLocation);
    });
    return ['All Route Terminals', ...Array.from(set)];
  }, [shipments]);

  // Filter and Sort Pipeline
  const filteredShipments = useMemo(() => {
    return shipments
      .filter((s) => {
        // Status filter
        if (statusFilter !== 'All' && s.status !== statusFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== 'All' && s.priority !== priorityFilter) {
          return false;
        }

        // Driver filter
        if (driverFilter !== 'All' && s.assignedDriver !== driverFilter) {
          return false;
        }

        // Vehicle filter
        if (vehicleFilter !== 'All' && s.assignedVehicle !== vehicleFilter) {
          return false;
        }

        // Location filter (matches either pickup or delivery hub)
        if (
          locationFilter !== 'All' &&
          locationFilter !== 'All Route Terminals' &&
          locationFilter
        ) {
          const matchPick = s.pickupLocation.toLowerCase().includes(locationFilter.toLowerCase());
          const matchDel = s.deliveryLocation.toLowerCase().includes(locationFilter.toLowerCase());
          if (!matchPick && !matchDel) return false;
        }

        // Date range filter
        if (dateRange.preset !== 'all') {
          if (dateRange.preset === 'today') {
            if (s.shipmentDate !== '2026-10-08' && s.expectedDelivery !== '2026-10-08') {
              return false;
            }
          } else if (dateRange.preset === 'custom') {
            if (dateRange.startDate && s.shipmentDate < dateRange.startDate) return false;
            if (dateRange.endDate && s.shipmentDate > dateRange.endDate) return false;
          }
        }

        // Search Query (matches ID, customer, tracking, pickup, delivery, driver, vehicle)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = s.id.toLowerCase().includes(q);
          const matchTracking = s.trackingNumber.toLowerCase().includes(q);
          const matchCust = s.customerName.toLowerCase().includes(q);
          const matchPick = s.pickupLocation.toLowerCase().includes(q);
          const matchDel = s.deliveryLocation.toLowerCase().includes(q);
          const matchDriver = s.assignedDriver.toLowerCase().includes(q);
          const matchVeh = s.assignedVehicle.toLowerCase().includes(q);
          const matchType = s.packageType.toLowerCase().includes(q);

          return (
            matchId ||
            matchTracking ||
            matchCust ||
            matchPick ||
            matchDel ||
            matchDriver ||
            matchVeh ||
            matchType
          );
        }

        return true;
      })
      .sort((a, b) => {
        let compareValue = 0;

        switch (sortField) {
          case 'id':
            compareValue = a.id.localeCompare(b.id);
            break;
          case 'customerName':
            compareValue = a.customerName.localeCompare(b.customerName);
            break;
          case 'shipmentDate':
            compareValue = a.shipmentDate.localeCompare(b.shipmentDate);
            break;
          case 'expectedDelivery':
            compareValue = a.expectedDelivery.localeCompare(b.expectedDelivery);
            break;
          case 'packageWeight':
            compareValue = a.packageWeight - b.packageWeight;
            break;
          case 'status':
            compareValue = a.status.localeCompare(b.status);
            break;
          case 'cost':
            compareValue = a.cost - b.cost;
            break;
          default:
            compareValue = 0;
        }

        return sortDirection === 'asc' ? compareValue : -compareValue;
      });
  }, [
    shipments,
    searchQuery,
    statusFilter,
    priorityFilter,
    driverFilter,
    vehicleFilter,
    locationFilter,
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
    priorityFilter,
    driverFilter,
    vehicleFilter,
    locationFilter,
    dateRange,
  ]);

  // Paginated shipments slice
  const totalPages = Math.ceil(filteredShipments.length / pageSize) || 1;
  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredShipments.slice(startIndex, startIndex + pageSize);
  }, [filteredShipments, currentPage, pageSize]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      statusFilter !== 'All' ||
      priorityFilter !== 'All' ||
      driverFilter !== 'All' ||
      vehicleFilter !== 'All' ||
      (locationFilter !== 'All' && locationFilter !== 'All Route Terminals' && locationFilter) ||
      dateRange.preset !== 'all'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setDriverFilter('All');
    setVehicleFilter('All');
    setLocationFilter('All');
    setDateRange({ preset: 'all' });
    setSortField('shipmentDate');
    setSortDirection('desc');
    addToast('info', 'Filters Reset', 'Displaying all active shipments.');
  };

  // Add / Edit Handlers
  const handleOpenAddModal = () => {
    setEditingShipment(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setIsFormModalOpen(true);
  };

  const handleSaveShipment = (formData: ShipmentFormData, shipmentId?: string) => {
    if (shipmentId) {
      // Edit
      const updated = shipments.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            ...formData,
            priority: formData.priority || s.priority,
            cost: formData.cost || s.cost,
          };
        }
        return s;
      });
      setShipments(updated);
      saveStoredShipments(updated);
      addToast(
        'success',
        'Shipment Updated',
        `Manifest for shipment ${shipmentId} saved.`
      );
    } else {
      // Create
      const newId = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;
      const newShipment: Shipment = {
        id: newId,
        trackingNumber: `TRK-${newId}-${Math.floor(100 + Math.random() * 900)}`,
        ...formData,
        priority: formData.priority || 'Standard',
        cost: formData.cost || 450,
        timeline: [
          {
            id: `evt-${Date.now()}`,
            step: 'Created',
            title: 'Shipment Order Created',
            timestamp: 'Just now',
            location: formData.pickupLocation,
            completed: true,
            current: true,
            notes: 'Commercial bill of lading generated.',
          },
        ],
      };
      const updated = [newShipment, ...shipments];
      setShipments(updated);
      saveStoredShipments(updated);
      addToast(
        'success',
        'Shipment Created',
        `New shipment ${newId} booked for ${formData.customerName}.`
      );
    }
  };

  // Details View Handler
  const handleOpenDetails = (shipment: Shipment) => {
    setSelectedDetailsShipment(shipment);
    setIsDetailsModalOpen(true);
  };

  // Delete Handlers
  const handleOpenDeleteModal = (shipment: Shipment) => {
    setDeletingShipment(shipment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (shipment: Shipment) => {
    const updated = shipments.filter((s) => s.id !== shipment.id);
    setShipments(updated);
    saveStoredShipments(updated);
    addToast(
      'error',
      'Shipment Deleted',
      `Shipment ${shipment.id} has been removed from the pipeline.`
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
            <span className="text-slate-900 font-bold">Shipments Management</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Shipment Pipeline Tracking
            </h1>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 animate-pulse-slow">
              {shipments.length} Total Parcels
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time parcel status, transit milestones, freight weight, and driver assignments.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadShipments(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-all btn-press"
            title="Refresh shipments registry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* 2. Shipment Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* In Transit */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'In Transit' ? 'All' : 'In Transit')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-1 ${
            statusFilter === 'In Transit'
              ? 'ring-2 ring-blue-500 border-blue-500'
              : 'border-slate-200/80 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              In Transit
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{counts.inTransit}</span>
            <span className="text-[11px] text-slate-500 font-medium">Active on highway</span>
          </div>
        </div>

        {/* Delivered */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Delivered' ? 'All' : 'Delivered')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-2 ${
            statusFilter === 'Delivered'
              ? 'ring-2 ring-emerald-500 border-emerald-500'
              : 'border-slate-200/80 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Delivered
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{counts.delivered}</span>
            <span className="text-[11px] text-emerald-600 font-medium">Completed & signed</span>
          </div>
        </div>

        {/* Delayed */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Delayed' ? 'All' : 'Delayed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-3 ${
            statusFilter === 'Delayed' ? 'ring-2 ring-rose-500 border-rose-500' : 'border-slate-200/80 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Delayed
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 font-mono">{counts.delayed}</span>
            <span className="text-[11px] text-rose-600 font-medium">Action required</span>
          </div>
        </div>

        {/* Pending */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-lg card-interactive animate-fade-in-up stagger-4 ${
            statusFilter === 'Pending' ? 'ring-2 ring-amber-500 border-amber-500' : 'border-slate-200/80 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Pickup
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 font-mono">{counts.pending}</span>
            <span className="text-[11px] text-slate-500 font-medium">Awaiting loading</span>
          </div>
        </div>
      </div>

      {/* 3. Shipment Filtering Toolbar */}
      <ShipmentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        driverFilter={driverFilter}
        onDriverChange={setDriverFilter}
        vehicleFilter={vehicleFilter}
        onVehicleChange={setVehicleFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
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
        driversList={AVAILABLE_DRIVERS_LIST}
        vehiclesList={AVAILABLE_VEHICLES_LIST}
        locationsList={uniqueLocations}
      />

      {/* 4. Shipment Content: Loading Skeleton vs Table vs Card Grid */}
      {isLoading ? (
        viewMode === 'table' ? (
          <TableLoadingSkeleton rows={6} cols={7} />
        ) : (
          <CardGridLoadingSkeleton cards={6} />
        )
      ) : paginatedShipments.length > 0 ? (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <div>
              {/* Show Table on md+ screens */}
              <div className="hidden md:block">
                <ShipmentTable
                  shipments={paginatedShipments}
                  onViewDetails={handleOpenDetails}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paginatedShipments.map((shipment) => (
                    <ShipmentCard
                      key={shipment.id}
                      shipment={shipment}
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
              {paginatedShipments.map((shipment) => (
                <ShipmentCard
                  key={shipment.id}
                  shipment={shipment}
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
              totalItems={filteredShipments.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              itemName="shipments"
            />
          </div>
        </div>
      ) : (
        <EmptyState
          title="No shipments found"
          description={
            hasActiveFilters
              ? 'No shipments match your active search and filter criteria. Try changing your filters.'
              : 'No shipment manifests have been registered in the pipeline.'
          }
          actionText="Clear All Filters"
          onAction={handleResetFilters}
          secondaryActionText="Book New Shipment"
          onSecondaryAction={handleOpenAddModal}
        />
      )}

      {/* Modals */}
      <ShipmentForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveShipment}
        initialShipment={editingShipment}
      />

      <ShipmentDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        shipment={selectedDetailsShipment}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      <DeleteShipmentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        shipment={deletingShipment}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default Shipments;
