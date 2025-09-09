import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { REPOSITORY_TOKENS } from '@/database/repositories/constants';
import { IOrderRepository } from '@/database/repositories/interfaces/order.repository.interface';
import { IStoreRepository } from '@/database/repositories/interfaces/store.repository.interface';
import { IStoreTransactionEventRepository } from '@/database/repositories/interfaces/store-transaction-event.repository.interface';
import { OrderEntity } from '@/database/entities/order.entity';
import { StoreEntity } from '@/database/entities/store.entity';
import { TransactionType } from '@/database/entities/store-transaction-event.entity';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { OrderStatus } from '@/database/enums/order-status.enum';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let storeRepository: jest.Mocked<IStoreRepository>;
  let storeTransactionEventRepository: jest.Mocked<IStoreTransactionEventRepository>;

  beforeEach(async () => {
    // Create mocks
    orderRepository = {
      findOrderById: jest.fn(),
      findOrdersWithRelations: jest.fn(),
      saveOrder: jest.fn(),
    };

    storeRepository = {
      findStoreById: jest.fn(),
      saveStore: jest.fn(),
    };
    
    storeTransactionEventRepository = {
      findTransactionsByStoreId: jest.fn(),
      recordTransaction: jest.fn(),
      calculateBalanceFromEvents: jest.fn(),
    };

    // Setup testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: REPOSITORY_TOKENS.ORDER_REPOSITORY,
          useValue: orderRepository,
        },
        {
          provide: REPOSITORY_TOKENS.STORE_REPOSITORY,
          useValue: storeRepository,
        },
        {
          provide: REPOSITORY_TOKENS.STORE_TRANSACTION_EVENT_REPOSITORY,
          useValue: storeTransactionEventRepository,
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
          status: OrderStatus.CONFIRMED,
          amount_cents: 1000,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      orderRepository.findOrdersWithRelations.mockResolvedValue(mockOrders);

      // Act
      const result = await service.listOrders();

      // Assert
      expect(result).toEqual(mockOrders);
      expect(orderRepository.findOrdersWithRelations).toHaveBeenCalled();
    });
  });
  
  describe('cancelOrder', () => {
    it('should throw NotFoundException when order does not exist', async () => {
      // Arrange
      orderRepository.findOrderById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.cancelOrder('1', false)).rejects.toThrow(NotFoundException);
      expect(orderRepository.findOrderById).toHaveBeenCalledWith(1);
    });

    it('should cancel order without refund', async () => {
      // Arrange
      const mockDate = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const mockOrder = {
        id: 1,
        store_id: 1,
        customer_id: 1,
        status: 'CONFIRMED' as 'CONFIRMED',
        amount_cents: 1000,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };
      
      orderRepository.findOrderById.mockResolvedValue(mockOrder as OrderEntity);
      orderRepository.saveOrder.mockResolvedValue({
        ...mockOrder,
        status: 'CANCELLED' as 'CANCELLED',
        updated_at: mockDate,
      } as OrderEntity);

      // Act
      const result = await service.cancelOrder('1', false);

      // Assert
      expect(result).toEqual({
        id: 1,
        status: 'CANCELLED',
        refunded: false,
        updated_at: mockDate,
      });
      expect(orderRepository.saveOrder).toHaveBeenCalledWith({
        ...mockOrder,
        status: 'CANCELLED',
        updated_at: mockDate,
      });
      expect(storeRepository.findStoreById).not.toHaveBeenCalled();
    });
    
    it('should throw NotFoundException when store does not exist for refund', async () => {
      // Arrange
      const mockOrder = {
        id: 1,
        store_id: 1,
        customer_id: 1,
        status: 'CONFIRMED' as 'CONFIRMED',
        amount_cents: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      orderRepository.findOrderById.mockResolvedValue(mockOrder as OrderEntity);
      storeRepository.findStoreById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.cancelOrder('1', true)).rejects.toThrow(
        new NotFoundException('Store not found')
      );
    });

    it('should throw UnprocessableEntityException when store has insufficient balance', async () => {
      // Arrange
      const mockOrder = {
        id: 1,
        store_id: 1,
        customer_id: 1,
        status: 'CONFIRMED' as 'CONFIRMED',
        amount_cents: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      const mockStore = {
        id: 1,
        name: 'Test Store',
        balance_cents: 500, // Less than order amount
      };
      
      orderRepository.findOrderById.mockResolvedValue(mockOrder as OrderEntity);
      storeRepository.findStoreById.mockResolvedValue(mockStore as StoreEntity);

      // Act & Assert
      await expect(service.cancelOrder('1', true)).rejects.toThrow(UnprocessableEntityException);
      expect(storeRepository.saveStore).not.toHaveBeenCalled();
    });

    it('should cancel order with refund when store has sufficient balance', async () => {
      // Arrange
      const mockDate = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const mockOrder = {
        id: 1,
        store_id: 1,
        customer_id: 1,
        status: 'CONFIRMED' as 'CONFIRMED',
        amount_cents: 1000,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };
      
      const mockStore = {
        id: 1,
        name: 'Test Store',
        balance_cents: 2000, // More than order amount
      };
      
      const newBalance = 1000; // Balance after deduction
      
      orderRepository.findOrderById.mockResolvedValue(mockOrder as OrderEntity);
      storeRepository.findStoreById.mockResolvedValue(mockStore as StoreEntity);
      storeRepository.saveStore.mockResolvedValue({
        ...mockStore,
        balance_cents: newBalance,
      } as StoreEntity);
      orderRepository.saveOrder.mockResolvedValue({
        ...mockOrder,
        status: 'CANCELLED' as 'CANCELLED',
        updated_at: mockDate,
      } as OrderEntity);
      storeTransactionEventRepository.recordTransaction.mockResolvedValue({
        id: 1,
        store_id: 1,
        type: TransactionType.REFUND,
        amount_cents: -1000,
        balance_after_cents: newBalance,
        order_id: 1,
        description: 'Refund for cancelled order #1',
        created_at: mockDate
      });

      // Act
      const result = await service.cancelOrder('1', true);

      // Assert
      expect(result).toEqual({
        id: 1,
        status: 'CANCELLED',
        refunded: true,
        updated_at: mockDate,
      });
      expect(storeRepository.saveStore).toHaveBeenCalledWith({
        ...mockStore,
        balance_cents: newBalance,
      });
      expect(orderRepository.saveOrder).toHaveBeenCalledWith({
        ...mockOrder,
        status: 'CANCELLED',
        updated_at: mockDate,
      });
      // Verify transaction event was recorded
      expect(storeTransactionEventRepository.recordTransaction).toHaveBeenCalledWith(
        mockStore.id,
        TransactionType.REFUND,
        -mockOrder.amount_cents,
        newBalance,
        mockOrder.id,
        `Refund for cancelled order #${mockOrder.id}`
      );
    });
  });
});
