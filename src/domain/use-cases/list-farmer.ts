import { Injectable } from '@nestjs/common';
import { FarmersRepository } from '../repositories/farmer-repository';
import { right } from '@core/either';
import {
  ListFarmerUseCaseRequestDTO,
  ListFarmerUseCaseResponseDTO,
} from './dtos/list-farmer.dto';

@Injectable()
export class ListFarmerUseCase {
  constructor(private readonly farmersRepository: FarmersRepository) {}

  async execute({
    page,
    limit,
  }: ListFarmerUseCaseRequestDTO): Promise<ListFarmerUseCaseResponseDTO> {
    const farmers = await this.farmersRepository.list({
      page,
      limit,
    });

    return right({
      farmers,
    });
  }
}
