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
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CreatePlantedCropUseCase } from '@domain/use-cases/create-planted-crop';
import { CreatePlantedCropRequestDto } from './dtos/create-planted-crop.controller.dto';
import { ErrorResponseDto } from './dtos/error-response.dto';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';

const createPlantedCropBodySchema = z.object({
  farmId: z.string().uuid(),
  harvestId: z.string().uuid(),
  name: z.string().min(3),
});

type CreatePlantedCropBodySchema = z.infer<typeof createPlantedCropBodySchema>;

@Controller('planted-crop')
export class CreatePlantedCropController {
  constructor(private readonly createPlantedCrop: CreatePlantedCropUseCase) {}

  @Post()
  @ApiTags('PlantedCrop')
  @UsePipes(new ZodValidationPipe(createPlantedCropBodySchema))
  @ApiBody({ type: CreatePlantedCropRequestDto })
  @ApiNotFoundResponse({
    description: 'Farm or Harvest not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: ErrorResponseDto,
  })
  async handle(@Body() body: CreatePlantedCropBodySchema) {
    const { name, farmId, harvestId } = body;

    const result = await this.createPlantedCrop.execute({
      name,
      farmId,
      harvestId,
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
  }
}
