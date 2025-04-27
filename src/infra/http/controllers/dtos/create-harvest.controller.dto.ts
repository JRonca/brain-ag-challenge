import { ApiProperty } from '@nestjs/swagger';

export class CreateHarvestRequestDto {
  @ApiProperty()
  description!: string;

  @ApiProperty()
  year!: number;
}
