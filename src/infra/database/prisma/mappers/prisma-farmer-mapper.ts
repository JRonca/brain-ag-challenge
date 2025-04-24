import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { Farmer } from '@domain/entities/farmer';
import { Prisma, Farmer as PrismaFarmer } from '@prisma/client';

export class PrismaFarmerMapper {
  static toDomain(raw: PrismaFarmer): any {
    return Farmer.create(
      {
        name: raw.name,
        document: raw.document,
        documentType: raw.document_type,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(farmer: Farmer): Prisma.FarmerUncheckedCreateInput {
    return {
      id: farmer.id.toString(),
      name: farmer.name,
      document: farmer.document,
      document_type: farmer.documentType,
    };
  }
}
