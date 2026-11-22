import React, { useState } from 'react';
import {
  FileCheck,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Home,
  Download,
  Calendar,
  ExternalLink,
  Upload,
  Copy,
  Clock,
  Check,
  Image as ImageIcon,
  X,
  Printer,
  PhoneCall,
  Smartphone,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Trash2
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { usePaymentVerificationStore } from '../stores/paymentVerificationStore';
import { useNavigate } from 'react-router-dom';
import { PrintableStatementModal } from '../components/PrintableStatementModal';
import { CommunityAlertsAndEmergencyModal } from '../components/CommunityAlertsAndEmergencyModal';
import { CommunityTransparencyModal } from '../components/CommunityTransparencyModal';
import { InstallAppModal } from '../components/InstallAppModal';
import { TiltCard3D } from '../components/TiltCard3D';
import { CommunityInteractiveMap } from '../components/CommunityInteractiveMap';

interface NeighborFee {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  amountAssigned: number;
  amountPaid: number;
  isSettled: boolean;
}

interface SubmittedPayment {
  id: string;
  amount: number;
  concept: string;
  method: 'QR' | 'Transferencia';
  submittedAt: string;
  status: 'PendingVerification' | 'Confirmed';
  receiptNumber?: string;
  evidenceName?: string;
}

const INITIAL_FEES: NeighborFee[] = [
  {
    id: 'f-1',
    title: 'Cuota Ordinaria Noviembre 2026',
    type: 'Ordinaria',
    dueDate: '30/11/2026',
    amountAssigned: 25.00,
    amountPaid: 25.00,
    isSettled: true
  },
  {
    id: 'f-2',
    title: 'Aporte Pro-Tinglado (Cuota 1)',
    type: 'AporteEspecial',
    dueDate: '15/11/2026',
    amountAssigned: 100.00,
    amountPaid: 50.00,
    isSettled: false
  }
];

const INITIAL_SUBMISSIONS: SubmittedPayment[] = [
  {
    id: 'sub-01',
    amount: 50.00,
    concept: 'Aporte Pro-Tinglado (Abono Parcial)',
    method: 'QR',
    submittedAt: '21/11/2026 10:30',
    status: 'Confirmed',
    receiptNumber: 'OTB-CBBA-001-2026-00042',
    evidenceName: 'deposito_banco_union_50bs.jpg'
  }
];

export const NeighborDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { currentOtb } = useTenantStore();
  const { config, getConfigForOtb, submissions: storeSubmissions, submitVoucher, cancelVoucher } = usePaymentVerificationStore();
  const otbPaymentConfig = getConfigForOtb(currentOtb?.id) || config;

  const [fees] = useState<NeighborFee[]>(INITIAL_FEES);

  // Comprobantes de este socio y de su OTB actual en tiempo real
  const userSubmissions = storeSubmissions
    .filter((s) => !s.otbId || s.otbId === currentOtb?.id)
    .filter(
      (s) =>
        s.neighborSocioCode === 'SOC-012' ||
        (profile?.ci_number && s.neighborCi?.includes(profile.ci_number)) ||
        s.neighborName.includes(profile?.first_name || 'Juan José')
    );

  // Modal de Pago por QR
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('50.00');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Modal Imprimir Estado de Cuenta
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Modal Auxilio y Reportes Barriales
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalTab, setAlertModalTab] = useState<'emergencias' | 'reportar' | 'muro'>('emergencias');

  // Modal Instalar App / APK
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Modal Transparencia OTB & Próxima Asamblea
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState(false);

  const totalAssigned = fees.reduce((acc, f) => acc + f.amountAssigned, 0);
  const totalPaid = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalDebt = Math.max(0, totalAssigned - totalPaid);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(otbPaymentConfig.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

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
      link.download = `QR_Pago_Vecino.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      alert('¡Código QR guardado en tu galería! Abre tu aplicación bancaria y paga con la opción "Subir desde Galería".');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSendProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    await submitVoucher({
      otbId: otbPaymentConfig.otbId,
      neighborName: `${profile?.first_name || 'Juan José'} ${profile?.last_name || 'Flores Morales'}`,
      neighborSocioCode: 'SOC-012',
      neighborCi: `${profile?.ci_number || '7412589'} ${profile?.ci_extension || 'CBBA'}`,
      block: 'Manzana A',
      lot: 'Lote 12',
      amount: parseFloat(payAmount) || 50,
      concept: 'Pago reportado por QR Simple',
      method: 'QR',
      evidenceName: selectedFileName || 'captura_transferencia_qr.png'
    });

    setIsUploading(false);
    setIsQrModalOpen(false);
    setSelectedFileName(null);
    alert('¡Comprobante enviado a la Tesorería de la OTB! El Tesorero ha recibido la alerta en su panel para verificarlo contra el extracto bancario.');
  };

  // CRUD Vecino: Cancelar / Eliminar Comprobante Pendiente de Verificación
  const handleCancelSubmission = (submissionId: string) => {
    if (window.confirm('¿Deseas retirar este comprobante enviado? Podrás volver a subir el comprobante correcto de inmediato.')) {
      cancelVoucher(submissionId);
      alert('Comprobante retirado con éxito. Puedes reportar tu pago con la captura correcta.');
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Encabezado Vecino con Máxima Comodidad y Totalmente Responsivo con Tilt 3D */}
      <TiltCard3D intensity={4}>
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-white shadow-2xl backdrop-blur-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            
            {/* Lado Izquierdo: Saludo y Datos de Vivienda */}
            <div className="space-y-4 text-left flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-500/15 text-blue-200 text-xs sm:text-sm font-bold border border-blue-400/30 shadow-sm">
                  <Home className="w-4 h-4 text-blue-300 flex-shrink-0" />
                  <span>Manzana A, Lote 12 • {currentOtb?.name || 'OTB Villa Esperanza'}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Socio Registrado</span>
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                  Hola, {profile?.first_name || 'Juan José'} {profile?.last_name || 'Flores Morales'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
                  Portal oficial y directo de tu OTB: consulta tus aportes comunales, realiza pagos con QR Simple y descarga tus comprobantes certificados.
                </p>
              </div>
            </div>

            {/* Lado Derecho: Estado de Deuda y Acciones Directas */}
            <div className="w-full lg:w-auto lg:min-w-[340px] flex-shrink-0 bg-[#030712] p-5 sm:p-6 rounded-2xl border-2 border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-mono font-bold tracking-wider block">
                    Deuda Pendiente
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 block mt-0.5">
                    {formatBOB(totalDebt)}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                  totalDebt > 0
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span>{totalDebt > 0 ? '1 cuota pendiente' : 'Al Día ✓'}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="w-full h-11 sm:h-12 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-slate-950" />
                  <span>Pagar con QR</span>
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-600 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-blue-300" />
                  <span>Imprimir Ficha</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </TiltCard3D>

      {/* Barra Rápida de Auxilio, Transparencia y App Móvil en 3D */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <TiltCard3D intensity={5}>
          <button
            onClick={() => {
              setAlertModalTab('emergencias');
              setIsAlertModalOpen(true);
            }}
            className="w-full h-full p-4 sm:p-5 rounded-2xl bg-[#0B132B] border-2 border-rose-500/40 hover:border-rose-400 transition-all flex items-center justify-between text-left group cursor-pointer shadow-lg hover:shadow-rose-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-600/20 border border-rose-500/50 text-rose-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                <PhoneCall className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
              <div>
                <strong className="text-white font-bold text-sm sm:text-base block">🚨 Central de Auxilio 24/7</strong>
                <span className="text-rose-200 text-xs font-medium block mt-0.5">Policía 110, SAMU 168 y Alerta Barrial</span>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform whitespace-nowrap pl-2">Llamar →</span>
          </button>
        </TiltCard3D>

        <TiltCard3D intensity={5}>
          <button
            onClick={() => setIsTransparencyModalOpen(true)}
            className="w-full h-full p-4 sm:p-5 rounded-2xl bg-[#0B132B] border-2 border-purple-500/40 hover:border-purple-400 transition-all flex items-center justify-between text-left group cursor-pointer shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/50 text-purple-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <strong className="text-white font-bold text-sm sm:text-base block">🔍 Transparencia & Asamblea</strong>
                <span className="text-purple-200 text-xs font-medium block mt-0.5">Rendición de cuentas y próximas fechas</span>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform whitespace-nowrap pl-2">Ver →</span>
          </button>
        </TiltCard3D>

        <TiltCard3D intensity={5}>
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="w-full h-full p-4 sm:p-5 rounded-2xl bg-[#0B132B] border-2 border-emerald-500/40 hover:border-emerald-400 transition-all flex items-center justify-between text-left group cursor-pointer shadow-lg hover:shadow-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <strong className="text-white font-bold text-sm sm:text-base block">📲 App Móvil Oficial (APK)</strong>
                <span className="text-emerald-200 text-xs font-medium block mt-0.5">Versión 3.0.0 para Xiaomi, Samsung y más</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform whitespace-nowrap pl-2">Descargar →</span>
          </button>
        </TiltCard3D>
      </div>

      {/* Mis Cuotas Asignadas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-blue-400" />
            <span>Mis Cuotas y Obligaciones Comunitarias</span>
          </h2>
          <span className="text-xs sm:text-sm text-slate-300 font-mono">
            Total asignado: <strong className="text-white font-bold">{formatBOB(totalAssigned)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fees.map((fee) => (
            <TiltCard3D
              key={fee.id}
              intensity={4}
              className="p-5 sm:p-6 rounded-3xl bg-[#0B132B] border-2 border-slate-800 hover:border-slate-700 shadow-xl backdrop-blur-xl flex flex-col justify-between h-full space-y-4"
            >
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-800 text-blue-300 border border-slate-700 uppercase tracking-wider">
                    {fee.type === 'AporteEspecial' ? 'Aporte Especial' : 'Cuota Ordinaria'}
                  </span>
                  {fee.isSettled ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Pagada al Día</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span>Saldo Pendiente</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg sm:text-xl leading-snug">{fee.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Vencimiento: {fee.dueDate}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold uppercase">Asignado</span>
                    <strong className="text-white font-bold text-sm sm:text-base block mt-0.5">{formatBOB(fee.amountAssigned)}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold uppercase">Abonado</span>
                    <strong className="text-emerald-400 font-bold text-sm sm:text-base block mt-0.5">{formatBOB(fee.amountPaid)}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold uppercase">Resta</span>
                    <strong className={fee.amountAssigned - fee.amountPaid > 0 ? 'text-amber-400 font-bold text-sm sm:text-base block mt-0.5' : 'text-slate-400 font-bold text-sm sm:text-base block mt-0.5'}>
                      {formatBOB(fee.amountAssigned - fee.amountPaid)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Botón de acción uniforme en ambas tarjetas */}
              <div className="pt-2">
                {!fee.isSettled ? (
                  <button
                    onClick={() => {
                      setPayAmount((fee.amountAssigned - fee.amountPaid).toFixed(2));
                      setIsQrModalOpen(true);
                    }}
                    className="w-full h-11 sm:h-12 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Pagar saldo de esta cuota</span>
                  </button>
                ) : (
                  <div className="w-full h-11 sm:h-12 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Aporte al Día • Recibo Oficial Emitido</span>
                  </div>
                )}
              </div>
            </TiltCard3D>
          ))}
        </div>
      </div>

      {/* Mapa Interactivo de la OTB y Ubicación del Inmueble */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B] border-2 border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Plano Comunal Interactivo & Sede de la OTB</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Ubicación de tu vivienda en el catastro comunal de {currentOtb?.name || 'la OTB'}.
            </p>
          </div>
          <span className="text-xs sm:text-sm text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono font-bold self-start sm:self-auto">
            Manzana A, Lote 12
          </span>
        </div>
        <CommunityInteractiveMap
          centerLat={-17.41325}
          centerLng={-66.16543}
          zoom={16}
          heightClass="h-80 sm:h-[400px]"
          otbName={currentOtb?.name || 'OTB Villa Esperanza'}
          otbId={currentOtb?.id || '11111111-1111-1111-1111-111111111111'}
          selectedLotName="Lote 12"
        />
      </div>

      {/* Historial de Pagos y Comprobantes Enviados (Legibilidad Completa) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B] border-2 border-slate-700 shadow-2xl backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              <span>Historial de Pagos y Recibos Oficiales</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-200 mt-1 leading-relaxed">
              Consulta si tus aportes fueron confirmados por Tesorería o descarga tu comprobante oficial con código QR.
            </p>
          </div>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="self-start sm:self-auto min-h-[56px] px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base flex items-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
          >
            <Upload className="w-5 h-5" />
            <span>Reportar Nuevo Pago</span>
          </button>
        </div>

        <div className="space-y-3.5">
          {userSubmissions.length === 0 ? (
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-700 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-base sm:text-lg text-white">No tienes comprobantes pendientes ni pagos por verificar en esta OTB</p>
              <p className="text-sm sm:text-base text-slate-200 mt-1">Presiona "Reportar Nuevo Pago" si realizaste una transferencia QR.</p>
            </div>
          ) : (
            userSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl border-2 border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#030712] hover:border-slate-500 transition-all shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 ${sub.status === 'Confirmed'
                      ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50'
                      : 'bg-amber-500/20 text-amber-300 border-2 border-amber-500/50'
                      }`}
                  >
                    {sub.status === 'Confirmed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Clock className="w-6 h-6 text-amber-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-lg font-black text-white">{sub.concept}</span>
                      <span
                        className={`text-sm font-black px-3.5 py-1.5 rounded-full border ${sub.status === 'Confirmed'
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60'
                          : 'bg-amber-500/25 text-amber-300 border-amber-500/60'
                          }`}
                      >
                        {sub.status === 'Confirmed' ? 'Confirmado ✓' : 'Pendiente de Verificación'}
                      </span>
                    </div>

                    <p className="text-sm text-slate-200 mt-1.5 font-mono">
                      {sub.submittedAt} • Método: {sub.method}
                      {sub.officialReceiptNumber && ` • N° Recibo: ${sub.officialReceiptNumber}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <span className="text-xl sm:text-2xl font-black font-mono text-white">
                    {formatBOB(sub.amount)}
                  </span>

                  {sub.status === 'Confirmed' && sub.officialReceiptNumber ? (
                    <button
                      onClick={() =>
                        navigate(
                          `/verificar-recibo?token=${sub.traceToken || ''}&receipt=${sub.officialReceiptNumber}`
                        )
                      }
                      className="min-h-[54px] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-base font-black text-blue-200 bg-blue-950 hover:bg-blue-900 border-2 border-blue-500/50 transition-colors cursor-pointer whitespace-nowrap shadow-md"
                    >
                      <span>Ver Recibo QR</span>
                      <ExternalLink className="w-5 h-5 text-blue-300" />
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
                      <span className="text-sm text-amber-300 font-bold italic">
                        En revisión por Tesorería
                      </span>
                      <button
                        onClick={() => handleCancelSubmission(sub.id)}
                        className="min-h-[48px] px-4 py-2 rounded-xl text-sm font-black text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 transition-colors cursor-pointer flex items-center gap-2"
                        title="Retirar o anular este comprobante subido por error"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Cancelar Envío</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: Pagar con Código QR Simple (Dark Fintech Harmonized) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B132B] text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto border-2 border-slate-700">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm font-black mb-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>QR Simple • Transferencia Bancaria Directa</span>
              </div>
              <h3 className="text-2xl font-black text-white">Pagar Cuotas por Código QR</h3>
              <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">
                Escanea el código QR desde cualquier aplicación bancaria de Bolivia (Banco Unión, BCP, BNB, BancoSol, etc.) y adjunta tu comprobante.
              </p>
            </div>

            {/* Código QR Visual */}
            <div className="p-4 bg-[#030712] border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-48 h-48 bg-white border-2 border-slate-800 rounded-2xl p-2.5 shadow-sm flex items-center justify-center relative overflow-hidden">
                {otbPaymentConfig.qrImageUrl ? (
                  <img
                    src={otbPaymentConfig.qrImageUrl}
                    alt="QR Simple OTB"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="3" fill="#0F172A" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="#0F172A" />

                    <rect x="70" y="0" width="30" height="30" rx="3" fill="#0F172A" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="#0F172A" />

                    <rect x="0" y="70" width="30" height="30" rx="3" fill="#0F172A" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="#0F172A" />

                    <rect x="36" y="5" width="8" height="8" fill="#2563EB" />
                    <rect x="48" y="5" width="8" height="8" fill="#0F172A" />
                    <rect x="36" y="18" width="8" height="8" fill="#0F172A" />
                    <rect x="48" y="18" width="8" height="8" fill="#2563EB" />

                    <rect x="5" y="36" width="8" height="8" fill="#0F172A" />
                    <rect x="18" y="36" width="8" height="8" fill="#2563EB" />
                    <rect x="5" y="48" width="8" height="8" fill="#2563EB" />
                    <rect x="18" y="48" width="8" height="8" fill="#0F172A" />

                    <rect x="36" y="36" width="28" height="28" rx="4" fill="#2563EB" />
                    <circle cx="50" cy="50" r="8" fill="white" />
                    <circle cx="50" cy="50" r="4" fill="#10B981" />

                    <rect x="70" y="36" width="8" height="8" fill="#0F172A" />
                    <rect x="82" y="36" width="8" height="8" fill="#2563EB" />
                    <rect x="70" y="48" width="8" height="8" fill="#2563EB" />
                    <rect x="82" y="48" width="8" height="8" fill="#0F172A" />

                    <rect x="36" y="70" width="8" height="8" fill="#0F172A" />
                    <rect x="48" y="70" width="8" height="8" fill="#2563EB" />
                    <rect x="36" y="82" width="8" height="8" fill="#2563EB" />
                    <rect x="48" y="82" width="8" height="8" fill="#0F172A" />

                    <rect x="70" y="70" width="8" height="8" fill="#0F172A" />
                    <rect x="82" y="70" width="8" height="8" fill="#0F172A" />
                    <rect x="70" y="82" width="8" height="8" fill="#2563EB" />
                    <rect x="82" y="82" width="8" height="8" fill="#0F172A" />
                  </svg>
                )}
              </div>

              {/* 4 Pasos Didácticos para Adultos Mayores (Senior Friendly ≥ 16-18px) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center w-full pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 space-y-1">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-sm">1</span>
                  <span className="font-extrabold text-white text-sm sm:text-base block">Guarda el QR</span>
                  <span className="text-sm text-slate-200 block font-medium">Toca botón verde</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 space-y-1">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-sm">2</span>
                  <span className="font-extrabold text-white text-sm sm:text-base block">Abre tu Banco</span>
                  <span className="text-sm text-slate-200 block font-medium">Unión, Sol, BCP</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 space-y-1">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-sm">3</span>
                  <span className="font-extrabold text-white text-sm sm:text-base block">Pagar QR</span>
                  <span className="text-sm text-slate-200 block font-medium">Cargar de Galería</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 space-y-1">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto shadow-sm">4</span>
                  <span className="font-extrabold text-white text-sm sm:text-base block">Sube Voucher</span>
                  <span className="text-sm text-slate-200 block font-medium">Adjunta captura</span>
                </div>
              </div>

              <div>
                <p className="text-base sm:text-xl font-black text-white">Monto a pagar: <span className="text-emerald-400 font-mono text-xl sm:text-3xl">{formatBOB(parseFloat(payAmount) || 50)}</span></p>
                <p className="text-base text-blue-200 font-bold font-mono mt-1">
                  {otbPaymentConfig.bankName} • Cta Fiscal: {otbPaymentConfig.accountNumber}
                </p>
                <p className="text-sm sm:text-base text-slate-200 mt-1">
                  Titular: {otbPaymentConfig.accountHolder} ({otbPaymentConfig.nitOrCi})
                </p>
              </div>

              {/* Botones de Acción QR (Target Size ≥ 56px WCAG AAA) */}
              <div className="flex flex-col sm:flex-row gap-3 w-full pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQrImage}
                  className="flex-1 min-h-[58px] py-4 px-4 rounded-2xl text-base sm:text-lg font-black text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5 text-slate-950" />
                  <span>Guardar QR en Galería</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="min-h-[58px] py-4 px-5 rounded-2xl text-base sm:text-lg font-bold text-white bg-slate-800 border-2 border-slate-600 hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedAccount ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  <span>{copiedAccount ? '¡Copiado!' : 'Copiar Cta.'}</span>
                </button>
              </div>

              {/* Badges Bancos Bolivianos */}
              <div className="pt-2 border-t border-slate-800 w-full text-center">
                <span className="text-sm text-slate-200 block mb-2 font-bold">
                  Acepta todos los bancos de Bolivia con QR Simple:
                </span>
                <div className="flex flex-wrap justify-center gap-2 text-sm font-black">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-600">Banco Unión</span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-600">BancoSol</span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-600">BCP</span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-600">BNB</span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-600">FIE</span>
                </div>
              </div>
            </div>

            {/* Formulario de Confirmación y Subida de Voucher */}
            <form onSubmit={handleSendProof} className="space-y-4 text-base">
              <div>
                <label className="font-black text-white block mb-1.5 text-base sm:text-lg">Monto Depositado (Bs.):</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full min-h-[56px] bg-[#030712] border-2 border-slate-600 rounded-2xl px-4 py-3 font-mono text-white font-bold focus:outline-none focus:border-emerald-400 text-lg sm:text-xl"
                />
              </div>

              <div>
                <label className="font-black text-white block mb-1.5 text-base sm:text-lg">Adjuntar Captura o Foto del Depósito:</label>
                <label className="min-h-[72px] border-2 border-dashed border-slate-600 hover:border-emerald-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#030712] hover:bg-emerald-950/20">
                  <Upload className="w-8 h-8 text-emerald-400 mb-1.5" />
                  <span className="text-base font-bold text-white text-center">
                    {selectedFileName ? selectedFileName : 'Toca aquí para seleccionar foto o voucher'}
                  </span>
                  <span className="text-sm text-slate-200 mt-1">JPG, PNG o PDF hasta 5MB</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 text-sm sm:text-base text-amber-100 space-y-1">
                <p className="font-black text-white text-base">⚠️ Nota de seguridad:</p>
                <p>Tu comprobante será verificado por el Tesorero de la OTB en el extracto bancario. Una vez validado, se emitirá automáticamente tu Recibo Oficial con código QR.</p>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full min-h-[60px] py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5 text-slate-950" />
                <span>{isUploading ? 'Enviando a Tesorería...' : 'Enviar Comprobante para Verificación'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Imprimible de Estado de Cuenta */}
      <PrintableStatementModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        data={{
          otbName: currentOtb?.name || 'OTB Villa Esperanza',
          otbCode: currentOtb?.code || 'OTB-CBBA-001',
          department: currentOtb?.department || 'Cochabamba',
          municipality: currentOtb?.municipality || 'Cercado',
          zone: currentOtb?.zone || 'Distrito 4 - Zona Noroeste',
          socioCode: 'SOC-012',
          socioName: `${profile?.first_name || 'Juan José'} ${profile?.last_name || 'Flores Morales'}`,
          ciNumber: `${profile?.ci_number || '7412589'} ${profile?.ci_extension || 'CBBA'}`,
          block: 'Manzana A',
          lot: 'Lote 12',
          phone: profile?.phone || '74567890',
          totalAssigned,
          totalPaid,
          totalDebt,
          lastReceiptNumber: 'OTB-CBBA-001-2026-00042',
          tokenHash: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4',
          fees: fees.map((f) => ({
            period: 'Nov 2026',
            concept: f.title,
            assigned: f.amountAssigned,
            paid: f.amountPaid,
            balance: Math.max(0, f.amountAssigned - f.amountPaid),
            status: f.isSettled ? 'Pagado' : 'Pendiente'
          }))
        }}
      />

      {/* Modal Auxilio y Reportes Barriales */}
      <CommunityAlertsAndEmergencyModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        initialTab={alertModalTab}
        otbId={currentOtb?.id || '11111111-1111-1111-1111-111111111111'}
        otbName={currentOtb?.name || 'OTB Villa Esperanza'}
        socioCode="SOC-012"
        neighborName={`${profile?.first_name || 'Juan José'} ${profile?.last_name || 'Flores Morales'}`}
        lotName="Manzana A, Lote 12"
        phoneContact={profile?.phone || '74567890'}
      />

      {/* Modal Descargar e Instalar App Móvil */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Modal Transparencia OTB & Próxima Asamblea */}
      <CommunityTransparencyModal
        isOpen={isTransparencyModalOpen}
        onClose={() => setIsTransparencyModalOpen(false)}
        otbName={currentOtb?.name || 'OTB Villa Esperanza'}
        otbCode={currentOtb?.code || 'OTB-CBBA-001'}
      />
    </div>
  );
};
