import { Farm } from '@domain/entities/farm';
import { FarmsRepository } from '@domain/repositories/farm-repository';

export class InMemoryFarmsRepository implements FarmsRepository {
  public items: Farm[] = [];

  async create(farmer: Farm): Promise<Farm> {
    this.items.push(farmer);
    return farmer;
  }
}
