import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmRequestDto {
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
