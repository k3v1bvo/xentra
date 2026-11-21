import React, { useState } from 'react';
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
  ChevronDown,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { NotificationBell } from '../notifications/NotificationBell';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { AppRole } from '@xentra/shared';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/vecinos', label: 'Vecinos & Viviendas', icon: Users },
  { to: '/admin/finanzas', label: 'Finanzas & Tesorería', icon: Wallet },
  { to: '/admin/trace', label: 'XENTRA TRACE', icon: GitBranch },
  { to: '/admin/auditor', label: 'XENTRA AI Auditor', icon: ShieldAlert },
  { to: '/admin/vota', label: 'XENTRA VOTA', icon: Vote },
  { to: '/verificar-recibo', label: 'Verificar Recibo QR', icon: QrCode }
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile, currentRole, setCurrentRole, logout } = useAuthStore();
  const { currentOtb, availableOtbs, setCurrentOtb } = useTenantStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = (role: AppRole) => {
    setCurrentRole(role);
    if (role === 'vecino') {
      navigate('/vecino');
    } else if (role === 'superadmin') {
      navigate('/superadmin');
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR (Desktop fixed, Mobile Slide-over Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0B132B]/95 backdrop-blur-xl border-r border-slate-800 flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out md:static md:w-64 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <XentraLogo size="md" variant="light" />
          <button
            onClick={closeMobileMenu}
            aria-label="Cerrar Menú"
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Acceso Rápido Portada (Especial para móvil) */}
        <div className="px-3 pt-2 md:hidden">
          <button
            onClick={() => {
              closeMobileMenu();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-blue-300 bg-blue-950/60 hover:bg-blue-900/50 border border-blue-500/30 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Volver a la Portada Principal</span>
          </button>
        </div>

        {/* Selector de OTB Activa */}
        <div className="px-4 py-3 border-b border-slate-800 bg-[#020617]/60">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
            Organización Activa
          </label>
          <div className="relative">
            <select
              value={currentOtb?.id || ''}
              onChange={(e) => {
                const found = availableOtbs.find((o) => o.id === e.target.value);
                if (found) setCurrentOtb(found);
              }}
              className="w-full text-xs font-bold bg-[#030712] border border-slate-700 rounded-lg px-2.5 py-2 pr-7 appearance-none text-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer"
            >
              {availableOtbs.map((otb) => (
                <option key={otb.id} value={otb.id} className="bg-slate-900 text-white">
                  {otb.name} ({otb.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400 font-medium">
            <Building2 className="w-3 h-3 text-emerald-400" />
            <span className="truncate">{currentOtb?.department} • {currentOtb?.municipality}</span>
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
                end={item.to === '/admin'}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-3 pb-1">
            <div className="h-px bg-slate-800 mx-2" />
          </div>

          {currentRole === 'superadmin' && (
            <NavLink
              to="/superadmin"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Consola Superadmin</span>
            </NavLink>
          )}

          <NavLink
            to="/vecino"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Vista Portal Vecino</span>
          </NavLink>

          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Portada</span>
          </NavLink>
        </nav>

        {/* Footer del Sidebar: Perfil y Rol */}
        <div className="p-3 border-t border-slate-800 bg-[#020617]/70">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/50 text-blue-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  CI {profile?.ci_number}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Cerrar sesión"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Selector de Rol para simulación/pruebas */}
          <div className="flex items-center justify-between bg-[#030712] px-2 py-1.5 rounded-lg border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400">Rol Activo:</span>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as AppRole)}
              className="text-[11px] font-black text-blue-400 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="tesorero" className="bg-slate-900 text-white">Tesorero</option>
              <option value="presidente" className="bg-slate-900 text-white">Presidente</option>
              <option value="secretario" className="bg-slate-900 text-white">Secretario</option>
              <option value="fiscalizador" className="bg-slate-900 text-white">Fiscalizador</option>
              <option value="superadmin" className="bg-slate-900 text-white">Superadmin</option>
              <option value="vecino" className="bg-slate-900 text-white">Vecino</option>
            </select>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Barra Superior Responsiva */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Botón Hamburguesa Móvil con feedback claro */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              aria-label="Abrir Menú de Navegación"
            >
              <Menu className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-bold text-slate-200 hidden xs:inline">Menú</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
              <span className="font-extrabold text-white truncate max-w-[110px] sm:max-w-none">
                {currentOtb?.name}
              </span>
              <span>/</span>
              <span className="capitalize text-blue-400 font-extrabold">{currentRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón Inicio SIEMPRE visible tanto en móvil como en escritorio */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Volver a la Portada Principal"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
              <span>Inicio</span>
            </button>

            {/* Campana de Notificaciones Transversal */}
            <NotificationBell />
          </div>
        </header>

        {/* Área de Visualización */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
