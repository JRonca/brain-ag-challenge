import { DashboardMetricsDTO } from '@domain/use-cases/dtos/dashboard-metrics.dto';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { PlantedCropsRepository } from '@domain/repositories/planted-crop-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetDashboardMetricsUseCase {
  constructor(
    private readonly farmsRepository: FarmsRepository,
    private readonly plantedCropsRepository: PlantedCropsRepository,
  ) {}

  async execute(): Promise<DashboardMetricsDTO> {
    const totalFarms = await this.farmsRepository.countFarms();
    const totalHectares = await this.farmsRepository.sumTotalArea();
    const byState = await this.farmsRepository.groupByState();
    const byCrop = await this.plantedCropsRepository.groupByCrop();
    const landUsage = await this.farmsRepository.getLandUsage();

    return {
      totalFarms,
      totalHectares,
      byState,
      byCrop,
      landUsage,
    };
  }
}
