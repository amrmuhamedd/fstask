import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreRepository } from './store.repository';
import { StoreEntity } from '@/database/entities/store.entity';

describe('StoreRepository', () => {
  let repository: StoreRepository;
  let storeEntityRepository: jest.Mocked<Repository<StoreEntity>>;

  beforeEach(async () => {
    // Create mock repository
    const mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreRepository,
        {
          provide: getRepositoryToken(StoreEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<StoreRepository>(StoreRepository);
    storeEntityRepository = module.get(getRepositoryToken(StoreEntity));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findStoreById', () => {
    it('should find a store by id', async () => {
      // Arrange
      const mockStore = { 
        id: 1, 
        name: 'Test Store',
        balance_cents: 1000 
      } as StoreEntity;
      storeEntityRepository.findOne.mockResolvedValue(mockStore);

      // Act
      const result = await repository.findStoreById(1);

      // Assert
      expect(result).toBe(mockStore);
      expect(storeEntityRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if store not found', async () => {
      // Arrange
      storeEntityRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findStoreById(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('saveStore', () => {
    it('should save a store', async () => {
      // Arrange
      const storeToSave = { 
        id: 1, 
        name: 'Test Store',
        balance_cents: 1000 
      } as StoreEntity;
      
      const savedStore = { 
        ...storeToSave, 
        balance_cents: 2000 
      };
      
      storeEntityRepository.save.mockResolvedValue(savedStore);

      // Act
      const result = await repository.saveStore(storeToSave);

      // Assert
      expect(result).toBe(savedStore);
      expect(storeEntityRepository.save).toHaveBeenCalledWith(storeToSave);
    });
  });
});
