import { Either } from '@core/either';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { PlantedCrop } from '@domain/entities/planted-crop';

export interface CreatePlantedCropUseCaseRequestDTO {
  farmId: string;
  harvestId: string;
  name: string;
}

export type CreatePlantedCropUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { plantedCrop: PlantedCrop }
>;
