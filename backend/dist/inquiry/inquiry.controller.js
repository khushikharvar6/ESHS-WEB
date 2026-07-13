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
exports.InquiryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inquiry_service_1 = require("./inquiry.service");
const create_inquiry_dto_1 = require("./dto/create-inquiry.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let InquiryController = class InquiryController {
    constructor(inquiryService) {
        this.inquiryService = inquiryService;
    }
    async create(dto, userId) {
        return this.inquiryService.create(dto, userId);
    }
    async findAll(page = 1, limit = 20, status, search) {
        return this.inquiryService.findAll(page, limit, status, search);
    }
    async findById(id) {
        return this.inquiryService.findById(id);
    }
    async update(id, dto) {
        return this.inquiryService.update(id, dto);
    }
    async convert(id, patientId) {
        return this.inquiryService.convert(id, patientId);
    }
    async markLost(id, lostReason) {
        return this.inquiryService.markLost(id, lostReason);
    }
};
exports.InquiryController = InquiryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new inquiry' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inquiry_dto_1.CreateInquiryDto, String]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List inquiries with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inquiry by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update inquiry' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_inquiry_dto_1.UpdateInquiryDto]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/convert'),
    (0, swagger_1.ApiOperation)({ summary: 'Convert inquiry to patient' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "convert", null);
__decorate([
    (0, common_1.Post)(':id/lost'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark inquiry as lost' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('lostReason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InquiryController.prototype, "markLost", null);
exports.InquiryController = InquiryController = __decorate([
    (0, swagger_1.ApiTags)('Inquiries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('inquiries'),
    __metadata("design:paramtypes", [inquiry_service_1.InquiryService])
], InquiryController);
//# sourceMappingURL=inquiry.controller.js.map