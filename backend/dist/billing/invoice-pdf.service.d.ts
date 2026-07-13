import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicePdfService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generatePdfBase64(invoiceId: string): Promise<string>;
}
