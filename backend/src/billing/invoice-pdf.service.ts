import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicePdfService {
  private readonly logger = new Logger(InvoicePdfService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generatePdfBase64(invoiceId: string): Promise<string> {
    return Buffer.from('mock pdf content').toString('base64');
  }
}
