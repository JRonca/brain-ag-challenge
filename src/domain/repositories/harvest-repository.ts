import { Harvest } from '../entities/harvest';
import { PaginationParams } from '@core/repositories/pagination-params';

export abstract class HarvestsRepository {
  abstract create(harvest: Harvest): Promise<Harvest>;
  abstract findById(id: string): Promise<Harvest | null>;
  abstract list(params: PaginationParams): Promise<Harvest[]>;
}
