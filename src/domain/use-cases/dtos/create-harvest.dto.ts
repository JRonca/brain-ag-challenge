import { Either } from '@core/either';
import { Harvest } from '@domain/entities/harvest';

export interface CreateHarvestUseCaseRequestDTO {
  description: string;
  year: number;
}

export type CreateHarvestUseCaseResponseDTO = Either<
  null,
  { harvest: Harvest }
>;
