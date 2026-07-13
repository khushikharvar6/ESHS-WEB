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
exports.NcController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nc_service_1 = require("./nc.service");
const nc_dto_1 = require("./dto/nc.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let NcController = class NcController {
    constructor(ncService) {
        this.ncService = ncService;
    }
    async create(dto, userId) {
        return this.ncService.create(dto, userId);
    }
    async findAll(page = 1, limit = 20, status, severity, patientId) {
        return this.ncService.findAll(page, limit, status, severity, patientId);
    }
    async findById(id) {
        return this.ncService.findById(id);
    }
    async resolve(id, dto, userId) {
        return this.ncService.resolve(id, dto, userId);
    }
    async close(id) {
        return this.ncService.close(id);
    }
};
exports.NcController = NcController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'QA_MANAGER', 'FRONT_OFFICE', 'BILLING_STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Log a new non-conformance (NC)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nc_dto_1.CreateNcDto, String]),
    __metadata("design:returntype", Promise)
], NcController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all NC logs with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('severity')),
    __param(4, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], NcController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NC log by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NcController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'QA_MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve a non-conformance' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, nc_dto_1.ResolveNcDto, String]),
    __metadata("design:returntype", Promise)
], NcController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'QA_MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Close a non-conformance log' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NcController.prototype, "close", null);
exports.NcController = NcController = __decorate([
    (0, swagger_1.ApiTags)('NC'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('nc'),
    __metadata("design:paramtypes", [nc_service_1.NcService])
], NcController);
//# sourceMappingURL=nc.controller.js.map