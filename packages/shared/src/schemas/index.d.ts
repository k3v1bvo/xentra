import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    ci_number: z.ZodString;
    ci_extension: z.ZodOptional<z.ZodEnum<["CBBA", "LPZ", "SCZ", "ORU", "PTS", "TJA", "CHQ", "BEN", "PND"]>>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    ci_number: string;
    ci_extension?: "CBBA" | "LPZ" | "SCZ" | "ORU" | "PTS" | "TJA" | "CHQ" | "BEN" | "PND" | undefined;
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    ci_number: string;
    ci_extension?: "CBBA" | "LPZ" | "SCZ" | "ORU" | "PTS" | "TJA" | "CHQ" | "BEN" | "PND" | undefined;
    phone?: string | undefined;
}>;
export declare const OtbCreateSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    department: z.ZodString;
    municipality: z.ZodString;
    zone: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    department: string;
    municipality: string;
    zone: string;
    address?: string | undefined;
}, {
    code: string;
    name: string;
    department: string;
    municipality: string;
    zone: string;
    address?: string | undefined;
}>;
export declare const FeeCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    fee_type: z.ZodEnum<["Ordinaria", "Extraordinaria", "AporteEspecial", "Proyecto"]>;
    due_date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    amount: number;
    fee_type: "Ordinaria" | "Extraordinaria" | "AporteEspecial" | "Proyecto";
    due_date: string;
    description?: string | undefined;
}, {
    title: string;
    amount: number;
    fee_type: "Ordinaria" | "Extraordinaria" | "AporteEspecial" | "Proyecto";
    due_date: string;
    description?: string | undefined;
}>;
export declare const PaymentCreateSchema: z.ZodObject<{
    user_id: z.ZodString;
    amount: z.ZodNumber;
    method: z.ZodEnum<["Efectivo", "Transferencia", "QR", "Otro"]>;
    notes: z.ZodOptional<z.ZodString>;
    evidence_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    user_id: string;
    method: "Efectivo" | "Transferencia" | "QR" | "Otro";
    notes?: string | undefined;
    evidence_url?: string | undefined;
}, {
    amount: number;
    user_id: string;
    method: "Efectivo" | "Transferencia" | "QR" | "Otro";
    notes?: string | undefined;
    evidence_url?: string | undefined;
}>;
export declare const ExpenseCreateSchema: z.ZodObject<{
    project_id: z.ZodOptional<z.ZodString>;
    fund_id: z.ZodOptional<z.ZodString>;
    cash_register_id: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    category: z.ZodString;
    concept: z.ZodString;
    supplier_name: z.ZodOptional<z.ZodString>;
    invoice_number: z.ZodOptional<z.ZodString>;
    evidence_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    category: string;
    concept: string;
    evidence_url?: string | undefined;
    project_id?: string | undefined;
    fund_id?: string | undefined;
    cash_register_id?: string | undefined;
    supplier_name?: string | undefined;
    invoice_number?: string | undefined;
}, {
    amount: number;
    category: string;
    concept: string;
    evidence_url?: string | undefined;
    project_id?: string | undefined;
    fund_id?: string | undefined;
    cash_register_id?: string | undefined;
    supplier_name?: string | undefined;
    invoice_number?: string | undefined;
}>;
export declare const VotingPollCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    estimated_budget: z.ZodOptional<z.ZodNumber>;
    start_date: z.ZodString;
    end_date: z.ZodString;
    options: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    options: string[];
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    estimated_budget?: number | undefined;
}, {
    options: string[];
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    estimated_budget?: number | undefined;
}>;
export declare const CastVoteSchema: z.ZodObject<{
    poll_id: z.ZodString;
    option_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    poll_id: string;
    option_id: string;
}, {
    poll_id: string;
    option_id: string;
}>;
export declare const NotificationPreferenceSchema: z.ZodObject<{
    category: z.ZodString;
    channel: z.ZodEnum<["in_app", "push", "email"]>;
    enabled: z.ZodBoolean;
    quiet_hours_start: z.ZodOptional<z.ZodString>;
    quiet_hours_end: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: string;
    channel: "in_app" | "push" | "email";
    enabled: boolean;
    quiet_hours_start?: string | undefined;
    quiet_hours_end?: string | undefined;
}, {
    category: string;
    channel: "in_app" | "push" | "email";
    enabled: boolean;
    quiet_hours_start?: string | undefined;
    quiet_hours_end?: string | undefined;
}>;
//# sourceMappingURL=index.d.ts.map