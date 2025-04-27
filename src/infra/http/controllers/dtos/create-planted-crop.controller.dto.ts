import { ApiProperty } from '@nestjs/swagger';

export class CreatePlantedCropRequestDto {
  @ApiProperty()
  farmId!: string;

  @ApiProperty()
  harvestId!: string;

  @ApiProperty()
  name!: string;
}
