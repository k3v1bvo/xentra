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
  MapPin
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
    <div className="space-y-6 text-white">
      {/* Encabezado Vecino con 3D Depth */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-blue-500/40 text-white shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Home className="w-3.5 h-3.5" />
            <span>Manzana A, Lote 12 • {currentOtb?.name || 'OTB Villa Esperanza'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hola, {profile?.first_name || 'Juan'} {profile?.last_name || 'Flores'}
          </h1>
          <p className="text-xs text-slate-300 max-w-md font-medium leading-relaxed">
            Consulta tus cuotas asignadas, realiza tus pagos por QR Simple y descarga tus recibos oficiales con código de verificación.
          </p>
        </div>

        {/* Tarjeta Deuda y Botón de Pago Rápido */}
        <div className="bg-[#030712] p-5 rounded-2xl border-2 border-slate-700 flex flex-col sm:flex-row sm:items-center gap-4 flex-shrink-0 shadow-xl">
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Deuda Pendiente</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {formatBOB(totalDebt)}
            </span>
            <span className="block text-[11px] font-bold text-amber-400 mt-0.5">
              {totalDebt > 0 ? '1 cuota con saldo pendiente' : '¡Felicidades! Estás al día'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>Pagar con QR</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-600 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
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
          className="p-4 rounded-2xl bg-[#0F172A] border-2 border-rose-500/40 hover:border-rose-400 transition-all flex items-center justify-between text-left group cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-500/50 text-rose-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <strong className="text-white font-black text-sm block">🚨 Auxilio & Reportes 24/7</strong>
              <span className="text-rose-300 text-xs font-semibold">Radio Patrullas 110, SAMU 165 y Alerta</span>
            </div>
          </div>
          <span className="text-xs font-black text-rose-400 group-hover:translate-x-1 transition-transform">Llamar →</span>
        </button>

        <button
          onClick={() => setIsTransparencyModalOpen(true)}
          className="p-4 rounded-2xl bg-[#0F172A] border-2 border-purple-500/40 hover:border-purple-400 transition-all flex items-center justify-between text-left group cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-white font-black text-sm block">🔍 Transparencia & Asamblea</strong>
              <span className="text-purple-300 text-xs font-semibold">¿En qué se gastó? y Asamblea 29 Nov</span>
            </div>
          </div>
          <span className="text-xs font-black text-purple-400 group-hover:translate-x-1 transition-transform">Ver Cuentas →</span>
        </button>

        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="p-4 rounded-2xl bg-[#0F172A] border-2 border-emerald-500/40 hover:border-emerald-400 transition-all flex items-center justify-between text-left group cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white font-black text-sm block">📲 Instalar App Android</strong>
              <span className="text-emerald-300 text-xs font-semibold">Instala el APK para avisos y cuotas</span>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-400 group-hover:translate-x-1 transition-transform">Ver App →</span>
        </button>
      </div>

      {/* Mis Cuotas Asignadas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-400" />
            <span>Mis Cuotas y Obligaciones Comunitarias</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono font-bold">Total asignado: {formatBOB(totalAssigned)}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fees.map((fee) => (
            <TiltCard3D
              key={fee.id}
              intensity={5}
              className="p-5 rounded-2xl bg-[#0B132B]/90 border-2 border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 uppercase">
                  {fee.type}
                </span>
                {fee.isSettled ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pagada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Saldo Pendiente
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base">{fee.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Vencimiento: {fee.dueDate}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-700 grid grid-cols-3 gap-2 text-xs text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Asignado</span>
                  <strong className="text-slate-200 font-black">{formatBOB(fee.amountAssigned)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Abonado</span>
                  <strong className="text-emerald-400 font-black">{formatBOB(fee.amountPaid)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Resta</span>
                  <strong className="text-rose-400 font-black">{formatBOB(fee.amountAssigned - fee.amountPaid)}</strong>
                </div>
              </div>

              {!fee.isSettled && (
                <button
                  onClick={() => {
                    setPayAmount((fee.amountAssigned - fee.amountPaid).toFixed(2));
                    setIsQrModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pagar saldo de esta cuota</span>
                </button>
              )}
            </TiltCard3D>
          ))}
        </div>
      </div>

      {/* Mapa Interactivo de la OTB y Ubicación del Inmueble */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Plano Comunal Interactivo & Sede de la OTB</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono font-bold">Manzana A, Lote 12</span>
        </div>
        <CommunityInteractiveMap
          centerLat={-17.41325}
          centerLng={-66.16543}
          zoom={16}
          heightClass="h-56 sm:h-64"
          otbName={currentOtb?.name || 'OTB Villa Esperanza'}
          selectedLotName="Lote 12"
        />
      </div>

      {/* Historial de Pagos y Comprobantes Enviados */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Historial de Pagos y Recibos Oficiales</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Revisa si tus pagos fueron confirmados por la tesorería o descarga tu recibo con código QR.
            </p>
          </div>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Reportar Nuevo Pago</span>
          </button>
        </div>

        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl border-2 border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#030712] hover:border-slate-500 transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                    sub.status === 'Confirmed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {sub.status === 'Confirmed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{sub.concept}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        sub.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {sub.status === 'Confirmed' ? 'Confirmado ✓' : 'Pendiente de Verificación'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {sub.submittedAt} • Método: {sub.method}
                    {sub.receiptNumber && ` • Recibo: ${sub.receiptNumber}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-sm font-black font-mono text-white">
                  {formatBOB(sub.amount)}
                </span>

                {sub.status === 'Confirmed' && sub.receiptNumber ? (
                  <button
                    onClick={() => navigate(`/verificar-recibo?receipt=${sub.receiptNumber}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 transition-colors cursor-pointer"
                  >
                    <span>Ver Recibo QR</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-[11px] text-amber-400 font-medium italic">
                    En revisión por Tesorería
                  </span>
                )}
              </div>
            </div>
          ))}
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>QR Simple • Transferencia Bancaria Directa</span>
              </div>
              <h3 className="text-xl font-black text-white">Pagar Cuotas por Código QR</h3>
              <p className="text-xs text-slate-300 mt-1">
                Escanea el código QR desde cualquier aplicación bancaria de Bolivia (Banco Unión, BCP, BNB, Banco Sol, etc.) y adjunta tu comprobante.
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

              {/* 4 Pasos Didácticos para el Vecino de 40 a 60 años */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] w-full pt-1">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 space-y-0.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center mx-auto">1</span>
                  <span className="font-bold text-white block">Guarda el QR</span>
                  <span className="text-[9px] text-slate-400">Toca botón verde</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 space-y-0.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center mx-auto">2</span>
                  <span className="font-bold text-white block">Abre tu Banco</span>
                  <span className="text-[9px] text-slate-400">Unión, Sol, BCP</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 space-y-0.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center mx-auto">3</span>
                  <span className="font-bold text-white block">Pagar QR</span>
                  <span className="text-[9px] text-slate-400">Cargar de Galería</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 space-y-0.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center mx-auto">4</span>
                  <span className="font-bold text-white block">Sube Voucher</span>
                  <span className="text-[9px] text-slate-400">Adjunta captura</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-black text-white">Monto a pagar: <span className="text-emerald-400 font-mono">{formatBOB(parseFloat(payAmount) || 50)}</span></p>
                <p className="text-xs text-blue-400 font-bold font-mono mt-0.5">
                  {otbPaymentConfig.bankName} • Cta Fiscal: {otbPaymentConfig.accountNumber}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Titular: {otbPaymentConfig.accountHolder} ({otbPaymentConfig.nitOrCi})
                </p>
              </div>

              {/* Botones de Acción QR */}
              <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQrImage}
                  className="flex-1 py-3 px-3 rounded-xl text-xs font-black text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Guardar QR en Galería</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAccount ? '¡Copiado!' : 'Copiar Cta.'}</span>
                </button>
              </div>

              {/* Badges Bancos Bolivianos */}
              <div className="pt-2 border-t border-slate-800 w-full text-center">
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">
                  Acepta todos los bancos de Bolivia:
                </span>
                <div className="flex flex-wrap justify-center gap-1 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Banco Unión</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">BancoSol</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">BCP</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">BNB</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">FIE</span>
                </div>
              </div>
            </div>

            {/* Formulario de Confirmación y Subida de Voucher */}
            <form onSubmit={handleSendProof} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Monto Depositado (Bs.):</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-[#030712] border-2 border-slate-700 rounded-xl px-3 py-2.5 font-mono text-white font-bold focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Adjuntar Captura o Foto del Depósito:</label>
                <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#030712] hover:bg-emerald-950/20">
                  <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-200">
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

              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-[11px] text-amber-200">
                <p className="font-bold">⚠️ Nota de seguridad:</p>
                <p>Tu comprobante será verificado por el Tesorero de la OTB en el extracto bancario. Una vez validado, se emitirá automáticamente tu Recibo Oficial con código QR.</p>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
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
