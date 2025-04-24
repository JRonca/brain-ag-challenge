import { CreateFarmerUseCase } from './create-farmer';
import { InMemoryFarmerRepository } from 'test/repositories/in-memory-farmer-repository';
import { FarmerAlreadyExistsError } from './errors/farmer-already-exists-error';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

let sut: CreateFarmerUseCase;
let inMemoryFarmerRepository: InMemoryFarmerRepository;

describe('Create Farmer Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmerRepository = new InMemoryFarmerRepository();

    sut = new CreateFarmerUseCase(inMemoryFarmerRepository);
  });

  it('should create a farmer successfully', async () => {
    const farmerData = {
      name: 'John Doe',
      document: '56860070986',
      documentType: 'CPF',
    };

    const response = await sut.execute(farmerData);

    expect(response.farmer.id).toBeTruthy();
    expect(response.farmer.id).toBeInstanceOf(UniqueEntityID);
  });

  it('should not create a farmer with the same document', async () => {
    const farmerData = {
      name: 'John Doe',
      document: '56860070986',
      documentType: 'CPF',
    };

    await sut.execute(farmerData);

    await expect(() => sut.execute(farmerData)).rejects.toBeInstanceOf(
      FarmerAlreadyExistsError,
    );
  });
});
