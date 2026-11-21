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
  X
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { useNavigate } from 'react-router-dom';

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

  const [fees] = useState<NeighborFee[]>(INITIAL_FEES);
  const [submissions, setSubmissions] = useState<SubmittedPayment[]>(INITIAL_SUBMISSIONS);

  // Modal de Pago por QR
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('50.00');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const totalAssigned = fees.reduce((acc, f) => acc + f.amountAssigned, 0);
  const totalPaid = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalDebt = Math.max(0, totalAssigned - totalPaid);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('10000034891230');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSendProof = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      const newSubmission: SubmittedPayment = {
        id: `sub-${Date.now()}`,
        amount: parseFloat(payAmount) || 50,
        concept: 'Pago reportado por QR Simple',
        method: 'QR',
        submittedAt: new Date().toLocaleString('es-BO'),
        status: 'PendingVerification',
        evidenceName: selectedFileName || 'captura_transferencia_qr.png'
      };

      setSubmissions([newSubmission, ...submissions]);
      setIsUploading(false);
      setIsQrModalOpen(false);
      setSelectedFileName(null);
      alert('¡Comprobante enviado a la Tesorería! Queda en estado "Pendiente de Verificación" hasta que la directiva confirme el ingreso en la cuenta.');
    }, 1000);
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

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-slate-950" />
            <span>Pagar con QR</span>
          </button>
        </div>
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
              <div className="w-48 h-48 bg-white border-2 border-slate-800 rounded-2xl p-2.5 shadow-sm flex items-center justify-center relative">
                {/* Visual SVG QR */}
                <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Patrón simulado de QR de alta resolución */}
                  <rect x="0" y="0" width="30" height="30" rx="3" fill="#0F172A" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="#0F172A" />

                  <rect x="70" y="0" width="30" height="30" rx="3" fill="#0F172A" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="#0F172A" />

                  <rect x="0" y="70" width="30" height="30" rx="3" fill="#0F172A" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="#0F172A" />

                  {/* Datos del QR */}
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
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">Monto a pagar: {formatBOB(parseFloat(payAmount) || 50)}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Banco Unión • Cta: 10000034891230</p>
              </div>

              <button
                type="button"
                onClick={handleCopyAccount}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-100/60 hover:bg-blue-100 transition-colors"
              >
                {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount ? '¡Número de cuenta copiado!' : 'Copiar número de cuenta'}</span>
              </button>
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
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Adjuntar Captura o Foto del Depósito:</label>
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
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
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Enviando a Tesorería...' : 'Enviar Comprobante para Verificación'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
