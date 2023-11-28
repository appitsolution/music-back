import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateOrderStripe } from './dto/create-payment.dto';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order-stripe')
  createOrderStripe(@Body() data: CreateOrderStripe) {
    return this.paymentService.createOrderStripe(data);
  }

  @Get('accept-order-stripe')
  acceptOrderStripe(@Query() args: { orderId: string }) {
    return this.paymentService.acceptOrderStripe(args.orderId);
  }

  @Get('cancel-order-stripe')
  cancelOrderStripe(@Query() args: { orderId: string }, @Res() res: Response) {
    return this.paymentService.cancelOrderStripe(args.orderId, res);
  }
}
