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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [patientCount, inquiryCount, appointmentCount, todayAppointments, openNcsCount, revenueSummary,] = await Promise.all([
            this.prisma.patient.count(),
            Promise.resolve(0),
            this.prisma.appointment.count(),
            this.prisma.appointment.count(),
            this.prisma.nonConformance.count({
                where: {
                    status: { in: ['Open', 'In Progress'] },
                },
            }),
            this.prisma.invoice.aggregate({
                _sum: {
                    total: true,
                    paid: true,
                    balance: true,
                },
            }),
        ]);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const invoices = await this.prisma.invoice.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
                status: { not: 'Draft' },
            },
            select: {
                total: true,
                paid: true,
                createdAt: true,
            },
        });
        const monthlyRevenue = this.aggregateMonthlyRevenue(invoices);
        return {
            summary: {
                patients: patientCount,
                inquiries: inquiryCount,
                appointments: appointmentCount,
                todayAppointments: 0,
                openNcs: openNcsCount,
                collectedRevenue: Number(revenueSummary._sum?.paid || 0),
                dueRevenue: Number(revenueSummary._sum?.balance || 0),
                totalRevenue: Number(revenueSummary._sum?.total || 0),
            },
            monthlyRevenue,
        };
    }
    aggregateMonthlyRevenue(invoices) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const map = new Map();
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            map.set(key, {
                month: `${months[d.getMonth()]} ${d.getFullYear()}`,
                billed: 0,
                collected: 0,
            });
        }
        invoices.forEach((inv) => {
            const date = new Date(inv.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (map.has(key)) {
                const data = map.get(key);
                data.billed += Number(inv.total || 0);
                data.collected += Number(inv.paid || 0);
            }
        });
        return Array.from(map.values());
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map