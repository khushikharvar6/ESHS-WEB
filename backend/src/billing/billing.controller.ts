import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { InvoicePdfService } from './invoice-pdf.service';
import { CreateInvoiceDto, RecordPaymentDto } from './dto/create-invoice.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Billing')
@ApiBearerAuth()
@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly pdfService: InvoicePdfService,
  ) {}

  @Post('invoices')
  @ApiOperation({ summary: 'Create new invoice' })
  async createInvoice(
    @Body() dto: CreateInvoiceDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.billingService.createInvoice(dto, userId);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List invoices with filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('patientId') patientId?: string,
    @Query('search') search?: string,
  ) {
    return this.billingService.findAll(page, limit, status, patientId, search);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  async findById(@Param('id') id: string) {
    return this.billingService.findById(id);
  }

  @Get('invoices/number/:invoiceNumber')
  @ApiOperation({ summary: 'Get invoice by invoice number' })
  async findByNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return this.billingService.findByInvoiceNumber(invoiceNumber);
  }

  @Post('invoices/:id/pay')
  @ApiOperation({ summary: 'Record payment for invoice' })
  async recordPayment(
    @Param('id') id: string,
    @Body() dto: RecordPaymentDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.billingService.recordPayment(id, dto, userId);
  }

  @Post('invoices/:id/cancel')
  @ApiOperation({ summary: 'Cancel invoice' })
  async cancel(@Param('id') id: string) {
    return this.billingService.cancelInvoice(id);
  }

  @Patch('invoices/:id/dispatch')
  @ApiOperation({ summary: 'Mark invoice report as dispatched' })
  async dispatch(
    @Param('id') id: string,
    @Body('method') method: string,
  ) {
    return this.billingService.markDispatched(id, method);
  }

  @Get('invoices/:id/pdf')
  @ApiOperation({ summary: 'Get invoice PDF as a Base64 encoded string' })
  async getInvoicePdf(@Param('id') id: string) {
    const base64 = await this.pdfService.generatePdfBase64(id);
    return { base64 };
  }
}
