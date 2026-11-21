import { create } from 'zustand';
import { generateSecureReceiptToken, formatBOB } from '@xentra/shared';
import { useNotificationStore } from './notificationStore';

export interface OtbPaymentConfig {
  otbId: string;
  otbName: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  nitOrCi: string;
  qrImageUrl: string;
  whatsappContact: string;
  instructions: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PaymentSubmission {
  id: string;
  otbId: string;
  neighborName: string;
  neighborSocioCode: string;
  neighborCi: string;
  block: string;
  lot: string;
  amount: number;
  concept: string;
  method: 'QR' | 'Transferencia';
  evidenceName: string;
  evidenceUrl?: string;
  status: 'PendingVerification' | 'Confirmed' | 'Rejected';
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  officialReceiptNumber?: string;
  traceToken?: string;
  rejectionReason?: string;
}

interface PaymentVerificationState {
  config: OtbPaymentConfig;
  configsByOtb: Record<string, OtbPaymentConfig>;
  submissions: PaymentSubmission[];
  getConfigForOtb: (otbId?: string) => OtbPaymentConfig;
  updateConfig: (newConfig: Partial<OtbPaymentConfig>, targetOtbId?: string) => void;
  submitVoucher: (
    submission: Omit<PaymentSubmission, 'id' | 'status' | 'submittedAt'>
  ) => Promise<PaymentSubmission>;
  approveVoucher: (id: string, verifiedBy?: string) => Promise<PaymentSubmission | null>;
  rejectVoucher: (id: string, reason: string, verifiedBy?: string) => Promise<PaymentSubmission | null>;
  cancelVoucher: (id: string) => void;
  getPendingCount: (otbId?: string) => number;
}

const STORAGE_KEY = 'xentra_otb_payment_store_v2';

const DEFAULT_CONFIGS_BY_OTB: Record<string, OtbPaymentConfig> = {
  '11111111-1111-1111-1111-111111111111': {
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Esperanza',
    bankName: 'Banco Unión',
    accountType: 'Caja de Ahorros Fiscal',
    accountNumber: '10000034891230',
    accountHolder: 'OTB Villa Esperanza - Tesorería',
    nitOrCi: 'NIT 1028374021',
    qrImageUrl: '',
    whatsappContact: '76543210',
    instructions: 'Indica tu código de socio o manzano/lote en la glosa de la transferencia bancaria.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Directiva OTB'
  },
  '22222222-2222-2222-2222-222222222222': {
    otbId: '22222222-2222-2222-2222-222222222222',
    otbName: 'Los Pinos',
    bankName: 'BancoSol',
    accountType: 'Caja de Ahorros',
    accountNumber: '240001928374',
    accountHolder: 'OTB Los Pinos - Directiva Calacoto',
    nitOrCi: 'NIT 2039485012',
    qrImageUrl: '',
    whatsappContact: '72345678',
    instructions: 'Indica tu código de socio o lote en la glosa bancaria.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Directiva OTB Los Pinos'
  },
  '33333333-3333-3333-3333-333333333333': {
    otbId: '33333333-3333-3333-3333-333333333333',
    otbName: 'Barrio Lindo Plan 4000',
    bankName: 'Banco Mercantil Santa Cruz',
    accountType: 'Caja de Ahorros',
    accountNumber: '4010293847',
    accountHolder: 'OTB Barrio Lindo - Tesorería',
    nitOrCi: 'NIT 3049582019',
    qrImageUrl: '',
    whatsappContact: '76891234',
    instructions: 'Indica Manzana y número de vivienda en la glosa.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Directiva Barrio Lindo'
  }
};

const DEFAULT_CONFIG: OtbPaymentConfig = DEFAULT_CONFIGS_BY_OTB['11111111-1111-1111-1111-111111111111'];

const DEFAULT_SUBMISSIONS: PaymentSubmission[] = [
  {
    id: 'sub-01',
    otbId: '11111111-1111-1111-1111-111111111111',
    neighborName: 'Silvia Rojas Torrico',
    neighborSocioCode: 'SOC-003',
    neighborCi: '5289140 CBBA',
    block: 'Manzana B',
    lot: 'Lote 08',
    amount: 100.0,
    concept: 'Aporte Pro-Tinglado (Cuota 1 de 2)',
    method: 'QR',
    evidenceName: 'voucher_banco_union_100bs_silvia.jpg',
    status: 'PendingVerification',
    submittedAt: '21/11/2026 12:15'
  },
  {
    id: 'sub-02',
    otbId: '11111111-1111-1111-1111-111111111111',
    neighborName: 'Carlos Mamani Choque',
    neighborSocioCode: 'SOC-007',
    neighborCi: '6312459 CBBA',
    block: 'Manzana C',
    lot: 'Lote 19',
    amount: 25.0,
    concept: 'Cuota Ordinaria Noviembre 2026',
    method: 'QR',
    evidenceName: 'deposito_qr_simple_carlos_25bs.png',
    status: 'PendingVerification',
    submittedAt: '21/11/2026 13:40'
  },
  {
    id: 'sub-03',
    otbId: '11111111-1111-1111-1111-111111111111',
    neighborName: 'Juan José Flores Morales',
    neighborSocioCode: 'SOC-012',
    neighborCi: '7412589 CBBA',
    block: 'Manzana A',
    lot: 'Lote 12',
    amount: 50.0,
    concept: 'Aporte Pro-Tinglado (Abono Parcial)',
    method: 'QR',
    evidenceName: 'transferencia_union_juan_flores_50bs.jpg',
    status: 'Confirmed',
    submittedAt: '21/11/2026 10:30',
    verifiedAt: '21/11/2026 10:45',
    verifiedBy: 'Tesorero Don Ramiro',
    officialReceiptNumber: 'OTB-CBBA-001-2026-00042',
    traceToken: '7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4'
  },
  {
    id: 'sub-lpz-01',
    otbId: '22222222-2222-2222-2222-222222222222',
    neighborName: 'Gonzalo Apaza Quispe',
    neighborSocioCode: 'SOC-LPZ-004',
    neighborCi: '4821903 LPZ',
    block: 'Calle 25',
    lot: 'Lote 14',
    amount: 35.0,
    concept: 'Cuota Mantenimiento Los Pinos',
    method: 'QR',
    evidenceName: 'transferencia_bancosol_35bs.jpg',
    status: 'PendingVerification',
    submittedAt: '21/11/2026 11:20'
  }
];

// Helper para cargar de LocalStorage
const loadFromStorage = (): {
  config: OtbPaymentConfig;
  configsByOtb: Record<string, OtbPaymentConfig>;
  submissions: PaymentSubmission[];
} => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        config: { ...DEFAULT_CONFIG, ...(parsed.config || {}) },
        configsByOtb: { ...DEFAULT_CONFIGS_BY_OTB, ...(parsed.configsByOtb || {}) },
        submissions: parsed.submissions || DEFAULT_SUBMISSIONS
      };
    }
  } catch (err) {
    console.warn('Error loading payment store from localStorage', err);
  }
  return {
    config: DEFAULT_CONFIG,
    configsByOtb: DEFAULT_CONFIGS_BY_OTB,
    submissions: DEFAULT_SUBMISSIONS
  };
};

