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
import { useAuthStore } from './stores/authStore';
import { AppRole } from '@xentra/shared';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Si un vecino intenta entrar al panel directiva o superadmin, bloquear y redirigir a su portal
    if (currentRole === 'vecino') {
      return <Navigate to="/vecino" replace />;
    }
    // Si la directiva intenta entrar a la consola nacional superadmin, redirigir a su panel directiva
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portada Principal Pública */}
        <Route path="/" element={<LandingPage />} />

        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verificar-recibo" element={<ReceiptVerificationPage />} />

        {/* Consola Nacional del Superadministrador (Aislamiento Estricto) */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperadminPage />
            </ProtectedRoute>
          }
        />

        {/* Panel Administrativo de la Directiva OTB (Exclusivo Directiva y Superadmin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['presidente', 'tesorero', 'secretario', 'fiscalizador', 'superadmin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="vecinos" element={<VecinosPage />} />
          <Route path="finanzas" element={<FinanzasPage />} />
          <Route path="trace" element={<TracePage />} />
          <Route path="auditor" element={<AuditorPage />} />
          <Route path="vota" element={<VotaPage />} />
        </Route>

        {/* Portal Personal del Vecino (Autenticado) */}
        <Route
          path="/vecino"
          element={
            <ProtectedRoute allowedRoles={['vecino', 'presidente', 'tesorero', 'superadmin']}>
              <NeighborLayout />
            </ProtectedRoute>
          }
        >
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
