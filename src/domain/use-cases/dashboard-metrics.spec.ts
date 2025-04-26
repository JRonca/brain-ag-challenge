import { GetDashboardMetricsUseCase } from './dashboard-metrics';
import { FarmsRepository } from '@domain/repositories/farm-repository';
import { PlantedCropsRepository } from '@domain/repositories/planted-crop-repository';

describe('GetDashboardMetricsUseCase', () => {
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let plantedCropsRepository: jest.Mocked<PlantedCropsRepository>;
  let getDashboardMetricsUseCase: GetDashboardMetricsUseCase;

  beforeEach(() => {
    farmsRepository = {
      countFarms: jest.fn(),
      sumTotalArea: jest.fn(),
      groupByState: jest.fn(),
      getLandUsage: jest.fn(),
    } as unknown as jest.Mocked<FarmsRepository>;

    plantedCropsRepository = {
      groupByCrop: jest.fn(),
    } as unknown as jest.Mocked<PlantedCropsRepository>;

    getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(
      farmsRepository,
      plantedCropsRepository,
    );
  });

  it('should return dashboard metrics', async () => {
    farmsRepository.countFarms.mockResolvedValue(10);
    farmsRepository.sumTotalArea.mockResolvedValue(1000);
    farmsRepository.groupByState.mockResolvedValue([
      { state: 'PR', count: 5 },
      { state: 'SP', count: 3 },
      { state: 'MG', count: 2 },
    ]);
    plantedCropsRepository.groupByCrop.mockResolvedValue([
      { crop: 'milho', count: 3 },
      { crop: 'soja', count: 2 },
      { crop: 'trigo', count: 1 },
      { crop: 'aveia', count: 1 },
      { crop: 'cana', count: 1 },
      { crop: 'arroz', count: 1 },
      { crop: 'feijao', count: 1 },
      { crop: 'trigo', count: 1 },
    ]);
    farmsRepository.getLandUsage.mockResolvedValue({
      arableArea: 200,
      vegetationArea: 800,
    });

    const result = await getDashboardMetricsUseCase.execute();

    expect(result).toEqual({
      totalFarms: 10,
      totalHectares: 1000,
      byState: [
        { state: 'PR', count: 5 },
        { state: 'SP', count: 3 },
        { state: 'MG', count: 2 },
      ],
      byCrop: [
        { crop: 'milho', count: 3 },
        { crop: 'soja', count: 2 },
        { crop: 'trigo', count: 1 },
        { crop: 'aveia', count: 1 },
        { crop: 'cana', count: 1 },
        { crop: 'arroz', count: 1 },
        { crop: 'feijao', count: 1 },
        { crop: 'trigo', count: 1 },
      ],
      landUsage: {
        arableArea: 200,
        vegetationArea: 800,
      },
    });
  });

  it('should handle empty data gracefully', async () => {
    farmsRepository.countFarms.mockResolvedValue(0);
    farmsRepository.sumTotalArea.mockResolvedValue(0);
    farmsRepository.groupByState.mockResolvedValue([]);
    plantedCropsRepository.groupByCrop.mockResolvedValue([]);
    farmsRepository.getLandUsage.mockResolvedValue({
      arableArea: 0,
      vegetationArea: 0,
    });

    const result = await getDashboardMetricsUseCase.execute();

    expect(result).toEqual({
      totalFarms: 0,
      totalHectares: 0,
      byState: [],
      byCrop: [],
      landUsage: {
        arableArea: 0,
        vegetationArea: 0,
      },
    });
  });
});
