import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { REPOSITORY_TOKENS } from '@/database/repositories/constants';
import { IOrderRepository } from '@/database/repositories/interfaces/order.repository.interface';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: jest.Mocked<IOrderRepository>;

  beforeEach(async () => {
    orderRepository = {
      findOrdersWithRelations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: REPOSITORY_TOKENS.ORDER_REPOSITORY,
          useValue: orderRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listOrders', () => {
    it('should return all orders with relations', async () => {
      // Arrange
      const mockOrders = [
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
      ];
      orderRepository.findOrdersWithRelations.mockResolvedValue(mockOrders);

      const result = await service.listOrders();

      expect(result).toEqual(mockOrders);
      expect(orderRepository.findOrdersWithRelations).toHaveBeenCalled();
    });
  });
});
