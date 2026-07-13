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
exports.MrdController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mrd_service_1 = require("./mrd.service");
const mrd_dto_1 = require("./dto/mrd.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let MrdController = class MrdController {
    constructor(mrdService) {
        this.mrdService = mrdService;
    }
    async create(dto, userId) {
        return this.mrdService.create(dto, userId);
    }
    async findAll(page = 1, limit = 20, patientId, search) {
        return this.mrdService.findAll(page, limit, patientId, search);
    }
    async findById(id) {
        return this.mrdService.findById(id);
    }
    async update(id, dto) {
        return this.mrdService.update(id, dto);
    }
    async delete(id) {
        return this.mrdService.delete(id);
    }
};
exports.MrdController = MrdController;
__decorate([
    (0, common_1.Post)('records'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'MRD_STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new medical record' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mrd_dto_1.CreateMedicalRecordDto, String]),
    __metadata("design:returntype", Promise)
], MrdController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('records'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all medical records with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('patientId')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], MrdController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('records/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical record by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MrdController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)('records/:id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'MRD_STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a medical record' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mrd_dto_1.UpdateMedicalRecordDto]),
    __metadata("design:returntype", Promise)
], MrdController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('records/:id'),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN', 'ADMIN', 'MRD_STAFF'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a medical record' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MrdController.prototype, "delete", null);
exports.MrdController = MrdController = __decorate([
    (0, swagger_1.ApiTags)('MRD'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('mrd'),
    __metadata("design:paramtypes", [mrd_service_1.MrdService])
], MrdController);
//# sourceMappingURL=mrd.controller.js.map