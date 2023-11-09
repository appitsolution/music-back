import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { LoginClientDto } from './dto/login-client.dto';
import { VerifyDto } from './dto/verify.dto';
import { ApiProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create/client')
  createClient(@Body() data: CreateClientDto) {
    return this.authService.createClient(data);
  }

  @Post('create/influencer')
  createInfluencer(@Body() data: CreateInfluencerDto) {
    return this.authService.createInfluencer(data);
  }

  @Post('login/client')
  loginClient(@Body() data: LoginClientDto) {
    return this.authService.loginClient(data);
  }

  @Post('login/influencer')
  loginInfluencer(@Body() data: LoginClientDto) {
    return this.authService.loginInfluencer(data);
  }

  @Post('verify')
  verify(@Body() data: VerifyDto) {
    return this.authService.verify(data);
  }

  @Get('influencers')
  getInfluencers(){
    return this.authService.getInfluencers()
  }
}
