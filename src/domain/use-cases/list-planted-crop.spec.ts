import { ListPlantedCropUseCase } from './list-planted-crop';
import { InMemoryPlantedCropsRepository } from 'test/repositories/in-memory-planted-crop-repository';
import { makePlantedCrop } from 'test/factories/make-planted-crop';
import { makeFarmer } from 'test/factories/make-farmer';
import { makeFarm } from 'test/factories/make-farm';
import { makeHarvest } from 'test/factories/make-harvest';
import { InMemoryFarmsRepository } from 'test/repositories/in-memory-farm-repository';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { InMemoryHarvestsRepository } from 'test/repositories/in-memory-harvest-repository';

let sut: ListPlantedCropUseCase;
let inMemoryPlantedCropsRepository: InMemoryPlantedCropsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryFarmersRepository: InMemoryFarmersRepository;
let inMemoryHarvestsRepository: InMemoryHarvestsRepository;

describe('List Planted Crops Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryPlantedCropsRepository = new InMemoryPlantedCropsRepository();

    sut = new ListPlantedCropUseCase(inMemoryPlantedCropsRepository);
  });

  it('should be able to list planted crops successfully', async () => {
    const farmer = makeFarmer();
    const farmerInMemory = await inMemoryFarmersRepository.create(farmer);

    const farm = makeFarm({ farmerId: farmerInMemory.id });
    const farmInMemory = await inMemoryFarmsRepository.create(farm);

    const harvest = makeHarvest();
    const harvestInMemory = await inMemoryHarvestsRepository.create(harvest);

    for (let i = 0; i < 10; i++) {
      const plantedCrop = makePlantedCrop({
        farmId: farmInMemory.id,
        harvestId: harvestInMemory.id,
      });
      await inMemoryPlantedCropsRepository.create(plantedCrop);
    }

    const result = await sut.execute({ limit: 10, page: 1 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.plantedCrops).toHaveLength(10);
      expect(result.value?.plantedCrops[0].farmId.toString()).toBe(
        farmInMemory.id.toString(),
      );
      expect(result.value?.plantedCrops[0].harvestId.toString()).toBe(
        harvestInMemory.id.toString(),
      );
    }
  });

  it('should be able to paginate planted crops correctly', async () => {
    const farmer = makeFarmer();
    const farmerInMemory = await inMemoryFarmersRepository.create(farmer);

    const farm = makeFarm({ farmerId: farmerInMemory.id });
    const farmInMemory = await inMemoryFarmsRepository.create(farm);

    const harvest = makeHarvest();
    const harvestInMemory = await inMemoryHarvestsRepository.create(harvest);

    for (let i = 0; i < 22; i++) {
      const plantedCrop = makePlantedCrop({
        farmId: farmInMemory.id,
        harvestId: harvestInMemory.id,
      });
      await inMemoryPlantedCropsRepository.create(plantedCrop);
    }

    const result = await sut.execute({ limit: 20, page: 2 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.plantedCrops).toHaveLength(2);
      expect(result.value?.plantedCrops[0].farmId.toString()).toBe(
        farmInMemory.id.toString(),
      );
      expect(result.value?.plantedCrops[0].harvestId.toString()).toBe(
        harvestInMemory.id.toString(),
      );
    }
  });
});
