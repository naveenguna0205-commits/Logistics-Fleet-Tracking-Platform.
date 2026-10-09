import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load telemetry data',
  message = 'An unexpected connection or parse error occurred while synchronizing records. Please try again.',
  onRetry,
  actionText = 'Retry Connection',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-rose-50/60 border border-rose-200 rounded-2xl animate-fade-in my-3 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6 stroke-[2]" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-1 mb-4">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
