import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { StoreEntity } from '@/database/entities/store.entity';
import { StoreTransactionEventEntity } from '@/database/entities/store-transaction-event.entity';
import { REPOSITORY_TOKENS } from '@/database/repositories/constants';
import { OrderRepository } from '@/database/repositories/order.repository';
import { StoreRepository } from '@/database/repositories/store.repository';
import { StoreTransactionEventRepository } from '@/database/repositories/store-transaction-event.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      StoreEntity,
      StoreTransactionEventEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: REPOSITORY_TOKENS.ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: REPOSITORY_TOKENS.STORE_REPOSITORY,
      useClass: StoreRepository,
    },
    {
      provide: REPOSITORY_TOKENS.STORE_TRANSACTION_EVENT_REPOSITORY,
      useClass: StoreTransactionEventRepository,
    },
  ],
})
export class OrdersModule {}
