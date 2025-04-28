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

export class CreateFarmResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  id!: string;
}
