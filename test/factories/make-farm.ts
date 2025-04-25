import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farm, FarmProps } from '@domain/entities/farm';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaFarmMapper } from '@infra/database/prisma/mappers/prisma-farm-mapper';

export function makeFarm(
  override: Partial<FarmProps> = {},
  id?: UniqueEntityID,
) {
  const arableArea = faker.number.int({ min: 1, max: 100 });
  const vegetationArea = faker.number.int({ min: 1, max: 100 });
  const totalArea = arableArea + vegetationArea;
  const farm = Farm.create(
    {
      farmerId: new UniqueEntityID(),
      city: faker.location.city(),
      state: faker.location.state(),
      name: faker.commerce.productName(),
      arableArea,
      vegetationArea,
      totalArea,
      ...override,
    },
    id,
  );

  return farm;
}

@Injectable()
export class FarmFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaFarm(data: Partial<FarmProps> = {}): Promise<Farm> {
    const farm = makeFarm(data);

    await this.prisma.farm.create({
      data: PrismaFarmMapper.toPrisma(farm),
    });

    return farm;
  }
}
