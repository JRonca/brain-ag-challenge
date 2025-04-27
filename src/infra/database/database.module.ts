import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaFarmersRepository } from './prisma/repositories/prisma-farmer-repository';
import { FarmersRepository } from '@domain/repositories/farmer-repository';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { PrismaFarmsRepository } from './prisma/repositories/prisma-farm-repository';
import { HarvestsRepository } from '@domain/repositories/harvest-repository';
import { PrismaHarvestsRepository } from './prisma/repositories/prisma-harvest-repository';
import { PlantedCropsRepository } from '@domain/repositories/planted-crop-repository';
import { PrismaPlantedCropsRepository } from './prisma/repositories/prisma-planted-crop-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: FarmersRepository,
      useClass: PrismaFarmersRepository,
    },
    {
      provide: FarmsRepository,
      useClass: PrismaFarmsRepository,
    },
    {
      provide: HarvestsRepository,
      useClass: PrismaHarvestsRepository,
    },
    {
      provide: PlantedCropsRepository,
      useClass: PrismaPlantedCropsRepository,
    },
  ],
  exports: [
    PrismaService,
    FarmersRepository,
    FarmsRepository,
    HarvestsRepository,
    PlantedCropsRepository,
  ],
})
export class DatabaseModule {}
