import React from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  AlertTriangle,
  XCircle,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { Shipment, ShipmentStatus, TimelineEvent } from '../../types/shipment';

interface DeliveryTimelineProps {
  shipment: Shipment;
}

interface StandardStep {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const STANDARD_STEPS: StandardStep[] = [
  {
    key: 'Created',
    label: 'Shipment Created',
    description: 'Booking & Bill of Lading confirmed',
    icon: Package,
  },
  {
    key: 'Picked Up',
    label: 'Picked Up',
    description: 'Loaded at origin dock & inspected',
    icon: MapPin,
  },
  {
    key: 'In Transit',
    label: 'In Transit',
    description: 'En route via interstate highway corridor',
    icon: Truck,
  },
  {
    key: 'Out for Delivery',
    label: 'Out for Delivery',
    description: 'Local courier dispatched to receiving dock',
    icon: Clock,
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    description: 'Signature verified & package handed over',
    icon: CheckCircle2,
  },
];

export const DeliveryTimeline: React.FC<DeliveryTimelineProps> = ({ shipment }) => {
  const getStepStatus = (stepKey: string): 'completed' | 'current' | 'pending' | 'delayed' | 'cancelled' => {
    if (shipment.status === 'Cancelled') return 'cancelled';

    // Map shipment status to step indices
    const statusOrder: Record<ShipmentStatus, number> = {
      'Pending': 0,
      'Picked Up': 1,
      'In Transit': 2,
      'Delayed': 2, // In transit but delayed
      'Delivered': 4,
      'Cancelled': -1,
    };

    const stepIndices: Record<string, number> = {
      'Created': 0,
      'Picked Up': 1,
      'In Transit': 2,
      'Out for Delivery': 3,
      'Delivered': 4,
    };

    const currentOrder = statusOrder[shipment.status] ?? 0;
    const thisStepIndex = stepIndices[stepKey] ?? 0;

    if (shipment.status === 'Delayed' && stepKey === 'In Transit') {
      return 'delayed';
    }

    if (thisStepIndex < currentOrder) return 'completed';
    if (thisStepIndex === currentOrder) return 'current';
    return 'pending';
  };

  const getTimelineEventForStep = (stepKey: string): TimelineEvent | undefined => {
    return shipment.timeline?.find((t) => t.step === stepKey);
  };

  return (
    <div className="space-y-4">
      {/* Exception Banners if Delayed or Cancelled */}
      {shipment.status === 'Delayed' && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-900">Shipment In Transit With Delay</h4>
            <p className="text-[11px] text-rose-600 mt-0.5">
              Traffic congestion, severe weather, or road maintenance reported on route. Dispatch is actively monitoring estimated arrival time.
            </p>
          </div>
        </div>
      )}

      {shipment.status === 'Cancelled' && (
        <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex items-start gap-3 text-slate-700 text-xs">
          <XCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900">Shipment Cancelled</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              This shipment order was cancelled prior to final delivery. Cargo returned to depot registry.
            </p>
          </div>
        </div>
      )}

      {/* Vertical Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {STANDARD_STEPS.map((step) => {
          const status = getStepStatus(step.key);
          const event = getTimelineEventForStep(step.key);
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative group">
              {/* Step Circle Indicator Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  status === 'completed'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : status === 'current'
                    ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-500/20'
                    : status === 'delayed'
                    ? 'bg-rose-600 border-rose-600 text-white ring-4 ring-rose-500/20'
                    : status === 'cancelled'
                    ? 'bg-slate-100 border-slate-300 text-slate-400'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                ) : status === 'delayed' ? (
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Step Details Card */}
              <div
                className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                  status === 'current'
                    ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                    : status === 'delayed'
                    ? 'bg-rose-50 border-rose-200'
                    : status === 'completed'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-50/50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-extrabold ${
                        status === 'current'
                          ? 'text-blue-700'
                          : status === 'delayed'
                          ? 'text-rose-700'
                          : status === 'completed'
                          ? 'text-slate-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {status === 'current' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white animate-pulse">
                        Active Stage
                      </span>
                    )}
                    {status === 'delayed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                        Delayed
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    {event?.timestamp || (status === 'completed' ? 'Completed' : 'Pending')}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                  {event?.notes || step.description}
                </p>

                {event?.location && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-2 pt-2 border-t border-slate-200">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
