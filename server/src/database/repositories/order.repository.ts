import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { CustomerEntity } from '@/database/entities/customer.entity';
import { StoreEntity } from '@/database/entities/store.entity';
import {
  IOrderRepository,
  OrderWithRelations,
} from './interfaces/order.repository.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private orderEntityRepository: Repository<OrderEntity>,
  ) {}

  async findOrdersWithRelations(): Promise<OrderWithRelations[]> {
    const orders = await this.orderEntityRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect(
        CustomerEntity,
        'customer',
        'customer.id = order.customer_id',
      )
      .leftJoinAndSelect(StoreEntity, 'store', 'store.id = order.store_id')
      .select([
        'order.id',
        'order.store_id',
        'order.customer_id',
        'order.status',
        'order.amount_cents',
        'order.created_at',
        'order.updated_at',
        'customer.name as customer_name',
        'store.name as store_name',
      ])
      .getRawMany();


    return orders.map((order) => ({
      id: order.order_id,
      store_id: order.order_store_id,
      customer_id: order.order_customer_id,
      store_name: order.store_name,
      customer_name: order.customer_name,
      status: order.order_status,
      amount_cents: order.order_amount_cents,
      created_at: order.order_created_at,
      updated_at: order.order_updated_at,
    }));
  }

   async findOrderById(id: number): Promise<OrderEntity | null> {
    return this.orderEntityRepository.findOne({
      where: { id }
    });
  }
   async saveOrder(order: OrderEntity): Promise<OrderEntity> {
    return this.orderEntityRepository.save(order);
  }
}
