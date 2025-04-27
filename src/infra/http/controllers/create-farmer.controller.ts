import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CreateFarmerUseCase } from '@domain/use-cases/create-farmer';
import { CreateFarmerRequestDto } from './dtos/create-farmer.controller.dto';
import { ErrorResponseDto } from './dtos/error-response.dto';
import { FarmerAlreadyExistsError } from '@domain/use-cases/errors/farmer-already-exists-error';

const createFarmerBodySchema = z.object({
  name: z.string().min(6),
  document: z.string().min(11).max(18),
});

type CreateFarmerBodySchema = z.infer<typeof createFarmerBodySchema>;

@Controller('farmer')
export class CreateFarmerController {
  constructor(private readonly createFarmer: CreateFarmerUseCase) {}

  @Post()
  @ApiTags('Farmer')
  @UsePipes(new ZodValidationPipe(createFarmerBodySchema))
  @ApiBody({ type: CreateFarmerRequestDto })
  @ApiConflictResponse({
    description: 'Farmer already exists',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid document.',
    type: ErrorResponseDto,
  })
  async handle(@Body() body: CreateFarmerBodySchema) {
    const { name, document } = body;

    const result = await this.createFarmer.execute({
      name,
      document,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof FarmerAlreadyExistsError) {
        throw new ConflictException({
          statusCode: 409,
          message: error.message,
        });
      }

      throw new BadRequestException(result.value.message);
    }
  }
}
