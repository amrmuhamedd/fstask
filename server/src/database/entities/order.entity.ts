import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  store_id: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ 
    type: 'text', 
    default: OrderStatus.PENDING_PAYMENT,
    enum: OrderStatus
  })
  status: OrderStatus;

  @Column({ type: 'int' })
  amount_cents: number;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime' })
  updated_at: Date;
}
