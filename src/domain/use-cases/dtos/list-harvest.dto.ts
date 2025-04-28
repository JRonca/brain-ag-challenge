import { Either } from '@core/either';
import { Harvest } from '@domain/entities/harvest';

export interface ListHarvestUseCaseRequestDTO {
  page: number;
  limit: number;
}

export type ListHarvestUseCaseResponseDTO = Either<
  null,
  {
    harvests: Harvest[];
  }
>;
