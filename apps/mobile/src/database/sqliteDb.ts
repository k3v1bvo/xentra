// Capa SQLite Offline para Móvil (Expo SQLite)
// Permite guardar transacciones pendientes y consultar recibos y cuotas descargadas sin conexión.

export interface MobileSyncQueueItem {
  id: string;
  operation_id: string;
  idempotency_key: string;
  entity_type: string;
  operation_type: string;
  payload: string;
  client_created_at: string;
  sync_status: 'pending' | 'syncing' | 'synced' | 'failed';
}

export const SQLITE_INIT_SCHEMA = `
  CREATE TABLE IF NOT EXISTS local_sync_queue (
    id TEXT PRIMARY KEY,
    operation_id TEXT NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    entity_type TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    client_created_at TEXT NOT NULL,
    sync_status TEXT DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS local_cached_fees (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    due_date TEXT NOT NULL,
    is_settled INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS local_cached_receipts (
    id TEXT PRIMARY KEY,
    receipt_number TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    concept TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    token_hash TEXT NOT NULL
  );
`;
