import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, X } from 'lucide-react';

export type DateFilterPreset =
  | 'all'
  | 'today'
  | '24h'
  | '7d'
  | '30d'
  | 'custom';

export interface DateRangeValue {
  preset: DateFilterPreset;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export interface DateRangeFilterProps {
  value: DateRangeValue;
  onChange: (val: DateRangeValue) => void;
  label?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  label = 'Date Range',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.startDate || '');
  const [customEnd, setCustomEnd] = useState(value.endDate || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const presets: { id: DateFilterPreset; label: string }[] = [
    { id: 'all', label: 'All Dates' },
    { id: 'today', label: 'Today (Oct 8)' },
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'custom', label: 'Custom Range...' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPreset = (preset: DateFilterPreset) => {
    if (preset !== 'custom') {
      onChange({ preset });
      setIsOpen(false);
    } else {
      onChange({ preset: 'custom', startDate: customStart, endDate: customEnd });
    }
  };

  const handleApplyCustom = () => {
    onChange({
      preset: 'custom',
      startDate: customStart,
      endDate: customEnd,
    });
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (value.preset === 'custom') {
      if (value.startDate && value.endDate) {
        return `${value.startDate} - ${value.endDate}`;
      }
      if (value.startDate) return `From ${value.startDate}`;
      if (value.endDate) return `Until ${value.endDate}`;
      return 'Custom Range';
    }
    const match = presets.find((p) => p.id === value.preset);
    return match ? match.label : 'All Dates';
  };

  const isFiltered = value.preset !== 'all';

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
        <Calendar className={`w-3.5 h-3.5 ${isFiltered ? 'text-blue-600' : 'text-slate-400'}`} />
        <span className="truncate max-w-[140px]">{getDisplayText()}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <span className="text-xs font-bold text-slate-900">{label}</span>
            {isFiltered && (
              <button
                onClick={() => {
                  onChange({ preset: 'all' });
                  setIsOpen(false);
                }}
                className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-0.5"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* Presets List */}
          <div className="space-y-1">
            {presets.map((p) => {
              const isSelected = value.preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{p.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Custom Date Range Inputs */}
          {value.preset === 'custom' && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="w-full py-2 mt-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Apply Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
