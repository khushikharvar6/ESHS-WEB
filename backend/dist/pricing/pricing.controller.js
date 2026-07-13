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
exports.PricingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pricing_service_1 = require("./pricing.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PricingController = class PricingController {
    constructor(pricingService) {
        this.pricingService = pricingService;
    }
    async getTests(category, department, search) {
        return this.pricingService.getTests(category, department, search);
    }
    async getTestById(id) {
        return this.pricingService.getTestById(id);
    }
    async getServices() {
        return this.pricingService.getServices();
    }
    async getPackages() {
        return this.pricingService.getPackages();
    }
    async getPackageById(id) {
        return this.pricingService.getPackageById(id);
    }
    async getCategories() {
        return this.pricingService.getTestCategories();
    }
    async search(query) {
        return this.pricingService.searchItems(query);
    }
};
exports.PricingController = PricingController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('tests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all test prices' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'department', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('department')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getTests", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('tests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get test by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getTestById", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all service prices' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getServices", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('packages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all packages with items' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getPackages", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('packages/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get package by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getPackageById", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all test categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search across tests, packages, and services' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricingController.prototype, "search", null);
exports.PricingController = PricingController = __decorate([
    (0, swagger_1.ApiTags)('Pricing'),
    (0, common_1.Controller)('pricing'),
    __metadata("design:paramtypes", [pricing_service_1.PricingService])
], PricingController);
//# sourceMappingURL=pricing.controller.js.map