import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmerRequestDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  document!: string;
}
