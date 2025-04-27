import { Either } from '@core/either';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { PlantedCrop } from '@domain/entities/planted-crop';

export interface CreatePlantedCropUseCaseRequestDTO {
  farmId: UniqueEntityID;
  harvestId: UniqueEntityID;
  name: string;
}

export type CreatePlantedCropUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { plantedCrop: PlantedCrop }
>;
