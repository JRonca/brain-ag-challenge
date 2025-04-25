import { Farm } from '@domain/entities/farm';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaFarmMapper } from '../mappers/prisma-farm-mapper';

@Injectable()
export class PrismaFarmsRepository implements FarmsRepository {
  constructor(private prisma: PrismaService) {}

  async create(farm: Farm): Promise<Farm> {
    const raw = PrismaFarmMapper.toPrisma(farm);

    const createdFarm = await this.prisma.farm.create({
      data: raw,
    });

    return PrismaFarmMapper.toDomain(createdFarm);
  }
}
