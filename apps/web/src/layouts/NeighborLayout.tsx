import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  CreditCard,
  Vote,
  GitBranch,
  ArrowLeft,
  Home,
  LogOut,
  QrCode,
  Building2
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { NotificationBell } from '../notifications/NotificationBell';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';

export const NeighborLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuthStore();
  const { currentOtb } = useTenantStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col pb-24 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/')}
            title="Volver a la Portada Principal"
            className="px-2.5 py-1.5 text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Inicio</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />
          <XentraLogo size="sm" variant="dark" />

          <div className="hidden sm:flex flex-col ml-1">
            <span className="text-xs font-bold text-slate-800">{currentOtb?.name}</span>
            <span className="text-[10px] text-slate-500">Portal del Vecino</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <span>Panel Directiva</span>
          </button>

          <NotificationBell />

          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {profile?.first_name?.[0] || 'V'}
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Salir"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (Accessible & Fixed) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around z-40 shadow-2xl">
        <NavLink
          to="/vecino"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${
              isActive ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <FileCheck className="w-5 h-5" />
          <span>Mis Cuotas</span>
        </NavLink>

        <NavLink
          to="/verificar-recibo"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${
              isActive ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <QrCode className="w-5 h-5" />
          <span>Verificar QR</span>
        </NavLink>

        <NavLink
          to="/admin"
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold text-slate-500 hover:text-blue-600 transition-all"
        >
          <Building2 className="w-5 h-5" />
          <span>Directiva</span>
        </NavLink>

        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold text-slate-500 hover:text-rose-600 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Inicio</span>
        </NavLink>
      </nav>
    </div>
  );
};
