import { Injectable } from '@nestjs/common';
import { FarmersRepository } from '../repositories/farmer-repository';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { left, right } from '@core/either';
import {
  DeleteFarmerUseCaseRequestDTO,
  DeleteFarmerUseCaseResponseDTO,
} from './dtos/delete-farmer.dto';

@Injectable()
export class DeleteFarmerUseCase {
  constructor(private readonly farmersRepository: FarmersRepository) {}

  async execute({
    id,
  }: DeleteFarmerUseCaseRequestDTO): Promise<DeleteFarmerUseCaseResponseDTO> {
    const farmer = await this.farmersRepository.findById(id);

    if (!farmer) {
      return left(new ResourceNotFoundError('Farmer', id));
    }

    await this.farmersRepository.delete(farmer.id.toString());

    return right({
      deleted: true,
    });
  }
}
