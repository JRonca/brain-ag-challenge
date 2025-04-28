import { ApiProperty } from '@nestjs/swagger';

export class ListHarvestRequestDto {
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

class HarvestDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  year!: number;
}

export class ListHarvestResponseDto {
  @ApiProperty({ type: [HarvestDto] })
  harvests!: HarvestDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
