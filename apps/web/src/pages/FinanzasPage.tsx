import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  QrCode,
  CheckCircle2,
  Receipt,
  Download,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Banknote,
  Calendar,
  Building,
  Printer,
  Upload,
  Check,
  X,
  Eye,
  ShieldCheck,
  AlertCircle,
  Copy,
  Settings,
  Sparkles,
  Search
} from 'lucide-react';
import { formatBOB, generateSecureReceiptToken, PaymentMethod } from '@xentra/shared';
import { useTenantStore } from '../stores/tenantStore';
import { useNotificationStore } from '../stores/notificationStore';
import {
  usePaymentVerificationStore,
  PaymentSubmission,
  OtbPaymentConfig
} from '../stores/paymentVerificationStore';
import { OfficialMonthlyReceiptsPrintModal } from '../components/OfficialMonthlyReceiptsPrintModal';
import { useNavigate } from 'react-router-dom';

interface PaymentMock {
  id: string;
  receiptNumber: string;
  neighborName: string;
  amount: number;
  method: PaymentMethod;
  concept: string;
  date: string;
  status: 'Confirmed' | 'PendingVerification' | 'Reversed';
  token: string;
}

const INITIAL_PAYMENTS: PaymentMock[] = [
  {
    id: 'pay-1',
    receiptNumber: 'OTB-CBBA-001-2026-00042',
    neighborName: 'Juan José Flores Morales',
    amount: 50.0,
    method: 'QR',
    concept: 'Aporte Pro-Tinglado Cuota 1 (Abono Parcial)',
    date: '2026-11-21 10:30',
    status: 'Confirmed',
    token: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4'
  },
  {
    id: 'pay-2',
    receiptNumber: 'OTB-CBBA-001-2026-00041',
    neighborName: 'Marina Condori Rocha',
    amount: 25.0,
    method: 'Efectivo',
    concept: 'Cuota Ordinaria Noviembre 2026',
    date: '2026-11-20 16:15',
    status: 'Confirmed',
    token: 'b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678'
  },
  {
    id: 'pay-3',
    receiptNumber: 'OTB-CBBA-001-2026-00040',
    neighborName: 'Silvia Rojas Torrico',
    amount: 100.0,
    method: 'Transferencia',
    concept: 'Aporte Pro-Tinglado Cuota 1',
    date: '2026-11-19 14:00',
    status: 'PendingVerification',
    token: 'c9203b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789'
  }
];

