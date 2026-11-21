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
  ShieldCheck
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
  const { config: otbPaymentConfig, submitVoucher } = usePaymentVerificationStore();

  const [fees] = useState<NeighborFee[]>(INITIAL_FEES);
  const [submissions, setSubmissions] = useState<SubmittedPayment[]>(INITIAL_SUBMISSIONS);

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

  return (
    <div className="space-y-6">
      {/* Encabezado Vecino */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-xs font-semibold">
            <Home className="w-3.5 h-3.5" />
            <span>Manzana A, Lote 12 • {currentOtb?.name || 'OTB Villa Esperanza'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Hola, {profile?.first_name || 'Juan'} {profile?.last_name || 'Flores'}
          </h1>
          <p className="text-xs text-blue-200/90 max-w-md">
            Consulta tus cuotas asignadas, realiza tus pagos por QR Simple y descarga tus recibos oficiales con código de verificación.
          </p>
        </div>

        {/* Tarjeta Deuda y Botón de Pago Rápido */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center gap-4 flex-shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-blue-200 block font-medium">Deuda Pendiente</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {formatBOB(totalDebt)}
            </span>
            <span className="block text-[10px] text-amber-300 mt-0.5">
              {totalDebt > 0 ? '1 cuota con saldo pendiente' : '¡Felicidades! Estás al día'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>Pagar con QR</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/30 backdrop-blur-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ficha</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra Rápida de Auxilio, Transparencia y App Móvil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setAlertModalTab('emergencias');
            setIsAlertModalOpen(true);
          }}
          className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 hover:bg-rose-100/80 transition-all flex items-center justify-between text-left group cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <strong className="text-rose-950 font-black text-sm block">🚨 Auxilio & Reportes 24/7</strong>
              <span className="text-rose-700 text-xs">Radio Patrullas 110, SAMU 165 y Alerta</span>
            </div>
          </div>
          <span className="text-xs font-black text-rose-600 group-hover:translate-x-1 transition-transform">Llamar →</span>
        </button>

        <button
          onClick={() => setIsTransparencyModalOpen(true)}
          className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 hover:bg-purple-100/80 transition-all flex items-center justify-between text-left group cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-purple-950 font-black text-sm block">🔍 Transparencia & Asamblea</strong>
              <span className="text-purple-700 text-xs">¿En qué se gastó? y Convocatoria 29 Nov</span>
            </div>
          </div>
          <span className="text-xs font-black text-purple-600 group-hover:translate-x-1 transition-transform">Ver Cuentas →</span>
        </button>

        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100/80 transition-all flex items-center justify-between text-left group cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-emerald-950 font-black text-sm block">📲 Instalar App Android</strong>
              <span className="text-emerald-700 text-xs">Instala el APK para avisos y cuotas</span>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-600 group-hover:translate-x-1 transition-transform">Ver App →</span>
        </button>
      </div>

      {/* Mis Cuotas Asignadas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Mis Cuotas y Obligaciones Comunitarias</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">Total asignado: {formatBOB(totalAssigned)}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fees.map((fee) => (
            <div
              key={fee.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {fee.type}
                </span>
                {fee.isSettled ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pagada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" /> Saldo Pendiente
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{fee.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Vencimiento: {fee.dueDate}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-2 text-xs text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Asignado</span>
                  <strong className="text-slate-800">{formatBOB(fee.amountAssigned)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Abonado</span>
                  <strong className="text-emerald-600">{formatBOB(fee.amountPaid)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Resta</span>
                  <strong className="text-rose-600">{formatBOB(fee.amountAssigned - fee.amountPaid)}</strong>
                </div>
              </div>

              {!fee.isSettled && (
                <button
                  onClick={() => {
                    setPayAmount((fee.amountAssigned - fee.amountPaid).toFixed(2));
                    setIsQrModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Pagar saldo de esta cuota</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Historial de Pagos y Comprobantes Enviados */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Historial de Pagos y Recibos Oficiales</span>
            </h2>
            <p className="text-xs text-slate-500">
              Revisa si tus pagos fueron confirmados por la tesorería o descarga tu recibo con código QR.
            </p>
          </div>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Reportar Nuevo Pago</span>
          </button>
        </div>

        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 hover:bg-white transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    sub.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}
                >
                  {sub.status === 'Confirmed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{sub.concept}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sub.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sub.status === 'Confirmed' ? 'Confirmado ✓' : 'Pendiente de Verificación'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {sub.submittedAt} • Método: {sub.method}
                    {sub.receiptNumber && ` • Recibo: ${sub.receiptNumber}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-sm font-black font-mono text-slate-900">
                  {formatBOB(sub.amount)}
                </span>

                {sub.status === 'Confirmed' && sub.receiptNumber ? (
                  <button
                    onClick={() => navigate(`/verificar-recibo?receipt=${sub.receiptNumber}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    <span>Ver Recibo QR</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-[11px] text-amber-600 font-medium italic">
                    En revisión por Tesorería
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Pagar con Código QR Simple */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Simple • Transferencia Bancaria Directa</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">Pagar Cuotas por Código QR</h3>
              <p className="text-xs text-slate-500 mt-1">
                Escanea el código QR desde cualquier aplicación bancaria de Bolivia (Banco Unión, BCP, BNB, Banco Sol, etc.) y adjunta tu comprobante.
              </p>
            </div>

            {/* Código QR Visual */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
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

              {/* 4 Pasos Didácticos para el Vecino de 40 a 60 años */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] w-full pt-1">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center mx-auto">1</span>
                  <span className="font-bold text-slate-800 block">Guarda el QR</span>
                  <span className="text-[9px] text-slate-500">Toca botón verde</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center mx-auto">2</span>
                  <span className="font-bold text-slate-800 block">Abre tu Banco</span>
                  <span className="text-[9px] text-slate-500">Unión, Sol, BCP</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center mx-auto">3</span>
                  <span className="font-bold text-slate-800 block">Pagar QR</span>
                  <span className="text-[9px] text-slate-500">Cargar de Galería</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center mx-auto">4</span>
                  <span className="font-bold text-slate-800 block">Sube Voucher</span>
                  <span className="text-[9px] text-slate-500">Adjunta captura</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">Monto a pagar: <span className="text-emerald-600 font-mono">{formatBOB(parseFloat(payAmount) || 50)}</span></p>
                <p className="text-xs text-blue-700 font-bold font-mono mt-0.5">
                  {otbPaymentConfig.bankName} • Cta Fiscal: {otbPaymentConfig.accountNumber}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Titular: {otbPaymentConfig.accountHolder} ({otbPaymentConfig.nitOrCi})
                </p>
              </div>

              {/* Botones de Acción QR */}
              <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQrImage}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-black text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Guardar QR en Galería</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAccount ? '¡Copiado!' : 'Copiar Cta.'}</span>
                </button>
              </div>

              {/* Badges Bancos Bolivianos */}
              <div className="pt-2 border-t border-slate-200 w-full text-center">
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">
                  Acepta todos los bancos de Bolivia:
                </span>
                <div className="flex flex-wrap justify-center gap-1 text-[10px] font-bold">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">Banco Unión</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">BancoSol</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">BCP</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">BNB</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">FIE</span>
                </div>
              </div>
            </div>

            {/* Formulario de Confirmación y Subida de Voucher */}
            <form onSubmit={handleSendProof} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Monto Depositado (Bs.):</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Adjuntar Captura o Foto del Depósito:</label>
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30">
                  <Upload className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedFileName ? selectedFileName : 'Toca aquí para seleccionar foto o voucher'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG o PDF hasta 5MB</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                <p className="font-bold">⚠️ Nota de seguridad:</p>
                <p>Tu comprobante será verificado por el Tesorero de la OTB en el extracto bancario. Una vez validado, se emitirá automáticamente tu Recibo Oficial con código QR.</p>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-950" />
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
