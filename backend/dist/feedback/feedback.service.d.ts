import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
export declare class FeedbackService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFeedbackDto, userId?: string): Promise<any>;
    findAll(page?: number, limit?: number, patientId?: string): Promise<{
        data: never[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    getStats(): Promise<{
        totalFeedbacks: number;
        averageOverall: number;
        averageRegistration: number;
        averageQueryHandling: number;
        averageWaitingTime: number;
        averageStaffBehavior: number;
        averageBilling: number;
        averageCleanliness: number;
    }>;
}
