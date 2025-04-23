import { Module } from '@nestjs/common';
import { PrismaService } from './infra/database/prisma/prisma.service';
import { CreateFarmerController } from './infra/http/controllers/create-farmer.controller';

@Module({
  imports: [],
  controllers: [CreateFarmerController],
  providers: [PrismaService],
})
export class AppModule {}
