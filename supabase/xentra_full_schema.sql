-- ====================================================================
-- MIGRACIÓN 001: TIPOS BASE Y ARQUITECTURA MULTI-OTB (SAAS MULTI-TENANT)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums Fundamentales
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM (
    'superadmin',
    'presidente',
    'tesorero',
    'secretario',
    'fiscalizador',
    'vecino'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'Draft',
    'PendingVerification',
    'Confirmed',
    'Rejected',
    'Reversed'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'Efectivo',
    'Transferencia',
    'QR',
    'Otro'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE fee_type AS ENUM (
    'Ordinaria',
    'Extraordinaria',
    'AporteEspecial',
    'Proyecto'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE expense_status AS ENUM (
    'Draft',
    'PendingApproval',
    'Approved',
    'Executed',
    'Cancelled'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_category AS ENUM (
    'Pagos',
    'Cuotas',
    'Deudas',
    'Finanzas',
    'Auditoria',
    'TRACE',
    'VOTA',
    'Proyectos',
    'Comunicados',
    'Reuniones',
    'Seguridad',
    'Sincronizacion',
    'Sistema'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM (
    'in_app',
    'push',
    'email'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE audit_severity AS ENUM (
    'info',
    'warning',
    'critical'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE sync_status AS ENUM (
    'pending',
    'syncing',
    'synced',
    'failed',
    'conflict'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Perfiles de Usuario (vinculados a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  ci_number TEXT NOT NULL,
  ci_extension TEXT, -- CBBA, LPZ, SCZ, etc.
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Administradores Globales de la Plataforma (Superadmin)
CREATE TABLE IF NOT EXISTS platform_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_platform_admin_user UNIQUE (user_id)
);

-- 3. Organizaciones Territoriales de Base (OTBs)
CREATE TABLE IF NOT EXISTS otbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- ej: OTB-CBBA-001
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  municipality TEXT NOT NULL,
  zone TEXT NOT NULL,
  address TEXT,
  logo_url TEXT,
  currency TEXT NOT NULL DEFAULT 'BOB',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Membresías Multi-OTB (Mapeo N:M Usuario <-> OTB con rol específico)
CREATE TABLE IF NOT EXISTS otb_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'vecino',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by UUID REFERENCES profiles(id),
  CONSTRAINT uq_otb_user UNIQUE (otb_id, user_id)
);

-- 5. Solicitudes de Incorporación de OTB (Flujo de Onboarding Institucional)
CREATE TABLE IF NOT EXISTS otb_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_user_id UUID NOT NULL REFERENCES profiles(id),
  proposed_name TEXT NOT NULL,
  department TEXT NOT NULL,
  municipality TEXT NOT NULL,
  zone TEXT NOT NULL,
  legal_personhood_number TEXT, -- Personería jurídica
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  review_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Invitaciones de Directiva y Vecinos
CREATE TABLE IF NOT EXISTS otb_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  invitation_code TEXT NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'vecino',
  max_uses INT NOT NULL DEFAULT 1,
  uses_count INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Configuraciones Específicas de cada OTB
CREATE TABLE IF NOT EXISTS otb_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  allow_partial_payments BOOLEAN NOT NULL DEFAULT TRUE,
  late_fee_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  public_transparency_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  require_receipt_evidence BOOLEAN NOT NULL DEFAULT TRUE,
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_otb_settings UNIQUE (otb_id)
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_otb_members_user ON otb_members(user_id);
CREATE INDEX IF NOT EXISTS idx_otb_members_otb_role ON otb_members(otb_id, role);
CREATE INDEX IF NOT EXISTS idx_otbs_code ON otbs(code);
-- ====================================================================
-- MIGRACIÓN 002: VECINOS, VIVIENDAS Y SOLICITUDES DE INGRESO
-- ====================================================================

-- 1. Viviendas y Lotes pertenecientes a cada OTB
CREATE TABLE IF NOT EXISTS houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  block_number TEXT NOT NULL, -- Manzana o Lote
  house_number TEXT NOT NULL,
  street_name TEXT,
  cadastral_code TEXT, -- Código catastral si existe
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_otb_house UNIQUE (otb_id, block_number, house_number)
);

-- 2. Relación Vecinos con Viviendas (Habitantes / Propietarios)
CREATE TABLE IF NOT EXISTS house_residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_primary_owner BOOLEAN NOT NULL DEFAULT FALSE,
  resident_type TEXT NOT NULL DEFAULT 'Propietario' CHECK (resident_type IN ('Propietario', 'Inquilino', 'Familiar')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_house_user UNIQUE (house_id, user_id)
);

-- 3. Solicitudes Individuales de Afiliación Vecinal
CREATE TABLE IF NOT EXISTS member_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  house_id UUID REFERENCES houses(id),
  relationship TEXT NOT NULL DEFAULT 'Propietario',
  block_number_declared TEXT,
  house_number_declared TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_houses_otb ON houses(otb_id);
CREATE INDEX IF NOT EXISTS idx_house_residents_user ON house_residents(user_id);
CREATE INDEX IF NOT EXISTS idx_member_join_requests_otb_status ON member_join_requests(otb_id, status);
-- ====================================================================
-- MIGRACIÓN 003: CORE FINANCIERO, CUOTAS, PAGOS, DEUDAS Y TESORERÍA
-- ====================================================================

-- 1. Cuotas Comunitarias (Tarifario u Obligaciones definidas por la OTB)
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  fee_type fee_type NOT NULL DEFAULT 'Ordinaria',
  due_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Asignación Individual de Cuotas a Vecinos / Viviendas
CREATE TABLE IF NOT EXISTS fee_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_id UUID NOT NULL REFERENCES fees(id) ON DELETE CASCADE,
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  house_id UUID REFERENCES houses(id),
  amount_assigned NUMERIC(14, 2) NOT NULL CHECK (amount_assigned >= 0),
  amount_paid NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (amount_paid >= 0),
  is_settled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fee_user UNIQUE (fee_id, user_id)
);

-- 3. Cajas y Cuentas Financieras
CREATE TABLE IF NOT EXISTS financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('CajaChica', 'Banco', 'BilleteraDigital')),
  bank_name TEXT,
  account_number TEXT,
  current_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Registro de Pagos
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  financial_account_id UUID REFERENCES financial_accounts(id),
  received_by UUID REFERENCES profiles(id),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  method payment_method NOT NULL DEFAULT 'Efectivo',
  status payment_status NOT NULL DEFAULT 'Draft',
  receipt_number TEXT,
  notes TEXT,
  reversal_reason TEXT,
  evidence_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  reversed_at TIMESTAMPTZ
);

-- 5. Imputación / Amortización de Pagos a Cuotas Específicas
CREATE TABLE IF NOT EXISTS payment_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  fee_assignment_id UUID NOT NULL REFERENCES fee_assignments(id) ON DELETE CASCADE,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Categorías de Ingresos y Egresos
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_otb_expense_category UNIQUE (otb_id, name)
);

-- 7. Registro de Egresos / Gastos
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id),
  financial_account_id UUID REFERENCES financial_accounts(id),
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  concept TEXT NOT NULL,
  supplier_name TEXT,
  invoice_number TEXT,
  evidence_url TEXT,
  status expense_status NOT NULL DEFAULT 'Draft',
  created_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Cierres y Arqueos de Caja
