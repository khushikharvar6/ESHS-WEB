import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
import { generateSequentialId, ID_PREFIXES } from '../common/utils/id-generator';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto, userId?: string) {
    return this.prisma.appointment.create({
      data: {
        firstName: dto.uhid || '', // stub for name since dto might be missing it
        lastName: '',
        phone: '',
        email: null,
        doctor: dto.doctorId || '',
        service: dto.specialtyService || '',
        date: dto.appointmentDate || '',
        time: dto.timeSlot || '',
        status: dto.status || 'Scheduled',
        notes: dto.clinicalNotes,
        inquiryId: dto.inquiryId,
        uhid: dto.uhid,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 20,
    status?: string,
    date?: string,
    doctorId?: string,
    department?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (doctorId) where.doctor = doctorId;
    if (date) {
      where.date = date;
    }

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    await this.findById(id);

    return this.prisma.appointment.update({
      where: { id },
      data: {
        doctor: dto.doctorId,
        service: dto.specialtyService,
        date: dto.appointmentDate,
        time: dto.timeSlot,
        status: dto.status,
        notes: dto.clinicalNotes,
      },
    });
  }

  async cancel(id: string) {
    await this.findById(id);
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async complete(id: string) {
    await this.findById(id);
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}
