import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Client } from 'src/auth/schemas/client.schema';
import { Influencer } from 'src/auth/schemas/influencer.schema';
import { Forgot } from './schemas/forgot.schema';

function generateFourDigitCode() {
  const code = Math.floor(Math.random() * 9000) + 1000;
  return String(code);
}

@Injectable()
export class ForgotService {
  constructor(
    @InjectModel(Client.name)
    private clientModel: mongoose.Model<Client>,
    @InjectModel(Influencer.name)
    private influencerModel: mongoose.Model<Influencer>,
    @InjectModel(Forgot.name)
    private forgotModel: mongoose.Model<Forgot>,
  ) {}

  async forgotEmail(email: string) {
    try {
      if (!email) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUserClient = await this.clientModel.findOne({
        email: email,
      });

      const checkUserInfluencer = await this.influencerModel.findOne({
        email: email,
      });

      if (!(!checkUserClient && !checkUserInfluencer)) {
        if (checkUserClient) {
          const checkForgot = await this.forgotModel.findOne({
            id: checkUserClient.id,
          });

          if (checkForgot) {
            await this.forgotModel.findOneAndUpdate(
              { id: checkUserClient.id },
              {
                code: generateFourDigitCode(),
              },
            );
            return {
              code: 200,
              message: 'code send',
            };
          } else {
            await this.forgotModel.create({
              id: checkUserClient.id,
              code: generateFourDigitCode(),
            });
            return {
              code: 200,
              message: 'code send',
            };
          }
        } else {
          const checkForgot = await this.forgotModel.findOne({
            id: checkUserInfluencer.id,
          });
          if (checkForgot) {
            await this.forgotModel.findOneAndUpdate(
              { id: checkUserInfluencer.id },
              {
                code: generateFourDigitCode(),
              },
            );
            return {
              code: 200,
              message: 'code send',
            };
          } else {
            await this.forgotModel.create({
              id: checkUserInfluencer.id,
              code: generateFourDigitCode(),
            });
            return {
              code: 200,
              message: 'code send',
            };
          }
        }
      }

      return {
        code: 404,
        message: 'User not found',
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        message: err,
      };
    }
  }

  async forgotCode(email: string, code: string) {
    try {
      if (!email || !code) {
        return {
          status: 400,
          message: 'Not enough arguments',
        };
      }

      const checkUserClient = await this.clientModel.findOne({
        email: email,
      });

      const checkUserInfluencer = await this.influencerModel.findOne({
        email: email,
      });

      if (!(!checkUserClient && !checkUserInfluencer)) {
        if (checkUserClient) {
          const checkForgot = await this.forgotModel.findOne({
            id: checkUserClient.id,
          });

          if (checkForgot) {
            if (checkForgot.code !== code) {
              return {
                code: 400,
                message: 'code is not correct ',
              };
            }
            await this.forgotModel.findOneAndDelete({ id: checkUserClient.id });
            return {
              code: 200,
              message: 'password send',
            };
          }
        } else {
          const checkForgot = await this.forgotModel.findOne({
            id: checkUserInfluencer.id,
          });
          if (checkForgot) {
            if (checkForgot.code !== code) {
              return {
                code: 400,
                message: 'code is not correct ',
              };
            }
            await this.forgotModel.findOneAndDelete({
              id: checkUserInfluencer.id,
            });
            return {
              code: 200,
              message: 'password send',
            };
          }
        }
      }

      return {
        code: 404,
        message: 'User not found',
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
