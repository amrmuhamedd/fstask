import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { REPOSITORY_TOKENS } from '@/database/repositories/constants';
import { OrderRepository } from '@/database/repositories/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: REPOSITORY_TOKENS.ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
  ],
})
export class OrdersModule {}
