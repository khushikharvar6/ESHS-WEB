import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      patientCount,
      inquiryCount,
      appointmentCount,
      todayAppointments,
      openNcsCount,
      revenueSummary,
    ] = await Promise.all([
      // Total patients
      this.prisma.patient.count({ where: { status: 'Active' } }),
      // Total inquiries
      this.prisma.inquiry.count(),
      // Total appointments
      this.prisma.appointment.count(),
      // Today's appointments count
      this.prisma.appointment.count(), // stub for date
      // Open NCs
      this.prisma.nonConformance.count({
        where: {
          status: { in: ['Open', 'In Progress'] },
        },
      }),
      // Revenue summary
      this.prisma.invoice.aggregate({
        _sum: {
          total: true,
          paid: true,
          balance: true,
        },
      }),
    ]);

    // Monthly revenue chart data (last 6 months)
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

  private aggregateMonthlyRevenue(invoices: any[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map = new Map<string, { month: string; billed: number; collected: number }>();

    // Prepopulate last 6 months
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
        const data = map.get(key)!;
        data.billed += Number(inv.total || 0);
        data.collected += Number(inv.paid || 0);
      }
    });

    return Array.from(map.values());
  }
}
