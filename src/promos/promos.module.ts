import { Module } from '@nestjs/common';
import { PromosService } from './promos.service';
import { PromosController } from './promos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Promos, PromosSchema } from './schemas/promo.schema';
import { Client, ClientSchema } from 'src/auth/schemas/client.schema';
import {
  Influencer,
  InfluencerSchema,
} from 'src/auth/schemas/influencer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promos.name, schema: PromosSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Influencer.name, schema: InfluencerSchema },
    ]),
  ],
  controllers: [PromosController],
  providers: [PromosService],
})
export class PromosModule {}
