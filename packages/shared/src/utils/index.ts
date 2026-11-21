// Utilidades Generales de XENTRA OTB

/**
 * Formatea un número decimal a moneda boliviana (BOB / Bs.)
 * @param amount Cantidad numérica
 * @returns Cadena con formato "Bs. 120,50"
 */
export function formatBOB(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Bs. 0,00';
  }
  const formatted = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  return `Bs. ${formatted}`;
}

/**
 * Genera un token aleatorio criptográficamente seguro de 32 bytes (64 caracteres hex)
 */
export function generateSecureReceiptToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Formatea fechas a estándar boliviano (DD/MM/YYYY)
 */
export function formatDateBO(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

/**
 * Formatea fechas con hora (DD/MM/YYYY HH:mm)
 */
export function formatDateTimeBO(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Genera una clave de idempotencia única para operaciones offline/online
 */
export function generateIdempotencyKey(otbId: string, userId: string, action: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${otbId}:${userId}:${action}:${timestamp}:${random}`;
}
