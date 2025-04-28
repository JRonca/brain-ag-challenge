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
  ListFarmRequestDto,
  ListFarmResponseDto,
} from './dtos/list-farm.controller.dto';
import { ListFarmUseCase } from '@domain/use-cases/list-farm';
import { ErrorResponseDto } from './dtos/error-response.dto';
import { FarmPresenter } from './presenters/list-farm.presenter';

const ListFarmQuerySchema = z.object({
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
type ListFarmQueryDTO = z.infer<typeof ListFarmQuerySchema>;

@Controller('farm')
export class ListFarmController {
  constructor(private readonly listFarm: ListFarmUseCase) {}

  @Get()
  @ApiTags('Farm')
  @ApiOkResponse({
    type: ListFarmResponseDto,
  })
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(ListFarmQuerySchema))
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: ErrorResponseDto,
  })
  @ApiQuery({ type: ListFarmRequestDto })
  async handle(@Query() query: ListFarmQueryDTO) {
    const { limit, page } = query;

    const result = await this.listFarm.execute({
      page,
      limit,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { farms } = result.value;

    return {
      farms: farms.map(FarmPresenter.toHTTP),
      page: Number(page),
      limit: Number(limit),
    };
  }
}
