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
