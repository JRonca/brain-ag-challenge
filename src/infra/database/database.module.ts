import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaFarmersRepository } from './prisma/repositories/prisma-farmer-repository';
import { FarmersRepository } from '@domain/repositories/farmer-repository';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { PrismaFarmsRepository } from './prisma/repositories/prisma-farm-repository';

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
  ],
  exports: [PrismaService, FarmersRepository, FarmsRepository],
})
export class DatabaseModule {}
