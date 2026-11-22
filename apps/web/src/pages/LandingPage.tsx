import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  QrCode,
  ArrowRight,
  Search,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Scale,
  Menu,
  X,
  MapPin,
  Compass,
  Check
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { Xentra3DCanvas } from '../components/Xentra3DCanvas';
import { TiltCard3D } from '../components/TiltCard3D';
import { CommunityAlertsAndEmergencyModal } from '../components/CommunityAlertsAndEmergencyModal';
import { CommunityTransparencyModal } from '../components/CommunityTransparencyModal';
import { InstallAppModal } from '../components/InstallAppModal';
import { CommunityInteractiveMap } from '../components/CommunityInteractiveMap';
import { CommunityFooter } from '../components/CommunityFooter';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';

/* ========================================================================== */
/* ILUSTRACIONES VECTORIALES NATIVAS EN CÓDIGO (PURAS SVG - SPOTKIT STYLE)    */
/* ========================================================================== */

// 1. Vector Ilustración: Pago con QR Simple en Celular
const QrPhoneIllustration: React.FC = () => (
  <div className="w-full h-36 flex items-center justify-center relative select-none">
    <svg viewBox="0 0 200 130" fill="none" className="w-full h-full max-w-[200px] drop-shadow-lg">
      <defs>
        <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>
        <linearGradient id="qrGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      {/* Teléfono */}
      <rect x="65" y="10" width="70" height="110" rx="14" fill="url(#phoneGrad)" stroke="#3B82F6" strokeWidth="2.5" />
      <line x1="90" y1="18" x2="110" y2="18" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      {/* Pantalla del Celular */}
      <rect x="73" y="26" width="54" height="78" rx="6" fill="#030712" />
      {/* Código QR estilizado */}
      <rect x="80" y="34" width="40" height="40" rx="4" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="84" y="38" width="10" height="10" fill="#3B82F6" rx="2" />
      <rect x="106" y="38" width="10" height="10" fill="#3B82F6" rx="2" />
      <rect x="84" y="60" width="10" height="10" fill="#3B82F6" rx="2" />
      <rect x="98" y="52" width="6" height="6" fill="#10B981" rx="1" />
      <rect x="108" y="62" width="6" height="6" fill="#60A5FA" rx="1" />
      {/* Botón Verde de Aprobado */}
      <rect x="79" y="82" width="42" height="14" rx="4" fill="#10B981" />
      <polyline points="94,89 98,93 106,85" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Ondas de Señal Simple */}
      <circle cx="150" cy="40" r="12" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.6" />
      <circle cx="150" cy="40" r="20" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.3" />
      <circle cx="150" cy="40" r="4" fill="#60A5FA" />
    </svg>
  </div>
);

