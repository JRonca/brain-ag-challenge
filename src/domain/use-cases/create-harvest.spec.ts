import { CreateHarvestUseCase } from './create-harvest';
import { InMemoryHarvestsRepository } from 'test/repositories/in-memory-harvest-repository';
import { Harvest } from '@domain/entities/harvest';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

let sut: CreateHarvestUseCase;
let inMemoryHarvestsRepository: InMemoryHarvestsRepository;

describe('Create Harvest Use Case', () => {
  beforeEach(async () => {
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();

    sut = new CreateHarvestUseCase(inMemoryHarvestsRepository);
  });

  it('should be able to create a harvest successfully', async () => {
    const result = await sut.execute({
      description: 'Harvest 2023',
      year: 2023,
    });

    if (result.isRight()) {
      expect(result.value.harvest).toBeInstanceOf(Harvest);
      expect(result.value.harvest.id).toBeInstanceOf(UniqueEntityID);
    }
  });
});
