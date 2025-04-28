import { Harvest } from '@domain/entities/harvest';
import { HarvestsRepository } from '@domain/repositories/harvest-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaHarvestMapper } from '../mappers/prisma-harvest-mapper';
import { PaginationParams } from '@core/repositories/pagination-params';

@Injectable()
export class PrismaHarvestsRepository implements HarvestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(harvest: Harvest): Promise<Harvest> {
    const raw = PrismaHarvestMapper.toPrisma(harvest);

    const createdHarvest = await this.prisma.harvest.create({
      data: raw,
    });

    return PrismaHarvestMapper.toDomain(createdHarvest);
  }

  async findById(id: string): Promise<Harvest | null> {
    const harvest = await this.prisma.harvest.findUnique({
      where: {
        id: id,
      },
    });

    if (!harvest) {
      return null;
    }

    return PrismaHarvestMapper.toDomain(harvest);
  }

  async list({ page, limit }: PaginationParams): Promise<Harvest[]> {
    const harvests = await this.prisma.harvest.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return harvests.map(PrismaHarvestMapper.toDomain);
  }
}
