import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

// Pages import
import { LandingPage } from '../pages/LandingPage';
import { HomeMapPage } from '../pages/HomeMapPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ComparePage } from '../pages/ComparePage';
import { ProductsPage } from '../pages/ProductsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { AboutPage } from '../pages/AboutPage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Standalone Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main SaaS Platform Application Nested Routes */}
      <Route element={<MainLayout />}>
        <Route path="/map-selector" element={<HomeMapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Wildcard Fallback redirection to Landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
