import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Lock,
  ExternalLink
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { NotificationBell } from '../notifications/NotificationBell';
import { CommunityFooter } from '../components/CommunityFooter';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { AppRole } from '@xentra/shared';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard Comunal', icon: LayoutDashboard },
  { to: '/admin/vecinos', label: 'Vecinos & Mapa Catastral', icon: Users },
  { to: '/admin/finanzas', label: 'Finanzas & Tesorería', icon: Wallet },
  { to: '/admin/finanzas?tab=config_qr', label: 'Banco & QR Oficial OTB', icon: QrCode },
  { to: '/admin/trace', label: 'XENTRA TRACE', icon: GitBranch },
  { to: '/admin/auditor', label: 'XENTRA AI Auditor', icon: ShieldAlert },
  { to: '/admin/vota', label: 'XENTRA VOTA', icon: Vote },
  { to: '/verificar-recibo', label: 'Verificar Recibo QR', icon: QrCode }
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, currentRole, setCurrentRole, logout } = useAuthStore();
  const { currentOtb, availableOtbs, setCurrentOtb } = useTenantStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isSuperadmin = currentRole === 'superadmin';

  const isItemActive = (to: string) => {
    if (to.includes('?')) {
      const [path, search] = to.split('?');
      return location.pathname === path && location.search === `?${search}`;
    }
    if (to === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === to && !location.search;
  };

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

      {/* SIDEBAR (Desktop collapsible, Mobile Slide-over Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#0B132B]/95 backdrop-blur-xl border-r border-slate-800 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out md:static ${
          sidebarCollapsed ? 'md:w-20' : 'md:w-64'
        } ${mobileMenuOpen ? 'w-72 translate-x-0 shadow-2xl' : 'w-72 -translate-x-full md:translate-x-0'}`}
      >
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <XentraLogo size={sidebarCollapsed ? 'sm' : 'md'} variant="light" />
          </div>
          <button
            onClick={closeMobileMenu}
            aria-label="Cerrar Menú"
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
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

        {/* =================================================================== */}
        {/* SEGURIDAD MULTI-TENANT: AISLAMIENTO ESTRICTO DE ORGANIZACIÓN        */}
        {/* Solo el Superadmin puede cambiar de OTB; el Admin regular NO puede  */}
        {/* =================================================================== */}
        <div className="px-4 py-3 border-b border-slate-800 bg-[#020617]/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Organización Territorial
            </span>
            {isSuperadmin ? (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Superadmin
              </span>
            ) : (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Exclusivo
              </span>
            )}
          </div>

          {isSuperadmin ? (
            /* Superadmin puede cambiar entre OTBs registradas */
            <div className="relative">
              <select
                value={currentOtb?.id || ''}
                onChange={(e) => {
                  const found = availableOtbs.find((o) => o.id === e.target.value);
                  if (found) setCurrentOtb(found);
                }}
                className="w-full text-xs font-bold bg-[#030712] border border-purple-500/40 rounded-lg px-2.5 py-2 pr-7 appearance-none text-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-sm cursor-pointer"
              >
                {availableOtbs.map((otb) => (
                  <option key={otb.id} value={otb.id} className="bg-slate-900 text-white">
                    {otb.name} ({otb.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          ) : (
            /* Administrador de OTB regular: FIJO en su propia OTB sin acceso a otras */
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-black text-white text-xs truncate">{currentOtb?.name}</p>
                <span className="font-mono text-[9px] font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded border border-blue-500/30">
                  {currentOtb?.code}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {currentOtb?.department} • {currentOtb?.municipality}
              </p>
            </div>
          )}
        </div>

        {/* Menú de Navegación del Panel de Control */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={closeMobileMenu}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                } ${sidebarCollapsed ? 'md:justify-center md:px-2' : ''}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span className={sidebarCollapsed ? 'md:hidden truncate' : 'truncate'}>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-3 pb-1">
            <div className="h-px bg-slate-800 mx-2" />
          </div>

          {/* Consola Superadmin (Solo visible para el superadmin) */}
          {isSuperadmin && (
            <NavLink
              to="/superadmin"
              onClick={closeMobileMenu}
              title={sidebarCollapsed ? 'Consola Superadmin Nacional' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition-colors ${
                sidebarCollapsed ? 'md:justify-center md:px-2' : ''
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className={sidebarCollapsed ? 'md:hidden truncate' : 'truncate'}>Consola Superadmin Nacional</span>
            </NavLink>
          )}

          <NavLink
            to="/"
            onClick={closeMobileMenu}
            title={sidebarCollapsed ? 'Volver a Portada' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors ${
              sidebarCollapsed ? 'md:justify-center md:px-2' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className={sidebarCollapsed ? 'md:hidden truncate' : 'truncate'}>Volver a Portada</span>
          </NavLink>
        </nav>

        {/* Perfil del Usuario Activo */}
        <div className="p-3 border-t border-slate-800 bg-[#020617]/90">
          <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 ${sidebarCollapsed ? 'md:justify-center md:p-1.5' : ''}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {profile?.first_name ? profile.first_name[0] : 'A'}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                    {currentRole === 'superadmin' ? 'Superadmin' : 'Directiva OTB'}
                  </span>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
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
            )}
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 sm:h-16 border-b border-slate-800 bg-[#0B132B]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir Menú Móvil"
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Alternar menú lateral"
              title={sidebarCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
              className="hidden md:flex p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white hidden sm:inline">
                {currentOtb?.name || 'Gestión Comunal'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {currentOtb?.code}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Selector Rápido de Rol (Demo) */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => handleRoleChange('presidente')}
                className={`px-2.5 py-1 rounded-lg font-black transition-all ${
                  currentRole === 'presidente' || currentRole === 'tesorero'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Directiva
              </button>
              <button
                onClick={() => handleRoleChange('vecino')}
                className={`px-2.5 py-1 rounded-lg font-black transition-all ${
                  currentRole === 'vecino'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Vecino
              </button>
              {isSuperadmin && (
                <button
                  onClick={() => handleRoleChange('superadmin')}
                  className="px-2.5 py-1 rounded-lg font-black bg-purple-600 text-white shadow-sm"
                >
                  Superadmin
                </button>
              )}
            </div>

            {/* Notificaciones */}
            <NotificationBell />
          </div>
        </header>

        {/* Viewport Principal */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950 flex flex-col justify-between">
          <div>
            <Outlet />
          </div>
          <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8">
            <CommunityFooter />
          </div>
        </main>
      </div>
    </div>
  );
};
