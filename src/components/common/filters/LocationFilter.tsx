import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, X, Search } from 'lucide-react';

export interface LocationFilterProps {
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  locations?: string[];
  label?: string;
}

export const DEFAULT_HUB_LOCATIONS = [
  'All Hubs & Depots',
  'Chicago Hub, IL',
  'Los Angeles Hub, CA',
  'Dallas Transit Hub, TX',
  'New York Terminal, NY',
  'Seattle Port Terminal, WA',
  'Atlanta Central Depot, GA',
  'Detroit Metro Gateway, MI',
  'Denver Mountain Corridor, CO',
  'Houston Gulf Terminal, TX',
  'Miami Distribution Center, FL',
];

export const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedLocation,
  onLocationChange,
  locations = DEFAULT_HUB_LOCATIONS,
  label = 'Location',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const isFiltered = selectedLocation !== 'All' && selectedLocation !== 'All Hubs & Depots' && selectedLocation !== '';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          isFiltered
            ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
        }`}
      >
        <MapPin className={`w-3.5 h-3.5 ${isFiltered ? 'text-blue-600' : 'text-slate-400'}`} />
        <span className="truncate max-w-[130px]">
          {isFiltered ? selectedLocation : label}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 px-1">
            <span className="text-xs font-bold text-slate-900">Select Hub / Depot</span>
            {isFiltered && (
              <button
                onClick={() => {
                  onLocationChange('All');
                  setIsOpen(false);
                }}
                className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-0.5"
              >
                <X className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hubs, cities..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filteredLocations.map((loc) => {
              const value = loc.startsWith('All') ? 'All' : loc;
              const isSelected = selectedLocation === value || (value === 'All' && (!selectedLocation || selectedLocation === 'All'));

              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onLocationChange(value);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{loc}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white flex-shrink-0 ml-1.5" />}
                </button>
              );
            })}
            {filteredLocations.length === 0 && (
              <p className="text-center py-3 text-xs text-slate-400">No matching locations</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
