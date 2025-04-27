import { Either } from '@core/either';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';

export interface DeleteFarmerUseCaseRequestDTO {
  id: string;
}

export type DeleteFarmerUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { deleted: true }
>;
