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
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DoctorsService = class DoctorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
    async findById(id) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { id },
        });
        if (!doctor) {
            throw new common_1.NotFoundException(`Doctor with id ${id} not found`);
        }
        return doctor;
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.doctor.update({
            where: { id },
            data: dto,
        });
    }
    async deactivate(id) {
        await this.findById(id);
        return this.prisma.doctor.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map