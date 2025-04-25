import { Farm } from '@domain/entities/farm';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaFarmMapper } from '../mappers/prisma-farm-mapper';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

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

  async findById(id: UniqueEntityID): Promise<Farm | null> {
    const farm = await this.prisma.farm.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (!farm) {
      return null;
    }

    return PrismaFarmMapper.toDomain(farm);
  }
}
