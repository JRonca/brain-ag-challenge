import { Injectable } from '@nestjs/common';
import { FarmersRepository } from '../repositories/farmer-repository';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { left, right } from '@core/either';
import {
  UpdateFarmerUseCaseRequestDTO,
  UpdateFarmerUseCaseResponseDTO,
} from './dtos/update-farmer.dto';
import { DocumentValidator } from '@core/validators/document.validator';
import { InvalidDocumentError } from './errors/invalid-document-error';
import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';

@Injectable()
export class UpdateFarmerUseCase {
  constructor(private readonly farmersRepository: FarmersRepository) {}

  async execute({
    id,
    name,
    document,
  }: UpdateFarmerUseCaseRequestDTO): Promise<UpdateFarmerUseCaseResponseDTO> {
    const farmer = await this.farmersRepository.findById(id);

    if (!farmer) {
      return left(new ResourceNotFoundError('Farmer', id.toString()));
    }
    let documentType: DocumentType | null = null;

    if (document && document !== farmer.document) {
      const documentValidator = new DocumentValidator();
      documentType = documentValidator.getValidDocumentType(document);

      if (!documentType) {
        return left(new InvalidDocumentError());
      }
      farmer.document = document;
      farmer.documentType = documentType;
    }

    farmer.name = name ?? farmer.name;

    const updatesFarmer = await this.farmersRepository.update(farmer);

    return right({
      farmer: updatesFarmer,
    });
  }
}
