import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Harvest } from '@domain/entities/harvest';
import { HarvestsRepository } from '@domain/repositories/harvest-repository';

export class InMemoryHarvestsRepository implements HarvestsRepository {
  public items: Harvest[] = [];

  async create(harvest: Harvest): Promise<Harvest> {
    this.items.push(harvest);
    return harvest;
  }

  findById(id: string): Promise<Harvest | null> {
    const harvest = this.items.find((harvest) =>
      harvest.id.equals(new UniqueEntityID(id)),
    );
    return harvest ? Promise.resolve(harvest) : Promise.resolve(null);
  }
}
