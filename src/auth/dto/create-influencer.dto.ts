import { ApiProperty } from '@nestjs/swagger';

export class CreateInfluencerDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  influencerName: string;

  @ApiProperty()
  musicStyle: string;

  @ApiProperty()
  instagram: string;

  @ApiProperty()
  followersNumber: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
