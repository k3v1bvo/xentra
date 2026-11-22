import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  QrCode,
  ArrowRight,
  Search,
  Smartphone,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Scale,
  Menu,
  X,
  MapPin,
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
      // Redirige al inicio de sesión de forma segura
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
      {/* 1. HEADER INSTITUCIONAL LIMPIO Y DIRECTO                            */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 h-18 flex items-center justify-between shadow-2xl">
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

        {/* Acciones del Header */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-black text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span className="text-base">🚨</span>
            <span>Auxilio & Alertas</span>
          </button>

          <button
            onClick={() => navigate('/verificar-recibo')}
            className="h-10 px-3.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
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
                className="h-10 px-4 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/25"
              >
                <span>{currentRole === 'vecino' ? 'Ir a Mis Cuotas' : 'Panel Directiva'}</span>
                <ArrowRight className="w-4 h-4" />
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
              className="h-10 px-5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/25"
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

        {/* Drawer Móvil Desplegable */}
        {mobileNavOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0B132B]/98 border-b-2 border-slate-800 p-4 space-y-2.5 lg:hidden shadow-2xl backdrop-blur-xl text-left">
            <button
              onClick={() => {
                setMobileNavOpen(false);
                setIsEmergencyModalOpen(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-black text-rose-300 bg-rose-950/40 border border-rose-500/30 flex items-center gap-2"
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
              <span>Verificar Recibo QR TRACE</span>
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
      {/* 2. HERO PRINCIPAL: PROPUESTA DE VALOR DIRECTA, CLARA Y POTENTE      */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-12 flex-1 text-left">
        <div className="max-w-4xl space-y-6">
          
          {/* Kicker Institucional */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0B132B] border border-blue-500/30 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wider">
              Gestión Financiera Transparente para Comunidades y Barrios
            </span>
          </div>

          {/* Titular Principal de Gran Tamaño y Alto Impacto */}
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

          {/* Buscador de Socio / Lote */}
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
                className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0 shadow-lg shadow-blue-600/30"
              >
                <span>Consultar Mi Estado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Garantías Clave (Grandes y Legibles) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B132B] border border-slate-800 text-xs sm:text-sm font-bold text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              0% Comisión Bancaria
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B132B] border border-slate-800 text-xs sm:text-sm font-bold text-slate-200">
              <Lock className="w-4 h-4 text-blue-400" />
              Cifrado SHA-256 Inmutable
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B132B] border border-slate-800 text-xs sm:text-sm font-bold text-slate-200">
              <Cpu className="w-4 h-4 text-purple-400" />
              Local-First SQLite
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B132B] border border-slate-800 text-xs sm:text-sm font-bold text-slate-200">
              <Scale className="w-4 h-4 text-amber-400" />
              Ley N° 1551 de Bolivia
            </span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. TRES TARJETAS PRINCIPALES: CLARAS, GRANDES Y FÁCILES DE ENTENDER */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TARJETA 1: PORTAL DEL VECINO */}
          <TiltCard3D>
            <button
              onClick={() => handlePortalRedirect('vecino')}
              className="w-full h-full p-6 sm:p-8 rounded-3xl bg-[#0B132B]/95 border-2 border-slate-800 hover:border-blue-500/60 transition-all text-left space-y-4 group cursor-pointer shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-300 transition-colors">
                    Portal del Vecino
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    Revisa tus cuotas del mes, historial de recibos y votaciones comunales.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-sm font-black text-blue-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span>Entrar a Mi Cuenta</span>
                  <span>→</span>
                </span>
              </div>
            </button>
          </TiltCard3D>

          {/* TARJETA 2: MESA DIRECTIVA & CAJA */}
          <TiltCard3D>
            <button
              onClick={() => handlePortalRedirect('directiva')}
              className="w-full h-full p-6 sm:p-8 rounded-3xl bg-[#0B132B]/95 border-2 border-slate-800 hover:border-emerald-500/60 transition-all text-left space-y-4 group cursor-pointer shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    Mesa Directiva & Caja
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    Control censal de lotes, cobro de cuotas, arqueo y rendición en asambleas.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-sm font-black text-emerald-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span>Administrar OTB</span>
                  <span>→</span>
                </span>
              </div>
            </button>
          </TiltCard3D>

          {/* TARJETA 3: VERIFICAR RECIBO QR */}
          <TiltCard3D>
            <button
              onClick={() => handlePortalRedirect('recibo')}
              className="w-full h-full p-6 sm:p-8 rounded-3xl bg-[#0B132B]/95 border-2 border-slate-800 hover:border-purple-500/60 transition-all text-left space-y-4 group cursor-pointer shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                    Verificar Recibo QR
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    Escanea cualquier recibo físico de la OTB para comprobar su validez legal.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-sm font-black text-purple-400 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span>Escanear Recibo</span>
                  <span>→</span>
                </span>
              </div>
            </button>
          </TiltCard3D>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. ¿CÓMO FUNCIONA XENTRA OTB? TRES PASOS SIMPLES. CERO COMPLICACIONES */}
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
          
          {/* PASO 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
            <div className="text-3xl">📱</div>
            <div className="space-y-2">
              <span className="text-xs font-black text-blue-400 uppercase tracking-wider block">Paso 1</span>
              <h3 className="text-xl font-black text-white">Pago con QR Simple</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                El vecino paga desde su teléfono mediante su aplicación bancaria (Banco Unión, BCP, BNB) sin salir de casa ni hacer filas.
              </p>
            </div>
          </div>

          {/* PASO 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
            <div className="text-3xl">📜</div>
            <div className="space-y-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">Paso 2</span>
              <h3 className="text-xl font-black text-white">Recibo Oficial Certificado</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                El sistema emite un recibo formal con código QR y token digital inmutable SHA-256 para imprimir o guardar.
              </p>
            </div>
          </div>

          {/* PASO 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
            <div className="text-3xl">🏛️</div>
            <div className="space-y-2">
              <span className="text-xs font-black text-purple-400 uppercase tracking-wider block">Paso 3</span>
              <h3 className="text-xl font-black text-white">Asamblea Transparente</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                La directiva presenta los gastos con facturas y fotos en pantalla gigante. Cada centavo recaudado tiene destino comprobado.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. GEORREFERENCIACIÓN COMUNAL EN VIVO: TERRITORIO Y EQUIPAMIENTO    */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-800 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Georreferenciación Comunal en Vivo</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Territorio y Equipamiento de la OTB
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Sede social, canchas polifuncionales y avisos vecinales geolocalizados en el mapa.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="h-11 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-black text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Descargar App APK Móvil</span>
            </button>
          </div>
        </div>

        {/* Mapa Interactivo de la OTB */}
        <div className="rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-[#0B132B]">
          <div className="px-5 py-3.5 bg-[#030712] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-black text-white">Mapa Vecinal Oficial ({currentOtb?.name || 'OTB Villa Esperanza'})</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-medium">OpenStreetMap • 100% Libre</span>
            </div>

            <a
              href="https://www.google.com/maps?q=-17.41325,-66.16543"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>Abrir GPS Satelital</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <CommunityInteractiveMap
            centerLat={-17.41325}
            centerLng={-66.16543}
            zoom={16}
            heightClass="h-96 sm:h-[480px]"
            otbName={currentOtb?.name || 'OTB Villa Esperanza'}
            otbId={currentOtb?.id || '11111111-1111-1111-1111-111111111111'}
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
