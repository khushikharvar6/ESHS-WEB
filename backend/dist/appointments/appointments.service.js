"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AppointmentsService = class AppointmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        return this.prisma.appointment.create({
            data: {
                firstName: dto.uhid || '',
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
    async findAll(page = 1, limit = 20, status, date, doctorId, department) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (doctorId)
            where.doctor = doctorId;
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
    async findById(id) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with id ${id} not found`);
        }
        return appointment;
    }
    async update(id, dto) {
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
    async cancel(id) {
        await this.findById(id);
        return this.prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
    async complete(id) {
        await this.findById(id);
        return this.prisma.appointment.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map