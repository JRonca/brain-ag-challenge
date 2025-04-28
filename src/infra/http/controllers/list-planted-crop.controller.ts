import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { z } from 'zod';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ListPlantedCropRequestDto,
  ListPlantedCropResponseDto,
} from './dtos/list-planted-crop.controller.dto';
import { ListPlantedCropUseCase } from '@domain/use-cases/list-planted-crop';
import { ErrorResponseDto } from './dtos/error-response.dto';
import { PlantedCropPresenter } from './presenters/list-planted-crop.presenter';

const ListPlantedCropQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform(Number)
    .pipe(z.number().min(1)),
});
type ListPlantedCropQueryDTO = z.infer<typeof ListPlantedCropQuerySchema>;

@Controller('planted-crop')
export class ListPlantedCropController {
  constructor(private readonly listPlantedCrop: ListPlantedCropUseCase) {}

  @Get()
  @ApiTags('PlantedCrop')
  @ApiOkResponse({
    type: ListPlantedCropResponseDto,
  })
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(ListPlantedCropQuerySchema))
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: ErrorResponseDto,
  })
  @ApiQuery({ type: ListPlantedCropRequestDto })
  async handle(@Query() query: ListPlantedCropQueryDTO) {
    const { limit, page } = query;

    const result = await this.listPlantedCrop.execute({
      page,
      limit,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { plantedCrops } = result.value;

    return {
      plantedCrops: plantedCrops.map(PlantedCropPresenter.toHTTP),
      page: Number(page),
      limit: Number(limit),
    };
  }
}
