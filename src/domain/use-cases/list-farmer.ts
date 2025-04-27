import { Injectable } from '@nestjs/common';
import { FarmersRepository } from '../repositories/farmer-repository';
import { right } from '@core/either';
import {
  ListFarmerUseCaseRequestDTO,
  ListFarmerUseCaseResponseDTO,
} from './dtos/list-farmer.dto';

@Injectable()
export class ListFarmerUseCase {
  constructor(private farmersRepository: FarmersRepository) {}

  async execute({
    page = 1,
    limit = 10,
  }: ListFarmerUseCaseRequestDTO): Promise<ListFarmerUseCaseResponseDTO> {
    const listFarmer = await this.farmersRepository.list({
      page,
      limit,
    });

    return right({
      farmers: listFarmer,
    });
  }
}
