import { Module } from '@nestjs/common';
import { CreateFarmerController } from './controllers/create-farmer.controller';
import { UpdateFarmerController } from './controllers/update-farmer.controller';
import { DeleteFarmerController } from './controllers/delete-farmer.controller';
import { DatabaseModule } from '@infra/database/database.module';
import { CreateFarmerUseCase } from '@domain/use-cases/create-farmer';
import { UpdateFarmerUseCase } from '@domain/use-cases/update-farmer';
import { DeleteFarmerUseCase } from '@domain/use-cases/delete-farmer';
import { ListFarmerController } from './controllers/list-farmer.controller';
import { ListFarmerUseCase } from '@domain/use-cases/list-farmer';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateFarmerController,
    UpdateFarmerController,
    DeleteFarmerController,
    ListFarmerController,
  ],
  providers: [
    CreateFarmerUseCase,
    UpdateFarmerUseCase,
    DeleteFarmerUseCase,
    ListFarmerUseCase,
  ],
})
export class HttpModule {}
