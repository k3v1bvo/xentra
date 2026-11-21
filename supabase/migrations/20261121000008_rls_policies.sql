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
