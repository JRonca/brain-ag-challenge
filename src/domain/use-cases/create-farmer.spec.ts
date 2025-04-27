import { CreateFarmerUseCase } from './create-farmer';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { FarmerAlreadyExistsError } from './errors/farmer-already-exists-error';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { makeFarmer } from 'test/factories/make-farmer';
import { InvalidDocumentError } from './errors/invalid-document-error';

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

  it('should not be able to create a farmer with an invalid document', async () => {
    const farmerData = makeFarmer({
      document: '1234567',
    });

    const result = await sut.execute(farmerData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDocumentError);
  });
});
