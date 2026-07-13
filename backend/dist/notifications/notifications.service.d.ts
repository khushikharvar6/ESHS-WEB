import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateNotificationDto): Promise<any>;
    findAllForUser(userId: string, isRead?: boolean): Promise<never[]>;
    markAsRead(id: string, userId: string): Promise<any>;
    markAllAsRead(userId: string): Promise<{
        count: number;
    }>;
    delete(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
