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
  Search,
  Edit3,
  Trash2,
  Plus,
  Tag,
  RefreshCw
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
import { TiltCard3D } from '../components/TiltCard3D';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getNeighborsByOtb } from '../data/censusNeighbors';

interface PaymentMock {
  id: string;
  otbId?: string;
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
    otbId: '11111111-1111-1111-1111-111111111111',
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
    otbId: '11111111-1111-1111-1111-111111111111',
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
    otbId: '11111111-1111-1111-1111-111111111111',
    receiptNumber: 'OTB-CBBA-001-2026-00040',
    neighborName: 'Silvia Rojas Torrico',
    amount: 100.0,
    method: 'Transferencia',
    concept: 'Aporte Pro-Tinglado Cuota 1',
    date: '2026-11-19 14:00',
    status: 'PendingVerification',
    token: 'c9203b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789'
  },
  {
    id: 'pay-lpz-1',
    otbId: '22222222-2222-2222-2222-222222222222',
    receiptNumber: 'OTB-LPZ-002-2026-00001',
    neighborName: 'Gonzalo Apaza Quispe',
    amount: 35.0,
    method: 'QR',
    concept: 'Cuota Seguridad Los Pinos',
    date: '2026-11-20 11:00',
    status: 'Confirmed',
    token: 'e1029384756abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }
];

export interface OtbFee {
  id: string;
  otbId?: string;
  title: string;
  type: 'Ordinaria' | 'AporteEspecial' | 'ServicioAgua' | 'Alumbrado';
  dueDate: string;
  amount: number;
  description: string;
  status: 'Activa' | 'Cerrada';
  assignedLots: number;
  paidLots: number;
}

const INITIAL_FEES_OTB: OtbFee[] = [
  {
    id: 'fee-1',
    otbId: '11111111-1111-1111-1111-111111111111',
    title: 'Cuota Ordinaria Noviembre 2026',
    type: 'Ordinaria',
    dueDate: '30/11/2026',
    amount: 25.0,
    description: 'Fondo operativo para pago de alumbrado público, recojo de basura comunal y mantenimiento.',
    status: 'Activa',
    assignedLots: 48,
    paidLots: 36
  },
  {
    id: 'fee-2',
    otbId: '11111111-1111-1111-1111-111111111111',
    title: 'Aporte Pro-Tinglado (Cuota 1 de 2)',
    type: 'AporteEspecial',
    dueDate: '15/12/2026',
    amount: 100.0,
    description: 'Fondo exclusivo con destino a la compra de perfiles y tinglado de la cancha polifuncional.',
    status: 'Activa',
    assignedLots: 48,
    paidLots: 22
  },
  {
    id: 'fee-lpz-1',
    otbId: '22222222-2222-2222-2222-222222222222',
    title: 'Aporte Seguridad & Cámaras Los Pinos',
    type: 'AporteEspecial',
    dueDate: '20/12/2026',
    amount: 35.0,
    description: 'Mantenimiento de cámaras de circuito cerrado en Calacoto.',
    status: 'Activa',
    assignedLots: 32,
    paidLots: 28
  }
];

