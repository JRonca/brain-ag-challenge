import { Farm } from '@domain/entities/farm';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaFarmMapper } from '../mappers/prisma-farm-mapper';
import { PaginationParams } from '@core/repositories/pagination-params';

@Injectable()
export class PrismaFarmsRepository implements FarmsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(farm: Farm): Promise<Farm> {
    const raw = PrismaFarmMapper.toPrisma(farm);

    const createdFarm = await this.prisma.farm.create({
      data: raw,
    });

    return PrismaFarmMapper.toDomain(createdFarm);
  }

  async findById(id: string): Promise<Farm | null> {
    const farm = await this.prisma.farm.findUnique({
      where: {
        id: id,
      },
    });

    if (!farm) {
      return null;
    }

    return PrismaFarmMapper.toDomain(farm);
  }

  async list({ page, limit }: PaginationParams): Promise<Farm[]> {
    const farms = await this.prisma.farm.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return farms.map(PrismaFarmMapper.toDomain);
  }

  async countFarms(): Promise<number> {
    const count = await this.prisma.farm.count();
    return count;
  }

  async sumTotalArea(): Promise<number> {
    const totalArea = await this.prisma.farm.aggregate({
      _sum: {
        totalArea: true,
      },
    });

    return totalArea._sum.totalArea ?? 0;
  }

  async groupByState(): Promise<{ state: string; count: number }[]> {
    const stateCounts = await this.prisma.farm.groupBy({
      by: ['state'],
      _count: {
        state: true,
      },
    });

    return stateCounts.map((item) => ({
      state: item.state,
      count: item._count.state,
    }));
  }

  async getLandUsage(): Promise<{
    arableArea: number;
    vegetationArea: number;
  }> {
    const landUsage = await this.prisma.farm.aggregate({
      _sum: {
        arableArea: true,
        vegetationArea: true,
      },
    });

    return {
      arableArea: landUsage._sum.arableArea ?? 0,
      vegetationArea: landUsage._sum.vegetationArea ?? 0,
    };
  }
}
