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
