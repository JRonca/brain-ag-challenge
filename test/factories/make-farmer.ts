import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farmer, FarmerProps } from '@domain/entities/farmer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaFarmerMapper } from '@infra/database/prisma/mappers/prisma-farmer-mapper';
import { generateValidCNPJ, generateValidCPF } from 'test/utils';

export function makeFarmer(
  override: Partial<FarmerProps> = {},
  id?: UniqueEntityID,
) {
  const docRandom = faker.datatype.boolean();
  const farmer = Farmer.create(
    {
      name: faker.person.fullName(),
      document: docRandom ? generateValidCPF() : generateValidCNPJ(),
      documentType: docRandom ? 'CPF' : 'CNPJ',
      ...override,
    },
    id,
  );

  return farmer;
}

@Injectable()
export class FarmerFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaFarmer(data: Partial<FarmerProps> = {}): Promise<Farmer> {
    const farmer = makeFarmer(data);

    await this.prisma.farmer.create({
      data: PrismaFarmerMapper.toPrisma(farmer),
    });

    return farmer;
  }
}
