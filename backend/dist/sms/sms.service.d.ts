import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SendSmsDto } from './dto/send-sms.dto';
export declare class SmsService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private twilioClient;
    constructor(prisma: PrismaService, configService: ConfigService);
    sendSms(dto: SendSmsDto, userId?: string): Promise<{
        id: string;
        patientId: string | undefined;
        recipient: string;
        message: string;
        type: string;
        status: string;
        provider: string;
        providerId: string | null;
        createdById: string | undefined;
    }>;
    getLogs(page?: number, limit?: number, patientId?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
