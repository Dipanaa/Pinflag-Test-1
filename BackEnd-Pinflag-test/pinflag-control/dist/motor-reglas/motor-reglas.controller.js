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
exports.MotorReglasController = void 0;
const common_1 = require("@nestjs/common");
const motor_reglas_service_1 = require("./motor-reglas.service");
const create_motor_regla_dto_1 = require("./dto/create-motor-regla.dto");
const update_motor_regla_dto_1 = require("./dto/update-motor-regla.dto");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
let MotorReglasController = class MotorReglasController {
    motorReglasService;
    constructor(motorReglasService) {
        this.motorReglasService = motorReglasService;
    }
    create(createMotorReglaDto) {
        return this.motorReglasService.create(createMotorReglaDto);
    }
    findAll(paginationDto) {
        return this.motorReglasService.findAll(paginationDto);
    }
    update(id, updateMotorReglaDto) {
        return this.motorReglasService.update(id, updateMotorReglaDto);
    }
    remove(id) {
        return this.motorReglasService.remove(id);
    }
};
exports.MotorReglasController = MotorReglasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_motor_regla_dto_1.CreateMotorReglaDto]),
    __metadata("design:returntype", void 0)
], MotorReglasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MotorReglasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_motor_regla_dto_1.UpdateMotorReglaDto]),
    __metadata("design:returntype", void 0)
], MotorReglasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MotorReglasController.prototype, "remove", null);
exports.MotorReglasController = MotorReglasController = __decorate([
    (0, common_1.Controller)('motor-reglas'),
    __metadata("design:paramtypes", [motor_reglas_service_1.MotorReglasService])
], MotorReglasController);
//# sourceMappingURL=motor-reglas.controller.js.map