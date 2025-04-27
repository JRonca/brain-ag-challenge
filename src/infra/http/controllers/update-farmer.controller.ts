import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { UpdateFarmerUseCase } from '@domain/use-cases/update-farmer';
import { UpdateFarmerRequestDto } from './dtos/update-farmer.controller.dto';
import { ErrorResponseDto } from './dtos/error-response.dto';
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error';

const updateFarmerBodySchema = z.object({
  name: z.string().min(6).optional(),
  document: z.string().min(11).max(18).optional(),
});

type UpdateFarmerBodySchema = z.infer<typeof updateFarmerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(updateFarmerBodySchema);

@Controller('farmer/:id')
export class UpdateFarmerController {
  constructor(private readonly updateFarmer: UpdateFarmerUseCase) {}

  @Put()
  @HttpCode(204)
  @ApiBody({ type: UpdateFarmerRequestDto })
  @ApiNotFoundResponse({
    description: 'Farmer not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid document.',
    type: ErrorResponseDto,
  })
  async handle(
    @Body(bodyValidationPipe) body: UpdateFarmerBodySchema,
    @Param('id') id: string,
  ) {
    const { name, document } = body;

    const result = await this.updateFarmer.execute({
      id,
      name,
      document,
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
