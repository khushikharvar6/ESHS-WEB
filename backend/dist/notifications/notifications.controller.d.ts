import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(dto: CreateNotificationDto): Promise<any>;
    findAll(userId: string, isRead?: boolean): Promise<never[]>;
    markAsRead(id: string, userId: string): Promise<any>;
    markAllAsRead(userId: string): Promise<{
        count: number;
    }>;
    delete(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
