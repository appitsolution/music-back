import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ForgotModule } from './forgot/forgot.module';
import { ProfileModule } from './profile/profile.module';
import { InvoiceModule } from './invoice/invoice.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Client } from './auth/schemas/client.schema';
import { PromosModule } from './promos/promos.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://test_education:Fm5xGy5NlfsDXhu0@cluster0.svrxsep.mongodb.net/music',
    ),
    AuthModule,
    ForgotModule,
    ProfileModule,
    InvoiceModule,
    Client,
    PromosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
