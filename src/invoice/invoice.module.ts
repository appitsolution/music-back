import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InvoiceDetails,
  InvoiceDetailsSchema,
} from './schemas/invoice-details.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvoiceDetails.name, schema: InvoiceDetailsSchema },
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
