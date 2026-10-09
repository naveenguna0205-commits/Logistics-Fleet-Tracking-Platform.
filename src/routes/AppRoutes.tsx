import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { VehiclesPage } from '../pages/VehiclesPage';
import { Drivers } from '../pages/drivers/Drivers';
import { Shipments } from '../pages/shipments/Shipments';
import { Tracking } from '../pages/tracking/Tracking';
import { NotificationsPage } from '../pages/notifications/Notifications';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Day 1: Dashboard Overview */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Day 2: Vehicle Management */}
        <Route path="/vehicles" element={<VehiclesPage />} />

        {/* Day 3: Driver Management */}
        <Route path="/drivers" element={<Drivers />} />

        {/* Day 4: Shipment Management */}
        <Route path="/shipments" element={<Shipments />} />

        {/* Day 5: Tracking / Map UI */}
        <Route path="/tracking" element={<Tracking />} />

        {/* Day 6: Notifications & Alerts */}
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
