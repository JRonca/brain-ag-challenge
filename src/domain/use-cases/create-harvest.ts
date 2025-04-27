import { Injectable } from '@nestjs/common';
import { Harvest } from '../entities/harvest';
import { HarvestsRepository } from '../repositories/harvest-repository';
import { right } from '@core/either';

import {
  CreateHarvestUseCaseRequestDTO,
  CreateHarvestUseCaseResponseDTO,
} from './dtos/create-harvest.dto';

@Injectable()
export class CreateHarvestUseCase {
  constructor(private harvestsRepository: HarvestsRepository) {}

  async execute({
    description,
    year,
  }: CreateHarvestUseCaseRequestDTO): Promise<CreateHarvestUseCaseResponseDTO> {
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
