import { Either } from '@core/either';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { InvalidTotalAreaError } from '../errors/invalid-total-area-error';
import { Farm } from '@domain/entities/farm';

export interface CreateFarmUseCaseRequestDTO {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  farmerId: UniqueEntityID;
}

export type CreateFarmUseCaseResponseDTO = Either<
  ResourceNotFoundError | InvalidTotalAreaError,
  { farm: Farm }
>;
