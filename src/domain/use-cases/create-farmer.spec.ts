import { CreateFarmerUseCase } from './create-farmer';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { FarmerAlreadyExistsError } from './errors/farmer-already-exists-error';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { makeFarmer } from 'test/factories/make-farmer';

let sut: CreateFarmerUseCase;
let inMemoryFarmersRepository: InMemoryFarmersRepository;

describe('Create Farmer Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();

    sut = new CreateFarmerUseCase(inMemoryFarmersRepository);
  });

  it('should be able to create a farmer successfully', async () => {
    const farmerData = makeFarmer();

    const result = await sut.execute(farmerData);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.farmer.id).toBeInstanceOf(UniqueEntityID);
    }
  });

  it('should not be able to create a farmer with the same document', async () => {
    const farmerData = makeFarmer();

    await sut.execute(farmerData);

    const result = await sut.execute(farmerData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(FarmerAlreadyExistsError);
  });
});
