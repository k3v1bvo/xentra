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
