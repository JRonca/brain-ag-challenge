import { PlantedCrop } from '../entities/planted-crop';

export abstract class PlantedCropsRepository {
  abstract create(plantedCrop: PlantedCrop): Promise<PlantedCrop>;
  abstract groupByCrop(): Promise<
    {
      crop: string;
      count: number;
    }[]
  >;
}
