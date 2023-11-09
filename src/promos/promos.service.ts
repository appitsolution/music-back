import { Injectable } from '@nestjs/common';
import { CreatePromosDto } from './dto/create-promo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Promos } from './schemas/promo.schema';
import mongoose from 'mongoose';
import { Client } from 'src/auth/schemas/client.schema';
import { Influencer } from 'src/auth/schemas/influencer.schema';

@Injectable()
export class PromosService {
  constructor(
    @InjectModel(Promos.name)
    private promosModel: mongoose.Model<Promos>,
    @InjectModel(Client.name)
    private clientModel: mongoose.Model<Client>,
    @InjectModel(Influencer.name)
    private influencerModel: mongoose.Model<Influencer>,
  ) {}

  async createPromos(data: CreatePromosDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const result = await this.promosModel.create({
        ...data,
        paymentType: !data.paymentType ? 'payment' : data.paymentType,
        paymentStatus: 'wait',
      });

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

      const checkUser = await (async () => {
        const client = await this.clientModel.findOne({ _id: id });
        const influencer = await this.influencerModel.findOne({ _id: id });
        if (client) {
          return client;
        }
        if (influencer) {
          return influencer;
        }
      })();

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      if (checkUser.role === 'influencer') {
        const promos = await this.promosModel.find().lean();
        const promosName = await Promise.all(
          promos.map(async (item) => {
            const clientName = await this.clientModel.findById(item.userId);
            if (!clientName) return { ...item, client: 'No Date' };
            return { ...item, client: clientName.firstName };
          }),
        );

        return {
          code: 200,
          promos: promosName,
        };
      }

      const promos = await this.promosModel
        .find({
          userId: id,
          paymentStatus: 'finally',
        })
        .lean();

      const promosName = await Promise.all(
        promos.map(async (item) => {
          const clientName = await this.clientModel.findById(item.userId);
          if (!clientName) return { ...item, client: 'No Date' };
          return { ...item, client: clientName.firstName };
        }),
      );

      return {
        code: 200,
        promos: promosName,
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

      const checkUser = await (async () => {
        const client = await this.clientModel.findOne({ _id: userId });
        const influencer = await this.influencerModel.findOne({ _id: userId });
        if (client) {
          return client;
        }
        if (influencer) {
          return influencer;
        }
      })();

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      const result = await this.promosModel.findOne({ _id: promosId }).lean();

      const clientName = await this.clientModel
        .findOne({ _id: result.userId })
        .lean();

      if (!result) {
        return {
          code: 404,
          message: 'not found',
        };
      }

      return {
        code: 200,
        promo: { ...result, firstName: clientName ? clientName.firstName : '' },
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
