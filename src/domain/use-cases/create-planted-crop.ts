import { Injectable } from '@nestjs/common';
import { PlantedCrop } from '../entities/planted-crop';
import { PlantedCropsRepository } from '../repositories/planted-crop-repository';
import { left, right } from '@core/either';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { HarvestsRepository } from '@domain/repositories/harvest-repository';
import {
  CreatePlantedCropUseCaseRequestDTO,
  CreatePlantedCropUseCaseResponseDTO,
} from '@domain/use-cases/dtos/create-planted-crop-dto';

@Injectable()
export class CreatePlantedCropUseCase {
  constructor(
    private plantedCropsRepository: PlantedCropsRepository,
    private farmsRepository: FarmsRepository,
    private harvestsRepository: HarvestsRepository,
  ) {}

  async execute({
    farmId,
    harvestId,
    name,
  }: CreatePlantedCropUseCaseRequestDTO): Promise<CreatePlantedCropUseCaseResponseDTO> {
    const farmExists = await this.farmsRepository.findById(farmId);

    if (!farmExists) {
      return left(new ResourceNotFoundError('Farm', farmId.toString()));
    }

    const harvestExists = await this.harvestsRepository.findById(harvestId);

    if (!harvestExists) {
      return left(new ResourceNotFoundError('Harvest', harvestId.toString()));
    }

    const plantedCrop = PlantedCrop.create({
      farmId,
      harvestId,
      name,
    });

    await this.plantedCropsRepository.create(plantedCrop);

    return right({
      plantedCrop,
    });
  }
}
