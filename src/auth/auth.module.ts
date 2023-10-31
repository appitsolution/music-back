import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema } from './schemas/client.schema';
import { InfluencerSchema } from './schemas/influencer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Client', schema: ClientSchema },
      { name: 'Influencer', schema: InfluencerSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
