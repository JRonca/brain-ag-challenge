import { Injectable } from '@nestjs/common';
import { PlantedCropsRepository } from '../repositories/planted-crop-repository';
import { right } from '@core/either';
import {
  ListPlantedCropUseCaseRequestDTO,
  ListPlantedCropUseCaseResponseDTO,
} from './dtos/list-planted-crop.dto';

@Injectable()
export class ListPlantedCropUseCase {
  constructor(
    private readonly plantedCropsRepository: PlantedCropsRepository,
  ) {}

  async execute({
    page,
    limit,
  }: ListPlantedCropUseCaseRequestDTO): Promise<ListPlantedCropUseCaseResponseDTO> {
    const plantedCrops = await this.plantedCropsRepository.list({
      page,
      limit,
    });

    return right({
      plantedCrops,
    });
  }
}
