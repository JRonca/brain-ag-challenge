import { UseCaseError } from '@core/errors/use-case-error';

export class InvalidTotalAreaError extends Error implements UseCaseError {
  constructor() {
    super(
      'The sum of arableArea and vegetationArea must be equal to totalArea',
    );
  }
}
