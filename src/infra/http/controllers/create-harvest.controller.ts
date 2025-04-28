import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CreateHarvestUseCase } from '@domain/use-cases/create-harvest';
import {
  CreateHarvestRequestDto,
  CreateHarvestResponseDto,
} from './dtos/create-harvest.controller.dto';
import { ErrorResponseDto } from './dtos/error-response.dto';

const createHarvestBodySchema = z.object({
  description: z.string().min(6),
  year: z.number().positive(),
});

type CreateHarvestBodySchema = z.infer<typeof createHarvestBodySchema>;

@Controller('harvest')
export class CreateHarvestController {
  constructor(private readonly createHarvest: CreateHarvestUseCase) {}

  @Post()
  @ApiTags('Harvest')
  @UsePipes(new ZodValidationPipe(createHarvestBodySchema))
  @ApiBody({ type: CreateHarvestRequestDto })
  @ApiOkResponse({
    type: CreateHarvestResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
    type: ErrorResponseDto,
  })
  async handle(@Body() body: CreateHarvestBodySchema) {
    const { description, year } = body;

    const result = await this.createHarvest.execute({
      description,
      year,
    });

    return {
      statusCode: 201,
      message: 'Harvest created successfully',
      id: result.value?.harvest.id.toString(),
    };
  }
}
