import { Injectable } from '@nestjs/common';
import { UpdateInvoiceDetailsDto } from './dto/update-invoice-details';
import { InjectModel } from '@nestjs/mongoose';
import { InvoiceDetails } from './schemas/invoice-details.schema';
import mongoose from 'mongoose';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(InvoiceDetails.name)
    private invoiceDetailsModel: mongoose.Model<InvoiceDetails>,
  ) {}

  async updateInvoiceDetails(data: UpdateInvoiceDetailsDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.invoiceDetailsModel.findOne({ id: data.id });

      if (!checkUser) {
        await this.invoiceDetailsModel.create(data);
      } else {
        await this.invoiceDetailsModel.findOneAndUpdate({ id: data.id }, data);
      }

      return {
        code: 200,
        message: 'invoice details update',
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async getInvoiceDetails(id: string) {
    try {
      if (!id) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.invoiceDetailsModel.findOne({ id: id });

      if (!checkUser) {
        return {
          code: 404,
          message: 'invoice details not found',
        };
      }

      return {
        code: 200,
        invoiceDetails: checkUser,
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
