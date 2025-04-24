import { Module } from '@nestjs/common';
import { CreateFarmerController } from './controllers/create-farmer.controller';
import { DatabaseModule } from '@infra/database/database.module';
import { CreateFarmerUseCase } from '@domain/use-cases/create-farmer';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateFarmerController],
  providers: [CreateFarmerUseCase],
})
export class HttpModule {}