CREATE TABLE IF NOT EXISTS cash_register_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  financial_account_id UUID NOT NULL REFERENCES financial_accounts(id),
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_by UUID NOT NULL REFERENCES profiles(id),
  initial_balance NUMERIC(14, 2) NOT NULL,
  system_income NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  system_expenses NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  calculated_balance NUMERIC(14, 2) NOT NULL,
  physical_balance NUMERIC(14, 2) NOT NULL,
  discrepancy NUMERIC(14, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Libro Diario Contable Comunitario (Partida Doble)
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  entry_number BIGSERIAL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  concept TEXT NOT NULL,
  reference_type TEXT, -- 'payment', 'expense', 'closure', 'adjustment'
  reference_id UUID,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  debit NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (debit >= 0),
  credit NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (credit >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fee_assignments_user ON fee_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_fee_assignments_otb_settled ON fee_assignments(otb_id, is_settled);
CREATE INDEX IF NOT EXISTS idx_payments_user_otb ON payments(user_id, otb_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_expenses_otb ON expenses(otb_id);
-- ====================================================================
-- MIGRACIÓN 004: FONDOS COMUNITARIOS, PROYECTOS Y XENTRA TRACE
-- ====================================================================

-- 1. Fondos Comunitarios Específicos (Obras, Mantenimiento, Emergencias, Fiestas)
CREATE TABLE IF NOT EXISTS community_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_amount NUMERIC(14, 2) DEFAULT 0.00,
  current_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Aportes y Alimentación de Fondos
CREATE TABLE IF NOT EXISTS fund_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id UUID NOT NULL REFERENCES community_funds(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  source_type TEXT NOT NULL DEFAULT 'payment' CHECK (source_type IN ('payment', 'direct_donation', 'transfer')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Proyectos Comunitarios de la OTB
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  budget NUMERIC(14, 2) NOT NULL CHECK (budget > 0),
  total_spent NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_spent >= 0),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Planned', 'InProgress', 'Completed', 'Cancelled')),
  start_date DATE,
  end_date DATE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Asignación Presupuestaria de Fondos a Proyectos
CREATE TABLE IF NOT EXISTS project_fund_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES community_funds(id) ON DELETE CASCADE,
  allocated_amount NUMERIC(14, 2) NOT NULL CHECK (allocated_amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_project_fund UNIQUE (project_id, fund_id)
);

-- Alteración de expenses para vincular formalmente a fondos y proyectos (TRACE)
DO $$ BEGIN
  ALTER TABLE expenses ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
  ALTER TABLE expenses ADD COLUMN IF NOT EXISTS fund_id UUID REFERENCES community_funds(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;

-- 5. Publicaciones Oficiales de Trazabilidad (Transparencia Vecinal)
CREATE TABLE IF NOT EXISTS public_trace_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_income NUMERIC(14, 2) NOT NULL,
  total_expenses NUMERIC(14, 2) NOT NULL,
  net_balance NUMERIC(14, 2) NOT NULL,
  summary_json JSONB NOT NULL,
  published_by UUID NOT NULL REFERENCES profiles(id),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_community_funds_otb ON community_funds(otb_id);
CREATE INDEX IF NOT EXISTS idx_projects_otb_status ON projects(otb_id, status);
CREATE INDEX IF NOT EXISTS idx_expenses_project ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_fund ON expenses(fund_id);
-- ====================================================================
-- MIGRACIÓN 005: XENTRA AI AUDITOR Y XENTRA VOTA
-- ====================================================================

-- 1. Configuración de Reglas Deterministas de Auditoría
CREATE TABLE IF NOT EXISTS audit_rule_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  rule_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  severity audit_severity NOT NULL DEFAULT 'warning',
  threshold_value NUMERIC(14, 2),
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT uq_otb_rule UNIQUE (otb_id, rule_code)
);

-- 2. Ejecuciones de Auditoría Financiera
CREATE TABLE IF NOT EXISTS financial_audit_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  executed_by UUID REFERENCES profiles(id),
  total_alerts_found INT NOT NULL DEFAULT 0,
  critical_count INT NOT NULL DEFAULT 0,
  warning_count INT NOT NULL DEFAULT 0,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Alertas Financieras Emitidas
CREATE TABLE IF NOT EXISTS financial_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  audit_run_id UUID REFERENCES financial_audit_runs(id) ON DELETE SET NULL,
  rule_code TEXT NOT NULL,
  severity audit_severity NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_action TEXT,
  entity_type TEXT,
  entity_id UUID,
  is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Resoluciones y Descargos de Alertas
CREATE TABLE IF NOT EXISTS alert_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES financial_alerts(id) ON DELETE CASCADE,
  resolved_by UUID NOT NULL REFERENCES profiles(id),
  resolution_type TEXT NOT NULL CHECK (resolution_type IN ('Justificado', 'Corregido', 'FalsoPositivo')),
  notes TEXT NOT NULL,
  resolved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Informes Narrativos Asistidos por IA
CREATE TABLE IF NOT EXISTS ai_audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  executive_summary TEXT NOT NULL,
  detailed_findings TEXT NOT NULL,
  recommendations TEXT NOT NULL,
  raw_ai_response JSONB,
  generated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- XENTRA VOTA: CONSULTAS Y PARTICIPACIÓN CIUDADANA VECINAL
-- --------------------------------------------------------------------

-- 6. Consultas Vecinales (Votaciones no vinculantes)
CREATE TABLE IF NOT EXISTS voting_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_budget NUMERIC(14, 2),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Opciones de Votación
CREATE TABLE IF NOT EXISTS voting_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES voting_polls(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  votes_count INT NOT NULL DEFAULT 0
);

-- 8. Criterios de Elegibilidad
CREATE TABLE IF NOT EXISTS voting_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES voting_polls(id) ON DELETE CASCADE,
  required_role app_role DEFAULT 'vecino',
  only_primary_owners BOOLEAN NOT NULL DEFAULT FALSE,
  must_be_debt_free BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_poll_eligibility UNIQUE (poll_id)
);

-- 9. Votos Emitidos (Restricción Absoluta de Voto Único)
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES voting_polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES voting_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cast_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_poll_user_vote UNIQUE (poll_id, user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_financial_alerts_otb_resolved ON financial_alerts(otb_id, is_resolved);
CREATE INDEX IF NOT EXISTS idx_voting_polls_otb ON voting_polls(otb_id, is_active);
CREATE INDEX IF NOT EXISTS idx_votes_poll ON votes(poll_id);
-- ====================================================================
-- MIGRACIÓN 006: XENTRA QR Y SUBSISTEMA DE NOTIFICACIONES COMPLETO
-- ====================================================================

-- 1. Recibos Digitales con Código QR Único
CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  receipt_number TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  concept TEXT NOT NULL,
  payment_method payment_method NOT NULL,
  token_hash TEXT NOT NULL, -- SHA-256 del token aleatorio
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  revocation_reason TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_receipt_number UNIQUE (otb_id, receipt_number),
  CONSTRAINT uq_payment_receipt UNIQUE (payment_id)
);

-- 2. Bitácora de Verificaciones del Recibo (Escaneo de QR)
CREATE TABLE IF NOT EXISTS receipt_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES payment_receipts(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  is_valid BOOLEAN NOT NULL,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- SUBSISTEMA TRANSVERSAL DE NOTIFICACIONES (TRANSACTIONAL OUTBOX)
-- --------------------------------------------------------------------

-- 3. Notificaciones Internas Persistentes (In-App)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  category notification_category NOT NULL DEFAULT 'Finanzas',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority notification_priority NOT NULL DEFAULT 'normal',
  entity_type TEXT,
  entity_id UUID,
  action_route TEXT,
  safe_payload JSONB,
  dedupe_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  CONSTRAINT uq_notification_dedupe UNIQUE (recipient_user_id, dedupe_key)
);

-- 4. Preferencias de Notificación del Usuario
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  category notification_category NOT NULL,
  channel notification_channel NOT NULL DEFAULT 'in_app',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone TEXT DEFAULT 'America/La_Paz',
  CONSTRAINT uq_user_pref UNIQUE (user_id, otb_id, category, channel)
);

-- 5. Outbox Transaccional para Eventos de Notificación
CREATE TABLE IF NOT EXISTS notification_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
  attempt_count INT NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 6. Registro de Entregas Multicanal
CREATE TABLE IF NOT EXISTS notification_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered')),
  provider TEXT NOT NULL, -- 'expo', 'web_push', 'resend'
  provider_message_id TEXT,
  attempt_count INT NOT NULL DEFAULT 1,
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tokens de Dispositivos para Notificaciones Push (Web Push & Expo)
CREATE TABLE IF NOT EXISTS device_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('web', 'android', 'ios')),
  push_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_device_token UNIQUE (user_id, push_token)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_receipts_token_hash ON payment_receipts(token_hash);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_otb_category ON notifications(otb_id, category);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_status ON notification_outbox(status, next_retry_at);
-- ====================================================================
-- MIGRACIÓN 007: COMUNICADOS, REUNIONES, AUDITORÍA Y SINCRONIZACIÓN OFFLINE
-- ====================================================================

-- 1. Comunicados Oficiales de la Directiva
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('General', 'Urgente', 'Convocatoria', 'Financiero')),
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  published_by UUID NOT NULL REFERENCES profiles(id),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Reuniones y Asambleas Generales
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Control de Asistencia a Reuniones
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Presente' CHECK (status IN ('Presente', 'Falta', 'Licencia')),
  registered_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_meeting_user_attendance UNIQUE (meeting_id, user_id)
);

