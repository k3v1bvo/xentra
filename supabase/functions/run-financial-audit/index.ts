// Supabase Edge Function: run-financial-audit
// Motor determinista + IA para auditoría preventiva de las finanzas comunitarias

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { otb_id } = await req.json();

  if (!otb_id) {
    return new Response(JSON.stringify({ error: 'otb_id es requerido' }), { status: 400 });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // 1. Obtener proyectos para evaluar R01 (Sobregiro presupuestario)
    const { data: projects } = await supabaseClient
      .from('projects')
      .select('id, title, budget, total_spent, status')
      .eq('otb_id', otb_id);

    // 2. Obtener gastos para evaluar R03 (Gastos sin comprobante)
    const { data: expenses } = await supabaseClient
      .from('expenses')
      .select('id, concept, amount, evidence_url, invoice_number, status')
      .eq('otb_id', otb_id);

    const alertsToInsert: any[] = [];

    // Evaluar R01
    for (const proj of projects || []) {
      if (proj.status !== 'Cancelled' && Number(proj.total_spent) > Number(proj.budget)) {
        alertsToInsert.push({
          otb_id,
          rule_code: 'R01_BUDGET_OVERRUN',
          severity: 'critical',
          title: `Sobregiro Presupuestario en "${proj.title}"`,
          description: `Gasto ejecutado (Bs. ${proj.total_spent}) supera el presupuesto aprobado (Bs. ${proj.budget}).`,
          suggested_action: 'Congelar pagos adicionales y solicitar asamblea para ampliación presupuestaria.',
          entity_type: 'project',
          entity_id: proj.id
        });
      }
    }

    // Evaluar R03
    for (const exp of expenses || []) {
      if (exp.status === 'Executed' && !exp.evidence_url && !exp.invoice_number) {
        alertsToInsert.push({
          otb_id,
          rule_code: 'R03_ORPHAN_EXPENSE',
          severity: 'warning',
          title: 'Egreso sin respaldo documental',
          description: `El egreso por Bs. ${exp.amount} ("${exp.concept}") no cuenta con factura ni comprobante.`,
          suggested_action: 'Exigir al responsable la entrega inmediata del comprobante físico o recibo firmado.',
          entity_type: 'expense',
          entity_id: exp.id
        });
      }
    }

    if (alertsToInsert.length > 0) {
      await supabaseClient.from('financial_alerts').insert(alertsToInsert);
    }

    return new Response(
      JSON.stringify({
        success: true,
        alerts_generated: alertsToInsert.length
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
