import { SyncOperation, SyncStatus } from '@xentra/shared';

export interface StorageAdapter {
  getPendingOperations(): Promise<SyncOperation[]>;
  saveOperation(op: SyncOperation): Promise<void>;
  updateOperationStatus(id: string, status: SyncStatus, errorMessage?: string): Promise<void>;
  deleteOperation(id: string): Promise<void>;
}

export class SyncQueueManager {
  private adapter: StorageAdapter;
  private isProcessing = false;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  /**
   * Encola una operación local garantizando idempotencia
   */
  async enqueue(operation: Omit<SyncOperation, 'id' | 'sync_status' | 'retry_count'>): Promise<SyncOperation> {
    const fullOp: SyncOperation = {
      ...operation,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      sync_status: 'pending',
      retry_count: 0
    };

    await this.adapter.saveOperation(fullOp);
    return fullOp;
  }

  /**
   * Procesa la cola secuencialmente respetando orden cronológico estricto
   */
  async processQueue(
    syncHandler: (op: SyncOperation) => Promise<{ success: boolean; error?: string }>
  ): Promise<{ processed: number; failed: number }> {
    if (this.isProcessing) {
      return { processed: 0, failed: 0 };
    }

    this.isProcessing = true;
    let processed = 0;
    let failed = 0;

    try {
      const pending = await this.adapter.getPendingOperations();

      // Ordenar cronológicamente (FIFO)
      const sorted = pending.sort(
        (a, b) => new Date(a.client_created_at).getTime() - new Date(b.client_created_at).getTime()
      );

      for (const op of sorted) {
        await this.adapter.updateOperationStatus(op.id, 'syncing');

        try {
          const result = await syncHandler(op);

          if (result.success) {
            await this.adapter.updateOperationStatus(op.id, 'synced');
            processed++;
          } else {
            await this.adapter.updateOperationStatus(op.id, 'failed', result.error);
            failed++;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Error de sincronización desconocido';
          await this.adapter.updateOperationStatus(op.id, 'failed', message);
          failed++;
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return { processed, failed };
  }
}