-- 4. Libro de Actas
CREATE TABLE IF NOT EXISTS minutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  decisions TEXT,
  written_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_meeting_minutes UNIQUE (meeting_id)
);

-- 5. Registro Transaccional de Auditoría de Seguridad (Audit Logs)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  otb_id UUID REFERENCES otbs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Dispositivos Autorizados
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  platform TEXT NOT NULL,
  app_version TEXT,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_device UNIQUE (user_id, device_id)
);

-- 7. Registro de Operaciones Offline Sincronizadas
CREATE TABLE IF NOT EXISTS sync_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id UUID NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  otb_id UUID NOT NULL REFERENCES otbs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  client_created_at TIMESTAMPTZ NOT NULL,
  server_received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sync_status sync_status NOT NULL DEFAULT 'synced',
  error_message TEXT
);

-- 8. Conflictos de Operación Detectados
CREATE TABLE IF NOT EXISTS operation_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_operation_id UUID NOT NULL REFERENCES sync_operations(id) ON DELETE CASCADE,
  conflict_reason TEXT NOT NULL,
  server_state JSONB NOT NULL,
  client_state JSONB NOT NULL,
  resolution_type TEXT CHECK (resolution_type IN ('server_wins', 'client_wins', 'manual_resolved')),
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_audit_logs_otb_created ON audit_logs(otb_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sync_operations_idempotency ON sync_operations(idempotency_key);
-- ====================================================================
-- MIGRACIÓN 008: POLÍTICAS DE ROW LEVEL SECURITY (RLS) EXHAUSTIVAS
-- ====================================================================

-- Funciones Auxiliares de Seguridad (SECURITY DEFINER)

-- 1. Comprueba si el usuario autenticado es Superadministrador Global
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM platform_admins WHERE user_id = auth.uid()
  );
