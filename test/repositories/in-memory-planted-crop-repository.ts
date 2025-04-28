import { PaginationParams } from '@core/repositories/pagination-params';
import { PlantedCrop } from '@domain/entities/planted-crop';
import { PlantedCropsRepository } from '@domain/repositories/planted-crop-repository';

export class InMemoryPlantedCropsRepository implements PlantedCropsRepository {
  public items: PlantedCrop[] = [];

  async create(plantedCrop: PlantedCrop): Promise<PlantedCrop> {
    this.items.push(plantedCrop);
    return plantedCrop;
  }

  async list({ page, limit }: PaginationParams): Promise<PlantedCrop[]> {
    return this.items.slice((page - 1) * limit, page * limit);
  }

  async groupByCrop(): Promise<{ crop: string; count: number }[]> {
    const cropCounts: { [key: string]: number } = {};

    for (const plantedCrop of this.items) {
      const cropName = plantedCrop.name;
      if (!cropCounts[cropName]) {
        cropCounts[cropName] = 0;
      }
      cropCounts[cropName]++;
    }

    return Object.entries(cropCounts).map(([crop, count]) => ({
      crop,
      count,
    }));
  }
}
