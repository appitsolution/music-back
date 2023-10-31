import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdatePersonalClientDto } from './dto/update-personal-client.dto';
import { UpdatePasswordClientDto } from './dto/update-password-client.dto';
import { UpdateCompanyClientDto } from './dto/update-company-client.dto';
import { UpdateEmailClientDto } from './dto/update-email-client.dto';
import { UpdatePhoneClientDto } from './dto/update-phone-client.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('client/personal')
  updatePersonalClient(@Body() data: UpdatePersonalClientDto) {
    return this.profileService.updatePersonalClient(data);
  }

  @Put('client/password')
  updatePasswordClient(@Body() data: UpdatePasswordClientDto) {
    return this.profileService.updatePasswordClient(data);
  }

  @Put('client/company')
  updateCompanyClient(@Body() data: UpdateCompanyClientDto) {
    return this.profileService.updateCompanyClient(data);
  }

  @Put('client/email')
  updateEmailClient(@Body() data: UpdateEmailClientDto) {
    return this.profileService.updateEmailClient(data);
  }

  @Put('client/phone')
  updatePhoneClient(@Body() data: UpdatePhoneClientDto) {
    return this.profileService.updatePhoneClient(data);
  }
}
