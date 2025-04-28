import { ApiProperty } from '@nestjs/swagger';

export class CreateHarvestRequestDto {
  @ApiProperty()
  description!: string;

  @ApiProperty()
  year!: number;
}

export class CreateHarvestResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  id!: string;
}
