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
