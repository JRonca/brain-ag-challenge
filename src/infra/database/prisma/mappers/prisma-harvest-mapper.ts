import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Harvest } from '@domain/entities/harvest';
import { Prisma, Harvest as PrismaHarvest } from '@prisma/client';

export class PrismaHarvestMapper {
  static toDomain(raw: PrismaHarvest): any {
    return Harvest.create(
      {
        description: raw.description,
        year: raw.year,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(harvest: Harvest): Prisma.HarvestUncheckedCreateInput {
    return {
      id: harvest.id.toString(),
      description: harvest.description,
      year: harvest.year,
    };
  }
}