export const FinanzasPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentOtb } = useTenantStore();
  const { addNotification } = useNotificationStore();
  const {
    config: otbPaymentConfig,
    submissions,
    updateConfig: updateOtbPaymentConfig,
    approveVoucher,
    rejectVoucher,
    getPendingCount
  } = usePaymentVerificationStore();

  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [activeTab, setActiveTab] = useState<
    'pagos' | 'verificaciones' | 'config_qr' | 'cuotas' | 'arqueo'
  >('verificaciones');

  // Modal Cobro Manual
  const [showPayModal, setShowPayModal] = useState(false);
  const [neighborName, setNeighborName] = useState('Juan José Flores Morales');
  const [payAmount, setPayAmount] = useState('50.00');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Efectivo');
  const [payConcept, setPayConcept] = useState('Cuota Ordinaria Noviembre 2026');

  // Recibo recién emitido
  const [generatedReceipt, setGeneratedReceipt] = useState<PaymentMock | null>(null);

  // Modal de Impresión de Recibos Mensuales con QR Personalizado
  const [isPrintReceiptsOpen, setIsPrintReceiptsOpen] = useState(false);

  // Modal de Inspección de Voucher
  const [inspectingVoucher, setInspectingVoucher] = useState<PaymentSubmission | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Formulario de Configuración QR de la OTB
  const [formBank, setFormBank] = useState(otbPaymentConfig.bankName);
  const [formAccountType, setFormAccountType] = useState(otbPaymentConfig.accountType);
  const [formAccountNumber, setFormAccountNumber] = useState(otbPaymentConfig.accountNumber);
  const [formAccountHolder, setFormAccountHolder] = useState(otbPaymentConfig.accountHolder);
  const [formNitOrCi, setFormNitOrCi] = useState(otbPaymentConfig.nitOrCi);
  const [formWhatsapp, setFormWhatsapp] = useState(otbPaymentConfig.whatsappContact);
  const [formInstructions, setFormInstructions] = useState(otbPaymentConfig.instructions);
  const [qrFilePreview, setQrFilePreview] = useState<string>(otbPaymentConfig.qrImageUrl || '');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  const pendingCount = getPendingCount();

  // Subir imagen del QR de la OTB
  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQrFilePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar Configuración de Cobro OTB
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateOtbPaymentConfig({
      bankName: formBank,
      accountType: formAccountType,
      accountNumber: formAccountNumber,
      accountHolder: formAccountHolder,
      nitOrCi: formNitOrCi,
      whatsappContact: formWhatsapp,
      instructions: formInstructions,
      qrImageUrl: qrFilePreview,
      updatedBy: 'Directiva OTB'
    });

    setConfigSavedNotice(true);
    setTimeout(() => setConfigSavedNotice(false), 3000);
    alert('¡Configuración de QR y Datos Bancarios actualizada! Ahora todos los vecinos que paguen por QR verán estos nuevos datos e imagen.');
  };

  // Aprobar Comprobante Manualmente
  const handleApprove = async (submissionId: string) => {
    const approved = await approveVoucher(submissionId, 'Tesorero OTB');
    if (approved) {
      // También agregarlo al historial de pagos
      const newPay: PaymentMock = {
        id: approved.id,
        receiptNumber: approved.officialReceiptNumber || 'OTB-CBBA-001-2026-00043',
        neighborName: approved.neighborName,
        amount: approved.amount,
        method: approved.method,
        concept: approved.concept,
        date: approved.verifiedAt || new Date().toLocaleString('es-BO'),
        status: 'Confirmed',
        token: approved.traceToken || generateSecureReceiptToken()
      };
      setPayments([newPay, ...payments]);
      setInspectingVoucher(null);
      alert(`¡Comprobante verificado con éxito! Se emitió el Recibo Oficial N° ${newPay.receiptNumber} sellado con token TRACE.`);
    }
  };

  // Rechazar Comprobante
  const handleReject = async (submissionId: string) => {
    if (!rejectionReasonInput.trim()) {
      alert('Por favor ingresa un motivo para el rechazo (ej. El depósito no figura en el extracto bancario).');
      return;
    }
    await rejectVoucher(submissionId, rejectionReasonInput, 'Tesorero OTB');
    setInspectingVoucher(null);
    setShowRejectForm(false);
    setRejectionReasonInput('');
    alert('Comprobante marcado como Rechazado. Se envió la notificación correspondiente al socio.');
  };

  // Cobranza manual en ventanilla
  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const token = generateSecureReceiptToken();
    const nextSeq = payments.length + 43;
    const receiptNum = `${currentOtb?.code || 'OTB'}-2026-${String(nextSeq).padStart(5, '0')}`;

    const newPayment: PaymentMock = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      neighborName,
      amount: amountNum,
      method: payMethod,
      concept: payConcept,
      date: new Date().toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' }),
      status: payMethod === 'Transferencia' ? 'PendingVerification' : 'Confirmed',
      token
    };

    setPayments([newPayment, ...payments]);
    setShowPayModal(false);
    setGeneratedReceipt(newPayment);

    addNotification({
      id: `notif-${Date.now()}`,
      recipient_user_id: 'user-neighbor',
      otb_id: currentOtb?.id || '',
      type: 'PAYMENT_CONFIRMED',
      category: 'Pagos',
      title: 'Pago Confirmado con Recibo QR',
      body: `Se emitió el recibo ${receiptNum} por ${formatBOB(amountNum)} a nombre de ${neighborName}.`,
      priority: 'normal',
      action_route: `/verificar-recibo?token=${token}&receipt=${receiptNum}`,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider mb-1">
            <Building className="w-3 h-3" />
            <span>Mesa Directiva & Tesorería Comunal</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Tesorería & Verificación de Pagos QR
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Carga el QR bancario de tu OTB, verifica comprobantes de vecinos manualmente y emite recibos con QR personalizado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Imprimir Recibos Mensuales con QR */}
          <button
            onClick={() => setIsPrintReceiptsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Imprimir Recibos con QR</span>
          </button>

          {/* Botón Registrar Cobro Directo */}
          <button
            onClick={() => setShowPayModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Cobranza Manual</span>
          </button>
        </div>
      </div>

      {/* Tabs con scroll horizontal en móvil */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto whitespace-nowrap pb-1">
        <button
          onClick={() => setActiveTab('verificaciones')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'verificaciones'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Verificaciones Pendientes</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('config_qr')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'config_qr'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configurar QR & Banco OTB</span>
        </button>

        <button
          onClick={() => setActiveTab('pagos')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'pagos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Historial de Recibos Emitidos
        </button>

        <button
          onClick={() => setActiveTab('cuotas')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'cuotas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Tarifario de Cuotas
        </button>

        <button
          onClick={() => setActiveTab('arqueo')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'arqueo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Arqueo de Caja Central
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: VERIFICACIONES MANUALES DE COMPROBANTES QR       */}
      {/* ======================================================== */}
      {activeTab === 'verificaciones' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-950">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-sm">
                  Flujo de Verificación Manual de Tesorería
                </strong>
                <span className="text-blue-800 text-xs">
                  Los vecinos transfieren por QR Simple y suben su comprobante. El Tesorero revisa el extracto de{' '}
                  <strong>{otbPaymentConfig.bankName}</strong> y aprueba manualmente con un clic para emitir el recibo TRACE inmutable.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-white font-mono font-bold text-blue-700 shadow-sm border border-blue-200 self-start sm:self-auto">
              {pendingCount} comprobante(s) por revisar
            </span>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-fintech overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Fecha / Hora</th>
                    <th className="px-5 py-3.5 font-bold">Socio / Lote</th>
                    <th className="px-5 py-3.5 font-bold">Concepto</th>
                    <th className="px-5 py-3.5 font-bold">Comprobante Adjunto</th>
                    <th className="px-5 py-3.5 font-bold text-right">Monto (BOB)</th>
                    <th className="px-5 py-3.5 font-bold">Estado</th>
                    <th className="px-5 py-3.5 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                        {sub.submittedAt}
                      </td>
                      <td className="px-5 py-3.5">
                        <strong className="text-slate-900 block">{sub.neighborName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {sub.neighborSocioCode} • {sub.block}, {sub.lot}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">{sub.concept}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setInspectingVoucher(sub)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{sub.evidenceName}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-black text-slate-900 text-sm">
                        {formatBOB(sub.amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        {sub.status === 'PendingVerification' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                            Por Verificar
                          </span>
                        )}
                        {sub.status === 'Confirmed' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Aprobado ✓
                          </span>
                        )}
                        {sub.status === 'Rejected' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                            Rechazado ✕
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {sub.status === 'PendingVerification' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleApprove(sub.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer flex items-center gap-1"
                              title="Confirmar ingreso en extracto y emitir recibo TRACE"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aprobar</span>
                            </button>
                            <button
                              onClick={() => {
                                setInspectingVoucher(sub);
                                setShowRejectForm(true);
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                              title="Rechazar comprobante observado"
                            >
                              Rechazar
                            </button>
                          </div>
                        ) : sub.status === 'Confirmed' ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/verificar-recibo?token=${sub.traceToken}&receipt=${sub.officialReceiptNumber}`
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Ver Recibo</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Observado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CONFIGURACIÓN DEL QR Y BANCO DE LA OTB           */}
      {/* ======================================================== */}
      {activeTab === 'config_qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de Configuración */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-fintech space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black border border-blue-200 mb-2">
                <Settings className="w-3.5 h-3.5" />
                <span>Gestión de Recaudación Bancaria Oficial</span>
              </div>
              <h2 className="text-lg font-black text-slate-900">
                Configuración del Código QR y Cuenta Bancaria de la OTB
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Los datos e imagen configurados aquí se mostrarán inmediatamente a todos los vecinos en la Landing Page y en sus aplicaciones móviles al pulsar "Pagar con QR".
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Entidad Bancaria Oficial:</label>
                  <select
                    value={formBank}
                    onChange={(e) => setFormBank(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Banco Unión">Banco Unión (Cuenta Fiscal / Institucional)</option>
                    <option value="BancoSol">BancoSol</option>
                    <option value="Banco de Crédito BCP">Banco de Crédito BCP</option>
                    <option value="Banco Nacional de Bolivia BNB">Banco Nacional de Bolivia BNB</option>
                    <option value="Banco FIE">Banco FIE</option>
                    <option value="Banco Mercantil Santa Cruz">Banco Mercantil Santa Cruz</option>
                    <option value="Banco Prodem">Banco Prodem</option>
                    <option value="Cooperativa Jesús Nazareno">Cooperativa Jesús Nazareno</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Cuenta:</label>
                  <input
                    type="text"
                    required
                    value={formAccountType}
                    onChange={(e) => setFormAccountType(e.target.value)}
                    placeholder="ej. Caja de Ahorros Fiscal"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Número de Cuenta Bancaria:</label>
                  <input
                    type="text"
                    required
                    value={formAccountNumber}
                    onChange={(e) => setFormAccountNumber(e.target.value)}
                    placeholder="ej. 10000034891230"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Titular de la Cuenta / OTB:</label>
                  <input
                    type="text"
                    required
                    value={formAccountHolder}
                    onChange={(e) => setFormAccountHolder(e.target.value)}
                    placeholder="ej. OTB Villa Esperanza - Tesorería"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIT / CI del Titular:</label>
                  <input
                    type="text"
                    value={formNitOrCi}
                    onChange={(e) => setFormNitOrCi(e.target.value)}
                    placeholder="ej. NIT 1028374021"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp de Tesorería:</label>
                  <input
                    type="text"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="ej. 76543210"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Cargar Imagen Oficial del Código QR Simple:
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                  <Upload className="w-7 h-7 text-blue-500 mb-1" />
                  <span className="font-bold text-slate-800 text-xs">
                    Toca para seleccionar la imagen del QR de tu banco (JPG / PNG)
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Sube la captura de tu QR Simple generado por tu banco (Unión, Sol, BCP, etc.)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrImageUpload}
                    className="hidden"
                    id="qr-upload-input"
                  />
                  <label
                    htmlFor="qr-upload-input"
                    className="mt-2.5 px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
                  >
                    Examinar archivo
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Instrucciones o Glosa para el Vecino:
                </label>
                <textarea
                  rows={2}
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="ej. Indicar código de lote en la glosa de la transferencia"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {configSavedNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>¡Datos guardados correctamente y sincronizados con toda la comunidad!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Configuración Oficial de Cobro</span>
              </button>
            </form>
          </div>

          {/* Vista Previa de lo que Verá el Vecino */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white border-2 border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block mb-1">
                Vista Previa en Vivo
              </span>
              <h3 className="text-base font-black text-white">
                Así verá el vecino el QR para pagar:
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Muestra exactamente lo que se desplegará al presionar "Pagar con QR".
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#020617] border-2 border-slate-700 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-44 h-44 bg-white rounded-2xl p-2.5 shadow-lg flex items-center justify-center overflow-hidden">
                {qrFilePreview ? (
                  <img
                    src={qrFilePreview}
                    alt="QR Cargado por el Admin"
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
                    <rect x="70" y="70" width="10" height="10" fill="#0F172A" />
                  </svg>
                )}
              </div>

              <div>
                <p className="text-sm font-black text-white">{formBank}</p>
                <p className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                  Cta: {formAccountNumber}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{formAccountHolder}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 text-left w-full">
                <strong>Glosa recomendada:</strong> {formInstructions}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center">
              ✓ Se actualiza en tiempo real para todos los vecinos.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: HISTORIAL DE RECIBOS EMITIDOS                    */}
      {/* ======================================================== */}
      {activeTab === 'pagos' && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-fintech overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5 font-bold">N° Recibo / Fecha</th>
                  <th className="px-5 py-3.5 font-bold">Vecino / Aportante</th>
                  <th className="px-5 py-3.5 font-bold">Concepto</th>
                  <th className="px-5 py-3.5 font-bold">Método</th>
                  <th className="px-5 py-3.5 font-bold">Estado</th>
                  <th className="px-5 py-3.5 font-bold text-right">Importe</th>
                  <th className="px-5 py-3.5 font-bold text-center">Validación QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold font-mono text-slate-900">{p.receiptNumber}</p>
                      <p className="text-[10px] text-slate-400">{p.date}</p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{p.neighborName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{p.concept}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                        {p.method === 'Efectivo' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                        {p.method === 'Transferencia' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        {p.method === 'QR' && <QrCode className="w-3.5 h-3.5 text-purple-600" />}
                        {p.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.status === 'Confirmed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Confirmado
                        </span>
                      )}
                      {p.status === 'PendingVerification' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Verificación Pendiente
                        </span>
                      )}
                      {p.status === 'Reversed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Revertido
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                      {formatBOB(p.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() =>
                          navigate(`/verificar-recibo?token=${p.token}&receipt=${p.receiptNumber}`)
                        }
                        title="Verificar Recibo Oficial QR"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Ver QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: TARIFARIO DE CUOTAS                              */}
      {/* ======================================================== */}
      {activeTab === 'cuotas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                Ordinaria
              </span>
              <span className="text-xs text-slate-400 font-mono">Vence: 30/11/2026</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Cuota Ordinaria Noviembre 2026</h3>
            <p className="text-xs text-slate-500 mt-1">
              Fondo operativo para pago de alumbrado público, recojo de basura comunal y mantenimiento.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Monto asignado por vivienda:</span>
              <span className="text-lg font-extrabold font-mono text-slate-900">{formatBOB(25.0)}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-fintech">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                Aporte Especial
              </span>
              <span className="text-xs text-slate-400 font-mono">Vence: 15/12/2026</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Aporte Pro-Tinglado (Cuota 1 de 2)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Fondo exclusivo con destino a la compra de perfiles y tinglado de la cancha polifuncional.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Monto asignado por vivienda:</span>
              <span className="text-lg font-extrabold font-mono text-purple-700">{formatBOB(100.0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ARQUEO DE CAJA CENTRAL                           */}
      {/* ======================================================== */}
      {activeTab === 'arqueo' && (
        <div className="max-w-2xl p-6 rounded-2xl bg-white border border-slate-200/80 shadow-fintech space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Arqueo y Cierre Diario de Caja</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-500">Saldo Inicial:</span>
              <p className="text-sm font-mono font-bold text-slate-800">{formatBOB(3500.0)}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50">
              <span className="text-emerald-700">Ingresos del Día:</span>
              <p className="text-sm font-mono font-bold text-emerald-800">{formatBOB(750.0)}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Saldo Contable Esperado:</span>
            <span className="text-lg font-extrabold font-mono text-blue-600">{formatBOB(4250.0)}</span>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Arqueo cuadrado al 100%. Sin discrepancias entre conteo físico y sistema.</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: INSPECCIONAR VOUCHER Y APROBAR / RECHAZAR      */}
      {/* ======================================================== */}
      {inspectingVoucher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 block">
                  Verificación Manual de Tesorería
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Comprobante de {inspectingVoucher.neighborName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setInspectingVoucher(null);
                  setShowRejectForm(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulación del Comprobante / Voucher */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-full max-w-xs bg-white p-4 rounded-xl shadow-md border border-slate-200 font-mono text-xs text-left space-y-1.5">
                <div className="text-center pb-2 border-b border-slate-200 font-sans">
                  <strong className="text-sm text-slate-900 block font-black">BANCO UNIÓN S.A.</strong>
                  <span className="text-[10px] text-slate-500">Comprobante de Transferencia QR Simple</span>
                </div>
                <div className="pt-1 text-[11px]">
                  <p><span className="text-slate-500">Fecha/Hora:</span> {inspectingVoucher.submittedAt}</p>
                  <p><span className="text-slate-500">Ordenante:</span> {inspectingVoucher.neighborName}</p>
                  <p><span className="text-slate-500">CI:</span> {inspectingVoucher.neighborCi}</p>
                  <p><span className="text-slate-500">Destino:</span> {otbPaymentConfig.accountHolder}</p>
                  <p><span className="text-slate-500">Cuenta:</span> {otbPaymentConfig.accountNumber}</p>
                  <p><span className="text-slate-500">Concepto:</span> {inspectingVoucher.concept}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Monto Transferido:</span>
                    <strong className="text-emerald-700 text-sm font-black">{formatBOB(inspectingVoucher.amount)}</strong>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">
                Archivo: <code className="text-slate-800 font-bold">{inspectingVoucher.evidenceName}</code>
              </span>
            </div>

            {/* Formulario de Rechazo */}
            {showRejectForm ? (
              <div className="space-y-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs">
                <strong className="text-rose-950 font-bold block">
                  Indicar Motivo de Observación / Rechazo:
                </strong>
                <textarea
                  rows={2}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="ej. El número de transacción no figura en el extracto de Banco Unión..."
                  className="w-full p-2.5 bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-900 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-xl"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => handleReject(inspectingVoucher.id)}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-sm"
                  >
                    Confirmar Rechazo
                  </button>
                </div>
              </div>
            ) : inspectingVoucher.status === 'PendingVerification' ? (
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="flex-1 py-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  Observar / Rechazar
                </button>
                <button
                  onClick={() => handleApprove(inspectingVoucher.id)}
                  className="flex-1 py-3 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Aprobar & Emitir Recibo TRACE</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-slate-500 font-bold">
                Este comprobante ya fue procesado ({inspectingVoucher.status === 'Confirmed' ? 'Aprobado ✓' : 'Rechazado ✕'}).
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: IMPRESIÓN OFICIAL DE RECIBOS MENSUALES CON QR   */}
      {/* ======================================================== */}
      <OfficialMonthlyReceiptsPrintModal
        isOpen={isPrintReceiptsOpen}
        onClose={() => setIsPrintReceiptsOpen(false)}
      />

      {/* ======================================================== */}
      {/* MODAL 3: REGISTRO COBRANZA EN CAJA                       */}
      {/* ======================================================== */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">Registrar Cobranza & Emitir Recibo</h2>
              <p className="text-xs text-slate-500">Genera recibo oficial con token de validación QR.</p>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vecino / Aportante</label>
                <select
                  value={neighborName}
                  onChange={(e) => setNeighborName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Juan José Flores Morales">Juan José Flores Morales (Lote 12 - Deuda: Bs. 50)</option>
                  <option value="Silvia Rojas Torrico">Silvia Rojas Torrico (Lote 05 - Deuda: Bs. 125)</option>
                  <option value="Roberto Fernández Vargas">Roberto Fernández Vargas (Lote 01 - Al Día)</option>
                  <option value="Marina Condori Rocha">Marina Condori Rocha (Lote 08 - Al Día)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Concepto de Cobro</label>
                <input
                  type="text"
                  required
                  value={payConcept}
                  onChange={(e) => setPayConcept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monto (BOB / Bs.)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full font-mono font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Método de Cobro</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Efectivo">Efectivo en Caja</option>
                    <option value="QR">QR Simple (Bolivia)</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirmar & Emitir Recibo QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ÉXITO RECIBO EMITIDO                           */}
      {/* ======================================================== */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">¡Recibo Oficial Emitido!</h3>
              <p className="text-xs text-slate-500 mt-1">El cobro ha sido registrado e impactado en tesorería.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 font-mono">
              <p className="text-slate-500">Recibo: <span className="font-bold text-slate-900">{generatedReceipt.receiptNumber}</span></p>
              <p className="text-slate-500">Vecino: <span className="font-bold text-slate-900">{generatedReceipt.neighborName}</span></p>
              <p className="text-slate-500">Monto: <span className="font-bold text-emerald-600 text-sm">{formatBOB(generatedReceipt.amount)}</span></p>
              <p className="text-slate-500">Método: <span className="text-slate-900">{generatedReceipt.method}</span></p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigate(`/verificar-recibo?token=${generatedReceipt.token}&receipt=${generatedReceipt.receiptNumber}`);
                  setGeneratedReceipt(null);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
              >
                Abrir Verificación QR
              </button>
              <button
                onClick={() => setGeneratedReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
