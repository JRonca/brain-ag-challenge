import { Farmer } from '../entities/farmer';
import { PaginationParams } from '@core/repositories/pagination-params';

export abstract class FarmersRepository {
  abstract list(params: PaginationParams): Promise<Farmer[]>;
  abstract findById(id: string): Promise<Farmer | null>;
  abstract findByDocument(document: string): Promise<Farmer | null>;
  abstract create(farmer: Farmer): Promise<Farmer>;
  abstract update(farmer: Farmer): Promise<Farmer>;
  abstract delete(id: string): Promise<void>;
}
