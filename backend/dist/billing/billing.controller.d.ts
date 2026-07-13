import { BillingService } from './billing.service';
import { InvoicePdfService } from './invoice-pdf.service';
import { CreateInvoiceDto, RecordPaymentDto } from './dto/create-invoice.dto';
export declare class BillingController {
    private readonly billingService;
    private readonly pdfService;
    constructor(billingService: BillingService, pdfService: InvoicePdfService);
    createInvoice(dto: CreateInvoiceDto, userId: string): Promise<any>;
    findAll(page?: number, limit?: number, status?: string, patientId?: string, search?: string): Promise<{
        data: never[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    findByNumber(invoiceNumber: string): Promise<any>;
    recordPayment(id: string, dto: RecordPaymentDto, userId: string): Promise<any>;
    cancel(id: string): Promise<any>;
    dispatch(id: string, method: string): Promise<any>;
    getInvoicePdf(id: string): Promise<{
        base64: string;
    }>;
}
