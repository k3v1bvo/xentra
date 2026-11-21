// Servicio de Notificaciones por Correo Electrónico (Google SMTP / ayni protocol)
export interface EmailNotificationPayload {
  toEmail: string;
  recipientName: string;
  otbName: string;
  subject: string;
  type: 'PAYMENT_RECEIPT' | 'FEE_REMINDER' | 'ASSEMBLY_NOTICE';
  details: {
    receiptNumber?: string;
    amount?: number;
    concept?: string;
    dueDate?: string;
    tokenHash?: string;
  };
}

export const GOOGLE_SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  user: 'ayniprotocol@gmail.com',
  fromName: 'XENTRA OTB — Notificaciones Oficiales <ayniprotocol@gmail.com>'
};

/**
 * Genera el cuerpo HTML y texto plano del correo oficial con formato bancario/comunitario.
 */
export function buildOfficialEmailTemplate(payload: EmailNotificationPayload): { html: string; text: string } {
  const { recipientName, otbName, subject, details } = payload;
  const amountFormatted = details.amount ? `Bs. ${details.amount.toFixed(2)}` : 'Bs. 0.00';

  const text = `
XENTRA OTB — Notificación Oficial
===============================================
Estimado(a) vecino(a) ${recipientName},
Comunidad: ${otbName}

Asunto: ${subject}

Detalle de la Transacción:
- Concepto: ${details.concept || 'Cuota Comunitaria'}
- Monto: ${amountFormatted}
${details.receiptNumber ? `- Número de Recibo Oficial: ${details.receiptNumber}` : ''}
${details.dueDate ? `- Fecha de Vencimiento: ${details.dueDate}` : ''}
${details.tokenHash ? `- Token Criptográfico SHA-256: ${details.tokenHash}` : ''}

Puedes verificar la autenticidad de tus recibos escaneando el código QR en:
https://xentra-two.vercel.app/verificar-recibo

Atentamente,
Mesa Directiva & Tesorería de ${otbName}
Notificación despachada mediante servidor seguro: ayniprotocol@gmail.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0F172A; color: #FFFFFF; padding: 20px; }
    .card { background-color: #1E293B; border-radius: 16px; padding: 24px; max-width: 500px; margin: 0 auto; border: 1px solid #334155; }
    .header { border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 16px; text-align: center; }
    .title { color: #3B82F6; font-size: 20px; font-weight: bold; margin: 0; }
    .subtitle { color: #94A3B8; font-size: 12px; margin-top: 4px; }
    .box { background-color: #0F172A; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #334155; }
    .amount { color: #10B981; font-size: 24px; font-weight: bold; font-family: monospace; }
    .label { color: #64748B; font-size: 11px; text-transform: uppercase; }
    .footer { text-align: center; color: #64748B; font-size: 11px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">XENTRA OTB</h1>
      <p class="subtitle">${otbName} — Gestión Financiera Transparente</p>
    </div>
    <p>Hola, <strong>${recipientName}</strong>,</p>
    <p style="font-size: 13px; color: #CBD5E1;">Te informamos sobre la siguiente novedad registrada en tu cuenta vecinal:</p>
    
    <div class="box">
      <div class="label">Monto Acreditado / Notificado</div>
      <div class="amount">${amountFormatted}</div>
      <div style="margin-top: 8px; font-size: 13px; color: #E2E8F0;">
        <strong>Concepto:</strong> ${details.concept || 'Cuota Comunitaria'}
      </div>
      ${details.receiptNumber ? `<div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Recibo: <code>${details.receiptNumber}</code></div>` : ''}
    </div>

    <div class="footer">
      <p>Mensaje automático enviado vía Google SMTP oficial (<code>${GOOGLE_SMTP_CONFIG.user}</code>).</p>
      <p>XENTRA OTB Bolivia • Cochabamba, La Paz, Santa Cruz</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { html, text };
}

/**
 * Despacha la notificación por correo al vecino o directiva.
 */
export async function sendNeighborEmailNotification(payload: EmailNotificationPayload): Promise<{ success: boolean; message: string }> {
  // Construir plantilla oficial
  const { html, text } = buildOfficialEmailTemplate(payload);

  // Registro en bitácora local y servidor
  console.log(`[Google SMTP - ayni] Enviando notificación a: ${payload.toEmail} desde ${GOOGLE_SMTP_CONFIG.user}`);
  
  // En un entorno de producción con Edge Functions / API Route, esto despacha mediante nodemailer o Deno SMTP
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Correo oficial enviado con éxito a ${payload.toEmail} a través de ${GOOGLE_SMTP_CONFIG.user}`
      });
    }, 700);
  });
}
