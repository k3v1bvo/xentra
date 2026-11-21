import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { SuperadminPage } from './pages/SuperadminPage';
import { AdminLayout } from './layouts/AdminLayout';
import { NeighborLayout } from './layouts/NeighborLayout';
import { DashboardPage } from './pages/DashboardPage';
import { VecinosPage } from './pages/VecinosPage';
import { FinanzasPage } from './pages/FinanzasPage';
import { TracePage } from './pages/TracePage';
import { AuditorPage } from './pages/AuditorPage';
import { VotaPage } from './pages/VotaPage';
import { ReceiptVerificationPage } from './pages/ReceiptVerificationPage';
import { NeighborDashboardPage } from './pages/NeighborDashboardPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portada Principal / Selector de Acceso */}
        <Route path="/" element={<LandingPage />} />

        {/* Consola Nacional del Superadministrador */}
        <Route path="/superadmin" element={<SuperadminPage />} />

        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verificar-recibo" element={<ReceiptVerificationPage />} />

        {/* Panel Administrativo de la Directiva OTB */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="vecinos" element={<VecinosPage />} />
          <Route path="finanzas" element={<FinanzasPage />} />
          <Route path="trace" element={<TracePage />} />
          <Route path="auditor" element={<AuditorPage />} />
          <Route path="vota" element={<VotaPage />} />
        </Route>

        {/* Portal Personal del Vecino (Acceso por código / C.I.) */}
        <Route path="/vecino" element={<NeighborLayout />}>
          <Route index element={<NeighborDashboardPage />} />
          <Route path="pagos" element={<NeighborDashboardPage />} />
        </Route>

        {/* Fallback de compatibilidad */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
