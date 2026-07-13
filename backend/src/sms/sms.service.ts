import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SendSmsDto } from './dto/send-sms.dto';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private twilioClient: any = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken && accountSid !== 'your_twilio_sid' && authToken !== 'your_twilio_token') {
      try {
        // Dynamically require Twilio if credentials exist, avoiding install/runtime crash if package not present or set to mock
        const twilio = require('twilio');
        this.twilioClient = twilio(accountSid, authToken);
        this.logger.log('Twilio client initialized successfully');
      } catch (err) {
        this.logger.warn('Failed to initialize Twilio client (is the "twilio" package installed?): ' + err.message);
      }
    } else {
      this.logger.log('Twilio credentials missing or using defaults. Running SMS Service in MOCK mode.');
    }
  }

  async sendSms(dto: SendSmsDto, userId?: string) {
    const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER', '+1234567890');
    let providerId: string | null = null;
    let status = 'SENT';

    this.logger.log(`Sending SMS to ${dto.recipient}: "${dto.message}"`);

    if (this.twilioClient) {
      try {
        const response = await this.twilioClient.messages.create({
          body: dto.message,
          from: fromNumber,
          to: dto.recipient,
        });
        providerId = response.sid;
        status = 'DELIVERED';
        this.logger.log(`SMS sent successfully via Twilio, SID: ${providerId}`);
      } catch (error) {
        status = 'FAILED';
        this.logger.error(`Failed to send SMS via Twilio: ${error.message}`);
      }
    } else {
      // Mock mode
      providerId = 'mock_sid_' + Math.random().toString(36).substr(2, 9);
      status = 'DELIVERED';
      this.logger.log(`Mock SMS simulated, ID: ${providerId}`);
    }

    // Save to SmsLog table (model removed from schema)
    return {
        id: 'mock_log_id',
        patientId: dto.patientId,
        recipient: dto.recipient,
        message: dto.message,
        type: dto.type,
        status,
        provider: this.twilioClient ? 'twilio' : 'mock',
        providerId,
        createdById: userId,
    };
  }

  async getLogs(page = 1, limit = 20, patientId?: string) {
    const logs: any[] = [];
    const total = 0;

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
