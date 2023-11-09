import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreatePromosDto {
  @ApiProperty({ required: true })
  userId: string;

  @ApiProperty({
    required: true,
    type: 'object',
    properties: {
      variant: { type: 'number' },
      price: { type: 'number' },
    },
  })
  selectPrice: {
    variant: number;
    price: number;
  };
  @ApiProperty({
    required: true,
    type: 'array',
    items: {
      type: 'number',
    },
  })
  selectInfluencers: number[];

  @ApiProperty({ required: true })
  videoLink: string;

  @ApiProperty({ required: true })
  postDescription: string;

  @ApiProperty({ required: true })
  storyTag: string;

  @ApiProperty({ required: true })
  swipeUpLink: string;

  @ApiProperty({ required: true })
  dateRequest: string;

  @ApiProperty({ required: true })
  specialWishes: string;

  @ApiProperty({ required: true, default: 'payment' })
  paymentType: string;

  @ApiProperty({ required: true, default: 'wait' })
  paymentStatus: string;
}