$$;

-- 2. Comprueba si el usuario autenticado tiene uno de los roles permitidos en una OTB
CREATE OR REPLACE FUNCTION has_otb_role(target_otb_id UUID, allowed_roles app_role[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM otb_members
    WHERE otb_id = target_otb_id
      AND user_id = auth.uid()
      AND is_active = TRUE
      AND role = ANY(allowed_roles)
  );
$$;

-- 3. Comprueba si el usuario autenticado es miembro activo de una OTB
CREATE OR REPLACE FUNCTION is_otb_member(target_otb_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM otb_members
    WHERE otb_id = target_otb_id
      AND user_id = auth.uid()
      AND is_active = TRUE
  );
$$;

-- ====================================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE otbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE otb_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE otb_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE otb_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE otb_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_join_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_register_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;

ALTER TABLE community_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_fund_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_trace_publications ENABLE ROW LEVEL SECURITY;

ALTER TABLE audit_rule_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_audit_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_audit_reports ENABLE ROW LEVEL SECURITY;

ALTER TABLE voting_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_push_tokens ENABLE ROW LEVEL SECURITY;

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_conflicts ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- POLÍTICAS ESPECÍFICAS
-- ====================================================================

-- 1. PROFILES
CREATE POLICY "Usuarios pueden ver su propio perfil y el de su OTB"
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR
    is_platform_admin() OR
    EXISTS (
      SELECT 1 FROM otb_members m1
      JOIN otb_members m2 ON m1.otb_id = m2.otb_id
      WHERE m1.user_id = auth.uid() AND m2.user_id = profiles.id
    )
  );

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 2. OTBS
CREATE POLICY "Lectura de OTB para miembros, superadmin o activas públicas"
  ON otbs FOR SELECT
  USING (is_active = TRUE OR is_platform_admin() OR is_otb_member(id));

