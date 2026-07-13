import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('SMS')
@ApiBearerAuth()
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send an SMS manually' })
  async sendSms(@Body() dto: SendSmsDto, @CurrentUser('sub') userId: string) {
    return this.smsService.sendSms(dto, userId);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get SMS logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'patientId', required: false })
  async getLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('patientId') patientId?: string,
  ) {
    return this.smsService.getLogs(page, limit, patientId);
  }
}
