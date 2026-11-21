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
