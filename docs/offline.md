# ARQUITECTURA OFFLINE-FIRST — XENTRA OTB

## 1. Estrategia de Persistencia
- **Web**: IndexedDB administrado por Dexie.js para almacenar cuotas descargadas, recibos locales y cola `syncOperations`.
- **Móvil**: Expo SQLite con esquema idéntico en local para operar sin conectividad en zonas rurales o periurbanas.

## 2. Operaciones Prohibidas sin Conexión
- Aprobación de membresías y modificaciones de roles.
- Emisión de votos en XENTRA VOTA.
- Pagos por transferencia o QR bancario.
- Emisión de recibos oficiales definitivos (solo recibos provisionales marcados como "Pendiente de Sincronización").

## 3. Resolución de Conflictos
- Control estricto de idempotencia mediante `idempotency_key`.
- Prohibido el uso de "Last-Write-Wins" para operaciones contables. Ante discrepancias en saldos, la transacción se marca en `operation_conflicts` para revisión del tesorero y fiscalizador.
