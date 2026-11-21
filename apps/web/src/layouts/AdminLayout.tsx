import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Wallet,
  GitBranch,
  ShieldAlert,
  Vote,
  QrCode,
  UserCheck,
  Building2,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { NotificationBell } from '../notifications/NotificationBell';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { AppRole } from '@xentra/shared';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vecinos', label: 'Vecinos & Viviendas', icon: Users },
  { to: '/finanzas', label: 'Finanzas & Tesorería', icon: Wallet },
  { to: '/trace', label: 'XENTRA TRACE', icon: GitBranch },
  { to: '/auditor', label: 'XENTRA AI Auditor', icon: ShieldAlert },
  { to: '/vota', label: 'XENTRA VOTA', icon: Vote },
  { to: '/verificar-recibo', label: 'Verificar Recibo QR', icon: QrCode }
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile, currentRole, setCurrentRole, logout } = useAuthStore();
  const { currentOtb, availableOtbs, setCurrentOtb } = useTenantStore();

  const handleRoleChange = (role: AppRole) => {
    setCurrentRole(role);
    if (role === 'vecino') {
      navigate('/vecino');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col flex-shrink-0 z-20">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <XentraLogo size="md" />
        </div>

        {/* Selector de OTB Activa */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Organización Activa
          </label>
          <div className="relative">
            <select
              value={currentOtb?.id || ''}
              onChange={(e) => {
                const found = availableOtbs.find((o) => o.id === e.target.value);
                if (found) setCurrentOtb(found);
              }}
              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            >
              {availableOtbs.map((otb) => (
                <option key={otb.id} value={otb.id}>
                  {otb.name} ({otb.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span>{currentOtb?.department} • {currentOtb?.municipality}</span>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 pb-1">
            <div className="h-px bg-slate-100 mx-2" />
          </div>

          <NavLink
            to="/vecino"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Vista Portal Vecino</span>
          </NavLink>
        </nav>

        {/* Footer del Sidebar: Perfil y Rol */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                  CI {profile?.ci_number}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Cerrar sesión"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Selector de Rol para simulación/pruebas */}
          <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-slate-200">
            <span className="text-[10px] font-medium text-slate-500">Rol Activo:</span>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as AppRole)}
              className="text-[11px] font-bold text-blue-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="tesorero">Tesorero</option>
              <option value="presidente">Presidente</option>
              <option value="secretario">Secretario</option>
              <option value="fiscalizador">Fiscalizador</option>
              <option value="superadmin">Superadmin</option>
              <option value="vecino">Vecino</option>
            </select>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Barra Superior */}
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">{currentOtb?.name}</span>
              <span>/</span>
              <span className="capitalize">{currentRole}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Sistema Operativo
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Campana de Notificaciones Transversal */}
            <NotificationBell />
          </div>
        </header>

        {/* Área de Visualización */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
