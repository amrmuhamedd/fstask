import { Injectable, NotFoundException, UnprocessableEntityException, Inject } from '@nestjs/common';
import { IOrderRepository } from '@/database/repositories/interfaces/order.repository.interface';
import { IStoreRepository } from '@/database/repositories/interfaces/store.repository.interface';
import { IStoreTransactionEventRepository } from '@/database/repositories/interfaces/store-transaction-event.repository.interface';
import { REPOSITORY_TOKENS } from '@/database/repositories/constants';
import { TransactionType } from '@/database/entities/store-transaction-event.entity';
import { OrderStatus } from '@/database/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(REPOSITORY_TOKENS.ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(REPOSITORY_TOKENS.STORE_REPOSITORY)
    private readonly storeRepository: IStoreRepository,
    @Inject(REPOSITORY_TOKENS.STORE_TRANSACTION_EVENT_REPOSITORY)
    private readonly storeTransactionEventRepository: IStoreTransactionEventRepository,
  ) {}

  async listOrders() {
    return this.orderRepository.findOrdersWithRelations();
  }
  
  async cancelOrder(id: string, refund: boolean) {
    const order = await this.orderRepository.findOrderById(Number(id));

    if (!order) {
      throw new NotFoundException('Order not found');
    }


    if (refund) {
      const store = await this.storeRepository.findStoreById(order.store_id);

      if (!store) {
        throw new NotFoundException('Store not found');
      }


      if (store.balance_cents < order.amount_cents) {
        throw new UnprocessableEntityException({
          statusCode: 422,
          message: 'Cannot process refund due to insufficient store balance',
          error: 'Insufficient Balance',
          details: {
            available: store.balance_cents,
            required: order.amount_cents,
            orderId: order.id
          }
        });
      }

  
      const newBalance = store.balance_cents - order.amount_cents;
      store.balance_cents = newBalance;
      await this.storeRepository.saveStore(store);
      

      await this.storeTransactionEventRepository.recordTransaction(
        store.id,
        TransactionType.REFUND,
        -order.amount_cents, 
        newBalance,
        order.id,
        `Refund for cancelled order #${order.id}`
      );
    }


    order.status = OrderStatus.CANCELLED; 
    order.updated_at = new Date();
    await this.orderRepository.saveOrder(order);

    
    return {
      id: order.id,
      status: order.status,
      refunded: refund,
      updated_at: order.updated_at
    };
  }
}
