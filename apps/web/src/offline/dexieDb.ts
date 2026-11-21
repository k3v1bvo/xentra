import Dexie, { Table } from 'dexie';
import { SyncOperation, FeeAssignment, PaymentReceipt } from '@xentra/shared';

export class XentraIndexedDB extends Dexie {
  syncOperations!: Table<SyncOperation, string>;
  cachedFeeAssignments!: Table<FeeAssignment, string>;
  cachedReceipts!: Table<PaymentReceipt, string>;

  constructor() {
    super('XentraOtbDB');
    this.version(1).stores({
      syncOperations: 'id, operation_id, idempotency_key, sync_status, client_created_at',
      cachedFeeAssignments: 'id, fee_id, user_id, is_settled',
      cachedReceipts: 'id, receipt_number, payment_id'
    });
  }
}

export const localDb = new XentraIndexedDB();
