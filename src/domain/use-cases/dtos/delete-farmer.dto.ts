import { Either } from '@core/either';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';

export interface DeleteFarmerUseCaseRequestDTO {
  id: UniqueEntityID;
}

export type DeleteFarmerUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { deleted: true }
>;
