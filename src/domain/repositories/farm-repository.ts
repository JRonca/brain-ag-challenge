import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farm } from '../entities/farm';

export abstract class FarmsRepository {
  abstract create(farm: Farm): Promise<Farm>;
  abstract findById(id: UniqueEntityID): Promise<Farm | null>;
}
