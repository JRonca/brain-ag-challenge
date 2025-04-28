import { Module } from '@nestjs/common';
import { DashboardResolver } from './dashboard.resolver';
import { GetDashboardMetricsUseCase } from '@domain/use-cases/dashboard-metrics';
import { PrismaFarmsRepository } from '@infra/database/prisma/repositories/prisma-farm-repository';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { PrismaPlantedCropsRepository } from '@infra/database/prisma/repositories/prisma-planted-crop-repository';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { PlantedCropsRepository } from '@domain/repositories/planted-crop-repository';

@Module({
  providers: [
    DashboardResolver,
    GetDashboardMetricsUseCase,
    PrismaService,
    {
      provide: FarmsRepository,
      useClass: PrismaFarmsRepository,
    },
    {
      provide: PlantedCropsRepository,
      useClass: PrismaPlantedCropsRepository,
    },
  ],
})
export class DashboardGraphqlModule {}
