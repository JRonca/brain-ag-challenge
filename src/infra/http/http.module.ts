import { Module } from '@nestjs/common';
import { CreateFarmerController } from './controllers/create-farmer.controller';
import { UpdateFarmerController } from './controllers/update-farmer.controller';
import { DatabaseModule } from '@infra/database/database.module';
import { CreateFarmerUseCase } from '@domain/use-cases/create-farmer';
import { UpdateFarmerUseCase } from '@domain/use-cases/update-farmer';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateFarmerController, UpdateFarmerController],
  providers: [CreateFarmerUseCase, UpdateFarmerUseCase],
})
export class HttpModule {}
