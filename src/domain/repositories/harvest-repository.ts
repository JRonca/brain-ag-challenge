import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Harvest } from '../entities/harvest';

export abstract class HarvestsRepository {
  abstract create(harvest: Harvest): Promise<Harvest>;
  abstract findById(id: UniqueEntityID): Promise<Harvest | null>;
}
