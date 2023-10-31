import { ApiProperty } from '@nestjs/swagger';

export class UpdatePersonalClientDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  firstName: string;

  @ApiProperty({ required: true })
  username: string;

  @ApiProperty({ required: true })
  instagram: string;

  @ApiProperty({ required: true })
  referalCode: string;
}
