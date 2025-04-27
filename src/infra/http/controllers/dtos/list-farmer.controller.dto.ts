import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@infra/database/prisma/enums/document-type.enum';

export class ListFarmerRequestDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  page?: string;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  limit?: string;
}

class FarmerDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  document!: string;

  @ApiProperty({ enumName: 'DocumentType', enum: DocumentType })
  documentType!: DocumentType;
}

export class ListFarmerResponseDto {
  @ApiProperty({ type: [FarmerDto] })
  farmers!: FarmerDto[];
  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
