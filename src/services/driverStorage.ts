import { Driver } from '../types/driver';
import { INITIAL_DRIVERS } from '../data/driverData';

const DRIVERS_STORAGE_KEY = 'logitrack_drivers_v1';
const LEGACY_KEY = 'fleetflow_drivers_v1';

export const getStoredDrivers = (): Driver[] => {
  try {
    const saved = localStorage.getItem(DRIVERS_STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load drivers from localStorage:', err);
  }
  return INITIAL_DRIVERS;
};

export const saveStoredDrivers = (drivers: Driver[]): void => {
  try {
    localStorage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(drivers));
  } catch (err) {
    console.error('Failed to save drivers to localStorage:', err);
  }
};

export const resetStoredDrivers = (): Driver[] => {
  localStorage.removeItem(DRIVERS_STORAGE_KEY);
  return INITIAL_DRIVERS;
};
