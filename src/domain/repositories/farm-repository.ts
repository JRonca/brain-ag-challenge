import { Farm } from '../entities/farm';

export abstract class FarmsRepository {
  abstract create(Farm: Farm): Promise<Farm>;
}
