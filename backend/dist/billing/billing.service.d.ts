import { PrismaService } from '../prisma/prisma.service';
import { InvoiceCalculatorService } from './invoice-calculator.service';
import { CreateInvoiceDto, RecordPaymentDto } from './dto/create-invoice.dto';
export declare class BillingService {
    private readonly prisma;
    private readonly calculator;
    constructor(prisma: PrismaService, calculator: InvoiceCalculatorService);
    createInvoice(dto: CreateInvoiceDto, userId?: string): Promise<any>;
    findAll(page?: number, limit?: number, status?: string, patientId?: string, search?: string): Promise<{
        data: never[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    findByInvoiceNumber(invoiceNumber: string): Promise<any>;
    recordPayment(invoiceId: string, dto: RecordPaymentDto, userId?: string): Promise<any>;
    cancelInvoice(id: string): Promise<any>;
    markDispatched(id: string, method: string): Promise<any>;
}
