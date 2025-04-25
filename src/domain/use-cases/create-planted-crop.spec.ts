import { CreatePlantedCropUseCase } from './create-planted-crop';
import { InMemoryPlantedCropsRepository } from 'test/repositories/in-memory-planted-crop-repository';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { InMemoryFarmsRepository } from 'test/repositories/in-memory-farm-repository';
import { InMemoryHarvestsRepository } from 'test/repositories/in-memory-harvest-repository';

import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { PlantedCrop } from '@domain/entities/planted-crop';

import { makePlantedCrop } from 'test/factories/make-planted-crop';
import { makeFarmer } from 'test/factories/make-farmer';
import { makeFarm } from 'test/factories/make-farm';
import { makeHarvest } from 'test/factories/make-harvest';

let sut: CreatePlantedCropUseCase;
let inMemoryPlantedCropsRepository: InMemoryPlantedCropsRepository;
let inMemoryFarmersRepository: InMemoryFarmersRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryHarvestsRepository: InMemoryHarvestsRepository;

describe('Create Farm Use Case', () => {
  beforeEach(async () => {
    inMemoryPlantedCropsRepository = new InMemoryPlantedCropsRepository();
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();

    sut = new CreatePlantedCropUseCase(
      inMemoryPlantedCropsRepository,
      inMemoryFarmsRepository,
      inMemoryHarvestsRepository,
    );
  });

  it('should be able to create a planted crop successfully', async () => {
    const farmer = makeFarmer();
    const farmerInMemory = await inMemoryFarmersRepository.create(farmer);

    const farm = makeFarm({ farmerId: farmerInMemory.id });
    const farmInMemory = await inMemoryFarmsRepository.create(farm);

    const harvest = makeHarvest();
    const harvestInMemory = await inMemoryHarvestsRepository.create(harvest);

    const plantedCrop = makePlantedCrop({
      farmId: farmInMemory.id,
      harvestId: harvestInMemory.id,
    });

    const result = await sut.execute(plantedCrop);

    if (result.isRight()) {
      expect(result.value.plantedCrop).toBeInstanceOf(PlantedCrop);
      expect(result.value.plantedCrop.id).toBeInstanceOf(UniqueEntityID);
      expect(result.value.plantedCrop.farmId).toEqual(farmInMemory.id);
      expect(result.value.plantedCrop.harvestId).toEqual(harvestInMemory.id);
    }
  });

  it('should not be able to create a planted crop with a farm not created', async () => {
    const farmId = new UniqueEntityID('non-existing-id');

    const harvest = makeHarvest();
    const harvestInMemory = await inMemoryHarvestsRepository.create(harvest);

    const plantedCrop = makePlantedCrop({
      farmId,
      harvestId: harvestInMemory.id,
    });

    const result = await sut.execute(plantedCrop);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      new ResourceNotFoundError('Farm', farmId.toString()),
    );
  });

  it('should not be able to create a planted crop with a farm not created', async () => {
    const harvestId = new UniqueEntityID('non-existing-id');

    const farmer = makeFarmer();
    const farmerInMemory = await inMemoryFarmersRepository.create(farmer);

    const farm = makeFarm({ farmerId: farmerInMemory.id });
    const farmInMemory = await inMemoryFarmsRepository.create(farm);

    const plantedCrop = makePlantedCrop({
      farmId: farmInMemory.id,
      harvestId,
    });

    const result = await sut.execute(plantedCrop);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      new ResourceNotFoundError('Harvest', harvestId.toString()),
    );
  });
});