// 2. Vector Ilustración: Recibo Digital Oficial con Código QR
const DigitalReceiptIllustration: React.FC = () => (
  <div className="w-full h-36 flex items-center justify-center relative select-none">
    <svg viewBox="0 0 200 130" fill="none" className="w-full h-full max-w-[200px] drop-shadow-lg">
      <defs>
        <linearGradient id="sheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>
      </defs>
      {/* Hoja de Recibo */}
      <rect x="55" y="10" width="90" height="110" rx="10" fill="url(#sheetGrad)" stroke="#10B981" strokeWidth="2.5" />
      {/* Encabezado */}
      <rect x="68" y="22" width="30" height="6" rx="3" fill="#10B981" />
      <rect x="115" y="22" width="18" height="6" rx="3" fill="#3B82F6" opacity="0.8" />
      {/* Líneas de datos */}
      <line x1="68" y1="38" x2="132" y2="38" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="48" x2="118" y2="48" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      <line x1="68" y1="58" x2="128" y2="58" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      {/* Monto destacado en caja */}
      <rect x="68" y="70" width="64" height="18" rx="5" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
      <rect x="74" y="76" width="32" height="6" rx="2" fill="#34D399" />
      {/* Sello de Seguridad Comunal */}
      <circle cx="124" cy="98" r="16" fill="#0B132B" stroke="#10B981" strokeWidth="2" />
      <circle cx="124" cy="98" r="12" fill="#10B981" opacity="0.2" />
      <polyline points="119,98 122,101 129,94" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// 3. Vector Ilustración: Asamblea Transparente & Proyector
const AssemblyScreenIllustration: React.FC = () => (
  <div className="w-full h-36 flex items-center justify-center relative select-none">
    <svg viewBox="0 0 200 130" fill="none" className="w-full h-full max-w-[200px] drop-shadow-lg">
      <defs>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>
      </defs>
      {/* Soporte de Pantalla */}
      <line x1="100" y1="102" x2="70" y2="122" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="102" x2="130" y2="122" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="95" x2="100" y2="115" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
      {/* Pantalla Gigante */}
      <rect x="40" y="14" width="120" height="84" rx="8" fill="url(#screenGrad)" stroke="#818CF8" strokeWidth="2.5" />
      {/* Gráfico de Barras Transparente */}
      <rect x="58" y="60" width="12" height="26" rx="2" fill="#3B82F6" />
      <rect x="76" y="44" width="12" height="42" rx="2" fill="#10B981" />
      <rect x="94" y="32" width="12" height="54" rx="2" fill="#6366F1" />
      <rect x="112" y="52" width="12" height="34" rx="2" fill="#A855F7" />
      {/* Línea de Base del Gráfico */}
      <line x1="52" y1="88" x2="146" y2="88" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      {/* Check de Control Social */}
      <circle cx="140" cy="30" r="10" fill="#10B981" />
      <polyline points="136,30 139,33 145,27" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// 4. Vector Ilustración: Icono Vecino Hogar
const VecinoHogarIllustration: React.FC = () => (
  <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border-2 border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-lg">
    <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9">
      <path d="M12 28L32 12L52 28V52H12V28Z" fill="#1E293B" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" />
      <rect x="26" y="36" width="12" height="16" rx="2" fill="#3B82F6" />
      <circle cx="32" cy="22" r="4" fill="#60A5FA" />
      <path d="M42 42L48 48L56 36" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// 5. Vector Ilustración: Icono Mesa Directiva & Caja
const DirectivaCajaIllustration: React.FC = () => (
  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg">
    <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9">
      <rect x="10" y="20" width="44" height="34" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="3" />
      <path d="M10 32H54" stroke="#10B981" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="5" fill="#0B132B" stroke="#34D399" strokeWidth="2" />
      <path d="M22 20V14C22 11.8 23.8 10 26 10H38C40.2 10 42 11.8 42 14V20" stroke="#10B981" strokeWidth="3" />
      <path d="M28 44H36" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

// 6. Vector Ilustración: Icono Escáner QR Recibo
const ScannerQrIllustration: React.FC = () => (
  <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border-2 border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0 shadow-lg">
    <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9">
      <path d="M12 22V14C12 12.9 12.9 12 14 12H22" stroke="#A855F7" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M42 12H50C51.1 12 52 12.9 52 14V22" stroke="#A855F7" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52 42V50C52 51.1 51.1 52 50 52H42" stroke="#A855F7" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M22 52H14C12.9 52 12 51.1 12 50V42" stroke="#A855F7" strokeWidth="3.5" strokeLinecap="round" />
      {/* Cruz central */}
      <rect x="22" y="22" width="20" height="20" rx="3" fill="#3B0764" stroke="#C084FC" strokeWidth="2" />
      <circle cx="32" cy="32" r="4" fill="#34D399" />
    </svg>
  </div>
);

/* ========================================================================== */
/* PÁGINA PRINCIPAL (LANDING PAGE)                                             */
/* ========================================================================== */

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentOtb } = useTenantStore();
  const { isAuthenticated, currentRole, logout } = useAuthStore();

  // Estados de modales y navegación
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState(false);

  // Buscador de socio / lote
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(currentRole === 'vecino' ? '/vecino' : '/admin');
    } else {
      navigate('/login');
    }
  };

  const handlePortalRedirect = (target: 'vecino' | 'directiva' | 'recibo') => {
    if (target === 'recibo') {
      navigate('/verificar-recibo');
      return;
    }
    if (isAuthenticated) {
      if (target === 'vecino') {
        navigate(currentRole === 'vecino' ? '/vecino' : '/admin');
      } else {
        navigate(currentRole === 'superadmin' ? '/superadmin' : '/admin');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-clip selection:bg-blue-600 selection:text-white">
      {/* Fondo Ambiental Sutil */}
      <Xentra3DCanvas />

      {/* =================================================================== */}
      {/* 1. HEADER INSTITUCIONAL: LIMPIO, SOBRIO Y SIN ELEMENTOS DESUBICADOS */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 h-20 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer focus:outline-none"
            title="XENTRA OTB - Inicio"
          >
            <XentraLogo size="md" variant="light" />
            <span className="hidden md:inline-block text-xs font-bold text-slate-300 border-l border-slate-800 pl-3">
              Plataforma Nacional OTB Bolivia
            </span>
          </button>
        </div>

        {/* Acciones Rápidas */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="h-11 px-4 rounded-xl text-xs sm:text-sm font-black text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span className="text-base">🚨</span>
            <span>Auxilio & Alertas</span>
          </button>

          <button
            onClick={() => navigate('/verificar-recibo')}
            className="h-11 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Verificar Recibo QR</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentRole === 'vecino') navigate('/vecino');
                  else if (currentRole === 'superadmin') navigate('/superadmin');
                  else navigate('/admin');
                }}
                className="h-11 px-5 rounded-xl text-xs sm:text-sm font-black text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/25"
              >
                <span>{currentRole === 'vecino' ? 'Ir a Mis Cuotas' : 'Panel Directiva'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="h-11 px-3.5 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="h-11 px-6 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/25"
            >
              <span>Ingresar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Botón Menú Móvil */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="h-9 px-2.5 rounded-lg text-xs font-black text-rose-300 bg-rose-950/60 border border-rose-500/40 flex items-center gap-1"
          >
            <span>🚨</span>
            <span>Auxilio</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="h-9 px-3 rounded-lg text-xs font-black text-white bg-blue-600 flex items-center gap-1 shadow-sm"
          >
            <span>Ingresar</span>
          </button>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Abrir Menú"
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
          >
            {mobileNavOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Menú Desplegable en Móvil */}
        {mobileNavOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0B132B]/98 border-b-2 border-slate-800 p-4 space-y-2.5 lg:hidden shadow-2xl backdrop-blur-xl text-left">
            <button
              onClick={() => {
                setMobileNavOpen(false);
                setIsEmergencyModalOpen(true);
              }}
              className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-black text-rose-300 bg-rose-950/40 border border-rose-500/30 flex items-center gap-2"
            >
              <span>🚨</span>
              <span>Central de Auxilio & Emergencias 24/7</span>
            </button>

            <button
              onClick={() => {
                setMobileNavOpen(false);
                navigate('/verificar-recibo');
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-purple-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-purple-400" />
              <span>Verificar Recibo con QR</span>
            </button>

            <button
              onClick={() => {
                setMobileNavOpen(false);
                setIsInstallModalOpen(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-emerald-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Descargar App APK Móvil</span>
            </button>

            <button
              onClick={() => {
                setMobileNavOpen(false);
                navigate('/login');
              }}
              className="w-full text-center py-3.5 rounded-xl text-sm font-black text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Acceder a Mi Cuenta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* =================================================================== */}
      {/* 2. HERO PRINCIPAL: DIRECTO, LEGIBLE Y SIN RELLENOS INÚTILES          */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-12 flex-1 text-left">
        <div className="max-w-4xl space-y-6">
          
          {/* Badge Kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B132B] border border-blue-500/30 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wider">
              Gestión Financiera Transparente para Comunidades y Barrios
            </span>
          </div>

          {/* Titular Principal Grande y Claro */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Cuentas Claras en tu OTB. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                Sin Desvíos. Sin Papelitos Perdidos.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
              Paga tus cuotas con QR Simple desde tu celular, recibe tu recibo oficial digital y revisa en qué se gasta cada centavo en las asambleas.
            </p>
          </div>

          {/* Buscador Simple de Socio / Lote */}
          <div className="space-y-3 max-w-2xl pt-2">
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl bg-[#0B132B] border-2 border-blue-500/50 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-blue-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ingresa tu Lote, Carnet (CI) o Código de Socio..."
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-white placeholder-slate-400 focus:outline-none px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0 shadow-lg shadow-blue-600/30"
              >
                <span>Consultar Mi Estado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* 4 Beneficios Directos para el Vecino y la Directiva */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-200">0% Comisión Bancaria</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-slate-800 flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-200">Recibo en tu Celular</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-slate-800 flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-200">Funciona sin Internet</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-slate-800 flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-200">Cuentas Claras en Asamblea</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. TRES TARJETAS DE ACCESO: VISUALES, VECTORIALES Y CON BOTONES     */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TARJETA 1: PORTAL DEL VECINO */}
          <TiltCard3D>
            <div
              onClick={() => handlePortalRedirect('vecino')}
              className="w-full h-full p-6 sm:p-8 rounded-3xl bg-[#0B132B]/95 border-2 border-slate-800 hover:border-blue-500/60 transition-all text-left group cursor-pointer shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <VecinoHogarIllustration />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-300 transition-colors">
                    Portal del Vecino
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    Revisa tus cuotas del mes, historial de recibos y votaciones comunales.
                  </p>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Ver cuotas pendientes y al día</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Pagar al instante con QR Simple</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Descargar recibos oficiales</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-between shadow-lg shadow-blue-600/30 transition-all">
                  <span>Entrar a Mi Cuenta</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </TiltCard3D>

          {/* TARJETA 2: MESA DIRECTIVA & CAJA */}
          <TiltCard3D>
            <div
              onClick={() => handlePortalRedirect('directiva')}
              className="w-full h-full p-6 sm:p-8 rounded-3xl bg-[#0B132B]/95 border-2 border-slate-800 hover:border-emerald-500/60 transition-all text-left group cursor-pointer shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <DirectivaCajaIllustration />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    Mesa Directiva & Caja
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    Control censal de lotes, cobro de cuotas, arqueo y rendición en asambleas.
                  </p>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Padrón censal por manzanos y lotes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Arqueo de caja automático en 1 clic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Rendición con facturas para asambleas</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-between shadow-lg shadow-emerald-600/30 transition-all">
                  <span>Administrar OTB</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </TiltCard3D>

          {/* TARJETA 3: VERIFICAR RECIBO QR */}
          <TiltCard3D>
            <div
              onClick={() => handlePortalRedirect('recibo')}
              className="w-full h-full p-6 sm:p-8 rounded-3xl bg-[#0B132B]/95 border-2 border-slate-800 hover:border-purple-500/60 transition-all text-left group cursor-pointer shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <ScannerQrIllustration />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                    Verificar Recibo QR
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    Escanea cualquier recibo físico de la OTB para comprobar su validez legal.
                  </p>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800/80">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Verificación instantánea con la cámara</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Comprueba si el recibo es auténtico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Solo muestra número de lote y estado</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm flex items-center justify-between shadow-lg shadow-purple-600/30 transition-all">
                  <span>Escanear Recibo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </TiltCard3D>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. ¿CÓMO FUNCIONA? 3 PASOS VECTORIZADOS Y CLAROS                   */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800 text-left">
        <div className="space-y-2 mb-10 max-w-3xl">
          <span className="text-xs sm:text-sm font-black text-blue-400 uppercase tracking-wider block">
            ¿Cómo Funciona XENTRA OTB?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Tres Pasos Simples. Cero Complicaciones.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* PASO 1 CON ILUSTRACIÓN VECTORIAL */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <QrPhoneIllustration />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center border border-blue-500/40">
                  1
                </span>
                <span className="text-xs font-black text-blue-400 uppercase tracking-wider">Paso 1</span>
              </div>
              <h3 className="text-xl font-black text-white">Pago con QR Simple</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                El vecino paga desde su teléfono mediante su aplicación bancaria (Banco Unión, BCP, BNB) sin salir de casa ni hacer filas.
              </p>
            </div>
          </div>

          {/* PASO 2 CON ILUSTRACIÓN VECTORIAL */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <DigitalReceiptIllustration />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/40">
                  2
                </span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Paso 2</span>
              </div>
              <h3 className="text-xl font-black text-white">Recibo Oficial en tu Mano</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                El sistema genera tu recibo con código QR para que lo guardes en tu celular o lo imprimas para tus trámites vecinales.
              </p>
            </div>
          </div>

          {/* PASO 3 CON ILUSTRACIÓN VECTORIAL */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <AssemblyScreenIllustration />
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center border border-purple-500/40">
                  3
                </span>
                <span className="text-xs font-black text-purple-400 uppercase tracking-wider">Paso 3</span>
              </div>
              <h3 className="text-xl font-black text-white">Asamblea Transparente</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                La directiva presenta los gastos con facturas y fotos en pantalla gigante. Cada centavo recaudado tiene destino comprobado.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. MAPA OFICIAL DEL BARRIO: TERRITORIO Y EQUIPAMIENTO               */}
      {/* =================================================================== */}
      <section id="mapa-barrio" className="scroll-mt-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Ejemplo en Vivo • Catastro Barrial Municipal Real</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Delimitación Oficial de Calles, Manzanos y Áreas Verdes
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Mira cómo se dibuja y organiza una OTB real: trazado por el eje de las calles, separación entre manzanas, áreas verdes protegidas y colindancia con barrios vecinos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="h-11 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-black text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Descargar App APK Móvil</span>
            </button>
          </div>
        </div>

        {/* Tarjetas Informativas Destacadas del Catastro */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="p-3.5 rounded-2xl bg-[#030712] border border-slate-800/80">
            <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">Demarcación</span>
            <p className="font-black text-white text-sm mt-0.5">Trazado por Calles</p>
            <span className="text-[11px] text-slate-400 block mt-0.5">Corredores y avenidas reales sin sobreposición</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#030712] border border-slate-800/80">
            <span className="text-[11px] font-bold text-emerald-400 block uppercase tracking-wider">Manzanos</span>
            <p className="font-black text-white text-sm mt-0.5">Manzanas 261 al 270</p>
            <span className="text-[11px] text-slate-400 block mt-0.5">Códigos de manzanos y lotes delimitados</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#030712] border border-slate-800/80">
            <span className="text-[11px] font-bold text-blue-400 block uppercase tracking-wider">Calles Libres</span>
            <p className="font-black text-white text-sm mt-0.5">Visibilidad Total</p>
            <span className="text-[11px] text-slate-400 block mt-0.5">Av. 6 de Agosto, Calle Sipe Sipe, Viloma y Villar</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#030712] border border-slate-800/80">
            <span className="text-[11px] font-bold text-rose-400 block uppercase tracking-wider">Edición Comunal</span>
            <p className="font-black text-white text-sm mt-0.5">Exclusivo Directiva</p>
            <span className="text-[11px] text-slate-400 block mt-0.5">Lápiz digital para dibujar o editar en cualquier OTB</span>
          </div>
        </div>

        {/* Mapa Interactivo Panorámico de la OTB */}
        <div className="rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-[#0B132B]">
          <div className="px-5 py-3.5 bg-[#030712] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-black text-white">Plano Oficial de la OTB: Villa Graciela (Cochabamba)</span>
            </div>

            <a
              href="https://www.google.com/maps?q=-17.4128,-66.1654"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>Abrir GPS Satelital</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <CommunityInteractiveMap
            centerLat={-17.4128}
            centerLng={-66.1654}
            zoom={16}
            heightClass="h-[540px] sm:h-[650px] lg:h-[780px]"
            otbName="OTB Villa Graciela (Distrito 1 Cochabamba)"
            otbId="11111111-1111-1111-1111-111111111111"
            showControls={true}
            enableAdminEditor={true}
          />
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. FOOTER PÚBLICO INSTITUCIONAL NACIONAL                            */}
      {/* =================================================================== */}
      <CommunityFooter
        variant="public"
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenInstallApp={() => setIsInstallModalOpen(true)}
        onOpenTransparency={() => setIsTransparencyModalOpen(true)}
      />

      {/* Modales del Sistema */}
      {isEmergencyModalOpen && (
        <CommunityAlertsAndEmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          otbId={currentOtb?.id || '11111111-1111-1111-1111-111111111111'}
          otbName={currentOtb?.name || 'Comunidad Vecinal'}
        />
      )}

      {isInstallModalOpen && (
        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />
      )}

      {isTransparencyModalOpen && (
        <CommunityTransparencyModal
          isOpen={isTransparencyModalOpen}
          onClose={() => setIsTransparencyModalOpen(false)}
        />
      )}
    </div>
  );
};
