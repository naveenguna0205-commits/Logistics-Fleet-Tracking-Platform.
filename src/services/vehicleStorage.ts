import { Vehicle } from '../types/vehicle';
import { INITIAL_VEHICLES } from '../data/mockVehicles';

const VEHICLES_STORAGE_KEY = 'logitrack_vehicles_v1';
const LEGACY_KEY = 'fleetflow_vehicles_v1';

export const getStoredVehicles = (): Vehicle[] => {
  try {
    const saved = localStorage.getItem(VEHICLES_STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load vehicles from localStorage:', err);
  }
  return INITIAL_VEHICLES;
};

export const saveStoredVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Failed to save vehicles to localStorage:', err);
  }
};

export const resetStoredVehicles = (): Vehicle[] => {
  localStorage.removeItem(VEHICLES_STORAGE_KEY);
  return INITIAL_VEHICLES;
};
