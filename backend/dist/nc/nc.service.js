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
exports.NcService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NcService = class NcService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        return this.prisma.nonConformance.create({
            data: {
                uhid: dto.patientId || '',
                patient: dto.patientId || '',
                department: '',
                description: dto.description,
                severity: dto.severity || 'Minor',
                status: dto.status || 'Open',
                updatedBy: userId,
            },
        });
    }
    async findAll(page = 1, limit = 20, status, severity, patientId) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (severity)
            where.severity = severity;
        if (patientId)
            where.uhid = patientId;
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
    async findById(id) {
        const nc = await this.prisma.nonConformance.findUnique({
            where: { id },
        });
        if (!nc) {
            throw new common_1.NotFoundException(`NC record with id ${id} not found`);
        }
        return nc;
    }
    async resolve(id, dto, userId) {
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
    async close(id) {
        await this.findById(id);
        return this.prisma.nonConformance.update({
            where: { id },
            data: {
                status: 'CLOSED',
            },
        });
    }
};
exports.NcService = NcService;
exports.NcService = NcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NcService);
//# sourceMappingURL=nc.service.js.map