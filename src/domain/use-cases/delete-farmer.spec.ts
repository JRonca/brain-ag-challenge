import { DeleteFarmerUseCase } from './delete-farmer';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { makeFarmer } from 'test/factories/make-farmer';

let sut: DeleteFarmerUseCase;
let inMemoryFarmersRepository: InMemoryFarmersRepository;

describe('Delete Farmer Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();

    sut = new DeleteFarmerUseCase(inMemoryFarmersRepository);
  });

  it('should be able to delete a farmer successfully', async () => {
    const farmer = makeFarmer();

    const farmerToDelete = await inMemoryFarmersRepository.create(farmer);

    const response = await sut.execute({
      id: farmerToDelete.id,
    });

    if (response.isRight()) {
      expect(response.value.deleted).toBeTruthy();
      expect(response.value.deleted).toBe(true);
    }
  });

  it('should not be able to delete a farmer not created', async () => {
    const farmerData = {
      id: new UniqueEntityID('non-existing-id'),
    };

    const result = await sut.execute(farmerData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      new ResourceNotFoundError('Farmer', farmerData.id.toString()),
    );
  });
});