CREATE POLICY "Superadmin puede crear y modificar OTBs"
  ON otbs FOR ALL
  USING (is_platform_admin());

-- 3. OTB_MEMBERS
CREATE POLICY "Ver miembros de su misma OTB"
  ON otb_members FOR SELECT
  USING (is_platform_admin() OR is_otb_member(otb_id));

CREATE POLICY "Directiva puede gestionar miembros"
  ON otb_members FOR ALL
  USING (
    is_platform_admin() OR
    has_otb_role(otb_id, ARRAY['presidente', 'secretario']::app_role[])
  );

-- 4. PAYMENTS
CREATE POLICY "Vecinos ven solo sus pagos; directiva ve todos los de la OTB"
  ON payments FOR SELECT
  USING (
    is_platform_admin() OR
    (user_id = auth.uid() AND is_otb_member(otb_id)) OR
    has_otb_role(otb_id, ARRAY['presidente', 'tesorero', 'fiscalizador']::app_role[])
  );

CREATE POLICY "Solo tesorero puede registrar y actualizar pagos"
  ON payments FOR INSERT
  WITH CHECK (
    is_platform_admin() OR
    has_otb_role(otb_id, ARRAY['tesorero']::app_role[])
  );

CREATE POLICY "Solo tesorero o presidente pueden actualizar pagos"
  ON payments FOR UPDATE
  USING (
    is_platform_admin() OR
    has_otb_role(otb_id, ARRAY['tesorero', 'presidente']::app_role[])
  );

-- 5. FEE_ASSIGNMENTS
CREATE POLICY "Vecinos ven solo sus cuotas asignadas; directiva ve todas"
  ON fee_assignments FOR SELECT
  USING (
    is_platform_admin() OR
    (user_id = auth.uid() AND is_otb_member(otb_id)) OR
    has_otb_role(otb_id, ARRAY['presidente', 'tesorero', 'secretario', 'fiscalizador']::app_role[])
  );

-- 6. NOTIFICATIONS
CREATE POLICY "Usuarios ven exclusivamente sus propias notificaciones"
  ON notifications FOR SELECT
  USING (recipient_user_id = auth.uid() OR is_platform_admin());

CREATE POLICY "Usuarios actualizan solo sus propias notificaciones"
  ON notifications FOR UPDATE
  USING (recipient_user_id = auth.uid())
  WITH CHECK (recipient_user_id = auth.uid());

-- 7. NOTIFICATION_PREFERENCES
CREATE POLICY "Gestionar solo sus preferencias de notificación"
  ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- 8. PAYMENT_RECEIPTS
CREATE POLICY "Vecino ve su recibo, directiva ve recibos de su OTB"
  ON payment_receipts FOR SELECT
  USING (
    is_platform_admin() OR
    EXISTS (SELECT 1 FROM payments p WHERE p.id = payment_receipts.payment_id AND p.user_id = auth.uid()) OR
    has_otb_role(otb_id, ARRAY['presidente', 'tesorero', 'fiscalizador']::app_role[])
  );

-- 9. VOTES
CREATE POLICY "Vecino emite su propio voto"
  ON votes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Vecino ve solo si ha votado; conteo agregado es público"
  ON votes FOR SELECT
  USING (user_id = auth.uid() OR is_platform_admin());

-- 10. PUBLIC_TRACE_PUBLICATIONS
CREATE POLICY "Cualquier miembro de la OTB puede ver publicaciones de trazabilidad"
  ON public_trace_publications FOR SELECT
  USING (is_otb_member(otb_id) OR is_platform_admin());
-- ====================================================================
-- MIGRACIÓN 009: TRIGGERS, INTEGRIDAD FINANCIERA Y TRANSACTIONAL OUTBOX
-- ====================================================================

-- 1. TRIGGER: Inmutabilidad Financiera (Prohibir DELETE en pagos confirmados)
CREATE OR REPLACE FUNCTION check_payment_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status = 'Confirmed' THEN
    RAISE EXCEPTION 'No se permite eliminar transacciones financieras confirmadas. Debe realizarse una reversión autorizada (Reversed).';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_payment_immutability ON payments;
CREATE TRIGGER trg_payment_immutability
  BEFORE DELETE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION check_payment_immutability();

