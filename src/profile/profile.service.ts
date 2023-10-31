import { Injectable } from '@nestjs/common';
import { UpdatePersonalClientDto } from './dto/update-personal-client.dto';
import { Client } from 'src/auth/schemas/client.schema';
import { Influencer } from 'src/auth/schemas/influencer.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePasswordClientDto } from './dto/update-password-client.dto';
import { UpdateCompanyClientDto } from './dto/update-company-client.dto';
import { UpdateEmailClientDto } from './dto/update-email-client.dto';
import { UpdatePhoneClientDto } from './dto/update-phone-client.dto';
const bcrypt = require('bcryptjs');

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Client.name)
    private clientModel: mongoose.Model<Client>,
    @InjectModel(Influencer.name)
    private influencerModel: mongoose.Model<Influencer>,
  ) {}

  async updatePersonalClient(data: UpdatePersonalClientDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.clientModel.findOne({ _id: data.id });

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }
      await this.clientModel.findOneAndUpdate(
        { _id: data.id },
        {
          firstName: data.firstName,
          username: data.username,
          instagram: data.instagram,
          refelarCode: data.referalCode,
        },
      );

      return {
        code: 200,
        message: 'personal data update',
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async updatePasswordClient(data: UpdatePasswordClientDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.clientModel.findOne({ _id: data.id });

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }

      if (bcrypt.compareSync(data.currentPassword, checkUser.password)) {
        await this.clientModel.findOneAndUpdate(
          { _id: data.id },
          {
            password: data.newPassword,
          },
        );

        return {
          code: 200,
          message: 'personal data update',
        };
      }

      return {
        code: 400,
        message: 'password is not correct',
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async updateCompanyClient(data: UpdateCompanyClientDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.clientModel.findOne({ _id: data.id });

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }
      await this.clientModel.findOneAndUpdate(
        { _id: data.id },
        {
          company: data.company,
          companyType: data.companyType,
        },
      );

      return {
        code: 200,
        message: 'personal data update',
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async updateEmailClient(data: UpdateEmailClientDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.clientModel.findOne({ _id: data.id });

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }
      await this.clientModel.findOneAndUpdate(
        { _id: data.id },
        {
          email: data.email,
        },
      );

      return {
        code: 200,
        message: 'personal data update',
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async updatePhoneClient(data: UpdatePhoneClientDto) {
    try {
      if (!data) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUser = await this.clientModel.findOne({ _id: data.id });

      if (!checkUser) {
        return {
          code: 404,
          message: 'User not found',
        };
      }
      await this.clientModel.findOneAndUpdate(
        { _id: data.id },
        {
          phone: data.phone,
        },
      );

      return {
        code: 200,
        message: 'personal data update',
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
