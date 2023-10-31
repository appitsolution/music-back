import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Influencer {
  @Prop()
  firstName: string;

  @Prop()
  influencerName: string;

  @Prop()
  musicStyle: string;

  @Prop()
  instagram: string;

  @Prop()
  followersNumber: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  price: string;

  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);