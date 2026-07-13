import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { InvoiceCalculatorService } from './invoice-calculator.service';
import { InvoicePdfService } from './invoice-pdf.service';

@Module({
  controllers: [BillingController],
  providers: [BillingService, InvoiceCalculatorService, InvoicePdfService],
  exports: [BillingService, InvoicePdfService],
})
export class BillingModule {}
