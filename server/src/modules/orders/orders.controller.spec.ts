import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderEntity } from '@/database/entities/order.entity';
import { StoreEntity } from '@/database/entities/store.entity';
import { IOrderRepository } from '@/database/repositories/interfaces/order.repository.interface';
import { IStoreRepository } from '@/database/repositories/interfaces/store.repository.interface';
import { IStoreTransactionEventRepository } from '@/database/repositories/interfaces/store-transaction-event.repository.interface';
import { REPOSITORY_TOKENS } from '@/database/repositories/constants';
import { TransactionType } from '@/database/entities/store-transaction-event.entity';
import { OrderStatus } from '@/database/enums/order-status.enum';

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
        status: OrderStatus.CONFIRMED,
        amount_cents: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),
    findOrderById: jest.fn(),
    saveOrder: jest.fn(),
  };

  const mockStoreRepository: jest.Mocked<IStoreRepository> = {
    findStoreById: jest.fn(),
    saveStore: jest.fn(),
  };

  const mockStoreTransactionEventRepository: jest.Mocked<IStoreTransactionEventRepository> = {
    findTransactionsByStoreId: jest.fn(),
    recordTransaction: jest.fn(),
    calculateBalanceFromEvents: jest.fn(),
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
        {
          provide: REPOSITORY_TOKENS.STORE_REPOSITORY,
          useValue: mockStoreRepository,
        },
        {
          provide: REPOSITORY_TOKENS.STORE_TRANSACTION_EVENT_REPOSITORY,
          useValue: mockStoreTransactionEventRepository,
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

  describe('cancelOrder', () => {
    it('should cancel order without refund', async () => {
      const order = {
        id: 1,
        store_id: 1,
        customer_id: 1,
        status: OrderStatus.CONFIRMED,
        amount_cents: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockOrderRepository.findOrderById.mockResolvedValue(order as OrderEntity);
      mockOrderRepository.saveOrder.mockResolvedValue({
        ...order,
        status: OrderStatus.CANCELLED,
      } as OrderEntity);

      const result = await ordersController.cancelOrder('1', { refund: false });

      expect(result).toHaveProperty('status', OrderStatus.CANCELLED);
      expect(result).toHaveProperty('refunded', false);
      expect(mockStoreRepository.findStoreById).not.toHaveBeenCalled();
    });

    it('should cancel order with refund when balance is sufficient', async () => {
      const order = {
        id: 1,
        store_id: 1,
        customer_id: 1,
        status: OrderStatus.CONFIRMED,
        amount_cents: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const store = {
        id: 1,
        name: 'Test Store',
        balance_cents: 2000,
      };

      mockOrderRepository.findOrderById.mockResolvedValue(order as OrderEntity);
      mockStoreRepository.findStoreById.mockResolvedValue(store as StoreEntity);
      mockStoreRepository.saveStore.mockResolvedValue({
        ...store,
        balance_cents: 1000,
      } as StoreEntity);
      mockOrderRepository.saveOrder.mockResolvedValue({
        ...order,
        status: OrderStatus.CANCELLED,
      } as OrderEntity);

      const result = await ordersController.cancelOrder('1', { refund: true });

      expect(result).toHaveProperty('status', OrderStatus.CANCELLED);
      expect(result).toHaveProperty('refunded', true);
      expect(mockStoreRepository.saveStore).toHaveBeenCalledWith({
        ...store,
        balance_cents: 1000,
      } as StoreEntity);
    });

    it('should throw error when balance is insufficient for refund', async () => {
      const order = {
        id: 1,
        store_id: 1,
        customer_id: 1,
        status: OrderStatus.CONFIRMED,
        amount_cents: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const store = {
        id: 1,
        name: 'Test Store',
        balance_cents: 500,
      };

      mockOrderRepository.findOrderById.mockResolvedValue(order as OrderEntity);
      mockStoreRepository.findStoreById.mockResolvedValue(store as StoreEntity);

      await expect(ordersController.cancelOrder('1', { refund: true })).rejects.toThrow(
        'Cannot process refund due to insufficient store balance'
      );
    });

    it('should throw error when order is not found', async () => {
      mockOrderRepository.findOrderById.mockResolvedValue(null);

      await expect(ordersController.cancelOrder('999', { refund: false })).rejects.toThrow(
        'Order not found'
      );
    });
  });
});
