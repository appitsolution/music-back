import { Injectable } from '@nestjs/common';
import { CreateOrderStripe } from './dto/create-payment.dto';
import { AcceptOrderStripe } from './dto/accept-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Payment } from './schemas/payment.entity';
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

function generateId() {
  const length = 10;
  const digits = '0123456789';
  let id = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    id += digits.charAt(randomIndex);
  }

  return String(id);
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: mongoose.Model<Payment>,
  ) {}
  async createOrderStripe(data: CreateOrderStripe) {
    if (
      !data.amount ||
      typeof data.amount !== `number` ||
      !data.nameProduct ||
      !data.userId
    ) {
      return {
        code: 400,
        message: 'Not enough arguments',
      };
    }

    const createId = generateId();
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              unit_amount: Number(`${data.amount}00`),
              product_data: {
                name: data.nameProduct,
              },
              currency: 'usd',
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.SERVER}/payment/accept-order-stripe?orderId=${createId}`,
        cancel_url: `${process.env.SERVER}/payment/cancel-order-stripe?orderId=${createId}`,
      });

      if (session.status === 'open') {
        await this.paymentModel.create({
          orderId: createId,
          userId: data.userId,
          amount: String(data.amount),
        });

        return {
          code: 201,
          paymentUrl: session.url,
        };
      } else {
        return {
          code: 500,
          message: 'server error',
        };
      }
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async acceptOrderStripe(orderId: string) {
    if (!orderId) {
      return {
        code: 400,
        message: 'Not enough arguments',
      };
    }

    try {
      const checkOrder = await this.paymentModel.findOne({ orderId: orderId });

      if (!checkOrder) {
        return {
          code: 404,
          message: 'not found order',
        };
      }

      await this.paymentModel.findOneAndUpdate(
        { _id: checkOrder._id },
        { statusOrder: 'accept' },
      );

      return {
        code: 200,
        message: 'ok',
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async cancelOrderStripe(orderId: string, res: any) {
    if (!orderId) {
      return {
        code: 400,
        message: 'Not enough arguments',
      };
    }

    try {
      const checkOrder = await this.paymentModel.findOne({ orderId: orderId });

      if (!checkOrder) {
        return {
          code: 404,
          message: 'not found order',
        };
      }

      await this.paymentModel.findOneAndUpdate(
        { _id: checkOrder._id },
        { statusOrder: 'cancel' },
      );

      res.redirect('http://localhost:3001/account/client');

      return {
        code: 200,
        message: 'ok',
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }
}
