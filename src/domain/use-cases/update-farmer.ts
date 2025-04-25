import { Injectable } from '@nestjs/common';
import { Farmer } from '../entities/farmer';
import { FarmersRepository } from '../repositories/farmer-repository';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';
import { Either, left, right } from '@core/either';

interface UpdateFarmerUseCaseRequest {
  id: UniqueEntityID;
  name?: string;
  document?: string;
  documentType?: DocumentType;
}

type UpdateFarmerUseCaseResponse = Either<ResourceNotFoundError, { farmer: Farmer }>;

@Injectable()
export class UpdateFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    id,
    name,
    document,
    documentType,
  }: UpdateFarmerUseCaseRequest): Promise<UpdateFarmerUseCaseResponse> {
    const farmer = await this.farmersRepository.findById(id);

    if (!farmer) {
      return left(new ResourceNotFoundError('Farmer', id.toString()));
    }

    farmer.document = document || farmer.document;
    farmer.documentType = documentType || farmer.documentType;
    farmer.name = name || farmer.name;

    const updatesFarmer = await this.farmersRepository.update(farmer);

    return right({
      farmer: updatesFarmer,
    });
  }
}
