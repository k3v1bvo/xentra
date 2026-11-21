// Supabase Edge Function: verify-payment-receipt
// Endpoint público HTTPS para validación criptográfica de recibos QR sin exponer PII

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const url = new URL(req.url);
  const receiptNumber = url.searchParams.get('receipt_number');
  const token = url.searchParams.get('token');

  if (!receiptNumber || !token) {
    return new Response(JSON.stringify({ error: 'Parámetros insuficientes' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  try {
    // 1. Calcular hash SHA-256 del token provisto
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    // 2. Buscar recibo correspondiente
    const { data: receipt, error } = await supabaseClient
      .from('payment_receipts')
      .select('id, receipt_number, amount, concept, payment_method, issued_at, is_revoked, otb:otbs(name, code)')
      .eq('receipt_number', receiptNumber)
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (error || !receipt) {
      return new Response(JSON.stringify({ is_valid: false, message: 'Recibo no válido o no encontrado' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404
      });
    }

    // 3. Registrar escaneo en bitácora
    await supabaseClient.from('receipt_verification_logs').insert({
      receipt_id: receipt.id,
      ip_address: req.headers.get('x-forwarded-for') || 'anon',
      user_agent: req.headers.get('user-agent') || 'qr_scanner',
      is_valid: !receipt.is_revoked
    });

    // 4. Devolver respuesta segura (sin datos personales de identidad del vecino)
    return new Response(
      JSON.stringify({
        is_valid: !receipt.is_revoked,
        receipt_number: receipt.receipt_number,
        amount: receipt.amount,
        concept: receipt.concept,
        payment_method: receipt.payment_method,
        issued_at: receipt.issued_at,
        otb_name: (receipt.otb as any)?.name || 'OTB',
        status: receipt.is_revoked ? 'REVERTIDO' : 'VÁLIDO_CONFIRMADO'
      }),
      {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 200
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
