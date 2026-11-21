import { calculateUserDebt, allocatePaymentToAssignments, runDeterministicAuditRules, formatBOB } from '../index';
// Test 1: Formato de moneda BOB
console.log('--- TEST 1: Formato Moneda BOB ---');
const formatted = formatBOB(1250.5);
console.log('Esperado contiene 1.250 o 1250 y Bs.:', formatted);
if (!formatted.includes('Bs.') && !formatted.includes('BOB')) {
    throw new Error('Fallo en formato de moneda BOB');
}
// Test 2: Cálculo de Deuda
console.log('--- TEST 2: Cálculo de Deuda Vecinal ---');
const mockAssignments = [
    {
        id: 'a1',
        fee_id: 'f1',
        otb_id: 'otb1',
        user_id: 'u1',
        amount_assigned: 100,
        amount_paid: 40,
        is_settled: false,
        created_at: '2026-11-01'
    },
    {
        id: 'a2',
        fee_id: 'f2',
        otb_id: 'otb1',
        user_id: 'u1',
        amount_assigned: 50,
        amount_paid: 50,
        is_settled: true,
        created_at: '2026-11-05'
    }
];
const debtResult = calculateUserDebt(mockAssignments);
console.log('Resultado Deuda:', debtResult);
if (debtResult.pendingDebt !== 60 || debtResult.unsettledCount !== 1) {
    throw new Error(`Fallo en cálculo de deuda: esperado 60 pendiente, obtuvo ${debtResult.pendingDebt}`);
}
// Test 3: Amortización de Pagos (Cronológico)
console.log('--- TEST 3: Amortización Cronológica de Pagos ---');
const allocationsResult = allocatePaymentToAssignments(80, [
    {
        id: 'a1',
        fee_id: 'f1',
        otb_id: 'otb1',
        user_id: 'u1',
        amount_assigned: 50,
        amount_paid: 0,
        is_settled: false,
        due_date: '2026-10-31',
        created_at: '2026-10-01'
    },
    {
        id: 'a2',
        fee_id: 'f2',
        otb_id: 'otb1',
        user_id: 'u1',
        amount_assigned: 50,
        amount_paid: 0,
        is_settled: false,
        due_date: '2026-11-30',
        created_at: '2026-11-01'
    }
]);
console.log('Allocations:', allocationsResult);
// Debería cubrir a1 con 50 (cuota más vieja) y a2 con 30 (abono parcial), remainder = 0
if (allocationsResult.allocations.length !== 2 || allocationsResult.allocations[0].amount !== 50 || allocationsResult.allocations[1].amount !== 30) {
    throw new Error('Fallo en asignación cronológica de pagos');
}
// Test 4: Reglas Deterministas de Auditoría
console.log('--- TEST 4: Reglas Deterministas AI Auditor ---');
const alerts = runDeterministicAuditRules({
    otbId: 'otb1',
    projects: [
        {
            id: 'p1',
            otb_id: 'otb1',
            title: 'Tinglado',
            budget: 10000,
            total_spent: 12000,
            status: 'InProgress',
            created_by: 'u1',
            created_at: '2026-11-01'
        }
    ],
    payments: [
        {
            id: 'pay1',
            otb_id: 'otb1',
            user_id: 'u1',
            amount: 100,
            method: 'Efectivo',
            status: 'Confirmed',
            created_at: '2026-11-20T10:00:00Z'
        },
        {
            id: 'pay2',
            otb_id: 'otb1',
            user_id: 'u1',
            amount: 100,
            method: 'Efectivo',
            status: 'Confirmed',
            created_at: '2026-11-20T12:00:00Z'
        }
    ],
    expenses: [
        {
            id: 'e1',
            otb_id: 'otb1',
            amount: 500,
            category: 'Materiales',
            concept: 'Cemento sin factura',
            status: 'Executed',
            created_by: 'u1',
            created_at: '2026-11-20T10:00:00Z'
        }
    ],
    closures: [
        {
            id: 'c1',
            cash_register_id: 'cr1',
            opened_at: '2026-11-20T08:00:00Z',
            closed_at: '2026-11-20T18:00:00Z',
            closed_by: 'u1',
            initial_balance: 1000,
            system_income: 500,
            system_expenses: 0,
            calculated_balance: 1500,
            physical_balance: 1400,
            discrepancy: -100
        }
    ]
});
console.log(`Alertas generadas: ${alerts.length}`);
const r01 = alerts.find(a => a.rule_code === 'R01_BUDGET_OVERRUN');
const r02 = alerts.find(a => a.rule_code === 'R02_DUPLICATE_PAYMENT');
const r03 = alerts.find(a => a.rule_code === 'R03_ORPHAN_EXPENSE');
const r04 = alerts.find(a => a.rule_code === 'R04_CASH_DISCREPANCY');
if (!r01 || !r02 || !r03 || !r04) {
    throw new Error('Fallo: No se detectaron todas las alertas deterministas');
}
console.log('✅ TODOS LOS TESTS PASARON EXITOSAMENTE!');
//# sourceMappingURL=business-logic.test.js.map