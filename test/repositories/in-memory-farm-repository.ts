import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farm } from '@domain/entities/farm';
import { FarmsRepository } from '@domain/repositories/farm-repository';

export class InMemoryFarmsRepository implements FarmsRepository {
  public items: Farm[] = [];

  async create(farm: Farm): Promise<Farm> {
    this.items.push(farm);
    return farm;
  }

  async findById(id: UniqueEntityID): Promise<Farm | null> {
    const farm = this.items.find((farm) => farm.id === id);
    return farm ? Promise.resolve(farm) : Promise.resolve(null);
  }
}
