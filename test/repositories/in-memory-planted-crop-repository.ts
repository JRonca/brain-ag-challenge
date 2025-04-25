import { PlantedCrop } from '@domain/entities/planted-crop';
import { PlantedCropsRepository } from '@domain/repositories/planted-crop-repository';

export class InMemoryPlantedCropsRepository implements PlantedCropsRepository {
  public items: PlantedCrop[] = [];

  async create(plantedCrop: PlantedCrop): Promise<PlantedCrop> {
    this.items.push(plantedCrop);
    return plantedCrop;
  }
}
