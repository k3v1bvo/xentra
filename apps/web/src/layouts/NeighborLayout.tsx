import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  CreditCard,
  Vote,
  GitBranch,
  ArrowLeft,
  Home,
  LogOut
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
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/')}
            title="Volver a la Portada Principal"
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Inicio</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />
          <XentraLogo size="sm" />

          <div className="hidden sm:flex flex-col ml-1">
            <span className="text-xs font-bold text-slate-800">{currentOtb?.name}</span>
            <span className="text-[10px] text-slate-500">Portal del Vecino</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
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
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${isActive ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <FileCheck className="w-5 h-5" />
          <span>Mis Cuotas</span>
        </NavLink>

        <NavLink
          to="/admin/trace"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${isActive ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <GitBranch className="w-5 h-5" />
          <span>Transparencia</span>
        </NavLink>

        <NavLink
          to="/admin/vota"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${isActive ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Vote className="w-5 h-5" />
          <span>Votaciones</span>
        </NavLink>

        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold text-slate-500 hover:text-rose-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Salir</span>
        </NavLink>
      </nav>
    </div>
  );
};
