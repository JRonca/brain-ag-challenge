import { PlantedCrop } from '../entities/planted-crop';
import { PaginationParams } from '@core/repositories/pagination-params';

export abstract class PlantedCropsRepository {
  abstract create(plantedCrop: PlantedCrop): Promise<PlantedCrop>;
  abstract list(params: PaginationParams): Promise<PlantedCrop[]>;
  abstract groupByCrop(): Promise<
    {
      crop: string;
      count: number;
    }[]
  >;
}
