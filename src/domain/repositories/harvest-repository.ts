import { Harvest } from '../entities/harvest';

export abstract class HarvestsRepository {
  abstract create(harvest: Harvest): Promise<Harvest>;
  abstract findById(id: string): Promise<Harvest | null>;
}
