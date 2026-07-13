import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    create(dto: CreateFeedbackDto, userId: string): Promise<any>;
    findAll(page?: number, limit?: number, patientId?: string): Promise<{
        data: never[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
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
    findById(id: string): Promise<any>;
}
