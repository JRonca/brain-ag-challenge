import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { PlantedCrop } from '@domain/entities/planted-crop';
import { Prisma, PlantedCrop as PrismaPlantedCrop } from '@prisma/client';

export class PrismaPlantedCropMapper {
  static toDomain(raw: PrismaPlantedCrop): any {
    return PlantedCrop.create(
      {
        farmId: new UniqueEntityID(raw.farmId),
        harvestId: new UniqueEntityID(raw.harvestId),
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    plantedCrop: PlantedCrop,
  ): Prisma.PlantedCropUncheckedCreateInput {
    return {
      id: plantedCrop.id.toString(),
      farmId: plantedCrop.farmId.toString(),
      harvestId: plantedCrop.harvestId.toString(),
      name: plantedCrop.name,
    };
  }
}
