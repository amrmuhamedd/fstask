import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  store_id: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'text', default: 'pendingPayment' })
  status: 'pendingPayment' | 'confirmed' | 'cancelled';

  @Column({ type: 'int' })
  amount_cents: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime' })
  updated_at: Date;
}
