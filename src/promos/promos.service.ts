import { Injectable } from '@nestjs/common';
import { CreatePromosDto } from './dto/create-promo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Promos } from './schemas/promo.schema';
import mongoose from 'mongoose';
import { Client } from 'src/auth/schemas/client.schema';

@Injectable()
export class PromosService {
  constructor(
    @InjectModel(Promos.name)
    private promosModel: mongoose.Model<Promos>,
    @InjectModel(Client.name)
    private clientModel: mongoose.Model<Client>,
  ) {}

  async createPromos(data: CreatePromosDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const result = await this.promosModel.create(data);

      return {
        code: 201,
        result,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async historyPromos(id: string) {
    try {
      if (!id) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.clientModel.findOne({ _id: id });

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      const result = await this.promosModel.find({ userId: id });

      return {
        code: 200,
        promos: result,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async historyPromosOne(userId: string, promosId: string) {
    try {
      if (!userId || !promosId) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.clientModel.findOne({ _id: userId });

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      const result = await this.promosModel.findOne({ _id: promosId });

      return {
        code: 200,
        promo: result,
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
