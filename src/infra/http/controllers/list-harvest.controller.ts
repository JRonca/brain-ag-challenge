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
  ListHarvestRequestDto,
  ListHarvestResponseDto,
} from './dtos/list-harvest.controller.dto';
import { ListHarvestUseCase } from '@domain/use-cases/list-harvest';
import { ErrorResponseDto } from './dtos/error-response.dto';
import { HarvestPresenter } from './presenters/list-harvest.presenter';

const ListHarvestQuerySchema = z.object({
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
type ListHarvestQueryDTO = z.infer<typeof ListHarvestQuerySchema>;

@Controller('harvest')
export class ListHarvestController {
  constructor(private readonly listHarvest: ListHarvestUseCase) {}

  @Get()
  @ApiTags('Harvest')
  @ApiOkResponse({
    type: ListHarvestResponseDto,
  })
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(ListHarvestQuerySchema))
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: ErrorResponseDto,
  })
  @ApiQuery({ type: ListHarvestRequestDto })
  async handle(@Query() query: ListHarvestQueryDTO) {
    const { limit, page } = query;

    const result = await this.listHarvest.execute({
      page,
      limit,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { harvests } = result.value;

    return {
      harvests: harvests.map(HarvestPresenter.toHTTP),
      page: Number(page),
      limit: Number(limit),
    };
  }
}
