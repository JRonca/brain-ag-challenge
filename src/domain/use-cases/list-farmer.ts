import { Injectable } from '@nestjs/common';
import { Farmer } from '../entities/farmer';
import { FarmersRepository } from '../repositories/farmer-repository';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';
import { Either, right } from '@core/either';

interface ListFarmerUseCaseRequest {
  page?: number;
  limit?: number;
}

type ListFarmerUseCaseResponse = Either<
  ResourceNotFoundError,
  { farmers: Farmer[] }
>;

@Injectable()
export class ListFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    page = 1,
    limit = 10,
  }: ListFarmerUseCaseRequest): Promise<ListFarmerUseCaseResponse> {
    const listFarmer = await this.farmersRepository.list({
      page,
      limit,
    });

    return right({
      farmers: listFarmer,
    });
  }
}
