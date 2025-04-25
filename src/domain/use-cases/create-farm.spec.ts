import { CreateFarmUseCase } from './create-farm';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { InMemoryFarmsRepository } from 'test/repositories/in-memory-farm-repository';
import { Farmer } from '@domain/entities/farmer';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';
import { Farm } from '@domain/entities/farm';
import { InvalidTotalAreaError } from './errors/invalid-total-area-error';

let sut: CreateFarmUseCase;
let inMemoryFarmersRepository: InMemoryFarmersRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;

describe('Create Farm Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();

    sut = new CreateFarmUseCase(
      inMemoryFarmsRepository,
      inMemoryFarmersRepository,
    );
  });

  it('should be able to create a farm successfully', async () => {
    const farmer = Farmer.create({
      name: 'John Doe',
      document: '56860070986',
      documentType: DocumentType.CPF,
    });
    const farmerToUpdate = await inMemoryFarmersRepository.create(farmer);

    const result = await sut.execute({
      farmerId: farmerToUpdate.id,
      name: 'Yellowstone Farm',
      city: 'São Paulo',
      state: 'SP',
      arableArea: 150,
      vegetationArea: 50,
      totalArea: 200,
    });

    if (result.isRight()) {
      expect(result.value.farm).toBeInstanceOf(Farm);
      expect(result.value.farm.id).toBeInstanceOf(UniqueEntityID);
      expect(result.value.farm.farmerId).toEqual(farmerToUpdate.id);
    }
  });

  it('should not be able to create a farm with invalid total area', async () => {
    const farmer = Farmer.create({
      name: 'John Doe',
      document: '56860070986',
      documentType: DocumentType.CPF,
    });
    const farmerToUpdate = await inMemoryFarmersRepository.create(farmer);

    const result = await sut.execute({
      farmerId: farmerToUpdate.id,
      name: 'Yellowstone Farm',
      city: 'São Paulo',
      state: 'SP',
      arableArea: 150,
      vegetationArea: 60,
      totalArea: 200,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new InvalidTotalAreaError());
  });

  it('should not be able to create a farm with a farmer not created', async () => {
    const farmerId = new UniqueEntityID('non-existing-id');
    const result = await sut.execute({
      farmerId,
      name: 'Yellowstone Farm',
      city: 'São Paulo',
      state: 'SP',
      arableArea: 150,
      vegetationArea: 50,
      totalArea: 200,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      new ResourceNotFoundError('Farmer', farmerId.toString()),
    );
  });
});
