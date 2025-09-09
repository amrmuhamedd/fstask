import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreTransactionEventEntity, TransactionType } from '@/database/entities/store-transaction-event.entity';
import { IStoreTransactionEventRepository } from './interfaces/store-transaction-event.repository.interface';

@Injectable()
export class StoreTransactionEventRepository implements IStoreTransactionEventRepository {
  constructor(
    @InjectRepository(StoreTransactionEventEntity)
    private storeTransactionEventEntityRepository: Repository<StoreTransactionEventEntity>,
  ) {}

  async findTransactionsByStoreId(storeId: number): Promise<StoreTransactionEventEntity[]> {
    return this.storeTransactionEventEntityRepository.find({
      where: { store_id: storeId },
      order: { created_at: 'ASC' }
    });
  }

  async recordTransaction(
    storeId: number,
    type: TransactionType,
    amountCents: number,
    balanceAfterCents: number,
    orderId?: number,
    description?: string
  ): Promise<StoreTransactionEventEntity> {
    const transaction = this.storeTransactionEventEntityRepository.create({
      store_id: storeId,
      type,
      amount_cents: amountCents,
      balance_after_cents: balanceAfterCents,
      order_id: orderId || null,
      description: description || null,
      created_at: new Date()
    });

    return this.storeTransactionEventEntityRepository.save(transaction);
  }

  async calculateBalanceFromEvents(storeId: number): Promise<number> {
    const transactions = await this.findTransactionsByStoreId(storeId);
    
    if (transactions.length === 0) {
      return 0;
    }
    
    // Return the balance from the most recent transaction
    return transactions[transactions.length - 1].balance_after_cents;
  }
}
