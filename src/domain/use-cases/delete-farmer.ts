import { Injectable } from '@nestjs/common';
import { FarmersRepository } from '../repositories/farmer-repository';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Either, left, right } from '@core/either';

interface DeleteFarmerUseCaseRequest {
  id: UniqueEntityID;
}

type DeleteFarmerUseCaseResponse = Either<
  ResourceNotFoundError,
  { deleted: true }
>;

@Injectable()
export class DeleteFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    id,
  }: DeleteFarmerUseCaseRequest): Promise<DeleteFarmerUseCaseResponse> {
    const farmer = await this.farmersRepository.findById(id);

    if (!farmer) {
      return left(new ResourceNotFoundError('Farmer', id.toString()));
    }

    await this.farmersRepository.delete(farmer.id);

    return right({
      deleted: true,
    });
  }
}
