import { PaginationParams } from '@core/repositories/pagination-params';
import { Farm } from '@domain/entities/farm';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

export class InMemoryFarmsRepository implements FarmsRepository {
  public items: Farm[] = [];

  async create(farm: Farm): Promise<Farm> {
    this.items.push(farm);
    return farm;
  }

  async findById(id: string): Promise<Farm | null> {
    const farm = this.items.find((farm) =>
      farm.id.equals(new UniqueEntityID(id)),
    );
    return farm ? Promise.resolve(farm) : Promise.resolve(null);
  }

  async list({ page, limit }: PaginationParams): Promise<Farm[]> {
    return this.items.slice((page - 1) * limit, page * limit);
  }

  async countFarms() {
    return this.items.length;
  }

  async sumTotalArea() {
    return this.items.reduce((total, farm) => total + farm.totalArea, 0);
  }

  async groupByState() {
    const stateCounts: { [key: string]: number } = {};

    for (const farm of this.items) {
      const state = farm.state;
      if (!stateCounts[state]) {
        stateCounts[state] = 0;
      }
      stateCounts[state]++;
    }

    return Object.entries(stateCounts).map(([state, count]) => ({
      state,
      count,
    }));
  }

  async getLandUsage() {
    const totalArableArea = this.items.reduce(
      (total, farm) => total + farm.arableArea,
      0,
    );
    const totalVegetationArea = this.items.reduce(
      (total, farm) => total + farm.vegetationArea,
      0,
    );

    return {
      arableArea: totalArableArea,
      vegetationArea: totalVegetationArea,
    };
  }
}
