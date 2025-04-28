import { PaginationParams } from '@core/repositories/pagination-params';
import { Harvest } from '@domain/entities/harvest';
import { HarvestsRepository } from '@domain/repositories/harvest-repository';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export class InMemoryHarvestsRepository implements HarvestsRepository {
  public items: Harvest[] = [];

  async create(harvest: Harvest): Promise<Harvest> {
    this.items.push(harvest);
    return harvest;
  }

  async findById(id: string): Promise<Harvest | null> {
    const harvest = this.items.find((harvest) =>
      harvest.id.equals(new UniqueEntityID(id)),
    );
    return harvest ?? null;
  }

  async list({ page, limit }: PaginationParams): Promise<Harvest[]> {
    return this.items.slice((page - 1) * limit, page * limit);
  }
}
