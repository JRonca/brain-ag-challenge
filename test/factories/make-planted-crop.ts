import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { PlantedCrop, PlantedCropProps } from '@domain/entities/planted-crop';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaPlantedCropMapper } from '@infra/database/prisma/mappers/prisma-planted-crop-mapper';

export function makePlantedCrop(
  override: Partial<PlantedCropProps> = {},
  id?: UniqueEntityID,
) {
  const plantedCrop = PlantedCrop.create(
    {
      farmId: new UniqueEntityID(),
      harvestId: new UniqueEntityID(),
      name: faker.food.vegetable(),
      ...override,
    },
    id,
  );

  return plantedCrop;
}

@Injectable()
export class PlantedCropFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPlantedCrop(
    data: Partial<PlantedCropProps> = {},
  ): Promise<PlantedCrop> {
    const plantedCrop = makePlantedCrop(data);

    await this.prisma.plantedCrop.create({
      data: PrismaPlantedCropMapper.toPrisma(plantedCrop),
    });

    return plantedCrop;
  }
}
