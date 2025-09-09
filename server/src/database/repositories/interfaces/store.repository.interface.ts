import { StoreEntity } from '@/database/entities/store.entity';

export interface IStoreRepository {
  findStoreById(id: number): Promise<StoreEntity | null>;
  saveStore(store: StoreEntity): Promise<StoreEntity>;
}
