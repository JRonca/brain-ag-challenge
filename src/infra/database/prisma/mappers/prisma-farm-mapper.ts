import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farm } from '@domain/entities/farm';
import { Prisma, Farm as PrismaFarm } from '@prisma/client';

export class PrismaFarmMapper {
  static toDomain(raw: PrismaFarm): any {
    return Farm.create(
      {
        name: raw.name,
        city: raw.city,
        state: raw.state,
        totalArea: raw.totalArea,
        arableArea: raw.arableArea,
        vegetationArea: raw.vegetationArea,
        farmerId: new UniqueEntityID(raw.farmerId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(farm: Farm): Prisma.FarmUncheckedCreateInput {
    return {
      id: farm.id.toString(),
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      arableArea: farm.arableArea,
      vegetationArea: farm.vegetationArea,
      farmerId: farm.farmerId.toString(),
    };
  }
}
