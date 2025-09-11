import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { StoreEntity } from './entities/store.entity';
import { CustomerEntity } from './entities/customer.entity';
import { StoreTransactionEventEntity } from './entities/store-transaction-event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/db.sqlite',
      entities: [
        OrderEntity,
        StoreEntity,
        CustomerEntity,
        StoreTransactionEventEntity,
      ],
      synchronize: false,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
