// Tipos y Modelos de Dominio de XENTRA OTB V3.0

export type AppRole =
  | 'superadmin'
  | 'presidente'
  | 'tesorero'
  | 'secretario'
  | 'fiscalizador'
  | 'vecino';

export type PaymentStatus =
  | 'Draft'
  | 'PendingVerification'
  | 'Confirmed'
  | 'Rejected'
  | 'Reversed';

export type PaymentMethod =
  | 'Efectivo'
  | 'Transferencia'
  | 'QR'
  | 'Otro';

export type FeeType =
  | 'Ordinaria'
  | 'Extraordinaria'
  | 'AporteEspecial'
  | 'Proyecto';

export type ExpenseStatus =
  | 'Draft'
  | 'PendingApproval'
  | 'Approved'
  | 'Executed'
  | 'Cancelled';

export type NotificationPriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export type NotificationCategory =
  | 'Pagos'
  | 'Cuotas'
  | 'Deudas'
  | 'Finanzas'
  | 'Auditoria'
  | 'TRACE'
  | 'VOTA'
  | 'Proyectos'
  | 'Comunicados'
  | 'Reuniones'
  | 'Seguridad'
  | 'Sincronizacion'
  | 'Sistema';

export type NotificationChannel =
  | 'in_app'
  | 'push'
  | 'email';

export type AuditSeverity =
  | 'info'
  | 'warning'
  | 'critical';

export type SyncStatus =
  | 'pending'
  | 'syncing'
  | 'synced'
  | 'failed'
  | 'conflict';

// --- ENTIDADES DE LA PLATAFORMA ---

export interface Profile {
  id: string; // auth.users id
  first_name: string;
  last_name: string;
  ci_number: string;
  ci_extension?: string; // CBBA, LPZ, SCZ, etc.
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformAdmin {
  id: string;
  user_id: string;
  assigned_by?: string;
  created_at: string;
}

export interface Otb {
  id: string;
  code: string; // ej: OTB-CBBA-001
  name: string;
  department: string;
  municipality: string;
  zone: string;
  address?: string;
  logo_url?: string;
  currency: string; // 'BOB'
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OtbMember {
  id: string;
  otb_id: string;
  user_id: string;
  role: AppRole;
  is_active: boolean;
  joined_at: string;
  approved_by?: string;
}

export interface House {
  id: string;
  otb_id: string;
  block_number: string; // Manzana / Lote
  house_number: string;
  street_name?: string;
  notes?: string;
  created_at: string;
}

export interface HouseResident {
  id: string;
  house_id: string;
  user_id: string;
  is_primary_owner: boolean;
  resident_type: 'Propietario' | 'Inquilino' | 'Familiar';
  created_at: string;
}

// --- FINANZAS ---

export interface Fee {
  id: string;
  otb_id: string;
  title: string;
  description?: string;
  amount: number; // Bs.
  fee_type: FeeType;
  due_date: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface FeeAssignment {
  id: string;
  fee_id: string;
  otb_id: string;
  user_id: string;
  house_id?: string;
  amount_assigned: number;
  amount_paid: number;
  is_settled: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  otb_id: string;
  user_id: string;
  received_by?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  receipt_number?: string;
  notes?: string;
  reversal_reason?: string;
  created_at: string;
  verified_at?: string;
}

export interface PaymentAllocation {
  id: string;
  payment_id: string;
  fee_assignment_id: string;
  amount: number;
  created_at: string;
}

export interface PaymentReceipt {
  id: string;
  payment_id: string;
  otb_id: string;
  receipt_number: string;
  amount: number;
  concept: string;
  payment_method: PaymentMethod;
  issued_at: string;
  token_hash: string;
  raw_token?: string; // Solo en creación inmediata en cliente
  is_revoked: boolean;
}

export interface CashRegister {
  id: string;
  otb_id: string;
  name: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
}

export interface CashRegisterClosure {
  id: string;
  cash_register_id: string;
  opened_at: string;
  closed_at: string;
  closed_by: string;
  initial_balance: number;
  system_income: number;
  system_expenses: number;
  calculated_balance: number;
  physical_balance: number;
  discrepancy: number;
  notes?: string;
}

// --- FONDOS Y TRACE ---

export interface CommunityFund {
  id: string;
  otb_id: string;
  name: string;
  description?: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
}

export interface FundContribution {
  id: string;
  fund_id: string;
  payment_id?: string;
  amount: number;
  source_type: 'payment' | 'direct_donation' | 'transfer';
  created_at: string;
}

export interface Project {
  id: string;
  otb_id: string;
  title: string;
  description?: string;
  budget: number;
  total_spent: number;
  status: 'Draft' | 'Planned' | 'InProgress' | 'Completed' | 'Cancelled';
  start_date?: string;
  end_date?: string;
  created_by: string;
  created_at: string;
}

export interface ProjectFundAllocation {
  id: string;
  project_id: string;
  fund_id: string;
  allocated_amount: number;
  created_at: string;
}

export interface Expense {
  id: string;
  otb_id: string;
  project_id?: string;
  fund_id?: string;
  cash_register_id?: string;
  amount: number;
  category: string;
  concept: string;
  supplier_name?: string;
  invoice_number?: string;
  evidence_url?: string;
  status: ExpenseStatus;
  created_by: string;
  approved_by?: string;
  created_at: string;
}

// --- AI AUDITOR ---

export interface AuditRuleConfig {
  id: string;
  otb_id: string;
  rule_code: string; // ej: R01_BUDGET_OVERRUN
  name: string;
  is_enabled: boolean;
  threshold_value?: number;
}

export interface FinancialAlert {
  id: string;
  otb_id: string;
  rule_code: string;
  severity: AuditSeverity;
  title: string;
  description: string;
  suggested_action?: string;
  entity_type?: string;
  entity_id?: string;
  is_resolved: boolean;
  resolved_by?: string;
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
}

// --- VOTA ---

export interface VotingPoll {
  id: string;
  otb_id: string;
  title: string;
  description: string;
  estimated_budget?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface VotingOption {
  id: string;
  poll_id: string;
  title: string;
  description?: string;
  votes_count: number;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}

// --- NOTIFICACIONES ---

export interface Notification {
  id: string;
  recipient_user_id: string;
  otb_id: string;
  type: string;
  category: NotificationCategory;
  title: string;
  body: string;
  priority: NotificationPriority;
  entity_type?: string;
  entity_id?: string;
  action_route?: string;
  safe_payload?: Record<string, unknown>;
  dedupe_key?: string;
  created_at: string;
  read_at?: string;
  archived_at?: string;
  expires_at?: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  otb_id: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  enabled: boolean;
  quiet_hours_start?: string; // HH:mm
  quiet_hours_end?: string;
  timezone?: string;
}

export interface NotificationOutbox {
  id: string;
  otb_id: string;
  event_type: string;
  event_payload: Record<string, unknown>;
  idempotency_key: string;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  attempt_count: number;
  next_retry_at?: string;
  created_at: string;
  processed_at?: string;
}

// --- OFFLINE SYNC ---

export interface SyncOperation {
  id: string;
  operation_id: string;
  idempotency_key: string;
  otb_id: string;
  user_id: string;
  device_id: string;
  entity_type: string;
  operation_type: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
  client_created_at: string;
  server_received_at?: string;
  sync_status: SyncStatus;
  retry_count: number;
  error_message?: string;
}
