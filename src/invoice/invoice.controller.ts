import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { UpdateInvoiceDetailsDto } from './dto/update-invoice-details';
import { ApiQuery } from '@nestjs/swagger';
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiQuery({ name: 'userId', required: true })
  @Get('details/one')
  getInvoiceDetails(@Query() args: { userId: string }) {
    return this.invoiceService.getInvoiceDetails(args.userId);
  }

  @Put('details')
  updateInvoiceDetails(@Body() data: UpdateInvoiceDetailsDto) {
    return this.invoiceService.updateInvoiceDetails(data);
  }
}
