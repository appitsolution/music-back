import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { Client } from './schemas/client.schema';
import mongoose from 'mongoose';
import { Influencer } from './schemas/influencer.schema';
import { LoginClientDto } from './dto/login-client.dto';
import { VerifyDto } from './dto/verify.dto';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  private readonly secretKey = '9fgfdrdr@fdfd';
  constructor(
    @InjectModel(Client.name)
    private clientModel: mongoose.Model<Client>,
    @InjectModel(Influencer.name)
    private influencerModel: mongoose.Model<Influencer>,
  ) {}

  async createClient(data: CreateClientDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        const checkInfluencer = await this.influencerModel.findOne({
          email: data.email,
        });

        if (checkInfluencer) return checkInfluencer;

        const checkClient = await this.clientModel.findOne({
          email: data.email,
        });
        if (checkClient) return checkClient;

        return null;
      })();

      if (checkUser) {
        return {
          code: 409,
          message: 'This user already exists',
        };
      }

      const newUser = await this.clientModel.create({
        ...data,
        password: bcrypt.hashSync(data.password),
      });

      return {
        code: 201,
        newUser,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
      };
    }
  }

  async createInfluencer(data: CreateInfluencerDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await (async () => {
        const checkInfluencer = await this.influencerModel.findOne({
          email: data.email,
        });

        if (checkInfluencer) return checkInfluencer;

        const checkClient = await this.clientModel.findOne({
          email: data.email,
        });
        if (checkClient) return checkClient;

        return null;
      })();

      if (!checkUser) {
      } else {
        return {
          code: 409,
          message: 'This user already exists',
        };
      }

      const newUser = await this.influencerModel.create({
        ...data,
        password: bcrypt.hashSync(data.password),
      });

      return {
        code: 201,
        newUser,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
      };
    }
  }

  async loginClient(loginClient: LoginClientDto) {
    if (!loginClient.email || !loginClient.password) {
      return {
        code: 400,
        message: 'Not enough arguments',
      };
    }

    const checkUser = await this.clientModel.findOne({
      email: loginClient.email,
    });

    if (!checkUser) {
      return {
        code: 404,
        message: 'Not Found',
      };
    }

    if (bcrypt.compareSync(loginClient.password, checkUser.password)) {
      return {
        code: 200,
        token: jwt.sign(
          { id: checkUser.id, role: checkUser.role },
          this.secretKey,
        ),
      };
    } else {
      return {
        code: 400,
        message: 'Password is not correct',
      };
    }
  }

  async loginInfluencer(loginInfluencer: LoginClientDto) {
    if (!loginInfluencer.email || !loginInfluencer.password) {
      return {
        code: 400,
        message: 'Not enough arguments',
      };
    }

    const checkUser = await this.influencerModel.findOne({
      email: loginInfluencer.email,
    });

    if (!checkUser) {
      return {
        code: 404,
        message: 'Not Found',
      };
    }

    if (bcrypt.compareSync(loginInfluencer.password, checkUser.password)) {
      return {
        code: 200,
        token: jwt.sign(
          { id: checkUser.id, role: checkUser.role },
          this.secretKey,
        ),
      };
    } else {
      return {
        code: 400,
        message: 'Password is not correct',
      };
    }
  }

  async verify(data: VerifyDto) {
    try {
      if (!data.token) {
        return {
          code: 400,
          message: 'Not enough arguments',
        };
      }
      const login = jwt.verify(data.token, this.secretKey);
      const userClient = await this.clientModel.findOne({ _id: login.id });
      const userInfluencer = await this.influencerModel.findOne({
        _id: login.id,
      });

      if (login.role === 'client' && userClient) {
        return {
          code: 200,
          user: userClient,
        };
      }

      if (login.role === 'influencer' && userInfluencer) {
        return {
          code: 200,
          user: userInfluencer,
        };
      }

      return {
        code: 404,
        message: 'Not Found',
      };
    } catch (err) {
      return {
        code: 500,
        message: err,
      };
    }
  }

  async getInfluencers() {
    try {
      const getInfluencersAll = await this.influencerModel
        .find({})
        .select(['-password', '-balance', '-phone', '-email']);

      return {
        code: 200,
        influencers: getInfluencersAll,
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
