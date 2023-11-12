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
        statusPromo: 'wait',
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

  async historyPromosClient(id: string) {
    try {
      if (!id) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        return await this.clientModel.findOne({ _id: id });
      })();

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      const promos = await this.promosModel
        .find({
          userId: id,
          statusPromo: 'finally',
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

  async getOngoingPromosClient(id: string) {
    try {
      if (!id) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        return await this.clientModel.findOne({ _id: id });
      })();

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      const promos = await this.promosModel
        .find({
          userId: id,
          statusPromo: 'work',
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

  async getOngoingPromosClientCurrent(id: string, userId: string) {
    try {
      if (!id) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        return await this.clientModel.findOne({ _id: userId });
      })();

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      const promo = await this.promosModel
        .findOne({
          _id: id,
        })
        .lean();

      const clientName = await this.clientModel.findById(userId);
      const addInfluencer = await Promise.all(
        promo.selectInfluencers.map(async (item) => {
          const nameInfluencer = await this.influencerModel.findById(
            item.influencerId,
          );

          if (!nameInfluencer) return { ...item, firstName: '' };
          return {
            ...item,
            firstName: nameInfluencer.firstName,
            followersNumber: nameInfluencer.followersNumber,
          };
        }),
      );

      return {
        code: 200,
        promo: {
          ...promo,
          selectInfluencers: addInfluencer,
          client: !clientName ? 'No Date' : clientName.firstName,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async historyPromosInfluencer(id: string) {
    try {
      if (!id) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        return await this.influencerModel.findOne({ _id: id });
      })();

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      const promos = await this.promosModel
        .find({
          statusPromo: 'finally',
          selectInfluencers: {
            $elemMatch: { influencerId: id },
          },
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
        promo: {
          ...result,
          firstName: clientName ? clientName.firstName : '',
          client: clientName ? clientName.firstName : '',
        },
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async getNewPromos(influencerId: string) {
    try {
      if (!influencerId) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        const influencer = await this.influencerModel.findOne({
          _id: influencerId,
        });

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

      const promos = await this.promosModel
        .find({
          selectInfluencers: {
            $elemMatch: { influencerId: influencerId, confirmation: 'wait' },
          },
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

  async updateResponseNewPromo(
    influencerId: string,
    promoId: string,
    promoResponse: string,
  ) {
    if (!influencerId || !promoId || !promoResponse) {
      return {
        status: 400,
        message: 'Not enough arguments',
      };
    }

    try {
      const findNewPromo = await this.promosModel.findOne({
        _id: promoId,
        selectInfluencers: { $elemMatch: { influencerId: influencerId } },
      });

      if (!findNewPromo) {
        return {
          code: 404,
          message: 'not found',
        };
      }
      if(findNewPromo.statusPromo === "wait" && promoResponse === 'accept'){
        const updateNewPromo = await this.promosModel.findOneAndUpdate(
          {
            _id: promoId,
            selectInfluencers: { $elemMatch: { influencerId: influencerId } },
          },
          {
            $set: {
              statusPromo: "work",
              'selectInfluencers.$.confirmation': promoResponse,
            },
          },
        );
  
        return {
          code: 200,
          updateNewPromo,
        };
      }else {
        const updateNewPromo = await this.promosModel.findOneAndUpdate(
          {
            _id: promoId,
            selectInfluencers: { $elemMatch: { influencerId: influencerId } },
          },
          {
            $set: {
              
              'selectInfluencers.$.confirmation': promoResponse,
            },
          },
        );
  
        return {
          code: 200,
          updateNewPromo,
        };
      }
      
    } catch (err) {
      return {
        code: 500,
        message: err,
      };
    }
  }

  async getOngoingPromos(influencerId: string) {
    try {
      if (!influencerId) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        const influencer = await this.influencerModel.findOne({
          _id: influencerId,
        });

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

      const promos = await this.promosModel
        .find({
          selectInfluencers: {
            $elemMatch: { influencerId: influencerId, confirmation: 'accept' },
          },
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

  async getOngoingPromoOne(influencerId: string, promoId: string) {
    try {
      if (!influencerId) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        const influencer = await this.influencerModel.findOne({
          _id: influencerId,
        });

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

      const promo = await this.promosModel
        .findOne({
          _id: promoId,
          selectInfluencers: {
            $elemMatch: { influencerId: influencerId, confirmation: 'accept' },
          },
        })
        .lean();

      if (!promo) {
        return {
          code: 404,
          message: 'not found',
        };
      }

      const currentDataInfluencer = promo.selectInfluencers.find(
        (item) => item.influencerId === influencerId,
      );

      if (!currentDataInfluencer) {
        return {
          code: 404,
          message: 'not found',
        };
      }
      return {
        code: 200,
        promo: currentDataInfluencer,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async updateOngoingPromo(influencerId: string, promoId: string, data: any) {
    if (!influencerId || !promoId) {
      return {
        status: 400,
        message: 'Not enough arguments',
      };
    }

    try {
      const findNewPromo = await this.promosModel.findOne({
        _id: promoId,
        selectInfluencers: { $elemMatch: { influencerId: influencerId } },
      });

      if (!findNewPromo) {
        return {
          code: 404,
          message: 'not found',
        };
      }

      const updateNewPromo = await this.promosModel.findOneAndUpdate(
        {
          _id: promoId,
          selectInfluencers: { $elemMatch: { influencerId: influencerId } },
        },
        {
          $set: {
            'selectInfluencers.$': data, // Заменяем найденный элемент массива на новый
          },
        },
      );

      return {
        code: 200,
        updateNewPromo,
      };
    } catch (err) {
      return {
        code: 500,
        message: err,
      };
    }
  }
}
