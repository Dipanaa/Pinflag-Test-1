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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMotorReglaDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateMotorReglaDto {
    tenantId;
    name;
    priority;
    minAmount;
    maxAmount;
    minWeight;
    maxWeight;
    maxDistanceMeters;
    allowedDeliveryTypes;
    targetCourier;
    isFreeShipping;
    shippingCostOverride;
    estimatedDays;
    isActive;
}
exports.CreateMotorReglaDto = CreateMotorReglaDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'El tenantId debe ser un UUID válido (versión 4)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tenantId es obligatorio' }),
    __metadata("design:type", String)
], CreateMotorReglaDto.prototype, "tenantId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio' }),
    (0, class_validator_1.MaxLength)(120, { message: 'El nombre no debe superar los 120 caracteres' }),
    __metadata("design:type", String)
], CreateMotorReglaDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'La prioridad debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { message: 'La prioridad debe ser positiva' }),
    __metadata("design:type", Number)
], CreateMotorReglaDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'minAmount debe ser un número con máximo 2 decimales' }),
    (0, class_validator_1.Min)(0, { message: 'minAmount debe ser mayor o igual a 0' }),
    __metadata("design:type", Number)
], CreateMotorReglaDto.prototype, "minAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'maxAmount debe ser un número con máximo 2 decimales' }),
    (0, class_validator_1.Min)(0, { message: 'maxAmount debe ser mayor o igual a 0' }),
    __metadata("design:type", Object)
], CreateMotorReglaDto.prototype, "maxAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'minWeight debe ser un número con máximo 2 decimales' }),
    (0, class_validator_1.Min)(0, { message: 'minWeight debe ser mayor o igual a 0' }),
    __metadata("design:type", Number)
], CreateMotorReglaDto.prototype, "minWeight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'maxWeight debe ser un número con máximo 2 decimales' }),
    (0, class_validator_1.Min)(0, { message: 'maxWeight debe ser mayor o igual a 0' }),
    __metadata("design:type", Object)
], CreateMotorReglaDto.prototype, "maxWeight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'maxDistanceMeters debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { message: 'maxDistanceMeters debe ser mayor o igual a 0' }),
    __metadata("design:type", Object)
], CreateMotorReglaDto.prototype, "maxDistanceMeters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'allowedDeliveryTypes debe ser un arreglo de cadenas' }),
    (0, class_validator_1.IsString)({
        each: true,
        message: 'Cada elemento en allowedDeliveryTypes debe ser una cadena de texto',
    }),
    (0, class_validator_1.MaxLength)(50, {
        each: true,
        message: 'Cada elemento en allowedDeliveryTypes no debe superar 50 caracteres',
    }),
    __metadata("design:type", Array)
], CreateMotorReglaDto.prototype, "allowedDeliveryTypes", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'targetCourier debe ser una cadena de texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'targetCourier es obligatorio' }),
    (0, class_validator_1.MaxLength)(50, { message: 'targetCourier no debe superar los 50 caracteres' }),
    __metadata("design:type", String)
], CreateMotorReglaDto.prototype, "targetCourier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)({ message: 'isFreeShipping debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], CreateMotorReglaDto.prototype, "isFreeShipping", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'shippingCostOverride debe ser un número con máximo 2 decimales' }),
    (0, class_validator_1.Min)(0, { message: 'shippingCostOverride debe ser mayor o igual a 0' }),
    __metadata("design:type", Object)
], CreateMotorReglaDto.prototype, "shippingCostOverride", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'estimatedDays debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { message: 'estimatedDays debe ser mayor o igual a 0' }),
    __metadata("design:type", Number)
], CreateMotorReglaDto.prototype, "estimatedDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)({ message: 'isActive debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], CreateMotorReglaDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-motor-regla.dto.js.map