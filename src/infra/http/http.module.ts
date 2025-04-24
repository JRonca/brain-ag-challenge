import { Module } from '@nestjs/common';
import { CreateFarmerController } from './controllers/create-farmer.controller';
import { PrismaService } from '../database/prisma/prisma.service';

@Module({
  controllers: [CreateFarmerController],
  providers: [PrismaService],
})
export class HttpModule {}
