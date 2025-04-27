import { UseCaseError } from './use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(resource?: string, identifier?: string) {
    const message =
      resource && identifier
        ? `Resource ${resource} with identifier ${identifier} not found`
        : resource;
    super(message);
  }
}
