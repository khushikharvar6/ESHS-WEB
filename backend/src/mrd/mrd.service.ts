import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dto/mrd.dto';

@Injectable()
export class MrdService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMedicalRecordDto, userId?: string) {
    // return this.prisma.medicalRecord.create({...});
    return {} as any;
  }

  async findAll(page = 1, limit = 20, patientId?: string, search?: string) {
    // const skip = (page - 1) * limit;
    // ...
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  async findById(id: string) {
    // const record = await this.prisma.medicalRecord.findUnique({...});
    // return record;
    return {} as any;
  }

  async update(id: string, dto: UpdateMedicalRecordDto) {
    // await this.findById(id);
    // return this.prisma.medicalRecord.update({...});
    return {} as any;
  }

  async delete(id: string) {
    // await this.findById(id);
    // await this.prisma.medicalRecord.delete({...});
    return { deleted: true };
  }
}
