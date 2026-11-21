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
  ChevronRight,
  Search,
  Mail,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Upload,
  Sparkles,
  Info,
  Vote,
  EyeOff,
  Layers,
  FileText,
  ShieldAlert,
  Printer,
  PhoneCall,
  Smartphone,
  Type,
  Radio,
  Eye,
  AlertTriangle,
  Lightbulb,
  Download,
  MapPin,
  Globe
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { Xentra3DCanvas } from '../components/Xentra3DCanvas';
import { TiltCard3D } from '../components/TiltCard3D';
import { PrintableStatementModal, StatementData, FeeItem } from '../components/PrintableStatementModal';
import { CommunityAlertsAndEmergencyModal } from '../components/CommunityAlertsAndEmergencyModal';
import { CommunityTransparencyModal } from '../components/CommunityTransparencyModal';
import { InstallAppModal } from '../components/InstallAppModal';
import { CommunityInteractiveMap } from '../components/CommunityInteractiveMap';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { usePaymentVerificationStore } from '../stores/paymentVerificationStore';
import { formatBOB, AppRole } from '@xentra/shared';
import { sendNeighborEmailNotification, GOOGLE_SMTP_CONFIG } from '../services/emailNotificationService';

type ResolvedType = 'neighbor' | 'admin' | 'superadmin' | 'not_found';

