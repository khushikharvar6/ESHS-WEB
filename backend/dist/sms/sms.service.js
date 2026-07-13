"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let SmsService = SmsService_1 = class SmsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.twilioClient = null;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        if (accountSid && authToken && accountSid !== 'your_twilio_sid' && authToken !== 'your_twilio_token') {
            try {
                const twilio = require('twilio');
                this.twilioClient = twilio(accountSid, authToken);
                this.logger.log('Twilio client initialized successfully');
            }
            catch (err) {
                this.logger.warn('Failed to initialize Twilio client (is the "twilio" package installed?): ' + err.message);
            }
        }
        else {
            this.logger.log('Twilio credentials missing or using defaults. Running SMS Service in MOCK mode.');
        }
    }
    async sendSms(dto, userId) {
        const fromNumber = this.configService.get('TWILIO_PHONE_NUMBER', '+1234567890');
        let providerId = null;
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
            }
            catch (error) {
                status = 'FAILED';
                this.logger.error(`Failed to send SMS via Twilio: ${error.message}`);
            }
        }
        else {
            providerId = 'mock_sid_' + Math.random().toString(36).substr(2, 9);
            status = 'DELIVERED';
            this.logger.log(`Mock SMS simulated, ID: ${providerId}`);
        }
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
    async getLogs(page = 1, limit = 20, patientId) {
        const logs = [];
        const total = 0;
        return {
            data: logs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map