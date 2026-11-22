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
import { CommunityFooter } from '../components/CommunityFooter';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';

export const NeighborLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuthStore();
  const { currentOtb } = useTenantStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pb-24 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-3 sm:px-6 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            onClick={() => navigate('/')}
            title="Volver a la Portada Principal"
            className="min-h-[44px] px-3.5 py-2 text-slate-100 hover:text-white bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 rounded-2xl transition-all flex items-center gap-2 text-sm font-black shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Inicio</span>
          </button>

          <div className="h-6 w-px bg-slate-800" />
          <XentraLogo size="sm" variant="light" />

          <div className="hidden sm:flex flex-col ml-1">
            <span className="text-sm font-black text-white">{currentOtb?.name || 'OTB Villa Esperanza'}</span>
            <span className="text-xs text-blue-300 font-bold">Portal Oficial del Vecino</span>
          </div>
        </div>

        {/* Enlaces de Navegación del Portal Vecinal (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <NavLink
            to="/vecino"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <FileCheck className="w-4 h-4 text-blue-300" />
            <span>Mis Cuotas</span>
          </NavLink>

          <NavLink
            to="/verificar-recibo"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <QrCode className="w-4 h-4 text-purple-300" />
            <span>Verificar Recibo TRACE</span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-black text-white">
                {profile?.first_name || 'Vecino'} {profile?.last_name || 'Registrado'}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">
                Socio Activo • Lote 12
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-600/30 border-2 border-blue-400/60 text-blue-200 font-black text-sm flex items-center justify-center shadow-sm">
              {profile?.first_name?.[0] || 'V'}
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Cerrar Sesión"
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>

      {/* Footer Comunal con Información Útil y Auxilios */}
      <CommunityFooter />

      {/* Mobile Bottom Navigation (Accessible & Generous Touch Targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B132B]/98 backdrop-blur-xl border-t-2 border-slate-800 px-3 py-2 flex items-center justify-around z-40 shadow-2xl">
        <NavLink
          to="/vecino"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 min-h-[52px] py-1 px-3.5 rounded-2xl text-xs font-black transition-all ${
              isActive ? 'text-blue-300 bg-blue-950 border-2 border-blue-500/50 shadow-md' : 'text-slate-300 hover:text-white'
            }`
          }
        >
          <FileCheck className="w-5 h-5" />
          <span>Mis Cuotas</span>
        </NavLink>

        <NavLink
          to="/verificar-recibo"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 min-h-[52px] py-1 px-3.5 rounded-2xl text-xs font-black transition-all ${
              isActive ? 'text-blue-300 bg-blue-950 border-2 border-blue-500/50 shadow-md' : 'text-slate-300 hover:text-white'
            }`
          }
        >
          <QrCode className="w-5 h-5" />
          <span>Verificar QR</span>
        </NavLink>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex flex-col items-center justify-center gap-1 min-h-[52px] py-1 px-3.5 rounded-2xl text-xs font-black text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>

        <NavLink
          to="/"
          className="flex flex-col items-center justify-center gap-1 min-h-[52px] py-1 px-3.5 rounded-2xl text-xs font-black text-slate-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Portada</span>
        </NavLink>
      </nav>
    </div>
  );
};
