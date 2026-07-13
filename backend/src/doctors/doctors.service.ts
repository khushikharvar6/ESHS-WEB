import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDoctorDto) {
    const lastDoc = await this.prisma.doctor.findFirst({
      orderBy: { id: 'desc' },
    });
    
    let nextNum = 1;
    if (lastDoc && lastDoc.id.startsWith('DOC')) {
      const numPart = parseInt(lastDoc.id.replace('DOC', ''), 10);
      if (!isNaN(numPart)) {
        nextNum = numPart + 1;
      }
    }
    const docId = `DOC${nextNum.toString().padStart(3, '0')}`;

    return this.prisma.doctor.create({
      data: {
        id: docId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        fullName: dto.fullName || `Dr. ${dto.firstName} ${dto.lastName}`,
        specialization: dto.specialization,
        qualification: dto.qualification,
        experienceYears: dto.experienceYears,
        phone: dto.phone,
        email: dto.email,
        consultationFee: dto.consultationFee || 0,
        followUpFee: dto.followUpFee || 0,
        bio: dto.bio,
      },
    });
  }

  async findAll() {
    return this.prisma.doctor.findMany({
      where: { isActive: true },
      orderBy: { fullName: 'asc' },
    });
  }

  async findById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    return doctor;
  }

  async update(id: string, dto: UpdateDoctorDto) {
    await this.findById(id);
    return this.prisma.doctor.update({
      where: { id },
      data: dto,
    });
  }

  async deactivate(id: string) {
    await this.findById(id);
    return this.prisma.doctor.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
