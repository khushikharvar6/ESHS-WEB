import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async getTests(category?: string, department?: string, search?: string) {
    const where: any = { isActive: true };
    if (category) where.category = category;
    if (department) where.department = department;
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.testMaster.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async getTestById(id: string) {
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

  async getPackageById(id: string) {
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

  async searchItems(query: string) {
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
}
