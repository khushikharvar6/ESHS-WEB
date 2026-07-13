import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    // return this.prisma.notification.create({...});
    return {} as any;
  }

  async findAllForUser(userId: string, isRead?: boolean) {
    const where: any = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    // return this.prisma.notification.findMany({...});
    return [];
  }

  async markAsRead(id: string, userId: string) {
    // const notification = await this.prisma.notification.findUnique({...});
    // return this.prisma.notification.update({...});
    return {} as any;
  }

  async markAllAsRead(userId: string) {
    // return this.prisma.notification.updateMany({...});
    return { count: 0 };
  }

  async delete(id: string, userId: string) {
    // const notification = await this.prisma.notification.findUnique({...});
    // await this.prisma.notification.delete({...});
    return { deleted: true };
  }
}
