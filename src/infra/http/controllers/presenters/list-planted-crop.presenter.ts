import { PlantedCrop } from '@domain/entities/planted-crop';

export class PlantedCropPresenter {
  static toHTTP(plantedCrop: PlantedCrop) {
    return {
      id: plantedCrop.id.toString(),
      farmId: plantedCrop.farmId.toString(),
      harvestId: plantedCrop.harvestId.toString(),
      name: plantedCrop.name,
    };
  }
}
