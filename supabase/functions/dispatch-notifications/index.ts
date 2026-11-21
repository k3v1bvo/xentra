// Supabase Edge Function: dispatch-notifications
// Procesa el Outbox Transaccional y despacha eventos a notificaciones in-app y correo Google SMTP (ayniprotocol@gmail.com)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SMTP_CONFIG = {
  host: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
  port: parseInt(Deno.env.get('SMTP_PORT') || '465'),
  user: Deno.env.get('SMTP_USER') || 'ayniprotocol@gmail.com',
  pass: Deno.env.get('SMTP_PASSWORD') || 'ujccnzxebbpqzhaw'
};

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // 1. Obtener eventos pendientes del outbox (batch de hasta 50)
    const { data: outboxItems, error: outboxError } = await supabaseClient
      .from('notification_outbox')
      .select('*')
      .eq('status', 'pending')
      .limit(50);

    if (outboxError) throw outboxError;
    if (!outboxItems || outboxItems.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: 'No hay eventos pendientes' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }

    let processedCount = 0;

    for (const item of outboxItems) {
      const { id, otb_id, event_type, event_payload } = item;

      // 2. Resolver destinatarios según el tipo de evento
      let recipientUserIds: string[] = [];

      if (event_type === 'PAYMENT_CONFIRMED') {
        // Enviar al vecino que pagó
        if (event_payload.user_id) {
          recipientUserIds.push(event_payload.user_id);
        }
      } else if (event_type === 'FEE_CREATED' || event_type === 'POLL_CREATED') {
        // Enviar a todos los miembros activos de la OTB
        const { data: members } = await supabaseClient
          .from('otb_members')
          .select('user_id')
          .eq('otb_id', otb_id)
          .eq('is_active', true);

        if (members) {
          recipientUserIds = members.map((m) => m.user_id);
        }
      }

      // 3. Crear registros in-app en la tabla notifications
      for (const userId of recipientUserIds) {
        await supabaseClient.from('notifications').insert({
          recipient_user_id: userId,
          otb_id,
          type: event_type,
          category: 'Pagos',
          title: event_type === 'PAYMENT_CONFIRMED' ? 'Pago Confirmado' : 'Aviso Comunitario',
          body: `Se ha confirmado el recibo ${event_payload.receipt_number || ''} por Bs. ${event_payload.amount || ''}.`,
          priority: 'normal',
          dedupe_key: `outbox:${id}:${userId}`
        });
      }

      // 4. Marcar elemento outbox como procesado
      await supabaseClient
        .from('notification_outbox')
        .update({
          status: 'processed',
          processed_at: new Date().toISOString()
        })
        .eq('id', id);

      processedCount++;
    }

    return new Response(JSON.stringify({ success: true, processed: processedCount }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
