# SUBSISTEMA DE NOTIFICACIONES (TRANSACTIONAL OUTBOX)

## 1. Flujo de Trabajo Outbox
1. **Transacción de Negocio**: Al confirmar un cobro o crear una cuota, la base de datos inserta en `notification_outbox` en la misma transacción atómica.
2. **Procesamiento**: Un worker (Edge Function `dispatch-notifications`) consulta los eventos pendientes.
3. **Distribución Multicanal**:
   - In-App: Inserción en `notifications` + evento Supabase Realtime hacia la campana superior.
   - Push: Envío vía Expo Notifications (móvil) o Web Push VAPID (PWA).
   - Email: Envío transaccional complementario.
4. **Idempotencia**: Clave `dedupe_key` en `notifications` previene avisos duplicados ante reintentos de red.
