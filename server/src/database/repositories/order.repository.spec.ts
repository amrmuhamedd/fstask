import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from './order.repository';
import { OrderEntity } from '@/database/entities/order.entity';

describe('OrderRepository', () => {
  let repository: OrderRepository;
  let orderEntityRepository: jest.Mocked<Repository<OrderEntity>>;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<OrderRepository>(OrderRepository);
    orderEntityRepository = module.get(getRepositoryToken(OrderEntity));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findOrdersWithRelations', () => {
    it('should return orders with customer and store relations', async () => {
      const mockRawOrders = [
        {
          order_id: 1,
          order_store_id: 2,
          order_customer_id: 3,
          order_status: 'CONFIRMED',
          order_amount_cents: 1500,
          order_created_at: new Date('2023-01-01'),
          order_updated_at: new Date('2023-01-02'),
          store_name: 'Test Store',
          customer_name: 'Test Customer',
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockRawOrders);

      const result = await repository.findOrdersWithRelations();

      expect(result).toEqual([
        {
          id: 1,
          store_id: 2,
          customer_id: 3,
          status: 'CONFIRMED',
          amount_cents: 1500,
          created_at: mockRawOrders[0].order_created_at,
          updated_at: mockRawOrders[0].order_updated_at,
          store_name: 'Test Store',
          customer_name: 'Test Customer',
        },
      ]);

      expect(orderEntityRepository.createQueryBuilder).toHaveBeenCalledWith(
        'order',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.select).toHaveBeenCalled();
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
    });
  });
});
