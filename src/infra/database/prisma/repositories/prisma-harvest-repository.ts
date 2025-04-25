import { Harvest } from '@domain/entities/harvest';
import { HarvestsRepository } from '@domain/repositories/harvest-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaHarvestMapper } from '../mappers/prisma-harvest-mapper';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

@Injectable()
export class PrismaHarvestsRepository implements HarvestsRepository {
  constructor(private prisma: PrismaService) {}

  async create(harvest: Harvest): Promise<Harvest> {
    const raw = PrismaHarvestMapper.toPrisma(harvest);

    const createdHarvest = await this.prisma.harvest.create({
      data: raw,
    });

    return PrismaHarvestMapper.toDomain(createdHarvest);
  }

  async findById(id: UniqueEntityID): Promise<Harvest | null> {
    const harvest = await this.prisma.harvest.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (!harvest) {
      return null;
    }

    return PrismaHarvestMapper.toDomain(harvest);
  }
}
