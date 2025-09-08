import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { IOrderRepository } from '@/database/repositories/interfaces/order.repository.interface';
import { REPOSITORY_TOKENS } from '@/database/repositories/constants';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  const mockOrderRepository: jest.Mocked<IOrderRepository> = {
    findOrdersWithRelations: jest.fn().mockResolvedValue([
      {
        id: 1,
        store_id: 1,
        customer_id: 1,
        store_name: 'Test Store',
        customer_name: 'Test Customer',
        status: 'CONFIRMED',
        amount_cents: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: REPOSITORY_TOKENS.ORDER_REPOSITORY,
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  describe('listOrders', () => {
    it('should return orders with customer and store names', async () => {
      const result = await ordersController.listOrders();
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('customer_name', 'Test Customer');
      expect(result[0]).toHaveProperty('store_name', 'Test Store');
    });
  });
});
