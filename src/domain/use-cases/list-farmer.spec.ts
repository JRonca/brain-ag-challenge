import { ListFarmerUseCase } from './list-farmer';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';
import { generateValidCPF } from 'test/utils';
import { Farmer } from '@domain/entities/farmer';

let sut: ListFarmerUseCase;
let inMemoryFarmersRepository: InMemoryFarmersRepository;

describe('List Farmers Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();

    sut = new ListFarmerUseCase(inMemoryFarmersRepository);
  });

  it('should be able to list farmers successfully', async () => {
    for (let i = 0; i < 10; i++) {
      const farmer = Farmer.create({
        name: 'John Doe',
        document: generateValidCPF(),
        documentType: DocumentType.CPF,
      });
      await inMemoryFarmersRepository.create(farmer);
    }

    const result = await sut.execute({ limit: 10, page: 1 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.farmers).toHaveLength(10);
    }
  });

  it('should be able to  not create a farmer with the same document', async () => {
    for (let i = 0; i < 22; i++) {
      const farmer = Farmer.create({
        name: 'John Doe',
        document: generateValidCPF(),
        documentType: DocumentType.CPF,
      });
      await inMemoryFarmersRepository.create(farmer);
    }

    const result = await sut.execute({ limit: 20, page: 2 });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.farmers).toHaveLength(2);
    }
  });
});
