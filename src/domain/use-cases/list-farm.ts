import { Injectable } from '@nestjs/common';
import { FarmsRepository } from '../repositories/farm-repository';
import { right } from '@core/either';
import {
  ListFarmUseCaseRequestDTO,
  ListFarmUseCaseResponseDTO,
} from './dtos/list-farm.dto';

@Injectable()
export class ListFarmUseCase {
  constructor(private readonly farmsRepository: FarmsRepository) {}

  async execute({
    page,
    limit,
  }: ListFarmUseCaseRequestDTO): Promise<ListFarmUseCaseResponseDTO> {
    const farms = await this.farmsRepository.list({
      page,
      limit,
    });

    return right({
      farms,
    });
  }
}
