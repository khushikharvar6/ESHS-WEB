"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const billing_service_1 = require("./billing.service");
const invoice_pdf_service_1 = require("./invoice-pdf.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let BillingController = class BillingController {
    constructor(billingService, pdfService) {
        this.billingService = billingService;
        this.pdfService = pdfService;
    }
    async createInvoice(dto, userId) {
        return this.billingService.createInvoice(dto, userId);
    }
    async findAll(page = 1, limit = 20, status, patientId, search) {
        return this.billingService.findAll(page, limit, status, patientId, search);
    }
    async findById(id) {
        return this.billingService.findById(id);
    }
    async findByNumber(invoiceNumber) {
        return this.billingService.findByInvoiceNumber(invoiceNumber);
    }
    async recordPayment(id, dto, userId) {
        return this.billingService.recordPayment(id, dto, userId);
    }
    async cancel(id) {
        return this.billingService.cancelInvoice(id);
    }
    async dispatch(id, method) {
        return this.billingService.markDispatched(id, method);
    }
    async getInvoicePdf(id) {
        const base64 = await this.pdfService.generatePdfBase64(id);
        return { base64 };
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('invoices'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new invoice' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('invoices'),
    (0, swagger_1.ApiOperation)({ summary: 'List invoices with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('patientId')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('invoices/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('invoices/number/:invoiceNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice by invoice number' }),
    __param(0, (0, common_1.Param)('invoiceNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Post)('invoices/:id/pay'),
    (0, swagger_1.ApiOperation)({ summary: 'Record payment for invoice' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_invoice_dto_1.RecordPaymentDto, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Post)('invoices/:id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel invoice' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)('invoices/:id/dispatch'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark invoice report as dispatched' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('method')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "dispatch", null);
__decorate([
    (0, common_1.Get)('invoices/:id/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice PDF as a Base64 encoded string' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getInvoicePdf", null);
exports.BillingController = BillingController = __decorate([
    (0, swagger_1.ApiTags)('Billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService,
        invoice_pdf_service_1.InvoicePdfService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map