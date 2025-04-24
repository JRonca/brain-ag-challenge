import { UpdateFarmerUseCase } from './update-farmer';
import { InMemoryFarmerRepository } from 'test/repositories/in-memory-farmer-repository';
import { Farmer } from '@domain/entities/farmer';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';

let sut: UpdateFarmerUseCase;
let inMemoryFarmerRepository: InMemoryFarmerRepository;

describe('Update Farmer Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmerRepository = new InMemoryFarmerRepository();

    sut = new UpdateFarmerUseCase(inMemoryFarmerRepository);
  });

  it('should update a farmer successfully', async () => {
    const farmer = Farmer.create({
      name: 'John Doe',
      document: '56860070986',
      documentType: 'CPF',
    });
    const farmerToUpdate = await inMemoryFarmerRepository.create(farmer);

    const response = await sut.execute({
      id: farmerToUpdate.id,
      name: 'John Doe Updated',
      document: '68097878000120',
      documentType: 'CNPJ',
    });

    expect(response.farmer.id).toBeTruthy();
    expect(response.farmer.id).toBeInstanceOf(UniqueEntityID);
    expect(response.farmer.document).toBe('68097878000120');
  });

  it('should not update a farmer not created', async () => {
    const farmerData = {
      id: new UniqueEntityID('non-existing-id'),
      name: 'John Doe Updated',
      document: '68097878000120',
      documentType: 'CNPJ',
    };
    await expect(() => sut.execute(farmerData)).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
