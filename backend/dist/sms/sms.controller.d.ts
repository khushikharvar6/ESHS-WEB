import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
export declare class SmsController {
    private readonly smsService;
    constructor(smsService: SmsService);
    sendSms(dto: SendSmsDto, userId: string): Promise<{
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
