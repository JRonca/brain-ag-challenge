import { Injectable } from '@nestjs/common';
import { Farmer } from '../entities/farmer';
import { FarmersRepository } from '../repositories/farmer-repository';
import { FarmerAlreadyExistsError } from './errors/farmer-already-exists-error';
import {
  CreateFarmerUseCaseRequestDTO,
  CreateFarmerUseCaseResponseDTO,
} from './dtos/create-farmer.dto';
import { left, right } from '@core/either';
import { DocumentValidator } from '@core/validators/document.validator';
import { InvalidDocumentError } from './errors/invalid-document-error';

@Injectable()
export class CreateFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    name,
    document,
  }: CreateFarmerUseCaseRequestDTO): Promise<CreateFarmerUseCaseResponseDTO> {
    const documentValidator = new DocumentValidator();
    const documentType = documentValidator.getValidDocumentType(document);

    if (!documentType) {
      return left(new InvalidDocumentError());
    }

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
