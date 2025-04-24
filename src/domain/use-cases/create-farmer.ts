import { Injectable } from '@nestjs/common';
import { Farmer } from '../entities/farmer';
import { FarmerRepository } from '../repositories/farmer-repository';
import { FarmerAlreadyExistsError } from './errors/farmer-already-exists-error';

interface CreateFarmerUseCaseRequest {
  name: string;
  document: string;
  documentType: string;
}

interface CreateFarmerUseCaseResponse {
  farmer: Farmer;
}

@Injectable()
export class CreateFarmerUseCase {
  constructor(private farmerRepository: FarmerRepository) {}

  async execute({
    name,
    document,
    documentType,
  }: CreateFarmerUseCaseRequest): Promise<CreateFarmerUseCaseResponse> {
    const farmerWithSameDocument =
      await this.farmerRepository.findByDocument(document);

    if (farmerWithSameDocument) {
      throw new FarmerAlreadyExistsError(document);
    }

    const farmer = Farmer.create({
      name,
      document,
      documentType,
    });

    await this.farmerRepository.create(farmer);

    return {
      farmer,
    };
  }
}
