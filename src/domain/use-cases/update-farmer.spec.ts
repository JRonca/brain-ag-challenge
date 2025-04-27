import { UpdateFarmerUseCase } from './update-farmer';
import { InMemoryFarmersRepository } from 'test/repositories/in-memory-farmer-repository';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';
import { makeFarmer } from 'test/factories/make-farmer';
import { generateValidCNPJ } from 'test/utils';
import { InvalidDocumentError } from './errors/invalid-document-error';

let sut: UpdateFarmerUseCase;
let inMemoryFarmersRepository: InMemoryFarmersRepository;

describe('Update Farmer Use Case', () => {
  beforeEach(async () => {
    inMemoryFarmersRepository = new InMemoryFarmersRepository();

    sut = new UpdateFarmerUseCase(inMemoryFarmersRepository);
  });

  it('should be able to update a farmer successfully', async () => {
    const farmer = makeFarmer();
    const farmerToUpdate = await inMemoryFarmersRepository.create(farmer);

    const document = generateValidCNPJ();

    const response = await sut.execute({
      id: farmerToUpdate.id,
      name: 'John Doe Updated',
      document,
    });

    if (response.isRight()) {
      expect(response.value.farmer.id).toBeTruthy();
      expect(response.value.farmer.id).toBeInstanceOf(UniqueEntityID);
      expect(response.value.farmer.document).toBe(document);
    }
  });

  it('should not be able to update a farmer not created', async () => {
    const farmerData = {
      id: new UniqueEntityID('non-existing-id'),
      name: 'John Doe Updated',
      document: '68097878000120',
      documentType: DocumentType.CNPJ,
    };

    const result = await sut.execute(farmerData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(
      new ResourceNotFoundError('Farmer', farmerData.id.toString()),
    );
  });

  it('should not be able to update a farmer with an invalid document', async () => {
    const farmer = makeFarmer();
    const farmerToUpdate = await inMemoryFarmersRepository.create(farmer);

    const result = await sut.execute({
      id: farmerToUpdate.id,
      name: 'John Doe Updated',
      document: '1234567',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new InvalidDocumentError());
  });
});
