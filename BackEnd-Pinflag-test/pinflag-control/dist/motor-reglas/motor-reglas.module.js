"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotorReglasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const motor_regla_entity_1 = require("./entities/motor-regla.entity");
const motor_reglas_service_1 = require("./motor-reglas.service");
const motor_reglas_controller_1 = require("./motor-reglas.controller");
let MotorReglasModule = class MotorReglasModule {
};
exports.MotorReglasModule = MotorReglasModule;
exports.MotorReglasModule = MotorReglasModule = __decorate([
    (0, common_1.Module)({
        controllers: [motor_reglas_controller_1.MotorReglasController],
        providers: [motor_reglas_service_1.MotorReglasService],
        imports: [typeorm_1.TypeOrmModule.forFeature([motor_regla_entity_1.MotorRegla])],
        exports: [motor_reglas_service_1.MotorReglasService]
    })
], MotorReglasModule);
//# sourceMappingURL=motor-reglas.module.js.map