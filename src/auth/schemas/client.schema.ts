import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Client {
  @Prop({ default: 'client' })
  role: string;
  @Prop()
  firstName: string;

  @Prop()
  company: string;

  @Prop()
  companyType: string;

  @Prop()
  instagram: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  referalCode: string;

  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
