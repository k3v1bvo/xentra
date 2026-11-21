import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Home,
  CheckCircle2,
  FileCheck,
  Send,
  X,
  CreditCard,
  Lock,
  Search,
  Check,
  AlertCircle,
  Clock,
  Upload,
  Sparkles,
  Vote,
  FileText,
  Smartphone,
  PhoneCall,
  MapPin,
  ExternalLink,
  Download,
  Flame,
  Award,
  Scale,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { Xentra3DCanvas } from '../components/Xentra3DCanvas';
import { TiltCard3D } from '../components/TiltCard3D';
import { PrintableStatementModal, StatementData, FeeItem } from '../components/PrintableStatementModal';
import { CommunityAlertsAndEmergencyModal } from '../components/CommunityAlertsAndEmergencyModal';
import { CommunityTransparencyModal } from '../components/CommunityTransparencyModal';
import { InstallAppModal } from '../components/InstallAppModal';
import { CommunityInteractiveMap } from '../components/CommunityInteractiveMap';
import { BoliviaCoatOfArms } from '../components/BoliviaCoatOfArms';
import { CommunityFooter } from '../components/CommunityFooter';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { usePaymentVerificationStore } from '../stores/paymentVerificationStore';
import { formatBOB, AppRole } from '@xentra/shared';

