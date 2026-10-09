import React from 'react';

export const TableLoadingSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 6,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden p-4 shadow-xs animate-pulse space-y-3">
      <div className="h-10 bg-slate-100 rounded-xl w-full mb-3" />
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center gap-4 py-2.5 border-b border-slate-100 last:border-0">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className={`h-5 bg-slate-100 rounded-lg ${
                cIdx === 0 ? 'w-28' : cIdx === cols - 1 ? 'w-16 ml-auto' : 'flex-1'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardGridLoadingSkeleton: React.FC<{ cards?: number }> = ({ cards = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: cards }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 bg-slate-200 rounded-lg w-24" />
            <div className="h-5 bg-slate-100 rounded-full w-16" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="h-3.5 bg-slate-100 rounded w-full" />
            <div className="h-3.5 bg-slate-100 rounded w-4/5" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-8 bg-slate-100 rounded-xl w-20" />
            <div className="h-8 bg-slate-200 rounded-xl w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const NotificationLoadingSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
              <div className="h-3.5 bg-slate-100 rounded w-16" />
            </div>
            <div className="h-3.5 bg-slate-100 rounded w-4/5" />
            <div className="flex items-center gap-2 pt-1">
              <div className="h-5 bg-slate-100 rounded-lg w-20" />
              <div className="h-5 bg-slate-100 rounded-lg w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
