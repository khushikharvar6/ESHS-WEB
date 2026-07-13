import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        summary: {
            patients: number;
            inquiries: number;
            appointments: number;
            todayAppointments: number;
            openNcs: number;
            collectedRevenue: number;
            dueRevenue: number;
            totalRevenue: number;
        };
        monthlyRevenue: {
            month: string;
            billed: number;
            collected: number;
        }[];
    }>;
    private aggregateMonthlyRevenue;
}
