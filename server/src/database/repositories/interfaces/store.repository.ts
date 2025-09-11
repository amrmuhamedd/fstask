import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreEntity } from '@/database/entities/store.entity';
import { IStoreRepository } from '../interfaces/store.repository.interface';

@Injectable()
export class StoreRepository implements IStoreRepository {
  constructor(
    @InjectRepository(StoreEntity)
    private storeEntityRepository: Repository<StoreEntity>,
  ) {}

  async findStoreById(id: number): Promise<StoreEntity | null> {
    return this.storeEntityRepository.findOne({
      where: { id },
    });
  }

  async saveStore(store: StoreEntity): Promise<StoreEntity> {
    return this.storeEntityRepository.save(store);
  }
}
