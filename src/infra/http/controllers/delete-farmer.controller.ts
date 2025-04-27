import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteFarmerUseCase } from '@domain/use-cases/delete-farmer';
import { ErrorResponseDto } from './dtos/error-response.dto';

@Controller('farmer/:id')
export class DeleteFarmerController {
  constructor(private readonly deleteFarmer: DeleteFarmerUseCase) {}

  @Delete()
  @ApiTags('Farmer')
  @HttpCode(204)
  @ApiNotFoundResponse({
    description: 'Farmer not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid document.',
    type: ErrorResponseDto,
  })
  async handle(@Param('id') id: string) {
    const result = await this.deleteFarmer.execute({
      id,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new NotFoundException({
        statusCode: 404,
        message: error.message,
      });
    }
  }
}
