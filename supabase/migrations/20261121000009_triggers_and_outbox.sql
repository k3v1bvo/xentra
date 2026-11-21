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
