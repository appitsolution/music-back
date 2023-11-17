import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Offers {
  @Prop()
  id: number;

  @Prop()
  price: number;

  @Prop()
  maxInfluencer: number;

}

export const OffersSchema = SchemaFactory.createForClass(Offers);
