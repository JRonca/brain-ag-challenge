import { BadRequestException, Body, Controller, Post, UsePipes } from '@nestjs/common';
// import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { DocumentValidationPipe } from '../pipes/cpf-cnpj-validation.pipe';
import { CreateFarmerUseCase } from '@domain/use-cases/create-farmer';

const createFarmerBodySchema = z.object({
  name: z.string().min(8),
  document: z.string().min(11).max(18),
  documentType: z.enum(['CPF', 'CNPJ']).default('CPF'),
});

type CreateFarmerBodySchema = z.infer<typeof createFarmerBodySchema>;

@Controller('farmer')
export class CreateFarmerController {
  constructor(private createFarmer: CreateFarmerUseCase) {}

  @Post()
  @UsePipes(new DocumentValidationPipe())
  @UsePipes(new ZodValidationPipe(createFarmerBodySchema))
  async handle(@Body() body: CreateFarmerBodySchema) {
    const { name, document, documentType } = body;

    const result = await this.createFarmer.execute({
      name,
      document,
      documentType,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
