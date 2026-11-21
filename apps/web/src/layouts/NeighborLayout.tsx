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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pb-24 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-3 sm:px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/')}
            title="Volver a la Portada Principal"
            className="px-2.5 py-1.5 text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>Inicio</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />
          <XentraLogo size="sm" variant="light" />

          <div className="hidden sm:flex flex-col ml-1">
            <span className="text-xs font-extrabold text-white">{currentOtb?.name}</span>
            <span className="text-[10px] text-slate-400 font-medium">Portal del Vecino</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-950/50 hover:bg-blue-900/50 border border-blue-500/30 transition-colors cursor-pointer"
          >
            <span>Panel Directiva</span>
          </button>

          <NotificationBell />

          <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/50 text-blue-300 font-bold text-xs flex items-center justify-center shadow-sm">
              {profile?.first_name?.[0] || 'V'}
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Salir"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B132B]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around z-40 shadow-2xl">
        <NavLink
          to="/vecino"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
              isActive ? 'text-blue-400 bg-blue-950/70 border border-blue-500/40 shadow-sm' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <FileCheck className="w-5 h-5" />
          <span>Mis Cuotas</span>
        </NavLink>

        <NavLink
          to="/verificar-recibo"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
              isActive ? 'text-blue-400 bg-blue-950/70 border border-blue-500/40 shadow-sm' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <QrCode className="w-5 h-5" />
          <span>Verificar QR</span>
        </NavLink>

        <NavLink
          to="/admin"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold text-slate-400 hover:text-blue-400 transition-all"
        >
          <Building2 className="w-5 h-5" />
          <span>Directiva</span>
        </NavLink>

        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold text-slate-400 hover:text-rose-400 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Inicio</span>
        </NavLink>
      </nav>
    </div>
  );
};
