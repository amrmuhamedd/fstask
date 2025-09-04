import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
  ) {}

  listOrders(): Promise<OrderEntity[]> {
    return this.ordersRepository.find();
  }

  cancelOrder(id: string, refund: boolean): Promise<OrderEntity> {
    throw new Error(
      `Delete order ${id} with refund ${refund ? 'true' : 'false'} Not implemented`,
    );
  }
}
