import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Influencer {
  @Prop({ default: 'influencer' })
  role: string;

  @Prop({ default: 0 })
  balance: string;

  @Prop()
  firstName: string;

  @Prop()
  influencerName: string;

  @Prop()
  musicStyle: string;

  @Prop()
  instagramUsername: string;

  @Prop()
  followersNumber: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  price: string;

  @Prop()
  password: string;

  @Prop({ default: 'wait' })
  statusVerify: string;
}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);
