import { Injectable } from '@nestjs/common';
import { Harvest } from '../entities/harvest';
import { HarvestsRepository } from '../repositories/harvest-repository';
import { Either, right } from '@core/either';

interface CreateHarvestUseCaseRequest {
  description: string;
  year: number;
}

type CreateHarvestUseCaseResponse = Either<null, { harvest: Harvest }>;

@Injectable()
export class CreateHarvestUseCase {
  constructor(private harvestsRepository: HarvestsRepository) {}

  async execute({
    description,
    year,
  }: CreateHarvestUseCaseRequest): Promise<CreateHarvestUseCaseResponse> {
    const harvest = Harvest.create({
      description,
      year,
    });

    await this.harvestsRepository.create(harvest);

    return right({
      harvest,
    });
  }
}
