import { ListHarvestUseCase } from './list-harvest';
import { InMemoryHarvestsRepository } from 'test/repositories/in-memory-harvest-repository';
import { makeHarvest } from 'test/factories/make-harvest';

let sut: ListHarvestUseCase;
let inMemoryHarvestsRepository: InMemoryHarvestsRepository;

describe('List Harvests Use Case', () => {
  beforeEach(async () => {
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    sut = new ListHarvestUseCase(inMemoryHarvestsRepository);
  });

  it('should be able to list harvests successfully', async () => {
    for (let i = 0; i < 10; i++) {
      const harvest = makeHarvest();
      await inMemoryHarvestsRepository.create(harvest);
    }

    const result = await sut.execute({ limit: 10, page: 1 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.harvests).toHaveLength(10);
    }
  });

  it('should be able to paginate harvests correctly', async () => {
    for (let i = 0; i < 22; i++) {
      const harvest = makeHarvest();
      await inMemoryHarvestsRepository.create(harvest);
    }

    const result = await sut.execute({ limit: 20, page: 2 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.harvests).toHaveLength(2);
    }
  });
});
