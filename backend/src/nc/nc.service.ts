import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNcDto, ResolveNcDto } from './dto/nc.dto';
import { generateSequentialId, ID_PREFIXES } from '../common/utils/id-generator';

@Injectable()
export class NcService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNcDto, userId?: string) {
    return this.prisma.nonConformance.create({
      data: {
        uhid: dto.patientId || '', // stub
        patient: dto.patientId || '',
        department: '', // stub
        description: dto.description,
        severity: dto.severity || 'Minor',
        status: dto.status || 'Open',
        updatedBy: userId,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 20,
    status?: string,
    severity?: string,
    patientId?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (patientId) where.uhid = patientId;

    const [ncs, total] = await Promise.all([
      this.prisma.nonConformance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.nonConformance.count({ where }),
    ]);

    return {
      data: ncs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const nc = await this.prisma.nonConformance.findUnique({
      where: { id },
    });

    if (!nc) {
      throw new NotFoundException(`NC record with id ${id} not found`);
    }

    return nc;
  }

  async resolve(id: string, dto: ResolveNcDto, userId?: string) {
    await this.findById(id);

    return this.prisma.nonConformance.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        rootCause: dto.resolution,
        updatedBy: userId,
      },
    });
  }

  async close(id: string) {
    await this.findById(id);

    return this.prisma.nonConformance.update({
      where: { id },
      data: {
        status: 'CLOSED',
      },
    });
  }
}
