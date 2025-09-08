import { Inject, Injectable } from '@nestjs/common';
import { OrderEntity } from '@/database/entities/order.entity';
import { IOrderRepository } from '@/database/repositories/interfaces/order.repository.interface';
import { REPOSITORY_TOKENS } from '@/database/repositories/constants';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(REPOSITORY_TOKENS.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async listOrders() {
    // Get orders with customer and store information using repository
    return this.orderRepository.findOrdersWithRelations();
  }

  cancelOrder(id: string, refund: boolean): Promise<OrderEntity> {
    throw new Error(
      `Delete order ${id} with refund ${refund ? 'true' : 'false'} Not implemented`,
    );
  }
}
