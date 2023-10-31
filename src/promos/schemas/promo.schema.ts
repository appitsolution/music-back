import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Promos {
  @Prop()
  userId: string;

  @Prop()
  videolink: string;

  @Prop()
  description: string;

  @Prop()
  storyTag: string;

  @Prop()
  swipeLink: string;

  @Prop()
  dateRequest: string;

  @Prop()
  specialWishes: string;
}

export const PromosSchema = SchemaFactory.createForClass(Promos);
