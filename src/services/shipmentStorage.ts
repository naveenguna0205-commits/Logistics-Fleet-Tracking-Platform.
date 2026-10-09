import { Shipment } from '../types/shipment';
import { INITIAL_SHIPMENTS } from '../data/shipmentData';

const SHIPMENTS_STORAGE_KEY = 'logitrack_shipments_v1';
const LEGACY_KEY = 'fleetflow_shipments_v1';

export const getStoredShipments = (): Shipment[] => {
  try {
    const saved = localStorage.getItem(SHIPMENTS_STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load shipments from localStorage:', err);
  }
  return INITIAL_SHIPMENTS;
};

export const saveStoredShipments = (shipments: Shipment[]): void => {
  try {
    localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify(shipments));
  } catch (err) {
    console.error('Failed to save shipments to localStorage:', err);
  }
};

export const resetStoredShipments = (): Shipment[] => {
  localStorage.removeItem(SHIPMENTS_STORAGE_KEY);
  return INITIAL_SHIPMENTS;
};
