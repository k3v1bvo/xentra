import { FeeAssignment, Payment, Expense, Project, CashRegisterClosure, FinancialAlert } from '../types';
/**
 * Calcula la deuda total acumulada para un usuario a partir de sus cuotas asignadas
 */
export declare function calculateUserDebt(assignments: FeeAssignment[]): {
    totalAssigned: number;
    totalPaid: number;
    pendingDebt: number;
    unsettledCount: number;
};
/**
 * Motor de asignación de pagos (Amortización cronológica de cuotas)
 * Aplica el monto disponible a las cuotas más antiguas primero
 */
export declare function allocatePaymentToAssignments(paymentAmount: number, pendingAssignments: (FeeAssignment & {
    due_date?: string;
})[]): {
    allocations: {
        fee_assignment_id: string;
        amount: number;
    }[];
    remainingUnallocated: number;
};
/**
 * Motor determinista de XENTRA AI Auditor
 * Evalúa reglas financieras estrictas y emite alertas estructuradas
 */
export declare function runDeterministicAuditRules(params: {
    otbId: string;
    projects: Project[];
    payments: Payment[];
    expenses: Expense[];
    closures: CashRegisterClosure[];
}): FinancialAlert[];
/**
 * Modelo de Grafo Contable para XENTRA TRACE
 * Devuelve nodos y enlaces para visualización de trazabilidad
 */
export interface TraceNode {
    id: string;
    name: string;
    category: 'Aporte' | 'Fondo' | 'Proyecto' | 'Gasto';
    amount: number;
}
export interface TraceLink {
    source: string;
    target: string;
    value: number;
    label?: string;
}
export declare function buildTraceGraph(params: {
    funds: {
        id: string;
        name: string;
        current_balance: number;
    }[];
    projects: {
        id: string;
        title: string;
        budget: number;
        total_spent: number;
    }[];
    expenses: {
        id: string;
        concept: string;
        amount: number;
        project_id?: string;
        fund_id?: string;
    }[];
}): {
    nodes: TraceNode[];
    links: TraceLink[];
};
//# sourceMappingURL=index.d.ts.map