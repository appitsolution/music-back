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

      const checkUser = await this.clientModel.findOne({
        email: data.email,
      });

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

      const checkUser = await this.influencerModel.findOne({
        email: data.email,
      });

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
        token: jwt.sign({ email: checkUser.id }, this.secretKey),
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

    const checkUser = await this.clientModel.findOne({
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
        token: jwt.sign({ email: checkUser.id }, this.secretKey),
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
      if (!data.token || !data.role) {
        return {
          code: 400,
          message: 'Not enough arguments',
        };
      }

      if (data.role === 'client') {
        const loginClient = jwt.verify(data.token, this.secretKey);
        const user = await this.clientModel.findOne({ id: loginClient.id });
        if (!user) {
          return {
            code: 404,
            message: 'Not Found',
          };
        }
        return { code: 200, user };
      }

      if (data.role === 'influencer') {
        const loginInfluencer = jwt.verify(data.token, this.secretKey);
        const user = await this.influencerModel.findOne({
          id: loginInfluencer.id,
        });
        if (!user) {
          return {
            code: 404,
            message: 'Not Found',
          };
        }
        return { code: 200, user };
      }

      return {
        code: 404,
        message: 'role not found',
      };
    } catch (err) {
      return {
        code: 500,
        message: err,
      };
    }
  }
}
