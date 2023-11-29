import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { Client } from './schemas/client.schema';
import mongoose from 'mongoose';
import { Influencer } from './schemas/influencer.schema';
import { LoginClientDto } from './dto/login-client.dto';
import { VerifyDto } from './dto/verify.dto';
import sendMail from 'src/utils/sendMail';
import { VerifyInfluencer } from './schemas/verifyInfluencer.schema';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function generateRandomString() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

@Injectable()
export class AuthService {
  private readonly secretKey = '9fgfdrdr@fdfd';
  constructor(
    @InjectModel(Client.name)
    private clientModel: mongoose.Model<Client>,
    @InjectModel(Influencer.name)
    private influencerModel: mongoose.Model<Influencer>,
    @InjectModel(VerifyInfluencer.name)
    private verifyInfluencerModel: mongoose.Model<VerifyInfluencer>,
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

      await sendMail(
        'admin@soundinfluencers.com',
        'soundinfluencers',
        `<p>Request from a new client ${data.company}</p><b>Details:</b><br/><br/><p>First Name: ${data.firstName}</p>
        <p>Company: ${data.company}</p>
        <p>Company Type: ${data.companyType}</p>
        <p>Instagram: ${data.instagram}</p>
        <p>Email: ${data.email}</p>
        <p>Phone: ${data.phone}</p>
        <p>Referal Code: ${data.referalCode}</p>
        <p>Username: ${data.username}</p>`,
        'html',
      );
      await sendMail(
        data.email,
        'soundinfluencers',
        `<p>Dear ${data.firstName},</p>
      <p>Thank you for confirming your information with us. Your account details have been successfully verified. You can now access your personal account by clicking on the link below:</p>
      <p><a href="https://go.soundinfluencers.com/account/client">Insert Link to Account Access</a></p>
      <p>If you have any questions or encounter any issues, please don't hesitate to contact our support team or reply to this message.</p>
      <p>Best regards,</p>
      <p>SoundInfluencers team</p>`,
        'html',
      );

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

      const generateVerifyId = generateRandomString();

      await this.verifyInfluencerModel.create({
        influencerId: newUser._id,
        verifyId: generateVerifyId,
      });
      await sendMail(
        'admin@soundinfluencers.com',
        'soundinfluencers',
        `<p>Request from a new partner ${data.influencerName}</p><b>Details:</b><br/><br/><p>First Name: ${data.firstName}</p>
        <p>Influencer Name: ${data.influencerName}</p>
        <p>Music Style: ${data.musicStyle}</p>
        <p>Instagram: ${data.instagram}</p>
        <p>Followers Number: ${data.followersNumber}</p>
        <p>Email: ${data.email}</p>
        <p>Phone: ${data.phone}</p>
        <p>Price: ${data.price}</p>
        <p>Username: ${data.username}</p>
        <h2>Do you want to verify your account?</h2>
        <a href="${process.env.SERVER}/auth/verify-influencer?verifyId=${generateVerifyId}&responseVerify=accept">ACCEPT</a>
        <a href="${process.env.SERVER}/auth/verify-influencer?verifyId=${generateVerifyId}&responseVerify=cancel">CANCEL</a>
        `,
        'html',
      );
      await sendMail(
        data.email,
        'soundinfluencers',
        `<p>Dear ${data.influencerName},</p>
      <p>Thank you for your subscription request submission.</p>
      <p>An email with a status update will be sent to you soon.</p>
      <p>Best regards,</p>
      <p>SoundInfluencers team</p>`,
        'html',
      );
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

  async verifyAdmin(verifyId: string, responseVerify: string) {
    if (!verifyId || !responseVerify) {
      return {
        status: 400,
        message: 'Not enough arguments',
      };
    }

    const checkVerifyAdmin = await this.verifyInfluencerModel.findOne({
      verifyId: verifyId,
    });

    if (!checkVerifyAdmin) {
      return {
        code: 404,
        message: 'not found',
      };
    }

    const checkInfluencer = await this.influencerModel.findOne({
      _id: checkVerifyAdmin.influencerId,
    });

    if (!checkInfluencer) {
      return {
        code: 404,
        message: 'influencer not found ',
      };
    }

    if (responseVerify === 'accept') {
      await this.influencerModel.findOneAndUpdate(
        { _id: checkInfluencer._id },
        { statusVerify: responseVerify },
      );

      await this.verifyInfluencerModel.findOneAndDelete({ verifyId: verifyId });

      sendMail(
        checkInfluencer.email,
        'soundinfluencers',
        `<p>Hi,</p>
      <p>thanks for the application!</p> 
      <p>Your account has been verified!</p>`,
        'html',
      );

      return {
        code: 200,
        message: 'influencer verify',
      };
    } else if (responseVerify === 'cancel') {
      await this.influencerModel.findOneAndUpdate(
        { _id: checkInfluencer._id },
        { statusVerify: responseVerify },
      );

      await this.verifyInfluencerModel.findOneAndDelete({ verifyId: verifyId });
      sendMail(
        checkInfluencer.email,
        'soundinfluencers',
        `<p>Hi,</p>
      <p>thanks for the application!</p>
      <p>Unfortunately we're not sure there's a good fit for us right now.</p>
      <p>We suggest trying again in the future 🙂</p> 
      <p>Best Regards</p><p>SoundInfluencers Team</p>`,
        'html',
      );
      return {
        code: 200,
        message: 'influencer not verify',
      };
    } else {
      return {
        code: 200,
        message: 'response verify is not correct',
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
      if (checkUser.statusVerify === 'wait') {
        return {
          code: 403,
          message: 'not verify account',
        };
      }
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
