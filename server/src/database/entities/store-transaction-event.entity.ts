import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum TransactionType {
  REFUND = 'REFUND',
  PAYMENT = 'PAYMENT',
  ADJUSTMENT = 'ADJUSTMENT'
}

@Entity({ name: 'store_transaction_events' })
export class StoreTransactionEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  store_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    enum: TransactionType
  })
  type: TransactionType;

  @Column({ type: 'int' })
  amount_cents: number;

  @Column({ type: 'int', nullable: true })
  order_id: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;
  
  @Column({ type: 'int' })
  balance_after_cents: number;

  @CreateDateColumn()
  created_at: Date;
}
