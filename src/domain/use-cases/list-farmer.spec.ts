import { ListFarmerUseCase } from './list-farmer';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { makeFarmer } from 'test/factories/make-farmer';

let sut: ListFarmerUseCase;
let inMemoryFarmersRepository: InMemoryFarmersRepository;

describe('List Farmers Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();

    sut = new ListFarmerUseCase(inMemoryFarmersRepository);
  });

  it('should be able to list farmers successfully', async () => {
    for (let i = 0; i < 10; i++) {
      const farmer = makeFarmer();
      await inMemoryFarmersRepository.create(farmer);
    }

    const result = await sut.execute({ limit: 10, page: 1 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.farmers).toHaveLength(10);
    }
  });

  it('should be able to paginate farmers correctly', async () => {
    for (let i = 0; i < 22; i++) {
      const farmer = makeFarmer();
      await inMemoryFarmersRepository.create(farmer);
    }

    const result = await sut.execute({ limit: 20, page: 2 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.farmers).toHaveLength(2);
    }
  });
});
