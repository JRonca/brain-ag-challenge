import { Injectable } from '@nestjs/common';
import { Farm } from '../entities/farm';
import { FarmsRepository } from '../repositories/farm-repository';
import { FarmersRepository } from '@domain/repositories/farmer-repository';
import { Either, left, right } from '@core/either';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { InvalidTotalAreaError } from './errors/invalid-total-area-error';

interface CreateFarmUseCaseRequest {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  farmerId: UniqueEntityID;
}

type CreateFarmUseCaseResponse = Either<
  ResourceNotFoundError | InvalidTotalAreaError,
  { farm: Farm }
>;

@Injectable()
export class CreateFarmUseCase {
  constructor(
    private farmsRepository: FarmsRepository,
    private farmersRepository: FarmersRepository,
  ) {}

  async execute({
    name,
    city,
    state,
    totalArea,
    arableArea,
    vegetationArea,
    farmerId,
  }: CreateFarmUseCaseRequest): Promise<CreateFarmUseCaseResponse> {
    const isTotalAreaValid = totalArea === arableArea + vegetationArea;

    if (!isTotalAreaValid) {
      return left(new InvalidTotalAreaError());
    }

    const farmerExists = await this.farmersRepository.findById(farmerId);

    if (!farmerExists) {
      return left(new ResourceNotFoundError('Farmer', farmerId.toString()));
    }

    const farm = Farm.create({
      name,
      city,
      state,
      totalArea,
      arableArea,
      vegetationArea,
      farmerId,
    });

    await this.farmsRepository.create(farm);

    return right({
      farm,
    });
  }
}
