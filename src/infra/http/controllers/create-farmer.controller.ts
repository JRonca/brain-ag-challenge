import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { DocumentValidationPipe } from '../pipes/cpf-cnpj-validation.pipe';

const createFarmerBodySchema = z.object({
  name: z.string().min(8),
  document: z.string().min(11).max(18),
  document_type: z.enum(['CPF', 'CNPJ']).default('CPF'),
});

type CreateFarmerBodySchema = z.infer<typeof createFarmerBodySchema>;

@Controller('farmer')
export class CreateFarmerController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new DocumentValidationPipe())
  @UsePipes(new ZodValidationPipe(createFarmerBodySchema))
  async handle(@Body() body: CreateFarmerBodySchema) {
    const { name, document, document_type } = body;

    const existingFarmer = await this.prisma.farmer.findUnique({
      where: {
        document,
      },
    });

    if (existingFarmer) {
      throw new BadRequestException('Farmer already exists');
    }

    await this.prisma.farmer.create({
      data: {
        name,
        document,
        document_type,
      },
    });
  }
}
