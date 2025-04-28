import { Injectable } from '@nestjs/common';
import { HarvestsRepository } from '../repositories/harvest-repository';
import { right } from '@core/either';
import {
  ListHarvestUseCaseRequestDTO,
  ListHarvestUseCaseResponseDTO,
} from './dtos/list-harvest.dto';

@Injectable()
export class ListHarvestUseCase {
  constructor(private readonly harvestsRepository: HarvestsRepository) {}

  async execute({
    page,
    limit,
  }: ListHarvestUseCaseRequestDTO): Promise<ListHarvestUseCaseResponseDTO> {
    const harvests = await this.harvestsRepository.list({
      page,
      limit,
    });

    return right({
      harvests,
    });
  }
}
