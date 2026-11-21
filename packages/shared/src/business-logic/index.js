/**
 * Calcula la deuda total acumulada para un usuario a partir de sus cuotas asignadas
 */
export function calculateUserDebt(assignments) {
    let totalAssigned = 0;
    let totalPaid = 0;
    let unsettledCount = 0;
    for (const a of assignments) {
        totalAssigned += Number(a.amount_assigned || 0);
        totalPaid += Number(a.amount_paid || 0);
        if (!a.is_settled && a.amount_assigned > a.amount_paid) {
            unsettledCount++;
        }
    }
    const pendingDebt = Math.max(0, Math.round((totalAssigned - totalPaid) * 100) / 100);
    return {
        totalAssigned: Math.round(totalAssigned * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        pendingDebt,
        unsettledCount
    };
}
/**
 * Motor de asignación de pagos (Amortización cronológica de cuotas)
 * Aplica el monto disponible a las cuotas más antiguas primero
 */
export function allocatePaymentToAssignments(paymentAmount, pendingAssignments) {
    // Ordenar por fecha de vencimiento ascendente (la más antigua primero)
    const sorted = [...pendingAssignments].sort((a, b) => {
        const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
        const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
        return dateA - dateB;
    });
    let remaining = paymentAmount;
    const allocations = [];
    for (const assignment of sorted) {
        if (remaining <= 0)
            break;
        const pendingOnAssignment = Math.max(0, Number(assignment.amount_assigned) - Number(assignment.amount_paid));
        if (pendingOnAssignment > 0) {
            const applyAmount = Math.min(remaining, pendingOnAssignment);
            allocations.push({
                fee_assignment_id: assignment.id,
                amount: Math.round(applyAmount * 100) / 100
            });
            remaining -= applyAmount;
        }
    }
    return {
        allocations,
        remainingUnallocated: Math.max(0, Math.round(remaining * 100) / 100)
    };
}
/**
 * Motor determinista de XENTRA AI Auditor
 * Evalúa reglas financieras estrictas y emite alertas estructuradas
 */
export function runDeterministicAuditRules(params) {
    const alerts = [];
    const now = new Date().toISOString();
    // R01: Sobregiro en Proyectos
    for (const proj of params.projects) {
        if (proj.status !== 'Cancelled' && Number(proj.total_spent) > Number(proj.budget)) {
            const overrun = Number(proj.total_spent) - Number(proj.budget);
            alerts.push({
                id: `alert-r01-${proj.id}`,
                otb_id: params.otbId,
                rule_code: 'R01_BUDGET_OVERRUN',
                severity: 'critical',
                title: `Sobregiro Presupuestario en "${proj.title}"`,
                description: `El proyecto ha ejecutado Bs. ${proj.total_spent}, superando su presupuesto de Bs. ${proj.budget} por Bs. ${overrun.toFixed(2)}.`,
                suggested_action: 'Congelar aprobaciones de egresos adicionales y convocar reunión de directiva para ampliación de presupuesto.',
                entity_type: 'project',
                entity_id: proj.id,
                is_resolved: false,
                created_at: now
            });
        }
    }
    // R02: Pagos Duplicados Sospechosos (mismo vecino, mismo importe en < 48h)
    const confirmedPayments = params.payments.filter(p => p.status === 'Confirmed');
    for (let i = 0; i < confirmedPayments.length; i++) {
        for (let j = i + 1; j < confirmedPayments.length; j++) {
            const p1 = confirmedPayments[i];
            const p2 = confirmedPayments[j];
            if (p1.user_id === p2.user_id && Math.abs(Number(p1.amount) - Number(p2.amount)) < 0.01) {
                const timeDiff = Math.abs(new Date(p1.created_at).getTime() - new Date(p2.created_at).getTime());
                const hours = timeDiff / (1000 * 60 * 60);
                if (hours <= 48) {
                    alerts.push({
                        id: `alert-r02-${p1.id}-${p2.id}`,
                        otb_id: params.otbId,
                        rule_code: 'R02_DUPLICATE_PAYMENT',
                        severity: 'warning',
                        title: 'Posible Pago Duplicado Detectado',
                        description: `Se detectaron 2 pagos de Bs. ${p1.amount} para el mismo vecino con intervalo de ${Math.round(hours)} horas (Recibos: ${p1.receipt_number || p1.id} y ${p2.receipt_number || p2.id}).`,
                        suggested_action: 'Verificar comprobantes físicos o bancarios para descartar doble registro involuntario.',
                        entity_type: 'payment',
                        entity_id: p2.id,
                        is_resolved: false,
                        created_at: now
                    });
                }
            }
        }
    }
    // R03: Gastos Sin Comprobante / Evidencia
    for (const exp of params.expenses) {
        if (exp.status === 'Executed' && !exp.evidence_url && !exp.invoice_number) {
            alerts.push({
                id: `alert-r03-${exp.id}`,
                otb_id: params.otbId,
                rule_code: 'R03_ORPHAN_EXPENSE',
                severity: 'warning',
                title: `Gasto ejecutado sin respaldo documental`,
                description: `El egreso por Bs. ${exp.amount} ("${exp.concept}") no cuenta con factura ni comprobante digital adjunto.`,
                suggested_action: 'Solicitar al responsable de compra subir la fotografía del recibo/factura al sistema.',
                entity_type: 'expense',
                entity_id: exp.id,
                is_resolved: false,
                created_at: now
            });
        }
    }
    // R04: Descuadres en Cierre de Caja
    for (const closure of params.closures) {
        if (Math.abs(Number(closure.discrepancy)) > 1.0) {
            const isShortage = Number(closure.discrepancy) < 0;
            alerts.push({
                id: `alert-r04-${closure.id}`,
                otb_id: params.otbId,
                rule_code: 'R04_CASH_DISCREPANCY',
                severity: 'critical',
                title: `Discrepancia en Arqueo de Caja (${isShortage ? 'Faltante' : 'Sobrante'})`,
                description: `Se detectó una discrepancia de Bs. ${Math.abs(closure.discrepancy).toFixed(2)} entre el conteo físico y el saldo contable en el cierre del ${closure.closed_at.slice(0, 10)}.`,
                suggested_action: 'El fiscalizador y tesorero deben auditar las boletas físicas emitidas en dicho turno.',
                entity_type: 'cash_register_closure',
                entity_id: closure.id,
                is_resolved: false,
                created_at: now
            });
        }
    }
    return alerts;
}
export function buildTraceGraph(params) {
    const nodes = [];
    const links = [];
    // Nodos de Fondos
    for (const f of params.funds) {
        nodes.push({
            id: f.id,
            name: `Fondo: ${f.name}`,
            category: 'Fondo',
            amount: Number(f.current_balance)
        });
    }
    // Nodos de Proyectos
    for (const p of params.projects) {
        nodes.push({
            id: p.id,
            name: `Proyecto: ${p.title}`,
            category: 'Proyecto',
            amount: Number(p.budget)
        });
    }
    // Nodos de Gastos y Enlaces
    for (const e of params.expenses) {
        const expenseNodeId = `exp-${e.id}`;
        nodes.push({
            id: expenseNodeId,
            name: e.concept,
            category: 'Gasto',
            amount: Number(e.amount)
        });
        if (e.project_id) {
            links.push({
                source: e.project_id,
                target: expenseNodeId,
                value: Number(e.amount),
                label: 'Ejecución'
            });
        }
        else if (e.fund_id) {
            links.push({
                source: e.fund_id,
                target: expenseNodeId,
                value: Number(e.amount),
                label: 'Gasto Directo'
            });
        }
    }
    return { nodes, links };
}
//# sourceMappingURL=index.js.map