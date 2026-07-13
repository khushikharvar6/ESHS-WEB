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
exports.InquiryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InquiryService = class InquiryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
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
    async findAll(page = 1, limit = 20, status, search) {
        const skip = (page - 1) * limit;
        const where = {};
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
    async findById(id) {
        const inquiry = await this.prisma.inquiry.findUnique({
            where: { id },
        });
        if (!inquiry) {
            throw new common_1.NotFoundException(`Inquiry with id ${id} not found`);
        }
        return inquiry;
    }
    async update(id, dto) {
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
    async convert(id, patientId) {
        await this.findById(id);
        return this.prisma.inquiry.update({
            where: { id },
            data: {
                status: 'CONVERTED',
            },
        });
    }
    async markLost(id, lostReason) {
        await this.findById(id);
        return this.prisma.inquiry.update({
            where: { id },
            data: {
                status: 'LOST',
                notes: lostReason,
            },
        });
    }
};
exports.InquiryService = InquiryService;
exports.InquiryService = InquiryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InquiryService);
//# sourceMappingURL=inquiry.service.js.map