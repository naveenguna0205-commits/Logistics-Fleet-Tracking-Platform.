import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 sm:bottom-5 right-0 sm:right-5 left-0 sm:left-auto z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3.5 sm:px-0 mx-auto sm:mx-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 animate-bounce" />,
          bg: 'bg-white border-emerald-200 text-slate-800 shadow-xl shadow-emerald-500/10',
          bar: 'bg-emerald-500',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 animate-pulse" />,
          bg: 'bg-white border-rose-200 text-slate-800 shadow-xl shadow-rose-500/10',
          bar: 'bg-rose-500',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
          bg: 'bg-white border-amber-200 text-slate-800 shadow-xl shadow-amber-500/10',
          bar: 'bg-amber-500',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
          bg: 'bg-white border-blue-200 text-slate-800 shadow-xl shadow-blue-500/10',
          bar: 'bg-blue-500',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up hover:scale-[1.02] ${styles.bg}`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold leading-tight text-slate-900">{toast.title}</h4>
        {toast.description && (
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors btn-press"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Animated Duration Drain Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
        <div
          className={`h-full ${styles.bar} transition-all duration-4000 ease-linear`}
          style={{ width: '0%', animation: 'shimmer 4s linear forwards' }}
        />
      </div>
    </div>
  );
};
