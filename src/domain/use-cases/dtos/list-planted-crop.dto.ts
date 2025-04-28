import { Either } from '@core/either';
import { PlantedCrop } from '@domain/entities/planted-crop';

export interface ListPlantedCropUseCaseRequestDTO {
  page: number;
  limit: number;
}

export type ListPlantedCropUseCaseResponseDTO = Either<
  null,
  {
    plantedCrops: PlantedCrop[];
  }
>;
