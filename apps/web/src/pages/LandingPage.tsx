import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  ShieldCheck,
  QrCode,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  X,
  CreditCard,
  Lock,
  Clock,
  Sparkles,
  Smartphone,
  PhoneCall,
  MapPin,
  ExternalLink,
  Download,
  Scale,
  Cpu,
  Menu,
  Wallet,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight,
  Layers,
  Check,
  PenTool,
  Vote,
  Compass
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
import { formatBOB } from '@xentra/shared';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentOtb } = useTenantStore();
  const { isAuthenticated, currentRole, logout } = useAuthStore();

  // Estados de interfaz y modales
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState(false);

  // Tab interactivo para el demostrador de transparencia en recaudación
  const [activeTransparencyTab, setActiveTransparencyTab] = useState<'recaudacion' | 'obras' | 'trazabilidad'>('recaudacion');

  const scrollToSection = (id: string) => {
    setMobileNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-clip selection:bg-blue-600 selection:text-white">
      {/* Fondo Ambiental 3D Interactable */}
      <Xentra3DCanvas />

      {/* =================================================================== */}
      {/* 1. HEADER INSTITUCIONAL: FIJO, ELEGANTE Y RESPONSIVE                */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            title="XENTRA OTB - Inicio"
          >
            <XentraLogo size="md" variant="light" />
          </button>
        </div>

        {/* Navegación Desktop */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <button
            onClick={() => scrollToSection('como-funciona')}
            className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer"
          >
            ¿Cómo Funciona?
          </button>
          <button
            onClick={() => scrollToSection('transparencia')}
            className="px-3.5 py-2 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Transparencia en Recaudación</span>
          </button>
          <button
            onClick={() => scrollToSection('comparativa')}
            className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer"
          >
            Antes vs. Con Xentra
          </button>
          <button
            onClick={() => scrollToSection('mapa-comunal')}
            className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer"
          >
            Plano Territorial
          </button>
          <button
            onClick={() => scrollToSection('marco-legal')}
            className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer"
          >
            Marco Legal
          </button>
        </nav>

        {/* Acciones Principales en Header */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => navigate('/verificar-recibo')}
            className="h-10 px-3.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-purple-400" />
            <span>Verificar Recibo</span>
          </button>

          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="h-10 px-3.5 rounded-xl text-xs font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>App APK</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentRole === 'vecino') navigate('/vecino');
                  else if (currentRole === 'superadmin') navigate('/superadmin');
                  else navigate('/admin');
                }}
                className="h-10 px-4 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/25"
              >
                <span>{currentRole === 'vecino' ? 'Ir a Mis Cuotas' : currentRole === 'superadmin' ? 'Consola Superadmin' : 'Panel Directiva'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="h-10 px-3 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="h-10 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/25"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botón Menú Móvil */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated ? (
            <button
              onClick={() => {
                if (currentRole === 'vecino') navigate('/vecino');
                else if (currentRole === 'superadmin') navigate('/superadmin');
                else navigate('/admin');
              }}
              className="h-9 px-3 rounded-lg text-xs font-black text-white bg-blue-600 flex items-center gap-1 shadow-sm"
            >
              <span>{currentRole === 'vecino' ? 'Mi Portal' : 'Panel'}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="h-9 px-3 rounded-lg text-xs font-black text-white bg-blue-600 flex items-center gap-1 shadow-sm"
            >
              <span>Ingresar</span>
            </button>
          )}

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Abrir Menú"
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
          >
            {mobileNavOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Drawer Móvil Desplegable */}
        {mobileNavOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0B132B]/98 border-b-2 border-slate-800 p-4 space-y-2 lg:hidden shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              ¿Cómo Funciona?
            </button>
            <button
              onClick={() => scrollToSection('transparencia')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Transparencia en Recaudación</span>
            </button>
            <button
              onClick={() => scrollToSection('comparativa')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Antes vs. Con Xentra
            </button>
            <button
              onClick={() => scrollToSection('mapa-comunal')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Plano Barrial
            </button>
            <button
              onClick={() => scrollToSection('marco-legal')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Marco Legal Boliviano
            </button>
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  navigate('/verificar-recibo');
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-purple-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>Verificar Recibo Oficial TRACE</span>
              </button>
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  setIsInstallModalOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Descargar App Móvil APK</span>
              </button>
              {isAuthenticated ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      if (currentRole === 'vecino') navigate('/vecino');
                      else if (currentRole === 'superadmin') navigate('/superadmin');
                      else navigate('/admin');
                    }}
                    className="flex-1 text-center py-3 rounded-xl text-sm font-black text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>{currentRole === 'vecino' ? 'Ir a Mis Cuotas' : 'Ir a Panel Directiva'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileNavOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:text-rose-400 bg-slate-900 border border-slate-700"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-center py-3 rounded-xl text-sm font-black text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Acceder a mi OTB</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* =================================================================== */}
      {/* 2. HERO PRINCIPAL: PROPUESTA DE VALOR DE ALTO IMPACTO (CRO & COPY)  */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA (7 COLS): COPYWRITING PERSUASIVO */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Kicker Institucional */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B132B] border border-blue-500/30 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Plataforma Financiera Comunitaria • Bolivia
              </span>
            </div>

            {/* Titular Principal de Alto Impacto */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Transparencia Total en la Recaudación de tu OTB. <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                  Cero Desvíos, Cero Desconfianza.
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                Erradica las discusiones en asambleas y los cuadernos perdidos. XENTRA OTB permite cobrar aportes comunales en <strong>10 segundos con QR Simple</strong> desde el celular, emite <strong>recibos digitales infalsificables</strong> y publica el balance de fondos en tiempo real para que cada vecino sepa a dónde va cada centavo.
              </p>
            </div>

            {/* Llamados a la Acción Claros y Directos (Sin credenciales quemadas) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="h-13 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 transition-all cursor-pointer group"
              >
                <span>Acceso al Portal de tu OTB</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/verificar-recibo')}
                className="h-13 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>Verificar Recibo Oficial TRACE</span>
              </button>
            </div>

            {/* Sellos de Confianza y Arquitectura Soberana */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 max-w-xl">
              <div className="p-3 rounded-xl bg-[#0B132B]/90 border border-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-200">0% Comisión Bancaria</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B132B]/90 border border-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-200">Cifrado SHA-256</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B132B]/90 border border-slate-800 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-200">Local-First SQLite</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0B132B]/90 border border-slate-800 flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-200">Ley N° 1551 / CPE</span>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (5 COLS): MÓDULO DEMOSTRATIVO DE TRANSPARENCIA EN RECAUDACIÓN */}
          <div className="lg:col-span-5" id="panel-demostrativo">
            <TiltCard3D intensity={5}>
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0B132B]/95 border-2 border-blue-500/40 shadow-2xl text-left space-y-5">
                
                {/* Cabecera del Panel Demostrativo */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      Demostración en Vivo
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Rendición de Fondos Barriales
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Auditado 100%</span>
                  </span>
                </div>

                {/* Métricas Reales de Recaudación Comunal */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#030712] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Recaudado del Mes
                    </span>
                    <strong className="text-xl sm:text-2xl font-mono font-black text-emerald-400 block">
                      Bs. 18.750,00
                    </strong>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      138 cuotas de 150 viviendas
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#030712] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Cumplimiento Vecinal
                    </span>
                    <strong className="text-xl sm:text-2xl font-mono font-black text-blue-400 block">
                      92% al Día
                    </strong>
                    <span className="text-[10px] text-emerald-400 font-semibold block">
                      Cero dinero suelto en mano
                    </span>
                  </div>
                </div>

                {/* Destino Transparente del Dinero (Sin Cajas Negras) */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[11px] font-black uppercase text-slate-300 block tracking-wider">
                    Asignación Comunal Aprobada en Asamblea:
                  </span>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">🏗️ Tinglado Cancha Polifuncional</span>
                      <span className="font-mono font-bold text-emerald-400">Bs. 12.000,00</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Materiales y estructura metálica • Factura N° 4812 verificada
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">📹 8 Cámaras de Seguridad & Sirena</span>
                      <span className="font-mono font-bold text-blue-400">Bs. 4.500,00</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Circuito vecinal instalado en accesos Manzanas A y B
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">💧 Fondo de Emergencias & Red de Agua</span>
                      <span className="font-mono font-bold text-amber-400">Bs. 2.250,00</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Custodiado en cuenta bancaria para reparación inmediata de fugas
                    </p>
                  </div>
                </div>

                {/* Garantía Criptográfica TRACE */}
                <div className="p-3.5 rounded-2xl bg-[#020617] border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0 text-purple-300">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Trazabilidad Inmutable TRACE
                    </span>
                    <p className="text-xs text-white font-bold">
                      Cada cuota tiene un recibo digital oficial con código QR
                    </p>
                    <p className="text-[11px] text-emerald-400 font-semibold">
                      Ningún dirigente puede alterar o borrar aportes cobrados
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => navigate('/verificar-recibo')}
                    className="w-full h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <QrCode className="w-4 h-4 text-white" />
                    <span>Escanear y Validar Autenticidad de Recibo</span>
                  </button>
                </div>

              </div>
            </TiltCard3D>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. SECCIÓN TRANSPARENCIA EN RECAUDACIÓN (SOLICITUD CLAVE DEL USUARIO) */}
      {/* =================================================================== */}
      <section id="transparencia" className="scroll-mt-20 sm:scroll-mt-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800/80 text-left">
        <div className="max-w-3xl space-y-3 mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Control Social y Honestidad Comunal
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            ¿Por qué la Transparencia en Pagos Recaudados Transforma un Barrio?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Cuando los vecinos ven con total claridad en qué se gasta su dinero, la morosidad desaparece y la confianza regresa a la OTB.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TiltCard3D intensity={5}>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-blue-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">1. Recaudación sin Intermediarios</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Las cuotas no se guardan en sobres ni en bolsillos de dirigentes. Cada pago por QR Simple va directo a la cuenta bancaria comunal de la OTB, dejando registro bancario auditable.
                </p>
              </div>
            </div>
          </TiltCard3D>

          <TiltCard3D intensity={5}>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">2. Recibo Oficial al Instante</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  En el mismo segundo que se aprueba el pago, el vecino recibe en su pantalla o celular su recibo digital oficial sellado con firma digital SHA-256 y código QR escaneable.
                </p>
              </div>
            </div>
          </TiltCard3D>

          <TiltCard3D intensity={5}>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-purple-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">3. Rendición Abierta en Asambleas</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  La directiva no necesita pasar noches cuadrando números. Con 1 clic proyecta en la asamblea general el balance con fotos de facturas, notas de entrega y saldo exacto en caja.
                </p>
              </div>
            </div>
          </TiltCard3D>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. COMPARATIVA: ANTES (CUADERNOS) VS. CON XENTRA OTB (MARCO PAS)     */}
      {/* =================================================================== */}
      <section id="comparativa" className="scroll-mt-20 sm:scroll-mt-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800/80 text-left">
        <div className="max-w-3xl space-y-3 mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Comparativa Real
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            El Problema del Método Antiguo vs. La Solución Xentra
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Mira la diferencia radical entre gestionar una OTB con papeles o hacerlo con tecnología comunal transparente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* EL MÉTODO ANTIGUO */}
          <TiltCard3D intensity={4}>
            <div className="h-full p-6 sm:p-8 rounded-3xl bg-rose-950/20 border-2 border-rose-500/40 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-rose-500/30 pb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block font-bold">
                    Método Tradicional
                  </span>
                  <h3 className="text-lg font-black text-white">Cuadernos de Papel y Efectivo</h3>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-black mt-0.5">✕</span>
                  <span><strong>Cuadernos que se extravían:</strong> Cuando cambia la directiva, los registros anteriores desaparecen y nadie sabe quién pagó qué.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-black mt-0.5">✕</span>
                  <span><strong>Desconfianza y morosidad:</strong> Los vecinos sospechan que su dinero no se usa para las obras y dejan de pagar sus cuotas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-black mt-0.5">✕</span>
                  <span><strong>Asambleas conflictivas:</strong> Horas de discusión dominical sin comprobantes claros, notas de entrega borroneadas o recibos falsificados.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-black mt-0.5">✕</span>
                  <span><strong>Obras paralizadas:</strong> Proyectos prioritarios como canchas, tinglados y alumbrado quedan frenados por falta de recaudación.</span>
                </li>
              </ul>
            </div>
          </TiltCard3D>

          {/* CON XENTRA OTB */}
          <TiltCard3D intensity={4}>
            <div className="h-full p-6 sm:p-8 rounded-3xl bg-emerald-950/20 border-2 border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-emerald-500/30 pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block font-bold">
                    Plataforma Soberana
                  </span>
                  <h3 className="text-lg font-black text-white">Gestión XENTRA OTB Transparente</h3>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black mt-0.5">✓</span>
                  <span><strong>Cobro por QR Simple en 10s:</strong> El vecino paga desde Banco Unión, BCP, BNB o BancoSol sin salir de casa ni hacer filas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black mt-0.5">✓</span>
                  <span><strong>Recibo oficial infalsificable:</strong> Código QR y token digital inmutable SHA-256 en el teléfono de cada vecino.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black mt-0.5">✓</span>
                  <span><strong>Rendición inmediata en 1 clic:</strong> La directiva proyecta el informe de caja y facturas de compras en pantalla gigante en la asamblea.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black mt-0.5">✓</span>
                  <span><strong>Confianza y obras concluidas:</strong> Al ver el destino de cada centavo, la recaudación sube al 90%+ y las obras se terminan.</span>
                </li>
              </ul>
            </div>
          </TiltCard3D>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. CÓMO FUNCIONA EN 3 PASOS                                         */}
      {/* =================================================================== */}
      <section id="como-funciona" className="scroll-mt-20 sm:scroll-mt-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800/80 text-left">
        <div className="space-y-2 mb-10">
          <span className="text-xs font-black text-blue-400 uppercase tracking-wider block">
            Paso a Paso
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Tres Pasos Simples para el Vecino y la Directiva
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TiltCard3D intensity={5}>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-lg">
                1
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-black text-blue-400 uppercase tracking-wider block">Paso 1</span>
                <h3 className="text-lg font-black text-white">Pago con QR Simple</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  El vecino abre su aplicación bancaria (Banco Unión, BCP, BNB, BancoSol, Fie), escanea el código QR de la OTB y transfiere la cuota sin comisiones.
                </p>
              </div>
            </div>
          </TiltCard3D>

          <TiltCard3D intensity={5}>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                2
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">Paso 2</span>
                <h3 className="text-lg font-black text-white">Recibo Digital Oficial</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Tesorería verifica la transferencia y el sistema emite el recibo oficial numerado con código QR y token digital inmutable SHA-256.
                </p>
              </div>
            </div>
          </TiltCard3D>

          <TiltCard3D intensity={5}>
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-lg">
                3
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-black text-purple-400 uppercase tracking-wider block">Paso 3</span>
                <h3 className="text-lg font-black text-white">Asamblea Transparente</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  En la asamblea general, la directiva presenta el balance público con 1 clic. Cada centavo recaudado tiene respaldo y destino demostrado.
                </p>
              </div>
            </div>
          </TiltCard3D>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. MAPA TERRITORIAL Y GEORREFERENCIACIÓN COMUNAL (DESTACADO)        */}
      {/* =================================================================== */}
      <section id="mapa-comunal" className="scroll-mt-20 sm:scroll-mt-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800/80 text-left">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Soberanía Territorial & Catastro Comunal • Ley N° 1551</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Conoce con Exactitud de Dónde a Dónde Llega tu OTB
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Delimitación territorial transparente en vivo: la directiva traza los límites oficiales y organiza el barrio por manzanos para que cada vecino conozca su jurisdicción, ubique su lote y consulte los servicios comunales sin trámites engorrosos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => navigate('/login')}
              className="h-11 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Acceder al Catastro de mi OTB</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="h-11 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>App APK</span>
            </button>
          </div>
        </div>

        {/* Franja de Métricas Territoriales Oficiales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-blue-500/30 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Superficie Delimitada</span>
            <strong className="text-xl sm:text-2xl font-black font-mono text-blue-400 block">~14.8 ha</strong>
            <span className="text-[10px] text-slate-400">Polígono Jurisdiccional</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-indigo-500/30 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Manzanos Censados</span>
            <strong className="text-xl sm:text-2xl font-black font-mono text-indigo-400 block">4 Cuadras</strong>
            <span className="text-[10px] text-slate-400">Manzanos A, B, C y D</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-emerald-500/30 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Lotes en Padrón</span>
            <strong className="text-xl sm:text-2xl font-black font-mono text-emerald-400 block">96 Lotes</strong>
            <span className="text-[10px] text-slate-400">Viviendas Georreferenciadas</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-purple-500/30 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Equipamiento Barrial</span>
            <strong className="text-xl sm:text-2xl font-black font-mono text-purple-400 block">6 Puntos</strong>
            <span className="text-[10px] text-slate-400">Sede, Cancha, Agua, Alarma</span>
          </div>
        </div>

        {/* MAPA INTERACTIVO PÚBLICO TOTALMENTE OPERATIVO */}
        <TiltCard3D intensity={3}>
          <CommunityInteractiveMap
            centerLat={-17.41325}
            centerLng={-66.16543}
            zoom={16}
            heightClass="h-96 sm:h-[480px]"
            otbName={currentOtb?.name || 'OTB Villa Esperanza'}
            otbId={currentOtb?.id || '11111111-1111-1111-1111-111111111111'}
          />
        </TiltCard3D>

        {/* 4 Pilares del Sistema Catastral Comunal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
              <PenTool className="w-4 h-4" />
              <span>Delimitación con Trazo Libre</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              La directiva traza los límites exactos de la OTB a mano alzada en el mapa satelital, resolviendo colindancias y evitando invasiones territoriales.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
              <Layers className="w-4 h-4" />
              <span>Organización por Manzanos</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              El barrio se organiza en Manzanos (A, B, C, D) con código y color propio para censar lotes, convocar delegados de cuadra y ordenar el cobro de cuotas.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
              <Building2 className="w-4 h-4" />
              <span>Equipamiento Comunal</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Ubicación geolocalizada de la Sede Social, Cancha & Tinglado, tanques de agua, alarmas vecinales y áreas verdes visibles para toda la comunidad.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-black text-sm">
              <Download className="w-4 h-4" />
              <span>Exportación Oficial GeoJSON</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Planos digitales descargables con validez comunal según Ley N° 1551, listos para presentar ante el Gobierno Municipal sin pagar topógrafos externos.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. ECOSISTEMA INTEGRAL XENTRA OTB (6 MÓDULOS CLAVE)                 */}
      {/* =================================================================== */}
      <section className="scroll-mt-20 sm:scroll-mt-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800/80 text-left">
        <div className="max-w-3xl space-y-3 mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Tecnología Comunitaria Integral
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Todo lo que Necesita una OTB Moderna en una Sola Plataforma
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Seis herramientas diseñadas para la realidad boliviana: simples para los vecinos adultos mayores y transparentes para la fiscalización comunitaria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* MÓDULO 1: PAGOS QR */}
          <TiltCard3D intensity={4}>
            <div className="h-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">1. Cobro por QR Simple en 10s</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                0% comisiones bancarias. El vecino paga su cuota desde Banco Unión, BCP, BNB o BancoSol. El dinero va directo a la cuenta de la OTB, sin sobres ni dinero en mano.
              </p>
            </div>
          </TiltCard3D>

          {/* MÓDULO 2: RECIBO TRACE */}
          <TiltCard3D intensity={4}>
            <div className="h-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-blue-500/50 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">2. Recibo Oficial Inmutable TRACE</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Cada pago genera una firma digital única SHA-256. El recibo es infalsificable y verificable públicamente con la cámara de cualquier teléfono celular.
              </p>
            </div>
          </TiltCard3D>

          {/* MÓDULO 3: AI AUDITOR */}
          <TiltCard3D intensity={4}>
            <div className="h-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-purple-500/50 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">3. XENTRA AI Auditor Comunal</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Fiscalización automática preventiva. Detecta gastos sin factura respaldatoria o cobros duplicados antes de la asamblea dominical de rendición de cuentas.
              </p>
            </div>
          </TiltCard3D>

          {/* MÓDULO 4: VOTA DEMOCRACIA */}
          <TiltCard3D intensity={4}>
            <div className="h-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-black">
                <Vote className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">4. Democracia Barrial VOTA OTB</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Consultas vecinales transparentes para priorizar obras comunitarias: tinglado de la cancha, instalación de cámaras o asfaltado de pasajes.
              </p>
            </div>
          </TiltCard3D>

          {/* MÓDULO 5: AUXILIO 24/7 */}
          <TiltCard3D intensity={4}>
            <div className="h-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-rose-500/50 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center font-black">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">5. Central de Auxilio & Alertas 24/7</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Llamada en 1 toque a Policía 110, SAMU 168, Bomberos 119 y activación de sirenas vecinales ante sospechosos o emergencias en la cuadra.
              </p>
            </div>
          </TiltCard3D>

          {/* MÓDULO 6: LOCAL-FIRST SQLITE */}
          <TiltCard3D intensity={4}>
            <div className="h-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-amber-500/50 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">6. Local-First SQLite (Sin Internet)</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Funciona en el celular aunque no haya señal en la sede o se corte la luz en el barrio. Registra cobros localmente y sincroniza al volver la red.
              </p>
            </div>
          </TiltCard3D>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. LLAMADO A LA ACCIÓN FINAL (HIGH CONVERSION CTA)                  */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800/80 text-center">
        <TiltCard3D intensity={4}>
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/70 via-[#0B132B] to-[#0B132B] border-2 border-blue-500/40 shadow-2xl max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Lleva la Transparencia y el Orden a tu OTB Hoy Mismo.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Sin costos de instalación, sin comisiones bancarias y compatible con cualquier teléfono móvil. Erradica la desconfianza en tu próxima asamblea vecinal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>Acceder al Portal Vecinal</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>Instalar APK Android v3.0</span>
              </button>
            </div>
          </div>
        </TiltCard3D>
      </section>

      {/* =================================================================== */}
      {/* 8. FOOTER PÚBLICO INSTITUCIONAL NACIONAL (Sin menciones al escudo)  */}
      {/* =================================================================== */}
      <CommunityFooter
        variant="public"
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenInstallApp={() => setIsInstallModalOpen(true)}
        onOpenTransparency={() => setIsTransparencyModalOpen(true)}
      />

      {/* Modal Centro de Auxilio y Emergencias */}
      {isEmergencyModalOpen && (
        <CommunityAlertsAndEmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          otbId={currentOtb?.id || '11111111-1111-1111-1111-111111111111'}
          otbName={currentOtb?.name || 'Comunidad Vecinal'}
        />
      )}

      {/* Modal Instalar App APK */}
      {isInstallModalOpen && (
        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />
      )}

      {/* Modal Transparencia OTB */}
      {isTransparencyModalOpen && (
        <CommunityTransparencyModal
          isOpen={isTransparencyModalOpen}
          onClose={() => setIsTransparencyModalOpen(false)}
        />
      )}
    </div>
  );
};
