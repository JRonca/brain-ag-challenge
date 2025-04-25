import { UseCaseError } from './use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(resource?: string, identifier?: string) {
    super(
      `Resource ${resource} with identifier ${identifier} not found` ||
        'Resource not found',
    );
  }
}
