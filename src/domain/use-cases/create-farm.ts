import { Injectable } from '@nestjs/common';
import { Farm } from '../entities/farm';
import { FarmsRepository } from '../repositories/farm-repository';
import { FarmersRepository } from '@domain/repositories/farmer-repository';
import { left, right } from '@core/either';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import {
  CreateFarmUseCaseRequestDTO,
  CreateFarmUseCaseResponseDTO,
} from './dtos/create-farm.dto';
import { InvalidTotalAreaError } from './errors/invalid-total-area-error';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

@Injectable()
export class CreateFarmUseCase {
  constructor(
    private readonly farmsRepository: FarmsRepository,
    private readonly farmersRepository: FarmersRepository,
  ) {}

  async execute({
    name,
    city,
    state,
    totalArea,
    arableArea,
    vegetationArea,
    farmerId,
  }: CreateFarmUseCaseRequestDTO): Promise<CreateFarmUseCaseResponseDTO> {
    const isTotalAreaValid = totalArea >= arableArea + vegetationArea;

    if (!isTotalAreaValid) {
      return left(new InvalidTotalAreaError());
    }

    const farmerExists = await this.farmersRepository.findById(farmerId);

    if (!farmerExists) {
      return left(new ResourceNotFoundError('Farmer', farmerId));
    }

    const farm = Farm.create({
      name,
      city,
      state,
      totalArea,
      arableArea,
      vegetationArea,
      farmerId: new UniqueEntityID(farmerId),
    });

    await this.farmsRepository.create(farm);

    return right({
      farm,
    });
  }
}
