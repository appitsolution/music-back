import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SelectPrice {
  @Prop()
  variant: number;

  @Prop()
  price: number;
}

const SelectPriceSchema = SchemaFactory.createForClass(SelectPrice);

@Schema({
  timestamps: true,
})
export class Promos {
  @Prop()
  userId: string;

  @Prop({
    required: true,
    type: SelectPriceSchema,
  })
  selectPrice: SelectPrice;
  @Prop({
    required: true,
  })
  selectInfluencers: number[];

  @Prop()
  videoLink: string;

  @Prop()
  postDescription: string;

  @Prop()
  storyTag: string;

  @Prop()
  swipeUpLink: string;

  @Prop()
  dateRequest: string;

  @Prop()
  specialWishes: string;

  @Prop({ required: true, default: 'payment' })
  paymentType: string;

  @Prop({ required: true, default: 'wait' })
  paymentStatus: string;
}

export const PromosSchema = SchemaFactory.createForClass(Promos);
