/**
 * Formatea un número decimal a moneda boliviana (BOB / Bs.)
 * @param amount Cantidad numérica
 * @returns Cadena con formato "Bs. 120,50"
 */
export declare function formatBOB(amount: number | null | undefined): string;
/**
 * Genera un token aleatorio criptográficamente seguro de 32 bytes (64 caracteres hex)
 */
export declare function generateSecureReceiptToken(): string;
/**
 * Formatea fechas a estándar boliviano (DD/MM/YYYY)
 */
export declare function formatDateBO(dateInput: string | Date | null | undefined): string;
/**
 * Formatea fechas con hora (DD/MM/YYYY HH:mm)
 */
export declare function formatDateTimeBO(dateInput: string | Date | null | undefined): string;
/**
 * Genera una clave de idempotencia única para operaciones offline/online
 */
export declare function generateIdempotencyKey(otbId: string, userId: string, action: string): string;
//# sourceMappingURL=index.d.ts.map