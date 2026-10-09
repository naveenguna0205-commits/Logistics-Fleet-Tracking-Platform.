import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try adjusting your search terms or filter criteria to find what you are looking for.',
  icon: Icon = SearchX,
  actionText = 'Reset Filters',
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-white border border-dashed border-slate-300 rounded-3xl animate-fade-in my-3 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 mb-6">{description}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && actionText && (
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </button>
        )}

        {onSecondaryAction && secondaryActionText && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};
