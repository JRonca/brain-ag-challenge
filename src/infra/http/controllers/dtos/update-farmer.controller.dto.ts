import { ApiProperty } from '@nestjs/swagger';

export class UpdateFarmerRequestDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  document!: string;
}
