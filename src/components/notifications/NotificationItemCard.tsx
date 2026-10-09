import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Wrench,
  Fuel,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Mail,
  MailOpen,
  ArrowRight,
  MapPin,
  Truck,
  User,
  Package,
} from 'lucide-react';
import { NotificationItem, NotificationCategory } from '../../types/notification';
import { NOTIFICATION_CATEGORIES_CONFIG } from '../../data/mockNotifications';

interface NotificationItemCardProps {
  notification: NotificationItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notification,
  isSelected = false,
  onToggleSelect,
  onToggleRead,
  onDelete,
}) => {
  const config = NOTIFICATION_CATEGORIES_CONFIG[notification.category] || {
    label: 'Alert',
    badgeColor: 'bg-slate-700/40 text-slate-300 border-[#233470]',
    iconColor: 'text-slate-400',
    accentColor: 'border-l-slate-400',
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'delayed_shipment':
        return Clock;
      case 'maintenance':
        return Wrench;
      case 'low_fuel':
        return Fuel;
      case 'driver_status':
        return UserCheck;
      case 'delivery_update':
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  };

  const Icon = getCategoryIcon(notification.category);

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 ${
        notification.isRead
          ? 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
          : 'bg-blue-50/30 border-blue-200 shadow-xs ring-1 ring-blue-500/10'
      }`}
    >
      {/* Left Accent indicator for unread */}
      {!notification.isRead && (
        <span
          className="absolute left-0 top-3 bottom-3 w-1.5 bg-blue-600 rounded-r-full"
          aria-hidden="true"
        />
      )}

      {/* Checkbox (Batch Selection) */}
      {onToggleSelect && (
        <div className="pt-0.5 sm:pt-1 pl-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(notification.id)}
            className="w-4 h-4 rounded text-blue-600 border-slate-300 bg-white focus:ring-blue-500 cursor-pointer"
          />
        </div>
      )}

      {/* Category Icon Badge */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
          notification.category === 'delayed_shipment'
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : notification.category === 'maintenance'
            ? 'bg-amber-50 text-amber-600 border border-amber-200'
            : notification.category === 'low_fuel'
            ? 'bg-orange-50 text-orange-600 border border-orange-200'
            : notification.category === 'driver_status'
            ? 'bg-blue-50 text-blue-600 border border-blue-200'
            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
        }`}
      >
        <Icon className="w-5 h-5 stroke-[2.2]" />
      </div>

      {/* Main Body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Top Header: Category Tag, Priority, Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}
            >
              {config.label}
            </span>

            {/* Priority Tag */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                notification.priority === 'critical'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : notification.priority === 'high'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : notification.priority === 'medium'
                  ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {notification.priority === 'critical' && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              )}
              {notification.priority.toUpperCase()}
            </span>

            {!notification.isRead && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                New
              </span>
            )}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {notification.timestamp}
          </span>
        </div>

        {/* Title */}
        <h4
          className={`text-sm sm:text-base leading-snug ${
            notification.isRead ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'
          }`}
        >
          {notification.title}
        </h4>

        {/* Message */}
        <p className={`text-xs sm:text-sm leading-relaxed ${notification.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
          {notification.message}
        </p>

        {/* Metadata Badges */}
        {notification.metadata && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {notification.metadata.vehicleNumber && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                <Truck className="w-3 h-3 text-slate-500" />
                Vehicle: {notification.metadata.vehicleNumber}
              </span>
            )}
            {notification.metadata.driverName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                <User className="w-3 h-3 text-slate-500" />
                Driver: {notification.metadata.driverName}
              </span>
            )}
            {notification.metadata.shipmentId && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                <Package className="w-3 h-3 text-slate-500" />
                Shipment: {notification.metadata.shipmentId}
              </span>
            )}
            {notification.metadata.fuelLevel !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-lg border border-orange-200">
                <Fuel className="w-3 h-3 text-orange-600" />
                Fuel: {notification.metadata.fuelLevel}%
              </span>
            )}
            {notification.metadata.delayMinutes !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-lg border border-rose-200">
                <Clock className="w-3 h-3 text-rose-600" />
                Delay: +{notification.metadata.delayMinutes}m
              </span>
            )}
            {notification.metadata.location && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200">
                <MapPin className="w-3 h-3 text-slate-400" />
                {notification.metadata.location}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Action Controls */}
      <div className="flex sm:flex-col items-center gap-1.5 self-end sm:self-center ml-auto flex-shrink-0 pt-2 sm:pt-0">
        {notification.actionLink && (
          <Link
            to={notification.actionLink}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/25"
          >
            <span>{notification.actionLabel || 'View'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}

        <button
          onClick={() => onToggleRead(notification.id)}
          className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
            notification.isRead
              ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
          }`}
          title={notification.isRead ? 'Mark as Unread' : 'Mark as Read'}
        >
          {notification.isRead ? (
            <Mail className="w-3.5 h-3.5" />
          ) : (
            <MailOpen className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={() => onDelete(notification.id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
          title="Delete Notification"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
