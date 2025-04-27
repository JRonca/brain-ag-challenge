import { UseCaseError } from '@core/errors/use-case-error';

export class FarmerAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Farmer ${identifier} already exists.`);
  }
}
