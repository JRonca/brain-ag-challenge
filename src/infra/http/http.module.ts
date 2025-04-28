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
import { CreateFarmController } from './controllers/create-farm.controller';
import { CreateFarmUseCase } from '@domain/use-cases/create-farm';
import { CreateHarvestController } from './controllers/create-harvest.controller';
import { CreateHarvestUseCase } from '@domain/use-cases/create-harvest';
import { CreatePlantedCropController } from './controllers/create-planted-crop.controller';
import { CreatePlantedCropUseCase } from '@domain/use-cases/create-planted-crop';
import { ListFarmController } from './controllers/list-farm.controller';
import { ListFarmUseCase } from '@domain/use-cases/list-farm';
import { ListHarvestController } from './controllers/list-harvest.controller';
import { ListHarvestUseCase } from '@domain/use-cases/list-harvest';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateFarmerController,
    UpdateFarmerController,
    DeleteFarmerController,
    ListFarmerController,
    CreateFarmController,
    CreateHarvestController,
    CreatePlantedCropController,
    ListFarmController,
    ListHarvestController,
  ],
  providers: [
    CreateFarmerUseCase,
    UpdateFarmerUseCase,
    DeleteFarmerUseCase,
    ListFarmerUseCase,
    CreateFarmUseCase,
    CreateHarvestUseCase,
    CreatePlantedCropUseCase,
    ListFarmUseCase,
    ListHarvestUseCase,
  ],
})
export class HttpModule {}
