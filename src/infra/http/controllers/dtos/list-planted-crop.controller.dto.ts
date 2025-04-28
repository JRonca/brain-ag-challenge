import { ApiProperty } from '@nestjs/swagger';

export class ListPlantedCropRequestDto {
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

class PlantedCropDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  farmId!: string;

  @ApiProperty()
  harvestId!: string;

  @ApiProperty()
  name!: string;
}

export class ListPlantedCropResponseDto {
  @ApiProperty({ type: [PlantedCropDto] })
  plantedCrops!: PlantedCropDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