interface SearchResult {
  type: ResolvedType;
  otbName: string;
  otbCode: string;
  department: string;
  municipality?: string;
  zone?: string;
  code: string;
  socioCode?: string;
  lotName?: string;
  blockName?: string;
  maskedName?: string;
  fullName?: string;
  maskedCi?: string;
  ciNumber?: string;
  phone?: string;
  totalAssigned?: number;
  totalPaid?: number;
  totalDebt: number;
  unsettledConcept?: string;
  role?: string;
  status: 'al_dia' | 'con_deuda' | 'directiva' | 'superadmin';
  lastReceipt?: string;
  tokenHash?: string;
  feesBreakdown?: FeeItem[];
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setProfile, setCurrentRole } = useAuthStore();
  const { availableOtbs, setCurrentOtb } = useTenantStore();
  const { config: otbPaymentConfig, submitVoucher } = usePaymentVerificationStore();

  // Input de búsqueda
  const [searchInput, setSearchInput] = useState('');
  const [resolvedResult, setResolvedResult] = useState<SearchResult | null>(null);

  // Modal de Pago por QR
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('50.00');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Modal y Estado de Correo Google SMTP (ayni protocol)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [neighborEmail, setNeighborEmail] = useState('juan.vecino@gmail.com');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Modal para Imprimir Detalle Oficial de Cuenta / Recibo
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Modal de Auxilio y Reportes Barriales (Seguridad Ciudadana en Vivo)
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalTab, setAlertModalTab] = useState<'emergencias' | 'reportar' | 'muro'>('emergencias');

  // Modal de Descarga e Instalación App Móvil (Android APK / PWA)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Modal de Transparencia Comunitaria & Asamblea de Vecinos
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState(false);

  // Modal para solicitar nueva OTB
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [otbName, setOtbName] = useState('');
  const [department, setDepartment] = useState('Cochabamba');
  const [municipality, setMunicipality] = useState('');
  const [zone, setZone] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Lógica de Resolución de Código (Sin exponer datos sensibles)
  const handleSearchCode = (codeToSearch?: string) => {
    const code = (codeToSearch || searchInput).trim().toLowerCase();
    if (!code) return;

    if (code.includes('super') || code.includes('carlos')) {
      setResolvedResult({
        type: 'superadmin',
        otbName: 'Red Nacional Xentra Bolivia',
        otbCode: 'BOL-CENTRAL',
        department: 'Nacional',
        code: 'SUPERADMIN',
        totalDebt: 0,
        role: 'Superadministrador Nacional',
        status: 'superadmin'
      });
    } else if (code.includes('tes') || code.includes('marina') || code === 'adm-tes') {
      setResolvedResult({
        type: 'admin',
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        code: 'ADM-TES',
        totalDebt: 0,
        role: 'Tesorero de la Mesa Directiva',
        status: 'directiva'
      });
    } else if (code.includes('pres') || code.includes('roberto') || code === 'adm-pres' || code === 'admin' || code.includes('directiva')) {
      setResolvedResult({
        type: 'admin',
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        code: 'ADM-PRES',
        totalDebt: 0,
        role: 'Presidente de la Mesa Directiva',
        status: 'directiva'
      });
    } else if (code.includes('05') || code.includes('5') || code.includes('silvia') || code.includes('rojas')) {
      // Silvia Rojas - Al Día
      setResolvedResult({
        type: 'neighbor',
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        municipality: 'Cercado',
        zone: 'Distrito 4 - Zona Noroeste',
        code: 'SOC-005',
        socioCode: 'SOC-005',
        blockName: 'Manzana B',
        lotName: 'Manzana B, Lote 05',
        maskedName: 'S*** R*** T***',
        fullName: 'Silvia Rojas Torrico',
        maskedCi: '8521*** CBBA',
        ciNumber: '8521479 CBBA',
        phone: '75678901',
        totalAssigned: 125.0,
        totalPaid: 125.0,
        totalDebt: 0,
        status: 'al_dia',
        lastReceipt: 'OTB-CBBA-001-2026-00040',
        tokenHash: 'b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678',
        feesBreakdown: [
          { period: 'Nov 2026', concept: 'Cuota Ordinaria Noviembre 2026', assigned: 25.0, paid: 25.0, balance: 0.0, status: 'Pagado' },
          { period: 'Nov 2026', concept: 'Aporte Pro-Tinglado (Cuota 1)', assigned: 100.0, paid: 100.0, balance: 0.0, status: 'Pagado' }
        ]
      });
    } else if (code.includes('14') || code.includes('pedro') || code.includes('canaviri')) {
      // Pedro Canaviri - Al Día
      setResolvedResult({
        type: 'neighbor',
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        municipality: 'Cercado',
        zone: 'Distrito 4 - Zona Noroeste',
        code: 'SOC-014',
        socioCode: 'SOC-014',
        blockName: 'Manzana B',
        lotName: 'Manzana B, Lote 14',
        maskedName: 'P*** G*** C***',
        fullName: 'Pedro Gonzalo Canaviri',
        maskedCi: '4896*** CBBA',
        ciNumber: '4896325 CBBA',
        phone: '78912345',
        totalAssigned: 25.0,
        totalPaid: 25.0,
        totalDebt: 0,
        status: 'al_dia',
        lastReceipt: 'OTB-CBBA-001-2026-00039',
        tokenHash: 'd1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef',
        feesBreakdown: [
          { period: 'Nov 2026', concept: 'Cuota Ordinaria Noviembre 2026', assigned: 25.0, paid: 25.0, balance: 0.0, status: 'Pagado' }
        ]
      });
    } else {
      // Juan José Flores - Con Deuda
      const isLote = code.includes('12') || code.includes('juan') || code.includes('flores') || code.includes('lote');
      const assignedSocioCode = isLote ? 'SOC-012' : `SOC-${Math.floor(100 + Math.random() * 900)}`;

      setResolvedResult({
        type: 'neighbor',
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        municipality: 'Cercado',
        zone: 'Distrito 4 - Zona Noroeste',
        code: assignedSocioCode,
        socioCode: assignedSocioCode,
        blockName: 'Manzana A',
        lotName: 'Manzana A, Lote 12',
        maskedName: 'J*** J*** F*** M***',
        fullName: 'Juan José Flores Morales',
        maskedCi: '7412*** CBBA',
        ciNumber: '7412589 CBBA',
        phone: '74567890',
        totalAssigned: 125.0,
        totalPaid: 75.0,
        totalDebt: 50.0,
        unsettledConcept: 'Aporte Pro-Tinglado (Cuota 1) - Saldo pendiente: Bs. 50,00',
        status: 'con_deuda',
        lastReceipt: 'OTB-CBBA-001-2026-00042',
        tokenHash: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4',
        feesBreakdown: [
          { period: 'Nov 2026', concept: 'Cuota Ordinaria Noviembre 2026', assigned: 25.0, paid: 25.0, balance: 0.0, status: 'Pagado' },
          { period: 'Nov 2026', concept: 'Aporte Pro-Tinglado (Cuota 1)', assigned: 100.0, paid: 50.0, balance: 50.0, status: 'Pendiente' }
        ]
      });
    }
  };

  // Entrada Directa a Portal Vecino
  const handleEnterNeighborPortal = () => {
    const otb = availableOtbs[0];
    setCurrentOtb(otb);
    setUser({ id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', email: 'juan.vecino@xentra.app' });
    setProfile({
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      first_name: 'Juan José',
      last_name: 'Flores Morales',
      ci_number: '7412589',
      ci_extension: 'CBBA',
      phone: '74567890',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setCurrentRole('vecino');
    navigate('/vecino');
  };

  // Entrada Directa a Panel Directiva
  const handleEnterAdminPanel = (role: AppRole = 'tesorero') => {
    const otb = availableOtbs[0];
    setCurrentOtb(otb);
    if (role === 'presidente') {
      setUser({ id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', email: 'roberto.presidencia@xentra.app' });
      setProfile({
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        first_name: 'Roberto',
        last_name: 'Fernández Vargas',
        ci_number: '5289341',
        ci_extension: 'CBBA',
        phone: '72345678',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCurrentRole('presidente');
    } else {
      setUser({ id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', email: 'marina.tesoreria@xentra.app' });
      setProfile({
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        first_name: 'Marina',
        last_name: 'Condori Rocha',
        ci_number: '6398412',
        ci_extension: 'CBBA',
        phone: '73456789',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCurrentRole('tesorero');
    }
    navigate('/admin');
  };

  // Entrada a Superadmin
  const handleEnterSuperadmin = () => {
    setUser({ id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', email: 'carlos.admin@xentra.app' });
    setProfile({
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      first_name: 'Carlos',
      last_name: 'Mamani Quispe',
      ci_number: '4589210',
      ci_extension: 'CBBA',
      phone: '71234567',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setCurrentRole('superadmin');
    navigate('/superadmin');
  };

  // Copiar Cuenta Bancaria
  const handleCopyAccount = () => {
    navigator.clipboard.writeText(otbPaymentConfig.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Guardar Imagen QR en Galería para Pagar desde la App del Banco
  const handleDownloadQrImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 400, 460);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${otbPaymentConfig.otbName} - QR SIMPLE`, 200, 38);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(`${otbPaymentConfig.bankName} • Cta: ${otbPaymentConfig.accountNumber}`, 200, 62);

      // Cuadros esquinas QR
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(45, 90, 80, 80);
      ctx.clearRect(55, 100, 60, 60);
      ctx.fillRect(65, 110, 40, 40);

      ctx.fillRect(275, 90, 80, 80);
      ctx.clearRect(285, 100, 60, 60);
      ctx.fillRect(295, 110, 40, 40);

      ctx.fillRect(45, 300, 80, 80);
      ctx.clearRect(55, 310, 60, 60);
      ctx.fillRect(65, 320, 40, 40);

      // Centro distintivo XENTRA
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(200, 235, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(200, 235, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(200, 235, 9, 0, Math.PI * 2);
      ctx.fill();

      // Módulos de datos
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(150, 110, 20, 20);
      ctx.fillRect(180, 140, 20, 20);
      ctx.fillRect(210, 110, 20, 20);
      ctx.fillRect(240, 140, 20, 20);
      ctx.fillRect(150, 310, 20, 20);
      ctx.fillRect(180, 340, 20, 20);
      ctx.fillRect(210, 310, 20, 20);
      ctx.fillRect(240, 340, 20, 20);
      ctx.fillRect(275, 220, 20, 20);
      ctx.fillRect(315, 250, 20, 20);
      ctx.fillRect(100, 220, 20, 20);
      ctx.fillRect(70, 250, 20, 20);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`Monto: ${formatBOB(parseFloat(payAmount) || 50)}`, 200, 420);

      const link = document.createElement('a');
      link.download = `QR_Pago_${resolvedResult?.socioCode || 'OTB'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      alert('¡Código QR guardado en tu teléfono/descargas! Abre la app de tu banco, pulsa "Pagar QR" y selecciona esta imagen de tu galería.');
    }
  };

  // Enviar Notificación por Correo (Google SMTP / ayni protocol)
  const handleSendEmailNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);

    const res = await sendNeighborEmailNotification({
      toEmail: neighborEmail,
      recipientName: resolvedResult?.maskedName || 'Vecino Propietario',
      otbName: resolvedResult?.otbName || 'OTB Villa Esperanza',
      subject: 'Estado de Cuenta y Recibo Oficial — XENTRA OTB',
      type: 'PAYMENT_RECEIPT',
      details: {
        receiptNumber: resolvedResult?.lastReceipt || 'OTB-CBBA-001-2026-00042',
        amount: resolvedResult?.totalDebt || 50.00,
        concept: resolvedResult?.unsettledConcept || 'Cuota Comunitaria Oficial',
        dueDate: '30/11/2026'
      }
    });

    setSendingEmail(false);
    setEmailSentSuccess(true);
    setTimeout(() => {
      setEmailSentSuccess(false);
      setIsEmailModalOpen(false);
      alert(`¡Notificación enviada con éxito a ${neighborEmail} mediante Google SMTP (${GOOGLE_SMTP_CONFIG.user})!`);
    }, 1500);
  };

  // Enviar Solicitud de OTB
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setIsRequestModalOpen(false);
      setRequestSent(false);
      alert('¡Solicitud enviada al Superadministrador Nacional! Se contactarán al número provisto.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* 3D WebGL Canvas de Fondo (Constelación de Nodos OTB & Red Financiera) */}
      <Xentra3DCanvas />

      {/* Top Navbar */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between">
        <XentraLogo size="md" variant="light" />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón Reportes y Emergencias Barriales */}
          <button
            onClick={() => {
              setAlertModalTab('emergencias');
              setIsAlertModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-white animate-pulse" />
            <span className="hidden sm:inline">Auxilio 24/7 (Pol. 110)</span>
            <span className="sm:hidden">Auxilio 110</span>
          </button>

          {/* Botón Instalar App Celular (APK / PWA) */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>App Celular</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>
        </div>
      </header>

      {/* Hero Central con Buscador Inteligente por Código */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center space-y-6 sm:space-y-8 relative z-10">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>🇧🇴 Red Financiera Comunitaria Bolivia • Gestión Transparente OTB</span>
          </div>
          <h1 className="font-black text-white leading-tight tracking-tight text-3xl sm:text-5xl md:text-6xl">
            Consulta tu Estado Comunitario por <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Código de Cliente</span>
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base font-medium">
            Ingresa tu código de lote o vivienda. El sistema identificará tu OTB y mostrará solo tus obligaciones pendientes, <strong className="text-white">resguardando tu privacidad sin exponer datos sensibles a terceros</strong>.
          </p>
        </div>

        {/* Buscador Interactivo con Efecto 3D Tilt */}
        <TiltCard3D intensity={5} className="bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchCode();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-blue-400 absolute left-4 top-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ingresa tu Código (ej. Lote 12, SOC-012, 7412589, ADM-TES)..."
                className="w-full bg-[#020617] border-2 border-slate-600 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-400 font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all text-base sm:text-lg font-bold"
              />
            </div>

            <button
              type="submit"
              className="py-3.5 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex-shrink-0 text-sm sm:text-base"
            >
              <span>Buscar Estado</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Chips Sugeridos para Prueba Rápida de Alto Contraste */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-xs text-slate-300 font-bold">Pruebas sugeridas:</span>
            {[
              { label: 'Lote 12 (Vecino con deuda)', val: 'Lote 12' },
              { label: 'SOC-005 (Vecino al día)', val: 'SOC-005' },
              { label: 'SOC-014 (Vecino al día)', val: 'SOC-014' },
              { label: 'ADM-TES (Tesorero OTB)', val: 'ADM-TES' },
              { label: 'ADM-PRES (Presidente OTB)', val: 'ADM-PRES' },
              { label: 'SUPERADMIN (Control Nacional)', val: 'SUPERADMIN' }
            ].map((chip) => (
              <button
                key={chip.val}
                type="button"
                onClick={() => {
                  setSearchInput(chip.val);
                  handleSearchCode(chip.val);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-100 hover:text-white font-bold border border-slate-600 hover:border-blue-400 backdrop-blur-sm transition-all shadow-sm cursor-pointer text-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </TiltCard3D>

        {/* 3 ACCIONES RÁPIDAS COMUNITARIAS: INNOVACIÓN & SEGURIDAD BARRIAL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Tarjeta 1: Avisos Barriales en Vivo */}
          <button
            type="button"
            onClick={() => {
              setAlertModalTab('reportar');
              setIsAlertModalOpen(true);
            }}
            className="p-4 rounded-2xl bg-[#0F172A] border-2 border-amber-500/40 hover:border-amber-400 text-left space-y-1.5 transition-all shadow-md group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                Alerta Vecinal
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-amber-300">
              Avisar al Barrio en Vivo
            </h3>
            <p className="text-[11px] text-slate-300 leading-tight">
              Alguien en la cancha/calle, luminaria quemada, basura o fuga de agua.
            </p>
          </button>

          {/* Tarjeta 2: Teléfonos de Auxilio Inmediato */}
          <button
            type="button"
            onClick={() => {
              setAlertModalTab('emergencias');
              setIsAlertModalOpen(true);
            }}
            className="p-4 rounded-2xl bg-[#0F172A] border-2 border-rose-500/40 hover:border-rose-400 text-left space-y-1.5 transition-all shadow-md group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                Llamar 24h
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-rose-300">
              Teléfonos de Auxilio
            </h3>
            <p className="text-[11px] text-slate-300 leading-tight">
              Policía 110, Bomberos 119, SAMU 165 y llamada a la directiva OTB.
            </p>
          </button>

          {/* Tarjeta 3: Instalar App APK */}
          <button
            type="button"
            onClick={() => setIsInstallModalOpen(true)}
            className="p-4 rounded-2xl bg-[#0F172A] border-2 border-blue-500/40 hover:border-blue-400 text-left space-y-1.5 transition-all shadow-md group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                PWA / Android
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-blue-300">
              Instalar App en Celular
            </h3>
            <p className="text-[11px] text-slate-300 leading-tight">
              Funciona sin internet, no gasta megas y te avisa asambleas y cobros.
            </p>
          </button>
        </div>

        {/* TARJETA DINÁMICA DE RESULTADO RESOLVIDO CON TILT 3D */}
        {resolvedResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-300">Resultado de Consulta Privada:</span>
              <button
                onClick={() => {
                  setResolvedResult(null);
                  setSearchInput('');
                }}
                className="text-xs text-rose-300 hover:text-rose-200 underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cerrar resultado</span>
              </button>
            </div>

            <TiltCard3D intensity={5} className="bg-[#0B132B] border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6 animate-in fade-in duration-300">
              {/* Cabecera del Resultado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/50 text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
                    {resolvedResult.type === 'neighbor' ? (
                      <Home className="w-6 h-6 text-blue-300" />
                    ) : resolvedResult.type === 'admin' ? (
                      <Building2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-purple-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-300 font-mono bg-blue-950/90 px-2 py-0.5 rounded border border-blue-700/80">{resolvedResult.otbCode}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-extrabold text-emerald-400">{resolvedResult.department}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">{resolvedResult.otbName}</h2>
                  </div>
                </div>

                {/* Badges de Estado de Alto Contraste */}
                <div>
                  {resolvedResult.status === 'con_deuda' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/25 text-amber-300 border-2 border-amber-400 shadow-sm">
                      <AlertCircle className="w-4 h-4 text-amber-400" /> Saldo Pendiente de Pago
                    </span>
                  ) : resolvedResult.status === 'al_dia' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/25 text-emerald-300 border-2 border-emerald-400 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Al Día sin Deudas
                    </span>
                  ) : resolvedResult.status === 'directiva' ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/25 text-emerald-300 border-2 border-emerald-400 shadow-sm">
                      <Building2 className="w-4 h-4 text-emerald-400" /> Mesa Directiva de la OTB
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-purple-500/25 text-purple-300 border-2 border-purple-400 shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-purple-400" /> Superadministrador Nacional
                    </span>
                  )}
                </div>
              </div>

              {/* CASO 1: VECINO */}
              {resolvedResult.type === 'neighbor' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Datos del Inmueble (Protegidos) */}
                    <div className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 space-y-2 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Inmueble Censado</span>
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-mono border border-blue-500/50">
                          Código: {resolvedResult.socioCode || resolvedResult.code}
                        </span>
                      </div>
                      <p className="text-base font-black text-white">{resolvedResult.lotName}</p>
                      <div className="text-xs text-slate-200 space-y-1 pt-1">
                        <p><span className="text-slate-400 font-medium">Titular Ficha:</span> <strong className="font-mono text-emerald-300">{resolvedResult.maskedName}</strong></p>
                        <p><span className="text-slate-400 font-medium">Cédula Identidad:</span> <strong className="font-mono text-slate-100">{resolvedResult.maskedCi}</strong></p>
                        <p><span className="text-slate-400 font-medium">Manzano / Bloque:</span> <strong className="text-white">{resolvedResult.blockName || 'Manzana A'}</strong></p>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>Identidad anonimizada por normativa de protección comunitaria.</span>
                      </p>
                    </div>

                    {/* Estado Financiero */}
                    <div className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 space-y-2 flex flex-col justify-between shadow-md">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">Deuda Total Pendiente</span>
                        <p className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
                          {formatBOB(resolvedResult.totalDebt)}
                        </p>
                      </div>

                      <div className="text-xs pt-1">
                        {resolvedResult.totalDebt > 0 ? (
                          <p className="text-amber-300 font-bold bg-amber-950/40 p-2 rounded-xl border border-amber-800/60">
                            {resolvedResult.unsettledConcept}
                          </p>
                        ) : (
                          <p className="text-emerald-300 font-bold bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/60">
                            ✓ Todas tus cuotas comunitarias están cubiertas.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dirección de la Sede Comunal y Horarios de Cobranza Presencial */}
                  <div className="p-3.5 rounded-2xl bg-[#030712] border-2 border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-bold">
                          Sede Comunal & Cobranza Presencial ({otbPaymentConfig.otbName}):
                        </strong>
                        <span className="text-[11px] text-slate-400">
                          Av. Petrolera Km 4, Manzana A frente a Cancha Polifuncional • Sábados y Domingos de 08:30 a 12:30
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 self-start sm:self-auto">
                      Cobranza Ventanilla
                    </span>
                  </div>

                  {/* Mapa Comunal del Inmueble y la Sede de la OTB */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-extrabold text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>Plano Comunal Interactivo & Sede de la OTB:</span>
                      </span>
                      <span className="text-slate-400 text-xs">
                        Av. Petrolera Km 4
                      </span>
                    </div>

                    <CommunityInteractiveMap
                      centerLat={-17.41325}
                      centerLng={-66.16543}
                      zoom={16}
                      heightClass="h-48 sm:h-56"
                      otbName={otbPaymentConfig.otbName}
                      selectedLotName={resolvedResult.lotName}
                    />
                  </div>

                  {/* Botones de Acción Accesibles para Personas Mayores (Sin amontonamiento) */}
                  <div className="space-y-3 pt-2">
                    {/* Botón Principal Destacado */}
                    {resolvedResult.totalDebt > 0 ? (
                      <button
                        onClick={() => setIsQrModalOpen(true)}
                        className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
                      >
                        <QrCode className="w-5 h-5 text-slate-950" />
                        <span>Pagar con Código QR Simple (Desde tu Banco)</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleEnterNeighborPortal}
                        className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
                      >
                        <FileCheck className="w-5 h-5" />
                        <span>Entrar a Mi Portal de Vecino</span>
                      </button>
                    )}

                    {/* Fila de 2 Botones Secundarios Grandes y Claros */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setIsPrintModalOpen(true)}
                        className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-slate-700 transition-all cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-blue-400" />
                        <span>Imprimir Ficha Oficial</span>
                      </button>

                      <button
                        onClick={() => {
                          setAlertModalTab('reportar');
                          setIsAlertModalOpen(true);
                        }}
                        className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-slate-700 transition-all cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Avisar de un Problema</span>
                      </button>
                    </div>

                    {/* Botón de Transparencia Comunitaria y Asamblea */}
                    <button
                      type="button"
                      onClick={() => setIsTransparencyModalOpen(true)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-blue-500/50 text-blue-200 hover:text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Ver Cuentas Claras: ¿En qué se gastó? & Asamblea 29 Nov</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CASO 2: ADMIN / DIRECTIVA */}
              {resolvedResult.type === 'admin' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-[#030712] border-2 border-emerald-500/40 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Acceso Autorizado de Directiva</span>
                    <p className="text-base font-bold text-white">{resolvedResult.role}</p>
                    <p className="text-xs text-slate-300">
                      Has sido reconocido como parte de la mesa directiva de <strong>{resolvedResult.otbName}</strong>. Accede a tu panel para administrar cuotas, registrar cobros, verificar vouchers de vecinos y generar informes de asamblea.
                    </p>
                  </div>

                  <button
                    onClick={() => handleEnterAdminPanel(resolvedResult.code === 'ADM-PRES' ? 'presidente' : 'tesorero')}
                    className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-slate-950" />
                    <span>Ingresar al Panel Administrativo de tu OTB →</span>
                  </button>
                </div>
              )}

              {/* CASO 3: SUPERADMIN */}
              {resolvedResult.type === 'superadmin' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-[#030712] border-2 border-purple-500/50 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">Privilegios Globales a Nivel de Servidor</span>
                    <p className="text-base font-bold text-white">{resolvedResult.role}</p>
                    <p className="text-xs text-slate-300">
                      Supervisión multi-tenant de todas las organizaciones territoriales de base de Bolivia, creación de nuevas OTBs y aprobación de solicitudes barriales.
                    </p>
                  </div>

                  <button
                    onClick={handleEnterSuperadmin}
                    className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ingresar a la Consola Superadmin Nacional →</span>
                  </button>
                </div>
              )}
            </TiltCard3D>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECCIÓN 1: PROPAGANDA Y LOS 4 PILARES DE XENTRA OTB      */}
        {/* ======================================================== */}
        <section className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
              Tecnología Financiera Comunitaria
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ¿Por qué digitalizar tu OTB con Xentra?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Reemplazamos cuadernillos perdidos y desconfianza vecinal con una plataforma auditada que ordena tus cuentas y protege el patrimonio barrial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pilar 1: QR Simple */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border-2 border-slate-700/80 backdrop-blur-md space-y-3 hover:border-blue-400 transition-all shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="font-bold text-white text-base">Recaudación QR Simple Bancario</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Los vecinos pagan desde cualquier banco o cooperativa de Bolivia (Banco Unión, BCP, BNB, Banco Sol, Fie). Se acabaron las filas los fines de semana en la sede: escanean, pagan y adjuntan su comprobante al instante.
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recibo digital oficial con código de verificación antifraude.</span>
              </div>
            </div>

            {/* Pilar 2: XENTRA TRACE */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border-2 border-slate-700/80 backdrop-blur-md space-y-3 hover:border-emerald-400 transition-all shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="font-bold text-white text-base">Contabilidad Inmutable (XENTRA TRACE)</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Transparencia radical. Cada centavo que ingresa por cuotas ordinarias o aportes especiales para tinglados, alumbrado o seguridad tiene doble partida contable y respaldo fotográfico obligatorio de la factura o gasto.
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cero gastos sin justificar. Historial permanente auditado.</span>
              </div>
            </div>

            {/* Pilar 3: XENTRA VOTA */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border-2 border-slate-700/80 backdrop-blur-md space-y-3 hover:border-purple-400 transition-all shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center">
                <Vote className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="font-bold text-white text-base">Asambleas y Democracia Digital (XENTRA VOTA)</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Convoca asambleas ordinarias y extraordinarias con orden del día formal. Registra el quórum de vecinos presentes y somete a votación proyectos barriales con actas digitales inviolables que evitan impugnaciones.
              </p>
              <div className="pt-2 text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-400" />
                <span>Actas emitidas con firma de directiva y validación comunitaria.</span>
              </div>
            </div>

            {/* Pilar 4: AI Auditor */}
            <div className="p-6 rounded-3xl bg-[#0F172A] border-2 border-slate-700/80 backdrop-blur-md space-y-3 hover:border-amber-400 transition-all shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <h3 className="font-bold text-white text-base">Auditoría Algorítmica Preventiva</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Entrega de gestión sin conflictos. El motor auditor analiza los balances mensuales, detecta anomalías y emite informes técnicos claros para que la directiva saliente entregue su gestión con total tranquilidad y respaldo.
              </p>
              <div className="pt-2 text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Informes periciales descargables en PDF para asambleas generales.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 2: POLÍTICA DE BLINDAJE Y PRIVACIDAD TOTAL       */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0B132B] border-2 border-emerald-500/50 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center flex-shrink-0">
              <EyeOff className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Blindaje de Privacidad: Cero Exposición de Datos entre Vecinos
              </h3>
              <p className="text-xs text-slate-300">
                Por qué en Xentra no verás listas públicas de vecinos ni deudores expuestos.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#030712] border-2 border-slate-700 text-xs text-slate-200 space-y-2">
            <p className="leading-relaxed">
              En muchas comunidades se acostumbra pegar listas impresas en la puerta de la sede barrial o difundir planillas con nombres completos y montos en grupos abiertos de WhatsApp. Esta práctica <strong className="text-white">vulnera la seguridad física y económica de las familias</strong>.
            </p>
            <p className="leading-relaxed font-semibold text-white">
              En <strong>XENTRA OTB</strong>, la privacidad es prioritaria:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-200 pl-1">
              <li>Cada vecino consulta exclusivamente su propio lote utilizando su código privado o cédula.</li>
              <li>Los nombres y documentos de identidad se muestran anonimizados (<code className="text-emerald-300 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">J*** J*** F***</code>) para evitar usurpación o espionaje vecinal.</li>
              <li>Ningún vecino puede ver las deudas de otros vecinos, ni explorar padrones de otras OTBs.</li>
              <li>Únicamente la mesa directiva acreditada y el superadministrador tienen visibilidad de la tesorería global de su respectiva OTB.</li>
            </ul>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 3: CÓMO SOLICITAR ACCESO PARA MANEJAR TU OTB     */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#0B132B] to-[#0A192F] border-2 border-blue-500/50 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest block">
              Para Dirigentes, Presidentes y Mesas Directivas
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              ¿Cómo solicitar acceso para digitalizar y manejar tu OTB?
            </h2>
            <p className="text-xs text-slate-200 max-w-lg mx-auto">
              Sigue estos 3 pasos para incorporar tu comunidad a la Red Nacional de Xentra:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 space-y-2 text-center sm:text-left shadow-md">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mx-auto sm:mx-0 shadow">
                1
              </span>
              <h4 className="font-extrabold text-white text-xs">Postula tu OTB</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Llena el formulario con los datos de tu comunidad, departamento, municipio y teléfono del presidente o tesorero.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 space-y-2 text-center sm:text-left shadow-md">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto sm:mx-0 shadow">
                2
              </span>
              <h4 className="font-extrabold text-white text-xs">Validación & Código Único</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                El Superadministrador Nacional revisa la solicitud vecinal y emite el código institucional oficial (ej. <code className="text-emerald-300 font-bold">OTB-CBBA-001</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 space-y-2 text-center sm:text-left shadow-md">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center mx-auto sm:mx-0 shadow">
                3
              </span>
              <h4 className="font-extrabold text-white text-xs">Padrón y Recaudación QR</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                La directiva recibe acceso a su panel privado, registra los lotes y comienza a recaudar por QR Simple con recibos oficiales inmediatos.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-slate-950" />
              <span>Solicitar Registro de mi OTB al Superadministrador Nacional →</span>
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 4: PITCH HACKATHON — INNOVACIÓN, CREATIVIDAD E IMPACTO */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#020617] to-[#0A192F] border-2 border-emerald-500/50 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Defensa Hackathon • Evaluación de Impacto Comunal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                Innovación, Creatividad y Sostenibilidad Real
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              6 Ejes Clave de Transformación OTB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Eje 1: Innovación */}
            <div className="p-4 rounded-2xl bg-[#0B132B] border-2 border-slate-700 hover:border-blue-400 transition-all space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center font-black text-xs">01</div>
                <h3 className="font-extrabold text-sm text-white">Innovación Tecnológica</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Criptografía TRACE comunitaria:</strong> cada centavo queda sellado con hash SHA-256 inmutable en cadena de bloques local. Búsqueda Zero-PII sin contraseñas engorrosas: el vecino consulta por código o CI y sus datos están protegidos contra miradas indiscretas.
              </p>
            </div>

            {/* Eje 2: Creatividad */}
            <div className="p-4 rounded-2xl bg-[#0B132B] border-2 border-slate-700 hover:border-emerald-400 transition-all space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 flex items-center justify-center font-black text-xs">02</div>
                <h3 className="font-extrabold text-sm text-white">Creatividad Barrial 24/7</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Más allá de un Excel aburrido:</strong> convertimos la OTB en una red viva de seguridad barrial. Reportes comunitarios en tiempo real (personas descompensadas en la cancha, postes quemados, fugas de agua) con conexión directa a Radio Patrullas 110, Bomberos 119 y SAMU 165.
              </p>
            </div>

            {/* Eje 3: Impacto Medible */}
            <div className="p-4 rounded-2xl bg-[#0B132B] border-2 border-slate-700 hover:border-purple-400 transition-all space-y-2">
              <div className="flex items-center gap-2 text-purple-400">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 flex items-center justify-center font-black text-xs">03</div>
                <h3 className="font-extrabold text-sm text-white">Impacto Comunitario</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>De 45% a 95% de recaudación:</strong> al facilitar el pago por QR Simple desde el celular y erradicar las sospechas de malversación. En seguridad, reduce los tiempos de auxilio barrial de 45 minutos a menos de 5 minutos mediante rondas vecinales informadas.
              </p>
            </div>

            {/* Eje 4: Por qué se usaría */}
            <div className="p-4 rounded-2xl bg-[#0B132B] border-2 border-slate-700 hover:border-amber-400 transition-all space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <div className="w-8 h-8 rounded-xl bg-amber-600/20 flex items-center justify-center font-black text-xs">04</div>
                <h3 className="font-extrabold text-sm text-white">¿Por qué se Usaría?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Resuelve el dolor diario de la OTB:</strong> el vecino no pierde domingos haciendo filas en la sede con dinero en efectivo en mano, y la directiva ahorra más de 20 horas de contabilidad manual en cuadernos desgastados, rindiendo cuentas con balances automáticos de un clic.
              </p>
            </div>

            {/* Eje 5: Sostenibilidad Económica */}
            <div className="p-4 rounded-2xl bg-[#0B132B] border-2 border-slate-700 hover:border-teal-400 transition-all space-y-2">
              <div className="flex items-center gap-2 text-teal-400">
                <div className="w-8 h-8 rounded-xl bg-teal-600/20 flex items-center justify-center font-black text-xs">05</div>
                <h3 className="font-extrabold text-sm text-white">Sostenibilidad del Sistema</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Modelo de Micro-canon Comunal:</strong> Bs. 1 por lote/mes incluido en la cuota ordinaria cubre el 100% de los costos de servidores en la nube y soporte. Posibilidad de convenios de cooperación con Alumbrado Público y Seguridad Ciudadana de la Alcaldía.
              </p>
            </div>

            {/* Eje 6: Inclusión 40 a 60 años */}
            <div className="p-4 rounded-2xl bg-[#0B132B] border-2 border-slate-700 hover:border-rose-400 transition-all space-y-2">
              <div className="flex items-center gap-2 text-rose-400">
                <div className="w-8 h-8 rounded-xl bg-rose-600/20 flex items-center justify-center font-black text-xs">06</div>
                <h3 className="font-extrabold text-sm text-white">Diseñado para Adultos (40-60)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Accesibilidad total:</strong> modo "Lectura Fácil (A+)" con tipografía ampliada, contrastes reforzados y cero palabras técnicas en inglés. Guía ilustrada en 4 pasos para guardar el QR en la galería y pagar desde la banca móvil sin confusiones.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECCIÓN 5: ECOSISTEMA WEB + APP MÓVIL ANDROID (ALTA VENTA) */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#0A192F] to-[#020617] border-2 border-blue-500/50 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Resplandor decorativo */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-3 relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Doble Ecosistema Tecnológico: Web en la Nube + App Móvil Android</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Diseñado Pensando en Nuestras Familias y Adultos Mayores
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sabemos que más del 70% de los vecinos que asisten a las asambleas tienen entre <strong>40 y 60+ años</strong>. Por eso, Xentra no es una aplicación fría ni complicada: se adapta a la vista y necesidades reales de los vecinos de Bolivia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {/* Tarjeta 1: Aplicación Móvil Android (Senior Friendly) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#030712] border-2 border-emerald-500/50 space-y-5 flex flex-col justify-between shadow-xl hover:border-emerald-400 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/25 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center font-bold">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Instalación Directa en Teléfonos</span>
                      <h3 className="text-xl font-black text-white">App Móvil Android (APK / PWA)</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Modo A+ Senior
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Pensada exclusivamente para que cualquier vecino mayor pueda usarla <strong>sin pedir ayuda a sus hijos</strong>:
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Letras Extra Grandes y Alto Contraste:</strong> Botones táctiles grandes para pulsar cómodamente sin equivocarse de opción.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Notificaciones de Asambleas y Pagos:</strong> Suena un timbre claro en el celular avisando la fecha de cobro y asamblea para no olvidar sus cuotas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Reportes Barriales en 2 Toques:</strong> ¿Alguien echado en la cancha? ¿Un perrito atropellado? ¿Fuga de agua o auto sospechoso? Presionas 1 botón y se alerta a la directiva y ronda vecinal.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Botones de Pánico Directos:</strong> Llamada directa sin memorizar números al 110 Policía, 119 Bomberos, 165 SAMU y al celular del Presidente.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInstallModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Descargar e Instalar APK Android en mi Celular</span>
                </button>
              </div>
            </div>

            {/* Tarjeta 2: Plataforma Web en la Nube */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#030712] border-2 border-blue-500/50 space-y-5 flex flex-col justify-between shadow-xl hover:border-blue-400 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/25 border-2 border-blue-500 text-blue-400 flex items-center justify-center font-bold">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Acceso Inmediato desde Navegador</span>
                      <h3 className="text-xl font-black text-white">Plataforma Web en la Nube</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    24/7 En Línea
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  El centro de transparencia donde convergen vecinos y la mesa directiva:
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Consulta Instantánea por Código:</strong> El vecino coloca su código de lote o CI y ve su saldo exacto sin tener que recordar contraseñas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Recaudación QR Simple Interoperable:</strong> El admin sube el QR de su OTB y recibe pagos de Banco Unión, BNB, BCP, Sol, FIE, etc.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Talonario de Recibos Mensuales con QR:</strong> La directiva imprime recibos oficiales con código QR escaneable que certifica la validez legal del pago en línea.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Auditoría TRACE Criptográfica:</strong> Cada movimiento queda registrado en un libro contable con hash inmutable, desterrando para siempre la desconfianza.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector('input[placeholder*="Ingresa tu Código"]');
                    if (el) (el as HTMLElement).focus();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Probar Consulta Web Inmediata con Código de Lote</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-4 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-950">
        <p>© 2026 XENTRA OTB — Plataforma Financiera Comunitaria para Bolivia. Conectada vía Google SMTP seguro.</p>
      </footer>

      {/* MODAL 1: Pagar por QR Simple (Diseño Amigable para Adultos Mayores) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0B132B] border-2 border-emerald-500/60 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative my-auto">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 text-xs font-black border border-emerald-500/40 mb-2">
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Simple • Transferencia Bancaria Segura</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Pagar con QR desde tu Celular
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Sigue estos 4 pasos sencillos para pagar desde cualquier banco de Bolivia:
              </p>
            </div>

            {/* 4 Pasos Didácticos para el Vecino de 40 a 60 años */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#020617] border border-slate-700 space-y-1">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center mx-auto">1</span>
                <span className="font-bold text-slate-200 block">Guarda el QR</span>
                <span className="text-[10px] text-slate-400">Toca el botón verde de abajo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#020617] border border-slate-700 space-y-1">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center mx-auto">2</span>
                <span className="font-bold text-slate-200 block">Abre tu Banco</span>
                <span className="text-[10px] text-slate-400">Unión, Sol, BCP, BNB, etc.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#020617] border border-slate-700 space-y-1">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center mx-auto">3</span>
                <span className="font-bold text-slate-200 block">Carga el QR</span>
                <span className="text-[10px] text-slate-400">Desde tu Galería o Fotos</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#020617] border border-slate-700 space-y-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center mx-auto">4</span>
                <span className="font-bold text-slate-200 block">Sube Voucher</span>
                <span className="text-[10px] text-slate-400">Adjunta la captura aquí</span>
              </div>
            </div>

            {/* Código QR Visual Grande y Nítido */}
            <div className="p-4 bg-[#020617] border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-48 h-48 bg-white rounded-2xl p-3 shadow-lg flex items-center justify-center overflow-hidden">
                {otbPaymentConfig.qrImageUrl ? (
                  <img
                    src={otbPaymentConfig.qrImageUrl}
                    alt="QR Simple de Cobro OTB"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="3" fill="#0F172A" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="#0F172A" />
                    <rect x="70" y="0" width="30" height="30" rx="3" fill="#0F172A" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="#0F172A" />
                    <rect x="0" y="70" width="30" height="30" rx="3" fill="#0F172A" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="#0F172A" />
                    <rect x="36" y="36" width="28" height="28" rx="4" fill="#2563EB" />
                    <circle cx="50" cy="50" r="8" fill="white" />
                    <circle cx="50" cy="50" r="4" fill="#10B981" />
                    <rect x="70" y="70" width="10" height="10" fill="#0F172A" />
                    <rect x="45" y="15" width="8" height="8" fill="#0F172A" />
                    <rect x="15" y="45" width="8" height="8" fill="#0F172A" />
                    <rect x="45" y="75" width="8" height="8" fill="#0F172A" />
                    <rect x="75" y="45" width="8" height="8" fill="#0F172A" />
                  </svg>
                )}
              </div>

              <div>
                <p className="text-base font-black text-white">
                  Monto a Pagar: <span className="text-emerald-400 font-mono">{formatBOB(parseFloat(payAmount) || 50)}</span>
                </p>
                <p className="text-xs text-blue-300 font-bold mt-0.5">
                  {otbPaymentConfig.bankName} • Cta Fiscal: <span className="font-mono text-emerald-300">{otbPaymentConfig.accountNumber}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  Titular: {otbPaymentConfig.accountHolder} ({otbPaymentConfig.nitOrCi})
                </p>
              </div>

              {/* Botones de Guardar QR y Copiar Cuenta */}
              <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQrImage}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Guardar QR en mi Galería</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-blue-300 bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAccount ? '¡Copiado!' : 'Copiar Cta.'}</span>
                </button>
              </div>

              {/* Badges Bancos Bolivianos Admitidos */}
              <div className="pt-2 border-t border-slate-700/80 w-full">
                <span className="text-[10px] text-slate-400 block mb-1.5 font-semibold">
                  Acepta todos los bancos y cooperativas de Bolivia:
                </span>
                <div className="flex flex-wrap justify-center gap-1.5 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700">Banco Unión</span>
                  <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700">BancoSol</span>
                  <span className="px-2 py-0.5 rounded bg-blue-900/60 text-cyan-200 border border-cyan-700">BCP</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700">BNB</span>
                  <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700">Banco FIE</span>
                </div>
              </div>
            </div>

            {/* Formulario de Comprobante con Notificación a Tesorería */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsUploading(true);
                await submitVoucher({
                  otbId: otbPaymentConfig.otbId,
                  neighborName: resolvedResult?.fullName || 'Juan José Flores Morales',
                  neighborSocioCode: resolvedResult?.socioCode || resolvedResult?.code || 'SOC-012',
                  neighborCi: resolvedResult?.ciNumber || '7412589 CBBA',
                  block: resolvedResult?.blockName || 'Manzana A',
                  lot: resolvedResult?.lotName?.split(',')[1]?.trim() || 'Lote 12',
                  amount: parseFloat(payAmount) || 50,
                  concept: resolvedResult?.unsettledConcept || 'Cuota Comunitaria Oficial',
                  method: 'QR',
                  evidenceName: selectedFileName || 'comprobante_banco_union.jpg'
                });
                setIsUploading(false);
                setIsQrModalOpen(false);
                setSelectedFileName(null);
                alert('¡Comprobante enviado a la Tesorería de la OTB! El Tesorero ha recibido la alerta en su panel para verificarlo contra el extracto bancario y emitir tu recibo oficial.');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-200 block mb-1">Monto Depositado (Bs.):</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3.5 py-2.5 font-mono text-white font-bold focus:outline-none focus:border-emerald-400 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Adjuntar Captura o Foto del Voucher:</label>
                <label className="border-2 border-dashed border-slate-500 hover:border-emerald-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#020617]">
                  <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                  <span className="text-xs font-bold text-slate-200">
                    {selectedFileName || 'Seleccionar captura o foto de depósito'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files && setSelectedFileName(e.target.files[0].name)}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-950" />
                <span>{isUploading ? 'Enviando Comprobante...' : 'Enviar Comprobante a Tesorería'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Notificaciones por Correo Google SMTP (ayni protocol) */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B132B] border-2 border-slate-600 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/25 text-blue-300 text-xs font-black border border-blue-500/40 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google SMTP • Notificación Oficial</span>
              </div>
              <h3 className="text-xl font-black text-white">Recibir Recibos por Correo</h3>
              <p className="text-xs text-slate-300 mt-1">
                Registra tu correo electrónico para recibir automáticamente tus recibos digitales oficiales y convocatorias a asambleas emitidas por la OTB.
              </p>
            </div>

            <div className="p-3 bg-[#020617] border-2 border-slate-700 rounded-xl text-xs text-slate-300 space-y-1">
              <p><strong className="text-white">Servidor SMTP:</strong> <code className="text-blue-300">{GOOGLE_SMTP_CONFIG.host} (SSL 465)</code></p>
              <p><strong className="text-white">Remitente Autorizado:</strong> <code className="text-emerald-300 font-bold">{GOOGLE_SMTP_CONFIG.user}</code></p>
            </div>

            <form onSubmit={handleSendEmailNotification} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Tu Correo Electrónico:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={neighborEmail}
                    onChange={(e) => setNeighborEmail(e.target.value)}
                    placeholder="ej. mi.correo@gmail.com"
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingEmail || emailSentSuccess}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {sendingEmail
                    ? 'Despachando vía Google SMTP...'
                    : emailSentSuccess
                    ? '¡Notificación Despachada! ✓'
                    : 'Enviar Recibo y Activar Notificaciones'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Solicitar Nueva OTB */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B132B] border-2 border-slate-600 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black text-white">Solicitud de Incorporación de OTB</h3>
              <p className="text-xs text-slate-300 mt-1">
                Completa los datos de tu comunidad para que el Superadministrador apruebe su alta institucional.
              </p>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Nombre Oficial de la OTB / Barrio:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. OTB San Pedro Central"
                  value={otbName}
                  onChange={(e) => setOtbName(e.target.value)}
                  className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Departamento:</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-400 font-medium cursor-pointer"
                  >
                    {['Cochabamba', 'La Paz', 'Santa Cruz', 'Chuquisaca', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'].map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Municipio:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Cercado"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Zona / Distrito:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Distrito 4 - Zona Noroeste"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Nombre Presidente / Dirigente:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Mario Gutiérrez"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Celular / WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    placeholder="ej. 76543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#020617] border-2 border-slate-500 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 font-mono font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={requestSent}
                className="w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all mt-4 cursor-pointer"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>{requestSent ? 'Enviando Solicitud...' : 'Enviar Solicitud al Superadministrador'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Imprimir Estado de Cuenta / Ficha Oficial Comunitaria */}
      {resolvedResult && (
        <PrintableStatementModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          data={{
            otbName: resolvedResult.otbName,
            otbCode: resolvedResult.otbCode,
            department: resolvedResult.department,
            municipality: resolvedResult.municipality || 'Cercado',
            zone: resolvedResult.zone || 'Distrito 4 - Zona Noroeste',
            socioCode: resolvedResult.socioCode || resolvedResult.code,
            socioName: resolvedResult.fullName || 'Juan José Flores Morales',
            ciNumber: resolvedResult.ciNumber || '7412589 CBBA',
            block: resolvedResult.blockName || 'Manzana A',
            lot: resolvedResult.lotName?.split(',')[1]?.trim() || 'Lote 12',
            phone: resolvedResult.phone || '74567890',
            totalAssigned: resolvedResult.totalAssigned || 125.0,
            totalPaid: resolvedResult.totalPaid || 75.0,
            totalDebt: resolvedResult.totalDebt,
            lastReceiptNumber: resolvedResult.lastReceipt || 'OTB-CBBA-001-2026-00042',
            tokenHash: resolvedResult.tokenHash,
            fees: resolvedResult.feesBreakdown || [
              { period: 'Nov 2026', concept: 'Cuota Ordinaria Noviembre 2026', assigned: 25.0, paid: 25.0, balance: 0.0, status: 'Pagado' },
              { period: 'Nov 2026', concept: 'Aporte Pro-Tinglado (Cuota 1)', assigned: 100.0, paid: 50.0, balance: 50.0, status: 'Pendiente' }
            ]
          }}
        />
      )}

      {/* MODAL 5: Auxilio y Reportes Barriales en Vivo (Seguridad Ciudadana 24/7) */}
      <CommunityAlertsAndEmergencyModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        initialTab={alertModalTab}
        otbId={resolvedResult?.otbCode === 'OTB-LPZ-002' ? '22222222-2222-2222-2222-222222222222' : '11111111-1111-1111-1111-111111111111'}
        otbName={resolvedResult?.otbName || 'Villa Esperanza'}
        socioCode={resolvedResult?.socioCode || resolvedResult?.code || 'SOC-012'}
        neighborName={resolvedResult?.fullName || 'Juan José Flores Morales'}
        lotName={resolvedResult?.lotName || 'Manzana A, Lote 12'}
        phoneContact={resolvedResult?.phone || '74567890'}
      />

      {/* MODAL 6: Descargar e Instalar App Móvil (Android APK / PWA) */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* MODAL 7: Transparencia Financiera & Convocatoria de Asambleas OTB */}
      <CommunityTransparencyModal
        isOpen={isTransparencyModalOpen}
        onClose={() => setIsTransparencyModalOpen(false)}
        otbName={resolvedResult?.otbName || 'Villa Esperanza'}
        otbCode={resolvedResult?.otbCode || 'OTB-CBBA-001'}
      />
    </div>
  );
};
