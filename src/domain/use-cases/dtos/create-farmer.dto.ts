import { Either } from '@core/either';
import { InvalidDocumentError } from '../errors/invalid-document-error';
import { FarmerAlreadyExistsError } from '../errors/farmer-already-exists-error';
import { Farmer } from '@domain/entities/farmer';

export interface CreateFarmerUseCaseRequestDTO {
  name: string;
  document: string;
}

export type CreateFarmerUseCaseResponseDTO = Either<
  FarmerAlreadyExistsError | InvalidDocumentError,
  { farmer: Farmer }
>;
