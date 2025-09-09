import { StoreTransactionEventEntity, TransactionType } from '@/database/entities/store-transaction-event.entity';

export interface IStoreTransactionEventRepository {
  findTransactionsByStoreId(storeId: number): Promise<StoreTransactionEventEntity[]>;
  
  recordTransaction(
    storeId: number,
    type: TransactionType,
    amountCents: number,
    balanceAfterCents: number,
    orderId?: number,
    description?: string
  ): Promise<StoreTransactionEventEntity>;
  
  calculateBalanceFromEvents(storeId: number): Promise<number>;
}
