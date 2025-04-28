import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CreateFarmUseCase } from '@domain/use-cases/create-farm';
import {
  CreateFarmRequestDto,
  CreateFarmResponseDto,
} from './dtos/create-farm.controller.dto';
import { ErrorResponseDto } from './dtos/error-response.dto';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';

const createFarmBodySchema = z.object({
  farmerId: z.string().uuid(),
  name: z.string().min(6),
  city: z.string().min(3),
  state: z.string().min(2).max(2),
  totalArea: z.number().positive(),
  arableArea: z.number().positive(),
  vegetationArea: z.number().positive(),
});

type CreateFarmBodySchema = z.infer<typeof createFarmBodySchema>;

@Controller('farm')
export class CreateFarmController {
  constructor(private readonly createFarm: CreateFarmUseCase) {}

  @Post()
  @ApiTags('Farm')
  @UsePipes(new ZodValidationPipe(createFarmBodySchema))
  @ApiBody({ type: CreateFarmRequestDto })
  @ApiNotFoundResponse({
    description: 'Farmer not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid total area.',
    type: ErrorResponseDto,
  })
  @ApiOkResponse({
    type: CreateFarmResponseDto,
  })
  async handle(@Body() body: CreateFarmBodySchema) {
    const {
      name,
      farmerId,
      city,
      state,
      arableArea,
      vegetationArea,
      totalArea,
    } = body;

    const result = await this.createFarm.execute({
      name,
      farmerId,
      city,
      state,
      arableArea,
      vegetationArea,
      totalArea,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException({
          statusCode: 404,
          message: error.message,
        });
      }

      throw new BadRequestException(result.value.message);
    }

    return {
      statusCode: 201,
      message: 'Farm created successfully',
      id: result.value.farm.id.toString(),
    };
  }
}
