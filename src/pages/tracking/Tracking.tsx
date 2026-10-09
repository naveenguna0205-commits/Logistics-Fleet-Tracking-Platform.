import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Navigation,
  Truck,
  AlertTriangle,
  Compass,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Play,
  Pause,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  TrackingVehicle,
  TrackingFilterState,
} from '../../types/tracking';
import {
  INITIAL_TRACKING_VEHICLES,
  calculateTrackingStats,
  advanceVehicleSimulation,
} from '../../data/trackingData';
import { TrackingFilters } from '../../components/tracking/TrackingFilters';
import { TrackingSidebar } from '../../components/tracking/TrackingSidebar';
import { TrackingMap } from '../../components/tracking/TrackingMap';
import { TrackingDetails } from '../../components/tracking/TrackingDetails';
import { ToastContainer, ToastMessage } from '../../components/common/Toast';

export const Tracking: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Fleet state
  const [vehicles, setVehicles] = useState<TrackingVehicle[]>(INITIAL_TRACKING_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    INITIAL_TRACKING_VEHICLES[0]?.id || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasFeedError, setHasFeedError] = useState<boolean>(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Filter state
  const [filters, setFilters] = useState<TrackingFilterState>({
    searchQuery: '',
    status: 'All',
    driver: 'All',
    shipment: 'All',
  });

  // Mobile Drawer toggles
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      addToast('success', 'Telemetry Stream Connected', 'Real-time GPS tracking stream initialized with 10 fleet units.');
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Check URL query param for vehicle
  useEffect(() => {
    const vehicleParam = searchParams.get('vehicle');
    if (vehicleParam) {
      const match = vehicles.find(
        (v) =>
          v.vehicleNumber.toLowerCase() === vehicleParam.toLowerCase() ||
          v.id.toLowerCase() === vehicleParam.toLowerCase()
      );
      if (match) {
        setSelectedVehicleId(match.id);
      }
    }
  }, [searchParams, vehicles]);

  // Real-Time Simulation Interval
  useEffect(() => {
    if (!isSimulating || isLoading || hasFeedError) return;

    const intervalMs = Math.max(800, Math.round(2400 / simulationSpeed));

    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => advanceVehicleSimulation(vehicle, simulationSpeed))
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, isLoading, hasFeedError]);

  // Unique Drivers List
  const driversList = useMemo(() => {
    const names = new Set<string>();
    vehicles.forEach((v) => {
      if (v.driver && v.driver.name && v.driver.name !== 'Unassigned') {
        names.add(v.driver.name);
      }
    });
    return Array.from(names).sort();
  }, [vehicles]);

  // Unique Shipments List
  const shipmentsList = useMemo(() => {
    const list: { id: string; label: string }[] = [];
    vehicles.forEach((v) => {
      if (v.shipment && v.shipment.id && !v.shipment.id.includes('IDLE') && !v.shipment.id.includes('OFFLINE')) {
        list.push({
          id: v.shipment.id,
          label: `${v.shipment.id} (${v.route.pickup.city || 'Origin'} → ${v.route.destination.city || 'Dest'})`,
        });
      }
    });
    return list;
  }, [vehicles]);

  // Filtered Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // 1. Search filter (vehicle number, model, driver, shipment)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchNumber = v.vehicleNumber.toLowerCase().includes(q);
        const matchModel = v.model.toLowerCase().includes(q);
        const matchDriver = v.driver.name.toLowerCase().includes(q);
        const matchShipment = v.shipment.id.toLowerCase().includes(q);
        const matchCity =
          v.currentLocation.name.toLowerCase().includes(q) ||
          v.currentLocation.address.toLowerCase().includes(q);

        if (!matchNumber && !matchModel && !matchDriver && !matchShipment && !matchCity) {
          return false;
        }
      }

      // 2. Status filter
      if (filters.status !== 'All') {
        if (v.status !== filters.status) return false;
      }

      // 3. Driver filter
      if (filters.driver !== 'All') {
        if (v.driver.name !== filters.driver) return false;
      }

      // 4. Shipment filter
      if (filters.shipment !== 'All') {
        if (v.shipment.id !== filters.shipment) return false;
      }

      return true;
    });
  }, [vehicles, filters]);

  // Calculate Fleet Stats
  const stats = useMemo(() => calculateTrackingStats(vehicles), [vehicles]);

  // Selected Vehicle Object
  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  // Handlers
  const handleFilterChange = (key: keyof TrackingFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'All',
      driver: 'All',
      shipment: 'All',
    });
    addToast('info', 'Filters Cleared', 'Displaying all active fleet units.');
  };

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const v = vehicles.find((item) => item.id === vehicleId);
    if (v) {
      addToast('info', `Tracking ${v.vehicleNumber}`, `Focused on ${v.model} (${v.driver.name})`);
    }
  };

  const handleToggleSimulation = () => {
    const nextState = !isSimulating;
    setIsSimulating(nextState);
    addToast(
      'info',
      nextState ? 'Live Simulation Resumed' : 'Live Simulation Paused',
      nextState ? 'Vehicles are moving along their highway routes.' : 'Vehicle movement frozen.'
    );
  };

  const handleChangeSimulationSpeed = (speed: number) => {
    setSimulationSpeed(speed);
    addToast('info', `Simulation Speed ${speed}x`, `GPS movement updated to ${speed}x playback.`);
  };

  const handleManualPing = () => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) => advanceVehicleSimulation(vehicle, 2))
    );
    addToast('success', 'GPS Telemetry Pinged', 'Telemetry step advanced successfully.');
  };

  const handleRefreshFeed = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasFeedError(false);
      addToast('success', 'Feed Refreshed', 'Refreshed latest GPS coordinates and sensor data.');
    }, 400);
  };

  return (
    <div className="space-y-5 pb-16 lg:pb-6 animate-fade-in">
      {/* ================= 1. PAGE HEADER & BREADCRUMBS ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
              LogiTrack Pro
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Live GPS Tracking</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Live Fleet Tracking
            </h1>

            {/* Live Indicator Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Real-time Active
            </div>
          </div>
        </div>

        {/* Top Header Quick Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRefreshFeed}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-xs hover:bg-slate-50 transition-all btn-press"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            Refresh Feed
          </button>

          <button
            onClick={handleToggleSimulation}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-all btn-press ${
              isSimulating
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-500/25'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? 'Pause Movement' : 'Resume Live'}
          </button>

          {/* Mobile Filter Drawer Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs btn-press"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* ================= 2. KPI METRICS BAR ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Active Vehicles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-lg card-interactive transition-all relative overflow-hidden group text-slate-800 animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Active Vehicles
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {stats.totalActive}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                {(stats.totalActive / stats.totalFleet * 100).toFixed(0)}% Fleet Active
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Vehicles In Transit */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-lg card-interactive transition-all relative overflow-hidden group text-slate-800 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Vehicles In Transit
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
                {stats.inTransit}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                Avg Speed: ~{stats.averageSpeedMph} mph
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
              <Navigation className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </div>

        {/* Delayed Vehicles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-lg card-interactive transition-all relative overflow-hidden group text-slate-800 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Delayed Vehicles
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
                {stats.delayed}
              </h3>
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                {stats.delayed > 0 ? 'Weather / Customs Alert' : '0 Delays Reported'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
        </div>

        {/* Available Vehicles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-lg card-interactive transition-all relative overflow-hidden group text-slate-800 animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available Vehicles
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
                {stats.available}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                Ready for Dispatch Staging
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
        </div>
      </div>

      {/* ================= 3. SEARCH & FILTERS BAR ================= */}
      <TrackingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        driversList={driversList}
        shipmentsList={shipmentsList}
        totalResults={filteredVehicles.length}
        totalFleet={vehicles.length}
        isMobileDrawerOpen={isMobileFilterOpen}
        onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
      />

      {/* Error State Banner if feed simulation error */}
      {hasFeedError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-700 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">GPS Telemetry Feed Interrupted</p>
              <p className="text-rose-600 text-[11px]">
                Unable to reach regional cell towers. Reconnecting in background...
              </p>
            </div>
          </div>
          <button
            onClick={handleRefreshFeed}
            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-xs hover:bg-rose-700"
          >
            Retry Feed
          </button>
        </div>
      )}

      {/* ================= 4. MAIN WORKSPACE: SIDEBAR + MAP + DETAILS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Fleet List Sidebar (4 cols on lg, 3.5 on xl) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-4">
          <TrackingSidebar
            vehicles={filteredVehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={handleSelectVehicle}
            isLoading={isLoading}
            heightClass="h-[880px] lg:h-[920px]"
          />
        </div>

        {/* Right Column: Interactive Leaflet Map + Route Details (8 cols on lg) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-5">
          {/* Interactive Map Component */}
          <TrackingMap
            vehicles={filteredVehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={handleSelectVehicle}
            isSimulating={isSimulating}
            onToggleSimulation={handleToggleSimulation}
            simulationSpeed={simulationSpeed}
            onChangeSimulationSpeed={handleChangeSimulationSpeed}
            onManualPing={handleManualPing}
            heightClass={selectedVehicle ? 'h-[440px] lg:h-[460px]' : 'h-[880px] lg:h-[920px]'}
          />

          {/* Selected Vehicle Details Panel (Below Map on Large Screens) */}
          <div>
            <TrackingDetails
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicleId(null)}
              onFocusMap={() => {
                if (selectedVehicle) {
                  addToast('info', 'Centering Map', `Focused on ${selectedVehicle.vehicleNumber}`);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* ================= 5. MOBILE BOTTOM ACTION DOCK ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900"
        >
          <div className="relative">
            <Truck className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 px-1 rounded-full bg-blue-600 text-[9px] font-bold text-white">
              {filteredVehicles.length}
            </span>
          </div>
          <span className="text-[10px] font-bold">Fleet Units</span>
        </button>

        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-bold">Filters</span>
        </button>

        <button
          onClick={() => setIsMobileDetailsOpen(true)}
          disabled={!selectedVehicle}
          className={`flex flex-col items-center gap-1 ${
            selectedVehicle
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 opacity-50 cursor-not-allowed'
          }`}
        >
          <Navigation className="w-5 h-5" />
          <span className="text-[10px] font-bold">
            {selectedVehicle ? selectedVehicle.vehicleNumber : 'Details'}
          </span>
        </button>
      </div>

      {/* Mobile Fleet Sidebar Bottom Sheet */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 shadow-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Fleet Live Units ({filteredVehicles.length})
              </h3>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mt-2">
              <TrackingSidebar
                vehicles={filteredVehicles}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={(id) => {
                  handleSelectVehicle(id);
                  setIsMobileSidebarOpen(false);
                }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Vehicle Details Bottom Sheet */}
      {isMobileDetailsOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-4 shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900">
                Vehicle & Route Telemetry
              </h3>
              <button
                onClick={() => setIsMobileDetailsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mt-2">
              <TrackingDetails
                vehicle={selectedVehicle}
                onClose={() => {
                  setSelectedVehicleId(null);
                  setIsMobileDetailsOpen(false);
                }}
                onFocusMap={() => setIsMobileDetailsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default Tracking;
