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
  ListFarmerRequestDto,
  ListFarmerResponseDto,
} from './dtos/list-farmer.controller.dto';
import { ListFarmerUseCase } from '@domain/use-cases/list-farmer';
import { ErrorResponseDto } from './dtos/error-response.dto';
import { FarmerPresenter } from './presenters/list-farmer.presenter';

const ListFarmerQuerySchema = z.object({
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
type ListFarmerQueryDTO = z.infer<typeof ListFarmerQuerySchema>;

@Controller('farmer')
export class ListFarmerController {
  constructor(private readonly listFarmer: ListFarmerUseCase) {}

  @Get()
  @ApiTags('Farmer')
  @ApiOkResponse({
    type: ListFarmerResponseDto,
  })
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(ListFarmerQuerySchema))
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: ErrorResponseDto,
  })
  @ApiQuery({ type: ListFarmerRequestDto })
  async handle(@Query() query: ListFarmerQueryDTO) {
    const { limit, page } = query;

    const result = await this.listFarmer.execute({
      page,
      limit,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { farmers } = result.value;

    return {
      farmers: farmers.map(FarmerPresenter.toHTTP),
      page: Number(page),
      limit: Number(limit),
    };
  }
}
