import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  CreditCard,
  Vote,
  GitBranch,
  Building,
  ArrowLeft
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { NotificationBell } from '../notifications/NotificationBell';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';

export const NeighborLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { currentOtb } = useTenantStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col pb-20 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XentraLogo size="sm" />
          <div className="hidden sm:block h-5 w-px bg-slate-200" />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-slate-800">{currentOtb?.name}</span>
            <span className="text-[10px] text-slate-500">Portal del Vecino</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Panel Directiva
          </button>
          <NotificationBell />
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {profile?.first_name?.[0]}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
        <NavLink
          to="/vecino"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`
          }
        >
          <FileCheck className="w-5 h-5" />
          <span>Mis Cuotas</span>
        </NavLink>

        <NavLink
          to="/vecino/pagos"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`
          }
        >
          <CreditCard className="w-5 h-5" />
          <span>Mis Pagos</span>
        </NavLink>

        <NavLink
          to="/trace"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`
          }
        >
          <GitBranch className="w-5 h-5" />
          <span>TRACE</span>
        </NavLink>

        <NavLink
          to="/vota"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Vote className="w-5 h-5" />
          <span>VOTA</span>
        </NavLink>
      </nav>
    </div>
  );
};
