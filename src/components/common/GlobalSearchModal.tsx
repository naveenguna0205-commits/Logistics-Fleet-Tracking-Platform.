import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Truck,
  Users,
  Package,
  Bell,
  X,
  ArrowRight,
} from 'lucide-react';
import { getStoredVehicles } from '../../services/vehicleStorage';
import { getStoredDrivers } from '../../services/driverStorage';
import { getStoredShipments } from '../../services/shipmentStorage';
import { getStoredNotifications } from '../../services/notificationStorage';
import { Vehicle } from '../../types/vehicle';
import { Driver } from '../../types/driver';
import { Shipment } from '../../types/shipment';
import { NotificationItem } from '../../types/notification';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

type SearchCategoryTab = 'all' | 'vehicles' | 'drivers' | 'shipments' | 'notifications';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchCategoryTab>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Load live data from storages
  const vehicles = useMemo(() => (isOpen ? getStoredVehicles() : []), [isOpen]);
  const drivers = useMemo(() => (isOpen ? getStoredDrivers() : []), [isOpen]);
  const shipments = useMemo(() => (isOpen ? getStoredShipments() : []), [isOpen]);
  const notifications = useMemo(() => (isOpen ? getStoredNotifications() : []), [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const q = query.toLowerCase().trim();

  const matchedVehicles = useMemo(() => {
    if (!q) return vehicles.slice(0, 4);
    return vehicles.filter(
      (v) =>
        v.vehicleNumber.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.licensePlate.toLowerCase().includes(q) ||
        (v.currentLocation || '').toLowerCase().includes(q)
    );
  }, [vehicles, q]);

  const matchedDrivers = useMemo(() => {
    if (!q) return drivers.slice(0, 4);
    return drivers.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.assignedVehicle.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
    );
  }, [drivers, q]);

  const matchedShipments = useMemo(() => {
    if (!q) return shipments.slice(0, 4);
    return shipments.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.trackingNumber.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.pickupLocation.toLowerCase().includes(q) ||
        s.deliveryLocation.toLowerCase().includes(q) ||
        s.assignedDriver.toLowerCase().includes(q) ||
        s.assignedVehicle.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q)
    );
  }, [shipments, q]);

  const matchedNotifications = useMemo(() => {
    if (!q) return notifications.slice(0, 4);
    return notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        (n.metadata?.shipmentId && n.metadata.shipmentId.toLowerCase().includes(q)) ||
        (n.metadata?.vehicleNumber && n.metadata.vehicleNumber.toLowerCase().includes(q)) ||
        (n.metadata?.driverName && n.metadata.driverName.toLowerCase().includes(q))
    );
  }, [notifications, q]);

  const flatResults = useMemo(() => {
    const list: {
      type: 'vehicle' | 'driver' | 'shipment' | 'notification';
      item: Vehicle | Driver | Shipment | NotificationItem;
      id: string;
      title: string;
      subtitle: string;
      tag: string;
      tagColor: string;
      path: string;
    }[] = [];

    if (activeTab === 'all' || activeTab === 'vehicles') {
      matchedVehicles.forEach((v) => {
        list.push({
          type: 'vehicle',
          item: v,
          id: v.id,
          title: `${v.vehicleNumber} — ${v.model}`,
          subtitle: `Driver: ${v.driver} • Fuel: ${v.fuelLevel}% • Location: ${v.currentLocation || 'Depot'}`,
          tag: v.status,
          tagColor:
            v.status === 'Active'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : v.status === 'Maintenance'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200',
          path: `/vehicles`,
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'drivers') {
      matchedDrivers.forEach((d) => {
        list.push({
          type: 'driver',
          item: d,
          id: d.id,
          title: d.name,
          subtitle: `Status: ${d.status} • Assigned: ${d.assignedVehicle} • Rating: ★${d.performance?.rating || '4.9'}`,
          tag: d.status,
          tagColor:
            d.status === 'Available'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : d.status === 'On Duty'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-100 text-slate-700 border-slate-200',
          path: `/drivers`,
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'shipments') {
      matchedShipments.forEach((s) => {
        list.push({
          type: 'shipment',
          item: s,
          id: s.id,
          title: `${s.id}: ${s.customerName}`,
          subtitle: `${s.pickupLocation} → ${s.deliveryLocation} • ETA: ${s.expectedDelivery}`,
          tag: s.status,
          tagColor:
            s.status === 'In Transit'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : s.status === 'Delivered'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : s.status === 'Delayed'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-amber-50 text-amber-700 border-amber-200',
          path: `/shipments`,
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'notifications') {
      matchedNotifications.forEach((n) => {
        list.push({
          type: 'notification',
          item: n,
          id: n.id,
          title: n.title,
          subtitle: `${n.timestamp} • ${n.message.substring(0, 75)}...`,
          tag: n.priority.toUpperCase(),
          tagColor:
            n.priority === 'critical'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : n.priority === 'high'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-blue-50 text-blue-700 border-blue-200',
          path: `/notifications`,
        });
      });
    }

    return list;
  }, [matchedVehicles, matchedDrivers, matchedShipments, matchedNotifications, activeTab]);

  const totalResults =
    matchedVehicles.length +
    matchedDrivers.length +
    matchedShipments.length +
    matchedNotifications.length;

  const handleSelectItem = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatResults[selectedIndex]) {
        handleSelectItem(flatResults[selectedIndex].path);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-modal-pop text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Box */}
        <div className="relative border-b border-slate-100 p-4 bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search fleet, vehicles, drivers, parcels, alerts..."
            className="w-full text-sm sm:text-base font-medium bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 rounded-lg transition-colors border border-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            onClick={() => {
              setActiveTab('vehicles');
              setSelectedIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vehicles'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Vehicles ({matchedVehicles.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('drivers');
              setSelectedIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'drivers'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Drivers ({matchedDrivers.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('shipments');
              setSelectedIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'shipments'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Shipments ({matchedShipments.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('notifications');
              setSelectedIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notifications ({matchedNotifications.length})
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="px-4 py-2.5 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Quick Filters:</span>
            <button
              onClick={() => setQuery('Active')}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:border-blue-400 text-slate-700 hover:text-blue-600 text-[11px] font-medium transition-colors"
            >
              Active Vehicles
            </button>
            <button
              onClick={() => setQuery('Delayed')}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:border-blue-400 text-slate-700 hover:text-blue-600 text-[11px] font-medium transition-colors"
            >
              Delayed Shipments
            </button>
            <button
              onClick={() => setQuery('Low Fuel')}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:border-blue-400 text-slate-700 hover:text-blue-600 text-[11px] font-medium transition-colors"
            >
              Low Fuel Alerts
            </button>
            <button
              onClick={() => setQuery('On Duty')}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:border-blue-400 text-slate-700 hover:text-blue-600 text-[11px] font-medium transition-colors"
            >
              On Duty Drivers
            </button>
          </div>
        )}

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {flatResults.length > 0 ? (
            flatResults.map((result, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon =
                result.type === 'vehicle'
                  ? Truck
                  : result.type === 'driver'
                  ? Users
                  : result.type === 'shipment'
                  ? Package
                  : Bell;

              return (
                <div
                  key={`${result.type}-${result.id}-${idx}`}
                  onClick={() => handleSelectItem(result.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-200 shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        result.type === 'vehicle'
                          ? 'bg-blue-100 text-blue-600'
                          : result.type === 'driver'
                          ? 'bg-indigo-100 text-indigo-600'
                          : result.type === 'shipment'
                          ? 'bg-teal-100 text-teal-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {result.title}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${result.tagColor}`}
                        >
                          {result.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {result.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className="text-[11px] font-bold text-blue-600 hidden sm:flex items-center gap-1">
                      <span>Jump</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <Search className="w-9 h-9 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No results found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">
                Check for typos or try searching vehicle IDs, driver names, or shipment tracking numbers.
              </p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700">↵</kbd> to select
            </span>
          </div>
          <span className="font-semibold text-blue-600">LogiTrack Pro Search</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
