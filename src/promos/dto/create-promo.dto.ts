import { ApiProperty } from '@nestjs/swagger';

export class CreatePromosDto {
  @ApiProperty({ required: true })
  userId: string;

  @ApiProperty({ required: true })
  videolink: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true })
  storyTag: string;

  @ApiProperty({ required: true })
  swipeLink: string;

  @ApiProperty({ required: true })
  dateRequest: string;

  @ApiProperty({ required: true })
  specialWishes: string;
}