interface SearchResult {
  otbName: string;
  otbCode: string;
  department: string;
  socioCode: string;
  fullName: string;
  ciNumber: string;
  blockName: string;
  lotName: string;
  totalDebt: number;
  status: 'al_dia' | 'con_deuda';
  unsettledConcept: string;
  lastReceipt: string;
  tokenHash: string;
  feesBreakdown: FeeItem[];
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setProfile, setCurrentRole } = useAuthStore();
  const { currentOtb } = useTenantStore();
  const { config: otbPaymentConfig, submitVoucher } = usePaymentVerificationStore();

  // Buscador de socio / lote
  const [searchInput, setSearchInput] = useState('');
  const [resolvedResult, setResolvedResult] = useState<SearchResult | null>(null);

  // Modales
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('50.00');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState(false);

  // Búsqueda inteligente de socio
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    if (query.includes('005') || query.includes('SILVIA') || query.includes('8521479') || query.includes('LOTE 05') || query.includes('05')) {
      setResolvedResult({
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        socioCode: 'SOC-005',
        fullName: 'Silvia Rojas Torrico',
        ciNumber: '8521479 CBBA',
        blockName: 'Manzana B',
        lotName: 'Lote 05',
        totalDebt: 125.0,
        status: 'con_deuda',
        unsettledConcept: 'Cuota Noviembre 2026 + Aporte Pro-Tinglado',
        lastReceipt: 'OTB-CBBA-001-2026-00041',
        tokenHash: 'b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678',
        feesBreakdown: [
          { period: 'Nov 2026', concept: 'Cuota Ordinaria Noviembre 2026', assigned: 25, paid: 0, balance: 25, status: 'Pendiente' },
          { period: 'Nov 2026', concept: 'Aporte Pro-Tinglado (Cuota 1 de 2)', assigned: 100, paid: 0, balance: 100, status: 'Pendiente' }
        ]
      });
    } else {
      setResolvedResult({
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        socioCode: 'SOC-012',
        fullName: 'Juan José Flores Morales',
        ciNumber: '7412589 CBBA',
        blockName: 'Manzana A',
        lotName: 'Lote 12',
        totalDebt: 0.0,
        status: 'al_dia',
        unsettledConcept: 'Ninguna (Aportes al Día)',
        lastReceipt: 'OTB-CBBA-001-2026-00042',
        tokenHash: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4',
        feesBreakdown: [
          { period: 'Nov 2026', concept: 'Cuota Ordinaria Noviembre 2026', assigned: 25, paid: 25, balance: 0, status: 'Pagado' },
          { period: 'Nov 2026', concept: 'Aporte Pro-Tinglado Cancha', assigned: 100, paid: 100, balance: 0, status: 'Pagado' }
        ]
      });
    }
  };

  const loadPresetSearch = (type: 'al_dia' | 'con_deuda') => {
    if (type === 'con_deuda') {
      setSearchInput('Lote 05 - Silvia Rojas');
      setResolvedResult({
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        socioCode: 'SOC-005',
        fullName: 'Silvia Rojas Torrico',
        ciNumber: '8521479 CBBA',
        blockName: 'Manzana B',
        lotName: 'Lote 05',
        totalDebt: 125.0,
        status: 'con_deuda',
        unsettledConcept: 'Cuota Noviembre 2026 + Aporte Pro-Tinglado',
        lastReceipt: 'OTB-CBBA-001-2026-00041',
        tokenHash: 'b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678',
        feesBreakdown: [
          { period: 'Nov 2026', concept: 'Cuota Ordinaria Noviembre 2026', assigned: 25, paid: 0, balance: 25, status: 'Pendiente' },
          { period: 'Nov 2026', concept: 'Aporte Pro-Tinglado (Cuota 1 de 2)', assigned: 100, paid: 0, balance: 100, status: 'Pendiente' }
        ]
      });
    } else {
      setSearchInput('Lote 12 - Juan Flores');
      setResolvedResult({
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        socioCode: 'SOC-012',
        fullName: 'Juan José Flores Morales',
        ciNumber: '7412589 CBBA',
        blockName: 'Manzana A',
        lotName: 'Lote 12',
        totalDebt: 0.0,
        status: 'al_dia',
        unsettledConcept: 'Ninguna (Aportes al Día)',
        lastReceipt: 'OTB-CBBA-001-2026-00042',
        tokenHash: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4',
        feesBreakdown: [
          { period: 'Nov 2026', concept: 'Cuota Ordinaria Noviembre 2026', assigned: 25, paid: 25, balance: 0, status: 'Pagado' },
          { period: 'Nov 2026', concept: 'Aporte Pro-Tinglado Cancha', assigned: 100, paid: 100, balance: 0, status: 'Pagado' }
        ]
      });
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(otbPaymentConfig.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSubmitVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    await submitVoucher({
      otbId: otbPaymentConfig.otbId,
      neighborName: resolvedResult?.fullName || 'Vecino OTB',
      neighborSocioCode: resolvedResult?.socioCode || 'SOC-001',
      neighborCi: resolvedResult?.ciNumber || '7412589 CBBA',
      block: resolvedResult?.blockName || 'Manzana A',
      lot: resolvedResult?.lotName || 'Lote 01',
      amount: parseFloat(payAmount) || 50,
      concept: `Pago por QR Simple - ${resolvedResult?.unsettledConcept || 'Cuota Comunal'}`,
      method: 'QR',
      evidenceName: selectedFileName || 'comprobante_banco_union.jpg'
    });

    setIsUploading(false);
    setUploadSuccess(true);
    alert('¡Comprobante enviado a la Tesorería de la OTB! Será validado y se emitirá tu recibo oficial.');
  };

  const handleDemoAccess = (role: AppRole) => {
    setCurrentRole(role);
    if (role === 'presidente') {
      setUser({ id: 'user-dir-1', email: 'directiva@xentra.app' });
      setProfile({
        id: 'user-dir-1',
        first_name: 'Roberto',
        last_name: 'Gutiérrez (Presidente)',
        ci_number: '7654321',
        phone: '76543210',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      navigate('/admin');
    } else if (role === 'vecino') {
      setUser({ id: 'user-vec-1', email: 'vecino@xentra.app' });
      setProfile({
        id: 'user-vec-1',
        first_name: 'Juan José',
        last_name: 'Flores (Socio)',
        ci_number: '7412589',
        phone: '74567890',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      navigate('/vecino');
    } else {
      setUser({ id: 'user-sup-1', email: 'superadmin@xentra.app' });
      setProfile({
        id: 'user-sup-1',
        first_name: 'Admin',
        last_name: 'Nacional Xentra',
        ci_number: '1000000',
        phone: '70000000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      navigate('/superadmin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Fondo 3D interactivo con partículas */}
      <Xentra3DCanvas />

      {/* =================================================================== */}
      {/* 1. BARRA SUPERIOR INSTITUCIONAL ASIMÉTRICA (Senior Friendly ≥ 48px)  */}
      {/* =================================================================== */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Lado Izquierdo: Identidad de Marca Institucional */}
          <div className="flex items-center gap-3.5">
            <XentraLogo size="md" variant="light" />
            <div className="hidden sm:block border-l border-slate-800 pl-3">
              <span className="block text-xs font-black text-white tracking-wider uppercase">
                Plataforma Comunal Bolivia
              </span>
              <span className="block text-[11px] text-blue-400 font-medium">
                Soberanía Digital Barrial • Ley N° 1551
              </span>
            </div>
          </div>

          {/* Lado Derecho: Enlaces de Servicio & Acceso */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/verificar-recibo')}
              className="hidden md:inline-flex min-h-[44px] px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 items-center gap-2 transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Verificar Recibo TRACE</span>
            </button>

            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="hidden lg:inline-flex min-h-[44px] px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 items-center gap-2 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>App Móvil APK</span>
            </button>

            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="min-h-[44px] px-3.5 sm:px-4 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 text-rose-200 hover:text-white border border-rose-500/50 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">🚨 Central de Auxilio</span>
              <span className="sm:hidden">🚨 Auxilio</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="min-h-[44px] px-5 sm:px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              Ingresar
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. HERO PRINCIPAL: GRID ASIMÉTRICO ALINEADO A LA IZQUIERDA (NO IA)   */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* =============================================================== */}
          {/* COLUMNA IZQUIERDA (7 COLS): MENSAJE, BUSCADOR & GARANTÍAS       */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Badge Cívico Soberano */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B132B] border border-slate-700/80 shadow-md">
              <BoliviaCoatOfArms size={22} />
              <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Sistema Cívico de Gobernanza Barrial • Ley N° 1551
              </span>
            </div>

            {/* Titular Asimétrico de Alto Impacto */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Cuentas Claras en tu OTB. <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                  Sin Desvíos ni Recibos Perdidos.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
                Plataforma comunal boliviana diseñada para la <strong>trazabilidad inmutable de cuotas barriales</strong>. Paga por QR Simple desde tu celular, obtén <strong>recibos digitales certificados con código QR</strong> y ejerce control social directo en cada asamblea vecinal.
              </p>
            </div>

            {/* ============================================================= */}
            {/* BUSCADOR DE SOCIO / LOTE DE ALTO CONTRASTE                   */}
            {/* ============================================================= */}
            <div className="space-y-3 max-w-xl">
              <form onSubmit={handleSearch} className="p-2 rounded-2xl bg-[#0B132B] border-2 border-blue-500/50 shadow-2xl flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400 ml-2.5 flex-shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por Lote, Carnet (CI) o Nombre de Socio..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white placeholder-slate-400 focus:outline-none px-2"
                />
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-black text-xs sm:text-sm shadow-md flex-shrink-0 transition-all cursor-pointer"
                >
                  Consultar Estado
                </button>
              </form>

              {/* Chips de prueba rápida para jurado / vecino */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Prueba rápida:</span>
                <button
                  type="button"
                  onClick={() => loadPresetSearch('al_dia')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                >
                  ✓ Lote 12 (Juan Flores - Al Día)
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetSearch('con_deuda')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                >
                  ⚠ Lote 05 (Silvia Rojas - Saldo Pendiente)
                </button>
              </div>
            </div>

            {/* ============================================================= */}
            {/* SELLOS DE INGENIERÍA & GARANTÍA HORIZONTALES                 */}
            {/* ============================================================= */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-xl">
              <div className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-200">SHA-256 Inmutable</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-slate-800 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-200">Local-First SQLite</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-200">Zero-PII Aislado</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B132B]/80 border border-slate-800 flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-200">Licencia Libre MIT</span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* COLUMNA DERECHA (5 COLS): TARJETA DINÁMICA / RECIBO EN VIVO    */}
          {/* =============================================================== */}
          <div className="lg:col-span-5">
            {resolvedResult ? (
              /* Tarjeta del Socio Encontrado en Búsqueda */
              <div className="p-6 rounded-3xl bg-[#0B132B] border-2 border-blue-500/60 shadow-2xl text-left space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg ${
                      resolvedResult.totalDebt === 0
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {resolvedResult.totalDebt === 0 ? '✓' : '!'}
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base">{resolvedResult.fullName}</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {resolvedResult.socioCode} • CI: {resolvedResult.ciNumber}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setResolvedResult(null);
                      setSearchInput('');
                    }}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Cerrar consulta"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Ubicación Lote</span>
                    <strong className="text-white font-mono">{resolvedResult.blockName}, {resolvedResult.lotName}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Estado de Caja</span>
                    <strong className={resolvedResult.totalDebt === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                      {resolvedResult.totalDebt === 0 ? 'Al Día (0 Bs.)' : `Debe ${formatBOB(resolvedResult.totalDebt)}`}
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Detalle de Aportes</span>
                  <p className="text-slate-200 font-medium">{resolvedResult.unsettledConcept}</p>
                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    Último Recibo: {resolvedResult.lastReceipt}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  {resolvedResult.totalDebt > 0 && (
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="w-full sm:flex-1 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Pagar con QR Simple</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="w-full sm:flex-1 h-11 px-4 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Ver Ficha Oficial</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Demostración en Vivo: Comprobante Comunal Digital con QR & SHA-256 */
              <div className="p-6 rounded-3xl bg-[#0B132B]/95 border-2 border-slate-800 shadow-2xl text-left space-y-4 relative overflow-hidden group">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <BoliviaCoatOfArms size={24} />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                        Certificación Criptográfica TRACE
                      </span>
                      <h4 className="text-sm font-black text-white">Recibo Oficial Comunal</h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Emitido ✓
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">N° Comprobante:</span>
                    <span className="font-mono font-bold text-white">OTB-CBBA-2026-00042</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Socio / Titular:</span>
                    <span className="font-bold text-white">Juan José Flores M. (Lote 12)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Concepto:</span>
                    <span className="text-slate-200">Cuota Nov 2026 + Tinglado</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Monto Cancelado:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">Bs. 125.00</span>
                  </div>
                </div>

                {/* Vista previa del QR de validación legal */}
                <div className="p-3.5 rounded-2xl bg-[#020617] border border-slate-800 flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <QrCode className="w-full h-full text-slate-950" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Firma Digital SHA-256</span>
                    <p className="text-[10px] font-mono text-blue-300 truncate">
                      7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2
                    </p>
                    <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Inmutable en Ledger Comunal</span>
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => navigate('/verificar-recibo')}
                    className="w-full h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-purple-400" />
                    <span>Escanear y Validar Cualquier Recibo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. MÓDULOS DE ACCESO DIRECTO SENIOR-FRIENDLY (Alineado y Prolijo)  */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-12 text-left">
          <TiltCard3D>
            <button
              onClick={() => handleDemoAccess('vecino')}
              className="w-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-blue-500/60 transition-all text-left space-y-3 group cursor-pointer shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                  Portal del Vecino
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Consulta de cuotas del mes, historial de recibos con código QR y votaciones comunales directas.
                </p>
              </div>
              <span className="text-xs font-black text-blue-400 flex items-center gap-1 pt-1">
                Entrar a Mi Cuenta →
              </span>
            </button>
          </TiltCard3D>

          <TiltCard3D>
            <button
              onClick={() => handleDemoAccess('presidente')}
              className="w-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-emerald-500/60 transition-all text-left space-y-3 group cursor-pointer shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                  Mesa Directiva & Caja
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Padrón censal de lotes, recaudación de cuotas, arqueo automático y rendición para asambleas.
                </p>
              </div>
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1 pt-1">
                Administrar OTB →
              </span>
            </button>
          </TiltCard3D>

          <TiltCard3D>
            <button
              onClick={() => navigate('/verificar-recibo')}
              className="w-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 hover:border-purple-500/60 transition-all text-left space-y-3 group cursor-pointer shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                  Verificar Recibo QR
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Validador público instantáneo para verificar autenticidad legal contra el registro inmutable.
                </p>
              </div>
              <span className="text-xs font-black text-purple-400 flex items-center gap-1 pt-1">
                Escanear Recibo →
              </span>
            </button>
          </TiltCard3D>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. FLUJO DE 3 PASOS: CLARIDAD Y TRANSPARENCIA VECINAL              */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-slate-800/80 text-left">
        <div className="space-y-1.5 mb-8">
          <span className="text-xs font-black text-blue-400 uppercase tracking-wider block">
            ¿Cómo Funciona la Plataforma en tu Barrio?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Tres Pasos Simples. Cero Complicaciones.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PASO 1 */}
          <div className="p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-2xl text-blue-400 font-black">
              📱
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-black text-blue-400 uppercase tracking-wider block">Paso 1</span>
              <h3 className="text-lg font-black text-white">Pago con QR Simple</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                El vecino paga desde su teléfono mediante cualquier aplicación bancaria nacional (Banco Unión, BCP, BNB, BancoSol) sin salir de su casa.
              </p>
            </div>
          </div>

          {/* PASO 2 */}
          <div className="p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl text-emerald-400 font-black">
              📜
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">Paso 2</span>
              <h3 className="text-lg font-black text-white">Recibo Oficial Certificado</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                El sistema emite un recibo formal con Escudo Nacional de Bolivia, código QR escaneable y token digital inmutable SHA-256.
              </p>
            </div>
          </div>

          {/* PASO 3 */}
          <div className="p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl text-purple-400 font-black">
              🏛️
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-black text-purple-400 uppercase tracking-wider block">Paso 3</span>
              <h3 className="text-lg font-black text-white">Asamblea Transparente</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                La directiva proyecta el balance general con respaldo fotográfico de facturas. Cada centavo recaudado tiene destino comprobado ante las bases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. MAPA TERRITORIAL Y GEORREFERENCIACIÓN COMUNAL                    */}
      {/* =================================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-slate-800/80 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
              Georreferenciación Comunal en Vivo
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white">
              Territorio y Equipamiento Barrial
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sedes sociales, centros de salud, canchas polifuncionales y avisos vecinales geolocalizados.
            </p>
          </div>

          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="h-11 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-black text-slate-200 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Descargar App APK Móvil</span>
          </button>
        </div>

        <CommunityInteractiveMap
          centerLat={-17.41325}
          centerLng={-66.16543}
          zoom={16}
          heightClass="h-80 sm:h-96"
          otbName="Territorio Comunal Bolivia"
        />
      </section>

      {/* =================================================================== */}
      {/* 6. FOOTER PÚBLICO INSTITUCIONAL NACIONAL (Única Instancia)          */}
      {/* =================================================================== */}
      <CommunityFooter
        variant="public"
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenInstallApp={() => setIsInstallModalOpen(true)}
        onOpenTransparency={() => setIsTransparencyModalOpen(true)}
      />

      {/* =================================================================== */}
      {/* MODAL 1: PAGAR CON CÓDIGO QR SIMPLE DE LA OTB                       */}
      {/* =================================================================== */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto border-2 border-slate-700">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
                Recaudación Oficial
              </span>
              <h3 className="text-xl font-black text-white">Pago con QR Simple Bancario</h3>
              <p className="text-xs text-slate-400 mt-1">
                Cuenta Oficial de la OTB • {otbPaymentConfig.bankName}
              </p>
            </div>

            {/* Código QR del Banco de la OTB */}
            <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center border-2 border-slate-300">
              {otbPaymentConfig.qrImageUrl ? (
                <img
                  src={otbPaymentConfig.qrImageUrl}
                  alt="QR Oficial OTB"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex flex-col items-center justify-center text-slate-800 space-y-2">
                  <QrCode className="w-24 h-24 text-blue-700" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">QR Simple Bancario</span>
                </div>
              )}
              <span className="text-xs font-black text-slate-900 mt-2">
                Escanea con tu aplicación de banco
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <p><strong>Entidad:</strong> {otbPaymentConfig.bankName}</p>
              <p><strong>Número de Cuenta:</strong> <span className="font-mono text-emerald-400 font-bold">{otbPaymentConfig.accountNumber}</span></p>
              <p><strong>Titular:</strong> {otbPaymentConfig.accountHolder}</p>
            </div>

            {/* Formulario para adjuntar comprobante */}
            <form onSubmit={handleSubmitVoucher} className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Monto Pagado (Bs.):</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Adjuntar Captura de Depósito:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || null)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                {isUploading ? 'Enviando comprobante...' : 'Enviar Comprobante a Tesorería'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ficha Oficial Imprimible */}
      {isPrintModalOpen && resolvedResult && (
        <PrintableStatementModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          data={{
            otbName: resolvedResult.otbName,
            otbCode: resolvedResult.otbCode,
            department: resolvedResult.department,
            municipality: 'Cochabamba (Cercado)',
            zone: 'Distrito 4 - Noroeste',
            socioCode: resolvedResult.socioCode,
            socioName: resolvedResult.fullName,
            ciNumber: resolvedResult.ciNumber,
            block: resolvedResult.blockName,
            lot: resolvedResult.lotName,
            totalAssigned: 125,
            totalPaid: resolvedResult.totalDebt === 0 ? 125 : 0,
            totalDebt: resolvedResult.totalDebt,
            lastReceiptNumber: resolvedResult.lastReceipt,
            tokenHash: resolvedResult.tokenHash,
            fees: resolvedResult.feesBreakdown
          }}
        />
      )}

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
    </div>
  );
};
