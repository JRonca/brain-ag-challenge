import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaFarmersRepository } from './prisma/repositories/prisma-farmer-repository';
import { FarmersRepository } from '@domain/repositories/farmer-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: FarmersRepository,
      useClass: PrismaFarmersRepository,
    },
  ],
  exports: [PrismaService, FarmersRepository],
})
export class DatabaseModule {}
