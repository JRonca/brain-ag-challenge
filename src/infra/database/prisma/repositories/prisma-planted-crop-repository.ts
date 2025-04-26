import { PlantedCrop } from '@domain/entities/planted-crop';
import { PlantedCropsRepository } from '@domain/repositories/planted-crop-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaPlantedCropMapper } from '../mappers/prisma-planted-crop-mapper';

@Injectable()
export class PrismaPlantedCropsRepository implements PlantedCropsRepository {
  constructor(private prisma: PrismaService) {}

  async create(PlantedCrop: PlantedCrop): Promise<PlantedCrop> {
    const raw = PrismaPlantedCropMapper.toPrisma(PlantedCrop);

    const createdPlantedCrop = await this.prisma.plantedCrop.create({
      data: raw,
    });

    return PrismaPlantedCropMapper.toDomain(createdPlantedCrop);
  }

  async groupByCrop(): Promise<{ crop: string; count: number }[]> {
    return this.prisma.plantedCrop
      .groupBy({
        by: ['name'],
        _count: {
          name: true,
        },
      })
      .then((result) => {
        return result.map((item) => ({
          crop: item.name,
          count: item._count.name,
        }));
      });
  }
}
