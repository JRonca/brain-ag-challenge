import { Either } from '@core/either';
import { Farm } from '@domain/entities/farm';

export interface ListFarmUseCaseRequestDTO {
  page: number;
  limit: number;
}

export type ListFarmUseCaseResponseDTO = Either<
  null,
  {
    farms: Farm[];
  }
>;
