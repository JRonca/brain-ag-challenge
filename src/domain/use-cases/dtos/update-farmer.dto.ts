import { Either } from '@core/either';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { Farmer } from '@domain/entities/farmer';

export interface UpdateFarmerUseCaseRequestDTO {
  id: string;
  name?: string;
  document?: string;
}

export type UpdateFarmerUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { farmer: Farmer }
>;
