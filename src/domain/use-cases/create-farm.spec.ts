import { CreateFarmUseCase } from './create-farm';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { InMemoryFarmsRepository } from 'test/repositories/in-memory-farm-repository';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { Farm } from '@domain/entities/farm';
import { InvalidTotalAreaError } from './errors/invalid-total-area-error';
import { makeFarmer } from 'test/factories/make-farmer';
import { makeFarm } from 'test/factories/make-farm';

let sut: CreateFarmUseCase;
let inMemoryFarmersRepository: InMemoryFarmersRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;

describe('Create Farm Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();

    sut = new CreateFarmUseCase(
      inMemoryFarmsRepository,
      inMemoryFarmersRepository,
    );
  });

  it('should be able to create a farm successfully', async () => {
    const farmer = makeFarmer();
    const farmerToUpdate = await inMemoryFarmersRepository.create(farmer);

    const farm = makeFarm({ farmerId: farmerToUpdate.id });

    const result = await sut.execute({
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      arableArea: farm.arableArea,
      vegetationArea: farm.vegetationArea,
      farmerId: farm.farmerId.toString(),
    });

    if (result.isRight()) {
      expect(result.value.farm).toBeInstanceOf(Farm);
      expect(result.value.farm.id).toBeInstanceOf(UniqueEntityID);
      expect(result.value.farm.farmerId).toEqual(farmerToUpdate.id);
    }
  });

  it('should not be able to create a farm with invalid total area', async () => {
    const farmer = makeFarmer();
    const farmerToUpdate = await inMemoryFarmersRepository.create(farmer);

    const farm = makeFarm({
      farmerId: farmerToUpdate.id,
      totalArea: 80,
      arableArea: 50,
      vegetationArea: 50,
    });

    const result = await sut.execute({
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      arableArea: farm.arableArea,
      vegetationArea: farm.vegetationArea,
      farmerId: farm.farmerId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new InvalidTotalAreaError());
  });

  it('should not be able to create a farm with a farmer not created', async () => {
    const farmerId = new UniqueEntityID('non-existing-id');

    const farm = makeFarm({ farmerId });

    const result = await sut.execute({
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: farm.totalArea,
      arableArea: farm.arableArea,
      vegetationArea: farm.vegetationArea,
      farmerId: farm.farmerId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      new ResourceNotFoundError('Farmer', farmerId.toString()),
    );
  });
});
