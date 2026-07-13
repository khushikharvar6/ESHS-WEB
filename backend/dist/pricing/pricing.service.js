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
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PricingService = class PricingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTests(category, department, search) {
        const where = { isActive: true };
        if (category)
            where.category = category;
        if (department)
            where.department = department;
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        return this.prisma.testMaster.findMany({
            where,
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
    }
    async getTestById(id) {
        return this.prisma.testMaster.findUnique({ where: { id } });
    }
    async getServices() {
        return this.prisma.serviceMaster.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async getPackages() {
        return this.prisma.packageMaster.findMany({
            where: { isActive: true },
            include: {
                items: {
                    include: { test: true },
                },
            },
            orderBy: { price: 'asc' },
        });
    }
    async getPackageById(id) {
        return this.prisma.packageMaster.findUnique({
            where: { id },
            include: {
                items: {
                    include: { test: true },
                },
            },
        });
    }
    async getTestCategories() {
        const tests = await this.prisma.testMaster.findMany({
            where: { isActive: true },
            select: { category: true, subcategory: true },
            distinct: ['category', 'subcategory'],
        });
        return tests;
    }
    async searchItems(query) {
        const [tests, packages, services] = await Promise.all([
            this.prisma.testMaster.findMany({
                where: {
                    isActive: true,
                    name: { contains: query, mode: 'insensitive' },
                },
                take: 20,
            }),
            this.prisma.packageMaster.findMany({
                where: {
                    isActive: true,
                    name: { contains: query, mode: 'insensitive' },
                },
                take: 10,
            }),
            this.prisma.serviceMaster.findMany({
                where: {
                    isActive: true,
                    name: { contains: query, mode: 'insensitive' },
                },
                take: 10,
            }),
        ]);
        return { tests, packages, services };
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map