import { z } from 'zod';
export const LoginSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});
export const RegisterSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    first_name: z.string().min(2, 'El nombre es obligatorio'),
    last_name: z.string().min(2, 'Los apellidos son obligatorios'),
    ci_number: z.string().min(5, 'Cédula de identidad obligatoria'),
    ci_extension: z.enum(['CBBA', 'LPZ', 'SCZ', 'ORU', 'PTS', 'TJA', 'CHQ', 'BEN', 'PND']).optional(),
    phone: z.string().optional()
});
export const OtbCreateSchema = z.object({
    code: z.string().min(3, 'El código debe tener al menos 3 caracteres').toUpperCase(),
    name: z.string().min(3, 'El nombre de la OTB es obligatorio'),
    department: z.string().min(2, 'Departamento obligatorio'),
    municipality: z.string().min(2, 'Municipio obligatorio'),
    zone: z.string().min(2, 'Zona o barrio obligatorio'),
    address: z.string().optional()
});
export const FeeCreateSchema = z.object({
    title: z.string().min(3, 'Título obligatorio'),
    description: z.string().optional(),
    amount: z.number().positive('El importe debe ser mayor a 0'),
    fee_type: z.enum(['Ordinaria', 'Extraordinaria', 'AporteEspecial', 'Proyecto']),
    due_date: z.string().min(10, 'Fecha de vencimiento obligatoria')
});
export const PaymentCreateSchema = z.object({
    user_id: z.string().uuid('ID de usuario inválido'),
    amount: z.number().positive('El monto a pagar debe ser positivo'),
    method: z.enum(['Efectivo', 'Transferencia', 'QR', 'Otro']),
    notes: z.string().optional(),
    evidence_url: z.string().optional()
});
export const ExpenseCreateSchema = z.object({
    project_id: z.string().uuid().optional(),
    fund_id: z.string().uuid().optional(),
    cash_register_id: z.string().uuid().optional(),
    amount: z.number().positive('El egreso debe ser mayor a 0'),
    category: z.string().min(2, 'Categoría obligatoria'),
    concept: z.string().min(3, 'Concepto obligatorio'),
    supplier_name: z.string().optional(),
    invoice_number: z.string().optional(),
    evidence_url: z.string().optional()
});
export const VotingPollCreateSchema = z.object({
    title: z.string().min(5, 'Título de consulta obligatorio'),
    description: z.string().min(10, 'Descripción obligatoria'),
    estimated_budget: z.number().nonnegative().optional(),
    start_date: z.string(),
    end_date: z.string(),
    options: z.array(z.string().min(1)).min(2, 'Se requieren al menos 2 opciones de votación')
});
export const CastVoteSchema = z.object({
    poll_id: z.string().uuid(),
    option_id: z.string().uuid()
});
export const NotificationPreferenceSchema = z.object({
    category: z.string(),
    channel: z.enum(['in_app', 'push', 'email']),
    enabled: z.boolean(),
    quiet_hours_start: z.string().optional(),
    quiet_hours_end: z.string().optional()
});
//# sourceMappingURL=index.js.map