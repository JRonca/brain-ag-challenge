import { Injectable } from '@nestjs/common';
import { Farmer } from '../entities/farmer';
import { FarmersRepository } from '../repositories/farmer-repository';
import { FarmerAlreadyExistsError } from './errors/farmer-already-exists-error';
import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';
import { Either, left, right } from '@core/either';

interface CreateFarmerUseCaseRequest {
  name: string;
  document: string;
  documentType: DocumentType;
}

type CreateFarmerUseCaseResponse = Either<FarmerAlreadyExistsError, { farmer: Farmer }>;

@Injectable()
export class CreateFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    name,
    document,
    documentType,
  }: CreateFarmerUseCaseRequest): Promise<CreateFarmerUseCaseResponse> {
    const farmerWithSameDocument =
      await this.farmersRepository.findByDocument(document);

    if (farmerWithSameDocument) {
      return left(new FarmerAlreadyExistsError(document));
    }

    const farmer = Farmer.create({
      name,
      document,
      documentType,
    });

    await this.farmersRepository.create(farmer);

    return right({
      farmer,
    });
  }
}