export const FinanzasPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentOtb } = useTenantStore();
  const { currentRole } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const {
    submissions,
    updateConfig: updateOtbPaymentConfig,
    approveVoucher,
    rejectVoucher,
    getConfigForOtb
  } = usePaymentVerificationStore();

  const isSuperadmin = currentRole === 'superadmin';
  const currentOtbId = currentOtb?.id || '11111111-1111-1111-1111-111111111111';
  const otbPaymentConfig = getConfigForOtb(currentOtbId);

  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [fees, setFees] = useState<OtbFee[]>(INITIAL_FEES_OTB);
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as 'pagos' | 'verificaciones' | 'config_qr' | 'cuotas' | 'arqueo' | null;

  const [activeTab, setActiveTab] = useState<
    'pagos' | 'verificaciones' | 'config_qr' | 'cuotas' | 'arqueo'
  >(urlTab || 'verificaciones');

  React.useEffect(() => {
    const tabParam = searchParams.get('tab') as any;
    if (tabParam && ['pagos', 'verificaciones', 'config_qr', 'cuotas', 'arqueo'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Filtrado Estricto Multi-Tenant: solo superadmin ve todo; resto solo su OTB
  const visibleSubmissions = isSuperadmin
    ? submissions
    : submissions.filter((s) => s.otbId === currentOtbId);

  const visiblePayments = isSuperadmin
    ? payments
    : payments.filter((p) => p.otbId === currentOtbId);

  const visibleFees = isSuperadmin
    ? fees
    : fees.filter((f) => f.otbId === currentOtbId);

  const pendingCount = visibleSubmissions.filter((s) => s.status === 'PendingVerification').length;

  // Vecinos del Padrón Censal de la OTB actual
  const otbCensusNeighbors = getNeighborsByOtb(currentOtbId);

  // Modal Cobro Manual
  const [showPayModal, setShowPayModal] = useState(false);
  const [neighborName, setNeighborName] = useState(
    otbCensusNeighbors[0]?.name || 'Vecino OTB'
  );
  const [payAmount, setPayAmount] = useState('50.00');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Efectivo');
  const [payConcept, setPayConcept] = useState('Cuota Ordinaria Noviembre 2026');

  // Sincronizar vecino por defecto al cambiar de OTB
  React.useEffect(() => {
    if (otbCensusNeighbors.length > 0) {
      setNeighborName(otbCensusNeighbors[0].name);
    }
  }, [currentOtbId]);

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

  // Sincronizar formulario de banco al cambiar de OTB
  React.useEffect(() => {
    const cfg = getConfigForOtb(currentOtbId);
    if (cfg) {
      setFormBank(cfg.bankName);
      setFormAccountType(cfg.accountType);
      setFormAccountNumber(cfg.accountNumber);
      setFormAccountHolder(cfg.accountHolder);
      setFormNitOrCi(cfg.nitOrCi);
      setFormWhatsapp(cfg.whatsappContact);
      setFormInstructions(cfg.instructions);
      setQrFilePreview(cfg.qrImageUrl || '');
    }
  }, [currentOtbId, getConfigForOtb]);

  // Estados CRUD Cuotas Comunales (Rol Tesorero)
  const [showCreateFeeModal, setShowCreateFeeModal] = useState(false);
  const [newFeeTitle, setNewFeeTitle] = useState('');
  const [newFeeType, setNewFeeType] = useState<OtbFee['type']>('Ordinaria');
  const [newFeeDueDate, setNewFeeDueDate] = useState('31/12/2026');
  const [newFeeAmount, setNewFeeAmount] = useState('25.00');
  const [newFeeDescription, setNewFeeDescription] = useState('');

  const [editingFee, setEditingFee] = useState<OtbFee | null>(null);
  const [editFeeTitle, setEditFeeTitle] = useState('');
  const [editFeeType, setEditFeeType] = useState<OtbFee['type']>('Ordinaria');
  const [editFeeDueDate, setEditFeeDueDate] = useState('');
  const [editFeeAmount, setEditFeeAmount] = useState('');
  const [editFeeDescription, setEditFeeDescription] = useState('');
  const [editFeeStatus, setEditFeeStatus] = useState<'Activa' | 'Cerrada'>('Activa');

  const [deletingFee, setDeletingFee] = useState<OtbFee | null>(null);

  // Estado para Revertir / Anular Recibo Contable (Auditoría)
  const [reversingPayment, setReversingPayment] = useState<PaymentMock | null>(null);
  const [reversalReason, setReversalReason] = useState('');

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
    }, currentOtbId);

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
        otbId: approved.otbId || currentOtbId,
        receiptNumber: approved.officialReceiptNumber || `${currentOtb?.code || 'OTB-CBBA-001'}-2026-00043`,
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
      otbId: currentOtbId,
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

  // CRUD Cuotas: Crear Nueva Cuota
  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newFeeAmount);
    if (!newFeeTitle.trim() || isNaN(amountNum) || amountNum <= 0) {
      alert('Ingresa un título válido y un monto mayor a 0 Bs.');
      return;
    }

    const createdFee: OtbFee = {
      id: `fee-${Date.now()}`,
      otbId: currentOtbId,
      title: newFeeTitle.trim(),
      type: newFeeType,
      dueDate: newFeeDueDate,
      amount: amountNum,
      description: newFeeDescription.trim() || 'Obligación aprobada en asamblea de la OTB.',
      status: 'Activa',
      assignedLots: 48,
      paidLots: 0
    };

    setFees([createdFee, ...fees]);
    setShowCreateFeeModal(false);
    setNewFeeTitle('');
    setNewFeeAmount('25.00');
    setNewFeeDescription('');
    alert(`¡Nueva cuota "${createdFee.title}" creada y asignada a las viviendas de la OTB!`);
  };

  // CRUD Cuotas: Iniciar Edición
  const handleStartEditFee = (fee: OtbFee) => {
    setEditingFee(fee);
    setEditFeeTitle(fee.title);
    setEditFeeType(fee.type);
    setEditFeeDueDate(fee.dueDate);
    setEditFeeAmount(fee.amount.toString());
    setEditFeeDescription(fee.description);
    setEditFeeStatus(fee.status);
  };

  // CRUD Cuotas: Guardar Edición (Update)
  const handleSaveEditFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee || !editFeeTitle.trim()) return;

    const amountNum = parseFloat(editFeeAmount) || editingFee.amount;

    setFees(
      fees.map((f) => {
        if (f.id !== editingFee.id) return f;
        return {
          ...f,
          title: editFeeTitle.trim(),
          type: editFeeType,
          dueDate: editFeeDueDate,
          amount: amountNum,
          description: editFeeDescription.trim(),
          status: editFeeStatus
        };
      })
    );

    setEditingFee(null);
  };

  // CRUD Cuotas: Alternar Estado Activa / Cerrada
  const handleToggleFeeStatus = (feeId: string) => {
    setFees(
      fees.map((f) => {
        if (f.id !== feeId) return f;
        const newStatus = f.status === 'Activa' ? 'Cerrada' : 'Activa';
        return { ...f, status: newStatus };
      })
    );
  };

  // CRUD Cuotas: Eliminar Cuota (Delete)
  const handleConfirmDeleteFee = () => {
    if (!deletingFee) return;
    setFees(fees.filter((f) => f.id !== deletingFee.id));
    setDeletingFee(null);
  };

  // CRUD Pagos: Revertir / Anular Recibo Contable
  const handleConfirmReversePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversingPayment) return;

    setPayments(
      payments.map((p) => {
        if (p.id !== reversingPayment.id) return p;
        return {
          ...p,
          status: 'Reversed'
        };
      })
    );

    addNotification({
      id: `notif-${Date.now()}`,
      recipient_user_id: 'user-neighbor',
      otb_id: currentOtb?.id || '',
      type: 'COMMUNITY_ALERT',
      category: 'Pagos',
      title: 'Recibo Anulado por Tesorería',
      body: `El recibo ${reversingPayment.receiptNumber} fue revertido. Motivo: ${reversalReason || 'Ajuste contable'}.`,
      priority: 'high',
      created_at: new Date().toISOString()
    });

    setReversingPayment(null);
    setReversalReason('');
    alert('Recibo revertido con éxito en el libro de caja con constancia de auditoría.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>Mesa Directiva & Tesorería Comunal</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-bold">{currentOtb?.name || 'OTB Villa Esperanza'} ({currentOtb?.code || 'OTB-CBBA-001'})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Tesorería & Verificación de Pagos QR
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Carga el QR bancario de tu OTB ({currentOtb?.name}), verifica comprobantes de vecinos manualmente y emite recibos con QR personalizado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Botón Imprimir Recibos Mensuales con QR */}
          <button
            onClick={() => setIsPrintReceiptsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Imprimir Recibos con QR</span>
          </button>

          {/* Botón Registrar Cobro Directo */}
          <button
            onClick={() => setShowPayModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Cobranza Manual</span>
          </button>
        </div>
      </div>

      {/* Tabs con scroll horizontal en móvil */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto whitespace-nowrap pb-1">
        <button
          onClick={() => setActiveTab('verificaciones')}
          className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === 'verificaciones'
            ? 'border-blue-400 text-blue-400 font-black'
            : 'border-transparent text-slate-400 hover:text-white'
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
          className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${activeTab === 'config_qr'
            ? 'border-blue-400 text-blue-400 font-black'
            : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configurar QR & Banco OTB</span>
        </button>

        <button
          onClick={() => setActiveTab('pagos')}
          className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'pagos'
            ? 'border-blue-400 text-blue-400 font-black'
            : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          Historial de Recibos Emitidos
        </button>

        <button
          onClick={() => setActiveTab('cuotas')}
          className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'cuotas'
            ? 'border-blue-400 text-blue-400 font-black'
            : 'border-transparent text-slate-400 hover:text-white'
            }`}
        >
          Tarifario de Cuotas
        </button>

        <button
          onClick={() => setActiveTab('arqueo')}
          className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'arqueo'
            ? 'border-blue-400 text-blue-400 font-black'
            : 'border-transparent text-slate-400 hover:text-white'
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
          <div className="p-4 rounded-2xl bg-blue-950/40 border-2 border-blue-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-sm text-white">
                  Flujo de Verificación Manual de Tesorería
                </strong>
                <span className="text-slate-300 text-xs">
                  Los vecinos transfieren por QR Simple y suben su comprobante. El Tesorero revisa el extracto de{' '}
                  <strong className="text-white">{otbPaymentConfig.bankName}</strong> y aprueba manualmente con un clic para emitir el recibo TRACE inmutable.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-900 font-mono font-bold text-blue-300 shadow-sm border border-blue-500/30 self-start sm:self-auto">
              {pendingCount} comprobante(s) por revisar
            </span>
          </div>

          <div className="rounded-3xl bg-[#0B132B]/90 border-2 border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#030712] border-b-2 border-slate-700 text-slate-300 uppercase tracking-wider text-[10px]">
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
                <tbody className="divide-y divide-slate-800">
                  {visibleSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                        {sub.submittedAt}
                      </td>
                      <td className="px-5 py-3.5">
                        <strong className="text-white block font-bold">{sub.neighborName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {sub.neighborSocioCode} • {sub.block}, {sub.lot}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-200">{sub.concept}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setInspectingVoucher(sub)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span className="truncate max-w-[120px]">{sub.evidenceName}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-black text-white text-sm">
                        {formatBOB(sub.amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        {sub.status === 'PendingVerification' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Por Verificar
                          </span>
                        )}
                        {sub.status === 'Confirmed' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Aprobado ✓
                          </span>
                        )}
                        {sub.status === 'Rejected' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            Rechazado ✕
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {sub.status === 'PendingVerification' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleApprove(sub.id)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition-all cursor-pointer flex items-center gap-1"
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
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 transition-colors cursor-pointer"
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
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5 text-blue-400" />
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
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-5 text-white">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-black mb-2">
                <Settings className="w-3.5 h-3.5" />
                <span>Gestión de Recaudación Bancaria Oficial</span>
              </div>
              <h2 className="text-xl font-black text-white">
                Configuración del Código QR y Cuenta Bancaria de la OTB
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Los datos e imagen configurados aquí se mostrarán inmediatamente a todos los vecinos en la Landing Page y en sus aplicaciones móviles al pulsar "Pagar con QR".
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Entidad Bancaria Oficial:</label>
                  <select
                    value={formBank}
                    onChange={(e) => setFormBank(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium"
                  >
                    <option value="Banco Unión" className="bg-slate-900 text-white">Banco Unión (Cuenta Fiscal / Institucional)</option>
                    <option value="BancoSol" className="bg-slate-900 text-white">BancoSol</option>
                    <option value="Banco de Crédito BCP" className="bg-slate-900 text-white">Banco de Crédito BCP</option>
                    <option value="Banco Nacional de Bolivia BNB" className="bg-slate-900 text-white">Banco Nacional de Bolivia BNB</option>
                    <option value="Banco FIE" className="bg-slate-900 text-white">Banco FIE</option>
                    <option value="Banco Mercantil Santa Cruz" className="bg-slate-900 text-white">Banco Mercantil Santa Cruz</option>
                    <option value="Banco Prodem" className="bg-slate-900 text-white">Banco Prodem</option>
                    <option value="Cooperativa Jesús Nazareno" className="bg-slate-900 text-white">Cooperativa Jesús Nazareno</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">Tipo de Cuenta:</label>
                  <input
                    type="text"
                    required
                    value={formAccountType}
                    onChange={(e) => setFormAccountType(e.target.value)}
                    placeholder="ej. Caja de Ahorros Fiscal"
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Número de Cuenta Bancaria:</label>
                  <input
                    type="text"
                    required
                    value={formAccountNumber}
                    onChange={(e) => setFormAccountNumber(e.target.value)}
                    placeholder="ej. 10000034891230"
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 font-mono font-bold text-white text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">Titular de la Cuenta / OTB:</label>
                  <input
                    type="text"
                    required
                    value={formAccountHolder}
                    onChange={(e) => setFormAccountHolder(e.target.value)}
                    placeholder="ej. OTB Villa Esperanza - Tesorería"
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">NIT / CI del Titular:</label>
                  <input
                    type="text"
                    value={formNitOrCi}
                    onChange={(e) => setFormNitOrCi(e.target.value)}
                    placeholder="ej. NIT 1028374021"
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">Teléfono / WhatsApp de Tesorería:</label>
                  <input
                    type="text"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="ej. 76543210"
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Cargar Imagen Oficial del Código QR Simple:
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-blue-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#030712]">
                  <Upload className="w-7 h-7 text-blue-400 mb-1" />
                  <span className="font-bold text-white text-xs">
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
                    className="mt-2.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-xs cursor-pointer hover:bg-blue-500 shadow-sm"
                  >
                    Examinar archivo
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Instrucciones o Glosa para el Vecino:
                </label>
                <textarea
                  rows={2}
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="ej. Indicar código de lote en la glosa de la transferencia"
                  className="w-full px-3 py-2 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium"
                />
              </div>

              {configSavedNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Datos guardados correctamente y sincronizados con toda la comunidad!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
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
        <div className="rounded-3xl bg-[#0B132B]/90 border-2 border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#030712] border-b-2 border-slate-700 text-slate-300 uppercase tracking-wider text-[10px]">
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
              <tbody className="divide-y divide-slate-800">
                {visiblePayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold font-mono text-white">{p.receiptNumber}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.date}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-200">{p.neighborName}</td>
                    <td className="px-5 py-3.5 text-slate-300">{p.concept}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300">
                        {p.method === 'Efectivo' && <Banknote className="w-3.5 h-3.5 text-emerald-400" />}
                        {p.method === 'Transferencia' && <CreditCard className="w-3.5 h-3.5 text-blue-400" />}
                        {p.method === 'QR' && <QrCode className="w-3.5 h-3.5 text-purple-400" />}
                        {p.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.status === 'Confirmed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Confirmado
                        </span>
                      )}
                      {p.status === 'PendingVerification' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Verificación Pendiente
                        </span>
                      )}
                      {p.status === 'Reversed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Revertido
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-black text-white text-sm">
                      {formatBOB(p.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <button
                          onClick={() =>
                            navigate(`/verificar-recibo?token=${p.token}&receipt=${p.receiptNumber}`)
                          }
                          title="Verificar Recibo Oficial QR"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/40 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-400" />
                          <span>Ver QR</span>
                        </button>

                        {/* Botón Anular Recibo (Solo si está Confirmado) */}
                        {p.status === 'Confirmed' && (
                          <button
                            onClick={() => {
                              setReversingPayment(p);
                              setReversalReason('');
                            }}
                            title="Revertir / Anular este recibo emitido por error"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Anular</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: TARIFARIO DE CUOTAS (CRUD COMPLETO TESORERÍA)    */}
      {/* ======================================================== */}
      {activeTab === 'cuotas' && (
        <div className="space-y-5">
          {/* Barra superior de gestión de cuotas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0B132B]/90 border border-slate-700">
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                Cuotas Comunales & Obligaciones Aprobadas ({visibleFees.length})
              </h2>
              <p className="text-xs text-slate-400">
                Tarifas aprobadas en asamblea general asignadas a las viviendas para recaudación comunal.
              </p>
            </div>
            <button
              onClick={() => setShowCreateFeeModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva Cuota Comunal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleFees.map((fee) => {
              const isOrdinaria = fee.type === 'Ordinaria';
              const isSpecial = fee.type === 'AporteEspecial';
              const isAgua = fee.type === 'ServicioAgua';
              const percentCollected = Math.round((fee.paidLots / fee.assignedLots) * 100);

              return (
                <TiltCard3D key={fee.id} intensity={4}>
                  <div
                    className={`h-full p-6 rounded-3xl bg-[#0B132B]/90 border-2 transition-all space-y-4 shadow-xl ${
                      fee.status === 'Activa'
                        ? 'border-slate-700/80 hover:border-blue-500/50'
                        : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          isOrdinaria
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : isSpecial
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : isAgua
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {fee.type}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFeeStatus(fee.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black border cursor-pointer transition-colors ${
                            fee.status === 'Activa'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-700/40 text-slate-400 border-slate-600'
                          }`}
                          title="Hacer clic para activar o pausar cobranza de esta cuota"
                        >
                          {fee.status === 'Activa' ? '✓ Cobranza Activa' : 'Pausada'}
                        </button>
                        <span className="text-xs text-slate-400 font-mono">Vence: {fee.dueDate}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-white text-base">{fee.title}</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {fee.description}
                      </p>
                    </div>

                    {/* Progreso de Recaudación */}
                    <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Viviendas al día: <strong className="text-white">{fee.paidLots} de {fee.assignedLots} lotes</strong></span>
                        <strong className="text-emerald-400 font-bold">{percentCollected}% recaudado</strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                          style={{ width: `${percentCollected}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Monto por vivienda:</span>
                        <span className="text-xl font-black font-mono text-white">
                          {formatBOB(fee.amount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartEditFee(fee)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          title="Modificar monto, fecha o glosa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => setDeletingFee(fee)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          title="Eliminar cuota creada por error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltCard3D>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ARQUEO DE CAJA CENTRAL                           */}
      {/* ======================================================== */}
      {activeTab === 'arqueo' && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-5">
          <h2 className="text-lg font-black text-white">Arqueo y Cierre Diario de Caja</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#030712] border border-slate-700 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Saldo Inicial:</span>
              <p className="text-lg font-mono font-black text-white">{formatBOB(3500.0)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#030712] border border-slate-700 space-y-1">
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Ingresos del Día:</span>
              <p className="text-lg font-mono font-black text-emerald-400">{formatBOB(750.0)}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#030712] border-2 border-slate-700 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-300">Saldo Contable Esperado:</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-blue-400">{formatBOB(4250.0)}</span>
          </div>

          <div className="text-xs text-slate-300 flex items-center gap-2 bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Arqueo cuadrado al 100%. Sin discrepancias entre conteo físico y sistema.</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: INSPECCIONAR VOUCHER Y APROBAR / RECHAZAR      */}
      {/* ======================================================== */}
      {inspectingVoucher && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] shadow-2xl border-2 border-slate-700 p-6 sm:p-8 space-y-5 my-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-400 block tracking-wider">
                  Verificación Manual de Tesorería
                </span>
                <h3 className="text-lg font-black text-white">
                  Comprobante de {inspectingVoucher.neighborName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setInspectingVoucher(null);
                  setShowRejectForm(false);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulación del Comprobante / Voucher */}
            <div className="p-4 rounded-2xl bg-[#030712] border-2 border-slate-700 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-full max-w-xs bg-white text-slate-900 p-4 rounded-xl shadow-md border border-slate-200 font-mono text-xs text-left space-y-1.5">
                <div className="text-center pb-2 border-b border-slate-200 font-sans">
                  <strong className="text-sm text-slate-900 block font-black">{otbPaymentConfig.bankName.toUpperCase()}</strong>
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
              <span className="text-[11px] text-slate-400 font-mono">
                Archivo: <code className="text-emerald-400 font-bold">{inspectingVoucher.evidenceName}</code>
              </span>
            </div>

            {/* Formulario de Rechazo */}
            {showRejectForm ? (
              <div className="space-y-3 p-4 bg-rose-950/30 border border-rose-500/40 rounded-2xl text-xs">
                <strong className="text-rose-200 font-bold block">
                  Indicar Motivo de Observación / Rechazo:
                </strong>
                <textarea
                  rows={2}
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder={`ej. El número de transacción no figura en el extracto de ${otbPaymentConfig.bankName}...`}
                  className="w-full p-3 bg-[#030712] border-2 border-rose-500/40 rounded-xl focus:outline-none focus:border-rose-400 text-white text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => handleReject(inspectingVoucher.id)}
                    className="px-4 py-1.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-sm cursor-pointer"
                  >
                    Confirmar Rechazo
                  </button>
                </div>
              </div>
            ) : inspectingVoucher.status === 'PendingVerification' ? (
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="flex-1 py-3.5 text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 rounded-2xl transition-colors cursor-pointer"
                >
                  Observar / Rechazar
                </button>
                <button
                  onClick={() => handleApprove(inspectingVoucher.id)}
                  className="flex-1 py-3.5 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Aprobar & Emitir Recibo TRACE</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-slate-400 font-bold">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0B132B] shadow-2xl border-2 border-slate-700 overflow-hidden text-white">
            <div className="p-5 border-b border-slate-800 bg-[#030712]">
              <h2 className="text-base font-black text-white">Registrar Cobranza & Emitir Recibo</h2>
              <p className="text-xs text-slate-400">Genera recibo oficial con token de validación QR.</p>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Vecino / Aportante</label>
                <select
                  value={neighborName}
                  onChange={(e) => setNeighborName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium"
                >
                  {otbCensusNeighbors.length > 0 ? (
                    otbCensusNeighbors.map((n) => (
                      <option key={n.id} value={n.name} className="bg-slate-900 text-white">
                        {n.name} ({n.house} - {n.socioCode} - CI: {n.ci})
                      </option>
                    ))
                  ) : (
                    <option value="Vecino General" className="bg-slate-900 text-white">
                      Vecino Registrado en Padrón
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Concepto de Cobro</label>
                <input
                  type="text"
                  required
                  value={payConcept}
                  onChange={(e) => setPayConcept(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Monto (BOB / Bs.)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full font-mono font-black text-white px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Método de Cobro</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium"
                  >
                    <option value="Efectivo" className="bg-slate-900 text-white">Efectivo en Caja</option>
                    <option value="QR" className="bg-slate-900 text-white">QR Simple (Bolivia)</option>
                    <option value="Transferencia" className="bg-slate-900 text-white">Transferencia Bancaria</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 font-bold text-slate-300 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-black text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0B132B] shadow-2xl border-2 border-slate-700 p-6 text-center space-y-4 text-white">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg">¡Recibo Oficial Emitido!</h3>
              <p className="text-xs text-slate-400 mt-1">El cobro ha sido registrado e impactado en tesorería.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border border-slate-700 text-left text-xs space-y-1.5 font-mono">
              <p className="text-slate-400">Recibo: <span className="font-bold text-white">{generatedReceipt.receiptNumber}</span></p>
              <p className="text-slate-400">Vecino: <span className="font-bold text-white">{generatedReceipt.neighborName}</span></p>
              <p className="text-slate-400">Monto: <span className="font-black text-emerald-400 text-sm">{formatBOB(generatedReceipt.amount)}</span></p>
              <p className="text-slate-400">Método: <span className="text-white">{generatedReceipt.method}</span></p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigate(`/verificar-recibo?token=${generatedReceipt.token}&receipt=${generatedReceipt.receiptNumber}`);
                  setGeneratedReceipt(null);
                }}
                className="flex-1 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 cursor-pointer"
              >
                Abrir Verificación QR
              </button>
              <button
                onClick={() => setGeneratedReceipt(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: CREAR NUEVA CUOTA COMUNAL                   */}
      {/* ======================================================== */}
      {showCreateFeeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] shadow-2xl border-2 border-slate-700 p-6 sm:p-7 space-y-4 my-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-400 block tracking-wider">
                  Tesorería OTB • Nueva Obligación
                </span>
                <h3 className="text-lg font-black text-white">Crear Nueva Cuota Comunal</h3>
              </div>
              <button
                onClick={() => setShowCreateFeeModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Concepto / Nombre de la Cuota</label>
                <input
                  type="text"
                  required
                  value={newFeeTitle}
                  onChange={(e) => setNewFeeTitle(e.target.value)}
                  placeholder="ej. Aporte Especial Luminarias Plaza Central"
                  className="w-full px-3.5 py-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Tipo de Cuota</label>
                  <select
                    value={newFeeType}
                    onChange={(e) => setNewFeeType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-medium"
                  >
                    <option value="Ordinaria" className="bg-slate-900 text-white">Cuota Ordinaria Mensual</option>
                    <option value="AporteEspecial" className="bg-slate-900 text-white">Aporte Especial / Extraordinario</option>
                    <option value="ServicioAgua" className="bg-slate-900 text-white">Servicio de Agua Potable</option>
                    <option value="Alumbrado" className="bg-slate-900 text-white">Mantenimiento de Alumbrado</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">Monto Asignado (BOB)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={newFeeAmount}
                    onChange={(e) => setNewFeeAmount(e.target.value)}
                    placeholder="ej. 25.00"
                    className="w-full font-mono font-black text-white px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Fecha Límite de Vencimiento</label>
                <input
                  type="text"
                  required
                  value={newFeeDueDate}
                  onChange={(e) => setNewFeeDueDate(e.target.value)}
                  placeholder="ej. 31/12/2026"
                  className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Descripción / Destino del Fondo</label>
                <textarea
                  rows={2}
                  value={newFeeDescription}
                  onChange={(e) => setNewFeeDescription(e.target.value)}
                  placeholder="Detalla el objetivo acordado en la asamblea de vecinos..."
                  className="w-full p-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateFeeModal(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-black text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar y Asignar Cuota</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: EDITAR CUOTA COMUNAL (UPDATE)               */}
      {/* ======================================================== */}
      {editingFee && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] shadow-2xl border-2 border-amber-500/50 p-6 sm:p-7 space-y-4 my-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">
                  Modificar Cuota Comunal
                </span>
                <h3 className="text-lg font-black text-white">Editar: {editingFee.title}</h3>
              </div>
              <button
                onClick={() => setEditingFee(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFee} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Título de la Cuota</label>
                <input
                  type="text"
                  required
                  value={editFeeTitle}
                  onChange={(e) => setEditFeeTitle(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Monto Asignado (BOB)</label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={editFeeAmount}
                    onChange={(e) => setEditFeeAmount(e.target.value)}
                    className="w-full font-mono font-black text-white px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Fecha de Vencimiento</label>
                  <input
                    type="text"
                    required
                    value={editFeeDueDate}
                    onChange={(e) => setEditFeeDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Tipo</label>
                  <select
                    value={editFeeType}
                    onChange={(e) => setEditFeeType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-medium"
                  >
                    <option value="Ordinaria" className="bg-slate-900 text-white">Ordinaria</option>
                    <option value="AporteEspecial" className="bg-slate-900 text-white">Aporte Especial</option>
                    <option value="ServicioAgua" className="bg-slate-900 text-white">Servicio Agua</option>
                    <option value="Alumbrado" className="bg-slate-900 text-white">Alumbrado</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Estado del Cobro</label>
                  <select
                    value={editFeeStatus}
                    onChange={(e) => setEditFeeStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-bold"
                  >
                    <option value="Activa">Activa (En recaudación)</option>
                    <option value="Cerrada">Cerrada (Pausada)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editFeeDescription}
                  onChange={(e) => setEditFeeDescription(e.target.value)}
                  className="w-full p-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFee(null)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md shadow-amber-400/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: ELIMINAR CUOTA COMUNAL (DELETE)             */}
      {/* ======================================================== */}
      {deletingFee && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0B132B] border-2 border-rose-500/50 shadow-2xl p-6 sm:p-7 space-y-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">¿Eliminar esta cuota comunal?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vas a anular la obligación <strong className="text-white">{deletingFee.title}</strong> con monto asignado de <strong className="text-amber-400">{formatBOB(deletingFee.amount)}</strong>.
              </p>
              {deletingFee.paidLots > 0 && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs text-left">
                  ⚠️ Ya hay <strong>{deletingFee.paidLots} lotes</strong> que realizaron pagos para esta cuota.
                </div>
              )}
            </div>

            <div className="pt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingFee(null)}
                className="flex-1 h-12 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteFee}
                className="flex-1 h-12 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Eliminación</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL AUDITORÍA: REVERTIR / ANULAR RECIBO               */}
      {/* ======================================================== */}
      {reversingPayment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0B132B] border-2 border-rose-500/50 shadow-2xl p-6 sm:p-7 space-y-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">Anulación Contable de Recibo</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Estás por revertir el recibo <strong className="text-white font-mono">{reversingPayment.receiptNumber}</strong> por <strong className="text-emerald-400">{formatBOB(reversingPayment.amount)}</strong> a nombre de <strong className="text-white">{reversingPayment.neighborName}</strong>.
              </p>
            </div>

            <form onSubmit={handleConfirmReversePayment} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Motivo de Reversión (Obligatorio para Auditoría):
                </label>
                <textarea
                  rows={2}
                  required
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  placeholder="ej. Cheque sin fondos / Error de digitación en ventanilla..."
                  className="w-full p-3 bg-[#030712] border-2 border-rose-500/40 rounded-xl focus:outline-none focus:border-rose-400 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setReversingPayment(null)}
                  className="flex-1 h-12 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Confirmar Reversión</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
