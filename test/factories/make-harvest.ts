import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Harvest, HarvestProps } from '@domain/entities/harvest';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaHarvestMapper } from '@infra/database/prisma/mappers/prisma-harvest-mapper';

export function makeHarvest(
  override: Partial<HarvestProps> = {},
  id?: UniqueEntityID,
) {
  const year = faker.date.past().getFullYear();

  const harvest = Harvest.create(
    {
      description: `Safra de ${year}`,
      year: year,
      ...override,
    },
    id,
  );

  return harvest;
}

@Injectable()
export class HarvestFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaHarvest(data: Partial<HarvestProps> = {}): Promise<Harvest> {
    const harvest = makeHarvest(data);

    await this.prisma.harvest.create({
      data: PrismaHarvestMapper.toPrisma(harvest),
    });

    return harvest;
  }
}
