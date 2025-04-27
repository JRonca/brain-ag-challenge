import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { PaginationParams } from '@core/repositories/pagination-params';
import { Farmer } from '@domain/entities/farmer';
import { FarmersRepository } from '@domain/repositories/farmer-repository';

export class InMemoryFarmersRepository implements FarmersRepository {
  public items: Farmer[] = [];

  async list({ page, limit }: PaginationParams): Promise<Farmer[]> {
    return this.items.slice((page - 1) * limit, page * limit);
  }

  async findById(id: string): Promise<Farmer | null> {
    const farmer = this.items.find((farmer) =>
      farmer.id.equals(new UniqueEntityID(id)),
    );
    return farmer || null;
  }

  async findByDocument(document: string): Promise<Farmer | null> {
    const farmer = this.items.find((farmer) => farmer.document === document);
    return farmer || null;
  }

  async create(farmer: Farmer): Promise<Farmer> {
    this.items.push(farmer);
    return farmer;
  }

  async update(farmer: Farmer): Promise<Farmer> {
    const index = this.items.findIndex((item) => item.id === farmer.id);
    this.items[index] = farmer;
    return farmer;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(
      (farmer) => farmer.id === new UniqueEntityID(id),
    );
    this.items.splice(index, 1);
  }
}
