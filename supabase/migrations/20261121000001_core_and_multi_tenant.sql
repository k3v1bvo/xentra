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
