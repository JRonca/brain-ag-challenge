import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farmer } from '@domain/entities/farmer';
import { FarmersRepository } from '@domain/repositories/farmer-repository';

export class InMemoryFarmersRepository implements FarmersRepository {
  public items: Farmer[] = [];

  async list(): Promise<Farmer[]> {
    return this.items;
  }

  async findById(id: UniqueEntityID): Promise<Farmer | null> {
    const farmer = this.items.find((farmer) => farmer.id === id);
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

  async delete(id: UniqueEntityID): Promise<void> {
    const index = this.items.findIndex((farmer) => farmer.id === id);
    this.items.splice(index, 1);
  }
}
