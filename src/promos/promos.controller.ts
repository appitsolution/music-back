import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PromosService } from './promos.service';
import { CreatePromosDto } from './dto/create-promo.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Post()
  createPromos(@Body() data: CreatePromosDto) {
    return this.promosService.createPromos(data);
  }

  @ApiQuery({ name: 'id', required: true })
  @Get('history')
  historyPromos(@Query() args: { id: string }) {
    return this.promosService.historyPromos(args.id);
  }

  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'promosId', required: true })
  @Get('history/one')
  historyPromosOne(@Query() args: { userId: string; promosId: string }) {
    return this.promosService.historyPromosOne(args.userId, args.promosId);
  }
}
