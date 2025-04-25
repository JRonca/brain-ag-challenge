import { Farm } from '../entities/farm';

export abstract class FarmsRepository {
  abstract create(farm: Farm): Promise<Farm>;
}
