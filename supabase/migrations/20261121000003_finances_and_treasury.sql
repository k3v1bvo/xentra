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
