import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto, UpdateInquiryDto } from './dto/create-inquiry.dto';
import { generateSequentialId, ID_PREFIXES } from '../common/utils/id-generator';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInquiryDto, userId?: string) {
    return this.prisma.inquiry.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.mobile,
        email: dto.email,
        service: dto.interestedService || '',
        source: dto.inquirySource || '',
        status: dto.status || 'NEW',
        notes: dto.remarks,
      },
    });
  }

  async findAll(page = 1, limit = 20, status?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      data: inquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry with id ${id} not found`);
    }

    return inquiry;
  }

  async update(id: string, dto: UpdateInquiryDto) {
    await this.findById(id);
    return this.prisma.inquiry.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.mobile,
        email: dto.email,
        service: dto.interestedService,
        source: dto.inquirySource,
        status: dto.status,
        notes: dto.remarks,
      },
    });
  }

  async convert(id: string, patientId: string) {
    await this.findById(id);
    return this.prisma.inquiry.update({
      where: { id },
      data: {
        status: 'CONVERTED',
      },
    });
  }

  async markLost(id: string, lostReason: string) {
    await this.findById(id);
    return this.prisma.inquiry.update({
      where: { id },
      data: {
        status: 'LOST',
        notes: lostReason,
      },
    });
  }
}
