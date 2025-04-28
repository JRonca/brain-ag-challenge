import { ApiProperty } from '@nestjs/swagger';

export class ListFarmRequestDto {
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

class FarmDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  farmerId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  state!: string;

  @ApiProperty()
  totalArea!: number;

  @ApiProperty()
  arableArea!: number;

  @ApiProperty()
  vegetationArea!: number;
}

export class ListFarmResponseDto {
  @ApiProperty({ type: [FarmDto] })
  farms!: FarmDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
