import { ListFarmUseCase } from './list-farm';
import { InMemoryFarmsRepository } from 'test/repositories/in-memory-farm-repository';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { makeFarm } from 'test/factories/make-farm';
import { makeFarmer } from 'test/factories/make-farmer';

let sut: ListFarmUseCase;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryFarmersRepository: InMemoryFarmersRepository;

describe('List Farms Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryFarmersRepository = new InMemoryFarmersRepository();

    sut = new ListFarmUseCase(inMemoryFarmsRepository);
  });

  it('should be able to list farms successfully', async () => {
    const farmer = makeFarmer();
    await inMemoryFarmersRepository.create(farmer);

    for (let i = 0; i < 10; i++) {
      const farm = makeFarm({ farmerId: farmer.id });
      await inMemoryFarmsRepository.create(farm);
    }

    const result = await sut.execute({ limit: 10, page: 1 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.farms).toHaveLength(10);
    }
  });

  it('should be able to paginate farms correctly', async () => {
    const farmer = makeFarmer();
    await inMemoryFarmersRepository.create(farmer);

    for (let i = 0; i < 22; i++) {
      const farm = makeFarm({ farmerId: farmer.id });
      await inMemoryFarmsRepository.create(farm);
    }

    const result = await sut.execute({ limit: 20, page: 2 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.farms).toHaveLength(2);
    }
  });
});
