import { Injectable } from '@nestjs/common';
import { Farmer } from '../entities/farmer';
import { FarmerRepository } from '../repositories/farmer-repository';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

interface UpdateFarmerUseCaseRequest {
  id: UniqueEntityID;
  name?: string;
  document?: string;
  documentType?: string;
}

interface UpdateFarmerUseCaseResponse {
  farmer: Farmer;
}

@Injectable()
export class UpdateFarmerUseCase {
  constructor(private farmerRepository: FarmerRepository) {}

  async execute({
    id,
    name,
    document,
    documentType,
  }: UpdateFarmerUseCaseRequest): Promise<UpdateFarmerUseCaseResponse> {
    const farmer = await this.farmerRepository.findById(id);

    if (!farmer) {
      throw new ResourceNotFoundError();
    }

    farmer.document = document || farmer.document;
    farmer.documentType = documentType || farmer.documentType;
    farmer.name = name || farmer.name;

    const updatesFarmer = await this.farmerRepository.update(farmer);

    return {
      farmer: updatesFarmer,
    };
  }
}