-- 2. TRIGGER: Generación Automática de Recibo Digital al Confirmar Pago
CREATE OR REPLACE FUNCTION generate_receipt_on_payment_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_otb_code TEXT;
  v_seq INT;
  v_receipt_number TEXT;
  v_raw_token TEXT;
  v_token_hash TEXT;
BEGIN
  IF NEW.status = 'Confirmed' AND (OLD.status IS NULL OR OLD.status != 'Confirmed') THEN
    -- Obtener código de la OTB
    SELECT code INTO v_otb_code FROM otbs WHERE id = NEW.otb_id;
    
    -- Calcular número correlativo
    SELECT COALESCE(COUNT(*), 0) + 1 INTO v_seq FROM payment_receipts WHERE otb_id = NEW.otb_id;
    v_receipt_number := COALESCE(v_otb_code, 'REC') || '-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(v_seq::TEXT, 5, '0');

    -- Generar token aleatorio criptográfico
    v_raw_token := encode(gen_random_bytes(32), 'hex');
    v_token_hash := encode(digest(v_raw_token, 'sha256'), 'hex');

    -- Insertar recibo digital
    INSERT INTO payment_receipts (
      payment_id,
      otb_id,
      receipt_number,
      amount,
      concept,
      payment_method,
      token_hash,
      issued_at
    ) VALUES (
      NEW.id,
      NEW.otb_id,
      v_receipt_number,
      NEW.amount,
      COALESCE(NEW.notes, 'Pago de cuota comunitaria'),
      NEW.method,
      v_token_hash,
      NOW()
    ) ON CONFLICT (payment_id) DO NOTHING;

    -- Actualizar número en el registro de pago
    NEW.receipt_number := v_receipt_number;

    -- Encolar evento en Outbox para Notificaciones
    INSERT INTO notification_outbox (
      otb_id,
      event_type,
      event_payload,
      idempotency_key
    ) VALUES (
      NEW.otb_id,
      'PAYMENT_CONFIRMED',
      jsonb_build_object(
        'payment_id', NEW.id,
        'user_id', NEW.user_id,
        'amount', NEW.amount,
        'receipt_number', v_receipt_number,
        'method', NEW.method
      ),
      'outbox:payment_confirmed:' || NEW.id
    ) ON CONFLICT (idempotency_key) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_payment_receipt_and_outbox ON payments;
CREATE TRIGGER trg_payment_receipt_and_outbox
  BEFORE INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION generate_receipt_on_payment_confirmation();

-- 3. TRIGGER: Actualización Automática de Amortización en Fee Assignments
CREATE OR REPLACE FUNCTION update_fee_assignment_settlement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_paid NUMERIC(14, 2);
  v_assigned NUMERIC(14, 2);
BEGIN
  -- Sumar total amortizado para la cuota asignada
  SELECT COALESCE(SUM(pa.amount), 0) INTO v_total_paid
  FROM payment_allocations pa
  JOIN payments p ON p.id = pa.payment_id
  WHERE pa.fee_assignment_id = NEW.fee_assignment_id
    AND p.status = 'Confirmed';

  SELECT amount_assigned INTO v_assigned
  FROM fee_assignments
  WHERE id = NEW.fee_assignment_id;

  UPDATE fee_assignments
  SET amount_paid = v_total_paid,
      is_settled = (v_total_paid >= v_assigned)
  WHERE id = NEW.fee_assignment_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_fee_settlement ON payment_allocations;
CREATE TRIGGER trg_update_fee_settlement
  AFTER INSERT OR UPDATE ON payment_allocations
  FOR EACH ROW
  EXECUTE FUNCTION update_fee_assignment_settlement();
-- ====================================================================
-- MIGRACIÓN 010: DATOS DE DEMOSTRACIÓN (BOLIVIA - BOB / Bs.)
-- ====================================================================

DO $$
DECLARE
  v_otb1_id UUID := '11111111-1111-1111-1111-111111111111';
  v_otb2_id UUID := '22222222-2222-2222-2222-222222222222';
  v_otb3_id UUID := '33333333-3333-3333-3333-333333333333';
  
  -- Usuarios Demo
  v_admin_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  v_pres1_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  v_tes1_id  UUID := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  v_vec1_id  UUID := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
  v_vec2_id  UUID := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

  -- Viviendas
  v_h1_id UUID := 'f1111111-1111-1111-1111-111111111111';
  v_h2_id UUID := 'f2222222-2222-2222-2222-222222222222';

  -- Cuotas
  v_fee1_id UUID := 'e1111111-1111-1111-1111-111111111111';
  v_fee2_id UUID := 'e2222222-2222-2222-2222-222222222222';

  -- Cajas y Fondos
  v_acc1_id UUID := 'c1111111-1111-1111-1111-111111111111';
  v_fund1_id UUID := 'd1111111-1111-1111-1111-111111111111';
  v_proj1_id UUID := 'a1111111-1111-1111-1111-111111111111';
