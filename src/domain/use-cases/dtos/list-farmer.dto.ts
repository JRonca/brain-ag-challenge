import { Either } from '@core/either';
import { Farmer } from '@domain/entities/farmer';

export interface ListFarmerUseCaseRequestDTO {
  page?: number;
  limit?: number;
}

export type ListFarmerUseCaseResponseDTO = Either<null, { farmers: Farmer[] }>;
