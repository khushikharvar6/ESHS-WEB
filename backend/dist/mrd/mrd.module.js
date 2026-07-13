"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrdModule = void 0;
const common_1 = require("@nestjs/common");
const mrd_service_1 = require("./mrd.service");
const mrd_controller_1 = require("./mrd.controller");
let MrdModule = class MrdModule {
};
exports.MrdModule = MrdModule;
exports.MrdModule = MrdModule = __decorate([
    (0, common_1.Module)({
        controllers: [mrd_controller_1.MrdController],
        providers: [mrd_service_1.MrdService],
        exports: [mrd_service_1.MrdService],
    })
], MrdModule);
//# sourceMappingURL=mrd.module.js.map