// Helper para guardar en LocalStorage
const saveToStorage = (
  config: OtbPaymentConfig,
  submissions: PaymentSubmission[],
  configsByOtb?: Record<string, OtbPaymentConfig>
) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, submissions, configsByOtb }));
  } catch (err) {
    console.warn('Error saving payment store to localStorage', err);
  }
};

const initialData = loadFromStorage();

export const usePaymentVerificationStore = create<PaymentVerificationState>((set, get) => ({
  config: initialData.config,
  configsByOtb: initialData.configsByOtb,
  submissions: initialData.submissions,

  getConfigForOtb: (otbId) => {
    const targetId = otbId || get().config.otbId;
    return get().configsByOtb[targetId] || get().config;
  },

  updateConfig: (newConfig, targetOtbId) => {
    const otbId = targetOtbId || newConfig.otbId || get().config.otbId;
    const currentForOtb = get().configsByOtb[otbId] || get().config;
    const updatedForOtb = {
      ...currentForOtb,
      ...newConfig,
      updatedAt: new Date().toISOString()
    };
    const updatedMap = {
      ...get().configsByOtb,
      [otbId]: updatedForOtb
    };
    set({
      config: updatedForOtb,
      configsByOtb: updatedMap
    });
    saveToStorage(updatedForOtb, get().submissions, updatedMap);
  },

  submitVoucher: async (submissionData) => {
    const newSubmission: PaymentSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      status: 'PendingVerification',
      submittedAt: new Date().toLocaleString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedSubmissions = [newSubmission, ...get().submissions];
    set({ submissions: updatedSubmissions });
    saveToStorage(get().config, updatedSubmissions);

    // Despachar notificación directa al Tesorero y Admin
    const addNotif = useNotificationStore.getState().addNotification;
    addNotif({
      id: `notif-${Date.now()}`,
      recipient_user_id: 'admin-treasurer',
      otb_id: get().config.otbId,
      type: 'PAYMENT_RECEIVED',
      category: 'Pagos',
      title: '🔔 Comprobante QR para Verificación Manual',
      body: `El socio ${newSubmission.neighborName} (${newSubmission.neighborSocioCode}) envió un comprobante por ${formatBOB(newSubmission.amount)} (${newSubmission.concept}). Verifique el ingreso en el extracto bancario de ${get().config.bankName}.`,
      priority: 'high',
      action_route: '/admin/finanzas',
      created_at: new Date().toISOString()
    });

    return newSubmission;
  },

  approveVoucher: async (id, verifiedBy = 'Tesorero OTB') => {
    const submissions = get().submissions;
    const target = submissions.find((s) => s.id === id);
    if (!target) return null;

    const token = generateSecureReceiptToken();
    const nextSeq = submissions.filter((s) => s.status === 'Confirmed').length + 43;
    const receiptNum = `OTB-CBBA-001-2026-${String(nextSeq).padStart(5, '0')}`;

    const updatedTarget: PaymentSubmission = {
      ...target,
      status: 'Confirmed',
      verifiedAt: new Date().toLocaleString('es-BO'),
      verifiedBy,
      officialReceiptNumber: receiptNum,
      traceToken: token
    };

    const updatedSubmissions = submissions.map((s) => (s.id === id ? updatedTarget : s));
    set({ submissions: updatedSubmissions });
    saveToStorage(get().config, updatedSubmissions);

    // Notificación de confirmación oficial
    const addNotif = useNotificationStore.getState().addNotification;
    addNotif({
      id: `notif-appr-${Date.now()}`,
      recipient_user_id: 'user-neighbor',
      otb_id: get().config.otbId,
      type: 'PAYMENT_CONFIRMED',
      category: 'Pagos',
      title: '✅ Comprobante Verificado y Aprobado',
      body: `Pago de ${formatBOB(target.amount)} confirmado para ${target.neighborName}. Se emitió el Recibo Oficial ${receiptNum} con certificación TRACE.`,
      priority: 'normal',
      action_route: `/verificar-recibo?token=${token}&receipt=${receiptNum}`,
      created_at: new Date().toISOString()
    });

    return updatedTarget;
  },

  rejectVoucher: async (id, reason, verifiedBy = 'Tesorero OTB') => {
    const submissions = get().submissions;
    const target = submissions.find((s) => s.id === id);
    if (!target) return null;

    const updatedTarget: PaymentSubmission = {
      ...target,
      status: 'Rejected',
      verifiedAt: new Date().toLocaleString('es-BO'),
      verifiedBy,
      rejectionReason: reason || 'Monto o datos no coinciden con extracto bancario'
    };

    const updatedSubmissions = submissions.map((s) => (s.id === id ? updatedTarget : s));
    set({ submissions: updatedSubmissions });
    saveToStorage(get().config, updatedSubmissions);

    // Notificación de rechazo con motivo
    const addNotif = useNotificationStore.getState().addNotification;
    addNotif({
      id: `notif-rej-${Date.now()}`,
      recipient_user_id: 'user-neighbor',
      otb_id: get().config.otbId,
      type: 'PAYMENT_RECEIVED',
      category: 'Pagos',
      title: '⚠️ Comprobante Rechazado por Tesorería',
      body: `El comprobante de ${formatBOB(target.amount)} fue observado por: "${reason}". Comuníquese con la directiva o suba un nuevo voucher.`,
      priority: 'high',
      action_route: '/vecino',
      created_at: new Date().toISOString()
    });

    return updatedTarget;
  },

  cancelVoucher: (id: string) => {
    const updated = get().submissions.filter((s) => s.id !== id);
    set({ submissions: updated });
    saveToStorage(get().config, updated, get().configsByOtb);
  },

  getPendingCount: (otbId?: string) => {
    return get().submissions.filter(
      (s) => s.status === 'PendingVerification' && (!otbId || s.otbId === otbId)
    ).length;
  }
}));
