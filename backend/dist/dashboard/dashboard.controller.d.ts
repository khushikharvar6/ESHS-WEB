import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
}
