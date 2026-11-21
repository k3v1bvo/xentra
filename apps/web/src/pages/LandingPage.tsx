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
  Info
} from 'lucide-react';
import { XentraLogo } from '../components/XentraLogo';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { formatBOB, AppRole } from '@xentra/shared';
import { sendNeighborEmailNotification, GOOGLE_SMTP_CONFIG } from '../services/emailNotificationService';

type ResolvedType = 'neighbor' | 'admin' | 'superadmin' | 'not_found';

interface SearchResult {
  type: ResolvedType;
  otbName: string;
  otbCode: string;
  department: string;
  code: string;
  lotName?: string;
  maskedName?: string;
  maskedCi?: string;
  totalDebt: number;
  unsettledConcept?: string;
  role?: string;
  status: 'al_dia' | 'con_deuda' | 'directiva' | 'superadmin';
  lastReceipt?: string;
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setProfile, setCurrentRole } = useAuthStore();
  const { availableOtbs, setCurrentOtb } = useTenantStore();

  // Input de búsqueda
  const [searchInput, setSearchInput] = useState('Lote 12');
  const [resolvedResult, setResolvedResult] = useState<SearchResult | null>({
    type: 'neighbor',
    otbName: 'OTB Villa Esperanza',
    otbCode: 'OTB-CBBA-001',
    department: 'Cochabamba',
    code: 'Lote 12',
    lotName: 'Manzana A, Lote 12',
    maskedName: 'J*** J*** F*** M***',
    maskedCi: '7412*** CBBA',
    totalDebt: 50.00,
    unsettledConcept: 'Aporte Pro-Tinglado (Cuota 1) - Vence 15/11/2026',
    status: 'con_deuda',
    lastReceipt: 'OTB-CBBA-001-2026-00042'
  });

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
    } else if (code.includes('05') || code.includes('5') || code.includes('silvia')) {
      setResolvedResult({
        type: 'neighbor',
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        code: 'Lote 05',
        lotName: 'Manzana B, Lote 05',
        maskedName: 'S*** R*** T***',
        maskedCi: '8521*** CBBA',
        totalDebt: 0,
        status: 'al_dia',
        lastReceipt: 'OTB-CBBA-001-2026-00040'
      });
    } else {
      // Por defecto Lote 12 (Vecino con deuda)
      setResolvedResult({
        type: 'neighbor',
        otbName: 'OTB Villa Esperanza',
        otbCode: 'OTB-CBBA-001',
        department: 'Cochabamba',
        code: 'Lote 12',
        lotName: 'Manzana A, Lote 12',
        maskedName: 'J*** J*** F*** M***',
        maskedCi: '7412*** CBBA',
        totalDebt: 50.00,
        unsettledConcept: 'Aporte Pro-Tinglado (Cuota 1) - Vence 15/11/2026',
        status: 'con_deuda',
        lastReceipt: 'OTB-CBBA-001-2026-00042'
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
    navigator.clipboard.writeText('10000034891230');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-4 sm:px-8 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <XentraLogo size="md" />

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate('/verificar-recibo')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Verificar Recibo QR</span>
            <span className="sm:hidden">Verificar QR</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>
        </div>
      </header>

      {/* Hero Central con Buscador Inteligente por Código */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <span>🇧🇴 Plataforma Financiera Comunitaria para Bolivia</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Consulta tu Estado Comunitario por <span className="text-blue-500">Código de Cliente</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Ingresa tu código de lote o vivienda. El sistema identificará tu OTB y mostrará solo tus obligaciones pendientes, <strong className="text-slate-200">resguardando tu privacidad sin exponer datos sensibles a terceros</strong>.
          </p>
        </div>

        {/* Buscador Interactivo */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchCode();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ingresa tu Código (ej. Lote 12, 7412589, ADM-TES)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex-shrink-0"
            >
              <span>Buscar Estado</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Chips Sugeridos para Prueba Rápida */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Pruebas sugeridas:</span>
            {[
              { label: 'Lote 12 (Vecino con deuda)', val: 'Lote 12' },
              { label: 'Lote 05 (Vecino al día)', val: 'Lote 05' },
              { label: 'ADM-TES (Tesorero OTB)', val: 'ADM-TES' },
              { label: 'ADM-PRES (Presidente OTB)', val: 'ADM-PRES' },
              { label: 'SUPERADMIN (Control)', val: 'SUPERADMIN' }
            ].map((chip) => (
              <button
                key={chip.val}
                type="button"
                onClick={() => {
                  setSearchInput(chip.val);
                  handleSearchCode(chip.val);
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* TARJETA DINÁMICA DE RESULTADO RESOLVIDO */}
        {resolvedResult && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
            {/* Cabecera del Resultado */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                  {resolvedResult.type === 'neighbor' ? (
                    <Home className="w-6 h-6" />
                  ) : resolvedResult.type === 'admin' ? (
                    <Building2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-purple-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">{resolvedResult.otbCode}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs font-bold text-blue-400">{resolvedResult.department}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{resolvedResult.otbName}</h2>
                </div>
              </div>

              {/* Badges de Estado */}
              <div>
                {resolvedResult.status === 'con_deuda' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertCircle className="w-3.5 h-3.5" /> Saldo Pendiente de Pago
                  </span>
                ) : resolvedResult.status === 'al_dia' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Al Día sin Deudas
                  </span>
                ) : resolvedResult.status === 'directiva' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Building2 className="w-3.5 h-3.5" /> Mesa Directiva de la OTB
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Superadministrador Nacional
                  </span>
                )}
              </div>
            </div>

            {/* CASO 1: VECINO */}
            {resolvedResult.type === 'neighbor' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Datos del Inmueble (Protegidos) */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inmueble Censado</span>
                    <p className="text-sm font-bold text-white">{resolvedResult.lotName}</p>
                    <div className="text-xs text-slate-400 space-y-0.5 pt-1">
                      <p>Titular: <span className="font-mono text-slate-300">{resolvedResult.maskedName}</span></p>
                      <p>Cédula: <span className="font-mono text-slate-300">{resolvedResult.maskedCi}</span></p>
                    </div>
                    <p className="text-[10px] text-slate-500 italic pt-1 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Identidad anonimizada por normativa de protección de datos.</span>
                    </p>
                  </div>

                  {/* Estado Financiero */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deuda Total Pendiente</span>
                      <p className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
                        {formatBOB(resolvedResult.totalDebt)}
                      </p>
                    </div>

                    <div className="text-xs">
                      {resolvedResult.totalDebt > 0 ? (
                        <p className="text-amber-400 font-medium">{resolvedResult.unsettledConcept}</p>
                      ) : (
                        <p className="text-emerald-400 font-medium">Todas tus cuotas comunitarias están cubiertas.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {resolvedResult.totalDebt > 0 && (
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-slate-950" />
                      <span>Pagar {formatBOB(resolvedResult.totalDebt)} con QR</span>
                    </button>
                  )}

                  <button
                    onClick={handleEnterNeighborPortal}
                    className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Ver Mi Portal Completo</span>
                  </button>

                  <button
                    onClick={() => setIsEmailModalOpen(true)}
                    className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Recibir Recibo por Correo</span>
                  </button>
                </div>
              </div>
            )}

            {/* CASO 2: ADMIN / DIRECTIVA */}
            {resolvedResult.type === 'admin' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Acceso Autorizado de Directiva</span>
                  <p className="text-sm font-bold text-white">{resolvedResult.role}</p>
                  <p className="text-xs text-slate-400">
                    Has sido reconocido como parte de la mesa directiva de <strong>{resolvedResult.otbName}</strong>. Accede a tu panel para administrar cuotas, registrar cobros, verificar vouchers de vecinos y generar informes de asamblea.
                  </p>
                </div>

                <button
                  onClick={() => handleEnterAdminPanel(resolvedResult.code === 'ADM-PRES' ? 'presidente' : 'tesorero')}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Ingresar al Panel Administrativo de tu OTB →</span>
                </button>
              </div>
            )}

            {/* CASO 3: SUPERADMIN */}
            {resolvedResult.type === 'superadmin' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Privilegios Globales a Nivel de Servidor</span>
                  <p className="text-sm font-bold text-white">{resolvedResult.role}</p>
                  <p className="text-xs text-slate-400">
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
          </div>
        )}

        {/* Sección Informativa: Registrar Nueva OTB */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            ¿Eres dirigente o presidente barrial y tu OTB aún no está en Xentra?
          </p>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1"
          >
            <span>Solicitar Registro de mi OTB al Superadministrador Nacional</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-4 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-950">
        <p>© 2026 XENTRA OTB — Plataforma Financiera Comunitaria para Bolivia. Conectada vía Google SMTP seguro.</p>
      </footer>

      {/* MODAL 1: Pagar por QR Simple */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Simple • Transferencia Bancaria</span>
              </div>
              <h3 className="text-lg font-black text-white">Pagar con Código QR Simple</h3>
              <p className="text-xs text-slate-400 mt-1">
                Transfiere desde cualquier banco de Bolivia (Banco Unión, BCP, BNB, Sol) y adjunta tu comprobante.
              </p>
            </div>

            {/* Código QR Visual */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-44 h-44 bg-white rounded-2xl p-2.5 shadow-sm flex items-center justify-center">
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
                  <rect x="70" y="70" width="10" height="10" fill="#0F172A" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-bold text-white">Monto a abonar: {formatBOB(parseFloat(payAmount) || 50)}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Banco Unión • Cta: 10000034891230</p>
              </div>

              <button
                type="button"
                onClick={handleCopyAccount}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              >
                {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount ? '¡Número de cuenta copiado!' : 'Copiar número de cuenta'}</span>
              </button>
            </div>

            {/* Formulario de Comprobante */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsUploading(true);
                setTimeout(() => {
                  setIsUploading(false);
                  setIsQrModalOpen(false);
                  alert('¡Comprobante enviado con éxito a la Tesorería! Queda registrado en estado "Pendiente de Verificación".');
                }, 1000);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Monto Depositado (Bs.):</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Adjuntar Captura o Foto del Voucher:</label>
                <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-300">
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
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Enviando Comprobante...' : 'Enviar Comprobante a Tesorería'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Notificaciones por Correo Google SMTP (ayni protocol) */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google SMTP • Notificación Oficial</span>
              </div>
              <h3 className="text-lg font-black text-white">Recibir Recibos por Correo</h3>
              <p className="text-xs text-slate-400 mt-1">
                Registra tu correo electrónico para recibir automáticamente tus recibos digitales oficiales y convocatorias a asambleas emitidas por la OTB.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <p><strong>Servidor SMTP:</strong> <code>{GOOGLE_SMTP_CONFIG.host} (SSL 465)</code></p>
              <p><strong>Remitente Autorizado:</strong> <code className="text-blue-400">{GOOGLE_SMTP_CONFIG.user}</code></p>
            </div>

            <form onSubmit={handleSendEmailNotification} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Tu Correo Electrónico:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={neighborEmail}
                    onChange={(e) => setNeighborEmail(e.target.value)}
                    placeholder="ej. mi.correo@gmail.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingEmail || emailSentSuccess}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">Solicitud de Incorporación de OTB</h3>
              <p className="text-xs text-slate-400 mt-1">
                Completa los datos de tu comunidad para que el Superadministrador apruebe su alta institucional.
              </p>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nombre Oficial de la OTB / Barrio:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. OTB San Pedro Central"
                  value={otbName}
                  onChange={(e) => setOtbName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Departamento:</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {['Cochabamba', 'La Paz', 'Santa Cruz', 'Chuquisaca', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Pando'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Municipio:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Cercado"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Zona / Distrito:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Distrito 4 - Zona Noroeste"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Nombre Presidente / Dirigente:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Mario Gutiérrez"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Celular / WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    placeholder="ej. 76543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={requestSent}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all mt-4"
              >
                <Send className="w-4 h-4" />
                <span>{requestSent ? 'Enviando Solicitud...' : 'Enviar Solicitud al Superadministrador'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
