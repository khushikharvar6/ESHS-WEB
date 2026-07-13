import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto, userId?: string) {
    // return this.prisma.feedback.create({...});
    return {} as any;
  }

  async findAll(page = 1, limit = 20, patientId?: string) {
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }

  async findById(id: string) {
    // const feedback = await this.prisma.feedback.findUnique({...});
    // return feedback;
    return {} as any;
  }

  async getStats() {
    return {
      totalFeedbacks: 0,
      averageOverall: 0,
      averageRegistration: 0,
      averageQueryHandling: 0,
      averageWaitingTime: 0,
      averageStaffBehavior: 0,
      averageBilling: 0,
      averageCleanliness: 0,
    };
  }
}