BEGIN

  -- 1. OTBs Demo
  INSERT INTO otbs (id, code, name, department, municipality, zone, address, currency)
  VALUES 
    (v_otb1_id, 'OTB-CBBA-001', 'Villa Esperanza', 'Cochabamba', 'Cochabamba (Cercado)', 'Zona Sud - Distrito 8', 'Av. Petrolera Km 4', 'BOB'),
    (v_otb2_id, 'OTB-LPZ-002', 'Los Pinos', 'La Paz', 'La Paz (Murillo)', 'Zona Sur - Calacoto', 'Calle 25 de Los Pinos', 'BOB'),
    (v_otb3_id, 'OTB-SCZ-003', 'San Miguel', 'Santa Cruz', 'Santa Cruz de la Sierra', 'Plan 3000', 'Av. Paurito', 'BOB')
  ON CONFLICT (id) DO NOTHING;

  -- 1.5. Usuarios Demo en auth.users (necesarios para satisfacer la foreign key profiles_id_fkey)
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES 
    (v_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carlos.admin@xentra.app', crypt('xentra2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"],"admin_created":"true"}'::jsonb, '{"first_name":"Carlos","last_name":"Mamani"}'::jsonb, now(), now()),
    (v_pres1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'roberto.presidencia@xentra.app', crypt('xentra2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"],"admin_created":"true"}'::jsonb, '{"first_name":"Roberto","last_name":"Fernández"}'::jsonb, now(), now()),
    (v_tes1_id,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marina.tesoreria@xentra.app', crypt('xentra2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"],"admin_created":"true"}'::jsonb, '{"first_name":"Marina","last_name":"Condori"}'::jsonb, now(), now()),
    (v_vec1_id,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'juan.vecino@xentra.app', crypt('xentra2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"],"admin_created":"true"}'::jsonb, '{"first_name":"Juan José","last_name":"Flores"}'::jsonb, now(), now()),
    (v_vec2_id,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'silvia.vecina@xentra.app', crypt('xentra2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"],"admin_created":"true"}'::jsonb, '{"first_name":"Silvia","last_name":"Rojas"}'::jsonb, now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 1.6. Identidades Demo para inicio de sesión por email
  BEGIN
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES
      (v_admin_id, v_admin_id, format('{"sub":"%s","email":"%s"}', v_admin_id, 'carlos.admin@xentra.app')::jsonb, 'email', v_admin_id::text, now(), now(), now()),
      (v_pres1_id, v_pres1_id, format('{"sub":"%s","email":"%s"}', v_pres1_id, 'roberto.presidencia@xentra.app')::jsonb, 'email', v_pres1_id::text, now(), now(), now()),
      (v_tes1_id,  v_tes1_id,  format('{"sub":"%s","email":"%s"}', v_tes1_id,  'marina.tesoreria@xentra.app')::jsonb, 'email', v_tes1_id::text, now(), now(), now()),
      (v_vec1_id,  v_vec1_id,  format('{"sub":"%s","email":"%s"}', v_vec1_id,  'juan.vecino@xentra.app')::jsonb, 'email', v_vec1_id::text, now(), now(), now()),
      (v_vec2_id,  v_vec2_id,  format('{"sub":"%s","email":"%s"}', v_vec2_id,  'silvia.vecina@xentra.app')::jsonb, 'email', v_vec2_id::text, now(), now(), now())
    ON CONFLICT DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- 2. Perfiles Demo (Enlazados correctamente a auth.users)
  INSERT INTO profiles (id, first_name, last_name, ci_number, ci_extension, phone)
  VALUES
    (v_admin_id, 'Carlos', 'Mamani Quispe', '4589210', 'CBBA', '71234567'),
    (v_pres1_id, 'Roberto', 'Fernández Vargas', '5289341', 'CBBA', '72345678'),
    (v_tes1_id,  'Marina', 'Condori Rocha', '6398412', 'CBBA', '73456789'),
    (v_vec1_id,  'Juan José', 'Flores Morales', '7412589', 'CBBA', '74567890'),
    (v_vec2_id,  'Silvia', 'Rojas Torrico', '8521479', 'CBBA', '75678901')
  ON CONFLICT (id) DO NOTHING;

  -- 3. Superadministrador
  INSERT INTO platform_admins (user_id)
  VALUES (v_admin_id)
  ON CONFLICT DO NOTHING;

  -- 4. Membresías en Villa Esperanza
  INSERT INTO otb_members (otb_id, user_id, role)
  VALUES
    (v_otb1_id, v_pres1_id, 'presidente'),
    (v_otb1_id, v_tes1_id,  'tesorero'),
    (v_otb1_id, v_vec1_id,  'vecino'),
    (v_otb1_id, v_vec2_id,  'vecino')
  ON CONFLICT DO NOTHING;

  -- 5. Viviendas
  INSERT INTO houses (id, otb_id, block_number, house_number, street_name)
  VALUES
    (v_h1_id, v_otb1_id, 'Manzana A', 'Lote 12', 'Calle Los Álamos'),
    (v_h2_id, v_otb1_id, 'Manzana B', 'Lote 05', 'Av. Primavera')
  ON CONFLICT DO NOTHING;

  -- 6. Cuenta Financiera y Caja Chica
  INSERT INTO financial_accounts (id, otb_id, name, account_type, bank_name, current_balance)
  VALUES
    (v_acc1_id, v_otb1_id, 'Caja Central Efectivo', 'CajaChica', 'Efectivo en Custodia', 4250.00)
  ON CONFLICT DO NOTHING;

  -- 7. Fondo de Obras
  INSERT INTO community_funds (id, otb_id, name, description, target_amount, current_balance)
  VALUES
    (v_fund1_id, v_otb1_id, 'Fondo Comunitario Pro-Tinglado', 'Aportes recaudados para techado de la cancha', 15000.00, 8500.00)
  ON CONFLICT DO NOTHING;

  -- 8. Proyecto Comunitario
  INSERT INTO projects (id, otb_id, title, description, budget, total_spent, status, created_by)
  VALUES
    (v_proj1_id, v_otb1_id, 'Tinglado y Graderías Cancha Polifuncional', 'Techado con estructura metálica y pintado de cancha comunitaria', 15000.00, 6200.00, 'InProgress', v_pres1_id)
  ON CONFLICT DO NOTHING;

  -- 9. Cuotas
  INSERT INTO fees (id, otb_id, title, description, amount, fee_type, due_date, created_by)
  VALUES
    (v_fee1_id, v_otb1_id, 'Cuota Ordinaria Noviembre 2026', 'Mantenimiento de alumbrado y limpieza', 25.00, 'Ordinaria', '2026-11-30', v_pres1_id),
    (v_fee2_id, v_otb1_id, 'Aporte Pro-Tinglado Cuota 1', 'Aporte extraordinario para perfiles metálicos', 100.00, 'AporteEspecial', '2026-11-15', v_pres1_id)
  ON CONFLICT DO NOTHING;

  -- 10. Asignación de Cuotas
  INSERT INTO fee_assignments (fee_id, otb_id, user_id, house_id, amount_assigned, amount_paid, is_settled)
  VALUES
    (v_fee1_id, v_otb1_id, v_vec1_id, v_h1_id, 25.00, 25.00, TRUE),
    (v_fee2_id, v_otb1_id, v_vec1_id, v_h1_id, 100.00, 50.00, FALSE),
    (v_fee1_id, v_otb1_id, v_vec2_id, v_h2_id, 25.00, 0.00, FALSE),
    (v_fee2_id, v_otb1_id, v_vec2_id, v_h2_id, 100.00, 0.00, FALSE)
  ON CONFLICT DO NOTHING;

  -- 11. Notificaciones de Demostración
  INSERT INTO notifications (recipient_user_id, otb_id, type, category, title, body, priority, dedupe_key)
  VALUES
    (v_vec1_id, v_otb1_id, 'FEE_DUE', 'Cuotas', 'Próximo vencimiento de cuota', 'La Cuota Ordinaria de Noviembre por Bs. 25,00 vence el 30/11/2026.', 'normal', 'notif_demo_01'),
    (v_vec1_id, v_otb1_id, 'PAYMENT_RECEIVED', 'Pagos', 'Pago verificado correctamente', 'Se confirmó su abono de Bs. 50,00 para el Fondo Pro-Tinglado.', 'high', 'notif_demo_02'),
    (v_pres1_id, v_otb1_id, 'AUDIT_ALERT', 'Auditoria', 'Alerta Financiera Preventiva', 'Se detectó un egreso de Bs. 850 sin factura adjunta en materiales.', 'high', 'notif_demo_03')
  ON CONFLICT DO NOTHING;

END $$;

-- ==============================================================================
-- 11. BUCKETS DE STORAGE Y PUBLICACI�N REALTIME
-- ==============================================================================

-- Creaci�n de Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('payment-proofs', 'payment-proofs', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('expense-receipts', 'expense-receipts', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('reports', 'reports', true, 10485760, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
ON CONFLICT (id) DO NOTHING;

-- Pol�ticas de Storage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Lectura de comprobantes de gastos'
  ) THEN
    CREATE POLICY "Lectura de comprobantes de gastos" ON storage.objects
      FOR SELECT TO authenticated, anon
      USING (bucket_id IN ('expense-receipts', 'reports'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Subida de comprobantes y pagos'
  ) THEN
    CREATE POLICY "Subida de comprobantes y pagos" ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id IN ('payment-proofs', 'expense-receipts', 'reports'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Lectura de comprobantes de pago'
  ) THEN
    CREATE POLICY "Lectura de comprobantes de pago" ON storage.objects
      FOR SELECT TO authenticated
      USING (bucket_id = 'payment-proofs');
  END IF;
END $$;

-- Habilitar Supabase Realtime para notificaciones en vivo
ALTER PUBLICATION supabase_realtime ADD TABLE notifications, announcements, payments;

-- ==============================================================================
-- 12. PERMISOS DE ESQUEMA PARA POSTGREST (ANON Y AUTHENTICATED)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
