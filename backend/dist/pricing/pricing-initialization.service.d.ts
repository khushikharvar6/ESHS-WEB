import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class PricingInitializationService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    initializeAllPrices(): Promise<void>;
    private initializeTestMaster;
    private getXrayRecords;
    private initializeServiceMaster;
    private initializePackages;
    private initializeDoctors;
}
